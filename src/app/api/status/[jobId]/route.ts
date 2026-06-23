import { NextRequest, NextResponse } from 'next/server';
import { redis, JOB_PREFIX, JobData } from '@/lib/redis';

/**
 * 查询支付状态
 *
 * 前端轮询此 API 检查用户是否已完成支付。
 * 如果已支付，同时返回图片数据。
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId' },
        { status: 400 }
      );
    }

    // 从 Redis 获取 Job 数据
    const jobData = await redis.get<JobData>(`${JOB_PREFIX}${jobId}`);

    if (!jobData) {
      return NextResponse.json(
        { error: 'Job not found or expired' },
        { status: 404 }
      );
    }

    // 如果已支付，返回图片数据
    if (jobData.status === 'paid') {
      return NextResponse.json({
        status: 'paid',
        imageData: jobData.imageData,
        filename: jobData.filename,
      });
    }

    // 未支付
    return NextResponse.json({ status: 'pending' });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
