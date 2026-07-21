<!-- 
  文件路径: frontend/src/modules/settings/pages/CurrencySettings.vue
  功能: 币种设置 - 管理币种配置
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>币种设置</h2>
          <p class="subtitle">管理币种与汇率</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
          <el-button @click="handleSyncRates">同步汇率</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>币种列表</span>
          <el-button type="primary" size="small" @click="handleAddCurrency">添加币种</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="code" label="币种代码" width="100" />
        <el-table-column prop="name" label="币种名称" />
        <el-table-column prop="symbol" label="符号" align="center" width="80" />
        <el-table-column prop="rate" label="汇率 (SAR)" align="right" />
        <el-table-column prop="isDefault" label="默认" align="center" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.isDefault" type="success">默认</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleSetDefault(row)" v-if="!row.isDefault"><el-icon><Check /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const tableData = ref([
  { id: 1, code: 'SAR', name: '沙特里亚尔', symbol: '﷼', rate: 1.0000, isDefault: true },
  { id: 2, code: 'USD', name: '美元', symbol: '$', rate: 3.7500, isDefault: false },
  { id: 3, code: 'EUR', name: '欧元', symbol: '€', rate: 4.0800, isDefault: false },
])

const handleSave = () => { ElMessage.success('币种设置已保存') }
const handleSyncRates = () => { ElMessage.success('汇率已同步') }
const handleAddCurrency = () => { ElMessage.info('添加币种') }
const handleEdit = (row: any) => { ElMessage.info(`编辑币种: ${row.code}`) }
const handleSetDefault = (row: any) => {
  tableData.value.forEach(c => c.isDefault = false)
  row.isDefault = true
  ElMessage.success(`已设置 ${row.code} 为默认币种`)
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>