<!-- 
  文件路径: frontend/src/modules/hr/pages/Payroll.vue
  功能: 工资管理 - 管理员工薪资
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="月份">
              <el-date-picker v-model="searchForm.month" type="month" placeholder="选择月份" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCalculate" style="float: right"><el-icon><Monitor /></el-icon> 计算工资</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 薪资统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in payrollStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="employeeNo" label="工号" width="120" />
        <el-table-column prop="basicSalary" label="基本工资" align="right">
          <template #default="{ row }">{{ formatCurrency(row.basicSalary) }}</template>
        </el-table-column>
        <el-table-column prop="allowance" label="津贴" align="right">
          <template #default="{ row }">{{ formatCurrency(row.allowance) }}</template>
        </el-table-column>
        <el-table-column prop="overtimePay" label="加班费" align="right">
          <template #default="{ row }">{{ formatCurrency(row.overtimePay) }}</template>
        </el-table-column>
        <el-table-column prop="deduction" label="扣款" align="right">
          <template #default="{ row }"><span style="color: #F56C6C;">{{ formatCurrency(row.deduction) }}</span></template>
        </el-table-column>
        <el-table-column prop="netSalary" label="实发工资" align="right">
          <template #default="{ row }"><span style="font-weight: 700; color: #409EFF;">{{ formatCurrency(row.netSalary) }}</span></template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'paid' ? 'success' : 'warning'">
              {{ row.status === 'paid' ? '已发放' : '待发放' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handlePay(row)" v-if="row.status === 'pending'"><el-icon><Money /></el-icon> 发放</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Monitor, View, Money } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '', month: new Date() })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const payrollStats = ref([
  { label: '薪资总额', value: 'SAR 1,856,000', type: 'primary' },
  { label: '实发总额', value: 'SAR 1,560,000', type: 'success' },
  { label: '扣款总额', value: 'SAR 296,000', type: 'danger' },
  { label: '平均薪资', value: 'SAR 12,850', type: 'warning' },
])

const tableData = ref([
  { id: 1, name: 'Ahmed Al-Fahd', employeeNo: 'EMP-001', basicSalary: 25000, allowance: 3000, overtimePay: 1500, deduction: 2000, netSalary: 27500, status: 'paid' },
  { id: 2, name: 'Mohammed Al-Qahtani', employeeNo: 'EMP-002', basicSalary: 18000, allowance: 2000, overtimePay: 1000, deduction: 1500, netSalary: 19500, status: 'pending' },
  { id: 3, name: 'Saud Al-Otaibi', employeeNo: 'EMP-003', basicSalary: 15000, allowance: 1500, overtimePay: 500, deduction: 1000, netSalary: 16000, status: 'pending' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCalculate = () => { ElMessage.success('工资计算完成') }
const handleView = (row: any) => { ElMessage.info(`查看 ${row.name} 薪资详情`) }
const handlePay = (row: any) => {
  ElMessageBox.confirm(`确认发放 ${row.name} 的工资？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'paid'; ElMessage.success('工资已发放') }).catch(() => {})
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
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>