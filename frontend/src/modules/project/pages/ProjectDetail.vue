<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectDetail.vue
  功能: 项目详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>{{ project.name }}</h2>
          <p class="subtitle">项目编号: {{ project.projectNo }}</p>
        </div>
        <div>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
          <el-button type="success" @click="handleComplete" v-if="project.status === 'active'"><el-icon><Check /></el-icon> 完成</el-button>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>项目信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="项目编号">{{ project.projectNo }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="project.status === 'active' ? 'success' : project.status === 'planning' ? 'info' : 'primary'">
                {{ project.status === 'planning' ? '规划中' : project.status === 'active' ? '进行中' : '已完成' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="客户">{{ project.customer }}</el-descriptions-item>
            <el-descriptions-item label="优先级">
              <el-tag :type="project.priority === 'high' ? 'danger' : project.priority === 'medium' ? 'warning' : 'info'">
                {{ project.priority === 'high' ? '高' : project.priority === 'medium' ? '中' : '低' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="预算">{{ formatCurrency(project.budget) }}</el-descriptions-item>
            <el-descriptions-item label="已花费">{{ formatCurrency(project.spent) }}</el-descriptions-item>
            <el-descriptions-item label="开始日期">{{ project.startDate }}</el-descriptions-item>
            <el-descriptions-item label="截止日期">{{ project.deadline }}</el-descriptions-item>
            <el-descriptions-item label="项目经理">{{ project.projectManager }}</el-descriptions-item>
            <el-descriptions-item label="进度" :span="2">
              <el-progress :percentage="project.progress" :color="project.progress === 100 ? '#67C23A' : '#409EFF'" />
            </el-descriptions-item>
            <el-descriptions-item label="项目描述" :span="2">{{ project.description }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>项目团队</span></template>
          <div v-for="member in team" :key="member.name" class="team-member">
            <el-avatar :size="32" icon="UserFilled" />
            <div class="member-info">
              <div class="member-name">{{ member.name }}</div>
              <div class="member-role">{{ member.role }}</div>
            </div>
            <el-tag size="small" :type="member.status === 'active' ? 'success' : 'info'">
              {{ member.status === 'active' ? '在线' : '离线' }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>项目任务</span>
          <el-button type="primary" size="small" @click="handleAddTask"><el-icon><Plus /></el-icon> 添加任务</el-button>
        </div>
      </template>
      <el-table :data="tasks" style="width: 100%" stripe>
        <el-table-column prop="taskNo" label="任务编号" width="120" />
        <el-table-column prop="name" label="任务名称" />
        <el-table-column prop="assignee" label="负责人" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'done' ? 'success' : row.status === 'doing' ? 'warning' : 'info'">
              {{ row.status === '"deadline" label="截止日期" width="120" />
        <el-table-column label="操作" align="center" width="150">
          <el-button type="primary" size="small">查看</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserFilled, Check, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const project = ref({
  projectNo: 'PRJ-2024-001',
  name: 'STC 5G网络升级',
  customer: '沙特电信公司',
  budget: 5000000,
  spent: 3800000,
  progress: 76,
  priority: 'high',
  status: 'active',
  startDate: '2024-08-01',
  deadline: '2024-12-20',
  projectManager: 'Ahmed Al-Fahd',
  description: 'STC 5G网络基础设施升级项目，覆盖利雅得、吉达、达曼三城市',
})

const team = ref([
  { name: 'Ahmed Al-Fahd', role: '项目经理', status: 'active' },
  { name: 'Mohammed Al-Qahtani', role: '技术架构师', status: 'active' },
  { name: 'Saud Al-Otaibi', role: '开发工程师', status: 'active' },
  { name: 'Faisal Al-Dossary', role: '运维工程师', status: 'offline' },
])

const tasks = ref([
  { taskNo: 'TSK-001', name: '需求分析', assignee: 'Ahmed Al-Fahd', status: 'done', deadline: '2024-08-15' },
  { taskNo: 'TSK-002', name: '系统设计', assignee: 'Mohammed Al-Qahtani', status: 'done', deadline: '2024-09-15' },
  { taskNo: 'TSK-003', name: '开发实施', assignee: 'Saud Al-Otaibi', status: 'doing', deadline: '2024-11-15' },
  { taskNo: 'TSK-004', name: '测试部署', assignee: 'Faisal Al-Dossary', status: '
