<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectRisks.vue
  功能: 风险管理 - 项目风险管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="项目">
              <el-select v-model="searchForm.project" placeholder="请选择项目" style="width: 100%" filterable>
                <el-option label="STC 5G网络升级" value="STC 5G网络升级" />
                <el-option label="阿尔拉吉银行核心系统" value="阿尔拉吉银行核心系统" />
                <el-option label="沙特阿美数据中心建设" value="沙特阿美数据中心建设" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="风险等级">
              <el-select v-model="searchForm.level" placeholder="请选择等级" clearable style="width: 100%">
                <el-option label="高" value="high" />
                <el-option label="中" value="medium" />
                <el-option label="低" value="low" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 添加风险</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 风险矩阵 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in riskStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="riskNo" label="风险编号" width="120" />
        <el-table-column prop="description" label="风险描述" min-width="180" />
        <el-table-column prop="level" label="风险等级" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.level === 'high' ? 'danger' : row.level === 'medium' ? 'warning' : 'info'">
              {{ row.level === 'high' ? '高' : row.level === 'medium' ? '中' : '低' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="impact" label="影响程度" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.impact === 'high' ? 'danger' : row.impact === 'medium' ? 'warning' : 'info'">
              {{ row.impact === 'high' ? '高' : row.impact === 'medium' ? '中' : '低' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'mitigated' ? 'success' : row.status === 'active' ? 'danger' : 'info'">
              {{ row.status === 'active' ? '活跃' : row.status === 'mitigated' ? '已缓解' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mitigationPlan" label="缓解措施" min-width="150" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleMitigate(row)" v-if="row.status === 'active'"><el-icon><Check /></el-icon> 缓解</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ project: '', level: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const riskStats = ref([
  { label: '总风险数', value: '18', type: 'primary' },
  { label: '高风险', value: '3', type: 'danger' },
  { label: '中风险', value: '8', type: 'warning' },
  { label: '已缓解', value: '7', type: 'success' },
])

const tableData = ref([
  { id: 1, riskNo: 'RSK-001', description: '供应商供货延迟', level: 'high', impact: 'high', status: 'active', mitigationPlan: '备用供应商备选' },
  { id: 2, riskNo: 'RSK-002', description: '技术人员离职', level: 'medium', impact: 'high', status: 'active', mitigationPlan: '人才储备计划' },
  { id: 3, riskNo: 'RSK-003', description: '需求变更频繁', level: 'medium', impact: 'medium', status: 'mitigated', mitigationPlan: '变更管理流程' },
  { id: 4, riskNo: 'RSK-004', description: '预算超支', level: 'low', impact: 'medium', status: 'active', mitigationPlan: '成本监控' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.project = ''; searchForm.level = '' }
const handleCreate = () => { ElMessage.info('添加风险') }
const handleView = (row: any) => { ElMessage.info(`查看风险: ${row.riskNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑风险: ${row.riskNo}`) }
const handleMitigate = (row: any) => {
  ElMessageBox.confirm(`确认风险 ${row.riskNo} 已缓解？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'mitigated'; ElMessage.success('风险已缓解') }).catch(() => {})
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
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>