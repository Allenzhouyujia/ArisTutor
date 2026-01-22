@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo Vercel 环境变量设置
echo ========================================
echo.
echo 正在添加环境变量到 Vercel...
echo.

vercel env add VITE_SUPABASE_URL production
echo https://dghgfkgaznqqzdgyvrai.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnaGdma2dhem5xcXpkZ3l2cmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjgzMTAsImV4cCI6MjA4NDYwNDMxMH0.PyjJS7Nv7BTiOO1DHiQh7CrG7KDl86zP7iy1T5PeDb0

vercel env add VITE_AGORA_APP_ID production
echo 6d789757c5bb42bab9dbb833fc4f895c

echo.
echo ========================================
echo 环境变量设置完成！
echo ========================================
pause
