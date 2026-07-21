<!-- 
  文件路径: frontend/src/modules/settings/pages/LicenseSettings.vue
  功能: License设置 - 软件许可证管理
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>License管理</h2>
          <p class="subtitle">软件许可证管理</p>
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
            <el-descriptions-item label="剩余天数">
              <span style="color: #67C23A; font-weight: 700;">386 天</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>许可证操作</span></template>
          <div class="license-actions">
            <el-upload action="#" :auto-upload="false" style="width: 100%;">
              <el-button type="primary" size="large" style="width: 100%;">
                <el-icon><Upload /></el-icon> 上传许可证文件
              </el-button>
            </el-upload>
            <el-button type="warning" size="large" style="width: 100%;" @click="handleRenew">
              <el-icon><Refresh /></el-icon> 续期许可证
            </el-button>
            <el-button type="info" size="large" style="width: 100%;" @click="handleExportInfo">
              <el-icon><Download /></el-icon> 导出许可证信息
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header><span>模块授权状态</span></template>
      <el-table :data="modules" style="width: 100%" stripe>
        <el-table-column prop="name" label="模块名称" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '已授权' : '未授权' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expiry" label="有效期" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Refresh, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const licenseStatus = ref('active')

const modules = ref([
  { name: '销售管理', status: 'active', expiry: '2025-12-31' },
  { name: '采购管理', status: 'active', expiry: '2025-12-31' },
  { name: '库存管理', status: 'active', expiry: '2025-12-31' },
  { name: '财务管理', status: 'active', expiry: '2025-12-31' },
  { name: 'HR管理', status: 'active', expiry: '2025-12-31' },
  { name: 'AI智能中心', status: 'inactive', expiry: '-' },
])

const handleRenew = () => { ElMessage.success('许可证已续期') }
const handleExportInfo = () => { ElMessage.success('导出完成') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.license-actions { display: flex; flex-direction: column; gap: 12px; }
</style>