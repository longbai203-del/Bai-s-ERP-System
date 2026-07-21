<!-- 
  文件路径: frontend/src/modules/orders/pages/ServiceOrders.vue
  功能: 售后服务 - 管理售后服务工单
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="工单号">
              <el-input v-model="searchForm.serviceNo" placeholder="请输入工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服务类型">
              <el-select v-model="searchForm.serviceType" placeholder="请选择类型" clearable style="width: 100%">
                <el-option label="维修" value="repair" />
                <el-option label="维护" value="maintenance" />
                <el-option label="安装" value="installation" />
                <el-option label="培训" value="training" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建工单</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="serviceNo" label="工单号" width="140" />
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="serviceType" label="服务类型" width="100" />
        <el-table-column prop="product" label="服务产品" />
        <el-table-column prop="priority" label="优先级" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'info'">
              {{ row.priority === 'high' ? '高' : row.priority === 'medium' ? '中' : '低' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'processing' ? 'primary' : row.status === 'completed' ? 'success' : 'info'">
              {{ row.status === 'pending' ? '待处理' : row.status === 'processing' ? '处理中' : row.status === 'completed' ? '已完成' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleAssign(row)"><el-icon><User /></el-icon> 指派</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, User, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ serviceNo: '', customer: '', serviceType: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, serviceNo: 'SR-2024-001', customer: '沙特电信公司', serviceType: '维修', product: 'iPhone 15 Pro Max', priority: 'high', status: 'processing', createdAt: '2024-11-20 10:30' },
  { id: 2, serviceNo: 'SR-2024-002', customer: '阿尔拉吉银行', serviceType: '维护', product: 'MacBook Pro 16"', priority: 'medium', status: 'pending', createdAt: '2024-11-18 14:20' },
  { id: 3, serviceNo: 'SR-2024-003', customer: '沙特阿美', serviceType: '安装', product: 'iPad Pro 12.9"', priority: 'low', status: 'completed', createdAt: '2024-11-15 09:00' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.serviceNo = ''; searchForm.customer = ''; searchForm.serviceType = '' }
const handleCreate = () => { ElMessage.info('新建工单') }
const handleView = (row: any) => { ElMessage.info(`查看工单: ${row.serviceNo}`) }
const handleAssign = (row: any) => { ElMessage.info(`指派工单: ${row.serviceNo}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除工单 ${row.serviceNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>