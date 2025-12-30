# Cloudflare Pages 部署指南

## 快速部署（推荐，免费）

### 步骤1：注册Cloudflare Pages
访问：https://pages.cloudflare.com/

### 步骤2：连接GitHub
1. 点击 "Create a project"
2. 选择 "Connect to Git"
3. 授权Cloudflare访问你的GitHub
4. 选择 `neiqulipro1299` 仓库

### 步骤3：配置构建设置
```
Build command: npm run build
Build output directory: .next
Node.js version: 18
```

### 步骤4：添加环境变量
在Environment Variables中添加：
```
NEXT_PUBLIC_SUPABASE_URL=https://fxionamswzlywcmoidds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:GJQ19920820GUOJIAQI@db.fxionamswzlywcmoidds.supabase.co:6543/postgres?pgbouncer=true
```

### 步骤5：部署
点击 "Save and Deploy"

### 步骤6：获得域名
部署成功后，Cloudflare会给你一个域名：
```
https://你的项目名.pages.dev
```

---

## 优点
✅ 完全免费
✅ 国内可以访问（大部分情况）
✅ 自动HTTPS
✅ 全球CDN
✅ 自动部署

---

## 注意事项
⚠️ Cloudflare Pages在某些地区可能还是会被墙
⚠️ 如果还是打不开，需要用方案2（国内服务器）
