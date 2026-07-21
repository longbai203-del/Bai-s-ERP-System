<!-- 
  文件路径: frontend/src/modules/ai/pages/GenerateQuotation.vue
  功能: AI生成报价单 - 智能生成销售报价
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>AI 生成报价单</h2>
          <p class="subtitle">智能分析客户需求，生成专业报价</p>
        </div>
        <div>
          <el-tag type="warning" size="large">🤖 AI智能报价</el-tag>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="客户名称">
              <el-select v-model="form.customer" placeholder="请选择客户" style="width: 100%" filterable>
                <el-option label="沙特电信公司" value="沙特电信公司" />
                <el-option label="阿尔拉吉银行" value="阿尔拉吉银行" />
                <el-option label="沙特阿美" value="沙特阿美" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品类别">
              <el-select v-model="form.category" placeholder="请选择类别" style="width: 100%">
                <el-option label="电子产品" value="electronics" />
                <el-option label="办公设备" value="office" />
                <el-option label="通信设备" value="communication" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" size="large" @click="handleGenerate"><el-icon><Monitor /></el-icon> 智能生成</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>🤖 AI 推荐报价方案</span>
          <el-tag type="success" size="small">AI优化价格</el-tag>
        </div>
      </template>
      <el-table :data="quotationItems" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="spec" label="规格" />
        <el-table-column prop="quantity" label="数量" align="center" />
        <el-table-column prop="standardPrice" label="标准价" align="right">
          <template #default="{ row }">{{ formatCurrency(row.standardPrice) }}</template>
        </el-table-column>
        <el-table-column prop="aiPrice" label="AI建议价" align="right">
          <template #default="{ row }">
            <span style="color: #F56C6C; font-weight: 600;">{{ formatCurrency(row.aiPrice) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="折扣" align="center">{{ row.discount }}%</el-table-column>
        <el-table-column prop="total" label="小计" align="right">
          <template #default="{ row }">{{ formatCurrency(row.total) }}</template>
        </el-table-column>
      </el-table>
      <div style="text-align: right; margin-top: 16px; font-size: 16px;">
        报价总额: <span style="font-weight: 700; color: #409EFF; font-size: 20px;">{{ formatCurrency(totalQuote) }}</span>
        <span style="margin-left: 16px; color: #67C23A;">节省: {{ formatCurrency(totalSavings) }}</span>
      </div>
      <div style="text-align: right; margin-top: 12px;">
        <el-button type="primary" @click="handleCreateQuote"><el-icon><Document /></el-icon> 生成正式报价单</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Monitor, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  customer: '',
  category: 'electronics',
})

const quotationItems = ref([
  { product: 'iPhone 15 Pro Max', spec: '256GB 黑色', quantity: 50, standardPrice: 5200, aiPrice: 4800, discount: 7.7, total: 240000 },
  { product: 'iPad Pro 12.9"', spec: 'M2 256GB', quantity: 30, standardPrice: 6200, aiPrice: 5800, discount: 6.5, total: 174000 },
  { product: 'MacBook Pro 16"', spec: 'M3 Pro 36GB', quantity: 20, standardPrice: 9800, aiPrice: 9200, discount: 6.1, total: 184000 },
])

const totalQuote = computed(() => quotationItems.value.reduce((sum, item) => sum + item.total, 0))
const totalSavings = computed(() => {
  return quotationItems.value.reduce((sum, item) => sum + (item.standardPrice - item.aiPrice) * item.quantity, 0)
})

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleGenerate = () => { ElMessage.success('AI报价已生成') }
const handleCreateQuote = () => { ElMessage.success('正式报价单已创建') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>