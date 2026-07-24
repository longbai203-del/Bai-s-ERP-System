@echo off
echo ========================================
echo   Bai's ERP System ????
echo ========================================
echo.

echo [1/3] ?? MongoDB...
docker start mongodb 2>nul || docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest
echo ? MongoDB ???

echo.
echo [2/3] ????...
start cmd /k "cd backend && npm run dev"

echo.
echo [3/3] ????...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   ? ??????
echo   ??: http://localhost:5173
echo   ??: http://localhost:3000
echo   API??: http://localhost:3000/api-docs
echo ========================================
