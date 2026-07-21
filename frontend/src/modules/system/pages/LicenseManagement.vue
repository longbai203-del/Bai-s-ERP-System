<!-- 
  文件路径: frontend/src/modules/system/pages/LicenseManagement.vue
  功能: License管理 - 管理软件许可证
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>许可证管理</h2>
          <p class="subtitle">管理系统许可证</p>
        </div>
        <div>
          <el-tag :type="licenseStatus === 'active' ? 'success' : 'danger'" size="large">
            {{ licenseStatus === 'active' ? '✅ 已激活' : '⚠️ 未激活' }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>许可证信息</span></template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="许可证编号">LIC-2024-001-ABCD</el-descriptions-item>
            <el-descriptions-item label="授权类型">企业版</el-descriptions-item>
            <el-descriptions-item label="授权用户数">500</el-descriptions-item>
            <el-descriptions-item label="有效期">2024-01-01 ~ 2025-12-31</el-descriptions-item>
            <el-descriptions-item label="剩余天数">386 天</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag type="success">已激活</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>许可证操作</span></template>
          <div class="license-actions">
            <el-button type="primary" size="large" style="width: 100%;" @click="handleUpload">
              <el-icon><Upload /></el-icon> 上传许可证
            </el-button>
            <el-button type="warning" size="large" style="width: 100%;" @click="handleRenew">
              <el-icon><Refresh /></el-icon> 续期许可证
            </el-button>
            <el-button type="info" size="large" style="width: 100%;" @click="handleExport">
              <el-icon><Download /></el-icon> 导出许可证信息
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header><span>使用统计</span></template>
      <el-row :gutter="20">
        <el-col :span="6" v-for="stat in usageStats" :key="stat.label">
          <div class="usage-item">
            <div class="usage-label">{{ stat.label }}</div>
            <div class="usage-value">{{ stat.value }}</div>
            <el-progress :percentage="stat.percentage" :color="stat.percentage < 80 ? '#67C23A' : stat.percentage < 95 ? '#E6A23C' : '#F56C6C'" />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Refresh, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const licenseStatus = ref('active')

const usageStats = ref([
  { label: '用户使用率', value: '286/500', percentage: 57.2 },
  { label: '存储使用率', value: '856GB/2TB', percentage: 41.8 },
  { label: 'API调用次数', value: '12.8万/月', percentage: 64 },
  { label: '并发用户', value: '156', percentage: 31.2 },
])

const handleUpload = () => { ElMessage.info('上传许可证文件') }
const handleRenew = () => { ElMessage.success('许可证已续期') }
const handleExport = () => { ElMessage.success('导出完成') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.license-actions { display: flex; flex-direction: column; gap: 12px; }
.usage-item { text-align: center; padding: 12px; border-right: 1px solid #e4e7ed; }
.usage-item:last-child { border-right: none; }
.usage-label { color: #909399; font-size: 14px; }
.usage-value { font-size: 20px; font-weight: 700; color: #303133; margin: 4px 0; }
</style>