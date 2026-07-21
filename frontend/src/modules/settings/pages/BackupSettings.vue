<!-- 
  文件路径: frontend/src/modules/settings/pages/BackupSettings.vue
  功能: 备份设置 - 数据备份配置
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>备份设置</h2>
          <p class="subtitle">配置数据备份</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
          <el-button type="warning" @click="handleBackupNow"><el-icon><Refresh /></el-icon> 立即备份</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>备份配置</span></template>
          <el-form :model="form" label-width="140px">
            <el-form-item label="自动备份">
              <el-switch v-model="form.autoBackup" />
            </el-form-item>
            <el-form-item label="备份频率" v-if="form.autoBackup">
              <el-select v-model="form.backupFrequency" style="width: 100%">
                <el-option label="每天" value="daily" />
                <el-option label="每周" value="weekly" />
                <el-option label="每月" value="monthly" />
              </el-select>
            </el-form-item>
            <el-form-item label="备份时间" v-if="form.autoBackup">
              <el-time-picker v-model="form.backupTime" placeholder="选择备份时间" style="width: 100%" />
            </el-form-item>
            <el-form-item label="保留备份数">
              <el-input-number v-model="form.retentionCount" :min="1" :max="30" controls-position="right" style="width: 100%" />
              <span style="margin-left: 8px; color: #909399;">个</span>
            </el-form-item>
            <el-form-item label="备份存储位置">
              <el-select v-model="form.storageLocation" style="width: 100%">
                <el-option label="本地" value="local" />
                <el-option label="云存储" value="cloud" />
                <el-option label="远程服务器" value="remote" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>备份状态</span></template>
          <div class="status-item">
            <span>上次备份</span>
            <span class="status-value">2024-11-20 10:30:00</span>
          </div>
          <div class="status-item">
            <span>备份大小</span>
            <span class="status-value">128 GB</span>
          </div>
          <div class="status-item">
            <span>备份总数</span>
            <span class="status-value">28 个</span>
          </div>
          <div class="status-item">
            <span>备份状态</span>
            <el-tag type="success">✅ 正常</el-tag>
          </div>
          <div style="margin-top: 16px;">
            <el-progress :percentage="78" :stroke-width="12" color="#67C23A" />
            <div style="text-align: center; color: #909399; font-size: 13px; margin-top: 4px;">存储空间使用 78%</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  autoBackup: true,
  backupFrequency: 'daily',
  backupTime: new Date('2024-01-01T02:00:00'),
  retentionCount: 7,
  storageLocation: 'local',
})

const handleSave = () => { ElMessage.success('备份设置已保存') }
const handleBackupNow = () => {
  ElMessage.loading('备份进行中...', { duration: 3000 })
  setTimeout(() => { ElMessage.success('备份完成') }, 3000)
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.status-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.status-item:last-child { border-bottom: none; }
.status-value { font-weight: 500; }
</style>