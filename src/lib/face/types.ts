/**
 * 人脸检测相关类型定义
 * 基于 MediaPipe Face Landmarker 的 478 个 3D 关键点
 */

/** 3D 坐标点 */
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

/** 人脸边界框 */
export interface FaceBoundingBox {
  x: number;      // 左上角 X（归一化 0-1）
  y: number;      // 左上角 Y（归一化 0-1）
  width: number;  // 宽度（归一化 0-1）
  height: number; // 高度（归一化 0-1）
}

/** 头部姿态角度（度） */
export interface HeadRotation {
  pitch: number;  // 低头/抬头（负=低头，正=抬头）
  yaw: number;    // 左右转头（负=左转，正=右转）
  roll: number;   // 歪头（负=左歪，正=右歪）
}

/** 人脸检测结果 */
export interface FaceDetectionResult {
  /** 是否检测到人脸 */
  detected: boolean;
  /** 检测到的人脸数量 */
  faceCount: number;
  /** 人脸边界框（像素坐标） */
  boundingBox: FaceBoundingBox | null;
  /** 478 个 3D 关键点（归一化坐标） */
  landmarks: Point3D[];
  /** 头部姿态 */
  headRotation: HeadRotation | null;
  /** 关键区域索引（MediaPipe 标准索引） */
  regions: FaceRegions | null;
}

/** 人脸关键区域 */
export interface FaceRegions {
  /** 左眼中心 */
  leftEye: Point3D;
  /** 右眼中心 */
  rightEye: Point3D;
  /** 鼻尖 */
  noseTip: Point3D;
  /** 嘴巴中心 */
  mouthCenter: Point3D;
  /** 左耳 */
  leftEar: Point3D;
  /** 右耳 */
  rightEar: Point3D;
  /** 左眼眉 */
  leftEyebrow: Point3D;
  /** 右眼眉 */
  rightEyebrow: Point3D;
  /** 下巴 */
  chin: Point3D;
  /** 额头顶部 */
  foreheadTop: Point3D;
}

/** 人脸指标（用于护照裁剪和合规检测） */
export interface FaceMetrics {
  /** 人脸宽度（像素） */
  faceWidth: number;
  /** 人脸高度（像素，从头顶到下巴） */
  faceHeight: number;
  /** 头部高度占图片高度的比例 */
  headHeightRatio: number;
  /** 眼睛 Y 位置距底部的比例 */
  eyesYFromBottom: number;
  /** 眼睛中心 X 位置（用于居中判断） */
  eyesCenterX: number;
  /** 眼睛中心 Y 位置（用于高度判断） */
  eyesCenterY: number;
  /** 两眼间距（像素） */
  interEyeDistance: number;
  /** 人脸中心偏移（相对图片中心） */
  centerOffsetX: number;
  centerOffsetY: number;
}
