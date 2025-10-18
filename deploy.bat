@echo off
echo 🚀 Xstream Deployment Script
echo ==============================

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - Xstream Football Streaming Platform"
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo 📋 Next Steps:
echo 1. Create a new repository on GitHub
echo 2. Add the remote origin:
echo    git remote add origin https://github.com/YOUR_USERNAME/xstream-football.git
echo 3. Push to GitHub:
echo    git push -u origin main
echo.
echo 4. Follow the DEPLOYMENT.md guide for Vercel deployment
echo.
echo 🎯 Your project is ready for deployment!
pause
