<template>
  <div class="pos-list-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1>
          <el-icon :size="28" color="#4F46E5"><Grid /></el-icon>
          POS 设备管理
        </h1>
        <span class="subtitle">管理所有POS终端设备</span>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon> 新增设备
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
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">设备总数</div>
              <div class="stat-value">{{ stats.total }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('online')">
          <div class="stat-content">
            <div class="stat-icon online">
              <el-icon><SuccessFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">在线</div>
              <div class="stat-value">{{ stats.online }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('offline')">
          <div class="stat-content">
            <div class="stat-icon offline">
              <el-icon><CircleClose /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">离线</div>
              <div class="stat-value">{{ stats.offline }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover" @click="filterByStatus('maintenance')">
          <div class="stat-content">
            <div class="stat-icon maintenance">
              <el-icon><Tools /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">维护中</div>
              <div class="stat-value">{{ stats.maintenance }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索筛选 -->
    <el-card class="filter-card" shadow="hover">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="设备名称">
          <el-input v-model="filterForm.name" placeholder="输入设备名称" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="filterForm.code" placeholder="输入设备编号" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
            <el-option label="维护中" value="maintenance" />
          </el-select>
        </el-form-item>
        <el-form-item label="门店">
          <el-select v-model="filterForm.store" placeholder="全部门店" clearable style="width: 140px">
            <el-option label="全部" value="all" />
            <el-option label="旗舰店" value="flagship" />
            <el-option label="分店一" value="branch1" />
            <el-option label="分店二" value="branch2" />
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
          <span>设备列表</span>
          <span class="total-info">共 {{ pagination.total }} 台设备</span>
        </div>
      </template>

      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        stripe
        border
      >
        <el-table-column prop="code" label="设备编号" width="140" />
        <el-table-column prop="name" label="设备名称" min-width="140" />
        <el-table-column prop="store" label="所属门店" width="120">
          <template #default="{ row }">
            {{ getStoreLabel(row.store) }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" width="120" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastActive" label="最后活跃" width="160" sortable />
        <el-table-column prop="cashier" label="当前收银员" width="120" />
        <el-table-column label="操作" width="240" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleView(row)">
              <el-icon><View /></el-icon> 查看
            </el-button>
            <el-button size="small" type="warning" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button
              v-if="row.status === 'offline'"
              size="small"
              type="success"
              link
              @click="handleActivate(row)"
            >
              <el-icon><Play /></el-icon> 激活
            </el-button>
            <el-button
              v-if="row.status === 'online'"
              size="small"
              type="warning"
              link
              @click="handleMaintenance(row)"
            >
              <el-icon><Tools /></el-icon> 维护
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

    <!-- 创建/编辑设备对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="550px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogFormRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="dialogForm.name" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号" prop="code">
              <el-input v-model="dialogForm.code" placeholder="请输入设备编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属门店" prop="store">
              <el-select v-model="dialogForm.store" placeholder="请选择门店" style="width: 100%">
                <el-option label="旗舰店" value="flagship" />
                <el-option label="分店一" value="branch1" />
                <el-option label="分店二" value="branch2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置" prop="location">
              <el-input v-model="dialogForm.location" placeholder="如：一楼收银台" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备型号" prop="model">
              <el-select v-model="dialogForm.model" placeholder="请选择型号" style="width: 100%">
                <el-option label="POS-2000" value="POS-2000" />
                <el-option label="POS-3000" value="POS-3000" />
                <el-option label="POS-5000" value="POS-5000" />
                <el-option label="POS-8000" value="POS-8000" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP地址" prop="ipAddress">
              <el-input v-model="dialogForm.ipAddress" placeholder="请输入IP地址" />
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
          {{ dialogTitle === '新增设备' ? '创建' : '更新' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 设备详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="设备详情"
      width="500px"
    >
      <div v-if="viewTarget" class="device-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="设备编号">
            {{ viewTarget.code }}
          </el-descriptions-item>
          <el-descriptions-item label="设备名称">
            <strong>{{ viewTarget.name }}</strong>
          </el-descriptions-item>
          <el-descriptions-item label="所属门店">
            {{ getStoreLabel(viewTarget.store) }}
          </el-descriptions-item>
          <el-descriptions-item label="位置">
            {{ viewTarget.location }}
          </el-descriptions-item>
          <el-descriptions-item label="设备型号">
            {{ viewTarget.model }}
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">
            {{ viewTarget.ipAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTag(viewTarget.status)">
              {{ getStatusLabel(viewTarget.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最后活跃">
            {{ viewTarget.lastActive }}
          </el-descriptions-item>
          <el-descriptions-item label="当前收银员">
            {{ viewTarget.cashier || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="今日订单">
            {{ viewTarget.todayOrders || 0 }} 笔
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ viewTarget.remark || '无' }}
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
  Grid,
  Plus,
  Download,
  RefreshRight,
  Monitor,
  SuccessFilled,
  CircleClose,
  Tools,
  Search,
  Refresh,
  View,
  Edit,
  Play,
  Delete,
  Warning
} from '@element-plus/icons-vue'

// ========== 响应式数据 ==========
const loading = ref(false)
const dialogLoading = ref(false)
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogFormRef = ref<FormInstance>()
const dialogTitle = ref('新增设备')
const viewTarget = ref<any>(null)

// 统计数据
const stats = reactive({
  total: 0,
  online: 0,
  offline: 0,
  maintenance: 0
})

// 筛选表单
const filterForm = reactive({
  name: '',
  code: '',
  status: '',
  store: 'all'
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
  store: 'flagship',
  location: '',
  model: 'POS-2000',
  ipAddress: '',
  remark: ''
})

// ========== 表单验证规则 ==========
const dialogRules: FormRules = {
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
  store: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  location: [{ required: true, message: '请输入位置', trigger: 'blur' }],
  ipAddress: [
    { required: true, message: '请输入IP地址', trigger: 'blur' },
    { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: '请输入正确的IP地址', trigger: 'blur' }
  ]
}

// ========== 计算属性 ==========
const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    online: 'success',
    offline: 'danger',
    maintenance: 'warning'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    online: '在线',
    offline: '离线',
    maintenance: '维护中'
  }
  return map[status] || status
}

const getStoreLabel = (store: string) => {
  const map: Record<string, string> = {
    flagship: '旗舰店',
    branch1: '分店一',
    branch2: '分店二'
  }
  return map[store] || store
}

// ========== 模拟数据生成 ==========
const generateMockData = () => {
  const names = ['前台收银', '会员中心', '快速收银', 'VIP专柜', '备用终端']
  const codes = ['POS-001', 'POS-002', 'POS-003', 'POS-004', 'POS-005']
  const stores = ['flagship', 'branch1', 'branch2']
  const locations = ['一楼收银台', '二楼收银台', '会员服务区', 'VIP接待区', '备用区']
  const models = ['POS-2000', 'POS-3000', 'POS-5000', 'POS-8000']
  const statuses = ['online', 'online', 'offline', 'online', 'maintenance']
  const cashiers = ['张伟', '李娜', '王强', '刘洋', '']
  const ips = ['192.168.1.101', '192.168.1.102', '192.168.1.103', '192.168.1.104', '192.168.1.105']

  const data = []
  const now = new Date()
  const total = 12

  for (let i = 1; i <= total; i++) {
    const idx = (i - 1) % names.length
    const date = new Date(now)
    date.setHours(now.getHours() - Math.floor(Math.random() * 24))

    data.push({
      id: i,
      code: `POS-${String(i).padStart(3, '0')}`,
      name: names[idx] + (i > 5 ? ` ${i}` : ''),
      store: stores[Math.floor(Math.random() * stores.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      model: models[Math.floor(Math.random() * models.length)],
      ipAddress: ips[Math.floor(Math.random() * ips.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastActive: date.toISOString().replace('T', ' ').slice(0, 16),
      cashier: cashiers[Math.floor(Math.random() * cashiers.length)],
      todayOrders: Math.floor(Math.random() * 50),
      remark: ''
    })
  }

  return data
}

// ========== 计算统计数据 ==========
const calculateStats = (data: any[]) => {
  stats.total = data.length
  stats.online = data.filter(item => item.status === 'online').length
  stats.offline = data.filter(item => item.status === 'offline').length
  stats.maintenance = data.filter(item => item.status === 'maintenance').length
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
  if (filterForm.store !== 'all') {
    data = data.filter(item => item.store === filterForm.store)
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
  filterForm.store = 'all'
  pagination.current = 1
  filterData()
}

const filterByStatus = (status: string) => {
  filterForm.status = status
  pagination.current = 1
  filterData()
}

const handleCreate = () => {
  dialogTitle.value = '新增设备'
  dialogForm.id = 0
  dialogForm.name = ''
  dialogForm.code = ''
  dialogForm.store = 'flagship'
  dialogForm.location = ''
  dialogForm.model = 'POS-2000'
  dialogForm.ipAddress = ''
  dialogForm.remark = ''
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑设备'
  Object.assign(dialogForm, row)
  dialogVisible.value = true
}

const handleView = (row: any) => {
  viewTarget.value = row
  viewDialogVisible.value = true
}

const handleActivate = (row: any) => {
  ElMessageBox.confirm(`确定要激活设备 ${row.name} 吗？`, '确认', {
    confirmButtonText: '激活',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    const item = allData.value.find(d => d.id === row.id)
    if (item) {
      item.status = 'online'
      item.lastActive = new Date().toISOString().replace('T', ' ').slice(0, 16)
      calculateStats(allData.value)
      filterData()
      ElMessage.success(`设备 ${row.name} 已激活`)
    }
  }).catch(() => {})
}

const handleMaintenance = (row: any) => {
  ElMessageBox.confirm(`确定要将设备 ${row.name} 设置为维护状态吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const item = allData.value.find(d => d.id === row.id)
    if (item) {
      item.status = 'maintenance'
      calculateStats(allData.value)
      filterData()
      ElMessage.warning(`设备 ${row.name} 已进入维护状态`)
    }
  }).catch(() => {})
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除设备 ${row.name} 吗？`, '删除确认', {
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
      const newItem = {
        ...dialogForm,
        id: allData.value.length + 1,
        status: 'offline',
        lastActive: new Date().toISOString().replace('T', ' ').slice(0, 16),
        cashier: '',
        todayOrders: 0
      }
      allData.value.unshift(newItem)
      ElMessage.success('设备创建成功')
    } else {
      const item = allData.value.find(d => d.id === dialogForm.id)
      if (item) {
        Object.assign(item, dialogForm)
        ElMessage.success('设备更新成功')
      }
    }

    calculateStats(allData.value)
    filterData()
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
.pos-list-page {
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
.stat-icon.online {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}
.stat-icon.offline {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}
.stat-icon.maintenance {
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

.device-detail {
  padding: 8px 0;
}

@media (max-width: 768px) {
  .pos-list-page {
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