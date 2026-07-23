import { Router } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';

export default function setupAuthGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const userStore = useUserStore();
    const token = userStore.token || localStorage.getItem('token');

    // ===== 白名单页面 =====
    const whiteList = ['/login', '/404'];
    if (whiteList.includes(to.path)) {
      if (to.path === '/login' && token) {
        next('/dashboard');
      } else {
        next();
      }
      return;
    }

    // ===== 检查 Token =====
    if (!token) {
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
      return;
    }

    // ===== 验证 Token 有效性 =====
    try {
      if (!userStore.userInfo) {
        await userStore.getUserInfo();
      }
      next();
    } catch (error) {
      ElMessage.error('登录已过期，请重新登录');
      userStore.resetState();
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
    }
  });
}
