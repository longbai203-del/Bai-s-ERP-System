/**
 * 日志中间件
 */
const fs = require('fs');
const path = require('path');

// 确保日志目录存在
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * 写入日志
 */
function writeLog(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        data
    };

    const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

    // 控制台输出
    const consoleMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    if (level === 'error') {
        console.error(consoleMessage);
    } else {
        console.log(consoleMessage);
    }
}

/**
 * 请求日志中间件
 */
function requestLogger(req, res, next) {
    const startTime = Date.now();
    const { method, url, ip, headers } = req;

    // 记录请求
    writeLog('info', `Request: ${method} ${url}`, {
        ip,
        userAgent: headers['user-agent'],
        userId: req.user?.id
    });

    // 响应完成时记录
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        writeLog('info', `Response: ${method} ${url} ${res.statusCode}`, {
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userId: req.user?.id
        });
    });

    next();
}

/**
 * 错误日志中间件
 */
function errorLogger(err, req, res, next) {
    writeLog('error', err.message, {
        stack: err.stack,
        url: req.url,
        method: req.method,
        userId: req.user?.id
    });
    next(err);
}

module.exports = {
    writeLog,
    requestLogger,
    errorLogger
};
