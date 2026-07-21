<!-- 
  文件路径: frontend/src/modules/finance/pages/AccountsReceivable.vue
  功能: 应收管理 - 管理应收账款
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="发票号">
              <el-input v-model="searchForm.invoiceNo" placeholder="请输入发票号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="账龄">
              <el-select v-model="searchForm.aging" placeholder="请选择账龄" clearable style="width: 100%">
                <el-option label="30天内" value="0-30" />
                <el-option label="30-60天" value="30-60" />
                <el-option label="60-90天" value="60-90" />
                <el-option label="90天以上" value="90+" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleReminder" style="float: right"><el-icon><Bell /></el-icon> 批量催收</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in arStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-sub">{{ stat.sub }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 账龄分析图 -->
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>账龄分析</span>
            <el-tag size="small" type="info" style="margin-left: 12px;">单位: SAR</el-tag>
          </template>
          <div ref="agingChartRef" class="chart-container" style="height: 200px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>应收账款明细</span>
          <div>
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="overdue">逾期</el-radio-button>
              <el-radio-button label="current">未逾期</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>
      <el-table :data="filteredData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column type="selection" width="40" />
        <el-table-column prop="invoiceNo" label="发票号" width="140" />
        <el-table-column prop="customer" label="客户名称" min-width="140" />
        <el-table-column prop="amount" label="应收金额" align="right" width="140">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="paidAmount" label="已收金额" align="right" width="140">
          <template #default="{ row }">{{ formatCurrency(row.paidAmount) }}</template>
        </el-table-column>
        <el-table-column prop="balance" label="未收余额" align="right" width="140">
          <template #default="{ row }">
            <span style="color: #F56C6C; font-weight: 700;">{{ formatCurrency(row.balance) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="到期日" width="120" />
        <el-table-column prop="aging" label="账龄" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="getAgingType(row.aging)">
              {{ row.aging }}天
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'overdue' ? 'danger' : row.status === 'pending' ? 'warning' : 'success'">
              {{ row.status === 'overdue' ? '逾期' : row.status === 'pending' ? '待收' : '已收' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDetail(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleCollection(row)" v-if="row.balance > 0">
              <el-icon><Bell /></el-icon> 催收
            </el-button>
            <el-button type="success" size="small" @click="handleReceive(row)" v-if="row.balance > 0">
              <el-icon><Money /></el-icon> 收款
            </el-button>
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

    <!-- 收款弹窗 -->
    <el-dialog v-model="receiveDialogVisible" title="录入收款" width="500px">
      <el-form :model="receiveForm" label-width="120px">
        <el-form-item label="客户">{{ receiveForm.customer }}</el-form-item>
        <el-form-item label="发票号">{{ receiveForm.invoiceNo }}</el-form-item>
        <el-form-item label="未收余额">{{ formatCurrency(receiveForm.balance) }}</el-form-item>
        <el-form-item label="收款金额" prop="amount">
          <el-input-number v-model="receiveForm.amount" :min="0" :max="receiveForm.balance" :precision="2" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="收款方式" prop="method">
          <el-select v-model="receiveForm.method" placeholder="请选择收款方式" style="width: 100%">
            <el-option label="银行转账" value="transfer" />
            <el-option label="现金" value="cash" />
            <el-option label="信用卡" value="card" />
            <el-option label="支票" value="cheque" />
          </el-select>
        </el-form-item>
        <el-form-item label="收款日期" prop="receiveDate">
          <el-date-picker v-model="receiveForm.receiveDate" type="date" placeholder="选择收款日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="receiveForm.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="receiveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveReceive" :loading="submitting">确认收款</el-button>
      </template>
    </el-dialog>

    <!-- 催收弹窗 -->
    <el-dialog v-model="collectionDialogVisible" title="催收通知" width="450px">
      <el-form :model="collectionForm" label-width="100px">
        <el-form-item label="客户">{{ collectionForm.customer }}</el-form-item>
        <el-form-item label="欠款金额">{{ formatCurrency(collectionForm.balance) }}</el-form-item>
        <el-form-item label="催收方式" prop="method">
          <el-select v-model="collectionForm.method" placeholder="请选择催收方式" style="width: 100%">
            <el-option label="短信" value="sms" />
            <el-option label="邮件" value="email" />
            <el-option label="电话" value="phone" />
          </el-select>
        </el-form-item>
        <el-form-item label="催收内容" prop="content">
          <el-input v-model="collectionForm.content" type="textarea" :rows="4" placeholder="请输入催收内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="collectionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSendCollection" :loading="submitting">发送催收</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { Search, Download, Bell, View, Money, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'

// 搜索表单
const searchForm = reactive({
  customer: '',
  invoiceNo: '',
  aging: '',
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
})

// 视图模式
const viewMode = ref('all')

// 统计数据
const arStats = ref([
  { label: '应收总额', value: 'SAR 3,509,000', sub: '↑ 8.5% 较上期', type: 'primary' },
  { label: '已收金额', value: 'SAR 2,156,000', sub: '↑ 12.3% 较上期', type: 'success' },
  { label: '未收余额', value: 'SAR 1,353,000', sub: '↑ 3.2% 较上期', type: 'warning' },
  { label: '逾期金额', value: 'SAR 379,000', sub: '↓ 5.6% 较上期', type: 'danger' },
])

// 表格数据
const tableData = ref([
  { id: 1, invoiceNo: 'INV-2024-001', customer: '沙特电信公司', amount: 285600, paidAmount: 200000, balance: 85600, dueDate: '2024-12-20', aging: 15, status: 'pending' },
  { id: 2, invoiceNo: 'INV-2024-002', customer: '阿尔拉吉银行', amount: 198700, paidAmount: 50000, balance: 148700, dueDate: '2024-11-18', aging: 32, status: 'overdue' },
  { id: 3, invoiceNo: 'INV-2024-003', customer: '沙特阿美', amount: 176500, paidAmount: 0, balance: 176500, dueDate: '2024-10-15', aging: 65, status: 'overdue' },
  { id: 4, invoiceNo: 'INV-2024-004', customer: '利雅得银行', amount: 154200, paidAmount: 154200, balance: 0, dueDate: '2024-11-05', aging: 0, status: 'paid' },
  { id: 5, invoiceNo: 'INV-2024-005', customer: '沙特航空', amount: 132800, paidAmount: 80000, balance: 52800, dueDate: '2024-12-10', aging: 8, status: 'pending' },
])

const loading = ref(false)
const submitting = ref(false)

// 图表引用
const agingChartRef = ref<HTMLElement>()

// 弹窗状态
const receiveDialogVisible = ref(false)
const collectionDialogVisible = ref(false)

// 收款表单
const receiveForm = reactive({
  customer: '',
  invoiceNo: '',
  balance: 0,
  amount: 0,
  method: 'transfer',
  receiveDate: new Date(),
  remark: '',
})

// 催收表单
const collectionForm = reactive({
  customer: '',
  balance: 0,
  method: 'sms',
  content: '',
})

// 计算过滤后的数据
const filteredData = computed(() => {
  if (viewMode.value === 'all') return tableData.value
  if (viewMode.value === 'overdue') return tableData.value.filter(item => item.status === 'overdue')
  if (viewMode.value === 'current') return tableData.value.filter(item => item.status !== 'overdue' && item.balance > 0)
  return tableData.value
})

// 方法
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
}

const getAgingType = (days: number) => {
  if (days <= 0) return 'success'
  if (days <= 30) return ''
  if (days <= 60) return 'warning'
  return 'danger'
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询完成')
  }, 500)
}

const handleReset = () => {
  searchForm.customer = ''
  searchForm.invoiceNo = ''
  searchForm.aging = ''
  handleSearch()
}

const handleExport = () => {
  ElMessage.success('导出任务已提交，文件将发送到您的邮箱')
}

const handleReminder = () => {
  ElMessageBox.confirm('确定要向所有逾期客户发送催收通知吗？', '批量催收', {
    confirmButtonText: '确定发送',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('批量催收通知已发送')
  }).catch(() => {})
}

const handleDetail = (row: any) => {
  ElMessage.info(`查看发票明细: ${row.invoiceNo}`)
}

const handleCollection = (row: any) => {
  collectionForm.customer = row.customer
  collectionForm.balance = row.balance
  collectionForm.method = 'sms'
  collectionForm.content = `尊敬的${row.customer}，您有一笔${formatCurrency(row.balance)}的款项已逾期，请尽快安排付款。`
  collectionDialogVisible.value = true
}

const handleSendCollection = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    collectionDialogVisible.value = false
    ElMessage.success(`催收通知已发送给 ${collectionForm.customer}`)
  }, 800)
}

const handleReceive = (row: any) => {
  receiveForm.customer = row.customer
  receiveForm.invoiceNo = row.invoiceNo
  receiveForm.balance = row.balance
  receiveForm.amount = row.balance
  receiveForm.method = 'transfer'
  receiveForm.receiveDate = new Date()
  receiveForm.remark = ''
  receiveDialogVisible.value = true
}

const handleSaveReceive = () => {
  if (receiveForm.amount <= 0 || receiveForm.amount > receiveForm.balance) {
    ElMessage.warning('请输入有效的收款金额')
    return
  }
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    receiveDialogVisible.value = false
    ElMessage.success(`收款 ${formatCurrency(receiveForm.amount)} 已录入`)
  }, 800)
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  handleSearch()
}

// 初始化图表
const initChart = async () => {
  await nextTick()
  if (agingChartRef.value) {
    const chart = echarts.init(agingChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis', formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>金额: ${formatCurrency(data.value)}`
      }},
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['30天内', '30-60天', '60-90天', '90天以上'],
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f0f0f0' } },
        axisLabel: { formatter: (val: number) => formatCurrency(val) },
      },
      series: [
        {
          type: 'bar',
          data: [
            { value: 856000, itemStyle: { color: '#67C23A' } },
            { value: 524000, itemStyle: { color: '#E6A23C' } },
            { value: 256000, itemStyle: { color: '#F56C6C' } },
            { value: 123000, itemStyle: { color: '#FF0000' } },
          ],
          barWidth: '40%',
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => formatCurrency(params.value),
          },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

// 生命周期
onMounted(() => {
  handleSearch()
  initChart()
})
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 13px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.stat-sub { color: #909399; font-size: 12px; }
.chart-container { width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>