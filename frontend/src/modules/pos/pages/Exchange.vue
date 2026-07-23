<template>
  <div class="exchange-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1>
          <el-icon :size="28" color="#F59E0B"><RefreshLeft /></el-icon>
          兑换管理
        </h1>
        <span class="subtitle">会员积分兑换与商品兑换管理</span>
      </div>
      <div class="header-actions">
        <el-button type="success" @click="handleCreate">
          <el-icon><Plus /></el-icon> 新建兑换
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon> 导出
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><RefreshRight /></el-icon> 刷新
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon total">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">总兑换数</div>
              <div class="stat-value">{{ stats.total }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('pending')">
          <div class="stat-content">
            <div class="stat-icon pending">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">待处理</div>
              <div class="stat-value">{{ stats.pending }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('completed')">
          <div class="stat-content">
            <div class="stat-icon completed">
              <el-icon><SuccessFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已完成</div>
              <div class="stat-value">{{ stats.completed }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('cancelled')">
          <div class="stat-content">
            <div class="stat-icon cancelled">
              <el-icon><CircleClose /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已取消</div>
              <div class="stat-value">{{ stats.cancelled }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索筛选 -->
    <el-card class="filter-card" shadow="hover">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="会员卡号">
          <el-input v-model="filterForm.cardNo" placeholder="输入会员卡号" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="filterForm.name" placeholder="输入会员姓名" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="待处理" value="pending" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>兑换记录</span>
          <span class="total-info">共 {{ pagination.total }} 条</span>
        </div>
      </template>

      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        stripe
        border
      >
        <el-table-column prop="exchangeNo" label="兑换单号" min-width="140">
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewDetail(row.id)">
              {{ row.exchangeNo }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="cardNo" label="会员卡号" width="140" />
        <el-table-column prop="memberName" label="会员姓名" min-width="100" />
        <el-table-column prop="product" label="兑换商品" min-width="140" />
        <el-table-column prop="points" label="所需积分" width="120" align="center">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #e6a23c;">{{ row.points }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" effect="light" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="160" sortable />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleViewDetail(row.id)">
              <el-icon><View /></el-icon> 查看
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              size="small"
              type="success"
              link
              @click="handleApprove(row)"
            >
              <el-icon><Select /></el-icon> 通过
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              size="small"
              type="danger"
              link
              @click="handleCancel(row)"
            >
              <el-icon><Close /></el-icon> 取消
            </el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新建兑换对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新建兑换"
      width="500px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogFormRef" label-width="110px">
        <el-form-item label="会员卡号" prop="cardNo">
          <el-input v-model="dialogForm.cardNo" placeholder="请输入会员卡号" />
        </el-form-item>
        <el-form-item label="会员姓名" prop="memberName">
          <el-input v-model="dialogForm.memberName" placeholder="请输入会员姓名" />
        </el-form-item>
        <el-form-item label="兑换商品" prop="product">
          <el-select v-model="dialogForm.product" placeholder="请选择兑换商品" style="width: 100%">
            <el-option label="洗车券 × 2" value="洗车券 × 2" />
            <el-option label="内饰清洁券" value="内饰清洁券" />
            <el-option label="全车镀晶券" value="全车镀晶券" />
            <el-option label="VIP会员月卡" value="VIP会员月卡" />
            <el-option label="轮胎护理券" value="轮胎护理券" />
          </el-select>
        </el-form-item>
        <el-form-item label="所需积分" prop="points">
          <el-input-number
            v-model="dialogForm.points"
            :min="0"
            :step="100"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialogForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="confirmDialogSubmit">
          提交兑换
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  RefreshLeft,
  Plus,
  Download,
  RefreshRight,
  Document,
  Clock,
  SuccessFilled,
  CircleClose,
  Search,
  Refresh,
  View,
  Select,
  Close,
  Delete
} from '@element-plus/icons-vue'

const router = useRouter()

// ========== 响应式数据 ==========
const loading = ref(false)
const dialogLoading = ref(false)
const dialogVisible = ref(false)
const dialogFormRef = ref<FormInstance>()

// 统计数据
const stats = reactive({
  total: 0,
  pending: 0,
  completed: 0,
  cancelled: 0
})

// 筛选表单
const filterForm = reactive({
  cardNo: '',
  name: '',
  status: ''
})

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref<any[]>([])
const allData = ref<any[]>([])

// 对话框表单
const dialogForm = reactive({
  cardNo: '',
  memberName: '',
  product: '',
  points: 0,
  remark: ''
})

// ========== 表单验证规则 ==========
const dialogRules: FormRules = {
  cardNo: [{ required: true, message: '请输入会员卡号', trigger: 'blur' }],
  memberName: [{ required: true, message: '请输入会员姓名', trigger: 'blur' }],
  product: [{ required: true, message: '请选择兑换商品', trigger: 'change' }],
  points: [
    { required: true, message: '请输入所需积分', trigger: 'blur' },
    { type: 'number', min: 1, message: '积分必须大于0', trigger: 'blur' }
  ]
}

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '待处理',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

// ========== 模拟数据生成 ==========
const generateMockData = () => {
  const members = [
    { cardNo: 'M-2024-001', name: 'Abdullah Al-Fahd' },
    { cardNo: 'M-2024-002', name: 'Nasser Al-Harbi' },
    { cardNo: 'M-2024-003', name: 'Sultan Al-Mutairi' },
    { cardNo: 'M-2024-004', name: 'Khalid Al-Ghamdi' },
    { cardNo: 'M-2024-005', name: 'Faisal Al-Dossary' }
  ]
  const products = ['洗车券 × 2', '内饰清洁券', '全车镀晶券', 'VIP会员月卡', '轮胎护理券']
  const statuses = ['pending', 'completed', 'completed', 'cancelled', 'pending']

  const data = []
  const now = new Date()
  const total = 35

  for (let i = 1; i <= total; i++) {
    const member = members[Math.floor(Math.random() * members.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const date = new Date(now)
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    data.push({
      id: i,
      exchangeNo: `EXC-${String(i).padStart(6, '0')}`,
      cardNo: member.cardNo,
      memberName: member.name,
      product: products[Math.floor(Math.random() * products.length)],
      points: Math.floor(Math.random() * 800 + 200),
      status: status,
      createdAt: date.toISOString().replace('T', ' ').slice(0, 16),
      remark: ''
    })
  }

  data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return data
}

// ========== 计算统计数据 ==========
const calculateStats = (data: any[]) => {
  stats.total = data.length
  stats.pending = data.filter(item => item.status === 'pending').length
  stats.completed = data.filter(item => item.status === 'completed').length
  stats.cancelled = data.filter(item => item.status === 'cancelled').length
}

// ========== 初始化数据 ==========
const initData = () => {
  loading.value = true
  setTimeout(() => {
    allData.value = generateMockData()
    calculateStats(allData.value)
    filterData()
    loading.value = false
  }, 500)
}

// ========== 筛选数据 ==========
const filterData = () => {
  let data = [...allData.value]

  if (filterForm.cardNo) {
    data = data.filter(item => item.cardNo.includes(filterForm.cardNo))
  }
  if (filterForm.name) {
    data = data.filter(item => item.memberName.includes(filterForm.name))
  }
  if (filterForm.status) {
    data = data.filter(item => item.status === filterForm.status)
  }

  pagination.total = data.length
  const start = (pagination.current - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  tableData.value = data.slice(start, end)
}

// ========== 事件处理 ==========
const handleSearch = () => {
  pagination.current = 1
  filterData()
}

const handleReset = () => {
  filterForm.cardNo = ''
  filterForm.name = ''
  filterForm.status = ''
  pagination.current = 1
  filterData()
}

const filterByStatus = (status: string) => {
  filterForm.status = status
  pagination.current = 1
  filterData()
}

const handleCreate = () => {
  dialogForm.cardNo = ''
  dialogForm.memberName = ''
  dialogForm.product = ''
  dialogForm.points = 0
  dialogForm.remark = ''
  dialogVisible.value = true
}

const handleViewDetail = (id: number) => {
  router.push(`/pos/exchange/detail/${id}`)
}

const handleApprove = (row: any) => {
  ElMessageBox.confirm(`确定要通过兑换 ${row.exchangeNo} 吗？`, '确认', {
    confirmButtonText: '通过',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    const item = allData.value.find(d => d.id === row.id)
    if (item) {
      item.status = 'completed'
      calculateStats(allData.value)
      filterData()
      ElMessage.success('兑换已通过')
    }
  }).catch(() => {})
}

const handleCancel = (row: any) => {
  ElMessageBox.confirm(`确定要取消兑换 ${row.exchangeNo} 吗？`, '确认', {
    confirmButtonText: '取消',
    cancelButtonText: '关闭',
    type: 'warning'
  }).then(() => {
    const item = allData.value.find(d => d.id === row.id)
    if (item) {
      item.status = 'cancelled'
      calculateStats(allData.value)
      filterData()
      ElMessage.warning('已取消兑换')
    }
  }).catch(() => {})
}

const handleDelete = (id: number) => {
  const item = allData.value.find(d => d.id === id)
  ElMessageBox.confirm(`确定要删除兑换 ${item?.exchangeNo} 吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    allData.value = allData.value.filter(d => d.id !== id)
    calculateStats(allData.value)
    filterData()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const confirmDialogSubmit = async () => {
  if (!dialogFormRef.value) return
  try {
    await dialogFormRef.value.validate()
  } catch {
    return
  }

  dialogLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    const newItem = {
      id: allData.value.length + 1,
      exchangeNo: `EXC-${String(allData.value.length + 1).padStart(6, '0')}`,
      cardNo: dialogForm.cardNo,
      memberName: dialogForm.memberName,
      product: dialogForm.product,
      points: dialogForm.points,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      remark: dialogForm.remark
    }
    allData.value.unshift(newItem)
    calculateStats(allData.value)
    filterData()
    ElMessage.success('兑换申请已提交')
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
  }
}

const handleExport = () => {
  ElMessage.success('导出任务已提交')
}

const handleRefresh = () => {
  initData()
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.current = 1
  filterData()
}

const handleCurrentChange = (val: number) => {
  pagination.current = val
  filterData()
}

// ========== 生命周期 ==========
onMounted(() => {
  initData()
})
</script>

<style scoped>
.exchange-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #fff;
  flex-shrink: 0;
  margin-right: 14px;
}

.stat-icon.total {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}
.stat-icon.pending {
  background: linear-gradient(135deg, #e6a23c, #f0c78a);
}
.stat-icon.completed {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}
.stat-icon.cancelled {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  line-height: 1.3;
}

.filter-card {
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 0;
}

.filter-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 12px;
}

.table-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.total-info {
  font-size: 13px;
  font-weight: 400;
  color: #909399;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .exchange-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }

  .stat-cards .el-col {
    margin-bottom: 12px;
  }

  .stat-cards .el-col {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .filter-form {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-form :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .filter-form :deep(.el-form-item:last-child) {
    margin-bottom: 0;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .stat-cards .el-col {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .stat-value {
    font-size: 18px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
    margin-right: 10px;
  }
}
</style>