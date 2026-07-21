<!-- 
  文件路径: frontend/src/modules/reports/pages/CustomReportBuilder.vue
  功能: 自定义报表 - 自定义报表构建器
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>自定义报表构建器</h3>
        <div>
          <el-button type="primary" @click="handleSave"><el-icon><Document /></el-icon> 保存报表</el-button>
          <el-button type="success" @click="handleRun"><el-icon><Monitor /></el-icon> 运行报表</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header><span>步骤1: 选择数据源</span></template>
          <el-radio-group v-model="dataSource" size="large">
            <el-radio-button label="sales">销售数据</el-radio-button>
            <el-radio-button label="purchase">采购数据</el-radio-button>
            <el-radio-button label="inventory">库存数据</el-radio-button>
            <el-radio-button label="finance">财务数据</el-radio-button>
            <el-radio-button label="hr">HR数据</el-radio-button>
            <el-radio-button label="customer">客户数据</el-radio-button>
          </el-radio-group>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card>
          <template #header><span>步骤2: 选择字段</span></template>
          <el-checkbox-group v-model="selectedFields">
            <el-checkbox v-for="field in availableFields" :key="field.value" :label="field.value">
              {{ field.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>步骤3: 筛选条件</span></template>
          <div v-for="(filter, index) in filters" :key="index" class="filter-row">
            <el-select v-model="filter.field" placeholder="字段" style="width: 40%">
              <el-option v-for="field in availableFields" :key="field.value" :label="field.label" :value="field.value" />
            </el-select>
            <el-select v-model="filter.operator" placeholder="运算符" style="width: 30%">
              <el-option label="等于" value="eq" />
              <el-option label="不等于" value="ne" />
              <el-option label="大于" value="gt" />
              <el-option label="小于" value="lt" />
              <el-option label="包含" value="like" />
            </el-select>
            <el-input v-model="filter.value" placeholder="值" style="width: 30%" />
            <el-button type="danger" size="small" @click="removeFilter(index)">×</el-button>
          </div>
          <el-button type="primary" text @click="addFilter"><el-icon><Plus /></el-icon> 添加条件</el-button>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>步骤4: 预览</span></template>
          <div class="preview-info">
            <div class="preview-item">
              <span class="preview-label">数据源</span>
              <span class="preview-value">{{ dataSourceLabel }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">字段数</span>
              <span class="preview-value">{{ selectedFields.length }} 个</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">筛选条件</span>
              <span class="preview-value">{{ filters.length }} 个</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">预估数据量</span>
              <span class="preview-value">约 1,286 条</span>
            </div>
          </div>
          <el-button type="primary" style="width: 100%; margin-top: 16px;" @click="handleRun">
            <el-icon><Monitor /></el-icon> 生成报表
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Document, Monitor, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const dataSource = ref('sales')
const selectedFields = ref(['product', 'amount', 'quantity'])

const dataSourceLabel = computed(() => {
  const map: Record<string, string> = {
    sales: '销售数据',
    purchase: '采购数据',
    inventory: '库存数据',
    finance: '财务数据',
    hr: 'HR数据',
    customer: '客户数据'
  }
  return map[dataSource.value] || dataSource.value
})

const availableFields = ref([
  { label: '产品名称', value: 'product' },
  { label: '销售额', value: 'amount' },
  { label: '数量', value: 'quantity' },
  { label: '客户', value: 'customer' },
  { label: '日期', value: 'date' },
  { label: '状态', value: 'status' },
])

const filters = reactive([
  { field: 'status', operator: 'eq', value: 'active' },
])

const addFilter = () => {
  filters.push({ field: 'product', operator: 'eq', value: '' })
}

const removeFilter = (index: number) => {
  filters.splice(index, 1)
}

const handleSave = () => { ElMessage.success('报表已保存') }
const handleRun = () => { ElMessage.success('报表生成完成') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.filter-card h3 { margin: 0; }
.filter-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.filter-row .el-select, .filter-row .el-input { margin-bottom: 0; }
.preview-info { padding: 8px 0; }
.preview-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
.preview-item:last-child { border-bottom: none; }
.preview-label { color: #909399; }
.preview-value { font-weight: 500; }
:deep(.el-form-item) { margin-bottom: 0; }
:deep(.el-checkbox-group) { display: flex; flex-direction: column; gap: 8px; }
</style>