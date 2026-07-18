/**
 * 用户路由
 * 职责：路由定义 + 中间件挂载
 */
const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const { authenticate, authorize } = require('../middleware/auth');

const userController = controllers.User;

// 公开路由
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

// 需要认证的路由
router.use(authenticate);
router.get('/profile', userController.getProfile.bind(userController));
router.put('/profile', userController.updateProfile.bind(userController));
router.post('/change-password', userController.changePassword.bind(userController));

// 管理员路由
router.use(authorize('admin'));
router.get('/list', userController.getUsers.bind(userController));

module.exports = router;
