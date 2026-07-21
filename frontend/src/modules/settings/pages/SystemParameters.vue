<!-- 
  文件路径: frontend/src/modules/settings/pages/SystemParameters.vue
  功能: 系统参数 - 系统参数配置
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>系统参数</h2>
          <p class="subtitle">系统核心参数配置</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存参数</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="系统参数" name="system">
          <el-form :model="systemParams" label-width="180px">
            <el-form-item label="系统名称">
              <el-input v-model="systemParams.systemName" placeholder="Bai's ERP" />
            </el-form-item>
            <el-form-item label="系统时区">
              <el-select v-model="systemParams.timezone" style="width: 300px;">
                <el-option label="Asia/Riyadh" value="Asia/Riyadh" />
                <el-option label="Asia/Dubai" value="Asia/Dubai" />
                <el-option label="UTC" value="UTC" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期格式">
              <el-select v-model="systemParams.dateFormat" style="width: 300px;">
                <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
                <el-option label="DD/MM/YYYY" value="DD/MM/YYYY" />
                <el-option label="MM/DD/YYYY" value="MM/DD/YYYY" />
              </el-select>
            </el-form-item>
            <el-form-item label="时间格式">
              <el-radio-group v-model="systemParams.timeFormat">
                <el-radio label="24h">24小时</el-radio>
                <el-radio label="12h">12小时</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="每页记录数">
              <el-input-number v-model="systemParams.pageSize" :min="5" :max="100" controls-position="right" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="业务参数" name="business">
          <el-form :model="businessParams" label-width="180px">
            <el-form-item label="默认货币">
              <el-select v-model="businessParams.defaultCurrency" style="width: 300px;">
                <el-option label="SAR - 沙特里亚尔" value="SAR" />
                <el-option label="USD - 美元" value="USD" />
                <el-option label="EUR - 欧元" value="EUR" />
              </el-select>
            </el-form-item>
            <el-form-item label="小数位数">
              <el-input-number v-model="businessParams.decimalPlaces" :min="0" :max="4" controls-position="right" />
            </el-form-item>
            <el-form-item label="启用批次管理">
              <el-switch v-model="businessParams.batchManagement" />
            </el-form-item>
            <el-form-item label="启用序列号管理">
              <el-switch v-model="businessParams.serialManagement" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('system')

const systemParams = reactive({
  systemName: 'Bai\'s ERP',
  timezone: 'Asia/Riyadh',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  pageSize: 20,
})

const businessParams = reactive({
  defaultCurrency: 'SAR',
  decimalPlaces: 2,
  batchManagement: true,
  serialManagement: true,
})

const handleSave = () => {
  ElMessage.success('系统参数已保存')
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
:deep(.el-tabs__content) { padding-top: 20px; }
</style>