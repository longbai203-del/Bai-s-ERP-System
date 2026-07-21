<!-- 
  文件路径: frontend/src/modules/pos/pages/CouponManagement.vue
  功能: 优惠券管理 - 管理优惠券
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="优惠券名称">
              <el-input v-model="searchForm.name" placeholder="请输入优惠券名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="有效" value="active" />
                <el-option label="已过期" value="expired" />
                <el-option label="已暂停" value="paused" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 创建优惠券</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in couponStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="优惠券名称" />
        <el-table-column prop="code" label="优惠码" width="120" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'discount' ? 'success' : row.type === 'fixed' ? 'warning' : 'primary'">
              {{ row.type === 'discount' ? '折扣' : row.type === 'fixed' ? '满减' : '赠品' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="优惠值" align="center" width="100">
          <template #default="{ row }">
            {{ row.type === 'discount' ? row.value + '%' : formatCurrency(row.value) }}
          </template>
        </el-table-column>
        <el-table-column prop="usedCount" label="已用/总量" align="center" />
        <el-table-column prop="validFrom" label="生效日期" width="120" />
        <el-table-column prop="validTo" label="过期日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'expired' ? 'danger' : 'info'">
              {{ row.status === 'active' ? '有效' : row.status === 'expired' ? '已过期' : '已暂停' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleShare(row)"><el-icon><Share /></el-icon> 发放</el-button>
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
import { Search, Plus, Edit, Share, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const couponStats = ref([
  { label: '优惠券总数', value: '86', type: 'primary' },
  { label: '有效优惠券', value: '45', type: 'success' },
  { label: '本月发放', value: '2,856张', type: 'warning' },
  { label: '使用率', value: '68%', type: 'primary' },
])

const tableData = ref([
  { id: 1, name: '新客专享折扣', code: 'NEW20', type: 'discount', value: 20, usedCount: '156/500', validFrom: '2024-11-01', validTo: '2024-12-31', status: 'active' },
  { id: 2, name: '满200减30', code: 'SAVE30', type: 'fixed', value: 30, usedCount: '89/200', validFrom: '2024-11-15', validTo: '2024-12-15', status: 'active' },
  { id: 3, name: '会员专享礼品', code: 'GIFT', type: 'gift', value: 0, usedCount: '45/100', validFrom: '2024-10-01', validTo: '2024-10-31', status: 'expired' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.name = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('创建优惠券') }
const handleEdit = (row: any) => { ElMessage.info(`编辑: ${row.name}`) }
const handleShare = (row: any) => { ElMessage.success(`优惠券 ${row.name} 已发放`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除优惠券 ${row.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
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
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>