import { Router } from 'express';

const router = Router();

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Server is running!'
  });
});

// 测试 API
router.get('/test', (req, res) => {
  res.json({
    message: 'API is working!',
    time: new Date().toISOString()
  });
});

export default router;
