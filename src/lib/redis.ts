import { Redis } from '@upstash/redis';

/**
 * Redis 客户端单例
 * 用于存储支付状态和图片元数据
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * 存储 Job 数据的键名前缀
 */
export const JOB_PREFIX = 'job:';

/**
 * Job 数据结构
 */
export interface JobData {
  status: 'pending' | 'paid';
  filename: string;
  imageData?: string; // base64 编码的高清图片数据
  createdAt: number;
  paidAt?: number;
  orderId?: string;
}
