import { NextRequest, NextResponse } from 'next/server';

/**
 * 创建 Gumroad 结账会话
 *
 * 流程：
 * 1. 前端调用此 API，传入 jobId
 * 2. 后端返回 Gumroad 产品页面 URL（带 jobId 作为自定义字段）
 * 3. 用户在 Gumroad 完成支付
 * 4. Gumroad 通过 webhook 通知我们支付成功
 * 5. 用户被重定向回网站，前端轮询支付状态
 *
 * 环境变量要求：
 * - GUMROAD_PRODUCT_URL: Gumroad 产品页面 URL
 * - GUMROAD_PERMALINK: Gumroad 产品 permalink（可选，用于自定义链接）
 */
export async function POST(request: NextRequest) {
  try {
    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId parameter' },
        { status: 400 }
      );
    }

    // 获取 Gumroad 产品配置
    const productUrl = process.env.GUMROAD_PRODUCT_URL;
    const permalink = process.env.GUMROAD_PERMALINK;

    if (!productUrl) {
      return NextResponse.json(
        { error: 'Gumroad is not configured. Set GUMROAD_PRODUCT_URL in .env.local' },
        { status: 503 }
      );
    }

    // 构建 Gumroad 支付链接
    // Gumroad 支持在 URL 中传递 custom_fields，格式：
    // https://product-url?custom_fields[jobId]=xxx
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const checkoutUrl = new URL(productUrl);
    checkoutUrl.searchParams.set('custom_fields[jobId]', jobId);
    checkoutUrl.searchParams.set('redirect_url', `${baseUrl}/success`);

    // 如果配置了 permalink，使用它
    if (permalink) {
      checkoutUrl.searchParams.set('permalink', permalink);
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutUrl.toString(),
      jobId,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
