import { NextRequest, NextResponse } from 'next/server';
import { redis, JOB_PREFIX, JobData } from '@/lib/redis';

/**
 * 一次性下载链接（兼容旧流程）
 *
 * 保留此 API 以兼容可能的直接访问。
 * 新流程使用 /api/status/[jobId] 来获取图片。
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 400 }
      );
    }

    // 从 Redis 获取 Job 数据
    const jobData = await redis.get<JobData>(`${JOB_PREFIX}${token}`);

    if (!jobData) {
      return NextResponse.json(
        { error: 'Job not found or expired' },
        { status: 404 }
      );
    }

    // 检查是否已支付
    if (jobData.status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment required' },
        { status: 403 }
      );
    }

    // 如果有 imageData，直接返回
    if (jobData.imageData) {
      // 解码 base64 数据
      const base64Data = jobData.imageData.includes(',')
        ? jobData.imageData.split(',')[1]
        : jobData.imageData;
      const imageBuffer = Buffer.from(base64Data, 'base64');

      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${jobData.filename || 'passport-photo-hd.png'}"`,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }

    return NextResponse.json(
      { error: 'Image not available' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
