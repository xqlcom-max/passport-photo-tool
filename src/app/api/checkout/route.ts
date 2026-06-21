import { NextRequest, NextResponse } from 'next/server';
import { redis, JOB_PREFIX, JobData } from '@/lib/redis';

/**
 * 创建 Lemon Squeezy 结账会话
 *
 * 流程：
 * 1. 前端调用此 API，传入 jobId
 * 2. 后端创建 Lemon Squeezy Checkout Session，将 jobId 传入 custom_data
 * 3. 同时在 Redis 中存储 jobId 的元数据
 * 4. 返回 checkout URL 给前端
 * 5. 用户在 Lemon Squeezy 完成支付
 * 6. Lemon Squeezy 通过 webhook 通知我们支付成功
 *
 * 环境变量要求：
 * - LEMON_SQUEEZY_API_KEY: Lemon Squeezy API Key
 * - LEMON_SQUEEZY_STORE_ID: 店铺 ID
 * - LEMON_SQUEEZY_PRODUCT_ID: 产品 ID
 * - LEMON_SQUEEZY_VARIANT_ID: 变体 ID（$2.99 那个）
 */
export async function POST(request: NextRequest) {
  try {
    const { jobId, filename } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId parameter' },
        { status: 400 }
      );
    }

    // 检查 Lemon Squeezy 配置
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const productId = process.env.LEMON_SQUEEZY_PRODUCT_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;

    if (!apiKey || !storeId || !productId || !variantId) {
      return NextResponse.json(
        { error: 'Payment service is not configured' },
        { status: 503 }
      );
    }

    // 在 Redis 中存储 Job 数据
    const jobData: JobData = {
      status: 'pending',
      filename: filename || `passport-photo-${jobId}.png`,
      createdAt: Date.now(),
    };

    // 保存到 Redis，设置 24 小时过期
    await redis.set(`${JOB_PREFIX}${jobId}`, jobData, { ex: 86400 });

    // 创建 Lemon Squeezy Checkout Session
    // 参考：https://docs.lemonsqueezy.com/api/checkouts
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                jobId: jobId,
              },
            },
            product_options: {
              redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/download/${jobId}`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: storeId,
              },
            },
            product: {
              data: {
                type: 'products',
                id: productId,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Lemon Squeezy API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 502 }
      );
    }

    const result = await response.json();
    const checkoutUrl = result.data.attributes.url;

    return NextResponse.json({
      success: true,
      checkoutUrl,
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
