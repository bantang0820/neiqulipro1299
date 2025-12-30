# 🚀 项目部署指南

## 方案选择

### 方案1：Vercel部署（推荐-最简单）✅
**优点：**
- 免费
- 自动HTTPS
- 自动部署
- 全球CDN
- 操作简单

**缺点：**
- 服务器在国外，国内访问可能较慢

### 方案2：腾讯云/阿里云部署（国内访问快）💪
**优点：**
- 国内访问速度快
- 数据在国内

**缺点：**
- 需要购买服务器
- 配置相对复杂

---

## 📌 方案1：Vercel部署（5分钟搞定）

### 步骤1：安装Vercel CLI
```bash
npm install -g vercel
```

### 步骤2：登录Vercel
```bash
vercel login
```
会打开浏览器登录，你可以用GitHub账号登录

### 步骤3：部署项目
```bash
cd /Users/guojiaqi/Documents/cursor编程/内驱力1v1诊断图文版/diagnosis-system
vercel
```

按照提示操作：
1. ? Set up and deploy? **Y**
2. ? Which scope? **选择你的账号**
3. ? Link to existing project? **N**
4. ? What's your project's name? **diagnosis-system**
5. ? In which directory is your code located? **./**
6. ? Want to override settings? **N**

### 步骤4：配置环境变量
部署成功后，访问 https://vercel.com/dashboard

1. 进入你的项目
2. 点击 **Settings** → **Environment Variables**
3. 添加以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://fxionamswzlywcmoidds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4aW9uYW1zd3pseXdjbW9pZGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MDE0NDAsImV4cCI6MjA4MjM3NzQ0MH0.potVEzUmaXb5hDtZKdBFufIvZBTIItJZ_U3scXMfj0s
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4aW9uYW1zd3pseXdjbW9pZGRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjgwMTQ0MCwiZXhwIjoyMDgyMzc3NDQwfQ.rWUw9cy6jcqTwRzwNFOnBD82oMmLadkWkpofiBDsgyQ
DATABASE_URL=postgresql://postgres:GJQ19920820GUOJIAQI@db.fxionamswzlywcmoidds.supabase.co:6543/postgres?pgbouncer=true
```

### 步骤5：重新部署
添加环境变量后，点击 **Redeploy** 按钮

### 步骤6：访问你的网站
部署成功后，Vercel会给你一个域名，比如：
```
https://diagnosis-system.vercel.app
```

---

## 📌 方案2：国内服务器部署（需要购买服务器）

### 推荐云服务商
1. **腾讯云** https://cloud.tencent.com/
2. **阿里云** https://www.aliyun.com/

### 服务器配置建议
- CPU: 2核
- 内存: 4GB
- 系统: Ubuntu 20.04
- 价格: 约100-200元/年

### 部署步骤

#### 1. 购买服务器
在腾讯云/阿里云购买轻量应用服务器

#### 2. 安装Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 3. 安装PM2（进程管理器）
```bash
sudo npm install -g pm2
```

#### 4. 上传代码
```bash
# 在本地打包代码
cd /Users/guojiaqi/Documents/cursor编程/内驱力1v1诊断图文版/diagnosis-system
npm run build
tar -czf diagnosis-system.tar.gz .next package.json package-lock.json public

# 上传到服务器（替换为你的服务器IP）
scp diagnosis-system.tar.gz root@你的服务器IP:/root/

# SSH登录服务器
ssh root@你的服务器IP

# 解压
cd /root
mkdir -p /var/www/diagnosis-system
tar -xzf diagnosis-system.tar.gz -C /var/www/diagnosis-system
cd /var/www/diagnosis-system
npm install --production
```

#### 5. 配置环境变量
```bash
nano /var/www/diagnosis-system/.env
```

粘贴环境变量（和Vercel一样的配置）

#### 6. 启动应用
```bash
pm2 start npm --name "diagnosis-system" -- start
pm2 save
pm2 startup
```

#### 7. 配置Nginx（可选，用于域名访问）
```bash
sudo apt install nginx

sudo nano /etc/nginx/sites-available/diagnosis-system
```

添加配置：
```nginx
server {
    listen 80;
    server_name 你的域名.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启动Nginx：
```bash
sudo ln -s /etc/nginx/sites-available/diagnosis-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 8. 配置HTTPS（可选）
安装SSL证书：
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 你的域名.com
```

---

## 🎯 快速开始推荐

**如果你：**
- ✅ 想快速部署 → 用Vercel（5分钟搞定）
- ✅ 想国内访问快 → 买腾讯云轻量服务器（100元/年）
- ✅ 不想折腾 → 直接用Vercel，虽然慢一点但能用

**老王我的建议：**
先用Vercel快速部署测试，如果觉得访问慢再考虑国内服务器！

---

## 📞 需要帮助？

如果部署过程中遇到问题，告诉老王我具体的错误信息！

---

## ✅ 部署成功后

1. 访问你的网站地址
2. 测试填写问卷
3. 测试提交功能
4. 测试报告查询功能

全部正常就可以发给朋友使用了！🎉
