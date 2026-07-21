<!-- 
  文件路径: frontend/src/modules/production/pages/BOMDetail.vue
  功能: BOM详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>BOM详情</h2>
          <p class="subtitle">物料清单: {{ bomNo }}</p>
        </div>
        <div>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>基本信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="BOM编号">{{ bomNo }}</el-descriptions-item>
            <el-descriptions-item label="版本">{{ version }}</el-descriptions-item>
            <el-descriptions-item label="产品名称">{{ product }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag type="success">已发布</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="物料数量">{{ items.length }} 项</el-descriptions-item>
            <el-descriptions-item label="总成本">{{ formatCurrency(totalCost) }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ createdAt }}</el-descriptions-item>
            <el-descriptions-item label="创建人">{{ createdBy }}</el-descriptions-item>
            <el-descriptions-item label="描述" :span="2">{{ description }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card style="margin-top: 20px">
          <template #header><span>物料明细</span></template>
          <el-table :data="items" border style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="materialName" label="物料名称" />
            <el-table-column prop="materialNo" label="物料编号" />
            <el-table-column prop="quantity" label="数量" align="center" />
            <el-table-column prop="unit" label="单位" align="center" />
            <el-table-column prop="price" label="单价" align="right">
              <template #default="{ row }">{{ formatCurrency(row.price) }}</template>
            </el-table-column>
            <el-table-column label="小计" align="right">
              <template #default="{ row }">
                <span style="font-weight: 600; color: #409EFF;">{{ formatCurrency(row.quantity * row.price) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header><span>BOM结构树</span></template>
          <el-tree :data="treeData" default-expand-all node-key="id" />
        </el-card>

        <el-card style="margin-top: 20px">
          <template #header><span>关联工单</span></template>
          <el-table :data="relatedOrders" style="width: 100%">
            <el-table-column prop="orderNo" label="工单号" />
            <el-table-column prop="status" label="状态" align="center">
              <template #default><el-tag type="warning">进行中</el-tag></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const bomNo = ref('BOM-2024-001')
const version = ref('V1.0')
const product = ref('iPhone 15 Pro Max')
const totalCost = ref(4250)
const createdAt = ref('2024-11-20 10:30')
const createdBy = ref('Ahmed Al-Fahd')
const description = ref('iPhone 15 Pro Max 256GB 黑色 标准BOM')

const items = ref([
  { materialName: '屏幕总成', materialNo: 'MT-001', quantity: 1, unit: '片', price: 1200 },
  { materialName: '主板', materialNo: 'MT-002', quantity: 1, unit: '片', price: 850 },
  { materialName: '电池', materialNo: 'MT-003', quantity: 1, unit: '个', price: 350 },
  { materialName: '后盖', materialNo: 'MT-004', quantity: 1, unit: '个', price: 280 },
  { materialName: '摄像头模组', materialNo: 'MT-005', quantity: 1, unit: '个', price: 450 },
])

const treeData = ref([
  {
    id: 1,
    label: 'iPhone 15 Pro Max (成品)',
    children: [
      { id: 2, label: '屏幕总成 (1片)' },
      { id: 3, label: '主板 (1片)' },
      { id: 4, label: '电池 (1个)' },
      { id: 5, label: '后盖 (1个)' },
      { id: 6, label: '摄像头模组 (1个)' },
    ],
  },
])

const relatedOrders = ref([
  { orderNo: 'WO-2024-001', status: 'processing' },
  { orderNo: 'WO-2024-002', status: 'pending' },
])

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleEdit = () => { router.push('/production/bom/edit/1') }
const handleExport = () => { ElMessage.success('导出完成') }
const handleBack = () => { router.push('/production/bom') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>