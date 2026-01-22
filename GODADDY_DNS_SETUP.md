# GoDaddy 域名连接指南

## 第一步：在 Vercel 添加域名

1. **登录 Vercel Dashboard**
   - 访问：https://vercel.com/dashboard
   - 选择你的 ArisTutor 项目

2. **进入域名设置**
   - 点击项目名称
   - 左侧菜单选择 **Settings**
   - 选择 **Domains** 标签

3. **添加域名**
   - 在 "Add Domain" 输入框中输入你的域名
   - 例如：`aristutor.com` 或 `www.aristutor.com`
   - 点击 **Add** 按钮

4. **获取 DNS 记录**
   Vercel 会显示需要配置的 DNS 记录，通常是：
   
   **选项 A：A 记录（推荐用于根域名）**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 600
   ```
   
   **选项 B：CNAME 记录（用于子域名）**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 600
   ```

---

## 第二步：在 GoDaddy 配置 DNS

### 1. 登录 GoDaddy
- 访问：https://www.godaddy.com
- 登录你的账号

### 2. 进入域名管理
- 点击右上角的用户名
- 选择 **"My Products"** 或 **"我的产品"**
- 找到你的域名列表

### 3. 打开 DNS 管理
- 在你的域名旁边，点击 **"DNS"** 或 **"管理 DNS"**
- 或者点击域名，然后选择 **"Manage DNS"**

### 4. 配置根域名 (@)

**如果要配置根域名（例如：aristutor.com）：**

1. 找到现有的 A 记录（Type: A, Name: @）
2. 点击 **"Edit"** 或铅笔图标
3. 更改为：
   - **Type**: A
   - **Name**: @
   - **Value/Points to**: `76.76.21.21`
   - **TTL**: 600 秒（或选择 10 分钟）
4. 点击 **"Save"**

### 5. 配置 www 子域名

**添加 www 子域名支持：**

1. 点击 **"Add"** 或 **"Add Record"**
2. 选择记录类型：**CNAME**
3. 填写：
   - **Type**: CNAME
   - **Name**: www
   - **Value/Points to**: `cname.vercel-dns.com`
   - **TTL**: 600 秒
4. 点击 **"Save"**

### 6. 删除冲突记录（如果需要）

GoDaddy 默认可能有一些停放页面(Parked)记录，需要删除：

- 查找任何指向 GoDaddy 停放服务器的 A 记录
- 查找任何 CNAME 记录指向 `@` 或 `parking`
- 点击垃圾桶图标删除这些记录

---

## 第三步：等待 DNS 传播

### DNS 传播时间
- **最快**：5-10 分钟
- **通常**：30-60 分钟
- **最长**：24-48 小时（极少情况）

### 检查 DNS 传播状态

**使用在线工具：**
1. 访问：https://dnschecker.org
2. 输入你的域名（例如：aristutor.com）
3. 选择记录类型：A 或 CNAME
4. 点击 "Search"
5. 查看全球各地的 DNS 服务器是否已更新

**使用命令行：**

Windows PowerShell:
```powershell
nslookup aristutor.com
```

Mac/Linux Terminal:
```bash
dig aristutor.com
```

---

## 第四步：在 Vercel 验证域名

1. **返回 Vercel Dashboard**
   - Settings > Domains

2. **检查域名状态**
   - ✅ 绿色勾号 = 已验证，DNS 配置正确
   - ⚠️ 黄色警告 = DNS 正在传播中
   - ❌ 红色叉号 = DNS 配置错误

3. **自动 SSL 证书**
   - 域名验证成功后，Vercel 会自动配置 SSL 证书
   - 通常在几分钟内完成
   - 你的网站将自动启用 HTTPS

---

## 常见 DNS 配置示例

### 配置 1：只使用根域名 (aristutor.com)
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600
```

### 配置 2：同时支持根域名和 www
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

### 配置 3：只使用 www 子域名
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

---

## 故障排除

### 问题 1：域名无法访问
**检查：**
- DNS 记录是否正确配置
- 使用 dnschecker.org 验证
- 等待足够的传播时间（至少 30 分钟）

### 问题 2：显示 "ERR_SSL_PROTOCOL_ERROR"
**解决：**
- Vercel 还在配置 SSL 证书，等待 5-10 分钟
- 清除浏览器缓存
- 尝试无痕/隐私模式

### 问题 3：显示 GoDaddy 停放页面
**解决：**
- DNS 记录可能还没生效
- 检查是否删除了所有旧的停放记录
- 清除 DNS 缓存：`ipconfig /flushdns` (Windows)

### 问题 4：Vercel 显示 "Invalid Configuration"
**解决：**
- 确认 A 记录指向正确的 IP：76.76.21.21
- 确认 CNAME 记录指向：cname.vercel-dns.com
- 不要在 CNAME 值末尾添加句号

---

## 最终检查清单

DNS 配置完成后，验证：

- [ ] 访问 http://你的域名.com 能跳转到 HTTPS
- [ ] 访问 https://你的域名.com 显示你的网站
- [ ] 访问 https://www.你的域名.com 也能访问（如果配置了 www）
- [ ] SSL 证书显示为有效（浏览器地址栏显示锁图标）
- [ ] Vercel Dashboard 中域名状态为绿色勾号
- [ ] 网站所有功能正常工作（注册、登录、视频等）

---

## 成功！

完成后，你的 ArisTutor 网站将：
- ✅ 通过自定义域名访问
- ✅ 自动 HTTPS 加密
- ✅ 全球 CDN 加速
- ✅ 自动续期 SSL 证书
- ✅ 支持自动重定向（HTTP → HTTPS）
