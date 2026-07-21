<!-- 
  文件路径: frontend/src/modules/inventory/pages/StockTransferCreate.vue
  功能: 新建调拨单
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建库存调拨</h2>
          <p class="subtitle">仓库间库存转移</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交调拨</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header><span>调拨信息</span></template>
          <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="调拨单号" prop="transferNo">
                  <el-input v-model="form.transferNo" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="源仓库" prop="fromWarehouse">
                  <el-select v-model="form.fromWarehouse" placeholder="请选择源仓库" style="width: 100%">
                    <el-option label="利雅得仓库" value="利雅得仓库" />
                    <el-option label="吉达仓库" value="吉达仓库" />
                    <el-option label="达曼仓库" value="达曼仓库" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="目标仓库" prop="toWarehouse">
                  <el-select v-model="form.toWarehouse" placeholder="请选择目标仓库" style="width: 100%">
                    <el-option label="利雅得仓库" value="利雅得仓库" />
                    <el-option label="吉达仓库" value="吉达仓库" />
                    <el-option label="达曼仓库" value="达曼仓库" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="调拨原因" prop="reason">
                  <el-input v-model="form.reason" type="textarea" :rows="2" placeholder="请输入调拨原因" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>调拨产品明细</span>
          <el-button type="primary" text @click="addItem"><el-icon><Plus /></el-icon> 添加产品</el-button>
        </div>
      </template>
      <el-table :data="form.items" border style="width: 100%">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="产品名称" min-width="180">
          <template #default="{ row }">
            <el-select v-model="row.product" placeholder="选择产品" filterable style="width: 100%">
              <el-option label="iPhone 15 Pro Max" value="iPhone 15 Pro Max" />
              <el-option label="三星 Galaxy S24 Ultra" value="三星 Galaxy S24 Ultra" />
              <el-option label="MacBook Pro 16\"" value="MacBook Pro 16\"" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="SKU" width="120">
          <template #default="{ row }">
            <el-input v-model="row.sku" placeholder="SKU" />
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120">
          <template #default="{ row }">
            <el-input-number v-model="row.quantity" :min="1" controls-position="right" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="{ $index }">
            <el-button type="danger" size="small" @click="removeItem($index)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()

const form = reactive({
  transferNo: 'ST-2024-004',
  fromWarehouse: '',
  toWarehouse: '',
  reason: '',
  items: [] as Array<{ product: string; sku: string; quantity: number }>,
})

const rules = {
  fromWarehouse: [{ required: true, message: '请选择源仓库', trigger: 'change' }],
  toWarehouse: [{ required: true, message: '请选择目标仓库', trigger: 'change' }],
}

const addItem = () => { form.items.push({ product: '', sku: '', quantity: 1 }) }
const removeItem = (index: number) => { form.items.splice(index, 1) }

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('调拨单已提交')
  router.push('/inventory/transfer')
}
const handleCancel = () => { router.push('/inventory/transfer') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>