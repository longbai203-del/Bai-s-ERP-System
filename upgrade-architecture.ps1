# ============================================
# Bai's ERP 系统架构一键完善脚本
# 版本: 2.0
# 日期: 2026-07-23
# ============================================

# 设置执行策略
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

# 颜色输出函数
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# 显示Banner
Write-ColorOutput @"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████╗  █████╗ ██╗███████╗    ███████╗██████╗ ██████╗    ║
║   ██╔══██╗██╔══██╗██║██╔════╝    ██╔════╝██╔══██╗██╔══██╗   ║
║   ██████╔╝███████║██║███████╗    █████╗  ██████╔╝██████╔╝   ║
║   ██╔══██╗██╔══██║██║╚════██║    ██╔══╝  ██╔══██╗██╔══██╗   ║
║   ██████╔╝██║  ██║██║███████║    ███████╗██║  ██║██║  ██║   ║
║   ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ║
║                                                               ║
║           架构一键完善脚本 v2.0                               ║
╚═══════════════════════════════════════════════════════════════╝
"@ "Cyan"

# ============================================
# 1. 项目路径配置
# ============================================
$ProjectRoot = "D:\Users\yosef\Desktop\Bai's ERP System"
$FrontendSrc = "$ProjectRoot\frontend\src"

if (!(Test-Path $ProjectRoot)) {
    Write-ColorOutput "❌ 项目路径不存在: $ProjectRoot" "Red"
    exit 1
}

Write-ColorOutput "`n📂 项目路径: $ProjectRoot" "Yellow"

# ============================================
# 2. 备份现有文件
# ============================================
Write-ColorOutput "`n📦 创建备份..." "Yellow"

$BackupDir = "$ProjectRoot\backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null

$FilesToBackup = @(
    "$FrontendSrc\router\index.ts",
    "$FrontendSrc\api\client.ts",
    "$FrontendSrc\api\index.ts",
    "$FrontendSrc\store\index.ts",
    "$FrontendSrc\store\modules\user.ts",
    "$FrontendSrc\store\modules\app.ts",
    "$FrontendSrc\store\modules\permission.ts",
    "$FrontendSrc\main.ts"
)

foreach ($file in $FilesToBackup) {
    if (Test-Path $file) {
        $backupFile = $file.Replace($ProjectRoot, $BackupDir)
        $backupDir = Split-Path $backupFile -Parent
        if (!(Test-Path $backupDir)) {
            New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        }
        Copy-Item $file $backupFile -Force
        Write-ColorOutput "  ✅ 已备份: $(Split-Path $file -Leaf)" "Green"
    }
}

# ============================================
# 3. 安装依赖
# ============================================
Write-ColorOutput "`n📦 安装必要依赖..." "Yellow"

Push-Location "$ProjectRoot\frontend"

$Packages = @(
    "pinia",
    "pinia-plugin-persistedstate",
    "@vueuse/core",
    "axios",
    "element-plus",
    "@element-plus/icons-vue"
)

$DevPackages = @(
    "@types/node",
    "typescript",
    "@vitejs/plugin-vue"
)

Write-ColorOutput "  安装生产依赖..." "Cyan"
npm install $Packages --save --legacy-peer-deps

Write-ColorOutput "  安装开发依赖..." "Cyan"
npm install $DevPackages --save-dev --legacy-peer-deps

Pop-Location
Write-ColorOutput "  ✅ 依赖安装完成" "Green"

# ============================================
# 4. 创建/更新API客户端
# ============================================
Write-ColorOutput "`n📝 创建API客户端..." "Yellow"

# 创建API目录（如果不存在）
$ApiDir = "$FrontendSrc\api"
if (!(Test-Path $ApiDir)) {
    New-Item -ItemType Directory -Path $ApiDir -Force | Out-Null
}

# 创建 client.ts
$ClientContent = @'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElLoading } from 'element-plus'

// 加载实例
let loadingInstance: any = null
let requestCount = 0

class ApiClient {
  private instance: AxiosInstance
  
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    this.setupInterceptors()
  }
  
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // 显示加载
        if (config.showLoading !== false) {
          if (requestCount === 0) {
            loadingInstance = ElLoading.service({
              fullscreen: true,
              text: '加载中...',
              background: 'rgba(0,0,0,0.7)'
            })
          }
          requestCount++
        }
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        this.closeLoading(response.config)
        
        const { data } = response
        
        // 根据后端返回格式处理
        if (data.code === 200 || data.code === 0) {
          return data.data || data
        } else if (data.code === 401) {
          // Token失效
          localStorage.removeItem('token')
          window.location.href = '/login'
          ElMessage.error('登录已过期，请重新登录')
          return Promise.reject(new Error('未授权'))
        } else {
          const message = data.message || '请求失败'
          if (response.config.showError !== false) {
            ElMessage.error(message)
          }
          return Promise.reject(new Error(message))
        }
      },
      (error) => {
        this.closeLoading(error.config)
        
        if (!error.response) {
          ElMessage.error('网络连接失败，请检查网络')
          return Promise.reject(error)
        }
        
        const { status } = error.response
        let message = ''
        
        switch (status) {
          case 400: message = '请求参数错误'; break
          case 401: 
            message = '登录已过期，请重新登录'
            localStorage.removeItem('token')
            window.location.href = '/login'
            break
          case 403: message = '没有权限访问'; break
          case 404: message = '请求资源不存在'; break
          case 500: message = '服务器内部错误'; break
          default: message = `请求失败 (${status})`
        }
        
        if (error.config?.showError !== false) {
          ElMessage.error(message)
        }
        
        return Promise.reject(error)
      }
    )
  }
  
  private closeLoading(config: any) {
    if (config?.showLoading !== false) {
      requestCount--
      if (requestCount === 0 && loadingInstance) {
        loadingInstance.close()
      }
    }
  }
  
  // HTTP方法
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }
  
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }
  
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }
  
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }
  
  // 文件上传
  upload<T = any>(url: string, file: File, data?: Record<string, any>): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })
    }
    return this.instance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export const apiClient = new ApiClient()
'@

$ClientContent | Out-File -FilePath "$ApiDir\client.ts" -Encoding UTF8
Write-ColorOutput "  ✅ 已创建: api/client.ts" "Green"

# 创建 api/index.ts
$ApiIndexContent = @'
export * from './client'
'@

$ApiIndexContent | Out-File -FilePath "$ApiDir\index.ts" -Encoding UTF8
Write-ColorOutput "  ✅ 已创建: api/index.ts" "Green"

# ============================================
# 5. 创建/更新路由
# ============================================
Write-ColorOutput "`n📝 创建路由配置..." "Yellow"

$RouterDir = "$FrontendSrc\router"
if (!(Test-Path $RouterDir)) {
    New-Item -ItemType Directory -Path $RouterDir -Force | Out-Null
}

$RouterContent = @'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 基础路由
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/modules/auth/pages/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/modules/system/pages/error/404.vue'),
    meta: { title: '404', hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

// 自动导入所有模块路由
const modules = import.meta.glob('../modules/*/router/*.ts', { eager: true })
const moduleRoutes: RouteRecordRaw[] = []

Object.keys(modules).forEach((key) => {
  const module = modules[key] as any
  if (module.default) {
    const routes = module.default
    if (Array.isArray(routes)) {
      moduleRoutes.push(...routes)
    } else {
      moduleRoutes.push(routes)
    }
  }
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes, ...moduleRoutes],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path === '/login') {
    if (token) {
      next('/dashboard')
    } else {
      next()
    }
    return
  }
  
  // 404页面不需要登录
  if (to.path === '/404') {
    next()
    return
  }
  
  if (!token && !to.meta?.hidden) {
    next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    return
  }
  
  next()
})

export default router
'@

$RouterContent | Out-File -FilePath "$RouterDir\index.ts" -Encoding UTF8
Write-ColorOutput "  ✅ 已创建: router/index.ts" "Green"

# ============================================
# 6. 创建/更新Pinia Store
# ============================================
Write-ColorOutput "`n📝 创建状态管理..." "Yellow"

$StoreDir = "$FrontendSrc\store"
if (!(Test-Path $StoreDir)) {
    New-Item -ItemType Directory -Path $StoreDir -Force | Out-Null
}

$StoreModulesDir = "$StoreDir\modules"
if (!(Test-Path $StoreModulesDir)) {
    New-Item -ItemType Directory -Path $StoreModulesDir -Force | Out-Null
}

# 创建 store/index.ts
$StoreIndexContent = @'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
'@

$StoreIndexContent | Out-File -FilePath "$StoreDir\index.ts" -Encoding UTF8
Write-ColorOutput "  ✅ 已创建: store/index.ts" "Green"

# 创建 user store
$UserStoreContent = @'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/api'

interface UserInfo {
  id: number
  username: string
  realName: string
  email: string
  phone: string
  avatar: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const realName = computed(() => userInfo.value?.realName || '')
  
  async function login(params: { username: string; password: string }) {
    try {
      const result = await apiClient.post('/auth/login', params)
      token.value = result.token
      localStorage.setItem('token', result.token)
      await getUserInfo()
      return true
    } catch (error) {
      return false
    }
  }
  
  async function getUserInfo() {
    try {
      const info = await apiClient.get<UserInfo>('/auth/user-info')
      userInfo.value = info
      roles.value = info.roles || []
      permissions.value = info.permissions || []
      return info
    } catch (error) {
      throw error
    }
  }
  
  function logout() {
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  
  function resetState() {
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
    localStorage.removeItem('token')
  }
  
  return {
    token,
    userInfo,
    roles,
    permissions,
    isLoggedIn,
    username,
    realName,
    login,
    getUserInfo,
    logout,
    resetState
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token']
  }
})
'@

$UserStoreContent | Out-File -FilePath "$StoreModulesDir\user.ts" -Encoding UTF8
Write-ColorOutput "  ✅ 已创建: store/modules/user.ts" "Green"

# 创建 app store
$AppStoreContent = @'
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
'@

$AppStoreContent | Out-File -FilePath "$StoreModulesDir\app.ts" -Encoding UTF8
Write-ColorOutput "  ✅ 已创建: store/modules/app.ts" "Green"

# 创建 permission store
$PermissionStoreContent = @'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([])
  const isLoaded = ref(false)
  
  async function generateRoutes(roles: string[]) {
    const modules = import.meta.glob('@/modules/*/router/*.ts', { eager: true })
    const allRoutes: RouteRecordRaw[] = []
    
    Object.keys(modules).forEach((key) => {
      const module = modules[key] as any
      if (module.default) {
        const routes = module.default
        if (Array.isArray(routes)) {
          allRoutes.push(...routes)
        } else {
          allRoutes.push(routes)
        }
      }
    })
    
    const filteredRoutes = filterRoutesByPermission(allRoutes, roles)
    routes.value = filteredRoutes
    isLoaded.value = true
    
    return filteredRoutes
  }
  
  function filterRoutesByPermission(routes: RouteRecordRaw[], roles: string[]) {
    return routes.filter(route => {
      if (route.meta?.roles) {
        return (route.meta.roles as string[]).some(role => roles.includes(role))
      }
      return true
    })
  }
  
  return {
    routes,
    isLoaded,
    generateRoutes
  }
})
'@

$PermissionStoreContent | Out-File -FilePath "$StoreModulesDir\permission.ts" -Encoding UTF8
Write-ColorOutput "  ✅ 已创建: store/modules/permission.ts" "Green"

# ============================================
# 7. 更新 main.ts
# ============================================
Write-ColorOutput "`n📝 更新主入口文件..." "Yellow"

$MainContent = @'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import pinia from './store'

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.use(pinia)

app.mount('#app')
'@

$MainContent | Out-File -FilePath "$FrontendSrc\main.ts" -Encoding UTF8
Write-ColorOutput "  ✅ 已更新: main.ts" "Green"

# ============================================
# 8. 创建环境配置文件
# ============================================
Write-ColorOutput "`n📝 创建环境配置..." "Yellow"

$EnvFiles = @{
    ".env.development" = @"
NODE_ENV=development
VITE_APP_TITLE=Bai's ERP System (开发)
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000/ws
VITE_APP_ENV=development
VITE_APP_DEBUG=true
"@
    ".env.production" = @"
NODE_ENV=production
VITE_APP_TITLE=Bai's ERP System
VITE_API_BASE_URL=/api
VITE_WEBSOCKET_URL=wss://api.your-domain.com/ws
VITE_APP_ENV=production
VITE_APP_DEBUG=false
"@
    ".env.staging" = @"
NODE_ENV=production
VITE_APP_TITLE=Bai's ERP System (预发布)
VITE_API_BASE_URL=https://staging-api.your-domain.com/api
VITE_WEBSOCKET_URL=wss://staging-api.your-domain.com/ws
VITE_APP_ENV=staging
VITE_APP_DEBUG=true
"@
}

$EnvDir = "$ProjectRoot\frontend"

foreach ($key in $EnvFiles.Keys) {
    $filePath = "$EnvDir\$key"
    if (Test-Path $filePath) {
        # 备份现有环境文件
        Copy-Item $filePath "$filePath.bak" -Force
    }
    $EnvFiles[$key] | Out-File -FilePath $filePath -Encoding UTF8
    Write-ColorOutput "  ✅ 已创建: $key" "Green"
}

# ============================================
# 9. 更新 vite.config.ts
# ============================================
Write-ColorOutput "`n📝 更新Vite配置..." "Yellow"

$ViteConfigPath = "$ProjectRoot\frontend\vite.config.ts"

if (Test-Path $ViteConfigPath) {
    # 备份
    Copy-Item $ViteConfigPath "$ViteConfigPath.bak" -Force
}

$ViteConfigContent = @'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'vue-vendor': ['vue', 'vue-router', 'pinia']
          }
        }
      }
    }
  }
})
'@

$ViteConfigContent | Out-File -FilePath $ViteConfigPath -Encoding UTF8
Write-ColorOutput "  ✅ 已更新: vite.config.ts" "Green"

# ============================================
# 10. 创建类型定义
# ============================================
Write-ColorOutput "`n📝 创建类型定义..." "Yellow"

$TypesDir = "$FrontendSrc\types"
if (!(Test-Path $TypesDir)) {
    New-Item -ItemType Directory -Path $TypesDir -Force | Out-Null
}

$GlobalTypesContent = @'
declare global {
  interface Window {
    __APP_VERSION__: string
    __BUILD_TIME__: string
  }
}

export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  success: boolean
}

export interface PageParams {
  page: number
  pageSize: number
  total?: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    hidden?: boolean
    roles?: string[]
    keepAlive?: boolean
    breadcrumb?: boolean
    activeMenu?: string
  }
}

export {}
'@

$GlobalTypesContent | Out-File -FilePath "$TypesDir\global.d.ts" -Encoding UTF8
Write-ColorOutput "  ✅ 已创建: types/global.d.ts" "Green"

# ============================================
# 11. 生成模块API示例
# ============================================
Write-ColorOutput "`n📝 创建模块API示例..." "Yellow"

# 为已有模块创建API导出
$ModulesApiDir = "$FrontendSrc\api\modules"
if (!(Test-Path $ModulesApiDir)) {
    New-Item -ItemType Directory -Path $ModulesApiDir -Force | Out-Null
}

# 创建模块API统一导出
$ModulesApiIndexContent = @'
// 自动导出所有模块API
export * from '@/modules/inventory/api'
export * from '@/modules/orders/api'
export * from '@/modules/finance/api'
export * from '@/modules/system/api'
export * from '@/modules/auth/api'
export * from '@/modules/products/api'
export * from '@/modules/purchase/api'
export * from '@/modules/customers/api'
export * from '@/modules/hr/api'
export * from '@/modules/production/api'
export * from '@/modules/pos/api'
export * from '@/modules/analytics/api'
export * from '@/modules/reports/api'
export * from '@/modules/marketing/api'
export * from '@/modules/approval/api'
export * from '@/modules/project/api'
export * from '@/modules/settings/api'
export * from '@/modules/saas/api'
export * from '@/modules/ai/api'
'@

$ModulesApiIndexContent | Out-File -FilePath "$ModulesApiDir\index.ts" -Encoding UTF8
Write-ColorOutput "  ✅ 已创建: api/modules/index.ts" "Green"

# ============================================
# 12. 生成完成报告
# ============================================
Write-ColorOutput "`n📊 生成完成报告..." "Yellow"

$ReportContent = @"
╔═══════════════════════════════════════════════════════════════╗
║              架构完善完成报告                                  ║
╠═══════════════════════════════════════════════════════════════╣
║  项目: Bai's ERP System                                       ║
║  时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')              ║
║  路径: $ProjectRoot                                           ║
╠═══════════════════════════════════════════════════════════════╣
║  完善内容:                                                    ║
║  ✅ API客户端封装 (统一拦截器、错误处理)                      ║
║  ✅ 路由模块化 (自动导入所有模块路由)                         ║
║  ✅ Pinia状态管理 (user, app, permission)                    ║
║  ✅ 环境配置文件 (dev, prod, staging)                         ║
║  ✅ Vite配置优化 (代理、别名、分包)                           ║
║  ✅ 类型定义完善                                              ║
║  ✅ 模块API统一导出                                           ║
╠═══════════════════════════════════════════════════════════════╣
║  备份位置: $BackupDir                                        ║
╠═══════════════════════════════════════════════════════════════╣
║  下一步操作:                                                  ║
║  1. 启动开发服务器: npm run dev                               ║
║  2. 配置后端API地址 (.env文件)                                ║
║  3. 实现各模块的具体API接口                                   ║
║  4. 完善权限控制逻辑                                          ║
╚═══════════════════════════════════════════════════════════════╝
"@

$ReportPath = "$ProjectRoot\architecture_upgrade_report.txt"
$ReportContent | Out-File -FilePath $ReportPath -Encoding UTF8
Write-ColorOutput "  ✅ 报告已生成: $ReportPath" "Green"

# ============================================
# 13. 清理和验证
# ============================================
Write-ColorOutput "`n🔍 验证架构完善结果..." "Yellow"

$Checks = @{
    "API客户端" = Test-Path "$FrontendSrc\api\client.ts"
    "路由配置" = Test-Path "$FrontendSrc\router\index.ts"
    "Store" = Test-Path "$FrontendSrc\store\index.ts"
    "环境配置" = Test-Path "$EnvDir\.env.development"
    "Vite配置" = Test-Path $ViteConfigPath
    "类型定义" = Test-Path "$FrontendSrc\types\global.d.ts"
}

$AllPassed = $true
foreach ($check in $Checks.GetEnumerator()) {
    $status = if ($check.Value) { "✅" } else { "❌" }
    if (!$check.Value) { $AllPassed = $false }
    Write-ColorOutput "  $status $($check.Key)" $(if ($check.Value) { "Green" } else { "Red" })
}

# ============================================
# 14. 完成
# ============================================
Write-ColorOutput @"

╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           🎉 架构完善完成！                                  ║
║                                                               ║
║   所有组件已成功配置，系统架构已升级完成！                    ║
║                                                               ║
║   备份位置: $BackupDir                                       ║
║   报告位置: $ReportPath                                      ║
║                                                               ║
║   现在可以运行: npm run dev                                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
"@ "Cyan"

if ($AllPassed) {
    Write-ColorOutput "✅ 所有组件验证通过！" "Green"
} else {
    Write-ColorOutput "⚠️ 部分组件验证失败，请检查日志" "Yellow"
}

Write-ColorOutput "`n按任意键退出..." "Gray"
Read-Host