<!-- 
  文件路径: frontend/src/modules/orders/pages/CustomerCredit.vue
  功能: 客户信用管理 - 管理客户信用额度
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="信用等级">
              <el-select v-model="searchForm.creditLevel" placeholder="请选择等级" clearable style="width: 100%">
                <el-option label="A级" value="A" />
                <el-option label="B级" value="B" />
                <el-option label="C级" value="C" />
                <el-option label="D级" value="D" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="正常" value="normal" />
                <el-option label="预警" value="warning" />
                <el-option label="冻结" value="frozen" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="creditLevel" label="信用等级" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="row.creditLevel === 'A' ? 'success' : row.creditLevel === 'B' ? 'primary' : row.creditLevel === 'C' ? 'warning' : 'danger'">
              {{ row.creditLevel }}级
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creditLimit" label="信用额度" align="right">
          <template #default="{ row }">{{ formatCurrency(row.creditLimit) }}</template>
        </el-table-column>
        <el-table-column prop="usedAmount" label="已用额度" align="right">
          <template #default="{ row }">{{ formatCurrency(row.usedAmount) }}</template>
        </el-table-column>
        <el-table-column prop="availableAmount" label="可用额度" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: row.availableAmount > 0 ? '#67C23A' : '#F56C6C';">
              {{ formatCurrency(row.availableAmount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="使用率" align="center" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.usageRate" :color="row.usageRate < 70 ? '#67C23A' : row.usageRate < 90 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : row.status === 'warning' ? 'warning' : 'danger'">
              {{ row.status === 'normal' ? '正常' : row.status === 'warning' ? '预警' : '冻结' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon> 调整</el-button>
            <el-button type="warning" size="small" @click="handleHistory(row)"><el-icon><Document /></el-icon> 记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>

    <!-- 调整信用额度弹窗 -->
    <el-dialog v-model="dialogVisible" title="调整信用额度" width="500px">
      <el-form :model="creditForm" label-width="120px">
        <el-form-item label="客户名称">{{ creditForm.customer }}</el-form-item>
        <el-form-item label="当前额度">{{ formatCurrency(creditForm.currentLimit) }}</el-form-item>
        <el-form-item label="新额度" prop="newLimit">
          <el-input-number v-model="creditForm.newLimit" :min="0" :precision="2" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="调整原因" prop="reason">
          <el-input v-model="creditForm.reason" type="textarea" :rows="3" placeholder="请输入调整原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveCredit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Edit, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ customer: '', creditLevel: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { customer: '沙特电信公司', creditLevel: 'A', creditLimit: 5000000, usedAmount: 1250000, availableAmount: 3750000, usageRate: 25, status: 'normal' },
  { customer: '阿尔拉吉银行', creditLevel: 'A', creditLimit: 4000000, usedAmount: 980000, availableAmount: 3020000, usageRate: 24.5, status: 'normal' },
  { customer: '沙特阿美', creditLevel: 'B', creditLimit: 3000000, usedAmount: 1756000, availableAmount: 1244000, usageRate: 58.5, status: 'normal' },
  { customer: '利雅得银行', creditLevel: 'B', creditLimit: 2500000, usedAmount: 1987000, availableAmount: 513000, usageRate: 79.5, status: 'warning' },
  { customer: '沙特航空', creditLevel: 'C', creditLimit: 1500000, usedAmount: 1450000, availableAmount: 50000, usageRate: 96.7, status: 'warning' },
])

const loading = ref(false)
const dialogVisible = ref(false)
const creditForm = reactive({ customer: '', currentLimit: 0, newLimit: 0, reason: '' })

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.customer = ''; searchForm.creditLevel = ''; searchForm.status = '' }
const handleEdit = (row: any) => {
  creditForm.customer = row.customer
  creditForm.currentLimit = row.creditLimit
  creditForm.newLimit = row.creditLimit
  creditForm.reason = ''
  dialogVisible.value = true
}
const handleHistory = (row: any) => { ElMessage.info(`查看 ${row.customer} 信用记录`) }
const handleSaveCredit = () => {
  ElMessage.success('信用额度已调整')
  dialogVisible.value = false
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>