/**
 * OpenCV.js CDN 加载器
 *
 * OpenCV.js 体积较大（~8MB），通过 CDN 动态加载
 * 只在需要时加载，避免影响首屏加载速度
 */

/** OpenCV 是否已加载 */
let isOpenCVLoaded = false;

/** 加载 Promise */
let loadPromise: Promise<void> | null = null;

/**
 * 加载 OpenCV.js
 * 从 CDN 动态加载，支持 WebGL 加速
 */
export async function loadOpenCV(): Promise<void> {
  // 已加载，直接返回
  if (isOpenCVLoaded && typeof window.cv !== 'undefined') {
    return;
  }

  // 正在加载，等待
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    // 检查是否已经通过 script 标签加载
    if (typeof window.cv !== 'undefined') {
      isOpenCVLoaded = true;
      resolve();
      return;
    }

    // 创建 script 标签
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.9.0/opencv.js';
    script.async = true;
    script.onload = () => {
      // 等待 OpenCV 初始化完成
      const checkOpenCV = () => {
        if (typeof window.cv !== 'undefined' && window.cv.Mat) {
          isOpenCVLoaded = true;
          console.log('✅ OpenCV.js 加载完成');
          resolve();
        } else {
          // OpenCV 还在初始化，继续等待
          setTimeout(checkOpenCV, 100);
        }
      };
      checkOpenCV();
    };
    script.onerror = () => {
      reject(new Error('OpenCV.js 加载失败'));
      loadPromise = null;
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * 检查 OpenCV 是否已加载
 */
export function isOpenCVReady(): boolean {
  return isOpenCVLoaded && typeof window.cv !== 'undefined';
}

/**
 * 获取 OpenCV 实例
 */
export function getCV(): any {
  if (!isOpenCVLoaded || typeof window.cv === 'undefined') {
    throw new Error('OpenCV 未加载，请先调用 loadOpenCV()');
  }
  return window.cv;
}

// 扩展 Window 类型
declare global {
  interface Window {
    cv: any;
  }
}
