import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebarCollapsed: false,
    theme: 'light',
    language: 'zh-CN',
    notifications: [],
    loading: false
  }),
  
  getters: {
    unreadCount: (state) => {
      return state.notifications.filter(n => !n.read).length
    }
  },
  
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    
    setTheme(theme) {
      this.theme = theme
      document.documentElement.setAttribute('data-theme', theme)
    },
    
    setLanguage(language) {
      this.language = language
    },
    
    addNotification(notification) {
      this.notifications.push({
        ...notification,
        id: Date.now(),
        read: false,
        time: new Date().toISOString()
      })
    },
    
    markAsRead(id) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    },
    
    clearNotifications() {
      this.notifications = []
    },
    
    setLoading(loading) {
      this.loading = loading
    }
  }
})
