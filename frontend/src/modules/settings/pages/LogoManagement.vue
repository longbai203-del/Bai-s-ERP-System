<!-- 
  文件路径: frontend/src/modules/settings/pages/LogoManagement.vue
  功能: Logo管理 - 管理企业Logo
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>Logo管理</h2>
          <p class="subtitle">管理企业Logo</p>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>当前Logo</span></template>
          <div class="logo-preview">
            <div class="logo-placeholder">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <rect width="120" height="120" rx="16" fill="#1a1a2e" />
                <text x="60" y="60" text-anchor="middle" dominant-baseline="central" fill="white" font-size="32" font-weight="700">B</text>
                <text x="60" y="90" text-anchor="middle" dominant-baseline="central" fill="rgba(255,255,255,0.5)" font-size="10">Bai's ERP</text>
              </svg>
            </div>
            <div class="logo-info">
              <div class="logo-name">Bai's ERP</div>
              <div class="logo-size">120 x 120 px</div>
              <div class="logo-format">SVG</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>上传新Logo</span></template>
          <el-upload
            class="upload-area"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            accept="image/*"
          >
            <el-icon class="upload-icon"><Upload /></el-icon>
            <div class="upload-text">拖拽Logo图片到此处，或点击上传</div>
            <div class="upload-hint">支持 PNG, JPG, SVG, 推荐 200x200px</div>
          </el-upload>
          <div style="margin-top: 12px;">
            <el-button type="primary" style="width: 100%;" @click="handleUpload">
              <el-icon><Upload /></el-icon> 上传Logo
            </el-button>
          </div>
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header><span>Logo预览</span></template>
          <div class="preview-container">
            <div class="preview-item">
              <span class="preview-label">系统导航</span>
              <div class="preview-demo">
                <span class="demo-logo">B</span>
                <span class="demo-text">Bai's ERP</span>
              </div>
            </div>
            <div class="preview-item">
              <span class="preview-label">登录页</span>
              <div class="preview-demo login-demo">
                <div class="login-logo">B</div>
                <div class="login-title">Bai's ERP</div>
                <div class="login-sub">企业管理系统</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const handleFileChange = (file: any) => {
  ElMessage.info(`已选择文件: ${file.name}`)
}

const handleUpload = () => {
  ElMessage.success('Logo上传成功')
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.logo-preview { display: flex; align-items: center; gap: 24px; padding: 16px 0; }
.logo-placeholder { flex-shrink: 0; }
.logo-info { display: flex; flex-direction: column; gap: 4px; }
.logo-name { font-size: 18px; font-weight: 600; }
.logo-size { color: #909399; font-size: 13px; }
.logo-format { color: #909399; font-size: 13px; }
.upload-area { border: 2px dashed #d9d9d9; border-radius: 8px; padding: 30px 20px; text-align: center; cursor: pointer; transition: all 0.3s; }
.upload-area:hover { border-color: #409EFF; }
.upload-icon { font-size: 40px; color: #409EFF; }
.upload-text { font-size: 15px; color: #303133; margin-top: 6px; }
.upload-hint { font-size: 12px; color: #909399; margin-top: 2px; }
.preview-container { padding: 8px 0; }
.preview-item { margin-bottom: 16px; }
.preview-item:last-child { margin-bottom: 0; }
.preview-label { display: block; color: #909399; font-size: 13px; margin-bottom: 6px; }
.preview-demo { display: flex; align-items: center; gap: 12px; background: #f5f7fa; padding: 12px 16px; border-radius: 8px; }
.demo-logo { width: 32px; height: 32px; border-radius: 8px; background: #1a1a2e; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
.demo-text { font-size: 16px; font-weight: 600; }
.login-demo { flex-direction: column; text-align: center; padding: 20px; }
.login-logo { width: 48px; height: 48px; border-radius: 12px; background: #1a1a2e; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px; margin: 0 auto; }
.login-title { font-size: 20px; font-weight: 700; margin-top: 8px; }
.login-sub { color: #909399; font-size: 13px; }
</style>