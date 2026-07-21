<!-- 
  文件路径: frontend/src/modules/settings/pages/SaudiInvoiceSettings.vue
  功能: 沙特发票设置 - 沙特电子发票配置
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>沙特发票设置</h2>
          <p class="subtitle">电子发票合规配置</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" label-width="180px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发票模板">
              <el-select v-model="form.invoiceTemplate" placeholder="请选择模板" style="width: 100%">
                <el-option label="标准模板" value="standard" />
                <el-option label="简洁模板" value="simple" />
                <el-option label="详细模板" value="detailed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票编号前缀">
              <el-input v-model="form.invoicePrefix" placeholder="如: INV-2024-" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子发票格式">
              <el-radio-group v-model="form.invoiceFormat">
                <el-radio label="pdf">PDF</el-radio>
                <el-radio label="xml">XML</el-radio>
                <el-radio label="both">两者都包含</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自动生成二维码">
              <el-switch v-model="form.autoQR" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left">ZATCA电子发票配置</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票上报方式">
              <el-select v-model="form.reportMethod" style="width: 100%">
                <el-option label="自动上报" value="auto" />
                <el-option label="手动上报" value="manual" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报失败重试次数">
              <el-input-number v-model="form.retryCount" :min="0" :max="10" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发票底部备注">
              <el-input v-model="form.invoiceFooter" type="textarea" :rows="3" placeholder="请输入发票底部备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  invoiceTemplate: 'standard',
  invoicePrefix: 'INV-2024-',
  invoiceFormat: 'pdf',
  autoQR: true,
  reportMethod: 'auto',
  retryCount: 3,
  invoiceFooter: '感谢您的合作！如需帮助，请联系客服。',
})

const handleSave = () => { ElMessage.success('发票设置已保存') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>