<!-- 
  文件路径: frontend/src/modules/marketing/pages/MarketingAutomation.vue
  功能: 营销自动化 - 自动化工作流
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>营销自动化</h2>
          <p class="subtitle">自动化营销工作流</p>
        </div>
        <div>
          <el-button type="primary" @click="handleCreate"><el-icon><Plus /></el-icon> 创建工作流</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="6" v-for="workflow in workflows" :key="workflow.id">
        <el-card class="workflow-card" :class="workflow.status">
          <div class="workflow-header">
            <div class="workflow-icon" :style="{ background: workflow.color }">
              <el-icon :size="24"><component :is="workflow.icon" /></el-icon>
            </div>
            <div class="workflow-name">{{ workflow.name }}</div>
          </div>
          <div class="workflow-desc">{{ workflow.desc }}</div>
          <div class="workflow-meta">
            <span>触发: {{ workflow.trigger }}</span>
            <span>执行: {{ workflow.executions }}</span>
          </div>
          <div class="workflow-actions">
            <el-switch v-model="workflow.active" @change="handleToggle(workflow)" />
            <el-button type="primary" size="small" @click="handleEdit(workflow)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(workflow)">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Promotion, Message, Share, User } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const workflows = ref([
  { id: 1, name: '新客户欢迎邮件', desc: '新客户注册后自动发送欢迎邮件系列', icon: 'Message', color: '#409EFF', trigger: '新客户注册', executions: '286次', active: true, status: 'active' },
  { id: 2, name: '线索培育自动化', desc: '根据客户行为自动发送培育内容', icon: 'User', color: '#67C23A', trigger: '线索分配', executions: '156次', active: true, status: 'active' },
  { id: 3, name: '社交媒体定时发布', desc: '自动定时发布社交媒体内容', icon: 'Share', color: '#E6A23C', trigger: '定时任务', executions: '86次', active: false, status: 'inactive' },
  { id: 4, name: '促销活动触发', desc: '基于客户行为触发个性化促销', icon: 'Promotion', color: '#F56C6C', trigger: '购物车放弃', executions: '45次', active: true, status: 'active' },
])

const handleCreate = () => { ElMessage.info('创建工作流') }
const handleToggle = (workflow: any) => {
  workflow.status = workflow.active ? 'active' : 'inactive'
  ElMessage.success(`${workflow.name} 已${workflow.active ? '启用' : '禁用'}`)
}
const handleEdit = (workflow: any) => { ElMessage.info(`编辑: ${workflow.name}`) }
const handleDelete = (workflow: any) => {
  ElMessageBox.confirm(`确定要删除工作流 "${workflow.name}" 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.workflow-card { border-radius: 12px; transition: all 0.3s; }
.workflow-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
.workflow-card.active { border-left: 4px solid #67C23A; }
.workflow-card.inactive { border-left: 4px solid #909399; opacity: 0.7; }
.workflow-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.workflow-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
.workflow-name { font-size: 16px; font-weight: 600; }
.workflow-desc { color: #606266; font-size: 14px; margin-bottom: 8px; }
.workflow-meta { display: flex; gap: 12px; color: #909399; font-size: 13px; margin-bottom: 12px; }
.workflow-actions { display: flex; align-items: center; justify-content: space-between; }
.workflow-actions .el-button { margin-left: 4px; }
</style>