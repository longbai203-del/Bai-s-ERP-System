// src/index.js - Bai's ERP System Backend
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// 导入数据库连接
const supabase = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// 中间件配置
// ============================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ============================================================
// 健康检查端点
// ============================================================
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: "Bai's ERP System Backend",
        version: "3.0.0"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

// ============================================================
// API 路由
// ============================================================

// 根路径
app.get("/", (req, res) => {
    res.json({
        name: "Bai's ERP System API",
        version: "3.0.0",
        description: "Enterprise Resource Planning System",
        endpoints: {
            health: "/api/health",
            api: "/api",
            test_supabase: "/api/test-supabase"
        }
    });
});

// API 版本信息
app.get("/api", (req, res) => {
    res.json({
        version: "3.0.0",
        status: "operational",
        endpoints: [
            "/api/auth",
            "/api/users",
            "/api/products",
            "/api/orders",
            "/api/customers",
            "/api/dashboard",
            "/api/test-supabase"
        ]
    });
});

// ============================================================
// 测试 Supabase 连接
// ============================================================
app.get("/api/test-supabase", async (req, res) => {
    try {
        // 尝试查询 users 表
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .limit(1);

        if (error) {
            // 如果 users 表不存在，尝试查询其他表
            const { data: testData, error: testError } = await supabase
                .from("products")
                .select("*")
                .limit(1);
                
            if (testError) {
                return res.json({
                    success: true,
                    message: "Supabase connected, but no tables found",
                    error: testError.message,
                    hint: "Please create tables in your Supabase database"
                });
            }
            
            return res.json({
                success: true,
                message: "Supabase connection successful",
                data: testData
            });
        }

        res.json({
            success: true,
            message: "Supabase connection successful",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        });
    }
});

// ============================================================
// 404 处理
// ============================================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        path: req.originalUrl
    });
});

// ============================================================
// 错误处理中间件
// ============================================================
app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
    res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "development" ? err.message : undefined
    });
});

// ============================================================
// 启动服务器
// ============================================================
app.listen(PORT, () => {
    console.log("=".repeat(60));
    console.log("🚀 Bai's ERP System Backend");
    console.log("=".repeat(60));
    console.log(`📡 Server:    http://localhost:${PORT}`);
    console.log(`❤️  Health:    http://localhost:${PORT}/api/health`);
    console.log(`📊 API Root:  http://localhost:${PORT}/api`);
    console.log(`🔗 Supabase:  ${process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "Not configured"}`);
    console.log("=".repeat(60));
    console.log("✅ Server is ready to accept requests");
});

module.exports = app;
