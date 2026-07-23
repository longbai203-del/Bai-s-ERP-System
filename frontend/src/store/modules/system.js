import { defineStore } from 'pinia'

export const useSystemStore = defineStore('system', {
  state: () => ({
    systemConfig: {
      companyName: 'Bai\'s ERP',
      companyLogo: '',
      version: '1.0.0',
      currency: 'CNY',
      timezone: 'Asia/Shanghai'
    },
    systemMenus: [],
    currentModule: '',
    systemParameters: {}
  }),
  
  getters: {
    getSystemConfig: (state) => state.systemConfig,
    getCurrentModule: (state) => state.currentModule,
    getSystemMenus: (state) => state.systemMenus
  },
  
  actions: {
    setSystemConfig(config) {
      this.systemConfig = { ...this.systemConfig, ...config }
    },
    
    setSystemMenus(menus) {
      this.systemMenus = menus
    },
    
    setCurrentModule(module) {
      this.currentModule = module
    },
    
    setSystemParameters(params) {
      this.systemParameters = params
    },
    
    async loadSystemConfig() {
      try {
        const response = await fetch('/api/system/config')
        if (response.ok) {
          const data = await response.json()
          this.setSystemConfig(data)
        }
      } catch (error) {
        console.error('加载系统配置失败:', error)
      }
    }
  }
})
