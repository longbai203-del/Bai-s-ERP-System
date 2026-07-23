<template>
  <div class="coupon-management-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1>
          <el-icon :size="28" color="#8B5CF6"><Tickets /></el-icon>
          优惠券管理
        </h1>
        <span class="subtitle">创建、发放和管理优惠券</span>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon> 创建优惠券
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
              <el-icon><Tickets /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">优惠券总数</div>
              <div class="stat-value">{{ stats.total }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('active')">
          <div class="stat-content">
            <div class="stat-icon active">
              <el-icon><SuccessFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">有效</div>
              <div class="stat-value">{{ stats.active }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('expired')">
          <div class="stat-content">
            <div class="stat-icon expired">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已过期</div>
              <div class="stat-value">{{ stats.expired }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('paused')">
          <div class="stat-content">
            <div class="stat-icon paused">
              <el-icon><Pause /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已暂停</div>
              <div class="stat-value">{{ stats.paused }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索筛选 -->
    <el-card class="filter-card" shadow="hover">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="优惠券名称">
          <el-input v-model="filterForm.name" placeholder="输入优惠券名称" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="优惠码">
          <el-input v-model="filterForm.code" placeholder="输入优惠码" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="有效" value="active" />
            <el-option label="已过期" value="expired" />
            <el-option label="已暂停" value="paused" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filterForm.type" placeholder="全部类型" clearable style="width: 120px">
            <el-option label="折扣" value="discount" />
            <el-option label="满减" value="fixed" />
            <el-option label="赠品" value="gift" />
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
          <span>优惠券列表</span>
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
        <el-table-column prop="name" label="优惠券名称" min-width="150" />
        <el-table-column prop="code" label="优惠码" width="140" />
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 'discount' ? 'success' : row.type === 'fixed' ? 'warning' : 'primary'" size="small">
              {{ row.type === 'discount' ? '折扣' : row.type === 'fixed' ? '满减' : '赠品' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="优惠值" width="100" align="center">
          <template #default="{ row }">
            {{ row.type === 'discount' ? row.value + '%' : '¥' + formatNumber(row.value) }}
          </template>
        </el-table-column>
        <el-table-column prop="usage" label="已用/总量" width="120" align="center">
          <template #default="{ row }">
            <span>{{ row.usedCount }} / {{ row.totalCount }}</span>
            <el-progress
              :percentage="row.totalCount > 0 ? Math.round((row.usedCount / row.totalCount) * 100) : 0"
              :color="row.usedCount / row.totalCount > 0.8 ? '#f56c6c' : '#409eff'"
              :show-text="false"
              style="width: 80px; display: inline-block; margin-left: 4px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="validFrom" label="生效日期" width="120" />
        <el-table-column prop="validTo" label="过期日期" width="120" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'expired' ? 'danger' : 'info'" size="small">
              {{ row.status === 'active' ? '有效' : row.status === 'expired' ? '已过期' : '已暂停' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button size="small" type="success" link @click="handleDistribute(row)">
              <el-icon><Share /></el-icon> 发放
            </el-button>
            <el-button
              v-if="row.status === 'active'"
              size="small"
              type="warning"
              link
              @click="handleToggleStatus(row, 'paused')"
            >
              <el-icon><Pause /></el-icon> 暂停
            </el-button>
            <el-button
              v-if="row.status === 'paused'"
              size="small"
              type="success"
              link
              @click="handleToggleStatus(row, 'active')"
            >
              <el-icon><Play /></el-icon> 启用
            </el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">
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

    <!-- 创建/编辑优惠券对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogFormRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="优惠券名称" prop="name">
              <el-input v-model="dialogForm.name" placeholder="请输入优惠券名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠码" prop="code">
              <el-input v-model="dialogForm.code" placeholder="请输入优惠码">
                <template #append>
                  <el-button @click="generateCode">生成</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠类型" prop="type">
              <el-select v-model="dialogForm.type" placeholder="请选择优惠类型" style="width: 100%">
                <el-option label="折扣" value="discount" />
                <el-option label="满减" value="fixed" />
                <el-option label="赠品" value="gift" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠值" prop="value">
              <el-input-number
                v-model="dialogForm.value"
                :min="0.01"
                :precision="dialogForm.type === 'discount' ? 0 : 2"
                :max="dialogForm.type === 'discount' ? 100 : 999999.99"
                controls-position="right"
                style="width: 100%"
              />
              <span style="margin-left: 8px; color: #909399; font-size: 13px;">
                {{ dialogForm.type === 'discount' ? '%' : '元' }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发放总量" prop="totalCount">
              <el-input-number
                v-model="dialogForm.totalCount"
                :min="1"
                :max="99999"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每人限领" prop="limitPerUser">
              <el-input-number
                v-model="dialogForm.limitPerUser"
                :min="1"
                :max="99"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效日期" prop="validFrom">
              <el-date-picker
                v-model="dialogForm.validFrom"
                type="date"
                placeholder="选择生效日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期日期" prop="validTo">
              <el-date-picker
                v-model="dialogForm.validTo"
                type="date"
                placeholder="选择过期日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="使用条件" prop="condition">
              <el-input
                v-model="dialogForm.condition"
                placeholder="如：满100元可用"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="适用商品">
              <el-select
                v-model="dialogForm.applicableProducts"
                multiple
                placeholder="全部商品（留空表示全部）"
                style="width: 100%"
                filterable
              >
                <el-option label="标准洗车" value="标准洗车" />
                <el-option label="精致洗车" value="精致洗车" />
                <el-option label="全车镀晶" value="全车镀晶" />
                <el-option label="内饰清洁" value="内饰清洁" />
                <el-option label="机油更换" value="机油更换" />
                <el-option label="轮胎护理" value="轮胎护理" />
                <el-option label="VIP洗车卡" value="VIP洗车卡" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="dialogForm.remark"
                type="textarea"
                :rows="2"
                placeholder="请输入备注信息"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="confirmDialogSubmit">
          {{ dialogTitle === '创建优惠券' ? '创建' : '更新' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 发放优惠券对话框 -->
    <el-dialog
      v-model="distributeDialogVisible"
      title="发放优惠券"
      width="450px"
      :close-on-click-modal="false"
    >
      <div class="distribute-content">
        <div class="distribute-info">
          <p>优惠券：<strong>{{ distributeTarget?.name }}</strong></p>
          <p>优惠码：<strong>{{ distributeTarget?.code }}</strong></p>
          <p>剩余数量：<strong>{{ distributeTarget ? distributeTarget.totalCount - distributeTarget.usedCount : 0 }}</strong></p>
        </div>
        <el-form :model="distributeForm" label-width="100px">
          <el-form-item label="发放数量">
            <el-input-number
              v-model="distributeForm.count"
              :min="1"
              :max="distributeTarget ? distributeTarget.totalCount - distributeTarget.usedCount : 0"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="发放方式">
            <el-radio-group v-model="distributeForm.method">
              <el-radio label="all">全部用户</el-radio>
              <el-radio label="vip">VIP用户</el-radio>
              <el-radio label="new">新用户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="通知用户">
            <el-switch v-model="distributeForm.notify" />
            <span style="margin-left: 8px; color: #909399; font-size: 13px;">发送通知</span>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="distributeDialogVisible = false">取消</el-button>
        <el-button type="success" :loading="distributeLoading" @click="confirmDistribute">
          确认发放
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Tickets,
  Plus,
  Download,
  RefreshRight,
  SuccessFilled,
  Clock,
  Pause,
  Play,
  Search,
  Refresh,
  Edit,
  Share,
  Delete,
  Warning
} from '@element-plus/icons-vue'

// ========== 响应式数据 ==========
const loading = ref(false)
const dialogLoading = ref(false)
const distributeLoading = ref(false)
const dialogVisible = ref(false)
const distributeDialogVisible = ref(false)
const dialogFormRef = ref<FormInstance>()
const dialogTitle = ref('创建优惠券')
const distributeTarget = ref<any>(null)

// 统计数据
const stats = reactive({
  total: 0,
  active: 0,
  expired: 0,
  paused: 0
})

// 筛选表单
const filterForm = reactive({
  name: '',
  code: '',
  status: '',
  type: ''
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
  id: 0,
  name: '',
  code: '',
  type: 'discount',
  value: 0,
  totalCount: 100,
  limitPerUser: 1,
  validFrom: '',
  validTo: '',
  condition: '',
  applicableProducts: [] as string[],
  remark: ''
})

// 发放表单
const distributeForm = reactive({
  count: 1,
  method: 'all',
  notify: true
})

// ========== 表单验证规则 ==========
const dialogRules: FormRules = {
  name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入优惠码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择优惠类型', trigger: 'change' }],
  value: [
    { required: true, message: '请输入优惠值', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '优惠值必须大于0', trigger: 'blur' }
  ],
  totalCount: [
    { required: true, message: '请输入发放总量', trigger: 'blur' },
    { type: 'number', min: 1, message: '总量必须大于0', trigger: 'blur' }
  ],
  validFrom: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
  validTo: [{ required: true, message: '请选择过期日期', trigger: 'change' }]
}

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    active: 'success',
    expired: 'danger',
    paused: 'info'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    active: '有效',
    expired: '已过期',
    paused: '已暂停'
  }
  return map[status] || status
}

// ========== 模拟数据生成 ==========
const generateMockData = () => {
  const names = ['新客专享折扣', '满200减30', '会员专享礼品', '双11特惠', '周年庆优惠', '推荐有礼', '生日专享']
  const codes = ['NEW20', 'SAVE30', 'GIFT', '1111', 'ANNIV', 'SHARE', 'BDAY']
  const types = ['discount', 'fixed', 'gift']
  const statuses = ['active', 'active', 'active', 'expired', 'active', 'paused']

  const data = []
  const now = new Date()
  const total = 25

  for (let i = 1; i <= total; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const fromDate = new Date(now)
    fromDate.setDate(fromDate.getDate() - Math.floor(Math.random() * 30))
    const toDate = new Date(fromDate)
    toDate.setDate(toDate.getDate() + Math.floor(Math.random() * 60 + 30))

    data.push({
      id: i,
      name: names[Math.floor(Math.random() * names.length)] + (i > 7 ? ` ${i}` : ''),
      code: codes[Math.floor(Math.random() * codes.length)] + (i > 7 ? i : ''),
      type: type,
      value: type === 'discount' ? Math.floor(Math.random() * 30 + 5) : Math.floor(Math.random() * 100 + 20),
      usedCount: Math.floor(Math.random() * 80),
      totalCount: 100,
      validFrom: fromDate.toISOString().split('T')[0],
      validTo: toDate.toISOString().split('T')[0],
      status: status,
      condition: Math.random() > 0.5 ? `满${Math.floor(Math.random() * 200 + 50)}元可用` : '无限制',
      applicableProducts: [],
      remark: ''
    })
  }

  return data
}

// ========== 计算统计数据 ==========
const calculateStats = (data: any[]) => {
  stats.total = data.length
  stats.active = data.filter(item => item.status === 'active').length
  stats.expired = data.filter(item => item.status === 'expired').length
  stats.paused = data.filter(item => item.status === 'paused').length
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

  if (filterForm.name) {
    data = data.filter(item => item.name.includes(filterForm.name))
  }
  if (filterForm.code) {
    data = data.filter(item => item.code.includes(filterForm.code))
  }
  if (filterForm.status) {
    data = data.filter(item => item.status === filterForm.status)
  }
  if (filterForm.type) {
    data = data.filter(item => item.type === filterForm.type)
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
  filterForm.name = ''
  filterForm.code = ''
  filterForm.status = ''
  filterForm.type = ''
  pagination.current = 1
  filterData()
}

const filterByStatus = (status: string) => {
  filterForm.status = status
  pagination.current = 1
  filterData()
}

const handleCreate = () => {
  dialogTitle.value = '创建优惠券'
  dialogForm.id = 0
  dialogForm.name = ''
  dialogForm.code = ''
  dialogForm.type = 'discount'
  dialogForm.value = 0
  dialogForm.totalCount = 100
  dialogForm.limitPerUser = 1
  dialogForm.validFrom = ''
  dialogForm.validTo = ''
  dialogForm.condition = ''
  dialogForm.applicableProducts = []
  dialogForm.remark = ''
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑优惠券'
  Object.assign(dialogForm, row)
  dialogVisible.value = true
}

const handleDistribute = (row: any) => {
  distributeTarget.value = row
  distributeForm.count = Math.min(10, row.totalCount - row.usedCount)
  distributeForm.method = 'all'
  distributeForm.notify = true
  distributeDialogVisible.value = true
}

const confirmDistribute = async () => {
  if (distributeForm.count <= 0) {
    ElMessage.warning('请输入有效的发放数量')
    return
  }
  if (!distributeTarget.value) return

  distributeLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const target = allData.value.find(d => d.id === distributeTarget.value.id)
    if (target) {
      target.usedCount += distributeForm.count
      ElMessage.success(`成功发放 ${distributeForm.count} 张优惠券`)
      if (distributeForm.notify) {
        ElMessage.info('已发送通知给用户')
      }
    }
    distributeDialogVisible.value = false
    calculateStats(allData.value)
    filterData()
  } finally {
    distributeLoading.value = false
  }
}

const handleToggleStatus = (row: any, status: string) => {
  const action = status === 'active' ? '启用' : '暂停'
  ElMessageBox.confirm(`确定要${action}优惠券 ${row.name} 吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const item = allData.value.find(d => d.id === row.id)
    if (item) {
      item.status = status
      calculateStats(allData.value)
      filterData()
      ElMessage.success(`已${action}优惠券`)
    }
  }).catch(() => {})
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除优惠券 ${row.name} 吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    allData.value = allData.value.filter(d => d.id !== row.id)
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

    if (dialogForm.id === 0) {
      // 创建
      const newItem = {
        ...dialogForm,
        id: allData.value.length + 1,
        usedCount: 0,
        status: 'active'
      }
      allData.value.unshift(newItem)
      ElMessage.success('优惠券创建成功')
    } else {
      // 更新
      const item = allData.value.find(d => d.id === dialogForm.id)
      if (item) {
        Object.assign(item, dialogForm)
        ElMessage.success('优惠券更新成功')
      }
    }

    calculateStats(allData.value)
    filterData()
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
  }
}

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  dialogForm.code = code
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
.coupon-management-page {
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
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}
.stat-icon.active {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}
.stat-icon.expired {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}
.stat-icon.paused {
  background: linear-gradient(135deg, #e6a23c, #f0c78a);
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

.distribute-content {
  padding: 8px 0;
}

.distribute-info {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.distribute-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #606266;
}

@media (max-width: 768px) {
  .coupon-management-page {
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