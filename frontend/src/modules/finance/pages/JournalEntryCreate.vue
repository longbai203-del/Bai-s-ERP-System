<!-- 
  文件路径: frontend/src/modules/finance/pages/JournalEntryCreate.vue
  功能: 新建凭证
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建会计凭证</h2>
          <p class="subtitle">录入会计分录</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交审核</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header><span>凭证信息</span></template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="凭证号" prop="voucherNo">
              <el-input v-model="form.voucherNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日期" prop="date">
              <el-date-picker v-model="form.date" type="date" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="凭证类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                <el-option label="收款凭证" value="receipt" />
                <el-option label="付款凭证" value="payment" />
                <el-option label="转账凭证" value="transfer" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="摘要" prop="summary">
              <el-input v-model="form.summary" placeholder="请输入凭证摘要" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>会计分录</span>
          <el-button type="primary" text @click="addRow"><el-icon><Plus /></el-icon> 添加分录</el-button>
        </div>
      </template>
      <el-table :data="form.entries" border style="width: 100%">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="科目代码" width="140">
          <template #default="{ row }">
            <el-select v-model="row.accountCode" placeholder="选择科目" filterable style="width: 100%">
              <el-option label="1001 库存现金" value="1001" />
              <el-option label="1002 银行存款" value="1002" />
              <el-option label="1122 应收账款" value="1122" />
              <el-option label="1405 库存商品" value="1405" />
              <el-option label="2001 应付账款" value="2001" />
              <el-option label="6001 主营业务收入" value="6001" />
              <el-option label="6401 主营业务成本" value="6401" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="科目名称" width="140">
          <template #default="{ row }">
            <el-input v-model="row.accountName" placeholder="科目名称" disabled />
          </template>
        </el-table-column>
        <el-table-column label="借方金额" width="180">
          <template #default="{ row }">
            <el-input-number v-model="row.debit" :min="0" :precision="2" controls-position="right" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column label="贷方金额" width="180">
          <template #default="{ row }">
            <el-input-number v-model="row.credit" :min="0" :precision="2" controls-position="right" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column label="摘要" min-width="150">
          <template #default="{ row }">
            <el-input v-model="row.summary" placeholder="分录摘要" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="{ $index }">
            <el-button type="danger" size="small" @click="removeRow($index)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right; margin-top: 16px; font-size: 16px;">
        合计借方: <span style="font-weight: 600; color: #409EFF;">{{ formatCurrency(totalDebit) }}</span>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        合计贷方: <span style="font-weight: 600; color: #E6A23C;">{{ formatCurrency(totalCredit) }}</span>
        &nbsp;&nbsp;
        <el-tag :type="isBalanced ? 'success' : 'danger'" size="large">
          {{ isBalanced ? '✓ 借贷平衡' : '✗ 借贷不平衡' }}
        </el-tag>
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
  voucherNo: 'VOU-2024-004',
  date: new Date(),
  type: 'transfer',
  summary: '',
  entries: [] as Array<{
    accountCode: string
    accountName: string
    debit: number
    credit: number
    summary: string
  }>,
})

const rules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  summary: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
}

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const totalDebit = computed(() => form.entries.reduce((sum, e) => sum + (e.debit || 0), 0))
const totalCredit = computed(() => form.entries.reduce((sum, e) => sum + (e.credit || 0), 0))
const isBalanced = computed(() => Math.abs(totalDebit.value - totalCredit.value) < 0.01)

const addRow = () => {
  form.entries.push({ accountCode: '', accountName: '', debit: 0, credit: 0, summary: '' })
}

const removeRow = (index: number) => {
  form.entries.splice(index, 1)
}

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  if (!isBalanced.value) {
    ElMessage.error('借贷不平衡，请检查分录')
    return
  }
  ElMessage.success('凭证已提交审核')
  router.push('/finance/journal')
}
const handleCancel = () => { router.push('/finance/journal') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>