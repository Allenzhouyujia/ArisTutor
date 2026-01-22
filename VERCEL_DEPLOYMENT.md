# Vercel 部署指南

## 环境变量配置

在 Vercel 部署时，需要配置以下环境变量：

### 必需的环境变量：
1. `VITE_SUPABASE_URL` = `https://dghgfkgaznqqzdgyvrai.supabase.co`
2. `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnaGdma2dhem5xcXpkZ3l2cmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjgzMTAsImV4cCI6MjA4NDYwNDMxMH0.PyjJS7Nv7BTiOO1DHiQh7CrG7KDl86zP7iy1T5PeDb0`
3. `VITE_AGORA_APP_ID` = `6d789757c5bb42bab9dbb833fc4f895c`

## 部署步骤

项目已准备好部署到 Vercel。

### 部署后需要做的事：

1. **配置环境变量**：在 Vercel Dashboard 中添加上述环境变量
2. **连接域名**：在 Vercel 项目设置中添加你的 GoDaddy 域名
3. **配置 DNS**：在 GoDaddy 中设置 DNS 记录指向 Vercel
4. **测试功能**：确保所有功能正常工作

## 项目配置文件

- ✅ `vercel.json` - Vercel 配置
- ✅ `.gitignore` - Git 忽略文件
- ✅ `vite.config.ts` - 优化的生产构建配置
- ✅ 环境变量已配置使用 `import.meta.env`
