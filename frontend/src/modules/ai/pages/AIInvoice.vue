<!-- 
  文件路径: frontend/src/modules/ai/pages/AIInvoice.vue
  功能: AI发票识别 - 智能发票识别与管理
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>AI 发票识别</h2>
          <p class="subtitle">智能识别发票信息，自动录入系统</p>
        </div>
        <div>
          <el-tag type="warning" size="large">🤖 支持多格式</el-tag>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card>
          <template #header><span>上传发票</span></template>
          <el-upload
            class="upload-area"
            drag
            multiple
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <el-icon class="upload-icon"><Upload /></el-icon>
            <div class="upload-text">拖拽发票文件到此处</div>
            <div class="upload-hint">支持 PDF, JPG, PNG</div>
          </el-upload>
          <el-button type="primary" style="width: 100%; margin-top: 12px;" @click="handleScan" :loading="loading">
            <el-icon><Search /></el-icon> 扫描识别
          </el-button>
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header><span>发票统计</span></template>
          <div class="stat-item"><span>已识别发票</span><span class="stat-value">{{ invoiceCount }}</span></div>
          <div class="stat-item"><span>匹配率</span><span class="stat-value">{{ matchRate }}</span></div>
          <div class="stat-item"><span>待处理</span><span class="stat-value">{{ pendingCount }}</span></div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header><span>识别结果</span></template>
          <el-table :data="invoiceData" style="width: 100%" stripe>
            <el-table-column prop="field" label="字段" width="120" />
            <el-table-column prop="value" label="识别值" />
            <el-table-column prop="status" label="状态" align="center" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'matched' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
                  {{ row.status === 'matched' ? '已匹配' : row.status === 'pending' ? '待确认' : '异常' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 16px;">
            <el-button type="success" @click="handleConfirm">确认录入</el-button>
            <el-button @click="handleExportInvoice">导出</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const invoiceCount = ref('286')
const matchRate = ref('92.5%')
const pendingCount = ref('18')

const invoiceData = ref([
  { field: '发票号', value: 'INV-2024-001', status: 'matched' },
  { field: '供应商', value: 'Apple Supplier', status: 'matched' },
  { field: '日期', value: '2024-11-20', status: 'matched' },
  { field: '金额', value: 'SAR 285,600', status: 'matched' },
  { field: 'VAT', value: 'SAR 42,840', status: 'pending' },
])

const handleFileChange = (file: any) => {
  ElMessage.info(`已添加文件: ${file.name}`)
}

const handleScan = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('发票识别完成')
  }, 2000)
}

const handleConfirm = () => {
  invoiceData.value.forEach(item => { if (item.status === 'pending') item.status = 'matched' })
  ElMessage.success('已确认录入')
}

const handleExportInvoice = () => { ElMessage.success('导出完成') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.upload-area { border: 2px dashed #d9d9d9; border-radius: 8px; padding: 30px 20px; text-align: center; cursor: pointer; transition: all 0.3s; }
.upload-area:hover { border-color: #409EFF; }
.upload-icon { font-size: 40px; color: #409EFF; }
.upload-text { font-size: 15px; color: #303133; margin-top: 6px; }
.upload-hint { font-size: 12px; color: #909399; margin-top: 2px; }
.stat-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.stat-item:last-child { border-bottom: none; }
.stat-value { font-weight: 700; color: #303133; }
</style>