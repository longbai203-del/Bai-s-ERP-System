<!-- 
  文件路径: frontend/src/modules/finance/pages/SaudiZatca.vue
  功能: ZATCA电子发票 - 沙特ZATCA合规管理
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>ZATCA电子发票管理</h2>
          <p class="subtitle">沙特税务总局电子发票合规</p>
        </div>
        <div>
          <el-tag type="success" size="large">✅ 已合规</el-tag>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="6" v-for="stat in zatcaStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>发票汇总</span></template>
          <el-table :data="invoiceSummary" style="width: 100%">
            <el-table-column prop="month" label="月份" />
            <el-table-column prop="count" label="发票数" align="center" />
            <el-table-column prop="total" label="总额" align="right">
              <template #default="{ row }">{{ formatCurrency(row.total) }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 'reported' ? 'success' : 'warning'">
                  {{ row.status === 'reported' ? '已上报' : '待上报' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>ZATCA配置状态</span></template>
          <div class="config-item">
            <span class="config-label">CSID证书</span>
            <el-tag type="success">✅ 已配置</el-tag>
          </div>
          <div class="config-item">
            <span class="config-label">API密钥</span>
            <el-tag type="success">✅ 已配置</el-tag>
          </div>
          <div class="config-item">
            <span class="config-label">合规状态</span>
            <el-tag type="success">✅ 已合规</el-tag>
          </div>
          <div class="config-item">
            <span class="config-label">上次同步</span>
            <span>2024-11-20 10:30</span>
          </div>
          <el-button type="primary" style="width: 100%; margin-top: 16px;" @click="handleSync">
            <el-icon><Refresh /></el-icon> 同步ZATCA
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>最近发票记录</span>
          <el-button type="primary" @click="handleGenerate"><el-icon><Plus /></el-icon> 生成电子发票</el-button>
        </div>
      </template>
      <el-table :data="recentInvoices" style="width: 100%" stripe>
        <el-table-column prop="invoiceNo" label="发票号" width="140" />
        <el-table-column prop="customer" label="客户" />
        <el-table-column prop="amount" label="金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="zatcaStatus" label="ZATCA状态" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="row.zatcaStatus === 'reported' ? 'success' : row.zatcaStatus === 'pending' ? 'warning' : 'danger'">
              {{ row.zatcaStatus === 'reported' ? '已上报' : row.zatcaStatus === 'pending' ? '待上报' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="qrCode" label="二维码" align="center">
          <template #default>
            <el-button type="primary" size="small">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleReport(row)" v-if="row.zatcaStatus === 'pending'"><el-icon><Upload /></el-icon> 上报</el-button>
            <el-button type="warning" size="small" @click="handlePreview(row)"><el-icon><View /></el-icon> 预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Refresh, Plus, Upload, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const zatcaStats = ref([
  { label: '电子发票总数', value: '856', type: 'primary' },
  { label: '已上报ZATCA', value: '720', type: 'success' },
  { label: '待上报', value: '86', type: 'warning' },
  { label: '上报失败', value: '12', type: 'danger' },
])

const invoiceSummary = ref([
  { month: '2024-11', count: 86, total: 1285600, status: 'pending' },
  { month: '2024-10', count: 92, total: 1123000, status: 'reported' },
  { month: '2024-09', count: 78, total: 985600, status: 'reported' },
])

const recentInvoices = ref([
  { id: 1, invoiceNo: 'INV-2024-001', customer: '沙特电信公司', amount: 285600, zatcaStatus: 'reported' },
  { id: 2, invoiceNo: 'INV-2024-002', customer: '阿尔拉吉银行', amount: 198700, zatcaStatus: 'pending' },
  { id: 3, invoiceNo: 'INV-2024-003', customer: '沙特阿美', amount: 176500, zatcaStatus: 'reported' },
])

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSync = () => { ElMessage.success('ZATCA同步完成') }
const handleGenerate = () => { ElMessage.info('生成电子发票') }
const handleReport = (row: any) => { ElMessage.success(`发票 ${row.invoiceNo} 已上报ZATCA`) }
const handlePreview = (row: any) => { ElMessage.info(`预览发票 ${row.invoiceNo}`) }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.config-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.config-item:last-child { border-bottom: none; }
.config-label { color: #666; }
</style>