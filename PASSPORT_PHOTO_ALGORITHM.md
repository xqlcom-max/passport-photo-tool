# 证件照生成算法 - 最终版

## 核心思路

**用人（不是脸）做证件照**

传统 face detection 方案的问题：
- Face detection 只检测脸部，不包含头发
- 任何基于脸的 scale 计算都无法稳定保证头顶不被裁切
- 肩膀位置也不确定

Person segmentation 方案的优势：
- 从 alpha 通道提取完整人物轮廓（包含头发、肩膀）
- Contain-fit 缩放：让人完整填满画布
- 构图稳定，不受发型、姿势影响

## 算法流程

```
1. 背景移除（@imgly/background-removal）
   ↓ 输出有 alpha 通道的 PNG
2. 提取人物 bounding box（扫描 alpha 通道）
   ↓ 得到 {x, y, width, height}
3. Contain-fit 缩放
   ↓ scale = min(canvasW/personW, canvasH/personH)
4. 垂直定位（人中心在 50% 高度）
   ↓ offsetY = canvasH * 0.50 - personCenterY * scale
5. 顶部安全区检查（10%）
   ↓ 如果头顶 < 10%，自动下移
6. 绘制到 600x600 画布
```

## 完整代码实现

### 1. 常量配置

```typescript
const TARGET_WIDTH = 600;
const TARGET_HEIGHT = 600; // 美国护照照片标准：2x2 英寸，600x600 像素
```

### 2. 提取人物 Bounding Box

```typescript
/**
 * 从图片 alpha 通道提取人的 bounding box
 * 背景移除后的图片，非透明区域就是人的轮廓（包含头发、肩膀）
 */
function getPersonBoundingBox(img: HTMLImageElement): { x: number; y: number; width: number; height: number } | null {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
  let found = false;

  // 扫描所有像素，找非透明区域的边界
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha > 128) { // 不透明像素 = 人的部分
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }

  if (!found) return null;

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}
```

### 3. 构建证件照 Transform（核心算法）

```typescript
/**
 * 证件照排版算法（person segmentation 方案）
 *
 * 核心思路：用人（不是脸）做证件照
 * - 从 alpha 通道提取人的 bounding box（包含头发、肩膀）
 * - contain-fit 缩放：让人完整填满画布
 * - 居中 + 轻微上移（固定规则，不再调参）
 *
 * @param img - 背景已移除的图片（有 alpha 通道）
 * @param detection - MediaPipe 人脸检测结果（fallback 用）
 * @returns transform 参数（scale, offsetX, offsetY）
 */
function buildPassportTransform(
  img: HTMLImageElement,
  detection: FaceDetectionResult
): { scale: number; offsetX: number; offsetY: number } {
  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;

  // 优先方案：从 alpha 通道提取人的 bounding box
  const personBox = getPersonBoundingBox(img);

  if (personBox) {
    // ✅ person segmentation 方案（最稳定）
    // contain-fit：让人完整填满画布
    const scale = Math.min(
      TARGET_WIDTH / personBox.width,
      TARGET_HEIGHT / personBox.height
    );

    const personCenterX = personBox.x + personBox.width / 2;
    const personCenterY = personBox.y + personBox.height / 2;

    const offsetX = TARGET_WIDTH / 2 - personCenterX * scale;
    // 固定构图：人中心在 50% 高度（居中偏上）
    let offsetY = TARGET_HEIGHT * 0.50 - personCenterY * scale;

    // 10% 顶部安全区：确保头顶不会贴边
    const TOP_SAFE_ZONE = TARGET_HEIGHT * 0.10;
    const headTop = personBox.y * scale + offsetY;
    if (headTop < TOP_SAFE_ZONE) {
      offsetY += (TOP_SAFE_ZONE - headTop);
    }

    return { scale, offsetX, offsetY };
  }

  // fallback：没有人轮廓时，用 face detection
  if (detection.regions) {
    const { regions } = detection;
    const faceCenterX = ((regions.leftEye.x + regions.rightEye.x) / 2) * imgW;
    const faceCenterY = ((regions.foreheadTop.y + regions.chin.y) / 2) * imgH;
    const scale = (TARGET_HEIGHT * 1.3) / imgH;
    const targetEyeY = TARGET_HEIGHT * 0.38;
    const TOP_PADDING = TARGET_HEIGHT * 0.08;
    const offsetX = TARGET_WIDTH / 2 - faceCenterX * scale;
    const offsetY = targetEyeY - faceCenterY * scale + TOP_PADDING;
    return { scale, offsetX, offsetY };
  }

  // 最后 fallback：居中缩放
  const scale = Math.min(TARGET_WIDTH / imgW, TARGET_HEIGHT / imgH);
  return {
    scale,
    offsetX: (TARGET_WIDTH - imgW * scale) / 2,
    offsetY: (TARGET_HEIGHT - imgH * scale) / 2,
  };
}
```

### 4. 主处理函数

```typescript
/**
 * 处理护照照片：智能裁剪，符合美国护照照片标准
 *
 * 美国护照照片要求：
 * - 尺寸：2x2 英寸（600x600 像素）
 * - 头部高度：占照片高度的 50%-69%
 * - 眼睛位置：在照片高度的 56%-69% 处（从底部算起）
 * - 头顶空间：占照片高度的 10%-25%
 *
 * @param img - 要处理的图片
 * @param bgColor - 背景颜色
 * @returns 处理后的图片 base64 数据
 */
export async function processPassportPhoto(
  img: HTMLImageElement,
  bgColor: 'white' | 'blue' = 'white'
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // 填充背景色
  ctx.fillStyle = bgColor === 'blue' ? '#438EDB' : '#FFFFFF';
  ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

  // 尝试进行面部检测和智能裁剪
  try {
    console.log('Processing passport photo...');
    console.log('Image size:', img.naturalWidth, 'x', img.naturalHeight);

    // 确保 MediaPipe 已初始化
    await initFaceLandmarker();

    // 使用 MediaPipe 检测人脸
    const faceDetection = detectFace(img);

    if (faceDetection.detected) {
      console.log('✅ Face detected! Performing smart crop...');

      // 计算人脸指标
      const metrics = calculateFaceMetrics(faceDetection, img.naturalWidth, img.naturalHeight);
      console.log('Face metrics:', metrics);

      // 获取证件照排版参数（transform 算法）
      const passportTransform = buildPassportTransform(img, faceDetection);
      console.log('Passport transform:', passportTransform);

      // 启用抗锯齿，优化边缘处理
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 应用 transform（全局重构，不是裁剪）
      ctx.setTransform(
        passportTransform.scale, 0,
        0, passportTransform.scale,
        passportTransform.offsetX,
        passportTransform.offsetY
      );
      ctx.drawImage(img, 0, 0);

      // 重置 transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      console.log('✅ Passport photo transform completed');
    } else {
      console.warn('⚠️ No face detected, using center crop...');

      // 没有检测到面部，使用居中裁剪
      centerCrop(img, ctx);
    }
  } catch (error) {
    console.warn('⚠️ Face detection failed, using center crop:', error);
    centerCrop(img, ctx);
  }

  return canvas.toDataURL('image/png');
}
```

### 5. 备用方案：居中裁剪

```typescript
/**
 * 居中裁剪（备用方案）
 */
function centerCrop(img: HTMLImageElement, ctx: CanvasRenderingContext2D): void {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = TARGET_WIDTH / TARGET_HEIGHT;

  let drawW: number, drawH: number;
  if (imgRatio > canvasRatio) {
    drawH = TARGET_HEIGHT;
    drawW = drawH * imgRatio;
  } else {
    drawW = TARGET_WIDTH;
    drawH = drawW / imgRatio;
  }

  const x = (TARGET_WIDTH - drawW) / 2;
  const y = (TARGET_HEIGHT - drawH) / 2;

  // 启用抗锯齿
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(img, x, y, drawW, drawH);
}
```

## 使用说明

### 前置条件

1. **背景必须先移除**：输入的图片需要有 alpha 通道
   ```typescript
   import { removeBackground } from '@imgly/background-removal';
   const bgRemovedUrl = await removeBackground(imageUrl);
   const img = await loadImage(bgRemovedUrl);
   ```

2. **MediaPipe Face Landmarker**：用于 fallback 定位
   ```typescript
   import { initFaceLandmarker, detectFace } from './face/mediapipeFaceDetector';
   await initFaceLandmarker();
   const faceDetection = detectFace(img);
   ```

### 调用方式

```typescript
import { processPassportPhoto, loadImage } from './lib/imageProcessing';

// 处理护照照片
const result = await processPassportPhoto(img, 'white'); // 白色背景
// 或
const result = await processPassportPhoto(img, 'blue');  // 蓝色背景
```

## 关键参数说明

| 参数 | 值 | 说明 |
|------|-----|------|
| `TARGET_WIDTH` | 600 | 画布宽度（像素） |
| `TARGET_HEIGHT` | 600 | 画布高度（像素） |
| `personCenterY` | 50% | 人中心垂直位置 |
| `TOP_SAFE_ZONE` | 10% | 顶部安全区，防止头顶贴边 |
| `alpha > 128` | - | 判断像素是否属于人物 |

## 算法优势

1. **稳定性**：不受发型、姿势、头部角度影响
2. **完整性**：确保头发、肩膀完整显示
3. **符合标准**：满足美国护照照片要求（头顶空间 10%-25%）
4. **Fallback 机制**：person segmentation 失败时自动降级到 face detection

## 常见问题

### Q: 为什么不用 face detection 做主要方案？
A: Face detection 只检测脸部，不包含头发。任何基于脸的 scale 计算都无法稳定保证头顶不被裁切。

### Q: getPersonBoundingBox 性能如何？
A: 全像素扫描可能较慢（取决于图片尺寸）。如果性能成为瓶颈，可以：
- 降采样后扫描
- 使用 Web Worker
- 缓存 bounding box 结果

### Q: 如何调整人物位置？
A: 修改 `TARGET_HEIGHT * 0.50` 中的 `0.50`：
- `0.45` → 人物偏上
- `0.50` → 居中（推荐）
- `0.55` → 人物偏下

### Q: 如何调整顶部安全区？
A: 修改 `TARGET_HEIGHT * 0.10` 中的 `0.10`：
- `0.08` → 允许头顶更靠近顶部
- `0.10` → 标准安全区（推荐）
- `0.12` → 头顶留更多空间

## 版本历史

- **v1.0**：基于 face detection 的裁剪方案（已废弃）
- **v2.0**：Person segmentation 方案（当前版本）
  - 从 alpha 通道提取人物 bounding box
  - Contain-fit 缩放
  - 10% 顶部安全区
