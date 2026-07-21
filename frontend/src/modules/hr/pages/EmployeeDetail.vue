<!-- 
  文件路径: frontend/src/modules/hr/pages/EmployeeDetail.vue
  功能: 员工详情
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="profile-header">
        <div class="profile-avatar">
          <el-avatar :size="80" icon="UserFilled" />
        </div>
        <div class="profile-info">
          <h2>{{ employee.name }}</h2>
          <div class="profile-tags">
            <el-tag>{{ employee.position }}</el-tag>
            <el-tag type="primary">{{ employee.department }}</el-tag>
            <el-tag :type="employee.status === 'active' ? 'success' : 'warning'">
              {{ employee.status === 'active' ? '在职' : '试用期' }}
            </el-tag>
          </div>
          <div class="profile-meta">
            <span><el-icon><Phone /></el-icon> {{ employee.phone }}</span>
            <span><el-icon><Message /></el-icon> {{ employee.email }}</span>
            <span><el-icon><User /></el-icon> 员工编号: {{ employee.employeeNo }}</span>
          </div>
        </div>
        <div class="profile-actions">
          <el-button type="primary" @click="handleEdit"><el-icon><Edit /></el-icon> 编辑</el-button>
          <el-button type="warning" @click="handleLeave"><el-icon><Switch /></el-icon> 离职</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header><span>员工信息</span></template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="姓名">{{ employee.name }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ employee.gender }}</el-descriptions-item>
            <el-descriptions-item label="国籍">{{ employee.nationality }}</el-descriptions-item>
            <el-descriptions-item label="身份证/Iqama">{{ employee.idNumber }}</el-descriptions-item>
            <el-descriptions-item label="出生日期">{{ employee.birthDate }}</el-descriptions-item>
            <el-descriptions-item label="婚姻状况">{{ employee.maritalStatus }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ employee.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ employee.email }}</el-descriptions-item>
            <el-descriptions-item label="住址" :span="2">{{ employee.address }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>工作信息</span></template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="部门">{{ employee.department }}</el-descriptions-item>
            <el-descriptions-item label="职位">{{ employee.position }}</el-descriptions-item>
            <el-descriptions-item label="入职日期">{{ employee.hireDate }}</el-descriptions-item>
            <el-descriptions-item label="薪资">{{ formatCurrency(employee.salary) }}</el-descriptions-item>
            <el-descriptions-item label="直属上级">{{ employee.supervisor }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header><span>考勤记录</span></template>
      <el-table :data="attendanceData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="checkIn" label="签到" width="120" />
        <el-table-column prop="checkOut" label="签退" width="120" />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="overtime" label="加班时长" align="center" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserFilled, Phone, Message, User, Edit, Switch } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const employee = ref({
  employeeNo: 'EMP-001',
  name: 'Ahmed Al-Fahd',
  gender: '男',
  nationality: '沙特阿拉伯',
  idNumber: 'SA-1234567890',
  birthDate: '1985-06-15',
  maritalStatus: '已婚',
  phone: '+966 50 123 4567',
  email: 'ahmed@company.com',
  address: '利雅得，沙特阿拉伯',
  department: '销售部',
  position: '销售经理',
  hireDate: '2020-01-15',
  salary: 25000,
  supervisor: 'Mohammed Al-Qahtani',
  status: 'active',
})

const attendanceData = ref([
  { date: '2024-11-20', checkIn: '08:45', checkOut: '17:30', status: '正常', overtime: '1.5h' },
  { date: '2024-11-19', checkIn: '09:10', checkOut: '18:00', status: '迟到', overtime: '2h' },
  { date: '2024-11-18', checkIn: '08:30', checkOut: '17:00', status: '正常', overtime: '0h' },
])

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
}

const handleEdit = () => { router.push('/hr/employees/edit/1') }
const handleLeave = () => {
  ElMessageBox.confirm(`确认 ${employee.value.name} 离职？`, '提示', { confirmButtonText: '确认离职', cancelButtonText: '取消', type: 'warning' })
    .then(() => { ElMessage.success('离职处理完成') }).catch(() => {})
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.profile-header { display: flex; align-items: center; gap: 24px; }
.profile-info h2 { margin: 0; font-size: 22px; }
.profile-tags { margin: 8px 0; display: flex; gap: 8px; }
.profile-meta { display: flex; gap: 20px; color: #909399; font-size: 14px; }
.profile-meta span { display: flex; align-items: center; gap: 4px; }
.profile-actions { margin-left: auto; display: flex; gap: 8px; }
</style>