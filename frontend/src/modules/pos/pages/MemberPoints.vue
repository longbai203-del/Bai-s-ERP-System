<template>
  <div class="member-points-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1>
          <el-icon :size="28" color="#F59E0B"><Star /></el-icon>
          会员积分管理
        </h1>
        <span class="subtitle">会员积分查询、调整与兑换管理</span>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon> 新增会员
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
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">会员总数</div>
              <div class="stat-value">{{ stats.total }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon points">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">总积分</div>
              <div class="stat-value">{{ formatNumber(stats.totalPoints) }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon pending">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">待兑换积分</div>
              <div class="stat-value">{{ formatNumber(stats.pendingPoints) }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon expiring">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">即将过期积分</div>
            <div class="stat-value" style="color: #f56c6c;">{{ formatNumber(stats.expiringPoints) }}</div>
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
          <el-input v-model="filterForm.name" placeholder="输入姓名" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="filterForm.level" placeholder="全部等级" clearable style="width: 120px">
            <el-option label="青铜" value="bronze" />
            <el-option label="白银" value="silver" />
            <el-option label="黄金" value="gold" />
            <el-option label="钻石" value="diamond" />
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
          <span>会员列表</span>
          <span class="total-info">共 {{ pagination.total }} 位会员</span>
        </div>
      </template>

      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        stripe
        border
      >
        <el-table-column prop="cardNo" label="会员卡号" width="140" />
        <el-table-column prop="name" label="姓名" min-width="100" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="level" label="会员等级" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelTag(row.level)" size="small">
              {{ getLevelLabel(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="120" align="center">
          <template #default="{ row }">
            <span style="font-weight: 700; color: #409eff; font-size: 16px;">
              {{ formatNumber(row.points) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="accumulatedAmount" label="累计消费" width="140" align="right">
          <template #default="{ row }">
            ¥{{ formatNumber(row.accumulatedAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="expiringPoints" label="即将过期" width="120" align="center">
          <template #default="{ row }">
            <span :style="{ color: row.expiringPoints > 0 ? '#e6a23c' : '#909399' }">
              {{ row.expiringPoints > 0 ? formatNumber(row.expiringPoints) : '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="registerDate" label="注册日期" width="120" />
        <el-table-column label="操作" width="240" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleView(row)">
              <el-icon><View /></el-icon> 查看
            </el-button>
            <el-button size="small" type="warning" link @click="handleAdjustPoints(row)">
              <el-icon><Edit /></el-icon> 调整
            </el-button>
            <el-button size="small" type="success" link @click="handleRedeem(row)">
              <el-icon><Gift /></el-icon> 兑换
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

    <!-- 积分调整对话框 -->
    <el-dialog
      v-model="adjustDialogVisible"
      title="积分调整"
      width="480px"
      :close-on-click-modal="false"
    >
      <div class="adjust-info">
        <div class="adjust-user">
          <span>会员：<strong>{{ adjustTarget?.name }}</strong></span>
          <span>卡号：{{ adjustTarget?.cardNo }}</span>
          <span>当前积分：<strong style="color: #409eff; font-size: 18px;">{{ formatNumber(adjustTarget?.points || 0) }}</strong></span>
        </div>
      </div>

      <el-form :model="adjustForm" :rules="adjustRules" ref="adjustFormRef" label-width="100px">
        <el-form-item label="调整类型" prop="type">
          <el-radio-group v-model="adjustForm.type" size="large">
            <el-radio-button label="add">
              <span style="color: #67c23a;">＋ 增加</span>
            </el-radio-button>
            <el-radio-button label="subtract">
              <span style="color: #f56c6c;">－ 扣减</span>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整数量" prop="amount">
          <el-input-number
            v-model="adjustForm.amount"
            :min="1"
            :max="99999"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="调整原因" prop="reason">
          <el-input
            v-model="adjustForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入调整原因"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="通知会员">
          <el-switch v-model="adjustForm.notify" />
          <span style="margin-left: 8px; color: #909399; font-size: 13px;">发送通知短信</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adjustDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="adjustLoading" @click="confirmAdjust">
          确认调整
        </el-button>
      </template>
    </el-dialog>

    <!-- 积分兑换对话框 -->
    <el-dialog
      v-model="redeemDialogVisible"
      title="积分兑换"
      width="480px"
      :close-on-click-modal="false"
    >
      <div class="redeem-info">
        <div class="redeem-user">
          <span>会员：<strong>{{ redeemTarget?.name }}</strong></span>
          <span>卡号：{{ redeemTarget?.cardNo }}</span>
          <span>可用积分：<strong style="color: #409eff; font-size: 18px;">{{ formatNumber(redeemTarget?.points || 0) }}</strong></span>
        </div>
      </div>

      <el-form :model="redeemForm" :rules="redeemRules" ref="redeemFormRef" label-width="100px">
        <el-form-item label="兑换商品" prop="product">
          <el-select v-model="redeemForm.product" placeholder="请选择兑换商品" style="width: 100%">
            <el-option label="洗车券 × 2" value="洗车券 × 2">
              <span>洗车券 × 2</span>
              <span style="float: right; color: #e6a23c; font-size: 13px;">500 积分</span>
            </el-option>
            <el-option label="内饰清洁券" value="内饰清洁券">
              <span>内饰清洁券</span>
              <span style="float: right; color: #e6a23c; font-size: 13px;">800 积分</span>
            </el-option>
            <el-option label="全车镀晶券" value="全车镀晶券">
              <span>全车镀晶券</span>
              <span style="float: right; color: #e6a23c; font-size: 13px;">2000 积分</span>
            </el-option>
            <el-option label="VIP会员月卡" value="VIP会员月卡">
              <span>VIP会员月卡</span>
              <span style="float: right; color: #e6a23c; font-size: 13px;">1500 积分</span>
            </el-option>
            <el-option label="轮胎护理券" value="轮胎护理券">
              <span>轮胎护理券</span>
              <span style="float: right; color: #e6a23c; font-size: 13px;">600 积分</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兑换数量" prop="quantity">
          <el-input-number
            v-model="redeemForm.quantity"
            :min="1"
            :max="10"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="所需积分">
          <span style="font-size: 20px; font-weight: 700; color: #e6a23c;">
            {{ calculateRequiredPoints() }}
          </span>
          <span style="margin-left: 8px; color: #909399; font-size: 13px;">积分</span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="redeemForm.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="redeemDialogVisible = false">取消</el-button>
        <el-button type="success" :loading="redeemLoading" @click="confirmRedeem">
          确认兑换
        </el-button>
      </template>
    </el-dialog>

    <!-- 查看会员详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="会员详情"
      width="550px"
    >
      <div v-if="viewTarget" class="member-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="会员卡号">
            {{ viewTarget.cardNo }}
          </el-descriptions-item>
          <el-descriptions-item label="姓名">
            <strong>{{ viewTarget.name }}</strong>
          </el-descriptions-item>
          <el-descriptions-item label="电话">
            {{ viewTarget.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="会员等级">
            <el-tag :type="getLevelTag(viewTarget.level)">
              {{ getLevelLabel(viewTarget.level) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="当前积分">
            <span style="font-weight: 700; color: #409eff; font-size: 20px;">
              {{ formatNumber(viewTarget.points) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="累计消费">
            ¥{{ formatNumber(viewTarget.accumulatedAmount) }}
          </el-descriptions-item>
          <el-descriptions-item label="注册日期">
            {{ viewTarget.registerDate }}
          </el-descriptions-item>
          <el-descriptions-item label="即将过期积分">
            <span :style="{ color: viewTarget.expiringPoints > 0 ? '#e6a23c' : '#909399' }">
              {{ viewTarget.expiringPoints > 0 ? formatNumber(viewTarget.expiringPoints) : '无' }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="兑换记录" :span="2">
            <el-tag v-for="(item, idx) in viewTarget.redeemHistory || []" :key="idx" size="small" style="margin: 2px;">
              {{ item }}
            </el-tag>
            <span v-if="!viewTarget.redeemHistory || viewTarget.redeemHistory.length === 0" style="color: #909399;">
              暂无兑换记录
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Star,
  User,
  Clock,
  Warning,
  Search,
  Refresh,
  Plus,
  Download,
  RefreshRight,
  View,
  Edit,
  Gift,
  SuccessFilled,
  CircleClose
} from '@element-plus/icons-vue'

// ========== 响应式数据 ==========
const loading = ref(false)
const adjustLoading = ref(false)
const redeemLoading = ref(false)
const adjustDialogVisible = ref(false)
const redeemDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const adjustFormRef = ref<FormInstance>()
const redeemFormRef = ref<FormInstance>()
const adjustTarget = ref<any>(null)
const redeemTarget = ref<any>(null)
const viewTarget = ref<any>(null)

// 统计数据
const stats = reactive({
  total: 0,
  totalPoints: 0,
  pendingPoints: 0,
  expiringPoints: 0
})

// 筛选表单
const filterForm = reactive({
  cardNo: '',
  name: '',
  level: ''
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

// 调整表单
const adjustForm = reactive({
  type: 'add' as 'add' | 'subtract',
  amount: 0,
  reason: '',
  notify: true
})

// 兑换表单
const redeemForm = reactive({
  product: '',
  quantity: 1,
  remark: ''
})

// ========== 表单验证规则 ==========
const adjustRules: FormRules = {
  amount: [
    { required: true, message: '请输入调整数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
  ],
  reason: [{ required: true, message: '请输入调整原因', trigger: 'blur' }]
}

const redeemRules: FormRules = {
  product: [{ required: true, message: '请选择兑换商品', trigger: 'change' }],
  quantity: [
    { required: true, message: '请输入兑换数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
  ]
}

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const getLevelTag = (level: string) => {
  const map: Record<string, string> = {
    diamond: 'danger',
    gold: 'warning',
    silver: 'primary',
    bronze: 'info'
  }
  return map[level] || 'info'
}

const getLevelLabel = (level: string) => {
  const map: Record<string, string> = {
    diamond: '钻石',
    gold: '黄金',
    silver: '白银',
    bronze: '青铜'
  }
  return map[level] || level
}

const getProductPoints = (product: string) => {
  const map: Record<string, number> = {
    '洗车券 × 2': 500,
    '内饰清洁券': 800,
    '全车镀晶券': 2000,
    'VIP会员月卡': 1500,
    '轮胎护理券': 600
  }
  return map[product] || 0
}

const calculateRequiredPoints = () => {
  const points = getProductPoints(redeemForm.product)
  return points * redeemForm.quantity
}

// ========== 模拟数据生成 ==========
const generateMockData = () => {
  const names = ['Abdullah Al-Fahd', 'Nasser Al-Harbi', 'Sultan Al-Mutairi', 'Khalid Al-Ghamdi', 'Faisal Al-Dossary']
  const levels = ['diamond', 'gold', 'silver', 'bronze']
  const phonePrefix = ['+966 50', '+966 55', '+966 56']

  const data = []
  const now = new Date()
  const total = 35

  for (let i = 1; i <= total; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)]
    const points = Math.floor(Math.random() * 50000 + 1000)
    const expiringPoints = Math.floor(Math.random() * 2000)

    const date = new Date(now)
    date.setDate(date.getDate() - Math.floor(Math.random() * 365))

    data.push({
      id: i,
      cardNo: `M-${String(i).padStart(6, '0')}`,
      name: names[Math.floor(Math.random() * names.length)],
      phone: `${phonePrefix[Math.floor(Math.random() * phonePrefix.length)]} ${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
      level: level,
      points: points,
      accumulatedAmount: Math.round((Math.random() * 100000 + 5000) * 100) / 100,
      expiringPoints: expiringPoints > 500 ? expiringPoints : 0,
      registerDate: date.toISOString().split('T')[0],
      redeemHistory: Math.random() > 0.6 ? ['洗车券 × 2', '内饰清洁券'].slice(0, Math.floor(Math.random() * 2) + 1) : []
    })
  }

  return data
}

// ========== 计算统计数据 ==========
const calculateStats = (data: any[]) => {
  stats.total = data.length
  stats.totalPoints = data.reduce((sum, item) => sum + item.points, 0)
  stats.pendingPoints = Math.floor(stats.totalPoints * 0.3)
  stats.expiringPoints = data.reduce((sum, item) => sum + item.expiringPoints, 0)
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
    data = data.filter(item => item.name.includes(filterForm.name))
  }
  if (filterForm.level) {
    data = data.filter(item => item.level === filterForm.level)
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
  filterForm.level = ''
  pagination.current = 1
  filterData()
}

const handleCreate = () => {
  ElMessage.info('新增会员功能开发中')
}

const handleView = (row: any) => {
  viewTarget.value = row
  viewDialogVisible.value = true
}

const handleAdjustPoints = (row: any) => {
  adjustTarget.value = row
  adjustForm.type = 'add'
  adjustForm.amount = 0
  adjustForm.reason = ''
  adjustForm.notify = true
  adjustDialogVisible.value = true
}

const confirmAdjust = async () => {
  if (!adjustFormRef.value) return
  try {
    await adjustFormRef.value.validate()
  } catch {
    return
  }

  adjustLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    const target = allData.value.find(d => d.id === adjustTarget.value.id)
    if (target) {
      if (adjustForm.type === 'add') {
        target.points += adjustForm.amount
        ElMessage.success(`成功增加 ${adjustForm.amount} 积分`)
      } else {
        if (target.points < adjustForm.amount) {
          ElMessage.warning('积分不足，无法扣减')
          adjustLoading.value = false
          return
        }
        target.points -= adjustForm.amount
        ElMessage.warning(`成功扣减 ${adjustForm.amount} 积分`)
      }
      if (adjustForm.notify) {
        ElMessage.info('已发送通知给会员')
      }
    }
    calculateStats(allData.value)
    filterData()
    adjustDialogVisible.value = false
  } finally {
    adjustLoading.value = false
  }
}

const handleRedeem = (row: any) => {
  redeemTarget.value = row
  redeemForm.product = ''
  redeemForm.quantity = 1
  redeemForm.remark = ''
  redeemDialogVisible.value = true
}

const confirmRedeem = async () => {
  if (!redeemFormRef.value) return
  try {
    await redeemFormRef.value.validate()
  } catch {
    return
  }

  const requiredPoints = calculateRequiredPoints()
  if (!redeemTarget.value || redeemTarget.value.points < requiredPoints) {
    ElMessage.warning('积分不足，无法兑换')
    return
  }

  redeemLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const target = allData.value.find(d => d.id === redeemTarget.value.id)
    if (target) {
      target.points -= requiredPoints
      if (!target.redeemHistory) target.redeemHistory = []
      target.redeemHistory.push(`${redeemForm.product} × ${redeemForm.quantity}`)
      ElMessage.success(`成功兑换 ${redeemForm.product} × ${redeemForm.quantity}`)
    }
    calculateStats(allData.value)
    filterData()
    redeemDialogVisible.value = false
  } finally {
    redeemLoading.value = false
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
.member-points-page {
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
.stat-icon.points {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}
.stat-icon.pending {
  background: linear-gradient(135deg, #e6a23c, #f0c78a);
}
.stat-icon.expiring {
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

.adjust-info,
.redeem-info {
  margin-bottom: 16px;
}

.adjust-user,
.redeem-user {
  display: flex;
  gap: 20px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.member-detail {
  padding: 8px 0;
}

@media (max-width: 768px) {
  .member-points-page {
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

  .adjust-user,
  .redeem-user {
    flex-direction: column;
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