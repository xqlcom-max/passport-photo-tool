/**
 * MediaPipe Face Landmarker 测试脚本
 * 用于验证人脸检测是否正常工作
 *
 * 使用方法：
 * 1. 在浏览器控制台执行：import('@/lib/face/testMediaPipe').then(m => m.testMediaPipe())
 * 2. 或者在 page.tsx 的 useEffect 中调用
 */

import { initFaceLandmarker, detectFace } from './mediapipeFaceDetector';

/**
 * 测试 MediaPipe Face Landmarker
 */
export async function testMediaPipe(): Promise<void> {
  console.log('=== MediaPipe Face Landmarker 测试 ===');

  try {
    // 1. 初始化模型
    console.log('1. 初始化模型...');
    await initFaceLandmarker((status) => {
      console.log('   加载状态:', status);
    });
    console.log('✅ 模型加载成功');

    // 2. 创建测试图片（一个简单的人脸轮廓）
    console.log('2. 创建测试图片...');
    const testImage = createTestImage();
    console.log('✅ 测试图片创建成功');

    // 3. 检测人脸
    console.log('3. 检测人脸...');
    const result = detectFace(testImage);
    console.log('检测结果:', result);

    if (result.detected) {
      console.log('✅ 人脸检测成功');
      console.log('   检测到人脸数量:', result.faceCount);
      console.log('   关键点数量:', result.landmarks.length);
      console.log('   边界框:', result.boundingBox);
      console.log('   头部姿态:', result.headRotation);

      if (result.regions) {
        console.log('   关键区域:');
        console.log('     左眼:', result.regions.leftEye);
        console.log('     右眼:', result.regions.rightEye);
        console.log('     鼻尖:', result.regions.noseTip);
        console.log('     嘴巴:', result.regions.mouthCenter);
        console.log('     下巴:', result.regions.chin);
      }
    } else {
      console.log('⚠️ 未检测到人脸（测试图片可能不包含人脸）');
    }

    console.log('=== 测试完成 ===');
  } catch (error) {
    console.error('❌ 测试失败:', error);
    throw error;
  }
}

/**
 * 创建一个简单的测试图片
 * 注意：这个图片不包含真实人脸，仅用于测试 API 是否正常工作
 */
function createTestImage(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d')!;

  // 背景
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, 200, 200);

  // 简单的脸部轮廓（椭圆）
  ctx.fillStyle = '#ffcc99';
  ctx.beginPath();
  ctx.ellipse(100, 100, 50, 60, 0, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(80, 90, 5, 0, Math.PI * 2);
  ctx.arc(120, 90, 5, 0, Math.PI * 2);
  ctx.fill();

  // 鼻子
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(95, 110);
  ctx.lineTo(105, 110);
  ctx.closePath();
  ctx.fill();

  // 嘴巴
  ctx.beginPath();
  ctx.arc(100, 125, 15, 0, Math.PI);
  ctx.stroke();

  return canvas;
}
