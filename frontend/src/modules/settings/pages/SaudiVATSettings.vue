<!-- 
  文件路径: frontend/src/modules/settings/pages/SaudiVATSettings.vue
  功能: 沙特VAT设置 - 沙特增值税合规设置
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>沙特VAT设置</h2>
          <p class="subtitle">沙特增值税合规配置</p>
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
            <el-form-item label="VAT税率">
              <el-input-number v-model="form.vatRate" :min="0" :max="100" :precision="2" controls-position="right" style="width: 100%" />
              <span style="margin-left: 8px; color: #909399;">%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用VAT">
              <el-switch v-model="form.vatEnabled" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left">ZATCA配置</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ZATCA环境">
              <el-radio-group v-model="form.zatcaEnvironment">
                <el-radio label="production">生产环境</el-radio>
                <el-radio label="sandbox">测试环境</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ZATCA API密钥">
              <el-input v-model="form.zatcaApiKey" placeholder="请输入ZATCA API密钥" type="password" show-password />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CSID证书">
              <el-upload action="#" :auto-upload="false">
                <el-button type="primary" text><el-icon><Upload /></el-icon> 上传CSID证书</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书状态">
              <el-tag type="success">✅ 已配置</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="VAT豁免类别">
              <el-select v-model="form.exemptCategories" multiple placeholder="请选择VAT豁免类别" style="width: 100%">
                <el-option label="医疗用品" value="medical" />
                <el-option label="教育服务" value="education" />
                <el-option label="金融服务" value="finance" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  vatRate: 15,
  vatEnabled: true,
  zatcaEnvironment: 'production',
  zatcaApiKey: 'sk-xxxxxxxxxxxx',
  exemptCategories: ['medical'],
})

const handleSave = () => { ElMessage.success('VAT设置已保存') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>