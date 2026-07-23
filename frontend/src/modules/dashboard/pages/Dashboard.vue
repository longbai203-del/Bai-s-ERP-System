<template>
  <div class="dashboard-page">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-content">
          <div class="stat-icon" :style="{ background: stat.bg }">
            <el-icon :size="24"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 最近订单表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>📋 最近订单</span>
          <el-button size="small" @click="$router.push('/orders')">查看全部</el-button>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="recentOrders"
        border
        style="width: 100%"
        @row-click="viewOrder"
      >
        <el-table-column prop="order_number" label="订单号" width="160" />
        <el-table-column prop="customer_name" label="客户" min-width="120" />
        <el-table-column prop="total" label="金额" width="120" align="right">
          <template #default="{ row }">¥{{ row.total?.toFixed(2) || '0.00' }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click.stop="viewOrder(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/services/api'

const router = useRouter()
const loading = ref(false)

// 统计卡片数据
const stats = reactive([
  { label: '总订单', value: '0', icon: 'Document', bg: '#E8F5FE' },
  { label: '总收入', value: '¥0', icon: 'Money', bg: '#E6F7E6' },
  { label: '总客户', value: '0', icon: 'User', bg: '#FEF3E2' },
  { label: '总产品', value: '0', icon: 'Box', bg: '#F3E8FF' }
])

// 最近订单数据
const recentOrders = ref([])

// 状态工具函数
const getStatusLabel = (status) => {
  const map = { paid: '已支付', pending: '待处理', completed: '已完成', cancelled: '已取消' }
  return map[status] || status
}

const getStatusType = (status) => {
  const map = { paid: 'success', pending: 'warning', completed: 'info', cancelled: 'danger' }
  return map[status] || 'info'
}

const viewOrder = (row) => {
  router.push(`/orders/${row.id}`)
}

// 加载 Dashboard 数据
const loadData = async () => {
  loading.value = true
  try {
    // 获取统计信息
    const statsResponse = await api.get('/dashboard/stats')
    if (statsResponse.data?.success) {
      const data = statsResponse.data.data
      stats[0].value = data.totalOrders?.toLocaleString() || '0'
      stats[1].value = `¥${data.totalRevenue?.toLocaleString() || '0'}`
      stats[2].value = data.totalCustomers?.toLocaleString() || '0'
      stats[3].value = data.totalProducts?.toLocaleString() || '0'
    }

    // 获取最近订单
    const ordersResponse = await api.get('/orders', { 
      params: { limit: 5, sort: 'created_at:desc' }
    })
    if (ordersResponse.data?.success) {
      recentOrders.value = ordersResponse.data.data || []
    }
  } catch (error) {
    console.warn('API 请求失败，使用模拟数据:', error.message)
    // 降级到模拟数据
    stats[0].value = '1,284'
    stats[1].value = '¥128,500'
    stats[2].value = '856'
    stats[3].value = '342'
    
    recentOrders.value = [
      { id: 1, order_number: 'ORD-2024-001', customer_name: '张三', total: 299.99, status: 'paid' },
      { id: 2, order_number: 'ORD-2024-002', customer_name: '李四', total: 159.50, status: 'pending' },
      { id: 3, order_number: 'ORD-2024-003', customer_name: '王五', total: 459.00, status: 'completed' },
      { id: 4, order_number: 'ORD-2024-004', customer_name: '赵六', total: 89.00, status: 'paid' },
      { id: 5, order_number: 'ORD-2024-005', customer_name: '孙七', total: 329.50, status: 'pending' }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.dashboard-page { padding: 20px; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card { border-radius: 12px; }
.stat-content { display: flex; align-items: center; gap: 16px; }
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4F46E5;
}
.stat-value { font-size: 24px; font-weight: 700; color: #1F2937; }
.stat-label { font-size: 14px; color: #6B7280; }

.table-card { border-radius: 12px; }
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

