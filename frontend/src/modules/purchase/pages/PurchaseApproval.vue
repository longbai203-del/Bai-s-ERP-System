<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseApproval.vue
  功能: 采购审批 - 待审批的采购申请列表
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="申请编号">
              <el-input v-model="searchForm.requestNo" placeholder="请输入申请编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请人">
              <el-input v-model="searchForm.applicant" placeholder="请输入申请人" clearable />
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

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in statistics" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="requestNo" label="申请编号" width="140" />
        <el-table-column prop="applicant" label="申请人" />
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="totalAmount" label="申请金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.totalAmount) }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请日期" width="160" />
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleApprove(row)"><el-icon><Check /></el-icon> 批准</el-button>
            <el-button type="danger" size="small" @click="handleReject(row)"><el-icon><Close /></el-icon> 驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>

    <!-- 审批弹窗 -->
    <el-dialog v-model="dialogVisible" title="审批采购申请" width="500px">
      <el-form :model="approvalForm" label-width="100px">
        <el-form-item label="申请编号">{{ approvalForm.requestNo }}</el-form-item>
        <el-form-item label="申请金额">{{ formatCurrency(approvalForm.amount) }}</el-form-item>
        <el-form-item label="审批意见" prop="comment">
          <el-input v-model="approvalForm.comment" type="textarea" :rows="3" placeholder="请输入审批意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="danger" @click="handleRejectConfirm">驳回</el-button>
        <el-button type="success" @click="handleApproveConfirm">批准</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, View, Check, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ requestNo: '', applicant: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, requestNo: 'PR-2024-001', applicant: 'Ahmed Al-Fahd', department: '销售部', totalAmount: 285600, createdAt: '2024-11-20 10:30' },
  { id: 2, requestNo: 'PR-2024-005', applicant: 'Khalid Al-Ghamdi', department: '运营部', totalAmount: 156800, createdAt: '2024-11-19 14:20' },
  { id: 3, requestNo: 'PR-2024-006', applicant: 'Abdullah Al-Shammari', department: '采购部', totalAmount: 98500, createdAt: '2024-11-18 09:00' },
])

const statistics = ref([
  { label: '待审批总数', value: '12', type: 'primary' },
  { label: '待审批金额', value: 'SAR 2,856,000', type: 'warning' },
  { label: '紧急审批', value: '3', type: 'danger' },
  { label: '平均审批时长', value: '2.5天', type: 'success' },
])

const loading = ref(false)
const dialogVisible = ref(false)
const approvalForm = reactive({ requestNo: '', amount: 0, comment: '' })

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.requestNo = ''; searchForm.applicant = '' }
const handleView = (row: any) => { ElMessage.info(`查看申请: ${row.requestNo}`) }
const handleApprove = (row: any) => {
  approvalForm.requestNo = row.requestNo
  approvalForm.amount = row.totalAmount
  approvalForm.comment = ''
  dialogVisible.value = true
}
const handleReject = (row: any) => {
  approvalForm.requestNo = row.requestNo
  approvalForm.amount = row.totalAmount
  approvalForm.comment = ''
  dialogVisible.value = true
}
const handleApproveConfirm = () => {
  ElMessage.success(`申请 ${approvalForm.requestNo} 已批准`)
  dialogVisible.value = false
}
const handleRejectConfirm = () => {
  ElMessage.warning(`申请 ${approvalForm.requestNo} 已驳回`)
  dialogVisible.value = false
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>