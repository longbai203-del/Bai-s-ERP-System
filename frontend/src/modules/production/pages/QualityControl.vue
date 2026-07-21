<!-- 
  文件路径: frontend/src/modules/production/pages/QualityControl.vue
  功能: 质检管理 - 产品质量检验
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="工单号">
              <el-input v-model="searchForm.workOrderNo" placeholder="请输入工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结果">
              <el-select v-model="searchForm.result" placeholder="请选择结果" clearable style="width: 100%">
                <el-option label="合格" value="pass" />
                <el-option label="不合格" value="fail" />
                <el-option label="待检验" value="pending" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建质检</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 质检统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in qcStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="qcNo" label="质检编号" width="140" />
        <el-table-column prop="workOrderNo" label="工单号" width="140" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sampleSize" label="抽检数量" align="center" />
        <el-table-column prop="defectCount" label="不良数" align="center">
          <template #default="{ row }">
            <span :style="{ color: row.defectCount > 0 ? '#F56C6C' : '#67C23A' }">
              {{ row.defectCount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="defectRate" label="不良率" align="center">
          <template #default="{ row }">
            <span :style="{ color: row.defectRate > 5 ? '#F56C6C' : row.defectRate > 2 ? '#E6A23C' : '#67C23A' }">
              {{ row.defectRate }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="结果" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.result === 'pass' ? 'success' : row.result === 'fail' ? 'danger' : 'info'">
              {{ row.result === 'pass' ? '合格' : row.result === 'fail' ? '不合格' : '待检验' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleInspect(row)" v-if="row.result === 'pending'"><el-icon><Edit /></el-icon> 检验</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ workOrderNo: '', result: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const qcStats = ref([
  { label: '质检总数', value: '286', type: 'primary' },
  { label: '合格', value: '256', type: 'success' },
  { label: '不合格', value: '18', type: 'danger' },
  { label: '合格率', value: '93.4%', type: 'success' },
])

const tableData = ref([
  { id: 1, qcNo: 'QC-2024-001', workOrderNo: 'WO-2024-001', product: 'iPhone 15 Pro Max', sampleSize: 50, defectCount: 2, defectRate: 4, result: 'pass' },
  { id: 2, qcNo: 'QC-2024-002', workOrderNo: 'WO-2024-001', product: 'iPhone 15 Pro Max', sampleSize: 50, defectCount: 8, defectRate: 16, result: 'fail' },
  { id: 3, qcNo: 'QC-2024-003', workOrderNo: 'WO-2024-003', product: 'MacBook Pro 16"', sampleSize: 30, defectCount: 1, defectRate: 3.3, result: 'pending' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.workOrderNo = ''; searchForm.result = '' }
const handleCreate = () => { ElMessage.info('新建质检') }
const handleView = (row: any) => { ElMessage.info(`查看质检: ${row.qcNo}`) }
const handleInspect = (row: any) => { ElMessage.info(`检验: ${row.qcNo}`) }
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
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>