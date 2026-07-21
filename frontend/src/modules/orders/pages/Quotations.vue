<!-- 
  文件路径: frontend/src/modules/orders/pages/Quotations.vue
  功能: 销售报价列表 - 管理所有销售报价单
-->

<template>
  <div class="page-container">
    <!-- 搜索区域 -->
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="报价单号">
              <el-input v-model="searchForm.quotationNo" placeholder="请输入报价单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="已发送" value="sent" />
                <el-option label="已确认" value="confirmed" />
                <el-option label="已过期" value="expired" />
                <el-option label="已转换订单" value="converted" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期范围">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon> 查询
              </el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport">
                <el-icon><Download /></el-icon> 导出
              </el-button>
              <el-button type="primary" @click="handleCreate" style="float: right">
                <el-icon><Plus /></el-icon> 新建报价
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="4" v-for="stat in statistics" :key="stat.label">
        <el-card class="stat-card">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-change" :class="stat.trend">
            {{ stat.trend === 'up' ? '↑' : '↓' }} {{ stat.change }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="quotationNo" label="报价单号" width="140" />
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="contact" label="联系人" />
        <el-table-column prop="totalAmount" label="总金额" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #409EFF;">{{ formatCurrency(row.totalAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="validUntil" label="有效期至" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
            </el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="success" size="small" @click="handleConvert(row)">
              <el-icon><Document /></el-icon> 转订单
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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

    <!-- 新建/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      destroy-on-close
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customer">
              <el-select v-model="form.customer" placeholder="请选择客户" style="width: 100%" filterable>
                <el-option label="沙特电信公司" value="沙特电信公司" />
                <el-option label="阿尔拉吉银行" value="阿尔拉吉银行" />
                <el-option label="沙特阿美" value="沙特阿美" />
                <el-option label="利雅得银行" value="利雅得银行" />
                <el-option label="沙特航空" value="沙特航空" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期至" prop="validUntil">
              <el-date-picker v-model="form.validUntil" type="date" placeholder="选择有效期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 产品明细 -->
        <div style="margin: 16px 0; font-weight: 600;">产品明细</div>
        <el-table :data="form.items" border style="width: 100%">
          <el-table-column label="产品名称" width="200">
            <template #default="{ row, $index }">
              <el-select v-model="row.product" placeholder="选择产品" filterable>
                <el-option label="iPhone 15 Pro Max" value="iPhone 15 Pro Max" />
                <el-option label="三星 Galaxy S24 Ultra" value="三星 Galaxy S24 Ultra" />
                <el-option label="MacBook Pro 16\"" value="MacBook Pro 16\"" />
                <el-option label="iPad Pro 12.9\"" value="iPad Pro 12.9\"" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="120">
            <template #default="{ row }">
              <el-input-number v-model="row.quantity" :min="1" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column label="单价" width="150">
            <template #default="{ row }">
              <el-input-number v-model="row.price" :min="0" :precision="2" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column label="小计" align="right" width="150">
            <template #default="{ row }">
              {{ formatCurrency(row.quantity * row.price) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template #default="{ $index }">
              <el-button type="danger" size="small" @click="removeItem($index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" text @click="addItem" style="margin-top: 12px;">
          <el-icon><Plus /></el-icon> 添加产品
        </el-button>

        <div style="text-align: right; margin-top: 16px; font-size: 16px;">
          合计: <span style="font-weight: 700; color: #409EFF;">{{ formatCurrency(form.total) }}</span>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Search, Download, Plus, View, Edit, Document, Delete } from '@element-plus/icons-vue'
import { useOrdersStore } from '../store'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useOrdersStore()

// 搜索表单
const searchForm = reactive({
  quotationNo: '',
  customer: '',
  status: '',
  dateRange: [] as [Date, Date] | [],
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    quotationNo: 'QT-2024-001',
    customer: '沙特电信公司',
    contact: 'Ahmed Al-Fahd',
    totalAmount: 285600,
    validUntil: '2024-12-31',
    status: 'confirmed',
    createdAt: '2024-11-15 10:30',
  },
  {
    id: 2,
    quotationNo: 'QT-2024-002',
    customer: '阿尔拉吉银行',
    contact: 'Mohammed Al-Qahtani',
    totalAmount: 256800,
    validUntil: '2024-12-15',
    status: 'sent',
    createdAt: '2024-11-20 14:20',
  },
  {
    id: 3,
    quotationNo: 'QT-2024-003',
    customer: '沙特阿美',
    contact: 'Saud Al-Otaibi',
    totalAmount: 223400,
    validUntil: '2024-11-30',
    status: 'expired',
    createdAt: '2024-10-25 09:15',
  },
  {
    id: 4,
    quotationNo: 'QT-2024-004',
    customer: '利雅得银行',
    contact: 'Faisal Al-Dossary',
    totalAmount: 198700,
    validUntil: '2025-01-15',
    status: 'draft',
    createdAt: '2024-12-01 16:45',
  },
  {
    id: 5,
    quotationNo: 'QT-2024-005',
    customer: '沙特航空',
    contact: 'Khalid Al-Ghamdi',
    totalAmount: 176500,
    validUntil: '2024-12-20',
    status: 'converted',
    createdAt: '2024-11-10 11:00',
  },
])

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新建报价')
const submitting = ref(false)
const formRef = ref()

// 统计
const statistics = ref([
  { label: '总报价数', value: '128', change: 12.5, trend: 'up' },
  { label: '已确认', value: '45', change: 8.3, trend: 'up' },
  { label: '已转换订单', value: '32', change: 15.6, trend: 'up' },
  { label: '已过期', value: '18', change: -3.2, trend: 'down' },
])

// 表单
const form = reactive({
  customer: '',
  contact: '',
  phone: '',
  validUntil: '',
  remark: '',
  items: [] as Array<{ product: string; quantity: number; price: number }>,
  total: 0,
})

const rules = {
  customer: [{ required: true, message: '请选择客户', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  validUntil: [{ required: true, message: '请选择有效期', trigger: 'change' }],
}

// 方法
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    draft: 'info',
    sent: 'warning',
    confirmed: 'success',
    expired: 'danger',
    converted: 'primary',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    draft: '草稿',
    sent: '已发送',
    confirmed: '已确认',
    expired: '已过期',
    converted: '已转换',
  }
  return map[status] || status
}

const handleSearch = () => {
  loading.value = true
  // 模拟搜索
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询完成')
  }, 500)
}

const handleReset = () => {
  searchForm.quotationNo = ''
  searchForm.customer = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

const handleExport = () => {
  ElMessage.success('导出任务已提交')
}

const handleCreate = () => {
  dialogTitle.value = '新建报价'
  form.customer = ''
  form.contact = ''
  form.phone = ''
  form.validUntil = ''
  form.remark = ''
  form.items = []
  form.total = 0
  dialogVisible.value = true
}

const handleView = (row: any) => {
  ElMessage.info(`查看报价: ${row.quotationNo}`)
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑报价'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleConvert = (row: any) => {
  ElMessageBox.confirm(`确定要将报价 ${row.quotationNo} 转换为订单吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    ElMessage.success('转换成功')
  }).catch(() => {})
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除报价 ${row.quotationNo} 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const addItem = () => {
  form.items.push({ product: '', quantity: 1, price: 0 })
}

const removeItem = (index: number) => {
  form.items.splice(index, 1)
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    dialogVisible.value = false
    ElMessage.success('提交成功')
  }, 1000)
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  handleSearch()
}

// 计算合计
const total = computed(() => {
  return form.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
})

onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.stat-change { font-size: 12px; }
.stat-change.up { color: #67C23A; }
.stat-change.down { color: #F56C6C; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>