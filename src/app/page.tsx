'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import UploadZone from '@/components/UploadZone';
import Processing from '@/components/Processing';
import Preview from '@/components/Preview';
import PaymentModal from '@/components/PaymentModal';
import Features from '@/components/Features';
import BeforeAfter from '@/components/BeforeAfter';
import TrustSection from '@/components/TrustSection';
import Footer from '@/components/Footer';
import { processPassportPhoto, addWatermark, downloadImage, loadImage, getPassportExportMeta } from '@/lib/imageProcessing';
import { removeImageBackground } from '@/lib/backgroundRemoval';
import { initFaceLandmarker, detectFace } from '@/lib/face/mediapipeFaceDetector';
import { calculateFaceMetrics } from '@/lib/face/faceMetrics';
import { runComplianceCheck } from '@/lib/compliance/complianceChecker';
import type { ComplianceResult } from '@/lib/compliance/types';
import type { FaceDetectionResult, FaceMetrics } from '@/lib/face/types';

type AppState = 'idle' | 'processing' | 'preview';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [originalDataUrl, setOriginalDataUrl] = useState('');
  const [processedDataUrl, setProcessedDataUrl] = useState('');
  const [currentBg, setCurrentBg] = useState<'white' | 'blue'>('white');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [bgRemovedDataUrl, setBgRemovedDataUrl] = useState('');
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [watermarkedDataUrl, setWatermarkedDataUrl] = useState('');

  // 合规检测结果
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);
  const [faceDetection, setFaceDetection] = useState<FaceDetectionResult | null>(null);
  const [faceMetrics, setFaceMetrics] = useState<FaceMetrics | null>(null);

  // 检查是否刚从 Gumroad 返回（URL 中有 job_id 参数）
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const returnedJobId = urlParams.get('job_id');
    if (returnedJobId) {
      setCurrentJobId(returnedJobId);
      setAppState('preview');
      // 清理 URL 参数
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // 自动轮询支付状态（当有 pending 的 jobId 时）
  useEffect(() => {
    if (!currentJobId || appState !== 'preview') return;

    let retryCount = 0;
    const maxRetries = 12; // 最多轮询 12 次（约 1 分钟）

    const checkPayment = async () => {
      try {
        const response = await fetch(`/api/status/${currentJobId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'paid') {
            // 支付成功，自动下载（通过 downloadImage 注入 300 DPI）
            if (data.imageData) {
              await downloadImage(data.imageData, data.filename || 'passport-photo-hd.png');
            }
            return; // 停止轮询
          }
        }
      } catch (error) {
        console.error('Payment status check failed:', error);
      }

      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(checkPayment, 5000); // 每 5 秒检查一次
      }
    };

    // 开始轮询
    const timer = setTimeout(checkPayment, 2000); // 首次延迟 2 秒
    return () => clearTimeout(timer);
  }, [currentJobId, appState]);

  // 页面加载时初始化 MediaPipe 模型
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('正在加载 MediaPipe Face Landmarker 模型...');
        await initFaceLandmarker((status) => {
          console.log('MediaPipe 加载状态:', status);
        });
        setIsModelLoading(false);
        console.log('✅ MediaPipe Face Landmarker 加载完成');
      } catch (error) {
        console.error('MediaPipe 加载失败:', error);
        setModelError(error instanceof Error ? error.message : '模型加载失败');
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, []);

  const handleFileSelect = async (file: File) => {
    // 检查模型是否已加载
    if (isModelLoading) {
      alert('人脸检测模型正在加载中，请稍候...');
      return;
    }

    if (modelError) {
      alert('人脸检测模型加载失败：' + modelError + '\n将使用基础裁剪功能。');
      // 允许继续，但会降级到基础裁剪
    }

    // 读取文件为 data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setOriginalDataUrl(dataUrl);

      // 生成唯一的 jobId
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setCurrentJobId(jobId);

      // 使用浏览器端 AI 背景移除
      setAppState('processing');
      try {
        // 在浏览器端进行背景移除
        const bgRemovedUrl = await removeImageBackground(dataUrl);
        setBgRemovedDataUrl(bgRemovedUrl); // 保存背景移除后的结果

        // 处理护照照片尺寸（现在是异步函数）
        const img = await loadImage(bgRemovedUrl);
        const processed = await processPassportPhoto(img, currentBg);
        setProcessedDataUrl(processed);

        // 生成带水印的预览图
        const watermarked = await addWatermark(processed);
        setWatermarkedDataUrl(watermarked);

        // 运行合规检测（在原始图片上）
        const originalImg = await loadImage(dataUrl);
        try {
          const detection = detectFace(originalImg);
          setFaceDetection(detection);

          if (detection.detected) {
            const metrics = calculateFaceMetrics(detection, originalImg.naturalWidth, originalImg.naturalHeight);
            setFaceMetrics(metrics);
          }

          const compliance = runComplianceCheck(
            detection,
            detection.detected ? calculateFaceMetrics(detection, originalImg.naturalWidth, originalImg.naturalHeight) : null,
            originalImg,
            originalImg.naturalWidth,
            originalImg.naturalHeight
          );
          setComplianceResult(compliance);
          console.log('合规检测结果:', compliance);
        } catch (faceErr) {
          console.warn('人脸检测失败:', faceErr);
          // 人脸检测失败不阻止流程，只是不显示检测结果
        }

        setAppState('preview');
      } catch (err) {
        // AI 处理失败，降级到本地 Canvas 处理（不移除背景）
        console.warn('AI 背景移除失败，使用本地处理:', err);
        setBgRemovedDataUrl(''); // 清空背景移除结果
        try {
          const img = await loadImage(dataUrl);
          const processed = await processPassportPhoto(img, currentBg);
          setProcessedDataUrl(processed);

          // 生成带水印的预览图
          const watermarked = await addWatermark(processed);
          setWatermarkedDataUrl(watermarked);

          // 尝试运行合规检测
          try {
            const detection = detectFace(img);
            setFaceDetection(detection);

            if (detection.detected) {
              const metrics = calculateFaceMetrics(detection, img.naturalWidth, img.naturalHeight);
              setFaceMetrics(metrics);
            }

            const compliance = runComplianceCheck(
              detection,
              detection.detected ? calculateFaceMetrics(detection, img.naturalWidth, img.naturalHeight) : null,
              img,
              img.naturalWidth,
              img.naturalHeight
            );
            setComplianceResult(compliance);
          } catch (faceErr) {
            console.warn('人脸检测失败:', faceErr);
          }

          setAppState('preview');
        } catch (fallbackErr) {
          console.error('处理图片失败:', fallbackErr);
          alert('处理图片失败: ' + (fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)));
          setAppState('idle');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBgChange = async (bg: 'white' | 'blue') => {
    if (bg === currentBg) return;
    setCurrentBg(bg);

    // 如果有背景移除后的结果，直接使用它重新处理
    if (bgRemovedDataUrl) {
      try {
        const img = await loadImage(bgRemovedDataUrl);
        const processed = await processPassportPhoto(img, bg);
        setProcessedDataUrl(processed);
        // 重新生成水印
        const watermarked = await addWatermark(processed);
        setWatermarkedDataUrl(watermarked);
        return;
      } catch (err) {
        console.error('重新处理图片失败:', err);
      }
    }

    // 如果没有背景移除结果，使用原图处理
    if (originalDataUrl) {
      const img = await loadImage(originalDataUrl);
      const processed = await processPassportPhoto(img, bg);
      setProcessedDataUrl(processed);
      // 重新生成水印
      const watermarked = await addWatermark(processed);
      setWatermarkedDataUrl(watermarked);
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
      const response = await fetch(`/api/status/${currentJobId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'paid' && data.imageData) {
          // 已支付，通过 downloadImage 注入 300 DPI 后下载
          await downloadImage(data.imageData, data.filename || 'passport-photo-hd.png');
        } else if (data.status === 'pending') {
          // 未支付，打开支付弹窗
          setIsModalOpen(true);
        } else {
          alert('Download failed. Please try again.');
        }
      } else {
        // 未支付，打开支付弹窗
        setIsModalOpen(true);
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
      // 第一步：保存图片数据到 Redis
      const jobResponse = await fetch('/api/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: currentJobId,
          imageData: processedDataUrl,
        }),
      });

      if (!jobResponse.ok) {
        const jobError = await jobResponse.json();
        throw new Error(jobError.error || 'Failed to save job');
      }

      // 第二步：获取 Gumroad 支付链接
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: currentJobId,
        }),
      });

      const data = await checkoutResponse.json();

      if (checkoutResponse.ok && data.checkoutUrl) {
        // 跳转到 Gumroad 支付页面
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

        <BeforeAfter />

        <UploadZone onFileSelect={handleFileSelect} />

        {appState === 'processing' && <Processing />}

        {appState === 'preview' && (
          <div className="max-w-4xl mx-auto px-4">
            <Preview
              originalDataUrl={originalDataUrl}
              processedDataUrl={processedDataUrl}
              watermarkedDataUrl={watermarkedDataUrl}
              currentBg={currentBg}
              onBgChange={handleBgChange}
              onFreeDownload={handleFreeDownload}
              onPaidDownload={handlePaidDownload}
            />
          </div>
        )}

        <Features />

        <TrustSection />
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
