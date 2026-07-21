<!-- 
  文件路径: frontend/src/modules/customers/pages/CustomerFollowup.vue
  功能: 客户跟进 - 管理客户跟进记录
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="跟进人">
              <el-select v-model="searchForm.followupBy" placeholder="请选择跟进人" clearable style="width: 100%">
                <el-option label="Ahmed Al-Fahd" value="ahmed" />
                <el-option label="Mohammed Al-Qahtani" value="mohammed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期范围">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增跟进</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 跟进统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in followupStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-timeline>
        <el-timeline-item
          v-for="item in tableData"
          :key="item.id"
          :timestamp="item.followupDate"
          :type="item.type"
          placement="top"
        >
          <el-card>
            <div class="followup-header">
              <span class="followup-customer">{{ item.customer }}</span>
              <span class="followup-by">跟进人: {{ item.followupBy }}</span>
              <el-tag :type="item.status === 'completed' ? 'success' : 'warning'" size="small">
                {{ item.status === 'completed' ? '已完成' : '待跟进' }}
              </el-tag>
            </div>
            <div class="followup-content">{{ item.content }}</div>
            <div class="followup-next" v-if="item.nextPlan">下一步: {{ item.nextPlan }}</div>
            <div class="followup-actions">
              <el-button type="primary" size="small" @click="handleDetail(item)">查看</el-button>
              <el-button type="warning" size="small" @click="handleComplete(item)" v-if="item.status === 'pending'">完成</el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-pagination
        v-model:page-size="pagination.pageSize"
        v-model:current-page="pagination.currentPage"
        :total="pagination.total"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ customer: '', followupBy: '', dateRange: [] as [Date, Date] | [] })
const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })

const followupStats = ref([
  { label: '总跟进次数', value: '186', type: 'primary' },
  { label: '待跟进', value: '28', type: 'warning' },
  { label: '已完成', value: '158', type: 'success' },
  { label: '跟进转化率', value: '85%', type: 'primary' },
])

const tableData = ref([
  { id: 1, customer: '沙特电信公司', followupBy: 'Ahmed Al-Fahd', followupDate: '2024-11-20 10:30', content: '产品演示，客户对新功能感兴趣，预计下月签约', nextPlan: '发送产品报价单', status: 'completed', type: 'success' },
  { id: 2, customer: '阿尔拉吉银行', followupBy: 'Mohammed Al-Qahtani', followupDate: '2024-11-19 14:20', content: '电话沟通，确认采购需求，需要技术方案', nextPlan: '准备技术方案', status: 'pending', type: 'warning' },
  { id: 3, customer: '沙特阿美', followupBy: 'Saud Al-Otaibi', followupDate: '2024-11-18 09:00', content: '现场拜访，了解客户痛点，达成初步意向', nextPlan: '安排产品演示', status: 'pending', type: 'primary' },
])

const loading = ref(false)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.customer = ''; searchForm.followupBy = ''; searchForm.dateRange = [] }
const handleCreate = () => { ElMessage.info('新增跟进记录') }
const handleDetail = (row: any) => { ElMessage.info(`查看跟进: ${row.customer}`) }
const handleComplete = (row: any) => {
  ElMessageBox.confirm(`确认完成 ${row.customer} 的跟进？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'completed'; ElMessage.success('跟进已完成') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.followup-header { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.followup-customer { font-weight: 600; font-size: 16px; }
.followup-by { color: #909399; font-size: 13px; }
.followup-content { margin: 8px 0; color: #606266; }
.followup-next { color: #409EFF; font-size: 13px; margin-bottom: 8px; }
.followup-actions { display: flex; gap: 8px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>