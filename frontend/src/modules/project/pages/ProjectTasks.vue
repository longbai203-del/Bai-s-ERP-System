<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectTasks.vue
  功能: 任务管理 - 项目任务管理
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="任务名称">
              <el-input v-model="searchForm.name" placeholder="请输入任务名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待办" value="" />
                <el-option label="进行中" value="doing" />
                <el-option label="已完成" value="done" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建任务</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="taskNo" label="任务编号" width="120" />
        <el-table-column prop="name" label="任务名称" min-width="160" />
        <el-table-column prop="project" label="所属项目" />
        <el-table-column prop="assignee" label="负责人" />
        <el-table-column prop="priority" label="优先级" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'info'">
              {{ row.priority === 'high' ? '高' : row.priority === 'medium' ? '中' : '低' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'done' ? 'success' : row.status === 'doing' ? 'warning' : 'info'">
              {{ row.status === '"deadline" label="截止日期" width="120" />
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleComplete(row)" v-if="row.status !== 'done'"><el-icon><Check /></el-icon> 完成</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, taskNo: 'TSK-001', name: '需求分析', project: 'STC 5G网络升级', assignee: 'Ahmed Al-Fahd', priority: 'high', status: 'done', deadline: '2024-08-15' },
  { id: 2, taskNo: 'TSK-003', name: '开发实施', project: 'STC 5G网络升级', assignee: 'Saud Al-Otaibi', priority: 'high', status: 'doing', deadline: '2024-11-15' },
  { id: 3, taskNo: 'TSK-005', name: '接口对接', project: '阿尔拉吉银行核心系统', assignee: 'Faisal Al-Dossary', priority: 'medium', status: '
