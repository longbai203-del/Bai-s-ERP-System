<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseContractCreate.vue
  功能: 新建采购合同
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建采购合同</h2>
          <p class="subtitle">创建正式的采购合同</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交合同</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header><span>合同基本信息</span></template>
          <el-form :model="form" :rules="rules" ref="formRef" label-width="130px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="合同编号" prop="contractNo">
                  <el-input v-model="form.contractNo" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商" prop="supplier">
                  <el-select v-model="form.supplier" placeholder="请选择供应商" style="width: 100%" filterable>
                    <el-option label="Apple Supplier" value="Apple Supplier" />
                    <el-option label="Samsung Supplier" value="Samsung Supplier" />
                    <el-option label="Dell Supplier" value="Dell Supplier" />
                    <el-option label="Sony Supplier" value="Sony Supplier" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同类型" prop="type">
                  <el-select v-model="form.type" placeholder="请选择合同类型" style="width: 100%">
                    <el-option label="框架协议" value="framework" />
                    <el-option label="年度合同" value="annual" />
                    <el-option label="项目合同" value="project" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="签署日期" prop="signDate">
                  <el-date-picker v-model="form.signDate" type="date" placeholder="选择签署日期" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生效日期" prop="effectiveDate">
                  <el-date-picker v-model="form.effectiveDate" type="date" placeholder="选择生效日期" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="到期日期" prop="expiryDate">
                  <el-date-picker v-model="form.expiryDate" type="date" placeholder="选择到期日期" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="付款条款" prop="paymentTerms">
                  <el-input v-model="form.paymentTerms" type="textarea" :rows="3" placeholder="请输入付款条款" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
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
          <span>合同产品明细</span>
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
        合同总金额: <span style="font-weight: 700; color: #409EFF; font-size: 20px;">{{ formatCurrency(total) }}</span>
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
  contractNo: 'PC-2024-005',
  supplier: '',
  type: 'framework',
  signDate: '',
  effectiveDate: '',
  expiryDate: '',
  paymentTerms: '',
  remark: '',
  items: [] as Array<{ product: string; spec: string; quantity: number; price: number }>,
})

const rules = {
  supplier: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  signDate: [{ required: true, message: '请选择签署日期', trigger: 'change' }],
  effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
  expiryDate: [{ required: true, message: '请选择到期日期', trigger: 'change' }],
}

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const total = computed(() => form.items.reduce((sum, item) => sum + item.quantity * item.price, 0))

const addItem = () => { form.items.push({ product: '', spec: '', quantity: 1, price: 0 }) }
const removeItem = (index: number) => { form.items.splice(index, 1) }

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('采购合同提交成功')
  router.push('/purchase/contracts')
}
const handleCancel = () => { router.push('/purchase/contracts') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>