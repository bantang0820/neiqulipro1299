#!/bin/bash

# 老王的一键部署脚本 - 腾讯云专用
# 使用方法：在服务器上运行这个脚本

set -e  # 遇到错误立即退出

echo "🚀 老王开始部署了，别tm乱动！"
echo ""

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
  echo "❌ 请用root用户运行这个脚本！"
  exit 1
fi

# 1. 更新系统
echo "📦 第一步：更新系统..."
apt update && apt upgrade -y

# 2. 安装Node.js 18
echo "📦 第二步：安装Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 3. 安装PM2
echo "📦 第三步：安装PM2..."
npm install -g pm2

# 4. 安装Git
echo "📦 第四步：安装Git..."
apt install -y git

# 5. 创建项目目录
echo "📦 第五步：创建项目目录..."
mkdir -p /var/www/diagnosis-system
cd /var/www/diagnosis-system

# 检查压缩包是否存在
if [ ! -f "/root/diagnosis-system.tar.gz" ]; then
  echo "❌ 错误：找不到 /root/diagnosis-system.tar.gz"
  echo "请先上传文件！"
  exit 1
fi

# 6. 解压文件
echo "📦 第六步：解压文件..."
tar -xzf /root/diagnosis-system.tar.gz -C /var/www/diagnosis-system

# 7. 安装依赖
echo "📦 第七步：安装依赖..."
npm install --production

# 8. 生成Prisma客户端
echo "📦 第八步：生成Prisma客户端..."
npx prisma generate

# 9. 检查环境变量文件
if [ ! -f ".env" ]; then
  echo "⚠️  警告：.env文件不存在"
  echo "请手动创建.env文件并添加环境变量！"
  echo ""
  echo "运行以下命令创建："
  echo "nano /var/www/diagnosis-system/.env"
  exit 1
fi

# 10. 停止旧的进程（如果存在）
echo "📦 第九步：停止旧进程..."
pm2 delete diagnosis-system 2>/dev/null || true

# 11. 启动应用
echo "📦 第十步：启动应用..."
pm2 start npm --name "diagnosis-system" -- start

# 12. 保存PM2配置
echo "📦 第十一步：保存PM2配置..."
pm2 save
pm2 startup

# 13. 显示状态
echo ""
echo "✅ 部署完成！"
echo ""
echo "📊 应用状态："
pm2 status

echo ""
echo "🎉 恭喜！应用已启动！"
echo ""
echo "📝 访问地址："
echo "   http://你的服务器IP:3000"
echo ""
echo "📝 查看日志："
echo "   pm2 logs diagnosis-system"
echo ""
echo "📝 重启应用："
echo "   pm2 restart diagnosis-system"
echo ""
echo "📝 停止应用："
echo "   pm2 stop diagnosis-system"
echo ""
