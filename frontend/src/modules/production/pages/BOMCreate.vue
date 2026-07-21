<!-- 
  文件路径: frontend/src/modules/production/pages/BOMCreate.vue
  功能: 新建BOM
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建物料清单 (BOM)</h2>
          <p class="subtitle">创建产品物料清单</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交审核</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header><span>基本信息</span></template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="BOM编号" prop="bomNo">
              <el-input v-model="form.bomNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称" prop="product">
              <el-select v-model="form.product" placeholder="请选择产品" style="width: 100%" filterable>
                <el-option label="iPhone 15 Pro Max" value="iPhone 15 Pro Max" />
                <el-option label="三星 Galaxy S24 Ultra" value="三星 Galaxy S24 Ultra" />
                <el-option label="MacBook Pro 16\"" value="MacBook Pro 16\"" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本" prop="version">
              <el-input v-model="form.version" placeholder="请输入版本号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入BOM描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>物料明细</span>
          <el-button type="primary" text @click="addItem"><el-icon><Plus /></el-icon> 添加物料</el-button>
        </div>
      </template>
      <el-table :data="form.items" border style="width: 100%">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="物料名称" min-width="180">
          <template #default="{ row }">
            <el-input v-model="row.materialName" placeholder="请输入物料名称" />
          </template>
        </el-table-column>
        <el-table-column label="物料编号" width="140">
          <template #default="{ row }">
            <el-input v-model="row.materialNo" placeholder="物料编号" />
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120">
          <template #default="{ row }">
            <el-input-number v-model="row.quantity" :min="0.01" :precision="2" controls-position="right" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column label="单位" width="100">
          <template #default="{ row }">
            <el-select v-model="row.unit" placeholder="单位" style="width: 100%">
              <el-option label="个" value="个" />
              <el-option label="片" value="片" />
              <el-option label="米" value="米" />
              <el-option label="千克" value="kg" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="150">
          <template #default="{ row }">
            <el-input-number v-model="row.price" :min="0" :precision="2" controls-position="right" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column label="小计" align="right" width="150">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #409EFF;">{{ formatCurrency(row.quantity * row.price) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="{ $index }">
            <el-button type="danger" size="small" @click="removeItem($index)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right; margin-top: 16px; font-size: 16px;">
        BOM总成本: <span style="font-weight: 700; color: #409EFF; font-size: 20px;">{{ formatCurrency(totalCost) }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()

const form = reactive({
  bomNo: 'BOM-2024-004',
  product: '',
  version: 'V1.0',
  description: '',
  items: [] as Array<{
    materialName: string
    materialNo: string
    quantity: number
    unit: string
    price: number
  }>,
})

const rules = {
  product: [{ required: true, message: '请选择产品', trigger: 'change' }],
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
}

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const totalCost = computed(() => {
  return form.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
})

const addItem = () => {
  form.items.push({ materialName: '', materialNo: '', quantity: 1, unit: '个', price: 0 })
}

const removeItem = (index: number) => {
  form.items.splice(index, 1)
}

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('BOM已提交审核')
  router.push('/production/bom')
}
const handleCancel = () => { router.push('/production/bom') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>