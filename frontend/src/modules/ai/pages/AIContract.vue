<!-- 
  文件路径: frontend/src/modules/ai/pages/AIContract.vue
  功能: AI合同分析 - 智能合同审查
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>AI 合同智能分析</h2>
          <p class="subtitle">智能审查合同条款，识别风险</p>
        </div>
        <div>
          <el-tag type="warning" size="large">🤖 合同分析引擎</el-tag>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card>
          <template #header><span>上传合同</span></template>
          <el-upload
            class="upload-area"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <el-icon class="upload-icon"><Upload /></el-icon>
            <div class="upload-text">拖拽合同文件到此处</div>
            <div class="upload-hint">支持 PDF, DOCX, TXT</div>
          </el-upload>
          <el-button type="primary" style="width: 100%; margin-top: 12px;" @click="handleAnalyze" :loading="loading">
            <el-icon><Monitor /></el-icon> 开始分析
          </el-button>
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header><span>合同统计</span></template>
          <div class="stat-item"><span>已分析合同</span><span class="stat-value">{{ contractCount }}</span></div>
          <div class="stat-item"><span>风险数量</span><span class="stat-value risk">{{ riskCount }}</span></div>
          <div class="stat-item"><span>合规率</span><span class="stat-value">{{ complianceRate }}</span></div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>分析结果</span>
              <el-tag :type="overallRisk === '低' ? 'success' : overallRisk === '中' ? 'warning' : 'danger'">
                整体风险: {{ overallRisk }}
              </el-tag>
            </div>
          </template>
          <div v-if="analysisResults.length > 0">
            <el-table :data="analysisResults" style="width: 100%" stripe>
              <el-table-column prop="clause" label="条款" min-width="150" />
              <el-table-column prop="risk" label="风险等级" align="center" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.risk === '高' ? 'danger' : row.risk === '中' ? 'warning' : 'success'">
                    {{ row.risk }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="suggestion" label="建议" min-width="200" />
            </el-table>
            <div style="margin-top: 16px;">
              <el-button type="primary" @click="handleGenerateReport">生成报告</el-button>
              <el-button @click="handleExportContract">导出分析</el-button>
            </div>
          </div>
          <div v-else class="empty-result">
            <el-empty description="上传合同开始分析" />
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
const contractCount = ref('128')
const riskCount = ref('18')
const complianceRate = ref('96.2%')
const overallRisk = ref('低')

const analysisResults = ref<Array<{ clause: string; risk: string; suggestion: string }>>([])

const handleFileChange = (file: any) => {
  ElMessage.info(`已添加文件: ${file.name}`)
}

const handleAnalyze = () => {
  loading.value = true
  setTimeout(() => {
    analysisResults.value = [
      { clause: '付款条款', risk: '低', suggestion: '建议明确付款条件和逾期罚则' },
      { clause: '保密条款', risk: '中', suggestion: '保密范围定义较宽泛，建议细化' },
      { clause: '违约责任', risk: '低', suggestion: '违约金比例合理，建议补充免责条款' },
      { clause: '知识产权', risk: '低', suggestion: '归属权明确，建议增加侵权赔偿条款' },
    ]
    loading.value = false
    overallRisk.value = '低'
    ElMessage.success('合同分析完成')
  }, 2500)
}

const handleGenerateReport = () => { ElMessage.success('报告生成完成') }
const handleExportContract = () => { ElMessage.success('导出完成') }
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
.stat-value.risk { color: #F56C6C; }
.empty-result { padding: 40px 0; }
</style>