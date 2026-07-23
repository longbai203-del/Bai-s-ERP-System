<template>
  <div class="pos-detail-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon> 返回列表
        </el-button>
        <h1>
          <el-icon :size="28" color="#4F46E5"><Monitor /></el-icon>
          设备详情
        </h1>
        <el-tag :type="getStatusTag(deviceData.status)" size="large" effect="dark">
          {{ getStatusLabel(deviceData.status) }}
        </el-tag>
      </div>
      <div class="header-actions">
        <el-button type="warning" @click="handleEdit">
          <el-icon><Edit /></el-icon> 编辑
        </el-button>
        <el-button
          v-if="deviceData.status === 'offline'"
          type="success"
          @click="handleActivate"
        >
          <el-icon><Play /></el-icon> 激活
        </el-button>
        <el-button
          v-if="deviceData.status === 'online'"
          type="warning"
          @click="handleMaintenance"
        >
          <el-icon><Tools /></el-icon> 维护
        </el-button>
        <el-button type="danger" @click="handleDelete">
          <el-icon><Delete /></el-icon> 删除
        </el-button>
      </div>
    </div>

    <!-- 设备信息 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="16">
        <el-card class="info-card" shadow="hover" v-loading="loading">
          <template #header>
            <span class="card-title">
              <el-icon><InfoFilled /></el-icon> 设备信息
            </span>
          </template>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="设备编号">
              {{ deviceData.code }}
            </el-descriptions-item>
            <el-descriptions-item label="设备名称">
              <strong>{{ deviceData.name }}</strong>
            </el-descriptions-item>
            <el-descriptions-item label="所属门店">
              {{ getStoreLabel(deviceData.store) }}
            </el-descriptions-item>
            <el-descriptions-item label="安装位置">
              {{ deviceData.location }}
            </el-descriptions-item>
            <el-descriptions-item label="设备型号">
              {{ deviceData.model }}
            </el-descriptions-item>
            <el-descriptions-item label="IP地址">
              {{ deviceData.ipAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="当前状态">
              <el-tag :type="getStatusTag(deviceData.status)">
                {{ getStatusLabel(deviceData.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="最后活跃">
              {{ deviceData.lastActive }}
            </el-descriptions-item>
            <el-descriptions-item label="当前收银员">
              {{ deviceData.cashier || '无' }}
            </el-descriptions-item>
            <el-descriptions-item label="今日订单">
              {{ deviceData.todayOrders || 0 }} 笔
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ deviceData.createdAt }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ deviceData.updatedAt }}
            </el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">
              {{ deviceData.remark || '无' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <!-- 设备状态 -->
        <el-card class="status-card" shadow="hover">
          <template #header>
            <span class="card-title">
              <el-icon><Cpu /></el-icon> 设备状态
            </span>
          </template>

          <div class="device-status">
            <div class="status-item">
              <span class="status-label">连接状态</span>
              <span class="status-value">
                <el-tag :type="deviceData.status === 'online' ? 'success' : 'danger'" size="large">
                  {{ deviceData.status === 'online' ? '已连接' : '未连接' }}
                </el-tag>
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">运行时长</span>
              <span class="status-value">{{ deviceData.uptime || '--' }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">系统版本</span>
              <span class="status-value">{{ deviceData.systemVersion || 'v2.0.1' }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">今日交易</span>
              <span class="status-value">{{ deviceData.todayOrders || 0 }} 笔</span>
            </div>
            <div class="status-item">
              <span class="status-label">今日收入</span>
              <span class="status-value" style="color: #409eff; font-weight: 700;">
                ¥{{ formatNumber(deviceData.todayIncome || 0) }}
              </span>
            </div>
          </div>
        </el-card>

        <!-- 快捷操作 -->
        <el-card class="quick-actions-card" shadow="hover" style="margin-top: 20px;">
          <template #header>
            <span class="card-title">
              <el-icon><Operation /></el-icon> 快捷操作
            </span>
          </template>

          <div class="quick-actions">
            <el-button type="primary" plain @click="handleRemoteConnect">
              <el-icon><Connection /></el-icon> 远程连接
            </el-button>
            <el-button type="success" plain @click="handleReboot">
              <el-icon><RefreshRight /></el-icon> 重启设备
            </el-button>
            <el-button type="warning" plain @click="handleViewLogs">
              <el-icon><Document /></el-icon> 查看日志
            </el-button>
            <el-button type="danger" plain @click="handleShutdown">
              <el-icon><Power /></el-icon> 关机
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Monitor,
  Edit,
  Play,
  Tools,
  Delete,
  InfoFilled,
  Cpu,
  Operation,
  Connection,
  RefreshRight,
  Document,
  Power,
  Warning
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// ========== 响应式数据 ==========
const loading = ref(false)

// 设备数据
const deviceData = reactive({
  id: 0,
  code: '',
  name: '',
  store: '',
  location: '',
  model: '',
  ipAddress: '',
  status: '',
  lastActive: '',
  cashier: '',
  todayOrders: 0,
  todayIncome: 0,
  uptime: '',
  systemVersion: '',
  createdAt: '',
  updatedAt: '',
  remark: ''
})

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    online: 'success',
    offline: 'danger',
    maintenance: 'warning'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    online: '在线',
    offline: '离线',
    maintenance: '维护中'
  }
  return map[status] || status
}

const getStoreLabel = (store: string) => {
  const map: Record<string, string> = {
    flagship: '旗舰店',
    branch1: '分店一',
    branch2: '分店二'
  }
  return map[store] || store
}

// ========== 获取详情数据 ==========
const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('无效的设备ID')
    router.push('/pos/list')
    return
  }

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))

    const mockData = {
      id: parseInt(id),
      code: `POS-${String(id).padStart(3, '0')}`,
      name: `前台收银 ${id}`,
      store: 'flagship',
      location: '一楼收银台',
      model: 'POS-3000',
      ipAddress: `192.168.1.${100 + parseInt(id)}`,
      status: ['online', 'offline', 'maintenance'][parseInt(id) % 3],
      lastActive: new Date().toISOString().replace('T', ' ').slice(0, 16),
      cashier: '张伟',
      todayOrders: Math.floor(Math.random() * 50 + 10),
      todayIncome: Math.floor(Math.random() * 10000 + 1000),
      uptime: `${Math.floor(Math.random() * 24 + 1)} 小时 ${Math.floor(Math.random() * 60)} 分钟`,
      systemVersion: 'v2.0.1',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      remark: ''
    }

    Object.assign(deviceData, mockData)
  } catch (error) {
    ElMessage.error('加载详情失败，请重试')
  } finally {
    loading.value = false
  }
}

// ========== 事件处理 ==========
const handleBack = () => {
  router.push('/pos/list')
}

const handleEdit = () => {
  router.push(`/pos/edit/${deviceData.id}`)
}

const handleActivate = () => {
  ElMessageBox.confirm(`确定要激活设备 ${deviceData.name} 吗？`, '确认', {
    confirmButtonText: '激活',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    deviceData.status = 'online'
    deviceData.lastActive = new Date().toISOString().replace('T', ' ').slice(0, 16)
    ElMessage.success('设备已激活')
  }).catch(() => {})
}

const handleMaintenance = () => {
  ElMessageBox.confirm(`确定要将设备 ${deviceData.name} 设置为维护状态吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deviceData.status = 'maintenance'
    ElMessage.warning('设备已进入维护状态')
  }).catch(() => {})
}

const handleDelete = () => {
  ElMessageBox.confirm(`确定要删除设备 ${deviceData.name} 吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    router.push('/pos/list')
  }).catch(() => {})
}

const handleRemoteConnect = () => {
  ElMessage.info('远程连接功能开发中')
}

const handleReboot = () => {
  ElMessageBox.confirm(`确定要重启设备 ${deviceData.name} 吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('设备重启指令已发送')
  }).catch(() => {})
}

const handleViewLogs = () => {
  ElMessage.info('查看日志功能开发中')
}

const handleShutdown = () => {
  ElMessageBox.confirm(`确定要关闭设备 ${deviceData.name} 吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    ElMessage.warning('设备关机指令已发送')
  }).catch(() => {})
}

// ========== 生命周期 ==========
onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.pos-detail-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.info-card,
.status-card,
.quick-actions-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.device-status {
  padding: 4px 0;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f5;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  color: #909399;
  font-size: 14px;
}

.status-value {
  font-weight: 500;
  color: #303133;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.quick-actions .el-button {
  width: 100%;
}

@media (max-width: 768px) {
  .pos-detail-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
    font-size: 12px;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>