import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface TabItem {
  path: string;
  title: string;
  icon?: string;
  closable?: boolean;
}

export const useAppStore = defineStore('app', () => {
  // ===== State =====
  const sidebarOpened = ref(true);
  const theme = ref<'light' | 'dark'>('light');
  const primaryColor = ref('#409EFF');
  const tabs = ref<TabItem[]>([]);
  const activeTab = ref<string>('');

  // ===== Getters =====
  const sidebarCollapsed = computed(() => !sidebarOpened.value);

  // ===== Actions =====
  function toggleSidebar() {
    sidebarOpened.value = !sidebarOpened.value;
  }

  function closeSidebar() {
    sidebarOpened.value = false;
  }

  function openSidebar() {
    sidebarOpened.value = true;
  }

  function addTab(path: string, title: string, icon?: string) {
    // 检查是否已存在
    const existing = tabs.value.find(t => t.path === path);
    if (!existing) {
      tabs.value.push({ path, title, icon, closable: path !== '/dashboard' });
    }
    activeTab.value = path;
  }

  function removeTab(path: string) {
    const index = tabs.value.findIndex(t => t.path === path);
    if (index !== -1) {
      tabs.value.splice(index, 1);
      if (activeTab.value === path && tabs.value.length > 0) {
        const nextIndex = Math.min(index, tabs.value.length - 1);
        activeTab.value = tabs.value[nextIndex].path;
      } else if (tabs.value.length === 0) {
        activeTab.value = '';
      }
    }
  }

  function closeAllTabs() {
    // 保留首页
    const dashboard = tabs.value.find(t => t.path === '/dashboard');
    tabs.value = dashboard ? [dashboard] : [];
    activeTab.value = dashboard ? '/dashboard' : '';
  }

  function closeOtherTabs(path: string) {
    const target = tabs.value.find(t => t.path === path);
    if (target) {
      tabs.value = [target];
      activeTab.value = path;
    }
  }

  function setTheme(themeMode: 'light' | 'dark') {
    theme.value = themeMode;
    document.documentElement.setAttribute('data-theme', themeMode);
  }

  function setPrimaryColor(color: string) {
    primaryColor.value = color;
    document.documentElement.style.setProperty('--el-color-primary', color);
  }

  return {
    sidebarOpened,
    theme,
    primaryColor,
    tabs,
    activeTab,
    sidebarCollapsed,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    addTab,
    removeTab,
    closeAllTabs,
    closeOtherTabs,
    setTheme,
    setPrimaryColor
  };
}, {
  persist: {
    key: 'app-store',
    storage: localStorage,
    paths: ['theme', 'primaryColor', 'sidebarOpened']
  }
});
