<!-- 
  文件路径: frontend/src/modules/hr/pages/ShiftManagement.vue
  功能: 排班管理 - 管理员工排班
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="部门">
              <el-select v-model="searchForm.department" placeholder="请选择部门" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="销售部" value="销售部" />
                <el-option label="采购部" value="采购部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="周期">
              <el-date-picker v-model="searchForm.week" type="week" placeholder="选择周" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 生成排班</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div class="shift-grid">
        <el-row class="shift-header">
          <el-col :span="4">员工</el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="4" v-for="day in days" :key="day">{{ day }}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row v-for="row in tableData" :key="row.id" class="shift-row">
          <el-col :span="4" class="shift-name">{{ row.name }}</el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="4" v-for="(shift, index) in row.shifts" :key="index">
                <el-select v-model="row.shifts[index]" placeholder="排班" size="small" style="width: 100%">
                  <el-option label="早班" value="早班" />
                  <el-option label="中班" value="中班" />
                  <el-option label="晚班" value="晚班" />
                  <el-option label="休息" value="休息" />
                </el-select>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div style="margin-top: 16px; text-align: right;">
          <el-button type="primary" @click="handleSave">保存排班</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ department: 'all', week: new Date() })
const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const tableData = ref([
  { id: 1, name: 'Ahmed Al-Fahd', shifts: ['早班', '早班', '中班', '中班', '早班', '休息', '休息'] },
  { id: 2, name: 'Mohammed Al-Qahtani', shifts: ['中班', '中班', '晚班', '晚班', '中班', '休息', '休息'] },
  { id: 3, name: 'Saud Al-Otaibi', shifts: ['早班', '休息', '早班', '早班', '中班', '中班', '休息'] },
])

const handleSearch = () => { ElMessage.success('查询完成') }
const handleReset = () => { searchForm.department = 'all' }
const handleCreate = () => { ElMessage.info('生成排班') }
const handleSave = () => { ElMessage.success('排班已保存') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.shift-grid { overflow-x: auto; }
.shift-header { background: #f5f7fa; padding: 8px 0; font-weight: 600; border-radius: 4px; }
.shift-row { padding: 8px 0; border-bottom: 1px solid #ebeef5; }
.shift-row:hover { background: #fafafa; }
.shift-name { font-weight: 500; display: flex; align-items: center; padding-left: 8px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>