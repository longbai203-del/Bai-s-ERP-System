import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient } from '@/api';
import { ElMessage } from 'element-plus';
import router from '@/router';

export interface UserInfo {
  id: number;
  username: string;
  realName: string;
  email: string;
  phone: string;
  avatar: string;
  roles: string[];
  permissions: string[];
}

export const useUserStore = defineStore('user', () => {
  // ===== State =====
  const token = ref<string>(localStorage.getItem('token') || '');
  const userInfo = ref<UserInfo | null>(null);
  const roles = ref<string[]>([]);
  const permissions = ref<string[]>([]);

  // ===== Getters =====
  const isLoggedIn = computed(() => !!token.value);
  const username = computed(() => userInfo.value?.username || '');
  const realName = computed(() => userInfo.value?.realName || '');

  // ===== Actions =====
  async function login(params: { username: string; password: string }) {
    try {
      // ===== 模拟登录（开发测试用）=====
      // 正式环境替换为真实 API 调用
      token.value = 'mock-token-123456';
      localStorage.setItem('token', 'mock-token-123456');

      userInfo.value = {
        id: 1,
        username: 'admin',
        realName: '管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        avatar: '',
        roles: ['admin'],
        permissions: ['*']
      };
      roles.value = ['admin'];
      permissions.value = ['*'];

      ElMessage.success('登录成功');
      router.push('/dashboard');
      return true;
    } catch (error) {
      ElMessage.error('登录失败');
      return false;
    }
  }

  async function getUserInfo() {
    try {
      // 真实 API 调用
      // const info = await apiClient.get<UserInfo>('/auth/user-info');
      // userInfo.value = info;
      // roles.value = info.roles || [];
      // permissions.value = info.permissions || [];

      // 模拟数据
      if (!userInfo.value) {
        userInfo.value = {
          id: 1,
          username: 'admin',
          realName: '管理员',
          email: 'admin@example.com',
          phone: '13800138000',
          avatar: '',
          roles: ['admin'],
          permissions: ['*']
        };
        roles.value = ['admin'];
        permissions.value = ['*'];
      }
      return userInfo.value;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    token.value = '';
    userInfo.value = null;
    roles.value = [];
    permissions.value = [];
    localStorage.removeItem('token');
    ElMessage.success('已退出登录');
    router.push('/login');
  }

  function resetState() {
    token.value = '';
    userInfo.value = null;
    roles.value = [];
    permissions.value = [];
    localStorage.removeItem('token');
  }

  return {
    token,
    userInfo,
    roles,
    permissions,
    isLoggedIn,
    username,
    realName,
    login,
    getUserInfo,
    logout,
    resetState
  };
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token']
  }
});
