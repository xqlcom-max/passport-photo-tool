/**
 * MediaPipe Face Landmarker 封装
 * 使用 @mediapipe/tasks-vision 实现浏览器端人脸检测
 *
 * 优势：
 * - 478 个 3D 关键点（比 face-api.js 的 68 个 2D 点更精确）
 * - 提供 Head Rotation（pitch/yaw/roll），可判断歪头/低头/抬头
 * - WASM + WebGL 加速，性能更好
 * - Google 持续维护
 */

import {
  FaceLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
} from '@mediapipe/tasks-vision';
import type {
  FaceDetectionResult,
  FaceRegions,
  Point3D,
} from './types';

/** MediaPipe Face Landmarker 单例 */
let faceLandmarker: FaceLandmarker | null = null;

/** 模型是否已加载 */
let isModelLoaded = false;

/** 加载状态回调 */
type LoadingCallback = (status: string) => void;

/**
 * 初始化 MediaPipe Face Landmarker
 * 从 CDN 加载 WASM 和模型文件
 */
export async function initFaceLandmarker(
  onProgress?: LoadingCallback
): Promise<void> {
  if (isModelLoaded && faceLandmarker) {
    onProgress?.('模型已加载');
    return;
  }

  try {
    onProgress?.('正在加载 MediaPipe Vision WASM...');

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    onProgress?.('正在加载人脸检测模型...');

    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task',
        delegate: 'GPU', // 优先使用 WebGL 加速
      },
      runningMode: 'IMAGE',
      numFaces: 1, // 只检测最大的人脸
      minFaceDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      outputFaceBlendshapes: false,
    });

    isModelLoaded = true;
    onProgress?.('人脸检测模型加载完成');
  } catch (error) {
    console.error('MediaPipe Face Landmarker 初始化失败:', error);
    isModelLoaded = false;
    faceLandmarker = null;
    throw error;
  }
}

/**
 * 检测图片中的人脸
 * @param image - HTMLImageElement 或 HTMLCanvasElement
 * @returns 人脸检测结果
 */
export function detectFace(
  image: HTMLImageElement | HTMLCanvasElement
): FaceDetectionResult {
  if (!faceLandmarker || !isModelLoaded) {
    throw new Error('Face Landmarker 未初始化，请先调用 initFaceLandmarker()');
  }

  const result: FaceLandmarkerResult = faceLandmarker.detect(image);

  // 没有检测到人脸
  if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
    return {
      detected: false,
      faceCount: 0,
      boundingBox: null,
      landmarks: [],
      headRotation: null,
      regions: null,
    };
  }

  // 只取第一个人脸（最大的）
  const faceLandmarks = result.faceLandmarks[0];

  // 转换关键点格式
  const landmarks: Point3D[] = faceLandmarks.map((point) => ({
    x: point.x,
    y: point.y,
    z: point.z,
  }));

  // 提取关键区域
  const regions = extractFaceRegions(landmarks);

  // 计算边界框（像素坐标）
  const boundingBox = calculateBoundingBox(landmarks, image.width, image.height);

  // 计算头部姿态
  const headRotation = calculateHeadRotation(landmarks);

  return {
    detected: true,
    faceCount: result.faceLandmarks.length,
    boundingBox,
    landmarks,
    headRotation,
    regions,
  };
}

/**
 * 提取人脸关键区域
 * 使用 MediaPipe Face Landmarker 的标准索引
 */
function extractFaceRegions(landmarks: Point3D[]): FaceRegions {
  // MediaPipe Face Landmarker 478 个关键点的索引
  // 参考：https://developers.google.com/mediapipe/solutions/vision/face_landmarker
  const LEFT_EYE_CENTER = 468;   // 左眼中心（虹膜）
  const RIGHT_EYE_CENTER = 473;  // 右眼中心（虹膜）
  const NOSE_TIP = 1;            // 鼻尖
  const MOUTH_CENTER = 13;       // 嘴巴中心
  const LEFT_EAR = 234;          // 左耳
  const RIGHT_EAR = 454;         // 右耳
  const LEFT_EYEBROW = 70;       // 左眼眉
  const RIGHT_EYEBROW = 300;     // 右眼眉
  const CHIN = 152;              // 下巴
  const FOREHEAD_TOP = 10;       // 额头顶部

  return {
    leftEye: landmarks[LEFT_EYE_CENTER],
    rightEye: landmarks[RIGHT_EYE_CENTER],
    noseTip: landmarks[NOSE_TIP],
    mouthCenter: landmarks[MOUTH_CENTER],
    leftEar: landmarks[LEFT_EAR],
    rightEar: landmarks[RIGHT_EAR],
    leftEyebrow: landmarks[LEFT_EYEBROW],
    rightEyebrow: landmarks[RIGHT_EYEBROW],
    chin: landmarks[CHIN],
    foreheadTop: landmarks[FOREHEAD_TOP],
  };
}

/**
 * 计算人脸边界框（像素坐标）
 */
function calculateBoundingBox(
  landmarks: Point3D[],
  imageWidth: number,
  imageHeight: number
) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (const point of landmarks) {
    const x = point.x * imageWidth;
    const y = point.y * imageHeight;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return {
    x: minX / imageWidth,
    y: minY / imageHeight,
    width: (maxX - minX) / imageWidth,
    height: (maxY - minY) / imageHeight,
  };
}

/**
 * 计算头部姿态角度
 * 使用关键点的 3D 坐标估算 pitch/yaw/roll
 */
function calculateHeadRotation(landmarks: Point3D[]): {
  pitch: number;
  yaw: number;
  roll: number;
} {
  const leftEye = landmarks[468];   // 左眼中心
  const rightEye = landmarks[473];  // 右眼中心
  const noseTip = landmarks[1];     // 鼻尖
  const chin = landmarks[152];      // 下巴
  const foreheadTop = landmarks[10]; // 额头顶部

  // Roll：两眼连线的倾斜角度
  const eyeDx = rightEye.x - leftEye.x;
  const eyeDy = rightEye.y - leftEye.y;
  const roll = Math.atan2(eyeDy, eyeDx) * (180 / Math.PI);

  // Pitch：鼻子-下巴连线与垂直线的夹角
  const noseChinDx = chin.x - noseTip.x;
  const noseChinDy = chin.y - noseTip.y;
  const pitch = Math.atan2(noseChinDx, noseChinDy) * (180 / Math.PI);

  // Yaw：鼻子 X 偏移与眼睛间距的比值
  const eyeCenterX = (leftEye.x + rightEye.x) / 2;
  const eyeDistance = Math.sqrt(eyeDx * eyeDx + eyeDy * eyeDy);
  const noseOffsetX = noseTip.x - eyeCenterX;
  const yaw = Math.atan2(noseOffsetX, eyeDistance) * (180 / Math.PI);

  return { pitch, yaw, roll };
}

/**
 * 检查模型是否已加载
 */
export function isFaceLandmarkerReady(): boolean {
  return isModelLoaded && faceLandmarker !== null;
}

/**
 * 释放资源
 */
export function disposeFaceLandmarker(): void {
  if (faceLandmarker) {
    faceLandmarker.close();
    faceLandmarker = null;
    isModelLoaded = false;
  }
}
