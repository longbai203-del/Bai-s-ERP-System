<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectTimeline.vue
  功能: 项目时间线 - 项目关键时间节点
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
              <el-button type="primary" @click="handleAdd" style="float: right"><el-icon><Plus /></el-icon> 添加节点</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-timeline>
        <el-timeline-item
          v-for="item in timelineData"
          :key="item.id"
          :timestamp="item.date"
          :type="item.type"
          :icon="item.icon"
          placement="top"
        >
          <el-card>
            <div class="timeline-header">
              <span class="timeline-title">{{ item.title }}</span>
              <el-tag :type="item.status === 'completed' ? 'success' : item.status === 'active' ? 'warning' : 'info'">
                {{ item.status === 'completed' ? '已完成' : item.status === 'active' ? '进行中' : '待开始' }}
              </el-tag>
            </div>
            <div class="timeline-desc">{{ item.description }}</div>
            <div class="timeline-meta">
              <span>负责人: {{ item.assignee }}</span>
              <span v-if="item.deliverable">交付物: {{ item.deliverable }}</span>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ project: '' })

const timelineData = ref([
  {
    id: 1,
    date: '2024-08-01',
    title: '项目启动',
    description: '项目正式启动，召开启动会议',
    assignee: 'Ahmed Al-Fahd',
    deliverable: '项目章程',
    status: 'completed',
    type: 'success',
    icon: 'Check',
  },
  {
    id: 2,
    date: '2024-08-15',
    title: '需求分析完成',
    description: '完成需求调研和分析，输出需求规格说明书',
    assignee: 'Mohammed Al-Qahtani',
    deliverable: '需求规格说明书',
    status: 'completed',
    type: 'success',
    icon: 'Check',
  },
  {
    id: 3,
    date: '2024-09-15',
    title: '系统设计完成',
    description: '完成系统架构设计和技术方案',
    assignee: 'Saud Al-Otaibi',
    deliverable: '系统设计文档',
    status: 'completed',
    type: 'success',
    icon: 'Check',
  },
  {
    id: 4,
    date: '2024-11-15',
    title: '开发完成',
    description: '完成所有功能开发和单元测试',
    assignee: 'Faisal Al-Dossary',
    deliverable: '可部署产品',
    status: 'active',
    type: 'warning',
    icon: 'Loading',
  },
  {
    id: 5,
    date: '2024-12-20',
    title: '项目验收',
    description: '客户验收和项目交付',
    assignee: 'Ahmed Al-Fahd',
    deliverable: '验收报告',
    status: 'pending',
    type: 'primary',
    icon: 'Edit',
  },
])

const handleSearch = () => { ElMessage.success('查询完成') }
const handleReset = () => { searchForm.project = '' }
const handleAdd = () => { ElMessage.info('添加时间节点') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.timeline-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.timeline-title { font-size: 16px; font-weight: 600; }
.timeline-desc { color: #606266; margin-bottom: 8px; }
.timeline-meta { display: flex; gap: 20px; color: #909399; font-size: 13px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>