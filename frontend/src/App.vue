<template>
  <div id="app">
    <div v-if="isAuthenticated" class="app-container">
      <!-- 侧边栏 -->
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-brand" @click="$router.push('/dashboard')">
          <img src="/src/assets/images/logo.svg" alt="Bai's ERP" class="brand-logo" />
          <span class="brand-name" v-if="!sidebarCollapsed">Bai's ERP</span>
        </div>
        
        <nav class="sidebar-nav">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="nav-item"
            active-class="active"
          >
            <i :class="item.icon"></i>
            <span v-if="!sidebarCollapsed">{{ item.title }}</span>
          </router-link>
        </nav>
        
        <div class="sidebar-footer">
          <button @click="logout" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            <span v-if="!sidebarCollapsed">退出登录</span>
          </button>
        </div>
      </aside>

      <!-- 主内容 -->
      <main class="main-content" :class="{ expanded: sidebarCollapsed }">
        <header class="top-navbar">
          <button @click="toggleSidebar" class="menu-toggle">
            <i class="fas fa-bars"></i>
          </button>
          <div class="navbar-right">
            <span class="user-info">{{ user?.username || '用户' }}</span>
            <i class="fas fa-user-circle user-avatar"></i>
          </div>
        </header>

        <div class="page-content">
          <router-view />
        </div>
      </main>
    </div>

    <!-- 未登录 -->
    <div v-else class="login-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const sidebarCollapsed = ref(false);
    const user = ref(null);

    const menuItems = [
      { path: '/dashboard', title: '仪表盘', icon: 'fas fa-chart-line' },
      { path: '/new-module', title: '新模块', icon: 'fas fa-cube' }
    ];

    const isAuthenticated = computed(() => {
      return !!localStorage.getItem('accessToken');
    });

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    };

    const logout = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      router.push('/login');
    };

    onMounted(() => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try { user.value = JSON.parse(userData); } catch {}
      }
    });

    return {
      menuItems,
      sidebarCollapsed,
      user,
      isAuthenticated,
      toggleSidebar,
      logout
    };
  }
};
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', sans-serif; background: #f5f7fa; }

.app-container { display: flex; min-height: 100vh; }

/* 侧边栏 */
.sidebar {
  width: 250px;
  min-height: 100vh;
  background: #1a2332;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: auto;
}
.sidebar.collapsed { width: 64px; }

.sidebar-brand {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
}
.brand-logo { width: 32px; height: 32px; margin-right: 12px; }
.sidebar.collapsed .brand-logo { margin-right: 0; }
.brand-name { font-size: 18px; font-weight: 600; white-space: nowrap; }
.sidebar.collapsed .brand-name { display: none; }

.sidebar-nav { flex: 1; padding: 16px 0; }
.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  transition: background 0.2s;
}
.nav-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
.nav-item.active { background: rgba(74,144,217,0.3); color: #fff; border-right: 3px solid #4A90D9; }
.nav-item i { width: 20px; margin-right: 12px; text-align: center; }
.sidebar.collapsed .nav-item i { margin-right: 0; }
.sidebar.collapsed .nav-item span { display: none; }

.sidebar-footer { padding: 16px 0; border-top: 1px solid rgba(255,255,255,0.1); }
.logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  font-size: 14px;
}
.logout-btn:hover { background: rgba(255,0,0,0.1); color: #ff6b6b; }
.logout-btn i { width: 20px; margin-right: 12px; text-align: center; }
.sidebar.collapsed .logout-btn span { display: none; }
.sidebar.collapsed .logout-btn i { margin-right: 0; }

/* 主内容 */
.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content.expanded { margin-left: 64px; }

.top-navbar {
  background: #fff;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 999;
}
.menu-toggle {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #4a5568;
  padding: 4px 8px;
}
.navbar-right { display: flex; align-items: center; gap: 12px; }
.user-info { font-size: 14px; color: #4a5568; }
.user-avatar { font-size: 28px; color: #4a90d9; }

.page-content { flex: 1; padding: 20px 24px; }

.login-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a2332, #2d3748); }

@media (max-width: 768px) {
  .sidebar { width: 64px; }
  .sidebar .brand-name, .sidebar .nav-item span, .sidebar .logout-btn span { display: none; }
  .sidebar .nav-item i, .sidebar .logout-btn i { margin-right: 0; }
  .main-content { margin-left: 64px; }
  .sidebar:not(.collapsed) { width: 250px; }
  .sidebar:not(.collapsed) .brand-name,
  .sidebar:not(.collapsed) .nav-item span,
  .sidebar:not(.collapsed) .logout-btn span { display: inline; }
  .sidebar:not(.collapsed) .nav-item i,
  .sidebar:not(.collapsed) .logout-btn i { margin-right: 12px; }
}
</style>