import { NextRequest, NextResponse } from 'next/server';
import { redis, JOB_PREFIX, JobData } from '@/lib/redis';

/**
 * 创建支付任务
 *
 * 用户点击"立即支付"时调用：
 * 1. 保存图片数据到 Redis（用于支付完成后下载）
 * 2. 返回 jobId，前端用它拼接 Gumroad 支付链接
 */
export async function POST(request: NextRequest) {
  try {
    const { jobId, imageData } = await request.json();

    if (!jobId || !imageData) {
      return NextResponse.json(
        { error: 'Missing jobId or imageData' },
        { status: 400 }
      );
    }

    // 检查是否已经创建过
    const existing = await redis.get<JobData>(`${JOB_PREFIX}${jobId}`);
    if (existing?.status === 'paid') {
      return NextResponse.json({ success: true, jobId, alreadyPaid: true });
    }

    // 保存 Job 数据，包含图片内容
    // 图片以 base64 格式存储，设置 24 小时过期
    const jobData: JobData = {
      status: 'pending',
      filename: 'passport-photo-hd.png',
      imageData, // base64 编码的图片数据
      createdAt: Date.now(),
    };

    await redis.set(`${JOB_PREFIX}${jobId}`, jobData, { ex: 86400 });

    console.log(`✅ Job ${jobId} created`);

    return NextResponse.json({ success: true, jobId });
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
