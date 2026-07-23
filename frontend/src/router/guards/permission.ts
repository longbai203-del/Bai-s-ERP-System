import { Router } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';
import { ElMessage } from 'element-plus';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();

    // ===== 检查是否需要权限验证 =====
    if (!to.meta?.roles && !to.meta?.permissions) {
      next();
      return;
    }

    // ===== 角色验证 =====
    if (to.meta?.roles) {
      const userRoles = userStore.roles || [];
      const hasRole = (to.meta.roles as string[]).some(role => userRoles.includes(role));
      if (!hasRole) {
        ElMessage.error('您没有访问此页面的权限');
        next('/403');
        return;
      }
    }

    // ===== 权限验证 =====
    if (to.meta?.permissions) {
      const userPermissions = userStore.permissions || [];
      const hasPermission = (to.meta.permissions as string[]).some(perm => 
        userPermissions.includes('*') || userPermissions.includes(perm)
      );
      if (!hasPermission) {
        ElMessage.error('您没有访问此页面的权限');
        next('/403');
        return;
      }
    }

    next();
  });
}
