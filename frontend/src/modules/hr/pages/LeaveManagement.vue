<!--
  文件路径: frontend/src/modules/hr/pages/LeaveManagement.vue
  功能: 请假管理 - 管理员工请假申请
  包含: 请假申请、审批流程、假期余额、请假记录、统计报表
-->

<template>
  <div class="leave-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">📅 请假管理</h1>
        <p class="page-subtitle">管理员工请假申请与审批</p>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleCreateLeave">
          <el-icon><Plus /></el-icon> 申请请假
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon> 导出报表
        </el-button>
        <el-button @click="handleRefresh" :loading="refreshing">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6" v-for="stat in leaveStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type" shadow="hover">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-sub">{{ stat.sub }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选条件 -->
    <el-card class="filter-card" shadow="hover">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20" align="middle">
          <el-col :xs="24" :sm="12" :md="5">
            <el-form-item label="员工姓名">
              <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="5">
            <el-form-item label="请假类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="年假" value="年假" />
                <el-option label="病假" value="病假" />
                <el-option label="事假" value="事假" />
                <el-option label="婚假" value="婚假" />
                <el-option label="产假" value="产假" />
                <el-option label="丧假" value="丧假" />
                <el-option label="公假" value="公假" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待审批" value="pending" />
                <el-option label="已批准" value="approved" />
                <el-option label="已驳回" value="rejected" />
                <el-option label="已取消" value="cancelled" />
                <el-option label="已结束" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="5">
            <el-form-item label="日期范围">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="4">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon> 查询
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 主表格 -->
    <el-card class="table-card" shadow="hover">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        stripe
        border
        @sort-change="handleSortChange"
      >
        <el-table-column prop="id" label="申请编号" width="100" sortable="custom" />
        <el-table-column prop="name" label="姓名" min-width="100" />
        <el-table-column prop="department" label="部门" width="100" />
        <el-table-column prop="type" label="请假类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getLeaveTypeColor(row.type)">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="120" sortable="custom" />
        <el-table-column prop="endDate" label="结束日期" width="120" sortable="custom" />
        <el-table-column prop="days" label="天数" width="80" align="center" sortable="custom">
          <template #default="{ row }">
            <span class="days-text">{{ row.days }} 天</span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="请假原因" min-width="150" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approver" label="审批人" width="100" />
        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
            </el-button>
            <el-button
              type="success"
              size="small"
              @click="handleApprove(row)"
              v-if="row.status === 'pending'"
            >
              <el-icon><Check /></el-icon> 批准
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleReject(row)"
              v-if="row.status === 'pending'"
            >
              <el-icon><Close /></el-icon> 驳回
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="handleCancel(row)"
              v-if="row.status === 'pending' || row.status === 'approved'"
            >
              <el-icon><CircleClose /></el-icon> 取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="table-footer">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 请假统计图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="14">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><TrendCharts /></el-icon> 请假趋势</span>
              <el-radio-group v-model="trendPeriod" size="small" @change="handleTrendChange">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div class="trend-chart">
              <div class="chart-grid">
                <div class="grid-line" v-for="n in 4" :key="n" :style="{ bottom: (n * 25) + '%' }">
                  <span class="grid-label">{{ n * 25 }}%</span>
                </div>
              </div>
              <div class="chart-bars">
                <div class="bar-group" v-for="(item, index) in trendData" :key="index">
                  <div class="bar-wrapper">
                    <div class="bar bar-leave" :style="{ height: item.percent + '%' }">
                      <span class="bar-value">{{ item.count }}</span>
                    </div>
                  </div>
                  <div class="bar-label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span><el-icon><PieChart /></el-icon> 请假类型分布</span>
            </div>
          </template>
          <div class="pie-chart-container">
            <div class="pie-chart">
              <div
                v-for="(item, index) in typeDistribution"
                :key="item.type"
                class="pie-segment"
                :style="{
                  transform: `rotate(${getPieRotation(index)}deg)`,
                  background: item.color
                }"
              />
            </div>
            <div class="pie-legend">
              <div
                class="legend-item"
                v-for="item in typeDistribution"
                :key="item.type"
              >
                <span class="legend-dot" :style="{ background: item.color }"></span>
                <span class="legend-label">{{ item.type }}</span>
                <span class="legend-value">{{ item.count }}天</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 申请请假对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="📝 申请请假"
      width="620px"
      destroy-on-close
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="员工姓名" prop="name">
          <el-select v-model="createForm.name" placeholder="请选择员工" style="width: 100%" filterable>
            <el-option label="Ahmed Al-Fahd" value="Ahmed Al-Fahd" />
            <el-option label="Mohammed Al-Qahtani" value="Mohammed Al-Qahtani" />
            <el-option label="Saud Al-Otaibi" value="Saud Al-Otaibi" />
            <el-option label="Faisal Al-Dossary" value="Faisal Al-Dossary" />
            <el-option label="Nasser Al-Harbi" value="Nasser Al-Harbi" />
          </el-select>
        </el-form-item>
        <el-form-item label="请假类型" prop="type">
          <el-select v-model="createForm.type" placeholder="请选择请假类型" style="width: 100%">
            <el-option label="年假" value="年假">
              <span>年假</span>
              <span style="float: right; color: #909399; font-size: 12px;">剩余 12 天</span>
            </el-option>
            <el-option label="病假" value="病假">
              <span>病假</span>
              <span style="float: right; color: #909399; font-size: 12px;">剩余 5 天</span>
            </el-option>
            <el-option label="事假" value="事假">
              <span>事假</span>
              <span style="float: right; color: #909399; font-size: 12px;">剩余 3 天</span>
            </el-option>
            <el-option label="婚假" value="婚假" />
            <el-option label="产假" value="产假" />
            <el-option label="丧假" value="丧假" />
            <el-option label="公假" value="公假" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="createForm.startDate"
            type="date"
            placeholder="选择开始日期"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="calculateDays"
          />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="createForm.endDate"
            type="date"
            placeholder="选择结束日期"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="calculateDays"
          />
        </el-form-item>
        <el-form-item label="请假天数" prop="days">
          <el-input-number
            v-model="createForm.days"
            :min="0.5"
            :max="30"
            :precision="0.5"
            controls-position="right"
            style="width: 100%"
          />
          <span class="days-hint">天（含周末）</span>
        </el-form-item>
        <el-form-item label="请假原因" prop="reason">
          <el-input
            v-model="createForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请详细说明请假原因"
          />
        </el-form-item>
        <el-form-item label="审批人" prop="approver">
          <el-select v-model="createForm.approver" placeholder="请选择审批人" style="width: 100%">
            <el-option label="Ahmed Al-Fahd" value="Ahmed Al-Fahd" />
            <el-option label="Mohammed Al-Qahtani" value="Mohammed Al-Qahtani" />
            <el-option label="Saud Al-Otaibi" value="Saud Al-Otaibi" />
          </el-select>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            action="#"
            :auto-upload="false"
            :limit="3"
            list-type="text"
            :on-change="handleFileChange"
          >
            <el-button size="small" type="primary">
              <el-icon><Upload /></el-icon> 上传附件
            </el-button>
            <template #tip>
              <div style="font-size: 12px; color: #909399;">支持 .pdf, .doc, .jpg, .png 文件</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="submitLeave" :loading="creating">
          <el-icon><Check /></el-icon> 提交申请
        </el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="📋 请假详情"
      width="550px"
      destroy-on-close
    >
      <div v-if="selectedLeave" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请编号">{{ selectedLeave.id }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusColor(selectedLeave.status)">
              {{ getStatusLabel(selectedLeave.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="员工姓名">{{ selectedLeave.name }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ selectedLeave.department }}</el-descriptions-item>
          <el-descriptions-item label="请假类型">{{ selectedLeave.type }}</el-descriptions-item>
          <el-descriptions-item label="请假天数">{{ selectedLeave.days }} 天</el-descriptions-item>
          <el-descriptions-item label="开始日期">{{ selectedLeave.startDate }}</el-descriptions-item>
          <el-descriptions-item label="结束日期">{{ selectedLeave.endDate }}</el-descriptions-item>
          <el-descriptions-item label="请假原因" :span="2">{{ selectedLeave.reason }}</el-descriptions-item>
          <el-descriptions-item label="审批人">{{ selectedLeave.approver || '待分配' }}</el-descriptions-item>
          <el-descriptions-item label="申请日期">{{ selectedLeave.applyDate || selectedLeave.startDate }}</el-descriptions-item>
          <el-descriptions-item label="审批意见" :span="2">{{ selectedLeave.approvalComment || '暂无' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
        <el-button
          v-if="selectedLeave && selectedLeave.status === 'pending'"
          type="success"
          @click="handleApprove(selectedLeave)"
        >
          批准
        </el-button>
        <el-button
          v-if="selectedLeave && selectedLeave.status === 'pending'"
          type="danger"
          @click="handleReject(selectedLeave)"
        >
          驳回
        </el-button>
      </template>
    </el-dialog>

    <!-- 审批对话框 -->
    <el-dialog
      v-model="showApprovalDialog"
      :title="approvalAction === 'approve' ? '✅ 批准请假' : '❌ 驳回请假'"
      width="420px"
    >
      <div class="approval-content">
        <p>
          确认{{ approvalAction === 'approve' ? '批准' : '驳回' }}
          <strong>{{ selectedLeave?.name }}</strong> 的请假申请？
        </p>
        <el-form v-if="approvalAction === 'reject'" style="margin-top: 12px;">
          <el-form-item label="驳回原因">
            <el-input
              v-model="rejectReason"
              type="textarea"
              :rows="2"
              placeholder="请输入驳回原因（可选）"
            />
          </el-form-item>
        </el-form>
        <el-form v-else style="margin-top: 12px;">
          <el-form-item label="审批备注">
            <el-input
              v-model="approvalComment"
              type="textarea"
              :rows="2"
              placeholder="请输入审批备注（可选）"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="showApprovalDialog = false">取消</el-button>
        <el-button
          :type="approvalAction === 'approve' ? 'success' : 'danger'"
          @click="confirmApproval"
        >
          {{ approvalAction === 'approve' ? '确认批准' : '确认驳回' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import {
  Plus, Download, Refresh, Search, View, Check, Close,
  CircleClose, TrendCharts, PieChart, Upload, Calendar,
  Clock, User, Document, Warning, Setting, Delete,
  Edit, ArrowLeft, ArrowRight, DataLine, Tickets,
  Files, Promotion, Grid, Money, OfficeBuilding
} from '@element-plus/icons-vue'

// ==================== 状态变量 ====================
const loading = ref(false)
const refreshing = ref(false)
const creating = ref(false)
const showCreateDialog = ref(false)
const showDetailDialog = ref(false)
const showApprovalDialog = ref(false)
const approvalAction = ref<'approve' | 'reject'>('approve')
const rejectReason = ref('')
const approvalComment = ref('')
const selectedLeave = ref<any>(null)
const trendPeriod = ref('month')
const createFormRef = ref<FormInstance>()

// ==================== 搜索表单 ====================
const searchForm = reactive({
  name: '',
  type: '',
  status: '',
  dateRange: [] as string[]
})

// ==================== 分页 ====================
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// ==================== 创建表单 ====================
const createForm = reactive({
  name: '',
  type: '',
  startDate: '',
  endDate: '',
  days: 1,
  reason: '',
  approver: '',
  attachments: [] as File[]
})

// ==================== 创建表单验证规则 ====================
const createRules: FormRules = {
  name: [{ required: true, message: '请选择员工', trigger: 'change' }],
  type: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  days: [
    { required: true, message: '请输入请假天数', trigger: 'blur' },
    { type: 'number', min: 0.5, message: '请假天数至少为0.5天', trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请输入请假原因', trigger: 'blur' },
    { min: 2, max: 500, message: '原因长度应在2-500字符之间', trigger: 'blur' }
  ],
  approver: [{ required: true, message: '请选择审批人', trigger: 'change' }]
}

// ==================== 统计数据 ====================
const leaveStats = ref([
  { label: '待审批', value: '8', sub: '需尽快处理', type: 'warning' },
  { label: '已批准', value: '24', sub: '本月批准数', type: 'success' },
  { label: '已驳回', value: '6', sub: '驳回率 8.2%', type: 'danger' },
  { label: '总请假天数', value: '186', sub: '本月合计', type: 'primary' }
])

// ==================== 表格数据 ====================
const tableData = ref([
  {
    id: 'LV-2026-001',
    name: 'Ahmed Al-Fahd',
    department: '销售部',
    type: '年假',
    startDate: '2026-07-25',
    endDate: '2026-07-27',
    days: 3,
    reason: '家庭旅行',
    status: 'pending',
    approver: 'Mohammed Al-Qahtani',
    applyDate: '2026-07-20'
  },
  {
    id: 'LV-2026-002',
    name: 'Mohammed Al-Qahtani',
    department: '采购部',
    type: '病假',
    startDate: '2026-07-22',
    endDate: '2026-07-23',
    days: 2,
    reason: '感冒发烧，需休息',
    status: 'approved',
    approver: 'Saud Al-Otaibi',
    applyDate: '2026-07-21',
    approvalComment: '已批准，注意休息'
  },
  {
    id: 'LV-2026-003',
    name: 'Saud Al-Otaibi',
    department: '财务部',
    type: '事假',
    startDate: '2026-07-18',
    endDate: '2026-07-18',
    days: 1,
    reason: '私人事务处理',
    status: 'rejected',
    approver: 'Faisal Al-Dossary',
    applyDate: '2026-07-17',
    approvalComment: '近期工作繁忙，建议改期'
  },
  {
    id: 'LV-2026-004',
    name: 'Faisal Al-Dossary',
    department: '运营部',
    type: '婚假',
    startDate: '2026-07-28',
    endDate: '2026-08-01',
    days: 5,
    reason: '婚礼',
    status: 'pending',
    approver: 'Ahmed Al-Fahd',
    applyDate: '2026-07-15'
  },
  {
    id: 'LV-2026-005',
    name: 'Nasser Al-Harbi',
    department: '技术部',
    type: '年假',
    startDate: '2026-07-15',
    endDate: '2026-07-19',
    days: 5,
    reason: '年度休假',
    status: 'completed',
    approver: 'Ahmed Al-Fahd',
    applyDate: '2026-07-10',
    approvalComment: '已批准'
  },
  {
    id: 'LV-2026-006',
    name: 'Abdullah Al-Shammari',
    department: '销售部',
    type: '公假',
    startDate: '2026-07-30',
    endDate: '2026-07-30',
    days: 1,
    reason: '参加行业会议',
    status: 'pending',
    approver: 'Mohammed Al-Qahtani',
    applyDate: '2026-07-22'
  }
])

// ==================== 趋势数据 ====================
const trendData = ref([
  { label: '周一', count: 2, percent: 40 },
  { label: '周二', count: 3, percent: 60 },
  { label: '周三', count: 1, percent: 20 },
  { label: '周四', count: 4, percent: 80 },
  { label: '周五', count: 2, percent: 40 },
  { label: '周六', count: 0, percent: 0 },
  { label: '周日', count: 0, percent: 0 }
])

// ==================== 类型分布 ====================
const typeDistribution = ref([
  { type: '年假', count: 65, color: '#409EFF' },
  { type: '病假', count: 42, color: '#67C23A' },
  { type: '事假', count: 38, color: '#E6A23C' },
  { type: '婚假', count: 12, color: '#F56C6C' },
  { type: '产假', count: 18, color: '#8B5CF6' },
  { type: '其他', count: 11, color: '#909399' }
])

// ==================== 方法 ====================
// 获取请假类型颜色
const getLeaveTypeColor = (type: string) => {
  const map: Record<string, string> = {
    '年假': 'primary',
    '病假': 'success',
    '事假': 'warning',
    '婚假': 'danger',
    '产假': 'purple',
    '丧假': 'info',
    '公假': 'info'
  }
  return map[type] || 'info'
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger',
    'cancelled': 'info',
    'completed': 'success'
  }
  return map[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'pending': '待审批',
    'approved': '已批准',
    'rejected': '已驳回',
    'cancelled': '已取消',
    'completed': '已结束'
  }
  return map[status] || '未知'
}

// 计算请假天数
const calculateDays = () => {
  if (createForm.startDate && createForm.endDate) {
    const start = new Date(createForm.startDate)
    const end = new Date(createForm.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    createForm.days = diffDays
  }
}

// 获取饼图旋转角度
const getPieRotation = (index: number) => {
  const total = typeDistribution.value.reduce((sum, item) => sum + item.count, 0)
  let rotation = 0
  for (let i = 0; i < index; i++) {
    rotation += (typeDistribution.value[i].count / total) * 360
  }
  return rotation
}

// 搜索
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询完成')
  }, 500)
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.type = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

// 排序
const handleSortChange = ({ prop, order }: any) => {
  ElMessage.info(`排序: ${prop} ${order}`)
}

// 分页
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    ElMessage.success('数据已刷新')
  }, 600)
}

// 导出
const handleExport = () => {
  ElMessageBox.confirm('确认导出请假报表？', '导出确认', {
    confirmButtonText: '确认导出',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('报表导出成功')
  }).catch(() => {})
}

// 趋势切换
const handleTrendChange = (val: string) => {
  ElMessage.info(`切换到 ${val === 'week' ? '本周' : val === 'month' ? '本月' : '本季'} 趋势`)
}

// 文件上传
const handleFileChange = (file: any) => {
  createForm.attachments.push(file.raw)
  ElMessage.success(`已添加文件: ${file.name}`)
}

// 创建请假
const handleCreateLeave = () => {
  showCreateDialog.value = true
}

// 提交请假
const submitLeave = async () => {
  try {
    await createFormRef.value?.validate()
    creating.value = true
    await new Promise(resolve => setTimeout(resolve, 800))

    // 添加到表格
    const newLeave = {
      id: `LV-2026-${String(tableData.value.length + 1).padStart(3, '0')}`,
      name: createForm.name,
      department: '销售部',
      type: createForm.type,
      startDate: createForm.startDate,
      endDate: createForm.endDate,
      days: createForm.days,
      reason: createForm.reason,
      status: 'pending',
      approver: createForm.approver,
      applyDate: new Date().toISOString().slice(0, 10)
    }
    tableData.value.unshift(newLeave)

    ElMessage.success('请假申请已提交')
    showCreateDialog.value = false
    // 重置表单
    Object.assign(createForm, {
      name: '',
      type: '',
      startDate: '',
      endDate: '',
      days: 1,
      reason: '',
      approver: '',
      attachments: []
    })
  } catch (error) {
    ElMessage.error('请完善表单信息')
  } finally {
    creating.value = false
  }
}

// 查看详情
const handleView = (row: any) => {
  selectedLeave.value = row
  showDetailDialog.value = true
}

// 批准
const handleApprove = (row: any) => {
  selectedLeave.value = row
  approvalAction.value = 'approve'
  approvalComment.value = ''
  showApprovalDialog.value = true
}

// 驳回
const handleReject = (row: any) => {
  selectedLeave.value = row
  approvalAction.value = 'reject'
  rejectReason.value = ''
  showApprovalDialog.value = true
}

// 确认审批
const confirmApproval = () => {
  if (selectedLeave.value) {
    if (approvalAction.value === 'approve') {
      selectedLeave.value.status = 'approved'
      selectedLeave.value.approvalComment = approvalComment.value || '已批准'
      ElMessage.success(`已批准 ${selectedLeave.value.name} 的请假申请`)
    } else {
      selectedLeave.value.status = 'rejected'
      selectedLeave.value.approvalComment = rejectReason.value || '已驳回'
      ElMessage.warning(`已驳回 ${selectedLeave.value.name} 的请假申请`)
    }
    showApprovalDialog.value = false
    showDetailDialog.value = false
  }
}

// 取消请假
const handleCancel = (row: any) => {
  ElMessageBox.confirm(`确认取消 ${row.name} 的请假申请？`, '取消确认', {
    confirmButtonText: '确认取消',
    cancelButtonText: '返回',
    type: 'warning'
  }).then(() => {
    row.status = 'cancelled'
    ElMessage.success('已取消请假申请')
  }).catch(() => {})
}

// ==================== 生命周期 ====================
onMounted(() => {
  pagination.total = tableData.value.length
})
</script>

<style scoped>
/* ==================== 全局容器 ==================== */
.leave-management-page {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* ==================== 页面头部 ==================== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
}

.page-subtitle {
  margin: 2px 0 0 0;
  color: #909399;
  font-size: 13px;
}

.header-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ==================== 统计卡片 ==================== */
.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  border-radius: 12px;
  padding: 12px 8px;
}

.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.primary { border-left: 4px solid #409EFF; }

.stat-label {
  font-size: 13px;
  color: #909399;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
}

.stat-sub {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* ==================== 筛选卡片 ==================== */
.filter-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.filter-card :deep(.el-form-item) {
  margin-bottom: 0;
}

/* ==================== 表格卡片 ==================== */
.table-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.days-text {
  font-weight: 600;
  color: #409EFF;
}

.table-footer {
  padding-top: 16px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
  margin-top: 12px;
}

/* ==================== 图表卡片 ==================== */
.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  border-radius: 12px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.card-header span {
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ==================== 趋势图表 ==================== */
.chart-container {
  height: 220px;
  position: relative;
  padding: 10px 0;
}

.trend-chart {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #e8ecf1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.grid-label {
  font-size: 10px;
  color: #c0c4cc;
  padding-right: 8px;
  background: white;
  transform: translateY(-50%);
}

.chart-bars {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 4px;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
  gap: 4px;
}

.bar-wrapper {
  display: flex;
  align-items: flex-end;
  height: 90%;
  width: 100%;
  justify-content: center;
}

.bar {
  width: 30px;
  border-radius: 3px 3px 0 0;
  min-height: 4px;
  transition: all 0.5s ease;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.bar-leave {
  background: linear-gradient(180deg, #409EFF, #66b1ff);
}

.bar-value {
  font-size: 9px;
  color: white;
  padding-top: 2px;
  font-weight: 600;
}

.bar-label {
  font-size: 10px;
  color: #909399;
  text-align: center;
}

/* ==================== 饼图 ==================== */
.pie-chart-container {
  display: flex;
  align-items: center;
  gap: 40px;
  justify-content: center;
  padding: 20px 0;
}

.pie-chart {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: #f0f2f5;
  position: relative;
  overflow: hidden;
}

.pie-segment {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 50%, 100% 0, 100% 100%);
  transform-origin: center;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.legend-label {
  color: #303133;
  min-width: 40px;
}

.legend-value {
  color: #909399;
  margin-left: auto;
}

/* ==================== 创建对话框 ==================== */
.days-hint {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

/* ==================== 详情对话框 ==================== */
.detail-content {
  padding: 4px 0;
}

/* ==================== 审批对话框 ==================== */
.approval-content {
  padding: 8px 0;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .leave-management-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
  }

  .header-right .el-button {
    flex: 1;
    font-size: 12px;
    padding: 8px 12px;
  }

  .filter-card :deep(.el-form-item) {
    margin-bottom: 12px;
    width: 100%;
  }

  .filter-card :deep(.el-form-item .el-form-item__content) {
    width: 100%;
  }

  .filter-card :deep(.el-form-item .el-form-item__content .el-select) {
    width: 100% !important;
  }

  .filter-card :deep(.el-form-item .el-form-item__content .el-input) {
    width: 100% !important;
  }

  .filter-card :deep(.el-form-item .el-form-item__content .el-date-editor) {
    width: 100% !important;
  }

  .pie-chart-container {
    flex-direction: column;
    gap: 20px;
  }

  .chart-container {
    height: 180px;
  }

  .bar {
    width: 20px;
  }

  .stat-card .stat-value {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }

  .stat-card {
    padding: 8px 4px;
  }

  .stat-value {
    font-size: 18px !important;
  }

  .stat-label {
    font-size: 11px;
  }

  .stat-sub {
    font-size: 10px;
  }

  .table-card :deep(.el-table__body-wrapper) {
    overflow-x: auto;
  }

  .table-card :deep(.el-table .cell) {
    font-size: 12px;
  }

  .pie-chart {
    width: 100px;
    height: 100px;
  }

  .legend-item {
    font-size: 12px;
  }

  .card-header span {
    font-size: 13px;
  }

  .bar {
    width: 16px;
  }
}

/* ==================== 打印样式 ==================== */
@media print {
  .leave-management-page {
    background: white;
    padding: 16px;
  }

  .header-right,
  .filter-card .el-button,
  .table-card .el-button,
  .chart-card {
    display: none !important;
  }

  .stat-card {
    border: 1px solid #dcdfe6 !important;
  }

  .table-card {
    box-shadow: none !important;
    border: 1px solid #dcdfe6;
  }
}
</style>