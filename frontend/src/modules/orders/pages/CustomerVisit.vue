<!-- 
  文件路径: frontend/src/modules/orders/pages/CustomerVisit.vue
  功能: 客户拜访 - 管理客户拜访记录
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
            <el-form-item label="拜访人">
              <el-select v-model="searchForm.salesperson" placeholder="请选择拜访人" clearable style="width: 100%">
                <el-option label="Ahmed Al-Fahd" value="ahmed" />
                <el-option label="Mohammed Al-Qahtani" value="mohammed" />
                <el-option label="Saud Al-Otaibi" value="saud" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期范围">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增拜访</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="salesperson" label="拜访人" />
        <el-table-column prop="visitDate" label="拜访日期" width="120" />
        <el-table-column prop="purpose" label="拜访目的" width="150" />
        <el-table-column prop="summary" label="拜访摘要" min-width="200" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'scheduled' ? 'warning' : 'info'">
              {{ row.status === 'completed' ? '已完成' : row.status === 'scheduled' ? '已安排' : '待跟进' }}
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

    <!-- 新增拜访弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增拜访记录" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="客户名称" prop="customer">
          <el-select v-model="form.customer" placeholder="请选择客户" style="width: 100%" filterable>
            <el-option label="沙特电信公司" value="沙特电信公司" />
            <el-option label="阿尔拉吉银行" value="阿尔拉吉银行" />
            <el-option label="沙特阿美" value="沙特阿美" />
          </el-select>
        </el-form-item>
        <el-form-item label="拜访人" prop="salesperson">
          <el-select v-model="form.salesperson" placeholder="请选择拜访人" style="width: 100%">
            <el-option label="Ahmed Al-Fahd" value="Ahmed Al-Fahd" />
            <el-option label="Mohammed Al-Qahtani" value="Mohammed Al-Qahtani" />
          </el-select>
        </el-form-item>
        <el-form-item label="拜访日期" prop="visitDate">
          <el-date-picker v-model="form.visitDate" type="datetime" placeholder="选择拜访时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="拜访目的" prop="purpose">
          <el-input v-model="form.purpose" placeholder="请输入拜访目的" />
        </el-form-item>
        <el-form-item label="拜访摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" :rows="4" placeholder="请输入拜访摘要" />
        </el-form-item>
        <el-form-item label="下一步计划" prop="nextPlan">
          <el-input v-model="form.nextPlan" type="textarea" :rows="3" placeholder="请输入下一步计划" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ customer: '', salesperson: '', dateRange: [] as [Date, Date] | [] })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, customer: '沙特电信公司', salesperson: 'Ahmed Al-Fahd', visitDate: '2024-11-20 10:00', purpose: '产品演示', summary: '演示了新产品功能，客户表示感兴趣', status: 'completed', nextPlan: '发送报价单' },
  { id: 2, customer: '阿尔拉吉银行', salesperson: 'Mohammed Al-Qahtani', visitDate: '2024-11-18 14:30', purpose: '合同洽谈', summary: '讨论了年度合同条款，基本达成一致', status: 'scheduled', nextPlan: '准备合同草案' },
  { id: 3, customer: '沙特阿美', salesperson: 'Saud Al-Otaibi', visitDate: '2024-11-15 09:00', purpose: '售后回访', summary: '了解产品使用情况，客户反馈良好', status: 'completed', nextPlan: '安排维护培训' },
])

const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref()

const form = reactive({
  customer: '',
  salesperson: '',
  visitDate: '',
  purpose: '',
  summary: '',
  nextPlan: '',
})

const rules = {
  customer: [{ required: true, message: '请选择客户', trigger: 'change' }],
  salesperson: [{ required: true, message: '请选择拜访人', trigger: 'change' }],
  visitDate: [{ required: true, message: '请选择拜访日期', trigger: 'change' }],
  purpose: [{ required: true, message: '请输入拜访目的', trigger: 'blur' }],
}

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.customer = ''; searchForm.salesperson = ''; searchForm.dateRange = [] }
const handleCreate = () => { dialogVisible.value = true; form.customer = ''; form.salesperson = ''; form.visitDate = ''; form.purpose = ''; form.summary = ''; form.nextPlan = '' }
const handleView = (row: any) => { ElMessage.info(`查看拜访: ${row.customer}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑拜访: ${row.customer}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.customer} 的拜访记录吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
const handleSubmit = async () => {
  await formRef.value?.validate()
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    dialogVisible.value = false
    ElMessage.success('拜访记录已保存')
  }, 1000)
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>