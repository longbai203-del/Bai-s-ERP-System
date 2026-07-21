<!-- 
  文件路径: frontend/src/modules/reports/pages/PDFExport.vue
  功能: PDF导出 - PDF导出配置
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>PDF导出</h3>
        <el-tag type="primary" size="large">支持 PDF 格式</el-tag>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>PDF导出配置</span></template>
          <el-form :model="config" label-width="120px">
            <el-form-item label="报表类型" prop="reportType">
              <el-select v-model="config.reportType" placeholder="请选择报表类型" style="width: 100%">
                <el-option label="销售报表" value="sales" />
                <el-option label="采购报表" value="purchase" />
                <el-option label="库存报表" value="inventory" />
                <el-option label="财务报表" value="finance" />
              </el-select>
            </el-form-item>
            <el-form-item label="页面方向" prop="orientation">
              <el-radio-group v-model="config.orientation">
                <el-radio label="portrait">纵向</el-radio>
                <el-radio label="landscape">横向</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="纸张大小" prop="paperSize">
              <el-select v-model="config.paperSize" style="width: 100%">
                <el-option label="A4" value="a4" />
                <el-option label="A3" value="a3" />
                <el-option label="Letter" value="letter" />
              </el-select>
            </el-form-item>
            <el-form-item label="包含水印" prop="watermark">
              <el-switch v-model="config.watermark" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" style="width: 100%;" @click="handleExport">
                <el-icon><Document /></el-icon> 导出PDF
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>PDF预览</span></template>
          <div class="pdf-preview">
            <div class="preview-page">
              <div class="preview-header">Bai's ERP 系统</div>
              <div class="preview-title">销售报表</div>
              <div class="preview-date">报告日期: 2024-11-20</div>
              <div class="preview-table">
                <table>
                  <tr><th>产品</th><th>数量</th><th>销售额</th></tr>
                  <tr><td>iPhone 15 Pro Max</td><td>256</td><td>SAR 1,285,000</td></tr>
                  <tr><td>三星 Galaxy S24 Ultra</td><td>198</td><td>SAR 985,000</td></tr>
                  <tr><td>MacBook Pro 16"</td><td>86</td><td>SAR 876,000</td></tr>
                </table>
              </div>
              <div class="preview-footer">Bai's ERP System © 2024</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const config = reactive({
  reportType: 'sales',
  orientation: 'portrait',
  paperSize: 'a4',
  watermark: false,
})

const handleExport = () => {
  ElMessage.loading('正在生成PDF...', { duration: 2000 })
  setTimeout(() => {
    ElMessage.success('PDF导出完成，文件已开始下载')
  }, 2000)
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.filter-card h3 { margin: 0; }
.pdf-preview { background: #f5f7fa; padding: 20px; border-radius: 8px; }
.preview-page { background: white; padding: 30px; border-radius: 4px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); max-width: 500px; margin: 0 auto; }
.preview-header { text-align: center; font-size: 12px; color: #909399; border-bottom: 1px solid #e4e7ed; padding-bottom: 8px; }
.preview-title { text-align: center; font-size: 20px; font-weight: 700; padding: 16px 0; }
.preview-date { text-align: center; color: #909399; font-size: 13px; padding-bottom: 16px; }
.preview-table table { width: 100%; border-collapse: collapse; font-size: 13px; }
.preview-table th, .preview-table td { border: 1px solid #e4e7ed; padding: 6px 8px; text-align: center; }
.preview-table th { background: #f5f7fa; font-weight: 600; }
.preview-footer { text-align: center; font-size: 11px; color: #909399; border-top: 1px solid #e4e7ed; padding-top: 8px; margin-top: 16px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>