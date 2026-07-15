<template>
  <div id="app" style="width: 100%; min-height: 100vh; display: flex; flex-direction: column;">
    <!-- 未登录：显示登录页（全屏居中） -->
    <div v-if="!isAuthenticated" style="flex: 1; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a2332, #2d3748); min-height: 100vh;">
      <router-view />
    </div>

    <!-- 已登录：显示完整布局 -->
    <div v-else style="display: flex; min-height: 100vh; width: 100%;">
      <!-- 侧边栏 -->
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }" style="width: 250px; min-height: 100vh; background: #1a2332; color: #fff; display: flex; flex-direction: column; transition: width 0.3s; position: fixed; top: 0; left: 0; bottom: 0; z-index: 1000; overflow-y: auto;">
        <div class="sidebar-brand" style="display: flex; align-items: center; padding: 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer;">
          <img src="/src/assets/images/logo.svg" alt="Bai's ERP" style="width: 32px; height: 32px; margin-right: 12px;" />
          <span class="brand-name" v-if="!sidebarCollapsed" style="font-size: 18px; font-weight: 600; white-space: nowrap;">Bai's ERP</span>
        </div>
        
        <nav style="flex: 1; padding: 16px 0;">
          <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item" active-class="active" style="display: flex; align-items: center; padding: 12px 20px; cursor: pointer; color: rgba(255,255,255,0.7); text-decoration: none; transition: background 0.2s;">
            <i :class="item.icon" style="width: 20px; margin-right: 12px; text-align: center;"></i>
            <span v-if="!sidebarCollapsed">{{ item.title }}</span>
          </router-link>
        </nav>
        
        <div style="padding: 16px 0; border-top: 1px solid rgba(255,255,255,0.1);">
          <button @click="logout" style="display: flex; align-items: center; width: 100%; padding: 12px 20px; background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 14px;">
            <i class="fas fa-sign-out-alt" style="width: 20px; margin-right: 12px; text-align: center;"></i>
            <span v-if="!sidebarCollapsed">退出登录</span>
          </button>
        </div>
      </aside>

      <!-- 主内容 -->
      <main style="flex: 1; margin-left: 250px; transition: margin-left 0.3s; display: flex; flex-direction: column; min-height: 100vh; width: 100%;">
        <header style="background: #fff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 999;">
          <button @click="toggleSidebar" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #4a5568; padding: 4px 8px;">
            <i class="fas fa-bars"></i>
          </button>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 14px; color: #4a5568;">{{ user?.username || '用户' }}</span>
            <i class="fas fa-user-circle" style="font-size: 28px; color: #4a90d9;"></i>
          </div>
        </header>

        <div style="flex: 1; padding: 20px 24px; width: 100%; background: #f5f7fa;">
          <router-view />
        </div>
      </main>
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
html, body, #app { width: 100%; min-height: 100vh; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }

.nav-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
.nav-item.active { background: rgba(74,144,217,0.3); color: #fff; border-right: 3px solid #4A90D9; }
.sidebar.collapsed { width: 64px; }
.sidebar.collapsed .brand-name,
.sidebar.collapsed .nav-item span,
.sidebar.collapsed button span { display: none; }
.sidebar.collapsed .nav-item i,
.sidebar.collapsed button i { margin-right: 0; }

@media (max-width: 768px) {
  .sidebar { width: 64px; }
  .sidebar .brand-name, .sidebar .nav-item span, .sidebar button span { display: none; }
  .sidebar .nav-item i, .sidebar button i { margin-right: 0; }
  main { margin-left: 64px; }
  .sidebar:not(.collapsed) { width: 250px; }
  .sidebar:not(.collapsed) .brand-name,
  .sidebar:not(.collapsed) .nav-item span,
  .sidebar:not(.collapsed) button span { display: inline; }
  .sidebar:not(.collapsed) .nav-item i,
  .sidebar:not(.collapsed) button i { margin-right: 12px; }
}
</style>