@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在安装依赖...
call npm install
echo.
echo 依赖安装完成！
echo.
echo 正在启动开发服务器...
echo.
echo ========================================
echo 重要提示：
echo 1. 服务器启动后，会显示 Network 地址（例如：http://192.168.1.100:3000）
echo 2. 在手机上访问这个地址即可
echo 3. 确保手机和电脑在同一WiFi网络
echo ========================================
echo.
call npm run dev
