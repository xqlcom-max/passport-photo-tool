import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { redis, JOB_PREFIX, JobData } from '@/lib/redis';

/**
 * 上传处理后的图片到 Vercel Blob
 *
 * 流程：
 * 1. 前端调用此 API，传入 jobId 和图片 base64 数据
 * 2. 后端将图片存储到 Vercel Blob
 * 3. 将 Blob URL 保存到 Redis 的 Job 数据中
 * 4. 返回成功状态
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

    // 验证 Base64 格式
    if (!imageData.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image data format' },
        { status: 400 }
      );
    }

    // 从 base64 提取 buffer
    const base64Data = imageData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // 上传到 Vercel Blob
    const filename = `passport-photos/${jobId}.png`;
    const blob = await put(filename, buffer, {
      contentType: 'image/png',
      access: 'public',
    });

    // 更新 Redis 中的 Job 数据
    const existingJob = await redis.get<JobData>(`${JOB_PREFIX}${jobId}`);

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found. Please create checkout first.' },
        { status: 404 }
      );
    }

    const updatedJob: JobData = {
      ...existingJob,
      // 注意：旧流程使用 blobUrl，新流程使用 imageData
      // 保留此字段以兼容旧数据
    } as JobData & { blobUrl?: string };

    await redis.set(`${JOB_PREFIX}${jobId}`, updatedJob, { ex: 86400 });

    console.log(`✅ Image uploaded for job ${jobId}: ${blob.url}`);

    return NextResponse.json({
      success: true,
      blobUrl: blob.url,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
