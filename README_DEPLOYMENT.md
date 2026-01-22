# ArisTutor - 部署完成指南

## 🎉 项目已准备好部署！

所有配置文件已创建并优化。现在有两种部署方式：

---

## 方式 1：Vercel CLI 部署（推荐 - 最快）

### 步骤：

1. **安装 Vercel CLI**（如果还没安装）
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署到生产环境**
```bash
vercel --prod
```

4. **按照提示操作：**
   - Set up and deploy? → **Y**
   - Which scope? → 选择你的账号
   - Link to existing project? → **N**
   - What's your project's name? → **aristutor** (或你想要的名字)
   - In which directory is your code located? → **./** (按 Enter)
   - Want to override the settings? → **N**

5. **添加环境变量**
   部署完成后，访问 Vercel Dashboard:
   - 进入项目 > Settings > Environment Variables
   - 添加以下变量：
     - `VITE_SUPABASE_URL` = `https://dghgfkgaznqqzdgyvrai.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnaGdma2dhem5xcXpkZ3l2cmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjgzMTAsImV4cCI6MjA4NDYwNDMxMH0.PyjJS7Nv7BTiOO1DHiQh7CrG7KDl86zP7iy1T5PeDb0`
     - `VITE_AGORA_APP_ID` = `6d789757c5bb42bab9dbb833fc4f895c`
   - 保存后，点击 "Redeploy" 重新部署

6. **连接 GoDaddy 域名**
   - Vercel Dashboard > 项目 > Settings > Domains
   - 添加你的域名（例如：aristutor.com）
   - 复制 Vercel 提供的 DNS 记录
   - 去 GoDaddy DNS 管理页面添加这些记录
   - 等待 DNS 传播（5-60分钟）

---

## 方式 2：通过 GitHub 自动部署

### 步骤：

1. **初始化 Git 仓库**（如果还没有）
```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

2. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 创建新仓库（公开或私有）
   - 不要初始化 README、.gitignore 或 license

3. **推送代码到 GitHub**
```bash
git remote add origin https://github.com/你的用户名/aristutor.git
git branch -M main
git push -u origin main
```

4. **连接 Vercel**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测 Vite 配置

5. **配置环境变量**
   在导入过程中或部署后：
   - 添加上述三个环境变量
   - 点击 "Deploy"

6. **连接域名**（同方式 1 的步骤 6）

---

## ✅ 已完成的配置

### 文件已创建/更新：
- ✅ `vercel.json` - Vercel 部署配置
- ✅ `.gitignore` - Git 忽略规则
- ✅ `.env.example` - 环境变量示例
- ✅ `vite.config.ts` - 优化的生产构建
- ✅ `package.json` - 添加了生产构建脚本
- ✅ `src/lib/supabase.ts` - 使用环境变量
- ✅ `src/components/agora/AgoraVideo.tsx` - 使用环境变量

### 优化配置：
- 生产构建优化（minify, chunk splitting）
- 静态资源缓存策略
- SPA 路由配置
- 环境变量安全管理

---

## 📋 部署前检查清单

在 Supabase Dashboard 完成：
- [ ] 应用数据库迁移（运行 `003_aristutor_full_schema.sql`）
- [ ] 创建 Storage buckets：
  - [ ] `verification-documents`
  - [ ] `session-recordings`
  - [ ] `notes-files`
  - [ ] `avatars`
- [ ] 设置 Storage RLS 策略

---

## 🌐 连接 GoDaddy 域名详细步骤

### 在 Vercel：
1. Dashboard > 你的项目 > Settings > Domains
2. 输入你的域名（例如：aristutor.com）
3. 点击 "Add"
4. Vercel 会显示需要的 DNS 记录：
   - Type: **A** 或 **CNAME**
   - Name: **@** (根域名) 或 **www**
   - Value: Vercel 提供的地址

### 在 GoDaddy：
1. 登录 GoDaddy
2. 进入 "My Products" > "Domains"
3. 点击你的域名旁的 "DNS"
4. 添加/修改记录：
   - **根域名 (@)**:
     - Type: A
     - Name: @
     - Value: 76.76.21.21 (Vercel A record)
     - TTL: 600
   
   - **www 子域名**:
     - Type: CNAME
     - Name: www
     - Value: cname.vercel-dns.com
     - TTL: 600

5. 保存更改
6. 等待 DNS 传播（通常 10-60 分钟）
7. 使用 https://dnschecker.org 检查传播状态

### DNS 传播后：
- Vercel 会自动配置 SSL 证书
- 你的网站将通过 HTTPS 访问
- 全球 CDN 加速自动启用

---

## 🧪 部署后测试

访问你的网站并测试：

1. **注册/登录功能**
   - [ ] 创建新账号
   - [ ] 登录现有账号
   - [ ] 邮件验证已禁用（自动确认）

2. **Onboarding 流程**
   - [ ] 5 个步骤都能正常显示
   - [ ] 可以选择科目（Core, AP, A Level, IB, Other）
   - [ ] 可以上传验证文档
   - [ ] 完成后收到 50 credits

3. **核心功能**
   - [ ] 创建 session
   - [ ] 加入 session（用两个账号测试）
   - [ ] 视频通话正常（Agora）
   - [ ] 白板实时同步
   - [ ] 学生/导师模式切换

4. **性能检查**
   - [ ] 页面加载速度
   - [ ] 移动端响应式设计
   - [ ] 控制台无错误

---

## 🚀 自动部署设置（GitHub 集成后）

一旦连接 GitHub：
- 推送到 `main` 分支 → 自动部署到生产
- 推送到其他分支 → 自动创建预览部署
- Pull Request → 自动创建预览 URL

---

## 📞 需要帮助？

如果遇到问题：
1. 检查 Vercel Dashboard > Logs
2. 检查 Supabase Dashboard > Logs
3. 检查浏览器控制台
4. 验证环境变量是否正确设置

---

## 🎊 恭喜！

完成部署后，你的 ArisTutor 平台将：
- ✅ 通过自定义域名访问
- ✅ HTTPS 自动启用
- ✅ 全球 CDN 加速
- ✅ 自动扩展
- ✅ 零停机部署
- ✅ 实时分析和日志
