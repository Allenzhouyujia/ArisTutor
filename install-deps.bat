@echo off
echo ========================================
echo Installing Dependencies
echo ========================================

cd /d "%~dp0"

echo Cleaning up old installations...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Installing npm packages...
call npm install

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
pause
