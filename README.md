# 奶茶了么 (Milktea Record)

这是一个基于 Nuxt 3 + Nuxt UI + Prisma + Mysql 的全栈奶茶记录应用。

## 功能特性

- 📅 **日历视图**：以日历形式直观展示每日奶茶记录，支持点击查看详情。
- 📝 **记一杯**：快速记录奶茶订单，包含品牌、产品、价格、糖度、渠道等信息。
- 🏷️ **品牌管理**：维护奶茶品牌库，支持上传 Logo。
- 🔍 **订单查询**：支持按日期范围、品牌、产品名称筛选历史订单。
- 📱 **移动端适配**：响应式设计，适配手机竖屏操作，底部导航栏。

## 技术栈

- **框架**: [Nuxt 3](https://nuxt.com/)
- **UI 组件库**: [Nuxt UI](https://ui.nuxt.com/)
- **数据库 ORM**: [Prisma](https://www.prisma.io/)
- **数据库**: Mysql

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 推送数据库结构
npx prisma db push
```

### 3. 启动开发服务器

```bash
pnpm dev
```

浏览器访问 http://localhost:3000

## 项目结构

- `app/pages`: 页面路由
  - `index.vue`: 首页（日历）
  - `record.vue`: 记账页
  - `brands.vue`: 品牌管理
  - `search.vue`: 查询页
- `app/layouts`: 布局文件
- `server/api`: 后端 API 接口
- `prisma/schema.prisma`: 数据库模型定义
