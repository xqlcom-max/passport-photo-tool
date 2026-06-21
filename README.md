# Passport Photo Tool

护照和签证照片裁剪、调整大小、格式化工具。

## 功能特点

- ✅ 照片上传（支持 JPG、PNG）
- ✅ 智能裁剪为正方形
- ✅ 调整到护照照片尺寸（600×600px）
- ✅ 背景色切换（白色/蓝色）
- ✅ 免费版下载（带水印）
- ✅ 付费版下载（无水印，$2.99）
- ✅ 法律页面（Privacy Policy、Terms、Refund Policy）

## 技术栈

- **前端**: Next.js 16 + React + TypeScript + Tailwind CSS
- **支付**: Lemon Squeezy
- **AI 背景移除**: fal.ai（可选）

## 项目结构

```
passport-photo-tool/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 主页面
│   │   ├── layout.tsx            # 布局
│   │   ├── globals.css           # 全局样式
│   │   ├── privacy/              # 隐私政策页面
│   │   ├── terms/                # 服务条款页面
│   │   ├── refund/               # 退款政策页面
│   │   └── api/
│   │       ├── remove-bg/        # fal.ai 背景移除 API
│   │       ├── checkout/         # 创建支付会话
│   │       ├── webhook/          # 支付回调处理
│   │       └── download/[token]/ # 一次性下载链接
│   ├── components/
│   │   ├── Header.tsx            # 页头
│   │   ├── Hero.tsx              # 首屏
│   │   ├── UploadZone.tsx        # 上传区域
│   │   ├── Processing.tsx        # 处理中状态
│   │   ├── Preview.tsx           # 预览区域
│   │   ├── PaymentModal.tsx      # 支付弹窗
│   │   ├── Features.tsx          # 功能介绍
│   │   └── Footer.tsx            # 页脚
│   └── lib/
│       └── imageProcessing.ts    # 图片处理工具
├── .env.local                    # 环境变量（不提交到 Git）
├── package.json
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`，填入以下配置：

```bash
# fal.ai API Key（可选，用于 AI 背景移除）
FAL_KEY=your_fal_key_here

# Lemon Squeezy 配置（必需，用于支付）
LEMON_SQUEEZY_API_KEY=your_api_key
LEMON_SQUEEZY_STORE_ID=your_store_id
LEMON_SQUEEZY_PRODUCT_ID=your_product_id
LEMON_SQUEEZY_VARIANT_ID=your_variant_id
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret

# 网站 URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL=your_checkout_url
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 部署到 Vercel

1. 推送代码到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入项目
3. 在 Vercel 设置中添加环境变量
4. 部署

## 合规说明

### 重要声明

- ⚠️ 本工具**不是**美国政府官方网站
- ⚠️ 使用本工具**不能保证**照片被任何政府机构接受
- ⚠️ 照片要求可能随时变化，请在提交申请前核实最新要求

### 美国护照照片要求

美国国务院要求护照照片必须是：
- 未经过编辑或修改的原始照片
- 近6个月内拍摄
- 白色或米白色背景
- 2x2 英寸（51x51 毫米）

**注意**: AI 背景移除功能可能不适用于美国护照照片，因为官方要求使用原始、未编辑的照片。

## 待办事项

- [ ] 接入 fal.ai 背景移除 API
- [ ] 实现 Lemon Squeezy webhook 签名验证
- [ ] 添加数据库存储已支付订单
- [ ] 实现一次性下载 token 机制
- [ ] 添加人脸检测功能
- [ ] 添加照片尺寸检查功能

## 许可证

MIT License
