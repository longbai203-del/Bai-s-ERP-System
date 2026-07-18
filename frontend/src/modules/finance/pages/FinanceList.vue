<template>
  <div class="finance-page">
    <div class="page-header">
      <h1>📋 Finance管理</h1>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建Finance
      </el-button>
    </div>

    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索..."
        clearable
        style="width: 240px"
        @keyup.enter="loadData"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="loadData">搜索</el-button>
      <el-button @click="keyword = ''; loadData()">重置</el-button>
    </div>

    <el-table v-loading="store.loading" :data="store.list" border style="width:100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" min-width="150" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row)">查看</el-button>
          <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10,20,50,100]"
        :total="store.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { useFinanceStore } from '../store'

const router = useRouter()
const store = useFinanceStore()

const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)

const loadData = async () => {
  await store.fetchList({ page: page.value, limit: pageSize.value, keyword: keyword.value })
}

const handleCreate = () => router.push('/finance/create')
const handleView = (row: any) => router.push(/finance/)
const handleEdit = (row: any) => router.push(/finance//edit)

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除吗？', '确认', { type: 'warning' })
    .then(async () => { await store.delete(row.id); ElMessage.success('删除成功'); loadData() })
    .catch(() => {})
}

onMounted(loadData)
</script>

<style scoped>
.finance-page { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h1 { margin: 0; font-size: 24px; }
.search-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
