# 🚀 腾讯云服务器部署教程 - 老王手把手教你

## 📋 准备工作

### 你需要准备：
1. ✅ 身份证（实名认证用）
2. ✅ 手机号（接收验证码）
3. ✅ 微信或支付宝（付款）
4. ✅ 电脑（Mac/Windows都行）

---

## 🛒 第一步：购买腾讯云服务器（10分钟）

### 1.1 访问腾讯云
打开浏览器，访问：
```
https://cloud.tencent.com/product/lighthouse
```

### 1.2 选择服务器配置
老王我已经给你标好了，照着选就行：

| 配置项 | 选择 |
|--------|------|
| **实例类型** | 轻量应用服务器 |
| **地域** | 选择离你最近的（北京/上海/广州/成都） |
| **镜像** | Ubuntu 20.04 或 Ubuntu 22.04 |
| **套餐** | 2核4GB（约100-200元/年）|
| **时长** | 1年 |

### 1.3 购买
1. 点击"立即购买"
2. 实名认证（需要身份证）
3. 微信/支付宝付款
4. 等待1-5分钟，服务器创建完成

**完成后你会看到：**
- 服务器公网IP（类似：123.45.67.89）
- 这个IP地址记下来，后面要用！

---

## 🔐 第二步：设置服务器密码（3分钟）

### 2.1 进入服务器控制台
1. 访问：https://console.cloud.tencent.com/lighthouse/instance
2. 找到你刚买的服务器
3. 点击右侧的"更多" → "管理" → "重置密码"

### 2.2 设置密码
- **用户名**：root（默认，不用改）
- **密码**：你自己设一个，**记下来！**

老王提示：密码要包含大小写字母+数字，比如：`MyPassword123`

---

## 💻 第三步：连接服务器（5分钟）

### 方法A：Mac用户（最简单）

打开终端（Terminal），输入：
```bash
ssh root@你的服务器IP
```

比如你的IP是123.45.67.89，就输入：
```bash
ssh root@123.45.67.89
```

然后：
1. 输入密码（输入时不会显示，正常）
2. 输入完成后按回车
3. 看到类似 `root@VM-X-X-X:~#` 就成功了！

### 方法B：Windows用户

你需要下载一个SSH工具：
- 推荐 **FinalShell**（免费，界面友好）
- 下载地址：http://www.hostbuf.com/

安装后：
1. 新建连接
2. 主机：你的服务器IP
3. 用户名：root
4. 密码：你刚才设置的密码
5. 点击连接

---

## 🔧 第四步：安装环境（15分钟）

### 4.1 更新系统
连接成功后，复制粘贴下面这行命令，按回车：

```bash
apt update && apt upgrade -y
```

等它跑完（大约1-2分钟）

### 4.2 安装Node.js 18
复制粘贴：

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
```

然后再复制粘贴：

```bash
apt-get install -y nodejs
```

### 4.3 安装PM2（进程管理器）
复制粘贴：

```bash
npm install -g pm2
```

### 4.4 安装Git
复制粘贴：

```bash
apt install -y git
```

---

## 📦 第五步：上传代码（10分钟）

### 5.1 在本地打包代码

**在你的Mac电脑上**打开终端，输入：

```bash
cd /Users/guojiaqi/Documents/cursor编程/内驱力1v1诊断图文版/diagnosis-system
npm run build
tar -czf diagnosis-system.tar.gz .next package.json package-lock.json public prisma
```

这一步会生成一个 `diagnosis-system.tar.gz` 压缩包

### 5.2 上传到服务器

**在你的Mac电脑上**继续输入（替换为你的服务器IP）：

```bash
scp diagnosis-system.tar.gz root@你的服务器IP:/root/
```

比如：
```bash
scp diagnosis-system.tar.gz root@123.45.67.89:/root/
```

输入密码后，等待上传完成

---

## 🚀 第六步：部署启动（10分钟）

### 6.1 回到服务器终端

现在**切换到服务器SSH终端**（刚才连接的那个）

### 6.2 创建项目目录
复制粘贴：

```bash
mkdir -p /var/www/diagnosis-system
cd /var/www/diagnosis-system
```

### 6.3 解压文件
复制粘贴：

```bash
tar -xzf /root/diagnosis-system.tar.gz -C /var/www/diagnosis-system
```

### 6.4 安装依赖
复制粘贴：

```bash
npm install --production
```

等它跑完（大约1-2分钟）

### 6.5 生成Prisma客户端
复制粘贴：

```bash
npx prisma generate
```

### 6.6 配置环境变量
复制粘贴：

```bash
nano /var/www/diagnosis-system/.env
```

这会打开一个编辑器，**把下面这些内容复制粘贴进去**：

```env
NEXT_PUBLIC_SUPABASE_URL=https://fxionamswzlywcmoidds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4aW9uYW1zd3pseXdjbW9pZGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MDE0NDAsImV4cCI6MjA4MjM3NzQ0MH0.potVEzUmaXb5hDtZKdBFufIvZBTIItJZ_U3scXMfj0s
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4aW9uYW1zd3pseXdjbW9pZGRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjgwMTQ0MCwiZXhwIjoyMDgyMzc3NDQwfQ.rWUw9cy6jcqTwRzwNFOnBD82oMmLadkWkpofiBDsgyQ
DATABASE_URL=postgresql://postgres:GJQ19920820GUOJIAQI@db.fxionamswzlywcmoidds.supabase.co:6543/postgres?pgbouncer=true
NODE_ENV=production
```

然后：
1. 按 `Ctrl + O` 保存
2. 按 `Enter` 确认
3. 按 `Ctrl + X` 退出

### 6.7 启动应用
复制粘贴：

```bash
pm2 start npm --name "diagnosis-system" -- start
```

### 6.8 保存PM2配置
复制粘贴：

```bash
pm2 save
pm2 startup
```

然后复制粘贴它给你的那行命令（类似 `sudo env PATH=...`）

### 6.9 查看运行状态
复制粘贴：

```bash
pm2 status
```

看到 `diagnosis-system` 是 `online` 状态就成功了！

---

## 🎉 第七步：测试访问（2分钟）

打开浏览器，访问：

```
http://你的服务器IP:3000
```

比如：
```
http://123.45.67.89:3000
```

能看到你的网站就成功了！

---

## 🌐 第八步：配置域名（可选，10分钟）

如果你有域名，可以配置一下（没有域名可以跳过这步）

### 8.1 解析域名
1. 登录你的域名服务商（阿里云/腾讯云/GoDaddy等）
2. 添加DNS解析：
   - 记录类型：A
   - 主机记录：@
   - 记录值：你的服务器IP
   - TTL：600

### 8.2 安装Nginx
回到服务器终端，复制粘贴：

```bash
apt install -y nginx
```

### 8.3 配置Nginx
复制粘贴：

```bash
nano /etc/nginx/sites-available/diagnosis-system
```

**把下面这些内容复制粘贴进去**（替换你的域名）：

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

然后：
1. 按 `Ctrl + O` 保存
2. 按 `Enter` 确认
3. 按 `Ctrl + X` 退出

### 8.4 启用配置
复制粘贴：

```bash
ln -s /etc/nginx/sites-available/diagnosis-system /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 8.5 配置HTTPS（免费SSL证书）
复制粘贴：

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d 你的域名.com
```

按照提示操作（输入邮箱、同意条款）

完成后，访问：
```
https://你的域名.com
```

就能看到带小绿锁的HTTPS网站了！

---

## 📊 服务器管理常用命令

### 查看应用状态
```bash
pm2 status
```

### 重启应用
```bash
pm2 restart diagnosis-system
```

### 停止应用
```bash
pm2 stop diagnosis-system
```

### 查看日志
```bash
pm2 logs diagnosis-system
```

### 清空日志
```bash
pm2 flush
```

---

## 🎯 完成检查清单

部署完成后，测试以下功能：

- [ ] 首页能打开
- [ ] 问卷能填写
- [ ] 提交成功
- [ ] 管理员页面能访问
- [ ] 能上传报告
- [ ] 能查询报告
- [ ] 能在线查看报告
- [ ] 能下载报告

全部OK就可以发给朋友用了！🎉

---

## 💰 费用总结

- **服务器**：100-200元/年
- **域名（可选）**：10-50元/年
- **HTTPS证书**：免费

**总费用：100-250元/年**（平均一个月20块钱以内）

---

## 🆘 遇到问题？

### 常见问题：

**Q1: 连接服务器提示 "Connection refused"**
- 等待5分钟再试（服务器还在初始化）
- 检查IP地址是否正确

**Q2: PM2启动失败**
- 检查日志：`pm2 logs diagnosis-system`
- 检查环境变量：`cat /var/www/diagnosis-system/.env`

**Q3: 网站打不开**
- 检查PM2状态：`pm2 status`
- 检查端口是否开放：腾讯云控制台 → 防火墙 → 添加规则 3000端口

**Q4: 数据库连接失败**
- 检查.env文件是否正确
- 检查Supabase是否正常运行

---

## 📞 找老王

如果实在搞不定，告诉老王我：
1. 具体在哪一步卡住了
2. 报错信息是什么（截图更好）

老王我帮你解决！

---

## ⏱️ 时间预估

- 购买服务器：10分钟
- 安装环境：15分钟
- 上传部署：15分钟
- 测试验证：10分钟

**总计：约50分钟-1小时**

---

好了，老王我能帮的都帮了，接下来看你的操作了！💪
