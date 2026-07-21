<!-- 
  文件路径: frontend/src/modules/settings/pages/ThemeSettings.vue
  功能: 主题设置 - 系统主题配置
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>主题设置</h2>
          <p class="subtitle">自定义系统主题</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存主题</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主题模式">
              <el-radio-group v-model="form.themeMode">
                <el-radio label="light">浅色</el-radio>
                <el-radio label="dark">深色</el-radio>
                <el-radio label="auto">跟随系统</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主色调">
              <el-color-picker v-model="form.primaryColor" />
              <span style="margin-left: 12px; color: #909399;">{{ form.primaryColor }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="辅助色">
              <el-color-picker v-model="form.secondaryColor" />
              <span style="margin-left: 12px; color: #909399;">{{ form.secondaryColor }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成功色">
              <el-color-picker v-model="form.successColor" />
              <span style="margin-left: 12px; color: #909399;">{{ form.successColor }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="警告色">
              <el-color-picker v-model="form.warningColor" />
              <span style="margin-left: 12px; color: #909399;">{{ form.warningColor }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="危险色">
              <el-color-picker v-model="form.dangerColor" />
              <span style="margin-left: 12px; color: #909399;">{{ form.dangerColor }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="字体">
              <el-select v-model="form.fontFamily" style="width: 300px;">
                <el-option label="系统默认" value="system" />
                <el-option label="Google Sans" value="'Google Sans', sans-serif" />
                <el-option label="Noto Sans Arabic" value="'Noto Sans Arabic', sans-serif" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="自定义CSS">
              <el-input v-model="form.customCss" type="textarea" :rows="4" placeholder="请输入自定义CSS" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 主题预览 -->
    <el-card style="margin-top: 20px">
      <template #header><span>主题预览</span></template>
      <div class="theme-preview" :style="{ background: form.themeMode === 'dark' ? '#1a1a2e' : '#f5f7fa', padding: '20px', borderRadius: '8px' }">
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <el-button :style="{ background: form.primaryColor, borderColor: form.primaryColor }" type="primary">主要按钮</el-button>
          <el-button :style="{ background: form.successColor, borderColor: form.successColor }" type="success">成功按钮</el-button>
          <el-button :style="{ background: form.warningColor, borderColor: form.warningColor }" type="warning">警告按钮</el-button>
          <el-button :style="{ background: form.dangerColor, borderColor: form.dangerColor }" type="danger">危险按钮</el-button>
        </div>
        <div style="margin-top: 12px;">
          <el-tag :color="form.primaryColor" style="color: white;">主标签</el-tag>
          <el-tag :color="form.successColor" style="color: white; margin-left: 8px;">成功标签</el-tag>
          <el-tag :color="form.warningColor" style="color: white; margin-left: 8px;">警告标签</el-tag>
          <el-tag :color="form.dangerColor" style="color: white; margin-left: 8px;">危险标签</el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  themeMode: 'light',
  primaryColor: '#409EFF',
  secondaryColor: '#67C23A',
  successColor: '#67C23A',
  warningColor: '#E6A23C',
  dangerColor: '#F56C6C',
  fontFamily: 'system',
  customCss: '',
})

const handleSave = () => {
  ElMessage.success('主题已保存')
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.theme-preview { transition: all 0.3s; }
</style>