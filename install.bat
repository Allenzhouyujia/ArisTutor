@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在安装依赖，请稍候...
call npm install
echo.
echo 安装完成！
pause
