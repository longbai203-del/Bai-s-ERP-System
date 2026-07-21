<!-- 
  文件路径: frontend/src/modules/orders/pages/QuotationDetail.vue
  功能: 报价详情 - 查看报价单完整信息
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>报价详情</h2>
          <p class="subtitle">报价单号: {{ quotationNo }}</p>
        </div>
        <div>
          <el-button type="success" @click="handleConvert">
            <el-icon><Document /></el-icon> 转订单
          </el-button>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
          <el-button @click="handlePrint">
            <el-icon><Printer /></el-icon> 打印
          </el-button>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>报价信息</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="报价单号">{{ quotationNo }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag type="success">已确认</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="客户名称">{{ customer }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ contact }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ email }}</el-descriptions-item>
            <el-descriptions-item label="有效期至">{{ validUntil }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ createdAt }}</el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">{{ remark || '无' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card style="margin-top: 20px">
          <template #header>
            <span>产品明细</span>
          </template>
          <el-table :data="items" border style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="product" label="产品名称" />
            <el-table-column prop="spec" label="规格" />
            <el-table-column prop="quantity" label="数量" align="center" />
            <el-table-column prop="price" label="单价" align="right">
              <template #default="{ row }">
                {{ formatCurrency(row.price) }}
              </template>
            </el-table-column>
            <el-table-column label="小计" align="right">
              <template #default="{ row }">
                <span style="font-weight: 600; color: #409EFF;">
                  {{ formatCurrency(row.quantity * row.price) }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: right; margin-top: 16px; font-size: 16px;">
            折扣: {{ discount }}% &nbsp;&nbsp;
            合计: <span style="font-weight: 700; color: #409EFF; font-size: 20px;">
              {{ formatCurrency(total) }}
            </span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span>操作记录</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="log in logs"
              :key="log.id"
              :timestamp="log.time"
              :type="log.type"
            >
              {{ log.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>

        <el-card style="margin-top: 20px">
          <template #header>
            <span>审批信息</span>
          </template>
          <div class="approval-info">
            <div class="approval-item">
              <span class="approval-label">创建人</span>
              <span class="approval-value">Ahmed Al-Fahd</span>
            </div>
            <div class="approval-item">
              <span class="approval-label">审批人</span>
              <span class="approval-value">Mohammed Al-Qahtani</span>
            </div>
            <div class="approval-item">
              <span class="approval-label">审批状态</span>
              <el-tag type="success">已批准</el-tag>
            </div>
            <div class="approval-item">
              <span class="approval-label">审批时间</span>
              <span class="approval-value">2024-11-16 14:30</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Printer } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const quotationNo = ref('QT-2024-001')
const customer = ref('沙特电信公司')
const contact = ref('Ahmed Al-Fahd')
const phone = ref('+966 50 123 4567')
const email = ref('ahmed@stc.com.sa')
const validUntil = ref('2024-12-31')
const createdAt = ref('2024-11-15 10:30')
const remark = ref('优先客户，报价有效期30天')
const discount = ref(5)

const items = ref([
  { product: 'iPhone 15 Pro Max', spec: '256GB 黑色', quantity: 10, price: 5200 },
  { product: '三星 Galaxy S24 Ultra', spec: '512GB 黑色', quantity: 8, price: 4800 },
  { product: 'MacBook Pro 16"', spec: 'M3 Pro 36GB', quantity: 5, price: 9800 },
])

const logs = ref([
  { id: 1, content: '报价已发送给客户', time: '2024-11-15 14:30', type: 'primary' },
  { id: 2, content: '客户已确认报价', time: '2024-11-16 10:00', type: 'success' },
  { id: 3, content: '审批通过', time: '2024-11-16 14:30', type: 'success' },
  { id: 4, content: '报价创建', time: '2024-11-15 10:30', type: 'info' },
])

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
}

const total = ref(285600)

const handleConvert = () => {
  ElMessage.success('已转换为订单')
}

const handleEdit = () => {
  router.push('/orders/quotations/edit/1')
}

const handlePrint = () => {
  window.print()
}

const handleBack = () => {
  router.push('/orders/quotations')
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.approval-info { padding: 8px 0; }
.approval-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
.approval-item:last-child { border-bottom: none; }
.approval-label { color: #909399; }
.approval-value { font-weight: 500; }
</style>