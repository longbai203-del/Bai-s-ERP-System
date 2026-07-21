<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseRequestCreate.vue
  功能: 新建采购申请
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建采购申请</h2>
          <p class="subtitle">填写采购需求，发起采购审批流程</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交审批</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>申请信息</span></template>
          <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="申请编号" prop="requestNo">
                  <el-input v-model="form.requestNo" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门" prop="department">
                  <el-select v-model="form.department" placeholder="请选择部门" style="width: 100%">
                    <el-option label="销售部" value="销售部" />
                    <el-option label="采购部" value="采购部" />
                    <el-option label="运营部" value="运营部" />
                    <el-option label="财务部" value="财务部" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申请人" prop="applicant">
                  <el-input v-model="form.applicant" placeholder="请输入申请人" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申请日期" prop="requestDate">
                  <el-date-picker v-model="form.requestDate" type="date" placeholder="选择申请日期" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="申请理由" prop="reason">
                  <el-input v-model="form.reason" type="textarea" :rows="3" placeholder="请详细说明申请理由" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header><span>申请摘要</span></template>
          <div class="summary-item">
            <span class="summary-label">申请部门</span>
            <span class="summary-value">{{ form.department || '-' }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">申请人</span>
            <span class="summary-value">{{ form.applicant || '-' }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">产品数量</span>
            <span class="summary-value">{{ form.items.length }} 项</span>
          </div>
          <div class="summary-item total">
            <span class="summary-label">预估金额</span>
            <span class="summary-value total-amount">{{ formatCurrency(total) }}</span>
          </div>
          <el-button type="primary" style="width: 100%; margin-top: 16px;" @click="handleSubmit">提交审批</el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- 产品明细 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>申请产品明细</span>
          <el-button type="primary" text @click="addItem"><el-icon><Plus /></el-icon> 添加产品</el-button>
        </div>
      </template>
      <el-table :data="form.items" border style="width: 100%">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="产品名称" min-width="200">
          <template #default="{ row }">
            <el-input v-model="row.product" placeholder="请输入产品名称" />
          </template>
        </el-table-column>
        <el-table-column label="规格型号" width="150">
          <template #default="{ row }">
            <el-input v-model="row.spec" placeholder="规格" />
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120">
          <template #default="{ row }">
            <el-input-number v-model="row.quantity" :min="1" controls-position="right" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column label="预估单价" width="150">
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
  requestNo: 'PR-2024-005',
  department: '',
  applicant: '',
  requestDate: '',
  reason: '',
  items: [] as Array<{ product: string; spec: string; quantity: number; price: number }>,
})

const rules = {
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  applicant: [{ required: true, message: '请输入申请人', trigger: 'blur' }],
  requestDate: [{ required: true, message: '请选择申请日期', trigger: 'change' }],
}

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const total = computed(() => form.items.reduce((sum, item) => sum + item.quantity * item.price, 0))

const addItem = () => { form.items.push({ product: '', spec: '', quantity: 1, price: 0 }) }
const removeItem = (index: number) => { form.items.splice(index, 1) }

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('采购申请已提交审批')
  router.push('/purchase/request')
}
const handleCancel = () => { router.push('/purchase/request') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.summary-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.summary-item:last-child { border-bottom: none; }
.summary-label { color: #909399; }
.summary-value { font-weight: 600; }
.total { padding: 12px 0; }
.total-amount { font-size: 24px; color: #409EFF; }
</style>