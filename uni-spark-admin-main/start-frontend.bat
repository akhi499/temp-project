@echo off
echo Starting frontend development server...
cd /d "%~dp0"
npm install
npm run dev
pause
