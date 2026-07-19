<template>
  <div class="module-list">
    <div class="page-header">
      <h1>📦 库存管理</h1>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新增库存
      </el-button>
    </div>

    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索产品..."
        clearable
        style="width: 240px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="filterCategory" placeholder="分类" clearable style="width: 140px">
        <el-option label="全部" value="" />
        <el-option label="电子产品" value="电子" />
        <el-option label="服装" value="服装" />
        <el-option label="食品" value="食品" />
      </el-select>
      <el-button type="primary" @click="loadData">搜索</el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="产品名称" min-width="150" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="stock" label="库存" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="row.stock < 10 ? 'danger' : row.stock < 30 ? 'warning' : ''">
            {{ row.stock }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="120" align="right">
        <template #default="{ row }">¥{{ row.price?.toFixed(2) || '0.00' }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '正常' : '停用' }}
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
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

const loading = ref(false)
const keyword = ref('')
const filterCategory = ref('')
const tableData = ref([
  { id: 1, name: 'iPhone 15 Pro', category: '电子', stock: 45, price: 7999, status: 'active' },
  { id: 2, name: 'MacBook Air', category: '电子', stock: 28, price: 9499, status: 'active' },
  { id: 3, name: 'AirPods Pro', category: '电子', stock: 120, price: 1899, status: 'active' },
  { id: 4, name: '纯棉T恤', category: '服装', stock: 200, price: 89, status: 'active' },
  { id: 5, name: '运动鞋', category: '服装', stock: 15, price: 299, status: 'active' },
  { id: 6, name: '巧克力礼盒', category: '食品', stock: 50, price: 159, status: 'inactive' }
])
const total = ref(6)
const page = ref(1)
const pageSize = ref(10)

const loadData = async () => {
  loading.value = true
  setTimeout(() => { loading.value = false }, 500)
}

const resetFilters = () => {
  keyword.value = ''
  filterCategory.value = ''
  loadData()
}

const handleCreate = () => ElMessage.info('新增库存功能开发中')
const handleView = (row) => ElMessage.info(`查看: ${row.name}`)
const handleEdit = (row) => ElMessage.info(`编辑: ${row.name}`)
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除 ${row.name} 吗？`, '确认', { type: 'warning' })
    .then(() => { ElMessage.success('删除成功'); loadData() })
    .catch(() => {})
}

onMounted(loadData)
</script>

<style scoped>
.module-list { padding: 20px; }
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-header h1 { margin: 0; font-size: 24px; }
.search-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
