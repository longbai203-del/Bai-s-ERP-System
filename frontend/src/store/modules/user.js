import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
    permissions: [],
    roles: []
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission)
    }
  },
  
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    
    setPermissions(permissions) {
      this.permissions = permissions
    },
    
    setRoles(roles) {
      this.roles = roles
    },
    
    async login(credentials) {
      try {
        // 调用登录 API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        })
        
        if (!response.ok) {
          throw new Error('登录失败')
        }
        
        const data = await response.json()
        this.setToken(data.token)
        this.setUserInfo(data.user)
        this.setPermissions(data.permissions || [])
        this.setRoles(data.roles || [])
        
        return { success: true, data }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },
    
    logout() {
      this.token = ''
      this.userInfo = null
      this.permissions = []
      this.roles = []
      localStorage.removeItem('token')
    }
  }
})
