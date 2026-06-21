import { NextRequest, NextResponse } from 'next/server';

/**
 * fal.ai 背景移除 API 代理
 *
 * 安全说明：
 * - API Key 存放在服务端环境变量 FAL_KEY 中，不会暴露给前端
 * - 所有 fal.ai 调用都在服务端完成
 * - 图片处理后不存储，直接返回给客户端
 *
 * 注意：美国护照官方要求使用原始、未编辑的照片，
 * AI 抠背景功能仅适用于非美国护照/签证场景。
 */
export async function POST(request: NextRequest) {
  try {
    const { imageUrl, bgColor } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Missing imageUrl parameter' },
        { status: 400 }
      );
    }

    // 检查 fal.ai API Key 是否配置
    const falKey = process.env.FAL_KEY;
    if (!falKey) {
      return NextResponse.json(
        { error: 'Background removal service is not configured' },
        { status: 503 }
      );
    }

    // 调用 fal.ai API 移除背景
    // 参考：https://fal.ai/models/fal-ai/bria/background/remove/api
    const response = await fetch('https://fal.run/fal-ai/bria/background/remove', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        bg_color: bgColor === 'blue' ? '#438EDB' : '#FFFFFF',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('fal.ai API error:', errorData);
      return NextResponse.json(
        { error: 'Background removal failed' },
        { status: 502 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      imageUrl: result.image_url,
    });
  } catch (error) {
    console.error('Remove background error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
