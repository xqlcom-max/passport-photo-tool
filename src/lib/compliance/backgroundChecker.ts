/**
 * 背景检测项
 */

import type { CheckResult } from './types';
import { BACKGROUND_STANDARDS } from '../passport/usPassportStandards';

/**
 * 检查背景是否接近纯白
 * 注意：这个函数在去背景之前调用，检测原始背景
 */
export function checkBackground(
  image: HTMLImageElement | HTMLCanvasElement
): CheckResult {
  try {
    const bgColor = sampleBackgroundColor(image);

    if (bgColor.isWhite) {
      return {
        name: 'Background Color',
        icon: '✅',
        status: 'pass',
        message: '背景为白色',
        actualValue: `RGB(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
      };
    }

    if (bgColor.isLight) {
      return {
        name: 'Background Color',
        icon: '⚠️',
        status: 'warning',
        message: '背景较浅，但不是纯白',
        actualValue: `RGB(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
        expectedValue: '白色背景',
      };
    }

    return {
      name: 'Background Color',
      icon: '❌',
      status: 'fail',
      message: '背景不是白色，需要去背景处理',
      actualValue: `RGB(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
      expectedValue: '白色背景',
    };
  } catch {
    return {
      name: 'Background Color',
      icon: '⚠️',
      status: 'warning',
      message: '无法检测背景颜色',
    };
  }
}

/**
 * 检查背景是否有阴影
 */
export function checkShadows(
  image: HTMLImageElement | HTMLCanvasElement
): CheckResult {
  try {
    const shadowResult = detectShadows(image);

    if (shadowResult.hasNoShadow) {
      return {
        name: 'Shadows',
        icon: '✅',
        status: 'pass',
        message: '无明显阴影',
      };
    }

    if (shadowResult.severity === 'light') {
      return {
        name: 'Shadows',
        icon: '⚠️',
        status: 'warning',
        message: '有轻微阴影',
        actualValue: `阴影面积: ${shadowResult.shadowArea}%`,
      };
    }

    return {
      name: 'Shadows',
      icon: '❌',
      status: 'fail',
      message: '有明显阴影，请在光线均匀的地方拍摄',
      actualValue: `阴影面积: ${shadowResult.shadowArea}%`,
    };
  } catch {
    return {
      name: 'Shadows',
      icon: '⚠️',
      status: 'warning',
      message: '无法检测阴影',
    };
  }
}

/**
 * 采样背景颜色
 * 从图片四个角落采样，取平均值
 */
function sampleBackgroundColor(
  image: HTMLImageElement | HTMLCanvasElement
): { r: number; g: number; b: number; isWhite: boolean; isLight: boolean } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const sampleSize = 50; // 采样区域大小
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  // 采样四个角落
  const corners = [
    { x: 10, y: 10 },                          // 左上
    { x: image.width - sampleSize - 10, y: 10 }, // 右上
    { x: 10, y: image.height - sampleSize - 10 }, // 左下
    { x: image.width - sampleSize - 10, y: image.height - sampleSize - 10 }, // 右下
  ];

  let totalR = 0, totalG = 0, totalB = 0;

  for (const corner of corners) {
    const imageData = ctx.getImageData(corner.x, corner.y, sampleSize, sampleSize);
    const data = imageData.data;

    let cornerR = 0, cornerG = 0, cornerB = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      cornerR += data[i];
      cornerG += data[i + 1];
      cornerB += data[i + 2];
    }

    totalR += cornerR / pixelCount;
    totalG += cornerG / pixelCount;
    totalB += cornerB / pixelCount;
  }

  const r = Math.round(totalR / 4);
  const g = Math.round(totalG / 4);
  const b = Math.round(totalB / 4);

  const isWhite =
    r >= BACKGROUND_STANDARDS.whiteThreshold &&
    g >= BACKGROUND_STANDARDS.whiteThreshold &&
    b >= BACKGROUND_STANDARDS.whiteThreshold;

  const isLight = r >= 180 && g >= 180 && b >= 180;

  return { r, g, b, isWhite, isLight };
}

/**
 * 检测阴影
 */
function detectShadows(
  image: HTMLImageElement | HTMLCanvasElement
): { hasNoShadow: boolean; severity: 'none' | 'light' | 'heavy'; shadowArea: number } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const maxSize = 200;
  const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 检测边缘区域的亮度变化
  const width = canvas.width;
  const height = canvas.height;
  let shadowPixels = 0;
  let totalPixels = 0;

  // 采样边缘区域（上、下、左、右各 15%）
  const margin = 0.15;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isEdge =
        x < width * margin ||
        x > width * (1 - margin) ||
        y < height * margin ||
        y > height * (1 - margin);

      if (!isEdge) continue;

      const idx = (y * width + x) * 4;
      const brightness = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];

      totalPixels++;
      if (brightness < 180) {
        shadowPixels++;
      }
    }
  }

  const shadowArea = totalPixels > 0 ? Math.round((shadowPixels / totalPixels) * 100) : 0;

  if (shadowArea < 5) {
    return { hasNoShadow: true, severity: 'none', shadowArea };
  }

  if (shadowArea < 20) {
    return { hasNoShadow: false, severity: 'light', shadowArea };
  }

  return { hasNoShadow: false, severity: 'heavy', shadowArea };
}
