<!-- 
  文件路径: frontend/src/modules/settings/pages/TaxSettings.vue
  功能: 税率设置 - 管理税率配置
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>税率设置</h2>
          <p class="subtitle">管理各类税率</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" label-width="160px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="增值税(VAT)税率" prop="vatRate">
              <el-input-number v-model="form.vatRate" :min="0" :max="100" :precision="2" controls-position="right" style="width: 100%" />
              <span style="margin-left: 8px; color: #909399;">%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业所得税率" prop="corporateRate">
              <el-input-number v-model="form.corporateRate" :min="0" :max="100" :precision="2" controls-position="right" style="width: 100%" />
              <span style="margin-left: 8px; color: #909399;">%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关税税率" prop="dutyRate">
              <el-input-number v-model="form.dutyRate" :min="0" :max="100" :precision="2" controls-position="right" style="width: 100%" />
              <span style="margin-left: 8px; color: #909399;">%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="增值税计算方式">
              <el-radio-group v-model="form.vatCalculation">
                <el-radio label="exclusive">价外税</el-radio>
                <el-radio label="inclusive">价内税</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left">沙特增值税设置</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="沙特VAT税率">
              <el-input-number v-model="form.saudiVatRate" :min="0" :max="100" :precision="2" controls-position="right" style="width: 100%" />
              <span style="margin-left: 8px; color: #909399;">%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否适用VAT">
              <el-switch v-model="form.vatEnabled" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="免税商品类别">
              <el-select v-model="form.taxExemptCategories" multiple placeholder="请选择免税类别" style="width: 100%">
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
import { ElMessage } from 'element-plus'

const form = reactive({
  vatRate: 15,
  corporateRate: 20,
  dutyRate: 5,
  vatCalculation: 'exclusive',
  saudiVatRate: 15,
  vatEnabled: true,
  taxExemptCategories: ['medical', 'education'],
})

const handleSave = () => {
  ElMessage.success('税率设置已保存')
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>