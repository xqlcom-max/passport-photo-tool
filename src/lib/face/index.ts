/**
 * 人脸检测模块导出
 */

export {
  initFaceLandmarker,
  detectFace,
  isFaceLandmarkerReady,
  disposeFaceLandmarker,
} from './mediapipeFaceDetector';

export {
  calculateFaceMetrics,
  getFaceWidth,
  getFaceHeight,
  isFrontFacing,
  getEyesYRatio,
} from './faceMetrics';

export type {
  Point3D,
  FaceBoundingBox,
  HeadRotation,
  FaceDetectionResult,
  FaceRegions,
  FaceMetrics,
} from './types';
