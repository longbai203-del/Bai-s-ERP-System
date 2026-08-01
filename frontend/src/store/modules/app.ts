import { defineStore } from 'pinia'

interface AppState {
  theme: 'light' | 'dark'
  primaryColor: string
  sidebarCollapsed: boolean
  language: string
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: (localStorage.getItem('app-theme') as 'light' | 'dark') || 'light',
    primaryColor: localStorage.getItem('app-primary-color') || '#409EFF',
    sidebarCollapsed: false,
    language: localStorage.getItem('app-language') || 'zh-CN',
  }),
  
  actions: {
    // 设置主题
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('app-theme', theme)
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    
    // 设置主色 - 修复缺失的方法
    setPrimaryColor(color: string) {
      this.primaryColor = color
      document.documentElement.style.setProperty('--el-color-primary', color)
      localStorage.setItem('app-primary-color', color)
    },
    
    // 切换侧边栏
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    
    // 设置语言
    setLanguage(lang: string) {
      this.language = lang
      localStorage.setItem('app-language', lang)
    },
  },
})
