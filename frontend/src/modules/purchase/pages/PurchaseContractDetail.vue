<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseContractDetail.vue
  功能: 采购合同详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>采购合同详情</h2>
          <p class="subtitle">合同编号: {{ contractNo }}</p>
        </div>
        <div>
          <el-button type="success" @click="handleApprove"><el-icon><Check /></el-icon> 审批通过</el-button>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
          <el-button @click="handlePrint"><el-icon><Printer /></el-icon> 打印</el-button>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>合同信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="合同编号">{{ contractNo }}</el-descriptions-item>
            <el-descriptions-item label="合同类型"><el-tag type="primary">框架协议</el-tag></el-descriptions-item>
            <el-descriptions-item label="供应商">{{ supplier }}</el-descriptions-item>
            <el-descriptions-item label="合同金额">
              <span style="font-weight: 700; color: #409EFF;">{{ formatCurrency(amount) }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="签署日期">{{ signDate }}</el-descriptions-item>
            <el-descriptions-item label="生效日期">{{ effectiveDate }}</el-descriptions-item>
            <el-descriptions-item label="到期日期">{{ expiryDate }}</el-descriptions-item>
            <el-descriptions-item label="状态"><el-tag type="success">执行中</el-tag></el-descriptions-item>
            <el-descriptions-item label="付款条款" :span="2">{{ paymentTerms }}</el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">{{ remark || '无' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card style="margin-top: 20px">
          <template #header><span>产品明细</span></template>
          <el-table :data="items" border style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="product" label="产品名称" />
            <el-table-column prop="spec" label="规格" />
            <el-table-column prop="quantity" label="数量" align="center" />
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
          <template #header><span>审批流程</span></template>
          <el-steps direction="vertical" :active="3" finish-status="success">
            <el-step title="提交申请" description="2024-01-10 09:00" />
            <el-step title="采购主管审批" description="2024-01-11 14:30" />
            <el-step title="财务审批" description="2024-01-12 10:00" />
            <el-step title="总经理审批" description="2024-01-13 16:00" />
          </el-steps>
        </el-card>

        <el-card style="margin-top: 20px">
          <template #header><span>附件</span></template>
          <el-table :data="attachments" style="width: 100%">
            <el-table-column prop="name" label="文件名" />
            <el-table-column label="操作" align="center">
              <template #default><el-button type="primary" size="small">下载</el-button></template>
            </el-table-column>
          </el-table>
          <el-button type="primary" text style="width: 100%; margin-top: 12px;">
            <el-icon><Upload /></el-icon> 上传附件
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Printer, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const contractNo = ref('PC-2024-001')
const supplier = ref('Apple Supplier')
const amount = ref(1250000)
const signDate = ref('2024-01-15')
const effectiveDate = ref('2024-01-15')
const expiryDate = ref('2025-01-14')
const paymentTerms = ref('1. 付款方式: 30%预付款，70%交货后30天支付\n2. 交货期限: 合同生效后30天内')
const remark = ref('年度框架协议')

const items = ref([
  { product: 'iPhone 15 Pro Max', spec: '256GB 黑色', quantity: 50, price: 5200 },
  { product: 'iPad Pro 12.9"', spec: 'M2 256GB', quantity: 30, price: 6200 },
  { product: 'MacBook Pro 16"', spec: 'M3 Pro 36GB', quantity: 20, price: 9800 },
])

const attachments = ref([
  { name: '合同扫描件.pdf' },
  { name: '附件一：产品清单.xlsx' },
])

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleApprove = () => { ElMessage.success('审批通过') }
const handleEdit = () => { router.push('/purchase/contracts/edit/1') }
const handlePrint = () => { window.print() }
const handleBack = () => { router.push('/purchase/contracts') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>