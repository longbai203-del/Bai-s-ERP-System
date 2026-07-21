<!-- 
  文件路径: frontend/src/modules/orders/pages/QuotationCreate.vue
  功能: 新建销售报价 - 创建新报价单
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建销售报价</h2>
          <p class="subtitle">填写报价信息，生成专业报价单</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交报价</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>基本信息</span>
          </template>
          <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="客户名称" prop="customer">
                  <el-select v-model="form.customer" placeholder="请选择客户" style="width: 100%" filterable>
                    <el-option label="沙特电信公司" value="沙特电信公司" />
                    <el-option label="阿尔拉吉银行" value="阿尔拉吉银行" />
                    <el-option label="沙特阿美" value="沙特阿美" />
                    <el-option label="利雅得银行" value="利雅得银行" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人" prop="contact">
                  <el-input v-model="form.contact" placeholder="请输入联系人" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入联系电话" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="有效期至" prop="validUntil">
                  <el-date-picker v-model="form.validUntil" type="date" placeholder="选择有效期" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="报价编号" prop="quotationNo">
                  <el-input v-model="form.quotationNo" disabled placeholder="系统自动生成" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span>报价摘要</span>
          </template>
          <div class="summary-item">
            <span class="summary-label">产品数量</span>
            <span class="summary-value">{{ form.items.length }} 项</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">小计</span>
            <span class="summary-value">{{ formatCurrency(subtotal) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">折扣</span>
            <el-input-number v-model="form.discount" :min="0" :max="100" controls-position="right" style="width: 120px" />
            <span style="margin-left: 8px;">%</span>
          </div>
          <div class="summary-item total">
            <span class="summary-label">合计</span>
            <span class="summary-value total-amount">{{ formatCurrency(total) }}</span>
          </div>
          <el-button type="primary" style="width: 100%; margin-top: 16px;" @click="handleSubmit">
            提交报价
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- 产品明细 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>产品明细</span>
          <el-button type="primary" text @click="addItem">
            <el-icon><Plus /></el-icon> 添加产品
          </el-button>
        </div>
      </template>
      <el-table :data="form.items" border style="width: 100%">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="产品名称" min-width="200">
          <template #default="{ row, $index }">
            <el-select v-model="row.product" placeholder="选择产品" filterable style="width: 100%">
              <el-option label="iPhone 15 Pro Max" value="iPhone 15 Pro Max" />
              <el-option label="三星 Galaxy S24 Ultra" value="三星 Galaxy S24 Ultra" />
              <el-option label="MacBook Pro 16\"" value="MacBook Pro 16\"" />
              <el-option label="iPad Pro 12.9\"" value="iPad Pro 12.9\"" />
              <el-option label="AirPods Pro 2" value="AirPods Pro 2" />
              <el-option label="Apple Watch Ultra 2" value="Apple Watch Ultra 2" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="规格" width="120">
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
            <el-button type="danger" size="small" @click="removeItem($index)">
              <el-icon><Delete /></el-icon>
            </el-button>
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
  quotationNo: 'QT-2024-006',
  customer: '',
  contact: '',
  phone: '',
  email: '',
  validUntil: '',
  remark: '',
  discount: 0,
  items: [] as Array<{ product: string; spec: string; quantity: number; price: number }>,
})

const rules = {
  customer: [{ required: true, message: '请选择客户', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  validUntil: [{ required: true, message: '请选择有效期', trigger: 'change' }],
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
}

const subtotal = computed(() => {
  return form.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
})

const total = computed(() => {
  return subtotal.value * (1 - form.discount / 100)
})

const addItem = () => {
  form.items.push({ product: '', spec: '', quantity: 1, price: 0 })
}

const removeItem = (index: number) => {
  form.items.splice(index, 1)
}

const handleSaveDraft = () => {
  ElMessage.success('已保存草稿')
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('报价提交成功')
  router.push('/orders/quotations')
}

const handleCancel = () => {
  router.push('/orders/quotations')
}
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