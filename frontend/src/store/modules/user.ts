import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/api'

interface UserInfo {
  id: number
  username: string
  realName: string
  email: string
  phone: string
  avatar: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const realName = computed(() => userInfo.value?.realName || '')
  
  async function login(params: { username: string; password: string }) {
    try {
      // ===== 模拟登录（开发测试用）=====
      // 注释掉下面的代码，使用真实API
      token.value = 'mock-token-123456'
      localStorage.setItem('token', 'mock-token-123456')
      userInfo.value = {
        id: 1,
        username: 'admin',
        realName: '管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        avatar: '',
        roles: ['admin'],
        permissions: ['*']
      }
      roles.value = ['admin']
      permissions.value = ['*']
      return true
      // ===== 模拟登录结束 =====
      
      // 真实API调用（正式环境使用）
      // const result = await apiClient.post('/auth/login', params)
      // token.value = result.token
      // localStorage.setItem('token', result.token)
      // await getUserInfo()
      // return true
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }
  
  async function getUserInfo() {
    try {
      const info = await apiClient.get<UserInfo>('/auth/user-info')
      userInfo.value = info
      roles.value = info.roles || []
      permissions.value = info.permissions || []
      return info
    } catch (error) {
      throw error
    }
  }
  
  function logout() {
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  
  function resetState() {
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
    localStorage.removeItem('token')
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
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token']
  }
})
