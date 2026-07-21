<!-- 
  文件路径: frontend/src/modules/customers/pages/CustomerTags.vue
  功能: 客户标签 - 管理客户标签
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="标签名称">
              <el-input v-model="searchForm.tagName" placeholder="请输入标签名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签分组">
              <el-select v-model="searchForm.group" placeholder="请选择分组" clearable style="width: 100%">
                <el-option label="客户属性" value="attribute" />
                <el-option label="行为标签" value="behavior" />
                <el-option label="价值标签" value="value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建标签</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12" v-for="group in tagGroups" :key="group.name">
        <el-card>
          <template #header>
            <span>{{ group.name }}</span>
            <el-tag size="small">{{ group.tags.length }}个标签</el-tag>
          </template>
          <div class="tag-cloud">
            <el-tag
              v-for="tag in group.tags"
              :key="tag.id"
              :type="tag.color"
              size="large"
              closable
              @close="handleDeleteTag(tag)"
              @click="handleTagClick(tag)"
              class="tag-item"
            >
              {{ tag.name }} <span class="tag-count">({{ tag.count }})</span>
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ tagName: '', group: '' })

const tagGroups = ref([
  {
    name: '客户属性',
    tags: [
      { id: 1, name: 'VIP客户', color: 'danger', count: 45 },
      { id: 2, name: '企业客户', color: 'primary', count: 128 },
      { id: 3, name: '个人客户', color: 'success', count: 856 },
      { id: 4, name: '政府客户', color: 'warning', count: 32 },
    ],
  },
  {
    name: '行为标签',
    tags: [
      { id: 5, name: '高活跃度', color: 'success', count: 256 },
      { id: 6, name: '高复购率', color: 'primary', count: 186 },
      { id: 7, name: '高客单价', color: 'danger', count: 98 },
      { id: 8, name: '新客户', color: '', count: 320 },
    ],
  },
  {
    name: '价值标签',
    tags: [
      { id: 9, name: 'A类客户', color: 'success', count: 128 },
      { id: 10, name: 'B类客户', color: 'primary', count: 386 },
      { id: 11, name: 'C类客户', color: 'warning', count: 772 },
      { id: 12, name: '流失风险', color: 'danger', count: 86 },
    ],
  },
])

const handleSearch = () => { ElMessage.success('查询完成') }
const handleReset = () => { searchForm.tagName = ''; searchForm.group = '' }
const handleCreate = () => { ElMessage.info('新建标签') }
const handleDeleteTag = (tag: any) => {
  ElMessageBox.confirm(`确定要删除标签 "${tag.name}" 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success(`标签 "${tag.name}" 已删除`)).catch(() => {})
}
const handleTagClick = (tag: any) => { ElMessage.info(`查看标签 "${tag.name}" 的客户列表`) }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-item { cursor: pointer; transition: all 0.2s; }
.tag-item:hover { transform: scale(1.05); }
.tag-count { font-size: 12px; color: #909399; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>