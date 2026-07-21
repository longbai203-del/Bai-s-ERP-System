<!-- 
  文件路径: frontend/src/modules/ai/pages/GeneratePurchaseOrder.vue
  功能: AI生成采购单 - 智能生成采购订单
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>AI 生成采购单</h2>
          <p class="subtitle">智能分析库存与需求，自动生成采购订单</p>
        </div>
        <div>
          <el-tag type="warning" size="large">🤖 AI智能生成</el-tag>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="searchForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="分析周期">
              <el-date-picker v-model="searchForm.period" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商">
              <el-select v-model="searchForm.supplier" placeholder="请选择供应商" style="width: 100%">
                <el-option label="Apple Supplier" value="apple" />
                <el-option label="Samsung Supplier" value="samsung" />
                <el-option label="Dell Supplier" value="dell" />
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
          <span>AI 推荐采购清单</span>
          <span style="color: #909399; font-size: 13px;">基于库存预测与销售趋势分析</span>
        </div>
      </template>
      <el-table :data="recommendations" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="currentStock" label="当前库存" align="center" />
        <el-table-column prop="suggestedOrder" label="建议采购" align="center">
          <template #default="{ row }">
            <span style="color: #F56C6C; font-weight: 700;">{{ row.suggestedOrder }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价" align="right">
          <template #default="{ row }">{{ formatCurrency(row.unitPrice) }}</template>
        </el-table-column>
        <el-table-column prop="totalCost" label="预估总价" align="right">
          <template #default="{ row }">{{ formatCurrency(row.totalCost) }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template #default>
            <el-button type="primary" size="small">生成采购单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right; margin-top: 16px; font-size: 16px;">
        预计采购总额: <span style="font-weight: 700; color: #409EFF; font-size: 20px;">{{ formatCurrency(totalCost) }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Monitor } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  period: [] as [Date, Date] | [],
  supplier: 'apple',
})

const recommendations = ref([
  { product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', currentStock: 156, suggestedOrder: 144, unitPrice: 5200, totalCost: 748800 },
  { product: '三星 Galaxy S24 Ultra', sku: 'SGS-S24-U-512', currentStock: 89, suggestedOrder: 131, unitPrice: 4800, totalCost: 628800 },
  { product: 'iPad Pro 12.9"', sku: 'IPP-129-M2-256', currentStock: 12, suggestedOrder: 138, unitPrice: 6200, totalCost: 855600 },
])

const totalCost = computed(() => {
  return recommendations.value.reduce((sum, item) => sum + item.totalCost, 0)
})

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleGenerate = () => { ElMessage.success('AI分析完成，已生成推荐采购清单') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>