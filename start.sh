#!/bin/bash

echo "========================================"
echo "  Bai's ERP System 启动脚本"
echo "========================================"
echo ""

echo "[1/3] 启动 MongoDB..."
docker start mongodb 2>/dev/null || docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest
echo "✅ MongoDB 已启动"

echo ""
echo "[2/3] 启动后端..."
cd backend && npm run dev &
cd ..

echo ""
echo "[3/3] 启动前端..."
cd frontend && npm run dev &
cd ..

echo ""
echo "========================================"
echo "  ✅ 系统已启动！"
echo "  前端: http://localhost:5173"
echo "  后端: http://localhost:3000"
echo "  API文档: http://localhost:3000/api-docs"
echo "========================================"
