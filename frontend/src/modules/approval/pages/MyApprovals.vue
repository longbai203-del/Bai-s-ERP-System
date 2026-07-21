<!-- 
  文件路径: frontend/src/modules/approval/pages/MyApprovals.vue
  功能: 我的审批 - 我参与的审批列表
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="审批事项">
              <el-input v-model="searchForm.title" placeholder="请输入审批事项" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待审批" value="pending" />
                <el-option label="已通过" value="approved" />
                <el-option label="已驳回" value="rejected" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="采购审批" value="purchase" />
                <el-option label="付款审批" value="payment" />
                <el-option label="费用审批" value="expense" />
                <el-option label="合同审批" value="contract" />
                <el-option label="请假审批" value="leave" />
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
        <el-table-column prop="title" label="审批事项" min-width="180" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'purchase' ? 'primary' : row.type === 'payment' ? 'warning' : row.type === 'expense' ? 'info' : row.type === 'contract' ? 'success' : ''">
              {{ row.type === 'purchase' ? '采购' : row.type === 'payment' ? '付款' : row.type === 'expense' ? '费用' : row.type === 'contract' ? '合同' : '请假' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="amount" label="金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'pending' ? '待审批' : row.status === 'approved' ? '已通过' : '已驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submittedAt" label="提交时间" width="160" />
        <el-table-column label="操作" align="center" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDetail(row)"><el-icon><View /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ title: '', status: '', type: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, title: '采购申请 PR-2024-001', type: 'purchase', applicant: 'Ahmed Al-Fahd', amount: 285600, status: 'pending', submittedAt: '2024-11-20 10:30' },
  { id: 2, title: '付款申请 PY-2024-002', type: 'payment', applicant: 'Mohammed Al-Qahtani', amount: 198700, status: 'approved', submittedAt: '2024-11-19 14:20' },
  { id: 3, title: '年假申请 5天', type: 'leave', applicant: 'Saud Al-Otaibi', amount: 0, status: 'rejected', submittedAt: '2024-11-18 09:00' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.title = ''; searchForm.status = ''; searchForm.type = '' }
const handleDetail = (row: any) => { ElMessage.info(`查看审批: ${row.title}`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>