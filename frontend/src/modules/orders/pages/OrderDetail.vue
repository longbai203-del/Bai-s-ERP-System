<template>
  <div class="order-detail-page">
    <div class="page-header">
      <el-button @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon> 返回
      </el-button>
      <h1>📋 订单详情</h1>
      <div>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
    </div>

    <el-card v-loading="loading" class="detail-card">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">
          {{ order?.order_number || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(order?.status)">
            {{ getStatusLabel(order?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="客户">
          {{ order?.customer_name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="金额">
          ¥{{ order?.total?.toFixed(2) || '0.00' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDate(order?.created_at) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ formatDate(order?.updated_at) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 商品列表 -->
    <el-card class="items-card">
      <template #header>
        <span>📦 商品列表</span>
      </template>
      <el-table :data="order?.items || []" border>
        <el-table-column prop="name" label="商品名称" min-width="150" />
        <el-table-column prop="quantity" label="数量" width="100" align="center" />
        <el-table-column prop="price" label="单价" width="120" align="right">
          <template #default="{ row }">¥{{ row.price?.toFixed(2) || '0.00' }}</template>
        </el-table-column>
        <el-table-column label="小计" width="140" align="right">
          <template #default="{ row }">
            ¥{{ (row.price * row.quantity)?.toFixed(2) || '0.00' }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const order = ref(null)

// 状态工具函数
const getStatusLabel = (status) => {
  const map = { paid: '已支付', pending: '待处理', completed: '已完成', cancelled: '已取消' }
  return map[status] || status
}

const getStatusType = (status) => {
  const map = { paid: 'success', pending: 'warning', completed: 'info', cancelled: 'danger' }
  return map[status] || 'info'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

// 加载订单数据
const loadOrder = async () => {
  loading.value = true
  try {
    const id = route.params.id
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟数据
    order.value = {
      id: parseInt(id),
      order_number: `ORD-2024-${String(id).padStart(3, '0')}`,
      customer_name: ['张三', '李四', '王五', '赵六', '孙七'][(id - 1) % 5],
      total: [299.99, 159.50, 459.00, 89.00, 329.50][(id - 1) % 5],
      status: ['paid', 'pending', 'completed', 'paid', 'pending'][(id - 1) % 5],
      items: [
        { name: '标准洗车', quantity: 2, price: 89.00 },
        { name: '内饰清洁', quantity: 1, price: 299.00 },
        { name: '轮胎护理', quantity: 1, price: 120.00 }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  } catch (error) {
    ElMessage.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  ElMessage.info('编辑功能开发中')
}

const handleDelete = () => {
  ElMessageBox.confirm('确定要删除此订单吗？', '确认删除', { type: 'warning' })
    .then(() => {
      ElMessage.success('删除成功')
      router.push('/orders')
    })
    .catch(() => {})
}

onMounted(loadOrder)
</script>

<style scoped>
.order-detail-page { padding: 20px; }
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.page-header h1 { margin: 0; font-size: 24px; flex: 1; }
.detail-card { margin-bottom: 20px; }
.items-card { margin-bottom: 20px; }
</style>
