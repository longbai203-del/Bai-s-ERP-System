<!-- 
  文件路径: frontend/src/modules/finance/pages/BankManagement.vue
  功能: 银行管理 - 管理银行账户及交易
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="银行名称">
              <el-input v-model="searchForm.bankName" placeholder="请输入银行名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账户类型">
              <el-select v-model="searchForm.accountType" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="活期" value="current" />
                <el-option label="定期" value="fixed" />
                <el-option label="信用卡" value="credit" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 添加账户</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="bankName" label="银行名称" />
        <el-table-column prop="accountNo" label="账号" />
        <el-table-column prop="accountType" label="账户类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.accountType === 'current' ? 'success' : row.accountType === 'fixed' ? 'warning' : 'info'">
              {{ row.accountType === 'current' ? '活期' : row.accountType === 'fixed' ? '定期' : '信用卡' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currency" label="币种" width="80" />
        <el-table-column prop="balance" label="余额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.balance) }}</template>
        </el-table-column>
        <el-table-column prop="availableBalance" label="可用余额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.availableBalance) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '冻结' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ bankName: '', accountType: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, bankName: '沙特国家银行', accountNo: 'SA0012345678', accountType: 'current', currency: 'SAR', balance: 3860000, availableBalance: 3860000, status: 'active' },
  { id: 2, bankName: '阿尔拉吉银行', accountNo: 'SA0087654321', accountType: 'current', currency: 'SAR', balance: 1200000, availableBalance: 1200000, status: 'active' },
  { id: 3, bankName: '利雅得银行', accountNo: 'SA0045678901', accountType: 'fixed', currency: 'SAR', balance: 5000000, availableBalance: 5000000, status: 'active' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.bankName = ''; searchForm.accountType = '' }
const handleCreate = () => { ElMessage.info('添加银行账户') }
const handleView = (row: any) => { ElMessage.info(`查看账户: ${row.bankName}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑账户: ${row.bankName}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除账户 ${row.bankName} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>