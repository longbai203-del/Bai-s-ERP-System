<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectGantt.vue
  功能: 甘特图 - 项目进度可视化
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
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div class="gantt-container">
        <div class="gantt-header">
          <div class="gantt-task-header">任务名称</div>
          <div class="gantt-timeline-header">
            <div v-for="week in weeks" :key="week" class="gantt-week">{{ week }}</div>
          </div>
        </div>
        <div v-for="task in ganttData" :key="task.id" class="gantt-row">
          <div class="gantt-task">{{ task.name }}</div>
          <div class="gantt-timeline">
            <div
              v-for="week in weeks"
              :key="week"
              class="gantt-cell"
              :class="{
                'gantt-cell-active': isTaskActive(task, week),
                'gantt-cell-done': isTaskDone(task, week),
              }"
            />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ project: '' })

const weeks = ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周', '第9周', '第10周', '第11周', '第12周']

const ganttData = ref([
  { id: 1, name: '需求分析', start: 0, end: 2, done: true },
  { id: 2, name: '系统设计', start: 2, end: 5, done: true },
  { id: 3, name: '开发实施', start: 5, end: 9, done: false },
  { id: 4, name: '测试部署', start: 9, end: 11, done: false },
])

const isTaskActive = (task: any, week: string) => {
  const index = weeks.indexOf(week)
  return !task.done && index >= task.start && index < task.end
}

const isTaskDone = (task: any, week: string) => {
  const index = weeks.indexOf(week)
  return task.done && index >= task.start && index < task.end
}

const handleSearch = () => { ElMessage.success('查询完成') }
const handleReset = () => { searchForm.project = '' }
const handleExport = () => { ElMessage.success('导出完成') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.gantt-container { overflow-x: auto; }
.gantt-header { display: flex; border-bottom: 2px solid #e4e7ed; font-weight: 600; background: #f5f7fa; }
.gantt-task-header { width: 200px; padding: 12px; flex-shrink: 0; }
.gantt-timeline-header { display: flex; flex: 1; }
.gantt-week { width: 60px; padding: 12px; text-align: center; font-size: 12px; color: #606266; flex-shrink: 0; }
.gantt-row { display: flex; border-bottom: 1px solid #ebeef5; }
.gantt-task { width: 200px; padding: 12px; flex-shrink: 0; font-size: 13px; }
.gantt-timeline { display: flex; flex: 1; }
.gantt-cell { width: 60px; height: 30px; border-right: 1px solid #ebeef5; flex-shrink: 0; }
.gantt-cell-active { background: #409EFF; }
.gantt-cell-done { background: #67C23A; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>