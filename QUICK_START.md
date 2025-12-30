# 🎯 腾讯云部署 - 快速开始指南

## 📋 老王给你的部署流程

### 第一步：购买服务器（10分钟）
1. 访问：https://cloud.tencent.com/product/lighthouse
2. 选择配置：
   - 2核4GB
   - Ubuntu 20.04
   - 1年（约100-200元）
3. 付款，等待创建完成
4. **记下你的服务器IP地址！**

---

### 第二步：连接服务器（5分钟）

**Mac用户：**
打开终端，输入：
```bash
ssh root@你的服务器IP
```
输入密码后连接成功

**Windows用户：**
下载FinalShell：http://www.hostbuf.com/
- 主机：你的服务器IP
- 用户：root
- 密码：你设置的密码

---

### 第三步：上传部署文件（10分钟）

**在你的Mac电脑上**打开终端，依次输入：

```bash
# 1. 进入项目目录
cd /Users/guojiaqi/Documents/cursor编程/内驱力1v1诊断图文版/diagnosis-system

# 2. 打包项目
npm run build
tar -czf diagnosis-system.tar.gz .next package.json package-lock.json public prisma .env
```

**上传到服务器：**
```bash
# 上传文件（替换为你的服务器IP）
scp diagnosis-system.tar.gz root@你的服务器IP:/root/
```

**上传部署脚本：**
```bash
scp deploy.sh root@你的服务器IP:/root/
```

---

### 第四步：一键部署（5分钟）

**回到服务器SSH终端**，依次输入：

```bash
# 给脚本添加执行权限
chmod +x /root/deploy.sh

# 运行部署脚本
/root/deploy.sh
```

脚本会自动完成所有配置！

---

### 第五步：测试访问（2分钟）

打开浏览器，访问：
```
http://你的服务器IP:3000
```

看到网站就成功了！🎉

---

## ✅ 部署完成检查清单

- [ ] 首页能打开
- [ ] 能填写问卷
- [ ] 能提交
- [ ] 管理员页面能用
- [ ] 能上传报告
- [ ] 能查询报告

---

## 📝 常用命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs diagnosis-system

# 重启应用
pm2 restart diagnosis-system

# 停止应用
pm2 stop diagnosis-system
```

---

## 💰 费用

- 服务器：100-200元/年
- 域名（可选）：10-50元/年

**总计：100-250元/年**

---

## 🆘 遇到问题？

查看详细文档：`TENCENT_DEPLOY.md`

或者告诉老王我具体的错误信息！

---

## 🎯 整个流程时间

- 购买服务器：10分钟
- 连接配置：5分钟
- 打包上传：10分钟
- 一键部署：5分钟
- 测试验证：5分钟

**总计：35-40分钟**

---

好了，开始操作吧！有问题随时叫老王！💪
