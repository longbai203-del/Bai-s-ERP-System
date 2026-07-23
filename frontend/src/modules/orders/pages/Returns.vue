<template>
  <div class="returns-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1>
          <el-icon :size="28" color="#8B5CF6"><RefreshLeft /></el-icon>
          退货管理
        </h1>
        <span class="subtitle">退货申请处理与流程追踪</span>
      </div>
      <div class="header-actions">
        <el-button type="success" @click="handleCreate">
          <el-icon><Plus /></el-icon> 新建退货
        </el-button>
        <el-button type="primary" @click="handleBatchProcess" :disabled="selectedIds.length === 0">
          <el-icon><Check /></el-icon> 批量处理 ({{ selectedIds.length }})
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
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('pending')">
          <div class="stat-content">
            <div class="stat-icon pending">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">待审核</div>
              <div class="stat-value">{{ statistics.pending }}</div>
              <div class="stat-change warning">等待审核</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('approved')">
          <div class="stat-content">
            <div class="stat-icon approved">
              <el-icon><Select /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">审核通过</div>
              <div class="stat-value">{{ statistics.approved }}</div>
              <div class="stat-change info">等待退货</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('shipping')">
          <div class="stat-content">
            <div class="stat-icon shipping">
              <el-icon><Van /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">退货中</div>
              <div class="stat-value">{{ statistics.shipping }}</div>
              <div class="stat-change primary">运输中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('completed')">
          <div class="stat-content">
            <div class="stat-icon completed">
              <el-icon><SuccessFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已完成</div>
              <div class="stat-value">{{ statistics.completed }}</div>
              <div class="stat-change positive">退货完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('rejected')">
          <div class="stat-content">
            <div class="stat-icon rejected">
              <el-icon><CircleClose /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已拒绝</div>
              <div class="stat-value">{{ statistics.rejected }}</div>
              <div class="stat-change negative">已驳回</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon total">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">退货总额</div>
              <div class="stat-value">¥{{ formatNumber(statistics.totalAmount) }}</div>
              <div class="stat-change info">累计金额</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索筛选 -->
    <el-card class="filter-card" shadow="hover">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="退货单号">
          <el-input v-model="filterForm.returnNo" placeholder="输入退货单号" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="原订单">
          <el-input v-model="filterForm.orderNo" placeholder="输入订单号" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model="filterForm.customer" placeholder="输入客户名称" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="待审核" value="pending" />
            <el-option label="审核通过" value="approved" />
            <el-option label="退货中" value="shipping" />
            <el-option label="已完成" value="completed" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            value-format="YYYY-MM-DD"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 搜索
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
          <div class="header-left">
            <span>退货列表</span>
            <el-tag size="small" type="info" v-if="selectedIds.length > 0">
              已选 {{ selectedIds.length }} 项
            </el-tag>
          </div>
          <div class="header-right">
            <span class="total-info">共 {{ pagination.total }} 条记录</span>
          </div>
        </div>
      </template>

      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        stripe
        border
        @selection-change="handleSelectionChange"
        row-key="id"
      >
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column prop="returnNo" label="退货单号" min-width="140">
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewDetail(row.id)">
              {{ row.returnNo }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="原订单" width="140" />
        <el-table-column prop="customer" label="客户名称" min-width="120" />
        <el-table-column prop="amount" label="退货金额" width="140" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #f56c6c;">
              ¥{{ formatNumber(row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="product" label="退货商品" min-width="140" show-overflow-tooltip />
        <el-table-column prop="reason" label="退货原因" width="120" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" effect="light" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="160" sortable />
        <el-table-column label="操作" width="260" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleViewDetail(row.id)">
              <el-icon><View /></el-icon>
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
              @click="handleReject(row)"
            >
              <el-icon><Close /></el-icon> 拒绝
            </el-button>
            <el-button
              v-if="row.status === 'approved'"
              size="small"
              type="warning"
              link
              @click="handleStartShipping(row)"
            >
              <el-icon><Van /></el-icon> 发货
            </el-button>
            <el-button
              v-if="row.status === 'shipping'"
              size="small"
              type="success"
              link
              @click="handleComplete(row)"
            >
              <el-icon><SuccessFilled /></el-icon> 完成
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

    <!-- 新建退货对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新建退货申请"
      width="600px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogFormRef" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="原订单号" prop="orderNo">
              <el-input v-model="dialogForm.orderNo" placeholder="请输入原订单号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customer">
              <el-input v-model="dialogForm.customer" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货商品" prop="product">
              <el-input v-model="dialogForm.product" placeholder="请输入退货商品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货金额" prop="amount">
              <el-input-number
                v-model="dialogForm.amount"
                :min="0.01"
                :precision="2"
                :max="999999.99"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货原因" prop="reason">
              <el-select v-model="dialogForm.reason" placeholder="请选择退货原因" style="width: 100%">
                <el-option label="产品质量问题" value="产品质量问题" />
                <el-option label="发错商品" value="发错商品" />
                <el-option label="运输损坏" value="运输损坏" />
                <el-option label="客户不满意" value="客户不满意" />
                <el-option label="其他原因" value="其他原因" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退款方式" prop="method">
              <el-select v-model="dialogForm.method" placeholder="请选择退款方式" style="width: 100%">
                <el-option label="原路返回" value="原路返回" />
                <el-option label="银行转账" value="银行转账" />
                <el-option label="现金退款" value="现金退款" />
                <el-option label="余额抵扣" value="余额抵扣" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="dialogForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="confirmDialogSubmit">
          提交申请
        </el-button>
      </template>
    </el-dialog>

    <!-- 拒绝原因对话框 -->
    <el-dialog
      v-model="rejectDialogVisible"
      title="拒绝退货"
      width="450px"
      :close-on-click-modal="false"
    >
      <el-form :model="rejectForm" ref="rejectFormRef" label-width="100px">
        <el-form-item label="拒绝原因" prop="reason" required>
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因..."
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="通知客户">
          <el-switch v-model="rejectForm.notifyCustomer" />
          <span style="margin-left: 8px; color: #909399; font-size: 13px;">发送通知邮件</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="rejectLoading" @click="confirmReject">
          确认拒绝
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量处理对话框 -->
    <el-dialog
      v-model="batchDialogVisible"
      title="批量处理退货"
      width="450px"
      :close-on-click-modal="false"
    >
      <div class="batch-info">
        <p>将批量处理 <strong>{{ selectedIds.length }}</strong> 条退货申请</p>
        <p class="batch-hint">批量操作将统一设置状态为"审核通过"</p>
        <div class="selected-list" v-if="selectedIds.length <= 5">
          <el-tag
            v-for="id in selectedIds"
            :key="id"
            size="small"
            style="margin: 2px 4px;"
          >
            {{ getReturnNoById(id) }}
          </el-tag>
        </div>
        <div v-else class="selected-list">
          <el-tag
            v-for="id in selectedIds.slice(0, 3)"
            :key="id"
            size="small"
            style="margin: 2px 4px;"
          >
            {{ getReturnNoById(id) }}
          </el-tag>
          <el-tag size="small" type="info">+{{ selectedIds.length - 3 }} 项</el-tag>
        </div>
      </div>
      <template #footer>
        <el-button @click="batchDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="batchLoading" @click="confirmBatchProcess">
          确认批量处理
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  RefreshLeft,
  Plus,
  Check,
  Download,
  RefreshRight,
  Clock,
  Select,
  Van,
  SuccessFilled,
  Search,
  Refresh,
  View,
  Close,
  Delete,
  CircleClose,
  Document
} from '@element-plus/icons-vue'

const router = useRouter()

// ========== 响应式数据 ==========
const loading = ref(false)
const dialogLoading = ref(false)
const rejectLoading = ref(false)
const batchLoading = ref(false)
const dialogVisible = ref(false)
const rejectDialogVisible = ref(false)
const batchDialogVisible = ref(false)
const dialogFormRef = ref<FormInstance>()
const rejectFormRef = ref<FormInstance>()
const currentRejectId = ref<number | null>(null)
const selectedIds = ref<number[]>([])

// 统计数据
const statistics = reactive({
  pending: 0,
  approved: 0,
  shipping: 0,
  completed: 0,
  rejected: 0,
  totalAmount: 0
})

// 筛选表单
const filterForm = reactive({
  returnNo: '',
  orderNo: '',
  customer: '',
  status: '',
  dateRange: [] as string[]
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
  orderNo: '',
  customer: '',
  product: '',
  amount: 0,
  reason: '',
  method: '原路返回',
  remark: ''
})

// 拒绝表单
const rejectForm = reactive({
  reason: '',
  notifyCustomer: true
})

// ========== 表单验证规则 ==========
const dialogRules: FormRules = {
  orderNo: [{ required: true, message: '请输入原订单号', trigger: 'blur' }],
  customer: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  product: [{ required: true, message: '请输入退货商品', trigger: 'blur' }],
  amount: [
    { required: true, message: '请输入退货金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '金额必须大于0', trigger: 'blur' }
  ],
  reason: [{ required: true, message: '请选择退货原因', trigger: 'change' }]
}

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    approved: 'primary',
    shipping: 'info',
    completed: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    approved: '审核通过',
    shipping: '退货中',
    completed: '已完成',
    rejected: '已拒绝'
  }
  return map[status] || status
}

const getReturnNoById = (id: number) => {
  const item = allData.value.find(d => d.id === id)
  return item ? item.returnNo : `ID:${id}`
}

// ========== 模拟数据生成 ==========
const generateMockData = () => {
  const customers = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const products = ['iPhone 15 Pro Max', 'AirPods Pro 2', 'MacBook Pro 16"', 'iPad Pro 12.9"', 'Apple Watch Ultra 2', '三星 S24 Ultra']
  const reasons = ['产品质量问题', '发错商品', '运输损坏', '客户不满意', '其他原因']
  const methods = ['原路返回', '银行转账', '现金退款', '余额抵扣']
  const statuses = ['pending', 'approved', 'shipping', 'completed', 'rejected']

  const data = []
  const now = new Date()
  const total = 50

  for (let i = 1; i <= total; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const date = new Date(now)
    date.setDate(date.getDate() - Math.floor(Math.random() * 60))

    data.push({
      id: i,
      returnNo: `RT-${String(i).padStart(6, '0')}`,
      orderNo: `ORD-${String(Math.floor(Math.random() * 500) + 1).padStart(6, '0')}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      amount: Math.round((Math.random() * 2000 + 50) * 100) / 100,
      product: products[Math.floor(Math.random() * products.length)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      method: methods[Math.floor(Math.random() * methods.length)],
      status: status,
      createdAt: date.toISOString().replace('T', ' ').slice(0, 16),
      remark: Math.random() > 0.7 ? '客户急用，请尽快处理' : ''
    })
  }

  data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return data
}

// ========== 计算统计数据 ==========
const calculateStats = (data: any[]) => {
  statistics.pending = data.filter(item => item.status === 'pending').length
  statistics.approved = data.filter(item => item.status === 'approved').length
  statistics.shipping = data.filter(item => item.status === 'shipping').length
  statistics.completed = data.filter(item => item.status === 'completed').length
  statistics.rejected = data.filter(item => item.status === 'rejected').length
  statistics.totalAmount = data.reduce((sum, item) => sum + item.amount, 0)
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

  if (filterForm.returnNo) {
    data = data.filter(item => item.returnNo.includes(filterForm.returnNo))
  }
  if (filterForm.orderNo) {
    data = data.filter(item => item.orderNo.includes(filterForm.orderNo))
  }
  if (filterForm.customer) {
    data = data.filter(item => item.customer.includes(filterForm.customer))
  }
  if (filterForm.status) {
    data = data.filter(item => item.status === filterForm.status)
  }
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const [start, end] = filterForm.dateRange
    data = data.filter(item => item.createdAt >= start && item.createdAt <= end)
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
  filterForm.returnNo = ''
  filterForm.orderNo = ''
  filterForm.customer = ''
  filterForm.status = ''
  filterForm.dateRange = []
  pagination.current = 1
  filterData()
}

const filterByStatus = (status: string) => {
  filterForm.status = status
  pagination.current = 1
  filterData()
}

const handleCreate = () => {
  dialogForm.orderNo = ''
  dialogForm.customer = ''
  dialogForm.product = ''
  dialogForm.amount = 0
  dialogForm.reason = ''
  dialogForm.method = '原路返回'
  dialogForm.remark = ''
  dialogVisible.value = true
}

const handleViewDetail = (id: number) => {
  router.push(`/orders/returns/detail/${id}`)
}

const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleBatchProcess = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条记录')
    return
  }
  batchDialogVisible.value = true
}

const confirmBatchProcess = async () => {
  batchLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    let processedCount = 0
    selectedIds.value.forEach(id => {
      const item = allData.value.find(d => d.id === id)
      if (item && item.status === 'pending') {
        item.status = 'approved'
        processedCount++
      }
    })
    calculateStats(allData.value)
    filterData()
    ElMessage.success(`成功处理 ${processedCount} 条退货申请`)
    batchDialogVisible.value = false
    selectedIds.value = []
  } finally {
    batchLoading.value = false
  }
}

const handleApprove = (row: any) => {
  ElMessageBox.confirm(`确定要通过退货 ${row.returnNo} 的审核吗？`, '审核确认', {
    confirmButtonText: '通过',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    const item = allData.value.find(d => d.id === row.id)
    if (item) {
      item.status = 'approved'
      calculateStats(allData.value)
      filterData()
      ElMessage.success(`退货 ${row.returnNo} 审核通过`)
    }
  }).catch(() => {})
}

const handleReject = (row: any) => {
  currentRejectId.value = row.id
  rejectForm.reason = ''
  rejectForm.notifyCustomer = true
  rejectDialogVisible.value = true
}

const confirmReject = async () => {
  if (!rejectForm.reason || rejectForm.reason.trim() === '') {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  rejectLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    const item = allData.value.find(d => d.id === currentRejectId.value)
    if (item) {
      item.status = 'rejected'
      item.remark = `拒绝原因：${rejectForm.reason}`
      calculateStats(allData.value)
      filterData()
      ElMessage.warning(`退货 ${item.returnNo} 已拒绝`)
      if (rejectForm.notifyCustomer) {
        ElMessage.info('已发送通知邮件给客户')
      }
    }
    rejectDialogVisible.value = false
  } finally {
    rejectLoading.value = false
    currentRejectId.value = null
  }
}

const handleStartShipping = (row: any) => {
  ElMessageBox.confirm(`确定要开始退货 ${row.returnNo} 的物流流程吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const item = allData.value.find(d => d.id === row.id)
    if (item) {
      item.status = 'shipping'
      calculateStats(allData.value)
      filterData()
      ElMessage.success(`退货 ${row.returnNo} 已进入物流流程`)
    }
  }).catch(() => {})
}

const handleComplete = (row: any) => {
  ElMessageBox.confirm(`确定要完成退货 ${row.returnNo} 吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    const item = allData.value.find(d => d.id === row.id)
    if (item) {
      item.status = 'completed'
      calculateStats(allData.value)
      filterData()
      ElMessage.success(`退货 ${row.returnNo} 已完成`)
    }
  }).catch(() => {})
}

const handleDelete = (id: number) => {
  const item = allData.value.find(d => d.id === id)
  ElMessageBox.confirm(`确定要删除退货 ${item?.returnNo} 吗？`, '删除确认', {
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
      returnNo: `RT-${String(allData.value.length + 1).padStart(6, '0')}`,
      orderNo: dialogForm.orderNo,
      customer: dialogForm.customer,
      amount: dialogForm.amount,
      product: dialogForm.product,
      reason: dialogForm.reason,
      method: dialogForm.method,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      remark: dialogForm.remark
    }
    allData.value.unshift(newItem)
    calculateStats(allData.value)
    filterData()
    ElMessage.success(`退货申请 ${newItem.returnNo} 已提交`)
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
  }
}

const handleExport = () => {
  ElMessage.success('导出任务已提交，文件将发送到您的邮箱')
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
.returns-page {
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

.stat-icon.pending {
  background: linear-gradient(135deg, #e6a23c, #f0c78a);
}
.stat-icon.approved {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}
.stat-icon.shipping {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}
.stat-icon.completed {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}
.stat-icon.rejected {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}
.stat-icon.total {
  background: linear-gradient(135deg, #909399, #c0c4cc);
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

.stat-change {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 2px;
}

.stat-change.positive {
  color: #67c23a;
}
.stat-change.negative {
  color: #f56c6c;
}
.stat-change.warning {
  color: #e6a23c;
}
.stat-change.info {
  color: #409eff;
}
.stat-change.primary {
  color: #8b5cf6;
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

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
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

.batch-info {
  text-align: center;
  padding: 12px 0;
}

.batch-info p {
  margin: 8px 0;
  font-size: 15px;
  color: #606266;
}

.batch-info .batch-hint {
  font-size: 13px;
  color: #909399;
}

.selected-list {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 768px) {
  .returns-page {
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

  .header-actions .el-button {
    font-size: 12px;
    padding: 8px 12px;
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