/**
 * @file auth.store.ts
 * @description 认证状态管理 - Pinia Store
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'user'
  avatar?: string
  status: 'active' | 'inactive'
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

  // Getters
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isManager = computed(() => user.value?.role === 'admin' || user.value?.role === 'manager')
  const userName = computed(() => user.value?.name || '用户')
  const userAvatar = computed(() => user.value?.avatar || '')

  // Actions
  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const response = await api.post('/auth/login', { email, password })
      const data = response.data.data
      
      user.value = data.user
      token.value = data.token
      isAuthenticated.value = true
      
      // 存储到 localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message || '登录失败' }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // 忽略退出错误
    } finally {
      user.value = null
      token.value = null
      isAuthenticated.value = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const register = async (data: { email: string; password: string; name: string }) => {
    loading.value = true
    try {
      const response = await api.post('/auth/register', data)
      return { success: true, data: response.data }
    } catch (error: any) {
      return { success: false, error: error.message || '注册失败' }
    } finally {
      loading.value = false
    }
  }

  const checkAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
        return true
      } catch (error) {
        return false
      }
    }
    return false
  }

  const updateUser = async (data: Partial<User>) => {
    if (!user.value) return { success: false, error: '未登录' }
    
    try {
      const response = await api.put(`/users/${user.value.id}`, data)
      const updatedUser = response.data.data
      user.value = { ...user.value, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(user.value))
      return { success: true, data: updatedUser }
    } catch (error: any) {
      return { success: false, error: error.message || '更新失败' }
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await api.post('/users/change-password', { oldPassword, newPassword })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || '密码修改失败' }
    }
  }

  // 初始化
  checkAuth()

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    // Getters
    isAdmin,
    isManager,
    userName,
    userAvatar,
    // Actions
    login,
    logout,
    register,
    checkAuth,
    updateUser,
    changePassword
  }
})
