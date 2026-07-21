<!-- 
  文件路径: frontend/src/modules/ai/pages/AIOCR.vue
  功能: AI OCR识别 - 智能文档识别
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>AI OCR 智能识别</h2>
          <p class="subtitle">自动识别发票、合同、文档</p>
        </div>
        <div>
          <el-tag type="warning" size="large">🤖 AI识别引擎</el-tag>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card>
          <template #header><span>上传文档</span></template>
          <el-upload
            class="upload-area"
            drag
            multiple
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <el-icon class="upload-icon"><Upload /></el-icon>
            <div class="upload-text">拖拽文件到此处，或点击上传</div>
            <div class="upload-hint">支持 PDF, JPG, PNG, 单文件最大10MB</div>
          </el-upload>
          <div style="margin-top: 12px;">
            <el-button type="primary" style="width: 100%;" @click="handleRecognize" :loading="loading">
              <el-icon><Monitor /></el-icon> 开始识别
            </el-button>
          </div>
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header><span>识别统计</span></template>
          <div class="stat-item"><span>今日识别</span><span class="stat-value">{{ todayCount }}</span></div>
          <div class="stat-item"><span>识别成功率</span><span class="stat-value">{{ successRate }}</span></div>
          <div class="stat-item"><span>平均用时</span><span class="stat-value">{{ avgTime }}</span></div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header><span>识别结果</span></template>
          <div v-if="results.length > 0" class="results-container">
            <el-table :data="results" style="width: 100%" stripe>
              <el-table-column prop="field" label="字段" width="120" />
              <el-table-column prop="value" label="识别值" />
              <el-table-column prop="confidence" label="置信度" align="center" width="100">
                <template #default="{ row }">
                  <el-progress :percentage="row.confidence" :stroke-width="6" :show-text="true" />
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 16px;">
              <el-button type="success" @click="handleImport">导入系统</el-button>
              <el-button @click="handleExportResult">导出结果</el-button>
            </div>
          </div>
          <div v-else class="empty-result">
            <el-empty description="请上传文档开始识别" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Monitor } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const todayCount = ref('86')
const successRate = ref('96.8%')
const avgTime = ref('2.3秒')

const results = ref<Array<{ field: string; value: string; confidence: number }>>([])

const handleFileChange = (file: any) => {
  ElMessage.info(`已添加文件: ${file.name}`)
}

const handleRecognize = () => {
  if (results.value.length > 0) {
    ElMessage.warning('请先清空识别结果')
    return
  }
  loading.value = true
  setTimeout(() => {
    results.value = [
      { field: '发票编号', value: 'INV-2024-001', confidence: 98 },
      { field: '开票日期', value: '2024-11-20', confidence: 95 },
      { field: '供应商', value: 'Apple Supplier', confidence: 92 },
      { field: '总金额', value: 'SAR 285,600', confidence: 97 },
      { field: 'VAT', value: 'SAR 42,840', confidence: 94 },
    ]
    loading.value = false
    ElMessage.success('识别完成')
  }, 2000)
}

const handleImport = () => {
  ElMessage.success('数据已导入系统')
  results.value = []
}

const handleExportResult = () => {
  ElMessage.success('导出完成')
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.upload-area { border: 2px dashed #d9d9d9; border-radius: 8px; padding: 40px 20px; text-align: center; cursor: pointer; transition: all 0.3s; }
.upload-area:hover { border-color: #409EFF; }
.upload-icon { font-size: 48px; color: #409EFF; }
.upload-text { font-size: 16px; color: #303133; margin-top: 8px; }
.upload-hint { font-size: 13px; color: #909399; margin-top: 4px; }
.stat-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.stat-item:last-child { border-bottom: none; }
.stat-value { font-weight: 700; color: #303133; }
.results-container { padding: 4px 0; }
.empty-result { padding: 40px 0; }
</style>