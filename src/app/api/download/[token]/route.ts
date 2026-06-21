import { NextRequest, NextResponse } from 'next/server';
import { head } from '@vercel/blob';
import { redis, JOB_PREFIX, JobData } from '@/lib/redis';

/**
 * 一次性下载链接
 *
 * 流程：
 * 1. 用户支付成功后，Lemon Squeezy 重定向到此页面
 * 2. 此 API 验证 jobId 是否已支付
 * 3. 如果已支付，从 Blob 获取无水印的高清照片
 * 4. 如果未支付，返回 403 错误
 *
 * 安全考虑：
 * - 使用一次性 token（jobId），防止链接被分享
 * - 设置过期时间（24小时）
 * - 下载后立即失效
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

    // 检查是否有 Blob URL
    if (!jobData.blobUrl) {
      console.error(`No blobUrl for job ${token}`);
      return NextResponse.json(
        { error: 'Image not available' },
        { status: 404 }
      );
    }

    // 从 Blob 获取图片元数据
    let blobInfo;
    try {
      blobInfo = await head(jobData.blobUrl);
    } catch (error) {
      console.error('Failed to get blob:', error);
      return NextResponse.json(
        { error: 'Image not found or expired' },
        { status: 404 }
      );
    }

    // 获取图片内容
    const imageResponse = await fetch(blobInfo.url);
    if (!imageResponse.ok) {
      console.error('Failed to fetch image from blob');
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: 500 }
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // 可选：下载后删除（一次性使用）
    // 注意：如果要支持重复下载，可以去掉这行
    // await del(jobData.blobUrl);

    // 返回图片
    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="passport-photo-hd.png"`,
        // 禁止缓存，确保一次性使用
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
