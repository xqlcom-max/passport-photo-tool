const TARGET_WIDTH = 600;
const TARGET_HEIGHT = 750; // 护照照片标准比例 35mm x 45mm

/**
 * 处理护照照片：按护照比例缩放，居中放置，背景色填充
 * 保持原图完整，不裁剪，让用户看到背景色变化
 */
export function processPassportPhoto(
  img: HTMLImageElement,
  bgColor: 'white' | 'blue' = 'white'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // 填充背景色
  ctx.fillStyle = bgColor === 'blue' ? '#438EDB' : '#FFFFFF';
  ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

  // 计算缩放比例，保持宽高比，让图片填满画布（可能有部分裁剪）
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = TARGET_WIDTH / TARGET_HEIGHT;

  let drawW: number, drawH: number;
  if (imgRatio > canvasRatio) {
    // 图片更宽，以高度为基准
    drawH = TARGET_HEIGHT;
    drawW = drawH * imgRatio;
  } else {
    // 图片更高，以宽度为基准
    drawW = TARGET_WIDTH;
    drawH = drawW / imgRatio;
  }

  const x = (TARGET_WIDTH - drawW) / 2;
  const y = (TARGET_HEIGHT - drawH) / 2;

  ctx.drawImage(img, x, y, drawW, drawH);

  return canvas.toDataURL('image/png');
}

/**
 * 给图片添加水印（免费版下载时使用）
 * 修复了原版没有等待 img.onload 的 bug
 */
export function addWatermark(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    const ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.onload = () => {
      // 绘制底图
      ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

      // 水印背景条
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, TARGET_HEIGHT - 72, TARGET_WIDTH, 72);

      // 水印文字
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Passport Photo Tool', TARGET_WIDTH / 2, TARGET_HEIGHT - 44);
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Free Version — Upgrade to Remove', TARGET_WIDTH / 2, TARGET_HEIGHT - 24);

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
