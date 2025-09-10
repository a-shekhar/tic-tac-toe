@echo off
REM Installs deps (if needed) and starts Vite dev server
cd /d %~dp0
npm i
npm run dev
