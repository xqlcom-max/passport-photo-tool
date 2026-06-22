/**
 * 前端背景移除工具
 *
 * 使用 @imgly/background-removal 在浏览器端本地处理
 * 完全免费，无需 API Key
 * 优化边缘处理，使扣图效果更自然
 */

import { removeBackground } from '@imgly/background-removal';

/**
 * 移除图片背景
 * @param imageData 图片的 base64 数据或 URL
 * @returns 处理后的图片 base64 数据
 */
export async function removeImageBackground(imageData: string): Promise<string> {
  console.log('Starting browser-based background removal...');

  // 将 base64 转换为 Blob
  const response = await fetch(imageData);
  const blob = await response.blob();

  // 调用本地背景移除
  const result = await removeBackground(blob, {
    output: {
      format: 'image/png',
    },
    progress: (key, current, total) => {
      console.log(`Progress: ${key} - ${Math.round((current / total) * 100)}%`);
    },
  });

  console.log('Background removal completed');

  // 将 Blob 转换为 base64
  const arrayBuffer = await result.arrayBuffer();
  const base64 = `data:image/png;base64,${arrayBufferToBase64(arrayBuffer)}`;

  // 优化边缘处理
  const optimizedBase64 = await optimizeEdges(base64);

  return optimizedBase64;
}

/**
 * 优化边缘处理，减少锯齿和边
 * 使用边缘羽化技术使扣图更自然
 */
async function optimizeEdges(imageDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      // 绘制原图
      ctx.drawImage(img, 0, 0);

      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 创建边缘蒙版
      const edgeMask = new Uint8Array(canvas.width * canvas.height);

      // 检测边缘（alpha 通道变化的地方）
      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          const idx = (y * canvas.width + x) * 4;
          const alpha = data[idx + 3];

          // 检查周围的像素
          const neighbors = [
            data[((y - 1) * canvas.width + x) * 4 + 3], // 上
            data[((y + 1) * canvas.width + x) * 4 + 3], // 下
            data[(y * canvas.width + (x - 1)) * 4 + 3], // 左
            data[(y * canvas.width + (x + 1)) * 4 + 3], // 右
          ];

          // 如果当前像素是半透明的，且周围有不透明的像素，则认为是边缘
          if (alpha > 0 && alpha < 255) {
            const maxNeighbor = Math.max(...neighbors);
            const minNeighbor = Math.min(...neighbors);
            if (maxNeighbor - minNeighbor > 50) {
              edgeMask[y * canvas.width + x] = 1;
            }
          }
        }
      }

      // 对边缘进行羽化处理
      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          if (edgeMask[y * canvas.width + x] === 1) {
            const idx = (y * canvas.width + x) * 4;

            // 计算周围像素的平均值
            let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
            let count = 0;

            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const neighborIdx = ((y + dy) * canvas.width + (x + dx)) * 4;
                sumR += data[neighborIdx];
                sumG += data[neighborIdx + 1];
                sumB += data[neighborIdx + 2];
                sumA += data[neighborIdx + 3];
                count++;
              }
            }

            // 应用高斯模糊效果
            const blurFactor = 0.3; // 模糊强度
            data[idx] = data[idx] * (1 - blurFactor) + (sumR / count) * blurFactor;
            data[idx + 1] = data[idx + 1] * (1 - blurFactor) + (sumG / count) * blurFactor;
            data[idx + 2] = data[idx + 2] * (1 - blurFactor) + (sumB / count) * blurFactor;
            data[idx + 3] = data[idx + 3] * (1 - blurFactor) + (sumA / count) * blurFactor;
          }
        }
      }

      // 将处理后的图像数据放回画布
      ctx.putImageData(imageData, 0, 0);

      // 返回优化后的图片
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageDataUrl;
  });
}

/**
 * ArrayBuffer 转 base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
