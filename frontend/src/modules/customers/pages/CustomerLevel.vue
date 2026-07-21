<!-- 
  文件路径: frontend/src/modules/customers/pages/CustomerLevel.vue
  功能: 客户等级 - 管理客户等级体系
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="等级名称">
              <el-input v-model="searchForm.levelName" placeholder="请输入等级名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建等级</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="level" label="等级" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.color" size="large">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="等级名称" />
        <el-table-column prop="minPoints" label="积分门槛" align="center" />
        <el-table-column prop="discountRate" label="折扣率" align="center">
          <template #default="{ row }">{{ row.discountRate }}%</template>
        </el-table-column>
        <el-table-column prop="benefits" label="专属权益" min-width="200" />
        <el-table-column prop="customerCount" label="客户数" align="center" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ levelName: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, level: '钻石', name: '钻石会员', minPoints: 10000, discountRate: 15, color: 'danger', benefits: '专属客服、免费配送、生日礼包', customerCount: 128 },
  { id: 2, level: '黄金', name: '黄金会员', minPoints: 5000, discountRate: 10, color: 'warning', benefits: '优先服务、免费配送', customerCount: 386 },
  { id: 3, level: '白银', name: '白银会员', minPoints: 2000, discountRate: 5, color: 'primary', benefits: '积分加速', customerCount: 772 },
  { id: 4, level: '青铜', name: '青铜会员', minPoints: 0, discountRate: 0, color: 'info', benefits: '基础服务', customerCount: 1256 },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.levelName = '' }
const handleCreate = () => { ElMessage.info('新建等级') }
const handleEdit = (row: any) => { ElMessage.info(`编辑等级: ${row.level}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除等级 "${row.level}" 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>