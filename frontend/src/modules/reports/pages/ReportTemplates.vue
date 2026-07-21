<!-- 
  文件路径: frontend/src/modules/reports/pages/ReportTemplates.vue
  功能: 报表模板 - 报表模板管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="模板名称">
              <el-input v-model="searchForm.name" placeholder="请输入模板名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类别">
              <el-select v-model="searchForm.category" placeholder="请选择类别" clearable style="width: 100%">
                <el-option label="销售" value="sales" />
                <el-option label="采购" value="purchase" />
                <el-option label="财务" value="finance" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建模板</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="8" v-for="template in tableData" :key="template.id">
        <el-card class="template-card">
          <div class="template-icon">
            <el-icon :size="40"><Document /></el-icon>
          </div>
          <div class="template-name">{{ template.name }}</div>
          <div class="template-category">{{ template.category }}</div>
          <div class="template-desc">{{ template.description }}</div>
          <div class="template-actions">
            <el-button type="primary" size="small" @click="handleUse(template)">使用</el-button>
            <el-button type="warning" size="small" @click="handleEdit(template)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(template)">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Document } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '', category: '' })

const tableData = ref([
  { id: 1, name: '月度销售汇总', category: '销售', description: '月度销售数据汇总模板' },
  { id: 2, name: '采购成本分析', category: '采购', description: '采购成本分析模板' },
  { id: 3, name: '利润表', category: '财务', description: '月度/季度利润表模板' },
])

const handleSearch = () => { ElMessage.success('查询完成') }
const handleReset = () => { searchForm.name = ''; searchForm.category = '' }
const handleCreate = () => { ElMessage.info('新建模板') }
const handleUse = (template: any) => { ElMessage.success(`使用模板: ${template.name}`) }
const handleEdit = (template: any) => { ElMessage.info(`编辑模板: ${template.name}`) }
const handleDelete = (template: any) => {
  ElMessageBox.confirm(`确定要删除模板 ${template.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.template-card { text-align: center; border-radius: 12px; padding: 16px 0; transition: all 0.3s; }
.template-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
.template-icon { color: #409EFF; margin-bottom: 12px; }
.template-name { font-size: 16px; font-weight: 600; }
.template-category { color: #909399; font-size: 13px; margin: 4px 0; }
.template-desc { color: #606266; font-size: 13px; margin: 4px 0 12px; }
.template-actions { display: flex; gap: 8px; justify-content: center; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>