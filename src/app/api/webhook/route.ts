import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { redis, JOB_PREFIX, JobData } from '@/lib/redis';

/**
 * Lemon Squeezy Webhook 处理
 *
 * 当用户支付成功后，Lemon Squeezy 会调用此 API。
 * 我们需要：
 * 1. 验证 webhook 签名（防止伪造）
 * 2. 解析订单信息
 * 3. 将 jobId 标记为已支付
 * 4. 返回 200 状态码
 *
 * 环境变量要求：
 * - LEMON_SQUEEZY_WEBHOOK_SECRET: Webhook 签名密钥
 */
export async function POST(request: NextRequest) {
  try {
    // 获取原始请求体用于签名验证
    const rawBody = await request.text();

    // 获取 webhook 签名
    const signature = request.headers.get('x-signature');
    if (!signature) {
      console.error('Missing x-signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // 验证 webhook 签名
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('LEMON_SQUEEZY_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 503 }
      );
    }

    // 使用 HMAC SHA256 验证签名
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(rawBody).digest('hex');

    // 使用 timingSafeEqual 防止时序攻击
    const signatureBuffer = Buffer.from(signature);
    const digestBuffer = Buffer.from(digest);

    if (signatureBuffer.length !== digestBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, digestBuffer)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 解析事件类型
    const body = JSON.parse(rawBody);
    const eventType = body.meta?.event_name;

    // 只处理订单创建事件
    if (eventType !== 'order_created') {
      return NextResponse.json({ success: true, message: `Ignored event: ${eventType}` });
    }

    // 获取订单信息
    const order = body.data;
    if (!order) {
      return NextResponse.json(
        { error: 'Missing order data' },
        { status: 400 }
      );
    }

    // 从 custom_data 中获取 jobId
    // Lemon Squeezy webhook 中 custom_data 的位置是 order.attributes.custom_data
    const jobId = order.attributes?.custom_data?.jobId;

    if (!jobId) {
      console.error('No jobId in order:', order.id);
      return NextResponse.json(
        { error: 'Missing jobId in order' },
        { status: 400 }
      );
    }

    // 检查订单状态
    const orderStatus = order.attributes?.status;
    if (orderStatus !== 'paid') {
      console.log(`Order ${order.id} status is ${orderStatus}, ignoring`);
      return NextResponse.json({ success: true, message: 'Order not paid yet' });
    }

    // 从 Redis 获取现有 Job 数据
    const existingJob = await redis.get<JobData>(`${JOB_PREFIX}${jobId}`);

    if (!existingJob) {
      console.error(`Job ${jobId} not found in Redis`);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // 更新 Job 状态为已支付
    const updatedJob: JobData = {
      ...existingJob,
      status: 'paid',
      paidAt: Date.now(),
      orderId: order.id,
    };

    // 保存到 Redis，设置 24 小时过期
    await redis.set(`${JOB_PREFIX}${jobId}`, updatedJob, { ex: 86400 });

    console.log(`✅ Order ${order.id} paid for job ${jobId}`);

    return NextResponse.json({ success: true, jobId });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
