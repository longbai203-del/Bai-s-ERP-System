/**
 * @file ui.store.ts
 * @description UI 状态管理 - Pinia Store
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark' | 'auto'

export const useUiStore = defineStore('ui', () => {
  // State
  const sidebarCollapsed = ref(false)
  const theme = ref<Theme>('light')
  const isLoading = ref(false)
  const breadcrumbs = ref<{ name: string; path: string }[]>([])

  // Getters
  const isDark = computed(() => theme.value === 'dark')
  const isLight = computed(() => theme.value === 'light')

  // Actions
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    // 应用主题
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setBreadcrumbs = (items: { name: string; path: string }[]) => {
    breadcrumbs.value = items
  }

  const addBreadcrumb = (item: { name: string; path: string }) => {
    breadcrumbs.value.push(item)
  }

  // 从 localStorage 恢复主题
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }

  // 保存主题到 localStorage
  const saveTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme)
  }

  // 初始化
  loadTheme()

  return {
    // State
    sidebarCollapsed,
    theme,
    isLoading,
    breadcrumbs,
    // Getters
    isDark,
    isLight,
    // Actions
    toggleSidebar,
    setSidebarCollapsed,
    setTheme,
    toggleTheme,
    setLoading,
    setBreadcrumbs,
    addBreadcrumb,
    loadTheme,
    saveTheme
  }
})
