<!-- 
  文件路径: frontend/src/modules/hr/pages/Performance.vue
  功能: 绩效管理 - 管理员工绩效考核
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="考核周期">
              <el-select v-model="searchForm.period" placeholder="请选择周期" clearable style="width: 100%">
                <el-option label="月度" value="monthly" />
                <el-option label="季度" value="quarterly" />
                <el-option label="年度" value="annual" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建考核</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="position" label="职位" />
        <el-table-column prop="period" label="考核周期" width="100" />
        <el-table-column prop="score" label="考核得分" align="center" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.score >= 90 ? '#67C23A' : row.score >= 70 ? '#E6A23C' : '#F56C6C', fontWeight: 700 }">
              {{ row.score }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="rating" label="评级" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.rating === 'A' ? 'success' : row.rating === 'B' ? 'primary' : row.rating === 'C' ? 'warning' : 'danger'">
              {{ row.rating }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'warning'">
              {{ row.status === 'completed' ? '已完成' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="evaluator" label="评估人" width="100" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleComplete(row)" v-if="row.status === 'pending'"><el-icon><Check /></el-icon> 完成</el-button>
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

const searchForm = reactive({ name: '', period: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, name: 'Ahmed Al-Fahd', position: '销售经理', period: '季度', score: 95, rating: 'A', status: 'completed', evaluator: 'Mohammed Al-Qahtani' },
  { id: 2, name: 'Mohammed Al-Qahtani', position: '采购主管', period: '季度', score: 88, rating: 'B', status: 'pending', evaluator: 'Saud Al-Otaibi' },
  { id: 3, name: 'Saud Al-Otaibi', position: '财务总监', period: '季度', score: 76, rating: 'C', status: 'pending', evaluator: 'Faisal Al-Dossary' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = ''; searchForm.period = '' }
const handleCreate = () => { ElMessage.info('新建考核') }
const handleView = (row: any) => { ElMessage.info(`查看 ${row.name} 考核`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑 ${row.name} 考核`) }
const handleComplete = (row: any) => {
  ElMessageBox.confirm(`确认完成 ${row.name} 的考核？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'completed'; ElMessage.success('考核已完成') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>