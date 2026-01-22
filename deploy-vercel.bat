@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo ArisTutor - Vercel 部署脚本
echo ========================================
echo.

echo 步骤 1: 检查 Vercel CLI
call vercel --version
if errorlevel 1 (
    echo Vercel CLI 未安装，正在安装...
    call npm install -g vercel
)

echo.
echo 步骤 2: 登录 Vercel
echo 请在浏览器中完成登录...
call vercel login

echo.
echo 步骤 3: 部署到生产环境
echo 正在部署...
call vercel --prod

echo.
echo ========================================
echo 部署完成!
echo ========================================
echo.
echo 下一步:
echo 1. 访问 Vercel Dashboard 添加环境变量
echo 2. 在项目设置中添加你的 GoDaddy 域名
echo 3. 在 GoDaddy 配置 DNS 记录
echo.
echo 详细步骤请查看: README_DEPLOYMENT.md
echo.
pause
