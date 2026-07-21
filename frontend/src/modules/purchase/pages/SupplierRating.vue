<!-- 
  文件路径: frontend/src/modules/purchase/pages/SupplierRating.vue
  功能: 供应商评分 - 管理供应商评估与评分
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="供应商">
              <el-input v-model="searchForm.supplier" placeholder="请输入供应商名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="评分等级">
              <el-select v-model="searchForm.rating" placeholder="请选择等级" clearable style="width: 100%">
                <el-option label="A级" value="A" />
                <el-option label="B级" value="B" />
                <el-option label="C级" value="C" />
                <el-option label="D级" value="D" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增评估</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="supplier" label="供应商名称" />
        <el-table-column prop="overallScore" label="综合评分" align="center" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.overallScore" :color="row.overallScore >= 85 ? '#67C23A' : row.overallScore >= 70 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
        <el-table-column prop="rating" label="等级" align="center" width="80">
          <template #default="{ row }">
            <el-tag :type="row.rating === 'A' ? 'success' : row.rating === 'B' ? 'primary' : row.rating === 'C' ? 'warning' : 'danger'">
              {{ row.rating }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quality" label="质量" align="center">
          <template #default="{ row }">{{ row.quality }}分</template>
        </el-table-column>
        <el-table-column prop="delivery" label="交期" align="center">
          <template #default="{ row }">{{ row.delivery }}分</template>
        </el-table-column>
        <el-table-column prop="price" label="价格" align="center">
          <template #default="{ row }">{{ row.price }}分</template>
        </el-table-column>
        <el-table-column prop="service" label="服务" align="center">
          <template #default="{ row }">{{ row.service }}分</template>
        </el-table-column>
        <el-table-column prop="evaluationDate" label="评估日期" width="120" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>

    <!-- 评估弹窗 -->
    <el-dialog v-model="dialogVisible" title="供应商评估" width="500px">
      <el-form :model="evalForm" label-width="100px">
        <el-form-item label="供应商">{{ evalForm.supplier }}</el-form-item>
        <el-form-item label="质量评分">
          <el-slider v-model="evalForm.quality" :min="0" :max="100" show-stops />
        </el-form-item>
        <el-form-item label="交期评分">
          <el-slider v-model="evalForm.delivery" :min="0" :max="100" show-stops />
        </el-form-item>
        <el-form-item label="价格评分">
          <el-slider v-model="evalForm.price" :min="0" :max="100" show-stops />
        </el-form-item>
        <el-form-item label="服务评分">
          <el-slider v-model="evalForm.service" :min="0" :max="100" show-stops />
        </el-form-item>
        <el-form-item label="评估意见">
          <el-input v-model="evalForm.comment" type="textarea" :rows="3" placeholder="请输入评估意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveEval" :loading="submitting">保存评估</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ supplier: '', rating: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, supplier: 'Apple Supplier', overallScore: 92, rating: 'A', quality: 95, delivery: 90, price: 88, service: 95, evaluationDate: '2024-11-15' },
  { id: 2, supplier: 'Samsung Supplier', overallScore: 85, rating: 'B', quality: 88, delivery: 85, price: 80, service: 87, evaluationDate: '2024-11-10' },
  { id: 3, supplier: 'Dell Supplier', overallScore: 78, rating: 'C', quality: 80, delivery: 75, price: 78, service: 80, evaluationDate: '2024-11-05' },
  { id: 4, supplier: 'Sony Supplier', overallScore: 72, rating: 'C', quality: 75, delivery: 70, price: 75, service: 68, evaluationDate: '2024-10-28' },
])

const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)

const evalForm = reactive({
  supplier: '',
  quality: 0,
  delivery: 0,
  price: 0,
  service: 0,
  comment: '',
})

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.supplier = ''; searchForm.rating = '' }
const handleCreate = () => {
  evalForm.supplier = ''
  evalForm.quality = 80
  evalForm.delivery = 80
  evalForm.price = 80
  evalForm.service = 80
  evalForm.comment = ''
  dialogVisible.value = true
}
const handleView = (row: any) => { ElMessage.info(`查看供应商: ${row.supplier}`) }
const handleEdit = (row: any) => {
  evalForm.supplier = row.supplier
  evalForm.quality = row.quality
  evalForm.delivery = row.delivery
  evalForm.price = row.price
  evalForm.service = row.service
  evalForm.comment = ''
  dialogVisible.value = true
}
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.supplier} 的评估记录吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
const handleSaveEval = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    dialogVisible.value = false
    ElMessage.success('评估已保存')
  }, 1000)
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>