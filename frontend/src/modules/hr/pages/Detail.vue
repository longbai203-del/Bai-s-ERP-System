<!--
  文件路径: frontend/src/modules/hr/pages/Detail.vue
  功能: HR记录详情 - 查看完整的员工档案信息
  包含: 个人信息、工作信息、合同信息、证件信息、教育经历、家庭成员、考勤记录、绩效记录
-->

<template>
  <div class="hr-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-info">
          <h1 class="page-title">👤 员工档案详情</h1>
          <p class="page-subtitle">查看完整的员工信息与档案</p>
        </div>
      </div>
      <div class="header-right">
        <el-button type="warning" @click="handleEdit">
          <el-icon><Edit /></el-icon> 编辑
        </el-button>
        <el-button type="danger" @click="handleDelete">
          <el-icon><Delete /></el-icon> 删除
        </el-button>
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon> 导出PDF
        </el-button>
        <el-button @click="handlePrint">
          <el-icon><Printer /></el-icon> 打印
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <template v-else>
      <!-- 员工头像与概览 -->
      <el-card class="profile-card" shadow="hover">
        <div class="profile-header">
          <div class="profile-avatar">
            <el-avatar :size="100" :src="employeeData.avatar" icon="UserFilled">
              <img :src="employeeData.avatar" alt="avatar" />
            </el-avatar>
            <div class="avatar-actions">
              <el-button size="small" @click="handleChangeAvatar">
                <el-icon><Camera /></el-icon> 更换
              </el-button>
            </div>
          </div>
          <div class="profile-info">
            <div class="profile-name-wrapper">
              <h2 class="profile-name">{{ employeeData.name }}</h2>
              <el-tag :type="getStatusType(employeeData.status)" size="large" effect="dark">
                {{ getStatusLabel(employeeData.status) }}
              </el-tag>
            </div>
            <div class="profile-tags">
              <el-tag type="primary" size="large">{{ employeeData.employeeNo }}</el-tag>
              <el-tag type="success" size="large">{{ employeeData.department }}</el-tag>
              <el-tag type="warning" size="large">{{ employeeData.position }}</el-tag>
              <el-tag type="info" size="large" v-if="employeeData.jobLevel">{{ employeeData.jobLevel }}</el-tag>
            </div>
            <div class="profile-meta">
              <span><el-icon><Calendar /></el-icon> 入职: {{ employeeData.hireDate }}</span>
              <span><el-icon><Clock /></el-icon> 工龄: {{ calculateTenure(employeeData.hireDate) }}</span>
              <span><el-icon><Phone /></el-icon> {{ employeeData.phone }}</span>
              <span><el-icon><Message /></el-icon> {{ employeeData.email || employeeData.workEmail }}</span>
              <span><el-icon><Location /></el-icon> {{ employeeData.workLocation || employeeData.address }}</span>
            </div>
          </div>
          <div class="profile-actions">
            <el-button type="primary" @click="handleQuickAction('message')">
              <el-icon><ChatDotRound /></el-icon> 发送消息
            </el-button>
            <el-button type="warning" @click="handleQuickAction('leave')">
              <el-icon><Calendar /></el-icon> 申请休假
            </el-button>
            <el-dropdown @command="handleMoreAction">
              <el-button>
                更多 <el-icon><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="transfer">岗位调动</el-dropdown-item>
                  <el-dropdown-item command="promotion">晋升</el-dropdown-item>
                  <el-dropdown-item command="terminate">终止合同</el-dropdown-item>
                  <el-dropdown-item command="resignation" divided>申请离职</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-card>

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stat-row">
        <el-col :xs="12" :sm="6" v-for="stat in detailStats" :key="stat.label">
          <el-card class="stat-card" :class="stat.type" shadow="hover">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-unit">{{ stat.unit }}</div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 详细信息标签页 -->
      <el-card class="detail-card" shadow="hover">
        <el-tabs v-model="activeTab" class="detail-tabs">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions :column="3" border>
              <el-descriptions-item label="员工编号">{{ employeeData.employeeNo }}</el-descriptions-item>
              <el-descriptions-item label="姓名">{{ employeeData.name }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ employeeData.gender }}</el-descriptions-item>
              <el-descriptions-item label="出生日期">{{ employeeData.birthDate }}</el-descriptions-item>
              <el-descriptions-item label="国籍">{{ employeeData.nationality }}</el-descriptions-item>
              <el-descriptions-item label="身份证/Iqama">{{ employeeData.idNumber }}</el-descriptions-item>
              <el-descriptions-item label="婚姻状况">{{ employeeData.maritalStatus || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="宗教信仰">{{ employeeData.religion || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{ employeeData.phone }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ employeeData.email || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="工作邮箱">{{ employeeData.workEmail || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="住址" :span="3">{{ employeeData.address || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="紧急联系人" :span="3">
                <span v-if="employeeData.emergencyName">
                  {{ employeeData.emergencyName }} ({{ employeeData.emergencyRelation || '未设置' }}) -
                  {{ employeeData.emergencyPhone || '未设置' }}
                </span>
                <span v-else>未设置</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- 工作信息 -->
          <el-tab-pane label="工作信息" name="work">
            <el-descriptions :column="3" border>
              <el-descriptions-item label="部门">{{ employeeData.department }}</el-descriptions-item>
              <el-descriptions-item label="职位">{{ employeeData.position }}</el-descriptions-item>
              <el-descriptions-item label="职级">{{ employeeData.jobLevel || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="入职日期">{{ employeeData.hireDate }}</el-descriptions-item>
              <el-descriptions-item label="转正日期">{{ employeeData.probationEndDate || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="工作状态">
                <el-tag :type="getStatusType(employeeData.status)">
                  {{ getStatusLabel(employeeData.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="直属上级">{{ employeeData.supervisor || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="工作地点">{{ employeeData.workLocation || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="工龄">{{ calculateTenure(employeeData.hireDate) }}</el-descriptions-item>
              <el-descriptions-item label="工作备注" :span="3">{{ employeeData.workRemark || '无' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- 合同与薪资 -->
          <el-tab-pane label="合同与薪资" name="contract">
            <el-descriptions :column="3" border>
              <el-descriptions-item label="合同编号">{{ employeeData.contractNo || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="合同类型">{{ employeeData.contractType || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="合同期限">{{ employeeData.contractDuration || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="生效日期">{{ employeeData.contractStartDate || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="到期日期">{{ employeeData.contractEndDate || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="试用期(月)">{{ employeeData.probationPeriod || 0 }} 个月</el-descriptions-item>
              <el-descriptions-item label="基本薪资">
                <span class="salary-text">{{ formatCurrency(employeeData.basicSalary) }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="津贴">{{ formatCurrency(employeeData.allowance) }}</el-descriptions-item>
              <el-descriptions-item label="奖金/佣金">{{ formatCurrency(employeeData.bonus) }}</el-descriptions-item>
              <el-descriptions-item label="薪资周期">{{ employeeData.payCycle || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="银行名称">{{ employeeData.bankName || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="银行账号">{{ employeeData.bankAccount || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="合同备注" :span="3">{{ employeeData.contractRemark || '无' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- 证件信息 -->
          <el-tab-pane label="证件信息" name="documents">
            <el-descriptions :column="3" border>
              <el-descriptions-item label="护照号码">{{ employeeData.passportNumber || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="护照签发国">{{ employeeData.passportCountry || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="护照有效期">
                <span :class="getExpiryClass(employeeData.passportExpiry)">
                  {{ employeeData.passportExpiry || '未设置' }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="Iqama号码">{{ employeeData.iqamaNumber || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="Iqama签发日期">{{ employeeData.iqamaIssueDate || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="Iqama有效期">
                <span :class="getExpiryClass(employeeData.iqamaExpiry)">
                  {{ employeeData.iqamaExpiry || '未设置' }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="驾照号码">{{ employeeData.drivingLicense || '未设置' }}</el-descriptions-item>
              <el-descriptions-item label="驾照有效期">
                <span :class="getExpiryClass(employeeData.drivingLicenseExpiry)">
                  {{ employeeData.drivingLicenseExpiry || '未设置' }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="签证信息" :span="3">
                <el-tag v-if="employeeData.visaType" type="primary">{{ employeeData.visaType }}</el-tag>
                <span v-if="employeeData.visaNumber"> 号码: {{ employeeData.visaNumber }}</span>
                <span v-if="employeeData.visaExpiry">
                  有效期至: <span :class="getExpiryClass(employeeData.visaExpiry)">{{ employeeData.visaExpiry }}</span>
                </span>
                <span v-else>未设置</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- 教育经历 -->
          <el-tab-pane label="教育经历" name="education">
            <div v-if="employeeData.educations && employeeData.educations.length > 0">
              <el-timeline>
                <el-timeline-item
                  v-for="(edu, index) in employeeData.educations"
                  :key="index"
                  :timestamp="edu.year || '未知年份'"
                  placement="top"
                  :type="index === 0 ? 'primary' : 'info'"
                >
                  <el-card class="education-card" shadow="hover">
                    <div class="edu-degree">{{ edu.degree }}</div>
                    <div class="edu-school">{{ edu.school }}</div>
                    <div class="edu-major">{{ edu.major }}</div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
            <el-empty v-else description="暂无教育经历" />
          </el-tab-pane>

          <!-- 家庭成员 -->
          <el-tab-pane label="家庭成员" name="family">
            <div v-if="employeeData.familyMembers && employeeData.familyMembers.length > 0">
              <el-table :data="employeeData.familyMembers" border style="width: 100%">
                <el-table-column prop="name" label="姓名" width="120" />
                <el-table-column prop="relation" label="关系" width="100">
                  <template #default="{ row }">
                    <el-tag type="primary">{{ row.relation }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="phone" label="联系电话" width="150" />
                <el-table-column prop="occupation" label="职业" />
              </el-table>
            </div>
            <el-empty v-else description="暂无家庭成员" />
          </el-tab-pane>

          <!-- 考勤记录 -->
          <el-tab-pane label="考勤记录" name="attendance">
            <div class="attendance-summary">
              <el-row :gutter="16" class="attendance-stats">
                <el-col :span="6">
                  <div class="att-stat">
                    <div class="att-stat-value">22</div>
                    <div class="att-stat-label">本月出勤</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="att-stat">
                    <div class="att-stat-value">1</div>
                    <div class="att-stat-label">迟到</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="att-stat">
                    <div class="att-stat-value">0</div>
                    <div class="att-stat-label">缺勤</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="att-stat">
                    <div class="att-stat-value">95%</div>
                    <div class="att-stat-label">出勤率</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-table :data="attendanceRecords" border style="width: 100%">
              <el-table-column prop="date" label="日期" width="120" />
              <el-table-column prop="checkIn" label="签到时间" width="120" />
              <el-table-column prop="checkOut" label="签退时间" width="120" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === '正常' ? 'success' : row.status === '迟到' ? 'warning' : 'danger'">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="overtime" label="加班时长" width="100" />
              <el-table-column prop="remark" label="备注" />
            </el-table>
            <div class="table-footer">
              <el-pagination
                v-model:current-page="attendancePage"
                v-model:page-size="attendancePageSize"
                :total="attendanceTotal"
                size="small"
                layout="total, prev, pager, next"
              />
            </div>
          </el-tab-pane>

          <!-- 绩效记录 -->
          <el-tab-pane label="绩效记录" name="performance">
            <el-table :data="performanceRecords" border style="width: 100%">
              <el-table-column prop="period" label="考核周期" width="120" />
              <el-table-column prop="score" label="得分" width="100">
                <template #default="{ row }">
                  <span :style="{ color: row.score >= 90 ? '#67C23A' : row.score >= 70 ? '#E6A23C' : '#F56C6C', fontWeight: 700 }">
                    {{ row.score }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="rating" label="评级" width="100">
                <template #default="{ row }">
                  <el-tag :type="getRatingType(row.rating)">
                    {{ row.rating }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="evaluator" label="评估人" />
              <el-table-column prop="comment" label="评语" />
              <el-table-column prop="date" label="评估日期" width="120" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 操作日志 -->
      <el-card class="log-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span><el-icon><Document /></el-icon> 操作日志</span>
            <el-button size="small" @click="loadLogs">刷新</el-button>
          </div>
        </template>
        <el-timeline v-if="operationLogs.length > 0">
          <el-timeline-item
            v-for="(log, index) in operationLogs"
            :key="index"
            :timestamp="log.time"
            :type="log.type"
            size="large"
          >
            <div class="log-content">
              <span class="log-user">{{ log.user }}</span>
              <span class="log-action">{{ log.action }}</span>
              <span class="log-detail">{{ log.detail }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无操作日志" :image-size="60" />
      </el-card>
    </template>

    <!-- 删除确认对话框 -->
    <el-dialog v-model="showDeleteDialog" title="⚠️ 确认删除" width="440px">
      <div class="delete-content">
        <el-icon class="delete-icon" :size="48"><WarningFilled /></el-icon>
        <p>您确定要删除员工 <strong>{{ employeeData.name }}</strong> 的全部档案吗？</p>
        <p class="delete-warning">此操作不可恢复，将删除所有相关数据</p>
        <el-input
          v-model="deleteConfirmText"
          placeholder="请输入员工姓名以确认删除"
          style="margin-top: 12px"
        />
      </div>
      <template #footer>
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button
          type="danger"
          :disabled="deleteConfirmText !== employeeData.name"
          @click="confirmDelete"
        >
          确认删除
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, ArrowDown, Edit, Delete, Download, Printer, Camera,
  Calendar, Clock, Phone, Message, Location, ChatDotRound,
  UserFilled, Document, WarningFilled, Search, Plus, Refresh,
  Check, Close, CircleCheck, CircleClose, Files, Setting,
  Grid, Promotion, Tickets, DataLine, User, Service, School,
  Briefcase, HomeFilled, Reading, Money, OfficeBuilding, Menu
} from '@element-plus/icons-vue'

// ==================== Router ====================
const route = useRoute()
const router = useRouter()

// ==================== 状态变量 ====================
const loading = ref(true)
const activeTab = ref('basic')
const showDeleteDialog = ref(false)
const deleteConfirmText = ref('')
const attendancePage = ref(1)
const attendancePageSize = ref(5)
const attendanceTotal = ref(15)

// ==================== 员工数据 ====================
const employeeData = ref({
  id: '1',
  employeeNo: 'EMP-001',
  name: 'Ahmed Al-Fahd',
  gender: '男',
  birthDate: '1985-06-15',
  nationality: '沙特阿拉伯',
  idNumber: 'SA-1234567890',
  phone: '+966 50 123 4567',
  email: 'ahmed@company.com',
  maritalStatus: '已婚',
  religion: '伊斯兰教',
  address: '利雅得 Al Olaya 区 1234 号',
  emergencyName: 'Fatima Al-Fahd',
  emergencyPhone: '+966 50 987 6543',
  emergencyRelation: '妻子',
  department: '销售部',
  position: '销售经理',
  jobLevel: '经理级',
  hireDate: '2020-01-15',
  probationEndDate: '2020-04-15',
  status: 'active',
  supervisor: 'Mohammed Al-Qahtani',
  workLocation: '利雅得总部',
  workEmail: 'ahmed.alfahd@company.com',
  workRemark: '优秀销售业绩，连续两年获得最佳员工奖',
  contractNo: 'CT-2020-001',
  contractType: '全职',
  contractDuration: '无限期',
  contractStartDate: '2020-01-15',
  contractEndDate: '无限期',
  probationPeriod: 3,
  basicSalary: 25000,
  allowance: 3000,
  bonus: 5000,
  payCycle: '月薪',
  bankName: '沙特国家银行',
  bankAccount: 'SA-1234-5678-9012-3456',
  contractRemark: '优秀员工，合同自动续期',
  passportNumber: 'P-123456789',
  passportCountry: '沙特阿拉伯',
  passportExpiry: '2026-06-15',
  iqamaNumber: 'SA-1234567890',
  iqamaIssueDate: '2023-01-15',
  iqamaExpiry: '2025-01-14',
  drivingLicense: 'D-987654321',
  drivingLicenseExpiry: '2025-12-31',
  visaType: '工作签证',
  visaNumber: 'V-123456',
  visaExpiry: '2025-06-15',
  avatar: '',
  educations: [
    { school: '利雅得大学', major: '工商管理', degree: '学士', year: 2010 },
    { school: '利雅得商学院', major: '市场营销', degree: '硕士', year: 2012 }
  ],
  familyMembers: [
    { name: 'Fatima Al-Fahd', relation: '配偶', phone: '+966 50 987 6543', occupation: '教师' },
    { name: 'Sara Al-Fahd', relation: '子女', phone: '+966 50 111 2222', occupation: '学生' }
  ]
})

// ==================== 统计数据 ====================
const detailStats = ref([
  { label: '工龄', value: '3.8', unit: '年', type: 'primary' },
  { label: '出勤率', value: '96', unit: '%', type: 'success' },
  { label: '绩效评分', value: '92', unit: '分', type: 'warning' },
  { label: '年假剩余', value: '12', unit: '天', type: 'info' }
])

// ==================== 考勤记录 ====================
const attendanceRecords = ref([
  { date: '2026-07-22', checkIn: '08:45', checkOut: '17:30', status: '正常', overtime: '1.5h', remark: '' },
  { date: '2026-07-21', checkIn: '09:10', checkOut: '18:00', status: '迟到', overtime: '2h', remark: '交通堵塞' },
  { date: '2026-07-20', checkIn: '08:30', checkOut: '17:00', status: '正常', overtime: '0h', remark: '' },
  { date: '2026-07-19', checkIn: '08:50', checkOut: '17:45', status: '正常', overtime: '1h', remark: '' },
  { date: '2026-07-18', checkIn: '08:20', checkOut: '17:00', status: '正常', overtime: '0h', remark: '' }
])

// ==================== 绩效记录 ====================
const performanceRecords = ref([
  { period: '2026 Q2', score: 95, rating: 'A', evaluator: 'Mohammed Al-Qahtani', comment: '超出预期，表现卓越', date: '2026-06-30' },
  { period: '2026 Q1', score: 88, rating: 'B', evaluator: 'Mohammed Al-Qahtani', comment: '表现良好，持续进步', date: '2026-03-31' },
  { period: '2025 Q4', score: 92, rating: 'A', evaluator: 'Mohammed Al-Qahtani', comment: '优秀业绩，团队领导力突出', date: '2025-12-31' }
])

// ==================== 操作日志 ====================
const operationLogs = ref([
  { time: '2026-07-22 10:30', user: 'Admin', action: '查看档案', detail: '浏览员工详细信息', type: 'info' },
  { time: '2026-07-21 16:20', user: 'HR Manager', action: '更新信息', detail: '修改了工作邮箱', type: 'primary' },
  { time: '2026-07-20 09:15', user: 'Admin', action: '上传文件', detail: '上传了员工合同扫描件', type: 'success' },
  { time: '2026-07-19 14:00', user: 'HR Manager', action: '审核', detail: '通过了季度绩效评估', type: 'warning' }
])

// ==================== 方法 ====================
// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    if (id) {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      // 如果有ID，可以加载不同数据
      if (id === 'EMP-001') {
        // 使用默认数据
      }
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    active: 'success',
    probation: 'warning',
    pending: 'info',
    resigned: 'danger'
  }
  return map[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    active: '在职',
    probation: '试用期',
    pending: '待入职',
    resigned: '已离职'
  }
  return map[status] || '未知'
}

// 获取评级类型
const getRatingType = (rating: string) => {
  const map: Record<string, string> = {
    'A': 'success',
    'B': 'primary',
    'C': 'warning',
    'D': 'danger'
  }
  return map[rating] || 'info'
}

// 计算工龄
const calculateTenure = (hireDate: string) => {
  if (!hireDate) return '未知'
  const start = new Date(hireDate)
  const now = new Date()
  const years = now.getFullYear() - start.getFullYear()
  const months = now.getMonth() - start.getMonth()
  if (months < 0) {
    return `${years - 1}年${12 + months}个月`
  }
  return `${years}年${months}个月`
}

// 格式化货币
const formatCurrency = (value: number) => {
  if (!value) return 'SAR 0'
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0
  }).format(value)
}

// 获取有效期样式
const getExpiryClass = (date: string) => {
  if (!date) return ''
  const now = new Date()
  const expiry = new Date(date)
  const daysDiff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  if (daysDiff < 0) return 'expired-text'
  if (daysDiff < 60) return 'expiring-text'
  return ''
}

// 返回
const handleBack = () => {
  router.push('/hr')
}

// 编辑
const handleEdit = () => {
  const id = route.params.id as string || '1'
  router.push(`/hr/edit/${id}`)
}

// 删除
const handleDelete = () => {
  showDeleteDialog.value = true
}

// 确认删除
const confirmDelete = () => {
  if (deleteConfirmText.value === employeeData.value.name) {
    ElMessage.success('员工档案已删除')
    showDeleteDialog.value = false
    router.push('/hr')
  } else {
    ElMessage.warning('请输入正确的员工姓名')
  }
}

// 导出PDF
const handleExport = () => {
  ElMessage.success('正在生成PDF报告...')
  setTimeout(() => {
    ElMessage.success('PDF报告已导出')
  }, 1500)
}

// 打印
const handlePrint = () => {
  window.print()
}

// 更换头像
const handleChangeAvatar = () => {
  ElMessage.info('上传新头像')
}

// 快捷操作
const handleQuickAction = (action: string) => {
  const actions: Record<string, string> = {
    message: '发送消息给',
    leave: '为 申请休假'
  }
  ElMessage.info(`${actions[action] || '操作'} ${employeeData.value.name}`)
}

// 更多操作
const handleMoreAction = (command: string) => {
  const actions: Record<string, string> = {
    transfer: '岗位调动',
    promotion: '晋升',
    terminate: '终止合同',
    resignation: '申请离职'
  }
  ElMessage.info(`${actions[command] || '操作'} ${employeeData.value.name}`)
}

// 加载日志
const loadLogs = () => {
  ElMessage.success('日志已刷新')
}

// ==================== 生命周期 ====================
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* ==================== 全局容器 ==================== */
.hr-detail-page {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* ==================== 页面头部 ==================== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
}

.page-subtitle {
  margin: 2px 0 0 0;
  color: #909399;
  font-size: 13px;
}

.header-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ==================== 加载状态 ==================== */
.loading-container {
  padding: 40px;
  background: white;
  border-radius: 12px;
}

/* ==================== 个人资料卡片 ==================== */
.profile-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.profile-avatar {
  text-align: center;
  flex-shrink: 0;
}

.avatar-actions {
  margin-top: 8px;
}

.profile-info {
  flex: 1;
  min-width: 200px;
}

.profile-name-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.profile-name {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
}

.profile-tags {
  margin: 8px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.profile-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  color: #606266;
  font-size: 14px;
}

.profile-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.profile-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ==================== 统计卡片 ==================== */
.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  border-radius: 12px;
  padding: 12px 8px;
}

.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.info { border-left: 4px solid #909399; }

.stat-label {
  font-size: 13px;
  color: #909399;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
}

.stat-unit {
  font-size: 12px;
  color: #909399;
}

/* ==================== 详情卡片 ==================== */
.detail-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.detail-tabs :deep(.el-tabs__content) {
  padding-top: 16px;
}

/* ==================== 教育经历卡片 ==================== */
.education-card {
  background: #f8f9fa;
  border: none;
}

.education-card :deep(.el-card__body) {
  padding: 12px 16px;
}

.edu-degree {
  font-weight: 600;
  color: #409EFF;
  font-size: 16px;
}

.edu-school {
  font-weight: 500;
  color: #303133;
}

.edu-major {
  color: #606266;
  font-size: 13px;
}

/* ==================== 考勤统计 ==================== */
.attendance-summary {
  margin-bottom: 16px;
}

.attendance-stats {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px;
}

.att-stat {
  text-align: center;
}

.att-stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.att-stat-label {
  font-size: 13px;
  color: #909399;
}

/* ==================== 表格底部 ==================== */
.table-footer {
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
  margin-top: 12px;
}

/* ==================== 操作日志 ==================== */
.log-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-content {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.log-user {
  font-weight: 600;
  color: #409EFF;
}

.log-action {
  color: #303133;
}

.log-detail {
  color: #909399;
}

/* ==================== 删除对话框 ==================== */
.delete-content {
  text-align: center;
}

.delete-icon {
  color: #F56C6C;
  margin-bottom: 12px;
}

.delete-warning {
  color: #F56C6C;
  font-size: 13px;
}

/* ==================== 过期样式 ==================== */
.expired-text {
  color: #F56C6C !important;
  font-weight: 700;
}

.expiring-text {
  color: #E6A23C !important;
  font-weight: 600;
}

.salary-text {
  font-weight: 600;
  color: #409EFF;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .hr-detail-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
  }

  .header-right .el-button {
    flex: 1;
    font-size: 12px;
    padding: 8px 12px;
  }

  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-name-wrapper {
    justify-content: center;
  }

  .profile-tags {
    justify-content: center;
  }

  .profile-meta {
    justify-content: center;
  }

  .profile-actions {
    margin-left: 0;
    justify-content: center;
  }

  .profile-actions .el-button {
    font-size: 12px;
    padding: 8px 14px;
  }

  .stat-card .stat-value {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }

  .profile-name {
    font-size: 20px;
  }

  .profile-tags .el-tag {
    font-size: 12px;
  }

  .profile-meta {
    font-size: 12px;
    gap: 8px;
  }

  .attendance-stats .el-col {
    margin-bottom: 8px;
  }

  .att-stat-value {
    font-size: 18px;
  }

  .detail-tabs :deep(.el-tabs__item) {
    font-size: 13px;
    padding: 0 12px;
  }

  .log-content {
    font-size: 13px;
  }
}

/* ==================== 打印样式 ==================== */
@media print {
  .hr-detail-page {
    background: white;
    padding: 16px;
  }

  .page-header .header-right,
  .profile-actions,
  .avatar-actions,
  .log-card,
  .back-btn {
    display: none !important;
  }

  .stat-card {
    border: 1px solid #dcdfe6 !important;
  }

  .profile-header {
    padding: 16px 0;
  }

  .detail-card {
    box-shadow: none !important;
    border: 1px solid #dcdfe6;
  }
}
</style>