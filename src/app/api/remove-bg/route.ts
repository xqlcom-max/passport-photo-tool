import { NextRequest, NextResponse } from 'next/server';
import { removeBackground } from '@imgly/background-removal-node';
import path from 'path';

/**
 * 本地背景移除 API
 *
 * 使用 @imgly/background-removal-node 库在服务端本地处理
 * 完全免费，无需任何 API Key，无网络依赖
 *
 * 注意：首次调用会下载模型文件（约 80MB），后续调用会缓存
 *
 * 注意：美国护照官方要求使用原始、未编辑的照片，
 * AI 抠背景功能仅适用于非美国护照/签证场景。
 */
export async function POST(request: NextRequest) {
  try {
    const { imageData, bgColor } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: 'Missing imageData parameter' },
        { status: 400 }
      );
    }

    // 将 base64 转换为 Uint8Array
    const base64Data = imageData.split(',')[1];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log('Starting background removal with Node.js version...');

    // 获取模型文件路径
    const distPath = path.join(process.cwd(), 'node_modules', '@imgly', 'background-removal-node', 'dist');
    const publicPath = `file://${distPath}/`;

    // 调用本地背景移除
    const result = await removeBackground(bytes, {
      publicPath: publicPath,
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
    const resultBase64 = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;

    return NextResponse.json({
      success: true,
      imageUrl: resultBase64,
    });
  } catch (error) {
    console.error('Remove background error:', error);
    return NextResponse.json(
      { error: 'Background removal failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
