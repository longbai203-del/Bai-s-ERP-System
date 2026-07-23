import { computed } from 'vue';
import { useUserStore } from '@/store/modules/user';

export function useAuth() {
  const userStore = useUserStore();
  
  // ===== Getters =====
  const isLoggedIn = computed(() => userStore.isLoggedIn);
  const currentUser = computed(() => userStore.userInfo);
  const userRoles = computed(() => userStore.roles);
  const userPermissions = computed(() => userStore.permissions);
  const username = computed(() => userStore.username);
  const realName = computed(() => userStore.realName);
  
  // ===== 角色检查 =====
  function hasRole(role: string | string[]): boolean {
    if (!userRoles.value) return false;
    if (Array.isArray(role)) {
      return role.some(r => userRoles.value.includes(r));
    }
    return userRoles.value.includes(role);
  }
  
  // ===== 权限检查 =====
  function hasPermission(permission: string): boolean {
    if (!userPermissions.value) return false;
    return userPermissions.value.includes('*') || userPermissions.value.includes(permission);
  }
  
  function hasAnyPermission(permissions: string[]): boolean {
    if (!userPermissions.value) return false;
    return permissions.some(p => hasPermission(p));
  }
  
  function hasAllPermissions(permissions: string[]): boolean {
    if (!userPermissions.value) return false;
    return permissions.every(p => hasPermission(p));
  }
  
  // ===== 登录/登出 =====
  async function login(username: string, password: string) {
    return userStore.login({ username, password });
  }
  
  function logout() {
    userStore.logout();
  }
  
  // ===== 用户信息 =====
  async function getUserInfo() {
    return userStore.getUserInfo();
  }
  
  return {
    // State
    isLoggedIn,
    currentUser,
    userRoles,
    userPermissions,
    username,
    realName,
    
    // 角色检查
    hasRole,
    
    // 权限检查
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // 操作
    login,
    logout,
    getUserInfo
  };
}
