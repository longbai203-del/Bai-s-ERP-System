# ============================================
# Dockerfile - ERP 系统后端服务
# 多阶段构建 - 生产环境优化
# ============================================

# ============================================
# 第一阶段: 构建阶段
# ============================================
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./
COPY yarn.lock ./

# 安装依赖 (使用 yarn)
RUN yarn install --frozen-lockfile --production=false

# 复制源代码
COPY . .

# 构建应用程序
RUN yarn build

# 删除开发依赖
RUN yarn install --frozen-lockfile --production=true --ignore-scripts

# ============================================
# 第二阶段: 运行阶段
# ============================================
FROM node:18-alpine AS runner

# 安装系统依赖
RUN apk add --no-cache tzdata curl

# 设置时区
ENV TZ=Asia/Shanghai

# 设置环境变量
ENV NODE_ENV=production
ENV APP_VERSION=1.0.0

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 设置工作目录
WORKDIR /app

# 从构建阶段复制文件
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/package-lock.json ./

# 创建日志目录
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app/logs

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动命令
CMD ["node", "dist/server.js"]