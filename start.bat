@echo off
echo Starting Bai's ERP System...

REM Start Backend
start cmd /k "cd backend && npm install && npm run dev"

REM Start Frontend
start cmd /k "cd frontend && npm install && npm run dev"

echo ✅ Services started successfully!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:3000