# ============================================
# ERP 系统后端缺失文件一键生成脚本
# 生成时间: 2026-07-23
# ============================================

$ErrorActionPreference = "Stop"

# 获取脚本所在目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 检测 backend 目录
if (Test-Path (Join-Path $ScriptDir "backend")) {
    $BackendDir = Join-Path $ScriptDir "backend"
} elseif (Test-Path (Join-Path $ScriptDir "src")) {
    $BackendDir = $ScriptDir
} else {
    $BackendDir = $ScriptDir
    Write-Host "⚠️ 未找到 backend 目录，使用当前目录: $BackendDir" -ForegroundColor Yellow
}

if ([string]::IsNullOrEmpty($BackendDir)) {
    Write-Host "❌ 错误: 无法确定 backend 目录路径" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ERP 系统后端缺失文件生成器" -ForegroundColor Cyan
Write-Host "目标目录: $BackendDir" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (-not (Test-Path $BackendDir)) {
    Write-Host "❌ 错误: 目录不存在: $BackendDir" -ForegroundColor Red
    exit 1
}

# ============================================
# 辅助函数：安全写入文件
# ============================================
function Write-FileContent {
    param(
        [string]$Path,
        [string]$Content
    )
    $Content | Out-File -FilePath $Path -Encoding UTF8 -ErrorAction SilentlyContinue
    if ($?) {
        Write-Host "  ✅ 已生成: $Path" -ForegroundColor Green
    } else {
        Write-Host "  ❌ 生成失败: $Path" -ForegroundColor Red
    }
}

# ============================================
# 1. 测试文件 (34 个)
# ============================================
Write-Host "`n📁 生成测试文件..." -ForegroundColor Green

# 创建目录
$testDirs = @(
    "tests/unit/repositories",
    "tests/unit/services",
    "tests/unit/utils",
    "tests/integration/api",
    "tests/integration/database",
    "tests/integration/middleware",
    "tests/fixtures",
    "tests/setup"
)

foreach ($dir in $testDirs) {
    $fullPath = Join-Path $BackendDir $dir
    New-Item -Path $fullPath -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
}

# 1.1 Repository 单元测试 (8 个)
$repoTestFiles = @(
    "BaseRepository.test.ts",
    "Customer.repository.test.ts",
    "Finance.repository.test.ts",
    "HR.repository.test.ts",
    "Inventory.repository.test.ts",
    "Order.repository.test.ts",
    "Product.repository.test.ts",
    "Settings.repository.test.ts"
)

foreach ($file in $repoTestFiles) {
    $path = Join-Path $BackendDir "tests/unit/repositories/$file"
    $content = @"
/**
 * @file $file
 * @description $file 单元测试
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('$file', () => {
    let instance: any;

    beforeEach(() => {
        // TODO: 初始化测试实例
    });

    afterEach(() => {
        // TODO: 清理测试数据
    });

    describe('基础 CRUD 操作', () => {
        it('应该成功创建数据', () => {
            // TODO: 实现创建测试
            expect(true).toBe(true);
        });

        it('应该成功读取数据', () => {
            // TODO: 实现读取测试
            expect(true).toBe(true);
        });

        it('应该成功更新数据', () => {
            // TODO: 实现更新测试
            expect(true).toBe(true);
        });

        it('应该成功删除数据', () => {
            // TODO: 实现删除测试
            expect(true).toBe(true);
        });
    });

    describe('业务查询方法', () => {
        it('应该支持搜索功能', () => {
            // TODO: 实现搜索测试
            expect(true).toBe(true);
        });

        it('应该支持分页查询', () => {
            // TODO: 实现分页测试
            expect(true).toBe(true);
        });
    });
});
"@
    Write-FileContent -Path $path -Content $content
}

# 1.2 Service 单元测试 (7 个)
$serviceTestFiles = @(
    "Customer.service.test.ts",
    "Finance.service.test.ts",
    "HR.service.test.ts",
    "Inventory.service.test.ts",
    "Order.service.test.ts",
    "Product.service.test.ts",
    "Settings.service.test.ts"
)

foreach ($file in $serviceTestFiles) {
    $path = Join-Path $BackendDir "tests/unit/services/$file"
    $content = @"
/**
 * @file $file
 * @description $file 单元测试
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('$file', () => {
    let service: any;

    beforeEach(() => {
        // TODO: 初始化服务实例
    });

    afterEach(() => {
        // TODO: 清理测试数据
    });

    describe('业务逻辑测试', () => {
        it('应该成功执行业务操作', () => {
            // TODO: 实现业务逻辑测试
            expect(true).toBe(true);
        });

        it('应该正确处理异常情况', () => {
            // TODO: 实现异常处理测试
            expect(true).toBe(true);
        });
    });
});
"@
    Write-FileContent -Path $path -Content $content
}

# 1.3 Utils 单元测试 (2 个)
$utilTestFiles = @(
    "logger.test.ts",
    "response.test.ts"
)

foreach ($file in $utilTestFiles) {
    $path = Join-Path $BackendDir "tests/unit/utils/$file"
    $content = @"
/**
 * @file $file
 * @description $file 单元测试
 */

import { describe, it, expect } from '@jest/globals';

describe('$file', () => {
    it('应该正常工作', () => {
        // TODO: 实现工具函数测试
        expect(true).toBe(true);
    });
});
"@
    Write-FileContent -Path $path -Content $content
}

# 1.4 API 集成测试 (7 个)
$apiTestFiles = @(
    "customer.api.test.ts",
    "finance.api.test.ts",
    "hr.api.test.ts",
    "inventory.api.test.ts",
    "order.api.test.ts",
    "product.api.test.ts",
    "settings.api.test.ts"
)

foreach ($file in $apiTestFiles) {
    $path = Join-Path $BackendDir "tests/integration/api/$file"
    $content = @"
/**
 * @file $file
 * @description $file 集成测试
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('$file', () => {
    beforeAll(async () => {
        // TODO: 初始化测试环境
    });

    afterAll(async () => {
        // TODO: 清理测试环境
    });

    describe('API 端点测试', () => {
        it('GET /api/xxx 应该返回列表', () => {
            // TODO: 实现 GET 列表测试
            expect(true).toBe(true);
        });

        it('GET /api/xxx/:id 应该返回详情', () => {
            // TODO: 实现 GET 详情测试
            expect(true).toBe(true);
        });

        it('POST /api/xxx 应该创建数据', () => {
            // TODO: 实现 POST 创建测试
            expect(true).toBe(true);
        });

        it('PUT /api/xxx/:id 应该更新数据', () => {
            // TODO: 实现 PUT 更新测试
            expect(true).toBe(true);
        });

        it('DELETE /api/xxx/:id 应该删除数据', () => {
            // TODO: 实现 DELETE 删除测试
            expect(true).toBe(true);
        });
    });
});
"@
    Write-FileContent -Path $path -Content $content
}

# 1.5 数据库集成测试 (2 个)
$dbTestFiles = @(
    "connection.test.ts",
    "transaction.test.ts"
)

foreach ($file in $dbTestFiles) {
    $path = Join-Path $BackendDir "tests/integration/database/$file"
    $content = @"
/**
 * @file $file
 * @description $file 集成测试
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('$file', () => {
    beforeAll(async () => {
        // TODO: 初始化数据库连接
    });

    afterAll(async () => {
        // TODO: 关闭数据库连接
    });

    it('应该成功连接数据库', () => {
        // TODO: 实现连接测试
        expect(true).toBe(true);
    });
});
"@
    Write-FileContent -Path $path -Content $content
}

# 1.6 中间件集成测试 (2 个)
$middlewareTestFiles = @(
    "auth.test.ts",
    "validator.test.ts"
)

foreach ($file in $middlewareTestFiles) {
    $path = Join-Path $BackendDir "tests/integration/middleware/$file"
    $content = @"
/**
 * @file $file
 * @description $file 集成测试
 */

import { describe, it, expect } from '@jest/globals';

describe('$file', () => {
    it('应该正确处理请求', () => {
        // TODO: 实现中间件测试
        expect(true).toBe(true);
    });
});
"@
    Write-FileContent -Path $path -Content $content
}

# 1.7 测试 Fixtures (4 个)
$fixtureFiles = @(
    "customers.ts",
    "orders.ts",
    "products.ts",
    "test-data.ts"
)

foreach ($file in $fixtureFiles) {
    $path = Join-Path $BackendDir "tests/fixtures/$file"
    $content = @"
/**
 * @file $file
 * @description 测试数据 Fixture
 */

export const testData = {
    // TODO: 定义测试数据
};

export default testData;
"@
    Write-FileContent -Path $path -Content $content
}

# 1.8 测试 Setup (2 个)
$setupFiles = @(
    "jest.setup.ts",
    "test-db.ts"
)

foreach ($file in $setupFiles) {
    $path = Join-Path $BackendDir "tests/setup/$file"
    $content = "// TODO: 配置测试环境"
    Write-FileContent -Path $path -Content $content
}

# ============================================
# 2. 环境配置文件 (5 个)
# ============================================
Write-Host "`n📁 生成环境配置文件..." -ForegroundColor Green

$envFiles = @(
    ".env.example",
    ".env.development.example",
    ".env.staging.example",
    ".env.production.example",
    ".env.test.example"
)

$envContent = @'
# ============================================
# ERP 系统环境配置文件
# ============================================

# ===== Server =====
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
API_PREFIX=/api

# ===== Database =====
DB_HOST=localhost
DB_PORT=27017
DB_NAME=erp_db
DB_USER=admin
DB_PASSWORD=password
DB_MAX_POOL_SIZE=10
DB_MIN_POOL_SIZE=2
DB_CONNECT_TIMEOUT=30000
DB_SOCKET_TIMEOUT=45000
DB_RETRY_WRITES=true
DB_SSL=false

# ===== JWT =====
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

# ===== Security =====
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true
HELMET_ENABLED=true
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
ENCRYPTION_KEY=default-encryption-key-change-me
SALT_ROUNDS=10

# ===== Logging =====
LOG_LEVEL=info
LOG_FILE=logs/app.log
LOG_MAX_SIZE=20m
LOG_MAX_FILES=30d
LOG_FORMAT=json

# ===== Redis =====
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_KEY_PREFIX=erp:

# ===== Email =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@gmail.com
SMTP_PASSWORD=password
SMTP_FROM=noreply@erp.com
SMTP_FROM_NAME=ERP System

# ===== External Services =====
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-supabase-key

# ===== Feature Flags =====
ENABLE_SWAGGER=true
ENABLE_METRICS=false
ENABLE_EMAIL=true
ENABLE_QUEUE=false

# ===== Frontend =====
FRONTEND_URL=http://localhost:5173

# ===== Upload =====
UPLOAD_MAX_SIZE=10485760
UPLOAD_DESTINATION=./uploads
UPLOAD_MAX_FILES=10
'@

foreach ($file in $envFiles) {
    $path = Join-Path $BackendDir $file
    Write-FileContent -Path $path -Content $envContent
}

# ============================================
# 3. 安全相关配置 (7 个)
# ============================================
Write-Host "`n📁 生成安全配置..." -ForegroundColor Green

New-Item -Path (Join-Path $BackendDir "src/security") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

$securityFiles = @{
    "rate-limiter.ts" = @'
/**
 * @file rate-limiter.ts
 * @description 速率限制配置
 */

export const rateLimiter = {
    // TODO: 实现速率限制配置
};

export default rateLimiter;
'@
    "helmet.config.ts" = @'
/**
 * @file helmet.config.ts
 * @description 安全头配置
 */

export const helmetConfig = {
    // TODO: 实现安全头配置
};

export default helmetConfig;
'@
    "cors.config.ts" = @'
/**
 * @file cors.config.ts
 * @description CORS 配置
 */

export const corsConfig = {
    // TODO: 实现 CORS 配置
};

export default corsConfig;
'@
    "csrf.ts" = @'
/**
 * @file csrf.ts
 * @description CSRF 保护
 */

export const csrf = {
    // TODO: 实现 CSRF 保护
};

export default csrf;
'@
    "encryption.ts" = @'
/**
 * @file encryption.ts
 * @description 加密工具
 */

export const encryption = {
    // TODO: 实现加密工具
};

export default encryption;
'@
    "audit-log.ts" = @'
/**
 * @file audit-log.ts
 * @description 审计日志
 */

export const auditLog = {
    // TODO: 实现审计日志
};

export default auditLog;
'@
    "permissions.ts" = @'
/**
 * @file permissions.ts
 * @description 权限系统
 */

export const permissions = {
    // TODO: 实现权限系统
};

export default permissions;
'@
}

foreach ($file in $securityFiles.Keys) {
    $path = Join-Path $BackendDir "src/security/$file"
    Write-FileContent -Path $path -Content $securityFiles[$file]
}

# ============================================
# 4. 数据库相关 (15 个)
# ============================================
Write-Host "`n📁 生成数据库文件..." -ForegroundColor Green

New-Item -Path (Join-Path $BackendDir "prisma/migrations") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
New-Item -Path (Join-Path $BackendDir "src/migrations") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
New-Item -Path (Join-Path $BackendDir "src/seeders") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

# 4.1 Prisma 文件
$prismaContent = @{
    "schema.prisma" = "// TODO: 定义 Prisma Schema"
    "seed.ts" = "// TODO: 实现种子数据"
}

foreach ($file in $prismaContent.Keys) {
    $path = Join-Path $BackendDir "prisma/$file"
    Write-FileContent -Path $path -Content $prismaContent[$file]
}

$prismaMigrations = @(
    "20260101000000_init.sql",
    "20260102000000_add_indexes.sql",
    "20260103000000_add_audit.sql"
)

foreach ($file in $prismaMigrations) {
    $path = Join-Path $BackendDir "prisma/migrations/$file"
    Write-FileContent -Path $path -Content "-- TODO: 定义迁移 SQL"
}

# 4.2 Mongoose 迁移文件 (4 个)
$migrationFiles = @(
    "index.ts",
    "001_init_collections.ts",
    "002_add_indexes.ts",
    "003_add_default_data.ts"
)

foreach ($file in $migrationFiles) {
    $path = Join-Path $BackendDir "src/migrations/$file"
    Write-FileContent -Path $path -Content "// TODO: 实现数据库迁移"
}

# 4.3 Seeders (6 个)
$seederFiles = @(
    "index.ts",
    "customers.seeder.ts",
    "products.seeder.ts",
    "orders.seeder.ts",
    "employees.seeder.ts",
    "settings.seeder.ts"
)

foreach ($file in $seederFiles) {
    $path = Join-Path $BackendDir "src/seeders/$file"
    Write-FileContent -Path $path -Content "// TODO: 实现种子数据"
}

# ============================================
# 5. 日志配置 (8 个)
# ============================================
Write-Host "`n📁 生成日志配置..." -ForegroundColor Green

New-Item -Path (Join-Path $BackendDir "logs") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
New-Item -Path (Join-Path $BackendDir "src/config") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

$logConfigFiles = @{
    "winston.config.ts" = @'
/**
 * @file winston.config.ts
 * @description Winston 日志配置
 */

export const winstonConfig = {
    // TODO: 实现 Winston 配置
};

export default winstonConfig;
'@
    "morgan.config.ts" = @'
/**
 * @file morgan.config.ts
 * @description HTTP 请求日志
 */

export const morganConfig = {
    // TODO: 实现 Morgan 配置
};

export default morganConfig;
'@
    "logrotate.config.ts" = @'
/**
 * @file logrotate.config.ts
 * @description 日志轮转配置
 */

export const logrotateConfig = {
    // TODO: 实现日志轮转配置
};

export default logrotateConfig;
'@
}

foreach ($file in $logConfigFiles.Keys) {
    $path = Join-Path $BackendDir "src/config/$file"
    Write-FileContent -Path $path -Content $logConfigFiles[$file]
}

# 日志目录文件 (5 个)
$logFiles = @(
    ".gitkeep",
    "app.log",
    "app-error.log",
    "access.log",
    "audit.log"
)

foreach ($file in $logFiles) {
    $path = Join-Path $BackendDir "logs/$file"
    if ($file -eq ".gitkeep") {
        Write-FileContent -Path $path -Content "# 日志目录占位文件"
    } else {
        Write-FileContent -Path $path -Content ""
    }
}

# ============================================
# 6. 监控相关 (4 个)
# ============================================
Write-Host "`n📁 生成监控配置..." -ForegroundColor Green

New-Item -Path (Join-Path $BackendDir "src/monitoring") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

$monitoringFiles = @{
    "health-check.ts" = @'
/**
 * @file health-check.ts
 * @description 健康检查
 */

export const healthCheck = {
    // TODO: 实现健康检查
};

export default healthCheck;
'@
    "metrics.ts" = @'
/**
 * @file metrics.ts
 * @description 指标采集
 */

export const metrics = {
    // TODO: 实现指标采集
};

export default metrics;
'@
    "alerting.ts" = @'
/**
 * @file alerting.ts
 * @description 告警配置
 */

export const alerting = {
    // TODO: 实现告警配置
};

export default alerting;
'@
    "tracing.ts" = @'
/**
 * @file tracing.ts
 * @description 链路追踪
 */

export const tracing = {
    // TODO: 实现链路追踪
};

export default tracing;
'@
}

foreach ($file in $monitoringFiles.Keys) {
    $path = Join-Path $BackendDir "src/monitoring/$file"
    Write-FileContent -Path $path -Content $monitoringFiles[$file]
}

# ============================================
# 7. 队列系统 (11 个)
# ============================================
Write-Host "`n📁 生成队列系统..." -ForegroundColor Green

New-Item -Path (Join-Path $BackendDir "src/queue/config") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
New-Item -Path (Join-Path $BackendDir "src/queue/producers") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
New-Item -Path (Join-Path $BackendDir "src/queue/consumers") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
New-Item -Path (Join-Path $BackendDir "src/queue/jobs") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

$queueConfigFiles = @{
    "bull.config.ts" = "// TODO: Bull 队列配置"
    "redis.config.ts" = "// TODO: Redis 连接配置"
}

foreach ($file in $queueConfigFiles.Keys) {
    $path = Join-Path $BackendDir "src/queue/config/$file"
    Write-FileContent -Path $path -Content $queueConfigFiles[$file]
}

$queueProducers = @(
    "email.producer.ts",
    "report.producer.ts",
    "notification.producer.ts"
)

foreach ($file in $queueProducers) {
    $path = Join-Path $BackendDir "src/queue/producers/$file"
    Write-FileContent -Path $path -Content "// TODO: 实现生产者"
}

$queueConsumers = @(
    "email.consumer.ts",
    "report.consumer.ts",
    "notification.consumer.ts"
)

foreach ($file in $queueConsumers) {
    $path = Join-Path $BackendDir "src/queue/consumers/$file"
    Write-FileContent -Path $path -Content "// TODO: 实现消费者"
}

$queueJobs = @(
    "send-email.job.ts",
    "generate-report.job.ts",
    "process-import.job.ts"
)

foreach ($file in $queueJobs) {
    $path = Join-Path $BackendDir "src/queue/jobs/$file"
    Write-FileContent -Path $path -Content "// TODO: 实现任务"
}

# ============================================
# 8. API 文档 (8 个)
# ============================================
Write-Host "`n📁 生成 API 文档..." -ForegroundColor Green

New-Item -Path (Join-Path $BackendDir "src/docs/schemas") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
New-Item -Path (Join-Path $BackendDir "src/docs/responses") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

$docFiles = @{
    "swagger.config.ts" = @'
/**
 * @file swagger.config.ts
 * @description Swagger 配置
 */

export const swaggerConfig = {
    // TODO: 实现 Swagger 配置
};

export default swaggerConfig;
'@
    "openapi.yaml" = @'
openapi: 3.0.0
info:
  title: ERP System API
  version: 3.0.0
# TODO: 定义 OpenAPI 规范
'@
}

foreach ($file in $docFiles.Keys) {
    $path = Join-Path $BackendDir "src/docs/$file"
    Write-FileContent -Path $path -Content $docFiles[$file]
}

$schemaFiles = @(
    "customer.yaml",
    "order.yaml",
    "product.yaml",
    "finance.yaml"
)

foreach ($file in $schemaFiles) {
    $path = Join-Path $BackendDir "src/docs/schemas/$file"
    Write-FileContent -Path $path -Content "# TODO: 定义 Schema"
}

$responseFiles = @(
    "common.yaml",
    "errors.yaml"
)

foreach ($file in $responseFiles) {
    $path = Join-Path $BackendDir "src/docs/responses/$file"
    Write-FileContent -Path $path -Content "# TODO: 定义响应"
}

# ============================================
# 9. 缓存系统 (4 个)
# ============================================
Write-Host "`n📁 生成缓存系统..." -ForegroundColor Green

New-Item -Path (Join-Path $BackendDir "src/cache") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

$cacheFiles = @{
    "redis.client.ts" = @'
/**
 * @file redis.client.ts
 * @description Redis 客户端
 */

export const redisClient = {
    // TODO: 实现 Redis 客户端
};

export default redisClient;
'@
    "cache-manager.ts" = @'
/**
 * @file cache-manager.ts
 * @description 缓存管理器
 */

export const cacheManager = {
    // TODO: 实现缓存管理器
};

export default cacheManager;
'@
    "cache-middleware.ts" = @'
/**
 * @file cache-middleware.ts
 * @description 缓存中间件
 */

export const cacheMiddleware = {
    // TODO: 实现缓存中间件
};

export default cacheMiddleware;
'@
    "cache-keys.ts" = @'
/**
 * @file cache-keys.ts
 * @description 缓存键定义
 */

export const cacheKeys = {
    // TODO: 定义缓存键
};

export default cacheKeys;
'@
}

foreach ($file in $cacheFiles.Keys) {
    $path = Join-Path $BackendDir "src/cache/$file"
    Write-FileContent -Path $path -Content $cacheFiles[$file]
}

# ============================================
# 10. 验证器 (6 个)
# ============================================
Write-Host "`n📁 生成验证器..." -ForegroundColor Green

New-Item -Path (Join-Path $BackendDir "src/validators/schemas") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

$validatorFiles = @{
    "customer.schema.ts" = @'
/**
 * @file customer.schema.ts
 * @description 客户验证规则
 */

export const customerSchema = {
    // TODO: 定义客户验证规则
};

export default customerSchema;
'@
    "order.schema.ts" = @'
/**
 * @file order.schema.ts
 * @description 订单验证规则
 */

export const orderSchema = {
    // TODO: 定义订单验证规则
};

export default orderSchema;
'@
    "product.schema.ts" = @'
/**
 * @file product.schema.ts
 * @description 产品验证规则
 */

export const productSchema = {
    // TODO: 定义产品验证规则
};

export default productSchema;
'@
    "finance.schema.ts" = @'
/**
 * @file finance.schema.ts
 * @description 财务验证规则
 */

export const financeSchema = {
    // TODO: 定义财务验证规则
};

export default financeSchema;
'@
    "custom-validators.ts" = @'
/**
 * @file custom-validators.ts
 * @description 自定义验证器
 */

export const customValidators = {
    // TODO: 实现自定义验证器
};

export default customValidators;
'@
    "validation-errors.ts" = @'
/**
 * @file validation-errors.ts
 * @description 验证错误定义
 */

export const validationErrors = {
    // TODO: 定义验证错误
};

export default validationErrors;
'@
}

foreach ($file in $validatorFiles.Keys) {
    $path = Join-Path $BackendDir "src/validators/schemas/$file"
    Write-FileContent -Path $path -Content $validatorFiles[$file]
}

# ============================================
# 11. 异常处理 (6 个)
# ============================================
Write-Host "`n📁 生成异常处理..." -ForegroundColor Green

New-Item -Path (Join-Path $BackendDir "src/exceptions") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

$exceptionFiles = @{
    "base.exception.ts" = @'
/**
 * @file base.exception.ts
 * @description 基础异常类
 */

export class BaseException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export default BaseException;
'@
    "http.exception.ts" = @'
/**
 * @file http.exception.ts
 * @description HTTP 异常类
 */

import { BaseException } from './base.exception';

export class HttpException extends BaseException {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default HttpException;
'@
    "business.exception.ts" = @'
/**
 * @file business.exception.ts
 * @description 业务异常类
 */

import { BaseException } from './base.exception';

export class BusinessException extends BaseException {
    public code: string;

    constructor(code: string, message: string) {
        super(message);
        this.code = code;
    }
}

export default BusinessException;
'@
    "validation.exception.ts" = @'
/**
 * @file validation.exception.ts
 * @description 验证异常类
 */

import { HttpException } from './http.exception';

export class ValidationException extends HttpException {
    public errors: any[];

    constructor(errors: any[], message: string = 'Validation failed') {
        super(400, message);
        this.errors = errors;
    }
}

export default ValidationException;
'@
    "auth.exception.ts" = @'
/**
 * @file auth.exception.ts
 * @description 认证异常类
 */

import { HttpException } from './http.exception';

export class AuthException extends HttpException {
    constructor(message: string = 'Unauthorized') {
        super(401, message);
    }
}

export default AuthException;
'@
    "error-codes.ts" = @'
/**
 * @file error-codes.ts
 * @description 错误码定义
 */

export const ErrorCodes = {
    // 通用错误
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',

    // 认证错误
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',

    // 业务错误
    BUSINESS_ERROR: 'BUSINESS_ERROR',
    DUPLICATE_ERROR: 'DUPLICATE_ERROR',
    INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
    INVALID_STATUS: 'INVALID_STATUS',
};

export default ErrorCodes;
'@
}

foreach ($file in $exceptionFiles.Keys) {
    $path = Join-Path $BackendDir "src/exceptions/$file"
    Write-FileContent -Path $path -Content $exceptionFiles[$file]
}

# ============================================
# 12. 国际化 (3 个)
# ============================================
Write-Host "`n📁 生成国际化文件..." -ForegroundColor Green

New-Item -Path (Join-Path $BackendDir "src/locales/en") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
New-Item -Path (Join-Path $BackendDir "src/locales/ar") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

$messagesJson = @'
{
  "errors": {
    "notFound": "Resource not found",
    "unauthorized": "Unauthorized access",
    "validationFailed": "Validation failed",
    "internalError": "Internal server error"
  },
  "success": {
    "created": "Resource created successfully",
    "updated": "Resource updated successfully",
    "deleted": "Resource deleted successfully"
  }
}
'@

$messagesArJson = @'
{
  "errors": {
    "notFound": "المورد غير موجود",
    "unauthorized": "وصول غير مصرح به",
    "validationFailed": "فشل التحقق من الصحة",
    "internalError": "خطأ في الخادم الداخلي"
  },
  "success": {
    "created": "تم إنشاء المورد بنجاح",
    "updated": "تم تحديث المورد بنجاح",
    "deleted": "تم حذف المورد بنجاح"
  }
}
'@

$enPath = Join-Path $BackendDir "src/locales/en/messages.json"
$arPath = Join-Path $BackendDir "src/locales/ar/messages.json"
Write-FileContent -Path $enPath -Content $messagesJson
Write-FileContent -Path $arPath -Content $messagesArJson

$i18nConfigPath = Join-Path $BackendDir "src/locales/i18n.config.ts"
$i18nContent = @'
/**
 * @file i18n.config.ts
 * @description i18n 配置
 */

export const i18nConfig = {
    defaultLocale: 'en',
    supportedLocales: ['en', 'ar'],
    // TODO: 实现 i18n 配置
};

export default i18nConfig;
'@
Write-FileContent -Path $i18nConfigPath -Content $i18nContent

# ============================================
# 13. TypeScript 类型定义 (7 个)
# ============================================
Write-Host "`n📁 生成 TypeScript 类型定义..." -ForegroundColor Green

New-Item -Path (Join-Path $BackendDir "src/types/models") -Force -ItemType Directory -ErrorAction SilentlyContinue | Out-Null

$typeFiles = @{
    "express.d.ts" = @'
/**
 * @file express.d.ts
 * @description Express 类型扩展
 */

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export {};
'@
    "customer.d.ts" = @'
/**
 * @file customer.d.ts
 * @description 客户模型类型
 */

export interface Customer {
    id: string;
    name: string;
    email: string;
    // TODO: 定义客户类型
}
'@
    "order.d.ts" = @'
/**
 * @file order.d.ts
 * @description 订单模型类型
 */

export interface Order {
    id: string;
    orderNo: string;
    // TODO: 定义订单类型
}
'@
    "product.d.ts" = @'
/**
 * @file product.d.ts
 * @description 产品模型类型
 */

export interface Product {
    id: string;
    productCode: string;
    // TODO: 定义产品类型
}
'@
    "finance.d.ts" = @'
/**
 * @file finance.d.ts
 * @description 财务模型类型
 */

export interface Transaction {
    id: string;
    transactionNo: string;
    // TODO: 定义交易类型
}
'@
    "responses.d.ts" = @'
/**
 * @file responses.d.ts
 * @description 响应类型定义
 */

export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data?: T;
    timestamp: string;
}
'@
    "config.d.ts" = @'
/**
 * @file config.d.ts
 * @description 配置类型定义
 */

export interface AppConfig {
    env: string;
    port: number;
    // TODO: 定义配置类型
}
'@
}

foreach ($file in $typeFiles.Keys) {
    if ($file -eq "express.d.ts") {
        $path = Join-Path $BackendDir "src/types/$file"
    } elseif ($file -in @("customer.d.ts", "order.d.ts", "product.d.ts", "finance.d.ts")) {
        $path = Join-Path $BackendDir "src/types/models/$file"
    } else {
        $path = Join-Path $BackendDir "src/types/$file"
    }
    Write-FileContent -Path $path -Content $typeFiles[$file]
}

# ============================================
# 生成完成统计
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ 所有缺失文件骨架生成完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

$totalFiles = 34 + 5 + 7 + 15 + 8 + 4 + 11 + 8 + 4 + 6 + 6 + 3 + 7
Write-Host "📊 总计生成: $totalFiles 个文件" -ForegroundColor Yellow
Write-Host "📁 目标目录: $BackendDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️ 注意: 生成的是骨架文件，需要补充完整实现代码！" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan