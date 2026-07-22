<!-- 
  文件路径: frontend/src/modules/approval/pages/ApprovalDashboard.vue
  功能: 审批中心 - 审批中心首页
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>审批中心</h3>
        <el-button type="primary" @click="handleCreate"><el-icon><Plus /></el-icon> 发起审批</el-button>
      </div>
    </el-card>

    <!-- 审批统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in approvalStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type" @click="handleNavigate(stat.path)">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-change" :class="stat.trend">{{ stat.trend === 'up' ? '↑' : '↓' }} {{ Math.abs(stat.change) }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待办与已办 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header><span>待我审批</span></template>
          <el-table :data="pendingData" style="width: 100%" stripe>
            <el-table-column prop="title" label="审批事项" />
            <el-table-column prop="applicant" label="申请人" width="100" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="row.type === 'purchase' ? 'primary' : row.type === 'payment' ? 'warning' : row.type === 'leave' ? 'success' : 'info'">
                  {{ row.type === 'purchase' ? '采购' : row.type === 'payment' ? '付款' : row.type === 'leave' ? '请假' : '其他' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="submittedAt" label="提交时间" width="160" />
            <el-table-column label="操作" align="center" width="120">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleApprove(row)"><el-icon><Check /></el-icon> 审批</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>审批概况</span></template>
          <div class="overview-item">
            <span>今日待办</span>
            <span class="overview-value">{{ todayPending }}</span>
          </div>
          <div class="overview-item">
            <span>平均审批时长</span>
            <span class="overview-value">{{ avgDuration }}</span>
          </div>
          <div class="overview-item">
            <span>本月审批量</span>
            <span class="overview-value">{{ monthlyApprovals }}</span>
          </div>
          <div class="overview-item">
            <span>通过率</span>
            <span class="overview-value">{{ passRate }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const approvalStats = ref([
  { label: '待我审批', value: '12', change: 8.5, trend: 'up', type: 'warning', path: '/approval/my' },
  { label: '我发起的', value: '28', change: 3.2, trend: 'up', type: 'primary', path: '/approval/create' },
  { label: '已审批', value: '156', change: 12.5, trend: 'up', type: 'success', path: '/approval/detail' },
  { label: '平均耗时', value: '2.5h', change: -5.6, trend: 'down', type: 'primary', path: '' },
])

const pendingData = ref([
  { id: 1, title: '采购申请 PR-2024-001', applicant: 'Ahmed Al-Fahd', type: 'purchase', submittedAt: '2024-11-20 10:30' },
  { id: 2, title: '付款申请 PY-2024-002', applicant: 'Mohammed Al-Qahtani', type: 'payment', submittedAt: '2024-11-20 09:15' },
  { id: 3, title: '请假申请 年假', applicant: 'Saud Al-Otaibi', type: 'leave', submittedAt: '2024-11-19 14:20' },
])

const todayPending = ref('8')
const avgDuration = ref('2.5小时')
const monthlyApprovals = ref('186')
const passRate = ref('92.8%')

const handleCreate = () => { ElMessage.info('发起审批') }
const handleNavigate = (path: string) => { if (path) ElMessage.info(`跳转到: ${path}`) }
const handleApprove = (row: any) => { ElMessage.info(`审批: ${row.title}`) }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.filter-card h3 { margin: 0; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; cursor: pointer; transition: all 0.3s; padding: 12px 0; }
.stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 24px; font-weight: 700; color: #303133; margin: 4px 0; }
.stat-change { font-size: 12px; }
.stat-change.up { color: #67C23A; }
.stat-change.down { color: #F56C6C; }
.overview-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
.overview-item:last-child { border-bottom: none; }
.overview-value { font-weight: 700; color: #303133; }
</style>