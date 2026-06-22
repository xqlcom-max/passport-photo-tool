/**
 * 图片质量检测项
 * 使用 Canvas API 进行质量检测（不依赖 OpenCV.js）
 */

import type { CheckResult } from './types';
import { QUALITY_STANDARDS } from '../passport/usPassportStandards';

/**
 * 检查图片模糊度
 * 使用 Laplacian 方差：值越大越清晰
 */
export function checkBlur(
  image: HTMLImageElement | HTMLCanvasElement
): CheckResult {
  try {
    const blurValue = calculateBlur(image);

    if (blurValue >= QUALITY_STANDARDS.minBlurThreshold * 2) {
      return {
        name: 'Image Sharpness',
        icon: '✅',
        status: 'pass',
        message: '图片清晰度良好',
        actualValue: blurValue.toFixed(0),
      };
    }

    if (blurValue >= QUALITY_STANDARDS.minBlurThreshold) {
      return {
        name: 'Image Sharpness',
        icon: '⚠️',
        status: 'warning',
        message: '图片清晰度一般，建议使用更清晰的照片',
        actualValue: blurValue.toFixed(0),
        expectedValue: `>${QUALITY_STANDARDS.minBlurThreshold * 2}`,
      };
    }

    return {
      name: 'Image Sharpness',
      icon: '❌',
      status: 'fail',
      message: '图片模糊，请使用更清晰的照片',
      actualValue: blurValue.toFixed(0),
      expectedValue: `>${QUALITY_STANDARDS.minBlurThreshold}`,
    };
  } catch {
    return {
      name: 'Image Sharpness',
      icon: '⚠️',
      status: 'warning',
      message: '无法检测清晰度',
    };
  }
}

/**
 * 检查图片亮度
 */
export function checkBrightness(
  image: HTMLImageElement | HTMLCanvasElement
): CheckResult {
  try {
    const brightness = calculateBrightness(image);

    if (
      brightness >= QUALITY_STANDARDS.minBrightness &&
      brightness <= QUALITY_STANDARDS.maxBrightness
    ) {
      return {
        name: 'Brightness',
        icon: '✅',
        status: 'pass',
        message: '亮度合适',
        actualValue: brightness.toFixed(0),
      };
    }

    if (brightness < QUALITY_STANDARDS.minBrightness) {
      return {
        name: 'Brightness',
        icon: '❌',
        status: 'fail',
        message: '图片太暗，请在光线充足的地方拍摄',
        actualValue: brightness.toFixed(0),
        expectedValue: `${QUALITY_STANDARDS.minBrightness}-${QUALITY_STANDARDS.maxBrightness}`,
      };
    }

    return {
      name: 'Brightness',
      icon: '❌',
      status: 'fail',
      message: '图片太亮，请避免过曝',
      actualValue: brightness.toFixed(0),
      expectedValue: `${QUALITY_STANDARDS.minBrightness}-${QUALITY_STANDARDS.maxBrightness}`,
    };
  } catch {
    return {
      name: 'Brightness',
      icon: '⚠️',
      status: 'warning',
      message: '无法检测亮度',
    };
  }
}

/**
 * 检查图片对比度
 */
export function checkContrast(
  image: HTMLImageElement | HTMLCanvasElement
): CheckResult {
  try {
    const contrast = calculateContrast(image);

    if (contrast >= QUALITY_STANDARDS.minContrast) {
      return {
        name: 'Contrast',
        icon: '✅',
        status: 'pass',
        message: '对比度合适',
        actualValue: contrast.toFixed(0),
      };
    }

    return {
      name: 'Contrast',
      icon: '⚠️',
      status: 'warning',
      message: '对比度较低，建议使用光线均匀的照片',
      actualValue: contrast.toFixed(0),
      expectedValue: `>${QUALITY_STANDARDS.minContrast}`,
    };
  } catch {
    return {
      name: 'Contrast',
      icon: '⚠️',
      status: 'warning',
      message: '无法检测对比度',
    };
  }
}

/**
 * 计算模糊度（Laplacian 方差）
 */
function calculateBlur(image: HTMLImageElement | HTMLCanvasElement): number {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // 缩小图片以提高性能
  const maxSize = 200;
  const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 转换为灰度
  const gray = new Float32Array(canvas.width * canvas.height);
  for (let i = 0; i < gray.length; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // 计算 Laplacian
  const width = canvas.width;
  const height = canvas.height;
  let laplacianSum = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const laplacian =
        -4 * gray[idx] +
        gray[idx - 1] +
        gray[idx + 1] +
        gray[idx - width] +
        gray[idx + width];
      laplacianSum += laplacian * laplacian;
      count++;
    }
  }

  return count > 0 ? laplacianSum / count : 0;
}

/**
 * 计算亮度
 */
function calculateBrightness(image: HTMLImageElement | HTMLCanvasElement): number {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const maxSize = 100;
  const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let sum = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    sum += 0.299 * r + 0.587 * g + 0.114 * b;
  }

  return sum / pixelCount;
}

/**
 * 计算对比度
 */
function calculateContrast(image: HTMLImageElement | HTMLCanvasElement): number {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const maxSize = 100;
  const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 转换为灰度
  const gray = new Float32Array(data.length / 4);
  for (let i = 0; i < gray.length; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // 计算平均值
  let mean = 0;
  for (let i = 0; i < gray.length; i++) {
    mean += gray[i];
  }
  mean /= gray.length;

  // 计算标准差
  let variance = 0;
  for (let i = 0; i < gray.length; i++) {
    variance += (gray[i] - mean) * (gray[i] - mean);
  }
  variance /= gray.length;

  return Math.sqrt(variance);
}
