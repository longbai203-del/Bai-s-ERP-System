<!-- 
  文件路径: frontend/src/modules/pos/pages/MemberPoints.vue
  功能: 会员积分管理 - 管理会员积分体系
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="会员卡号">
              <el-input v-model="searchForm.cardNo" placeholder="请输入会员卡号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="等级">
              <el-select v-model="searchForm.level" placeholder="请选择等级" clearable style="width: 100%">
                <el-option label="青铜" value="bronze" />
                <el-option label="白银" value="silver" />
                <el-option label="黄金" value="gold" />
                <el-option label="钻石" value="diamond" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 积分统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in pointStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="cardNo" label="会员卡号" width="140" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="level" label="会员等级" width="100">
          <template #default="{ row }">
            <el-tag :type="row.level === 'diamond' ? 'danger' : row.level === 'gold' ? 'warning' : row.level === 'silver' ? 'primary' : 'info'">
              {{ row.level === 'diamond' ? '钻石' : row.level === 'gold' ? '黄金' : row.level === 'silver' ? '白银' : '青铜' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" align="center" width="120">
          <template #default="{ row }">
            <span style="font-weight: 700; color: #409EFF;">{{ row.points }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accumulatedAmount" label="累计消费" align="right">
          <template #default="{ row }">{{ formatCurrency(row.accumulatedAmount) }}</template>
        </el-table-column>
        <el-table-column prop="expiringPoints" label="即将过期" align="center" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.expiringPoints > 0 ? '#E6A23C' : '#909399' }">
              {{ row.expiringPoints }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handlePoints(row)"><el-icon><Edit /></el-icon> 调整</el-button>
            <el-button type="success" size="small" @click="handleRedeem(row)"><el-icon><Gift /></el-icon> 兑换</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>

    <!-- 积分调整弹窗 -->
    <el-dialog v-model="dialogVisible" title="积分调整" width="450px">
      <el-form :model="pointForm" label-width="100px">
        <el-form-item label="会员">{{ pointForm.name }}</el-form-item>
        <el-form-item label="当前积分">{{ pointForm.currentPoints }}</el-form-item>
        <el-form-item label="调整类型" prop="type">
          <el-radio-group v-model="pointForm.type">
            <el-radio label="add">增加</el-radio>
            <el-radio label="subtract">扣减</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整数量" prop="amount">
          <el-input-number v-model="pointForm.amount" :min="0" :precision="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="调整原因" prop="reason">
          <el-input v-model="pointForm.reason" type="textarea" :rows="3" placeholder="请输入调整原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePoints" :loading="submitting">确认调整</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, View, Edit, Gift } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ cardNo: '', name: '', level: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const pointStats = ref([
  { label: '会员总数', value: '2,856', type: 'primary' },
  { label: '总积分', value: '12,856,000', type: 'success' },
  { label: '待兑换积分', value: '3,856,000', type: 'warning' },
  { label: '即将过期积分', value: '856,000', type: 'danger' },
])

const tableData = ref([
  { id: 1, cardNo: 'M-2024-001', name: 'Abdullah Al-Fahd', phone: '+966 50 123 4567', level: 'diamond', points: 28600, accumulatedAmount: 856000, expiringPoints: 1200 },
  { id: 2, cardNo: 'M-2024-002', name: 'Nasser Al-Harbi', phone: '+966 50 234 5678', level: 'gold', points: 15600, accumulatedAmount: 528000, expiringPoints: 800 },
  { id: 3, cardNo: 'M-2024-003', name: 'Sultan Al-Mutairi', phone: '+966 50 345 6789', level: 'silver', points: 8800, accumulatedAmount: 256000, expiringPoints: 0 },
])

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)

const pointForm = reactive({
  name: '',
  currentPoints: 0,
  type: 'add',
  amount: 0,
  reason: '',
})

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.cardNo = ''; searchForm.name = ''; searchForm.level = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleView = (row: any) => { ElMessage.info(`查看会员: ${row.name}`) }
const handlePoints = (row: any) => {
  pointForm.name = row.name
  pointForm.currentPoints = row.points
  pointForm.type = 'add'
  pointForm.amount = 0
  pointForm.reason = ''
  dialogVisible.value = true
}
const handleRedeem = (row: any) => {
  ElMessageBox.confirm(`确认 ${row.name} 使用积分兑换？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => ElMessage.success('积分兑换成功')).catch(() => {})
}
const handleSavePoints = () => {
  if (pointForm.amount <= 0) { ElMessage.warning('请输入有效的调整数量'); return }
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    dialogVisible.value = false
    ElMessage.success(`积分已${pointForm.type === 'add' ? '增加' : '扣减'} ${pointForm.amount}分`)
  }, 800)
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
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>