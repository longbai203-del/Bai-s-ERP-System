import { Router } from 'express';
import { SystemSettingController, CompanyInfoController } from '../controllers/Settings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const systemSettingController = new SystemSettingController();
const companyInfoController = new CompanyInfoController();

router.use(authMiddleware);

// 系统设置路由
router.get('/settings/key/:key', systemSettingController.getByKey.bind(systemSettingController));
router.get('/settings/category/:category', systemSettingController.getByCategory.bind(systemSettingController));
router.post('/settings', systemSettingController.setSetting.bind(systemSettingController));
router.post('/settings/batch', systemSettingController.getMultipleKeys.bind(systemSettingController));

// 公司信息路由
router.get('/company', companyInfoController.getCompanyInfo.bind(companyInfoController));
router.put('/company', companyInfoController.updateCompanyInfo.bind(companyInfoController));

export default router;
