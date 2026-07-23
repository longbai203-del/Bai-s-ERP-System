import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

export interface MenuItem {
  path: string;
  name: string;
  title: string;
  icon?: string;
  children?: MenuItem[];
  hidden?: boolean;
  roles?: string[];
  permissions?: string[];
}

export const usePermissionStore = defineStore('permission', () => {
  // ===== State =====
  const routes = ref<RouteRecordRaw[]>([]);
  const menus = ref<MenuItem[]>([]);
  const isLoaded = ref(false);

  // ===== Getters =====
  const hasRoutes = computed(() => routes.value.length > 0);
  const hasMenus = computed(() => menus.value.length > 0);

  // ===== Actions =====
  async function generateRoutes(roles: string[] = []): Promise<RouteRecordRaw[]> {
    // 获取所有模块路由
    const modules = import.meta.glob('../../modules/*/router/*.ts', { eager: true });
    const allRoutes: RouteRecordRaw[] = [];

    Object.keys(modules).forEach((key) => {
      const module = modules[key] as any;
      if (module.default) {
        const routes = module.default;
        if (Array.isArray(routes)) {
          allRoutes.push(...routes);
        } else {
          allRoutes.push(routes);
        }
      }
    });

    // 根据角色过滤路由
    const filteredRoutes = filterRoutesByRoles(allRoutes, roles);
    routes.value = filteredRoutes;
    isLoaded.value = true;

    // 生成菜单
    menus.value = generateMenus(filteredRoutes);

    return filteredRoutes;
  }

  function filterRoutesByRoles(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
    // 如果没有角色或包含 admin，返回所有路由
    if (!roles.length || roles.includes('admin')) {
      return routes;
    }

    return routes.filter(route => {
      // 检查路由是否需要角色
      if (route.meta?.roles) {
        const routeRoles = route.meta.roles as string[];
        return routeRoles.some(role => roles.includes(role));
      }
      return true;
    });
  }

  function generateMenus(routes: RouteRecordRaw[]): MenuItem[] {
    const menuItems: MenuItem[] = [];

    routes.forEach(route => {
      // 跳过隐藏菜单
      if (route.meta?.hidden) return;

      // 如果有 children，递归处理
      if (route.children && route.children.length > 0) {
        const children = generateMenus(route.children);
        if (children.length > 0) {
          menuItems.push({
            path: route.path,
            name: route.name as string || route.path,
            title: route.meta?.title as string || route.path,
            icon: route.meta?.icon as string,
            children
          });
        }
      } else if (route.path !== '/') {
        menuItems.push({
          path: route.path,
          name: route.name as string || route.path,
          title: route.meta?.title as string || route.path,
          icon: route.meta?.icon as string
        });
      }
    });

    return menuItems;
  }

  function reset() {
    routes.value = [];
    menus.value = [];
    isLoaded.value = false;
  }

  return {
    routes,
    menus,
    isLoaded,
    hasRoutes,
    hasMenus,
    generateRoutes,
    reset
  };
});
