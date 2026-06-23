import { NextRequest, NextResponse } from 'next/server';
import { redis, JOB_PREFIX, JobData } from '@/lib/redis';

/**
 * Gumroad Webhook 处理
 *
 * 当用户支付成功后，Gumroad 会 POST 到此地址。
 * 我们需要：
 * 1. 从表单数据中提取 custom_fields 的 jobId
 * 2. 在 Redis 中将该 Job 标记为已支付
 * 3. 返回 200 状态码
 *
 * Gumroad webhook 数据格式（application/x-www-form-urlencoded）：
 * - sale_id: 订单 ID
 * - product_id: 产品 ID
 * - custom_fields: 自定义字段 JSON 字符串
 *
 * 环境变量要求：
 * - GUMROAD_PRODUCT_ID: Gumroad 产品 ID（用于验证）
 */
export async function POST(request: NextRequest) {
  try {
    // Gumroad 发送的是 form-urlencoded 数据
    const formData = await request.formData();

    // 提取关键字段
    const saleId = formData.get('sale_id') as string;
    const productId = formData.get('product_id') as string;
    const customFieldsStr = formData.get('custom_fields') as string;

    console.log('收到 Gumroad webhook:', { saleId, productId });

    // 验证产品 ID（防止伪造）
    const expectedProductId = process.env.GUMROAD_PRODUCT_ID;
    if (expectedProductId && productId !== expectedProductId) {
      console.error('产品 ID 不匹配:', productId, '期望:', expectedProductId);
      return NextResponse.json(
        { error: 'Invalid product' },
        { status: 403 }
      );
    }

    // 解析 custom_fields 获取 jobId
    let jobId: string | null = null;
    if (customFieldsStr) {
      try {
        const customFields = JSON.parse(customFieldsStr);
        jobId = customFields.jobId || customFields.job_id || null;
      } catch (e) {
        console.error('解析 custom_fields 失败:', e);
      }
    }

    if (!jobId) {
      console.error('Webhook 中没有找到 jobId');
      return NextResponse.json(
        { error: 'Missing jobId in custom_fields' },
        { status: 400 }
      );
    }

    // 从 Redis 获取现有 Job 数据
    const existingJob = await redis.get<JobData>(`${JOB_PREFIX}${jobId}`);

    if (!existingJob) {
      console.error(`Job ${jobId} 不存在`);
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
      orderId: saleId,
    };

    // 保存到 Redis，延长过期时间到 48 小时
    await redis.set(`${JOB_PREFIX}${jobId}`, updatedJob, { ex: 172800 });

    console.log(`✅ 支付成功！Job ${jobId}, 订单 ${saleId}`);

    return NextResponse.json({ success: true, jobId });
  } catch (error) {
    console.error('Gumroad webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
