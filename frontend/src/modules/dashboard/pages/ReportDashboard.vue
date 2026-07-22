<!-- 
  文件路径: frontend/src/modules/dashboard/pages/ReportDashboard.vue
  功能: 报表仪表盘 - 展示报表中心核心数据
-->

<template>
  <div class="page-container">
    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <el-row :gutter="20" align="middle">
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedReportType" placeholder="报表类型" style="width: 100%">
            <el-option label="全部类型" value="all" />
            <el-option label="销售报表" value="sales" />
            <el-option label="财务报表" value="finance" />
            <el-option label="库存报表" value="inventory" />
            <el-option label="采购报表" value="purchase" />
            <el-option label="绩效报表" value="performance" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedStatus" placeholder="报表状态" style="width: 100%">
            <el-option label="全部状态" value="all" />
            <el-option label="已生成" value="generated" />
            <el-option label="生成中" value="generating" />
            <el-option label="已过期" value="expired" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- KPI 卡片 -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="4" v-for="kpi in reportKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.type">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-change" :class="kpi.change >= 0 ? 'positive' : 'negative'">
            {{ kpi.change >= 0 ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>报表生成趋势</span>
              <el-radio-group v-model="reportPeriod" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="reportTrendRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>报表类型分布</span>
          </template>
          <div ref="typeChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>报表使用统计</span>
            </div>
          </template>
          <div ref="usageChartRef" class="chart-container" style="height: 250px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快速生成报表</span>
              <el-button type="primary" size="small" @click="showGenerateDialog = true">
                <el-icon><Plus /></el-icon> 新建报表
              </el-button>
            </div>
          </template>
          <div class="quick-report-grid">
            <div 
              v-for="template in reportTemplates" 
              :key="template.id"
              class="report-template"
              @click="generateReport(template)"
            >
              <div class="template-icon" :style="{ background: template.color }">
                <el-icon size="24"><component :is="template.icon" /></el-icon>
              </div>
              <div class="template-name">{{ template.name }}</div>
              <div class="template-desc">{{ template.desc }}</div>
              <el-button size="small" type="primary" plain>生成</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 报表列表 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>📋 已生成报表</span>
          <div>
            <el-button size="small" @click="handleExportAll">
              <el-icon><Download /></el-icon> 批量导出
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteAll">
              <el-icon><Delete /></el-icon> 批量删除
            </el-button>
          </div>
        </div>
      </template>
      <el-table :data="reportList" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="报表名称" min-width="160" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" width="100" align="right" />
        <el-table-column prop="generatedBy" label="生成人" width="120" />
        <el-table-column prop="createdAt" label="生成时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleDownload(row)">
              <el-icon><Download /></el-icon>
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="reportTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadReports"
          @current-change="loadReports"
        />
      </div>
    </el-card>

    <!-- 生成报表对话框 -->
    <el-dialog v-model="showGenerateDialog" title="生成报表" width="600px">
      <el-form :model="reportForm" label-width="100px">
        <el-form-item label="报表名称" required>
          <el-input v-model="reportForm.name" placeholder="请输入报表名称" />
        </el-form-item>
        <el-form-item label="报表类型" required>
          <el-select v-model="reportForm.type" placeholder="请选择报表类型" style="width: 100%">
            <el-option label="销售报表" value="sales" />
            <el-option label="财务报表" value="finance" />
            <el-option label="库存报表" value="inventory" />
            <el-option label="采购报表" value="purchase" />
            <el-option label="绩效报表" value="performance" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="reportForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="格式">
          <el-radio-group v-model="reportForm.format">
            <el-radio label="excel">Excel</el-radio>
            <el-radio label="pdf">PDF</el-radio>
            <el-radio label="csv">CSV</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="reportForm.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showGenerateDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmGenerate" :loading="generating">
          <el-icon><DocumentAdd /></el-icon> 生成报表
        </el-button>
      </template>
    </el-dialog>

    <!-- 报表预览对话框 -->
    <el-dialog v-model="showPreviewDialog" title="报表预览" width="800px" top="5vh">
      <div class="report-preview" v-loading="previewLoading">
        <div class="preview-header">
          <h3>{{ currentReport?.name }}</h3>
          <div class="preview-meta">
            <span>类型: {{ getTypeLabel(currentReport?.type) }}</span>
            <span>生成人: {{ currentReport?.generatedBy }}</span>
            <span>生成时间: {{ formatDate(currentReport?.createdAt) }}</span>
          </div>
        </div>
        <div class="preview-content">
          <el-table :data="previewData" border style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="name" label="项目名称" />
            <el-table-column prop="value" label="数值" align="right" />
            <el-table-column prop="change" label="变化" align="center">
              <template #default="{ row }">
                <el-tag :type="row.change >= 0 ? 'success' : 'danger'">
                  {{ row.change >= 0 ? '+' : '' }}{{ row.change }}%
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="preview-footer">
          <div class="summary">
            <span>总计: {{ previewTotal }}</span>
            <span>生成于: {{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showPreviewDialog = false">关闭</el-button>
        <el-button type="primary" @click="handleDownload(currentReport)">
          <el-icon><Download /></el-icon> 下载
        </el-button>
        <el-button type="success" @click="handlePrint">
          <el-icon><Printer /></el-icon> 打印
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { 
  Search, Plus, Download, Delete, DocumentAdd, Printer,
  TrendCharts, Coin, Box, ShoppingCart, User
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'

// ============================================================
// 响应式数据
// ============================================================

const dateRange = ref<[Date, Date]>([
  new Date(new Date().setDate(new Date().getDate() - 30)), 
  new Date()
])
const selectedReportType = ref('all')
const selectedStatus = ref('all')
const reportPeriod = ref('month')
const page = ref(1)
const pageSize = ref(10)
const reportTotal = ref(0)
const generating = ref(false)
const previewLoading = ref(false)
const showGenerateDialog = ref(false)
const showPreviewDialog = ref(false)
const currentReport = ref<any>(null)

// ============================================================
// KPI 数据
// ============================================================

const reportKpis = ref([
  { label: '报表总数', value: '1,286', change: 12.5, type: 'total' },
  { label: '本月生成', value: '286', change: 8.3, type: 'month' },
  { label: '下载次数', value: '3,458', change: 23.7, type: 'download' },
  { label: '报表类型', value: '12', change: 0, type: 'types' },
  { label: '存储空间', value: '2.4 GB', change: 15.2, type: 'storage' },
])

// ============================================================
// 报表模板
// ============================================================

const reportTemplates = ref([
  { id: 1, name: '月度销售报表', desc: '当月销售数据汇总', icon: 'TrendCharts', color: '#409EFF' },
  { id: 2, name: '财务报表', desc: '收入支出利润分析', icon: 'Coin', color: '#67C23A' },
  { id: 3, name: '库存报表', desc: '库存状态与周转率', icon: 'Box', color: '#E6A23C' },
  { id: 4, name: '采购报表', desc: '采购订单与供应商', icon: 'ShoppingCart', color: '#F56C6C' },
  { id: 5, name: '绩效报表', desc: '员工KPI与绩效', icon: 'User', color: '#9B59B6' },
])

// ============================================================
// 报表列表数据
// ============================================================

const reportList = ref([
  { 
    id: 1, 
    name: '2024年Q3销售报表', 
    type: 'sales', 
    size: '2.4 MB', 
    generatedBy: 'Ahmed Al-Fahd',
    createdAt: '2024-10-15 14:30',
    status: 'generated'
  },
  { 
    id: 2, 
    name: '2024年9月财务报表', 
    type: 'finance', 
    size: '1.8 MB', 
    generatedBy: 'Mohammed Al-Qahtani',
    createdAt: '2024-10-10 09:20',
    status: 'generated'
  },
  { 
    id: 3, 
    name: '库存周转分析报表', 
    type: 'inventory', 
    size: '3.2 MB', 
    generatedBy: 'Saud Al-Otaibi',
    createdAt: '2024-10-08 16:45',
    status: 'generating'
  },
  { 
    id: 4, 
    name: 'Q3采购成本分析', 
    type: 'purchase', 
    size: '1.2 MB', 
    generatedBy: 'Faisal Al-Dossary',
    createdAt: '2024-10-05 11:00',
    status: 'expired'
  },
  { 
    id: 5, 
    name: '员工绩效年度报表', 
    type: 'performance', 
    size: '4.6 MB', 
    generatedBy: 'Khalid Al-Ghamdi',
    createdAt: '2024-10-01 13:15',
    status: 'generated'
  },
])

// ============================================================
// 报表表单
// ============================================================

const reportForm = ref({
  name: '',
  type: 'sales',
  dateRange: null as [Date, Date] | null,
  format: 'excel',
  remark: ''
})

// ============================================================
// 预览数据
// ============================================================

const previewData = ref([
  { name: '总销售额', value: 'SAR 1,285,600', change: 12.5 },
  { name: '总利润', value: 'SAR 429,400', change: 18.7 },
  { name: '订单数量', value: '1,286', change: 8.3 },
  { name: '客单价', value: 'SAR 998', change: 3.2 },
  { name: '转化率', value: '32.5%', change: -1.8 },
])

const previewTotal = 'SAR 1,715,000'

// ============================================================
// 图表引用
// ============================================================

const reportTrendRef = ref<HTMLElement>()
const typeChartRef = ref<HTMLElement>()
const usageChartRef = ref<HTMLElement>()

// ============================================================
// 工具函数
// ============================================================

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { 
    style: 'currency', 
    currency: 'SAR', 
    minimumFractionDigits: 0 
  }).format(value)
}

const formatDate = (date: string | Date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    sales: '销售报表',
    finance: '财务报表',
    inventory: '库存报表',
    purchase: '采购报表',
    performance: '绩效报表'
  }
  return map[type] || type
}

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    sales: 'primary',
    finance: 'success',
    inventory: 'warning',
    purchase: 'danger',
    performance: 'info'
  }
  return map[type] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    generated: '已生成',
    generating: '生成中',
    expired: '已过期'
  }
  return map[status] || status
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    generated: 'success',
    generating: 'warning',
    expired: 'danger'
  }
  return map[status] || 'info'
}

// ============================================================
// 业务方法
// ============================================================

const handleSearch = () => {
  loadReports()
}

const handleReset = () => {
  dateRange.value = [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]
  selectedReportType.value = 'all'
  selectedStatus.value = 'all'
  loadReports()
}

const loadReports = () => {
  // 模拟加载数据
  reportTotal.value = 1286
  ElMessage.success('报表数据已刷新')
}

const generateReport = (template: any) => {
  reportForm.value.name = template.name + ' - ' + new Date().toLocaleDateString()
  reportForm.value.type = template.id === 1 ? 'sales' : 
                          template.id === 2 ? 'finance' :
                          template.id === 3 ? 'inventory' :
                          template.id === 4 ? 'purchase' : 'performance'
  showGenerateDialog.value = true
}

const confirmGenerate = async () => {
  if (!reportForm.value.name) {
    ElMessage.warning('请输入报表名称')
    return
  }
  
  generating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newReport = {
      id: Date.now(),
      name: reportForm.value.name,
      type: reportForm.value.type,
      size: (Math.random() * 5 + 1).toFixed(1) + ' MB',
      generatedBy: '当前用户',
      createdAt: new Date().toISOString(),
      status: 'generated'
    }
    
    reportList.value.unshift(newReport)
    reportTotal.value++
    
    ElMessage.success('✅ 报表生成成功！')
    showGenerateDialog.value = false
    reportForm.value = { name: '', type: 'sales', dateRange: null, format: 'excel', remark: '' }
  } catch (error) {
    ElMessage.error('报表生成失败，请重试')
  } finally {
    generating.value = false
  }
}

const handleView = (row: any) => {
  currentReport.value = row
  previewLoading.value = true
  showPreviewDialog.value = true
  
  // 模拟加载预览数据
  setTimeout(() => {
    previewLoading.value = false
  }, 800)
}

const handleDownload = (row: any) => {
  ElMessage.success(`📥 正在下载: ${row.name}`)
}

const handlePrint = () => {
  window.print()
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除报表 "${row.name}" 吗？`, '确认删除', {
    type: 'warning'
  }).then(() => {
    const index = reportList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      reportList.value.splice(index, 1)
      reportTotal.value--
      ElMessage.success('✅ 报表已删除')
    }
  }).catch(() => {})
}

const handleExportAll = () => {
  ElMessage.success('📥 开始批量导出...')
}

const handleDeleteAll = () => {
  ElMessageBox.confirm('确定要删除所有报表吗？此操作不可恢复！', '批量删除', {
    type: 'warning'
  }).then(() => {
    reportList.value = []
    reportTotal.value = 0
    ElMessage.success('✅ 所有报表已删除')
  }).catch(() => {})
}

// ============================================================
// 图表初始化
// ============================================================

const initCharts = async () => {
  await nextTick()

  // 报表趋势图
  if (reportTrendRef.value) {
    const chart = echarts.init(reportTrendRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['生成数量', '下载次数'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['1日', '3日', '5日', '7日', '9日', '11日', '13日', '15日', '17日', '19日', '21日', '23日', '25日', '27日', '29日', '31日'],
      },
      yAxis: [
        { type: 'value', name: '数量', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '下载次数', splitLine: { show: false } },
      ],
      series: [
        {
          name: '生成数量',
          type: 'bar',
          data: [18, 24, 15, 28, 22, 32, 26, 20, 30, 35, 28, 40, 32, 38, 42, 36],
          itemStyle: { color: '#409EFF', borderRadius: [4, 4, 0, 0] },
        },
        {
          name: '下载次数',
          type: 'line',
          yAxisIndex: 1,
          data: [45, 62, 38, 70, 55, 85, 65, 50, 78, 92, 72, 105, 82, 96, 108, 92],
          lineStyle: { color: '#67C23A', width: 3 },
          smooth: true,
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  // 报表类型分布
  if (typeChartRef.value) {
    const chart = echarts.init(typeChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 35, name: '销售报表', itemStyle: { color: '#409EFF' } },
            { value: 25, name: '财务报表', itemStyle: { color: '#67C23A' } },
            { value: 18, name: '库存报表', itemStyle: { color: '#E6A23C' } },
            { value: 12, name: '采购报表', itemStyle: { color: '#F56C6C' } },
            { value: 10, name: '绩效报表', itemStyle: { color: '#9B59B6' } },
          ],
          label: { formatter: '{b}\n{d}%' },
          emphasis: { scale: true },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  // 报表使用统计
  if (usageChartRef.value) {
    const chart = echarts.init(usageChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['销售报表', '财务报表', '库存报表', '采购报表', '绩效报表'],
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f0f0f0' } },
      },
      series: [
        {
          type: 'bar',
          data: [
            { value: 486, itemStyle: { color: '#409EFF' } },
            { value: 358, itemStyle: { color: '#67C23A' } },
            { value: 256, itemStyle: { color: '#E6A23C' } },
            { value: 168, itemStyle: { color: '#F56C6C' } },
            { value: 142, itemStyle: { color: '#9B59B6' } },
          ],
          barWidth: '50%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}次',
          },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

// ============================================================
// 生命周期
// ============================================================

watch(reportPeriod, () => {
  initCharts()
})

onMounted(() => {
  loadReports()
  initCharts()
})
</script>

<style scoped>
.page-container { 
  padding: 20px; 
  background: #f5f7fa; 
  min-height: 100vh; 
}

.filter-card { 
  margin-bottom: 20px; 
  border-radius: 12px; 
}

.kpi-row { 
  margin-bottom: 20px; 
}

.kpi-card { 
  text-align: center; 
  border-radius: 12px; 
  transition: all 0.3s;
  cursor: pointer;
}

.kpi-card:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 8px 25px rgba(0,0,0,0.1); 
}

.kpi-card.total { border-left: 4px solid #409EFF; }
.kpi-card.month { border-left: 4px solid #67C23A; }
.kpi-card.download { border-left: 4px solid #E6A23C; }
.kpi-card.types { border-left: 4px solid #9B59B6; }
.kpi-card.storage { border-left: 4px solid #F56C6C; }

.kpi-label { 
  color: #909399; 
  font-size: 14px; 
}

.kpi-value { 
  font-size: 22px; 
  font-weight: 700; 
  color: #303133; 
  margin: 4px 0; 
}

.kpi-change { 
  font-size: 12px; 
}

.kpi-change.positive { 
  color: #67C23A; 
}

.kpi-change.negative { 
  color: #F56C6C; 
}

.chart-card { 
  border-radius: 12px; 
}

.chart-container { 
  height: 280px; 
  width: 100%; 
}

.card-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
}

.quick-report-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.report-template {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.report-template:hover {
  border-color: #409EFF;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.template-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 8px;
}

.template-name {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}

.template-desc {
  font-size: 12px;
  color: #909399;
  margin: 4px 0 8px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

/* 报表预览 */
.report-preview {
  padding: 20px;
}

.preview-header {
  border-bottom: 2px solid #E5E7EB;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.preview-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #303133;
}

.preview-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #909399;
}

.preview-footer {
  border-top: 2px solid #E5E7EB;
  padding-top: 12px;
  margin-top: 16px;
}

.preview-footer .summary {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
}

/* 响应式 */
@media (max-width: 768px) {
  .quick-report-grid {
    grid-template-columns: 1fr;
  }
  
  .kpi-row .el-col {
    margin-bottom: 12px;
  }
}

@media print {
  .filter-card,
  .kpi-row,
  .chart-card,
  .quick-report-grid,
  .el-table,
  .pagination {
    display: none !important;
  }
  
  .report-preview {
    padding: 0 !important;
  }
}
</style>