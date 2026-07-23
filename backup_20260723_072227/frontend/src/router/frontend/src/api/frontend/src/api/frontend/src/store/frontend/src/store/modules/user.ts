import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/api/client'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)
  const roles = ref([])
  const permissions = ref([])
  
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const realName = computed(() => userInfo.value?.realName || '')
  
  async function login(params) {
    try {
      const result = await apiClient.post('/auth/login', params)
      token.value = result.token
      localStorage.setItem('token', result.token)
      await getUserInfo()
      return true
    } catch (error) {
      return false
    }
  }
  
  async function getUserInfo() {
    try {
      const info = await apiClient.get('/auth/user-info')
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
    token, userInfo, roles, permissions,
    isLoggedIn, username, realName,
    login, getUserInfo, logout, resetState
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token']
  }
})
