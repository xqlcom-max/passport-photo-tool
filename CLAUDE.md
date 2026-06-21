# Passport Photo Tool - 项目规则

## 技术栈
- Next.js 16 + React + TypeScript + Tailwind CSS
- 支付：Lemon Squeezy
- AI 背景移除：fal.ai（可选）

## 开发规范
- 代码注释使用中文
- 组件命名使用 PascalCase
- API 路由放在 src/app/api/ 下
- 所有 IO/网络调用必须有错误处理

## 合规要求
- 不能声称"U.S. Passport Compliant"
- 必须在页面上添加免责声明
- AI 背景移除功能仅适用于非美国护照场景
- 必须有 Privacy Policy、Terms、Refund Policy 页面

## 环境变量
- FAL_KEY: fal.ai API Key（可选）
- LEMON_SQUEEZY_*: 支付配置（必需）
- NEXT_PUBLIC_BASE_URL: 网站基础 URL
