<!-- 
  文件路径: frontend/src/modules/customers/pages/Opportunities.vue
  功能: 商机管理 - 管理销售机会
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="商机名称">
              <el-input v-model="searchForm.opportunityName" placeholder="请输入商机名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="客户">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="阶段">
              <el-select v-model="searchForm.stage" placeholder="请选择阶段" clearable style="width: 100%">
                <el-option label="初步接触" value="initial" />
                <el-option label="需求分析" value="analysis" />
                <el-option label="方案提案" value="proposal" />
                <el-option label="谈判签约" value="negotiation" />
                <el-option label="已成交" value="won" />
                <el-option label="已流失" value="lost" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建商机</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in opportunityStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="商机名称" min-width="150" />
        <el-table-column prop="customer" label="客户" />
        <el-table-column prop="amount" label="预计金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="stage" label="阶段" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="getStageType(row.stage)">{{ getStageLabel(row.stage) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="probability" label="赢率" align="center" width="100">
          <template #default="{ row }">{{ row.probability }}%</template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="100" />
        <el-table-column prop="expectedCloseDate" label="预计成交" width="120" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDetail(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleWin(row)" v-if="row.stage === 'negotiation'"><el-icon><Check /></el-icon> 成交</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Plus, View, Edit, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ opportunityName: '', customer: '', stage: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const opportunityStats = ref([
  { label: '总商机数', value: '86', type: 'primary' },
  { label: '进行中', value: '45', type: 'warning' },
  { label: '已成交', value: '28', type: 'success' },
  { label: '商机金额', value: 'SAR 12,856,000', type: 'primary' },
])

const tableData = ref([
  { id: 1, name: 'STC年度设备采购', customer: '沙特电信公司', amount: 2856000, stage: 'negotiation', probability: 80, owner: 'Ahmed', expectedCloseDate: '2024-12-15' },
  { id: 2, name: '阿尔拉吉银行IT系统', customer: '阿尔拉吉银行', amount: 1987000, stage: 'proposal', probability: 60, owner: 'Mohammed', expectedCloseDate: '2025-01-20' },
  { id: 3, name: '沙特阿美软件许可', customer: '沙特阿美', amount: 1765000, stage: 'analysis', probability: 40, owner: 'Saud', expectedCloseDate: '2025-02-10' },
  { id: 4, name: '利雅得银行POS系统', customer: '利雅得银行', amount: 1250000, stage: 'won', probability: 100, owner: 'Faisal', expectedCloseDate: '2024-11-30' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const getStageType = (stage: string) => {
  const map: Record<string, string> = { initial: 'info', analysis: 'primary', proposal: 'warning', negotiation: 'danger', won: 'success', lost: 'info' }
  return map[stage] || 'info'
}

const getStageLabel = (stage: string) => {
  const map: Record<string, string> = { initial: '初步接触', analysis: '需求分析', proposal: '方案提案', negotiation: '谈判签约', won: '已成交', lost: '已流失' }
  return map[stage] || stage
}

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.opportunityName = ''; searchForm.customer = ''; searchForm.stage = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { ElMessage.info('新建商机') }
const handleDetail = (row: any) => { ElMessage.info(`查看商机: ${row.name}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑商机: ${row.name}`) }
const handleWin = (row: any) => {
  ElMessageBox.confirm(`确认 ${row.name} 已成交？`, '提示', { confirmButtonText: '确认成交', cancelButtonText: '取消', type: 'success' })
    .then(() => { row.stage = 'won'; row.probability = 100; ElMessage.success('商机已成交') }).catch(() => {})
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
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>