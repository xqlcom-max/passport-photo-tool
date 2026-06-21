const TARGET_SIZE = 600;

/**
 * 处理护照照片：居中裁剪为正方形，调整到目标尺寸
 * 这是基础版本，不做 AI 抠图（美国护照要求原始照片）
 */
export function processPassportPhoto(
  img: HTMLImageElement,
  bgColor: 'white' | 'blue' = 'white'
): string {
  // 步骤1：居中裁剪为正方形
  const size = Math.min(img.naturalWidth, img.naturalHeight);
  const offsetX = (img.naturalWidth - size) / 2;
  const offsetY = (img.naturalHeight - size) / 2;

  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = size;
  cropCanvas.height = size;
  const cropCtx = cropCanvas.getContext('2d')!;
  cropCtx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

  // 步骤2：调整到护照尺寸，填充背景色
  const passportCanvas = document.createElement('canvas');
  passportCanvas.width = TARGET_SIZE;
  passportCanvas.height = TARGET_SIZE;
  const ctx = passportCanvas.getContext('2d')!;

  // 填充背景色
  ctx.fillStyle = bgColor === 'blue' ? '#438EDB' : '#FFFFFF';
  ctx.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);

  // 绘制图片，保持宽高比居中
  const ratio = Math.min(TARGET_SIZE / size, TARGET_SIZE / size);
  const w = size * ratio;
  const h = size * ratio;
  const x = (TARGET_SIZE - w) / 2;
  const y = (TARGET_SIZE - h) / 2;
  ctx.drawImage(cropCanvas, x, y, w, h);

  return passportCanvas.toDataURL('image/png');
}

/**
 * 给图片添加水印（免费版下载时使用）
 * 修复了原版没有等待 img.onload 的 bug
 */
export function addWatermark(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = TARGET_SIZE;
    canvas.height = TARGET_SIZE;
    const ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.onload = () => {
      // 绘制底图
      ctx.drawImage(img, 0, 0, TARGET_SIZE, TARGET_SIZE);

      // 水印背景条
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, TARGET_SIZE - 72, TARGET_SIZE, 72);

      // 水印文字
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Passport Photo Tool', TARGET_SIZE / 2, TARGET_SIZE - 44);
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Free Version — Upgrade to Remove', TARGET_SIZE / 2, TARGET_SIZE - 24);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image for watermark'));
    img.src = dataUrl;
  });
}

/**
 * 下载图片
 */
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 加载图片并返回 Promise
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}
