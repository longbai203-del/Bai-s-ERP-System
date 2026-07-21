<!-- 
  文件路径: frontend/src/modules/customers/pages/CustomerAfterSale.vue
  功能: 售后管理 - 管理客户售后服务
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="服务单号">
              <el-input v-model="searchForm.serviceNo" placeholder="请输入服务单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="服务类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="维修" value="repair" />
                <el-option label="保养" value="maintenance" />
                <el-option label="投诉" value="complaint" />
                <el-option label="回访" value="visit" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建服务单</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 服务统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in serviceStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="serviceNo" label="服务单号" width="140" />
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="type" label="服务类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'repair' ? 'danger' : row.type === 'maintenance' ? 'primary' : row.type === 'complaint' ? 'warning' : 'success'">
              {{ row.type === 'repair' ? '维修' : row.type === 'maintenance' ? '保养' : row.type === 'complaint' ? '投诉' : '回访' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="服务主题" min-width="150" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'processing' ? 'warning' : row.status === 'pending' ? 'info' : 'danger'">
              {{ row.status === 'pending' ? '待处理' : row.status === 'processing' ? '处理中' : row.status === 'completed' ? '已完成' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="satisfaction" label="满意度" align="center" width="120">
          <template #default="{ row }">
            <el-rate v-model="row.satisfaction" disabled show-score :texts="['极差', '差', '一般', '好', '极好']" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDetail(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleProcess(row)" v-if="row.status === 'pending'"><el-icon><Edit /></el-icon> 处理</el-button>
            <el-button type="success" size="small" @click="handleComplete(row)" v-if="row.status === 'processing'"><el-icon><Check /></el-icon> 完成</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:page-size="pagination.pageSize"
        v-model:current-page="pagination.currentPage"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </el-card>

    <!-- 处理服务单弹窗 -->
    <el-dialog v-model="processDialogVisible" title="处理服务单" width="600px">
      <el-form :model="processForm" label-width="100px">
        <el-form-item label="服务单号">{{ processForm.serviceNo }}</el-form-item>
        <el-form-item label="客户">{{ processForm.customer }}</el-form-item>
        <el-form-item label="处理方式" prop="processMethod">
          <el-select v-model="processForm.processMethod" placeholder="请选择处理方式" style="width: 100%">
            <el-option label="上门服务" value="上门" />
            <el-option label="远程支持" value="远程" />
            <el-option label="电话指导" value="电话" />
            <el-option label="返厂维修" value="返厂" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理结果" prop="result">
          <el-input v-model="processForm.result" type="textarea" :rows="3" placeholder="请输入处理结果" />
        </el-form-item>
        <el-form-item label="满意度评分" prop="satisfaction">
          <el-rate v-model="processForm.satisfaction" show-score :texts="['极差', '差', '一般', '好', '极好']" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveProcess" :loading="submitting">保存处理结果</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Plus, View, Edit, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ serviceNo: '', customer: '', type: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const serviceStats = ref([
  { label: '总服务单', value: '286', type: 'primary' },
  { label: '待处理', value: '28', type: 'warning' },
  { label: '已完成', value: '220', type: 'success' },
  { label: '满意度', value: '4.8/5', type: 'primary' },
])

const tableData = ref([
  { id: 1, serviceNo: 'SV-2024-001', customer: '沙特电信公司', type: 'repair', title: '设备故障维修', status: 'completed', satisfaction: 5, createdAt: '2024-11-15 10:30' },
  { id: 2, serviceNo: 'SV-2024-002', customer: '阿尔拉吉银行', type: 'maintenance', title: '年度设备保养', status: 'processing', satisfaction: 0, createdAt: '2024-11-18 14:20' },
  { id: 3, serviceNo: 'SV-2024-003', customer: '沙特阿美', type: 'complaint', title: '产品使用投诉', status: 'pending', satisfaction: 0, createdAt: '2024-11-20 09:00' },
  { id: 4, serviceNo: 'SV-2024-004', customer: '利雅得银行', type: 'visit', title: '客户回访', status: 'completed', satisfaction: 4, createdAt: '2024-11-16 16:30' },
])

const loading = ref(false)
const submitting = ref(false)
const processDialogVisible = ref(false)

const processForm = reactive({
  serviceNo: '',
  customer: '',
  processMethod: '上门',
  result: '',
  satisfaction: 5,
})

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.serviceNo = ''; searchForm.customer = ''; searchForm.type = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { ElMessage.info('新建服务单') }
const handleDetail = (row: any) => { ElMessage.info(`查看服务单: ${row.serviceNo}`) }

const handleProcess = (row: any) => {
  processForm.serviceNo = row.serviceNo
  processForm.customer = row.customer
  processForm.processMethod = '上门'
  processForm.result = ''
  processForm.satisfaction = 5
  processDialogVisible.value = true
}

const handleSaveProcess = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    processDialogVisible.value = false
    ElMessage.success(`服务单 ${processForm.serviceNo} 处理完成`)
  }, 800)
}

const handleComplete = (row: any) => {
  ElMessageBox.confirm(`确认完成服务单 ${row.serviceNo}？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'completed'; ElMessage.success('服务单已完成') }).catch(() => {})
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
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>