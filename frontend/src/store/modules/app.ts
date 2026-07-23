import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarOpened = ref(true)
  const theme = ref<'light' | 'dark'>('light')
  const primaryColor = ref('#409EFF')
  const tabs = ref<Array<{ path: string; title: string; icon?: string }>>([])
  const activeTab = ref('')
  
  const sidebarCollapsed = computed(() => !sidebarOpened.value)
  
  function toggleSidebar() {
    sidebarOpened.value = !sidebarOpened.value
  }
  
  function addTab(path: string, title: string, icon?: string) {
    if (!tabs.value.some(t => t.path === path)) {
      tabs.value.push({ path, title, icon })
    }
    activeTab.value = path
  }
  
  function removeTab(path: string) {
    const index = tabs.value.findIndex(t => t.path === path)
    if (index !== -1) {
      tabs.value.splice(index, 1)
      if (activeTab.value === path && tabs.value.length > 0) {
        activeTab.value = tabs.value[Math.min(index, tabs.value.length - 1)].path
      }
    }
  }
  
  function closeAllTabs() {
    tabs.value = []
    activeTab.value = ''
  }
  
  function setTheme(themeMode: 'light' | 'dark') {
    theme.value = themeMode
    document.documentElement.setAttribute('data-theme', themeMode)
  }
  
  return {
    sidebarOpened,
    theme,
    primaryColor,
    tabs,
    activeTab,
    sidebarCollapsed,
    toggleSidebar,
    addTab,
    removeTab,
    closeAllTabs,
    setTheme
  }
}, {
  persist: {
    key: 'app-store',
    storage: localStorage,
    paths: ['theme', 'primaryColor', 'sidebarOpened']
  }
})
