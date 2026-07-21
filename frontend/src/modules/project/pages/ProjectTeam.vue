<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectTeam.vue
  功能: 团队管理 - 项目团队管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="项目">
              <el-select v-model="searchForm.project" placeholder="请选择项目" style="width: 100%" filterable>
                <el-option label="STC 5G网络升级" value="STC 5G网络升级" />
                <el-option label="阿尔拉吉银行核心系统" value="阿尔拉吉银行核心系统" />
                <el-option label="沙特阿美数据中心建设" value="沙特阿美数据中心建设" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleAdd" style="float: right"><el-icon><Plus /></el-icon> 添加成员</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="6" v-for="member in teamData" :key="member.id">
        <el-card class="member-card">
          <div class="member-avatar">
            <el-avatar :size="64" icon="UserFilled" />
          </div>
          <div class="member-name">{{ member.name }}</div>
          <div class="member-role">{{ member.role }}</div>
          <div class="member-meta">
            <span><el-icon><Calendar /></el-icon> {{ member.joinDate }}</span>
          </div>
          <el-tag :type="member.status === 'active' ? 'success' : 'info'" size="large" style="margin-top: 8px;">
            {{ member.status === 'active' ? '在职' : '已离职' }}
          </el-tag>
          <div class="member-actions">
            <el-button type="primary" size="small" @click="handleEdit(member)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleRemove(member)">移除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Calendar } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ project: '' })

const teamData = ref([
  { id: 1, name: 'Ahmed Al-Fahd', role: '项目经理', joinDate: '2024-08-01', status: 'active' },
  { id: 2, name: 'Mohammed Al-Qahtani', role: '技术架构师', joinDate: '2024-08-01', status: 'active' },
  { id: 3, name: 'Saud Al-Otaibi', role: '开发工程师', joinDate: '2024-08-15', status: 'active' },
  { id: 4, name: 'Faisal Al-Dossary', role: '测试工程师', joinDate: '2024-09-01', status: 'active' },
])

const handleSearch = () => { ElMessage.success('查询完成') }
const handleReset = () => { searchForm.project = '' }
const handleAdd = () => { ElMessage.info('添加团队成员') }
const handleEdit = (member: any) => { ElMessage.info(`编辑 ${member.name}`) }
const handleRemove = (member: any) => {
  ElMessageBox.confirm(`确定从项目中移除 ${member.name} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('移除成功')).catch(() => {})
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.member-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.member-avatar { margin-bottom: 12px; }
.member-name { font-size: 16px; font-weight: 600; color: #303133; }
.member-role { color: #909399; font-size: 14px; margin: 4px 0; }
.member-meta { color: #909399; font-size: 13px; margin: 4px 0; }
.member-meta span { display: flex; align-items: center; justify-content: center; gap: 4px; }
.member-actions { margin-top: 12px; display: flex; gap: 8px; justify-content: center; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>