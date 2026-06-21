'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import UploadZone from '@/components/UploadZone';
import Processing from '@/components/Processing';
import Preview from '@/components/Preview';
import PaymentModal from '@/components/PaymentModal';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { processPassportPhoto, addWatermark, downloadImage, loadImage } from '@/lib/imageProcessing';

type AppState = 'idle' | 'processing' | 'preview';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [originalDataUrl, setOriginalDataUrl] = useState('');
  const [processedDataUrl, setProcessedDataUrl] = useState('');
  const [currentBg, setCurrentBg] = useState<'white' | 'blue'>('white');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleFileSelect = async (file: File) => {
    // 读取文件为 data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setOriginalDataUrl(dataUrl);

      // 生成唯一的 jobId
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setCurrentJobId(jobId);

      // 处理图片
      setAppState('processing');
      try {
        const img = await loadImage(dataUrl);
        const processed = processPassportPhoto(img, currentBg);
        setProcessedDataUrl(processed);
        setAppState('preview');
      } catch (err) {
        console.error('处理图片失败:', err);
        alert('Failed to process image. Please try another photo.');
        setAppState('idle');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBgChange = async (bg: 'white' | 'blue') => {
    if (bg === currentBg) return;
    setCurrentBg(bg);

    // 重新处理图片
    if (originalDataUrl) {
      try {
        const img = await loadImage(originalDataUrl);
        const processed = processPassportPhoto(img, bg);
        setProcessedDataUrl(processed);
      } catch (err) {
        console.error('重新处理图片失败:', err);
      }
    }
  };

  const handleFreeDownload = async () => {
    if (!processedDataUrl) return;
    try {
      const watermarked = await addWatermark(processedDataUrl);
      downloadImage(watermarked, 'passport-photo-free.png');
    } catch (err) {
      console.error('添加水印失败:', err);
      // 降级：直接下载无水印版本
      downloadImage(processedDataUrl, 'passport-photo-free.png');
    }
  };

  const handlePaidDownload = async () => {
    if (!currentJobId) return;

    // 调用后端验证支付状态
    try {
      const response = await fetch(`/api/download/${currentJobId}`);
      if (response.ok) {
        // 已支付，直接下载
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'passport-photo-hd.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (response.status === 403) {
        // 未支付，打开支付弹窗
        setIsModalOpen(true);
      } else {
        alert('Download failed. Please try again.');
      }
    } catch (error) {
      console.error('Download check failed:', error);
      // 出错时也打开支付弹窗
      setIsModalOpen(true);
    }
  };

  const handleCheckout = async () => {
    if (!currentJobId || isCheckingOut) return;

    setIsCheckingOut(true);
    try {
      // 第一步：上传图片到后端
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: currentJobId,
          imageData: processedDataUrl,
        }),
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json();
        throw new Error(uploadError.error || 'Failed to upload image');
      }

      // 第二步：创建 checkout session
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: currentJobId,
          filename: 'passport-photo-hd.png',
        }),
      });

      const data = await checkoutResponse.json();

      if (checkoutResponse.ok && data.checkoutUrl) {
        // 跳转到 Lemon Squeezy 支付页面
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Payment service is unavailable. Please try again later.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleGetStarted = () => {
    document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero onGetStarted={handleGetStarted} />

        <UploadZone onFileSelect={handleFileSelect} />

        {appState === 'processing' && <Processing />}

        {appState === 'preview' && (
          <Preview
            originalDataUrl={originalDataUrl}
            processedDataUrl={processedDataUrl}
            currentBg={currentBg}
            onBgChange={handleBgChange}
            onFreeDownload={handleFreeDownload}
            onPaidDownload={handlePaidDownload}
          />
        )}

        <Features />
      </main>
      <Footer />

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCheckout={handleCheckout}
        isLoading={isCheckingOut}
      />
    </>
  );
}
