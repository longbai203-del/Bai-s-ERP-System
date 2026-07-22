<!--
  文件路径: frontend/src/modules/hr/pages/Index.vue
  功能: HR仪表盘 - 人力资源总览与控制面板
  包含: 统计卡片、图表数据、员工列表、快捷操作、通知提醒
-->

<template>
  <div class="hr-dashboard">
    <!-- 页面头部 -->
    <div class="dashboard-header">
      <div class="header-left">
        <h1 class="page-title">🏢 人力资源仪表盘</h1>
        <p class="page-subtitle">实时人力数据总览与智能分析</p>
      </div>
      <div class="header-right">
        <el-button-group>
          <el-button type="primary" @click="handleRefresh" :loading="refreshing">
            <el-icon><Refresh /></el-icon> 刷新数据
          </el-button>
          <el-button type="success" @click="handleExportReport">
            <el-icon><Download /></el-icon> 导出报告
          </el-button>
          <el-button type="warning" @click="handlePrint">
            <el-icon><Printer /></el-icon> 打印
          </el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :md="6" v-for="(stat, index) in dashboardStats" :key="index">
        <el-card class="stat-card" :class="stat.type" shadow="hover" @click="handleStatClick(stat)">
          <div class="stat-icon" :style="{ background: stat.iconBg }">
            <el-icon :size="28"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value-wrapper">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-trend" :class="stat.trend">
                <el-icon><component :is="stat.trend === 'up' ? 'CaretTop' : 'CaretBottom'" /></el-icon>
                {{ stat.change }}%
              </span>
            </div>
            <div class="stat-compare">较上月 {{ stat.compare }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表和快捷操作区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><TrendCharts /></el-icon> 员工趋势分析</span>
              <el-radio-group v-model="trendPeriod" size="small" @change="handleTrendChange">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季</el-radio-button>
                <el-radio-button label="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="trendChartRef">
            <!-- 模拟趋势图 - 使用CSS/SVG图表 -->
            <div class="trend-chart">
              <div class="chart-grid">
                <div class="grid-line" v-for="n in 5" :key="n" :style="{ bottom: (n * 20) + '%' }">
                  <span class="grid-label">{{ (n * 20) }}%</span>
                </div>
              </div>
              <div class="chart-bars">
                <div class="bar-group" v-for="(item, index) in trendData" :key="index">
                  <div class="bar-wrapper">
                    <div class="bar bar-hire" :style="{ height: item.hirePercent + '%' }">
                      <span class="bar-value">{{ item.hire }}</span>
                    </div>
                    <div class="bar bar-resign" :style="{ height: item.resignPercent + '%' }">
                      <span class="bar-value">{{ item.resign }}</span>
                    </div>
                  </div>
                  <div class="bar-label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot hire-dot"></span>入职人数</span>
            <span class="legend-item"><span class="legend-dot resign-dot"></span>离职人数</span>
            <span class="legend-item"><span class="legend-dot net-dot"></span>净增长</span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="quick-actions-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><Odometer /></el-icon> 快捷操作</span>
            </div>
          </template>
          <div class="quick-actions-grid">
            <div class="quick-action" v-for="action in quickActions" :key="action.label" @click="handleQuickAction(action)">
              <div class="action-icon" :style="{ background: action.color }">
                <el-icon :size="24"><component :is="action.icon" /></el-icon>
              </div>
              <span class="action-label">{{ action.label }}</span>
              <span class="action-desc">{{ action.desc }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 员工列表和通知区域 -->
    <el-row :gutter="20" class="list-row">
      <el-col :xs="24" :lg="16">
        <el-card class="employee-list-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><User /></el-icon> 最新员工动态</span>
              <div class="header-actions">
                <el-input v-model="searchKeyword" placeholder="搜索员工..." size="small" style="width: 180px" clearable>
                  <template #prefix><el-icon><Search /></el-icon></template>
                </el-input>
                <el-button size="small" type="primary" @click="handleViewAll">查看全部</el-button>
              </div>
            </div>
          </template>
          <el-table :data="filteredEmployeeList" style="width: 100%" stripe>
            <el-table-column prop="avatar" label="头像" width="60" align="center">
              <template #default="{ row }">
                <el-avatar :size="36" :src="row.avatar" icon="UserFilled" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" min-width="100">
              <template #default="{ row }">
                <div class="employee-name">
                  <span class="name-text">{{ row.name }}</span>
                  <el-tag :type="row.status === 'active' ? 'success' : 'warning'" size="small">
                    {{ row.status === 'active' ? '在职' : '试用期' }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="department" label="部门" width="100" />
            <el-table-column prop="position" label="职位" width="120" />
            <el-table-column prop="hireDate" label="入职日期" width="120" />
            <el-table-column prop="action" label="动态" min-width="150">
              <template #default="{ row }">
                <el-tag :type="row.actionType === 'hire' ? 'success' : row.actionType === 'transfer' ? 'warning' : 'info'" size="small">
                  {{ row.actionText }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" link @click="handleViewEmployee(row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <el-pagination
              v-model:current-page="employeePage"
              v-model:page-size="employeePageSize"
              :total="employeeTotal"
              :page-sizes="[5, 10, 20]"
              size="small"
              layout="total, prev, pager, next"
              @current-change="handleEmployeePageChange"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="notification-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><Bell /></el-icon> 待办提醒</span>
              <el-badge :value="pendingCount" :hidden="pendingCount === 0" type="danger">
                <el-button size="small" @click="handleViewAllNotifications">全部</el-button>
              </el-badge>
            </div>
          </template>
          <div class="notification-list">
            <div class="notification-item" v-for="(notif, index) in notifications" :key="index" @click="handleNotificationClick(notif)">
              <div class="notif-icon" :class="notif.type">
                <el-icon><component :is="notif.icon" /></el-icon>
              </div>
              <div class="notif-content">
                <div class="notif-title">{{ notif.title }}</div>
                <div class="notif-desc">{{ notif.desc }}</div>
                <div class="notif-time">{{ notif.time }}</div>
              </div>
              <div class="notif-badge" v-if="!notif.read">
                <el-badge value="新" type="danger" />
              </div>
            </div>
          </div>
          <div class="notification-footer">
            <el-button type="primary" link @click="handleViewAllNotifications">查看所有待办 →</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 部门分布卡片 -->
    <el-card class="department-card" shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span><el-icon><Grid /></el-icon> 部门人员分布</span>
          <el-button size="small" @click="handleViewDepartment">管理部门</el-button>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="4" v-for="dept in departmentStats" :key="dept.name">
          <div class="department-item" @click="handleDepartmentClick(dept)">
            <div class="dept-icon" :style="{ background: dept.color }">
              <el-icon :size="20"><component :is="dept.icon" /></el-icon>
            </div>
            <div class="dept-info">
              <div class="dept-name">{{ dept.name }}</div>
              <div class="dept-count">{{ dept.count }} 人</div>
              <div class="dept-progress">
                <el-progress :percentage="dept.percentage" :color="dept.color" :stroke-width="6" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 底部版权信息 -->
    <div class="dashboard-footer">
      <span>© {{ currentYear }} HR管理系统 v3.0 - 数据实时更新</span>
      <span>最后更新: {{ lastUpdateTime }}</span>
    </div>

    <!-- 员工详情对话框 -->
    <el-dialog v-model="showEmployeeDialog" title="员工详情" width="600px" destroy-on-close>
      <div v-if="selectedEmployee" class="employee-dialog-content">
        <div class="dialog-avatar">
          <el-avatar :size="80" :src="selectedEmployee.avatar" icon="UserFilled" />
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ selectedEmployee.name }}</el-descriptions-item>
          <el-descriptions-item label="工号">{{ selectedEmployee.employeeNo || 'EMP-001' }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ selectedEmployee.department }}</el-descriptions-item>
          <el-descriptions-item label="职位">{{ selectedEmployee.position }}</el-descriptions-item>
          <el-descriptions-item label="入职日期">{{ selectedEmployee.hireDate }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="selectedEmployee.status === 'active' ? 'success' : 'warning'">
              {{ selectedEmployee.status === 'active' ? '在职' : '试用期' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="电话">{{ selectedEmployee.phone || '未设置' }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ selectedEmployee.email || '未设置' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showEmployeeDialog = false">关闭</el-button>
        <el-button type="primary" @click="handleEditEmployee(selectedEmployee)">编辑信息</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Refresh, Download, Printer, TrendCharts, Odometer, User, Search,
  Bell, Grid, CaretTop, CaretBottom, Setting, Document, Money,
  UserFilled, Plus, Edit, Delete, View, Calendar, Clock, Warning,
  Check, Close, CircleCheck, CircleClose, List, DataLine, PieChart,
  Promotion, Files, Tickets, HomeFilled, OfficeBuilding, Briefcase,
  Location, Phone, Message, ArrowRight, ArrowLeft
} from '@element-plus/icons-vue'

// ==================== Router ====================
const router = useRouter()

// ==================== 状态变量 ====================
const refreshing = ref(false)
const searchKeyword = ref('')
const trendPeriod = ref('month')
const employeePage = ref(1)
const employeePageSize = ref(5)
const employeeTotal = ref(0)
const pendingCount = ref(8)
const showEmployeeDialog = ref(false)
const selectedEmployee = ref<any>(null)
const lastUpdateTime = ref('')
const currentYear = new Date().getFullYear()
const trendChartRef = ref(null)

// ==================== 仪表盘统计数据 ====================
const dashboardStats = ref([
  {
    label: '员工总数',
    value: '1,286',
    change: 8.3,
    trend: 'up',
    compare: '增加 98 人',
    type: 'primary',
    icon: 'User',
    iconBg: 'linear-gradient(135deg, #409EFF, #66b1ff)',
    key: 'total'
  },
  {
    label: '在职员工',
    value: '1,168',
    change: 5.2,
    trend: 'up',
    compare: '增加 58 人',
    type: 'success',
    icon: 'CircleCheck',
    iconBg: 'linear-gradient(135deg, #67C23A, #85ce61)',
    key: 'active'
  },
  {
    label: '试用期员工',
    value: '82',
    change: -3.5,
    trend: 'down',
    compare: '减少 3 人',
    type: 'warning',
    icon: 'Clock',
    iconBg: 'linear-gradient(135deg, #E6A23C, #ebb563)',
    key: 'probation'
  },
  {
    label: '本月入职',
    value: '36',
    change: 12.8,
    trend: 'up',
    compare: '增加 4 人',
    type: 'info',
    icon: 'Plus',
    iconBg: 'linear-gradient(135deg, #909399, #b1b3b8)',
    key: 'hire'
  },
  {
    label: '本月离职',
    value: '12',
    change: -8.2,
    trend: 'down',
    compare: '减少 1 人',
    type: 'danger',
    icon: 'Delete',
    iconBg: 'linear-gradient(135deg, #F56C6C, #f78989)',
    key: 'resign'
  },
  {
    label: '平均工龄',
    value: '3.8年',
    change: 2.1,
    trend: 'up',
    compare: '增加 0.3年',
    type: 'primary',
    icon: 'Calendar',
    iconBg: 'linear-gradient(135deg, #409EFF, #66b1ff)',
    key: 'tenure'
  }
])

// ==================== 趋势数据 ====================
const trendData = ref([
  { label: '1月', hire: 18, resign: 6, hirePercent: 45, resignPercent: 15 },
  { label: '2月', hire: 22, resign: 8, hirePercent: 55, resignPercent: 20 },
  { label: '3月', hire: 28, resign: 5, hirePercent: 70, resignPercent: 12 },
  { label: '4月', hire: 15, resign: 10, hirePercent: 38, resignPercent: 25 },
  { label: '5月', hire: 32, resign: 7, hirePercent: 80, resignPercent: 18 },
  { label: '6月', hire: 20, resign: 9, hirePercent: 50, resignPercent: 22 },
  { label: '7月', hire: 25, resign: 4, hirePercent: 62, resignPercent: 10 },
  { label: '8月', hire: 30, resign: 6, hirePercent: 75, resignPercent: 15 },
  { label: '9月', hire: 18, resign: 11, hirePercent: 45, resignPercent: 28 },
  { label: '10月', hire: 26, resign: 5, hirePercent: 65, resignPercent: 12 },
  { label: '11月', hire: 35, resign: 8, hirePercent: 88, resignPercent: 20 },
  { label: '12月', hire: 40, resign: 10, hirePercent: 100, resignPercent: 25 }
])

// ==================== 快捷操作 ====================
const quickActions = ref([
  { label: '新增员工', icon: 'UserFilled', color: '#409EFF', desc: '录入新员工信息', route: '/hr/employees/create' },
  { label: '考勤管理', icon: 'Clock', color: '#67C23A', desc: '查看考勤记录', route: '/hr/attendance' },
  { label: '薪资核算', icon: 'Money', color: '#E6A23C', desc: '计算本月薪资', route: '/hr/payroll' },
  { label: '招聘管理', icon: 'Tickets', color: '#F56C6C', desc: '管理招聘流程', route: '/hr/recruitment' },
  { label: '培训管理', icon: 'Promotion', color: '#8B5CF6', desc: '安排培训计划', route: '/hr/training' },
  { label: '组织架构', icon: 'Grid', color: '#3B82F6', desc: '查看组织结构', route: '/hr/organization' },
  { label: '绩效管理', icon: 'DataLine', color: '#F59E0B', desc: '绩效考核评估', route: '/hr/performance' },
  { label: '合同管理', icon: 'Files', color: '#10B981', desc: '管理员工合同', route: '/hr/contracts' }
])

// ==================== 员工列表 ====================
const employeeList = ref([
  {
    id: 1,
    name: 'Ahmed Al-Fahd',
    employeeNo: 'EMP-001',
    department: '销售部',
    position: '销售经理',
    status: 'active',
    hireDate: '2020-01-15',
    actionType: 'hire',
    actionText: '新员工入职',
    avatar: '',
    phone: '+966 50 123 4567',
    email: 'ahmed@company.com'
  },
  {
    id: 2,
    name: 'Mohammed Al-Qahtani',
    employeeNo: 'EMP-002',
    department: '采购部',
    position: '采购主管',
    status: 'active',
    hireDate: '2020-03-20',
    actionType: 'transfer',
    actionText: '岗位调整',
    avatar: '',
    phone: '+966 50 234 5678',
    email: 'mohammed@company.com'
  },
  {
    id: 3,
    name: 'Saud Al-Otaibi',
    employeeNo: 'EMP-003',
    department: '财务部',
    position: '财务总监',
    status: 'probation',
    hireDate: '2024-01-15',
    actionType: 'hire',
    actionText: '新员工入职',
    avatar: '',
    phone: '+966 50 345 6789',
    email: 'saud@company.com'
  },
  {
    id: 4,
    name: 'Faisal Al-Dossary',
    employeeNo: 'EMP-004',
    department: '运营部',
    position: '运营经理',
    status: 'active',
    hireDate: '2019-06-10',
    actionType: 'promotion',
    actionText: '职位晋升',
    avatar: '',
    phone: '+966 50 456 7890',
    email: 'faisal@company.com'
  },
  {
    id: 5,
    name: 'Nasser Al-Harbi',
    employeeNo: 'EMP-005',
    department: 'IT部',
    position: '技术总监',
    status: 'active',
    hireDate: '2021-02-01',
    actionType: 'hire',
    actionText: '新员工入职',
    avatar: '',
    phone: '+966 50 567 8901',
    email: 'nasser@company.com'
  },
  {
    id: 6,
    name: 'Abdullah Al-Shammari',
    employeeNo: 'EMP-006',
    department: '销售部',
    position: '销售代表',
    status: 'active',
    hireDate: '2023-08-15',
    actionType: 'transfer',
    actionText: '部门调动',
    avatar: '',
    phone: '+966 50 678 9012',
    email: 'abdullah@company.com'
  },
  {
    id: 7,
    name: 'Sultan Al-Mutairi',
    employeeNo: 'EMP-007',
    department: '财务部',
    position: '财务分析师',
    status: 'probation',
    hireDate: '2024-03-01',
    actionType: 'hire',
    actionText: '新员工入职',
    avatar: '',
    phone: '+966 50 789 0123',
    email: 'sultan@company.com'
  }
])

// ==================== 部门统计 ====================
const departmentStats = ref([
  { name: '销售部', count: 245, percentage: 19, color: '#409EFF', icon: 'TrendCharts' },
  { name: '采购部', count: 168, percentage: 13, color: '#67C23A', icon: 'ShoppingCart' },
  { name: '财务部', count: 96, percentage: 7.5, color: '#E6A23C', icon: 'Money' },
  { name: '运营部', count: 185, percentage: 14.5, color: '#F56C6C', icon: 'Setting' },
  { name: '技术部', count: 178, percentage: 14, color: '#8B5CF6', icon: 'Monitor' },
  { name: '人力资源', count: 72, percentage: 5.6, color: '#3B82F6', icon: 'UserFilled' },
  { name: '市场部', count: 156, percentage: 12, color: '#F59E0B', icon: 'Promotion' },
  { name: '行政部', count: 86, percentage: 6.7, color: '#10B981', icon: 'OfficeBuilding' },
  { name: '后勤部', count: 100, percentage: 7.7, color: '#EC4899', icon: 'Truck' }
])

// ==================== 通知列表 ====================
const notifications = ref([
  {
    title: '员工入职审批',
    desc: 'Abdullah Al-Shammari 入职申请待审批',
    time: '5分钟前',
    type: 'warning',
    icon: 'Clock',
    read: false
  },
  {
    title: '合同即将到期',
    desc: 'Mohammed Al-Qahtani 合同将于30天后到期',
    time: '15分钟前',
    type: 'danger',
    icon: 'Warning',
    read: false
  },
  {
    title: '薪资核算提醒',
    desc: '本月薪资核算截止日期为 2026-07-25',
    time: '1小时前',
    type: 'info',
    icon: 'Bell',
    read: false
  },
  {
    title: '培训课程开始',
    desc: '领导力培训将于明天上午9:00开始',
    time: '2小时前',
    type: 'success',
    icon: 'Promotion',
    read: true
  },
  {
    title: 'Iqama即将到期',
    desc: 'Saud Al-Otaibi 的Iqama将于45天后到期',
    time: '3小时前',
    type: 'danger',
    icon: 'Warning',
    read: false
  },
  {
    title: '绩效评估提醒',
    desc: '季度绩效评估已启动，请在7天内完成',
    time: '5小时前',
    type: 'info',
    icon: 'DataLine',
    read: true
  }
])

// ==================== 计算属性 ====================
const filteredEmployeeList = computed(() => {
  if (!searchKeyword.value) {
    employeeTotal.value = employeeList.value.length
    return employeeList.value.slice(
      (employeePage.value - 1) * employeePageSize.value,
      employeePage.value * employeePageSize.value
    )
  }
  const filtered = employeeList.value.filter(item =>
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    item.department.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    item.position.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
  employeeTotal.value = filtered.length
  return filtered.slice(
    (employeePage.value - 1) * employeePageSize.value,
    employeePage.value * employeePageSize.value
  )
})

// ==================== 方法 ====================
// 刷新数据
const handleRefresh = async () => {
  refreshing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    // 更新统计数据
    dashboardStats.value[0].value = (1286 + Math.floor(Math.random() * 20)).toLocaleString()
    dashboardStats.value[3].value = (36 + Math.floor(Math.random() * 10))
    ElMessage.success('数据已刷新')
    updateLastUpdateTime()
  } catch (error) {
    ElMessage.error('刷新失败，请重试')
  } finally {
    refreshing.value = false
  }
}

// 更新最后更新时间
const updateLastUpdateTime = () => {
  const now = new Date()
  lastUpdateTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 导出报告
const handleExportReport = () => {
  ElMessageBox.confirm('确认导出完整HR报告？', '导出确认', {
    confirmButtonText: '确认导出',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('报告导出成功，文件已保存至下载目录')
  }).catch(() => {})
}

// 打印
const handlePrint = () => {
  window.print()
}

// 统计卡片点击
const handleStatClick = (stat: any) => {
  ElMessage.info(`查看 ${stat.label} 详情`)
  // 根据不同类型跳转到不同页面
  const routeMap: Record<string, string> = {
    total: '/hr/employees',
    active: '/hr/employees',
    probation: '/hr/employees',
    hire: '/hr/onboarding',
    resign: '/hr/resignation',
    tenure: '/hr/employees'
  }
  if (routeMap[stat.key]) {
    router.push(routeMap[stat.key])
  }
}

// 趋势周期切换
const handleTrendChange = (val: string) => {
  ElMessage.info(`切换到 ${val === 'week' ? '本周' : val === 'month' ? '本月' : val === 'quarter' ? '本季' : '本年'} 趋势`)
}

// 快捷操作点击
const handleQuickAction = (action: any) => {
  if (action.route) {
    router.push(action.route)
  } else {
    ElMessage.info(`执行: ${action.label}`)
  }
}

// 查看所有员工
const handleViewAll = () => {
  router.push('/hr/employees')
}

// 查看员工详情
const handleViewEmployee = (row: any) => {
  selectedEmployee.value = row
  showEmployeeDialog.value = true
}

// 编辑员工
const handleEditEmployee = (row: any) => {
  showEmployeeDialog.value = false
  router.push(`/hr/employees/edit/${row.id}`)
}

// 员工分页
const handleEmployeePageChange = (val: number) => {
  employeePage.value = val
}

// 查看所有通知
const handleViewAllNotifications = () => {
  ElMessage.info('查看所有待办通知')
  // 标记所有为已读
  notifications.value.forEach(n => n.read = true)
  pendingCount.value = 0
}

// 通知点击
const handleNotificationClick = (notif: any) => {
  notif.read = true
  pendingCount.value = notifications.value.filter(n => !n.read).length
  ElMessage.info(`查看: ${notif.title}`)
}

// 部门点击
const handleDepartmentClick = (dept: any) => {
  ElMessage.info(`查看 ${dept.name} 部门详情`)
}

// 管理部门
const handleViewDepartment = () => {
  router.push('/hr/organization')
}

// 自动刷新定时器
let refreshTimer: number | null = null

// ==================== 生命周期 ====================
onMounted(() => {
  updateLastUpdateTime()
  // 每5分钟自动刷新
  refreshTimer = window.setInterval(() => {
    handleRefresh()
  }, 300000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<style scoped>
/* ==================== 全局容器 ==================== */
.hr-dashboard {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* ==================== 页面头部 ==================== */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: 0.5px;
}

.page-subtitle {
  margin: 4px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ==================== 统计卡片 ==================== */
.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 16px 20px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.stat-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  transform: translate(30px, -50px);
}

.stat-card .stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  float: left;
  margin-right: 16px;
}

.stat-card .stat-content {
  overflow: hidden;
}

.stat-label {
  color: #909399;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-value-wrapper {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.stat-trend {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}

.stat-trend.up {
  color: #67C23A;
  background: rgba(103, 194, 58, 0.12);
}

.stat-trend.down {
  color: #F56C6C;
  background: rgba(245, 108, 108, 0.12);
}

.stat-compare {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.info { border-left: 4px solid #909399; }

/* ==================== 图表区域 ==================== */
.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  border-radius: 12px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.card-header span {
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ==================== 趋势图表 ==================== */
.chart-container {
  height: 260px;
  position: relative;
  padding: 10px 0;
}

.trend-chart {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #e8ecf1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.grid-label {
  font-size: 10px;
  color: #c0c4cc;
  padding-right: 8px;
  background: white;
  transform: translateY(-50%);
}

.chart-bars {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 4px;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
  gap: 4px;
}

.bar-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 90%;
  width: 100%;
  justify-content: center;
}

.bar {
  width: 18px;
  border-radius: 3px 3px 0 0;
  position: relative;
  min-height: 4px;
  transition: all 0.5s ease;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.bar-hire {
  background: linear-gradient(180deg, #409EFF, #66b1ff);
}

.bar-resign {
  background: linear-gradient(180deg, #F56C6C, #f78989);
}

.bar-value {
  font-size: 8px;
  color: white;
  padding-top: 2px;
  font-weight: 600;
}

.bar-label {
  font-size: 10px;
  color: #909399;
  text-align: center;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.hire-dot { background: #409EFF; }
.resign-dot { background: #F56C6C; }
.net-dot { background: #67C23A; }

/* ==================== 快捷操作 ==================== */
.quick-actions-card {
  border-radius: 12px;
  height: 100%;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border-radius: 10px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.quick-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: #f0f2f5;
}

.action-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 8px;
}

.action-label {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.action-desc {
  font-size: 11px;
  color: #909399;
  margin-top: 2px;
}

/* ==================== 员工列表 ==================== */
.list-row {
  margin-bottom: 20px;
}

.employee-list-card {
  border-radius: 12px;
}

.employee-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-text {
  font-weight: 500;
}

.table-footer {
  padding-top: 16px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
  margin-top: 12px;
}

/* ==================== 通知列表 ==================== */
.notification-card {
  border-radius: 12px;
  height: 100%;
}

.notification-list {
  max-height: 360px;
  overflow-y: auto;
}

.notification-list::-webkit-scrollbar {
  width: 4px;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background: #f8f9fa;
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;
}

.notif-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.notif-icon.warning { background: #E6A23C; }
.notif-icon.danger { background: #F56C6C; }
.notif-icon.info { background: #409EFF; }
.notif-icon.success { background: #67C23A; }

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.notif-desc {
  font-size: 13px;
  color: #606266;
  margin-top: 2px;
}

.notif-time {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 4px;
}

.notif-badge {
  flex-shrink: 0;
  padding-top: 4px;
}

.notification-footer {
  padding-top: 12px;
  text-align: center;
  border-top: 1px solid #ebeef5;
}

/* ==================== 部门分布 ==================== */
.department-card {
  border-radius: 12px;
}

.department-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.department-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  background: #f0f2f5;
}

.dept-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.dept-info {
  flex: 1;
  min-width: 0;
}

.dept-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.dept-count {
  font-size: 12px;
  color: #909399;
}

.dept-progress {
  margin-top: 2px;
}

/* ==================== 员工对话框 ==================== */
.employee-dialog-content {
  padding: 8px 0;
}

.dialog-avatar {
  text-align: center;
  margin-bottom: 20px;
}

/* ==================== 底部 ==================== */
.dashboard-footer {
  margin-top: 24px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #909399;
  flex-wrap: wrap;
  gap: 8px;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .hr-dashboard {
    padding: 12px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
  }

  .header-right .el-button-group {
    width: 100%;
    display: flex;
  }

  .header-right .el-button-group .el-button {
    flex: 1;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card .stat-value {
    font-size: 20px;
  }

  .chart-container {
    height: 200px;
  }

  .bar {
    width: 12px;
  }
}

@media (max-width: 480px) {
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .quick-action {
    padding: 12px 4px;
  }

  .action-icon {
    width: 36px;
    height: 36px;
  }

  .action-label {
    font-size: 12px;
  }

  .stat-card {
    padding: 12px 16px;
  }

  .stat-card .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-value {
    font-size: 18px;
  }
}

/* ==================== 打印样式 ==================== */
@media print {
  .hr-dashboard {
    background: white;
    padding: 16px;
  }

  .stat-card:hover {
    transform: none !important;
  }

  .quick-action:hover {
    transform: none !important;
  }

  .header-right .el-button,
  .quick-actions-card,
  .notification-card .el-button {
    display: none !important;
  }

  .dashboard-footer {
    border-top: 1px solid #dcdfe6;
  }
}
</style>