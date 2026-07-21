<!-- 
  文件路径: frontend/src/modules/settings/pages/PrintTemplate.vue
  功能: 打印模板 - 管理打印模板
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>打印模板</h2>
          <p class="subtitle">管理各类打印模板</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存模板</el-button>
          <el-button @click="handlePreview">预览</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card>
          <template #header><span>模板列表</span></template>
          <div v-for="template in templates" :key="template.id" class="template-item" :class="{ active: template.active }" @click="handleSelect(template)">
            <div class="template-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="template-info">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-type">{{ template.type }}</div>
            </div>
            <el-tag v-if="template.active" type="success" size="small">使用中</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header><span>模板设计</span></template>
          <el-form :model="currentTemplate" label-width="100px">
            <el-form-item label="模板名称">
              <el-input v-model="currentTemplate.name" />
            </el-form-item>
            <el-form-item label="页面方向">
              <el-radio-group v-model="currentTemplate.orientation">
                <el-radio label="portrait">纵向</el-radio>
                <el-radio label="landscape">横向</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="纸张大小">
              <el-select v-model="currentTemplate.paperSize" style="width: 100%">
                <el-option label="A4" value="a4" />
                <el-option label="A5" value="a5" />
                <el-option label="热敏纸" value="thermal" />
              </el-select>
            </el-form-item>
            <el-form-item label="包含Logo">
              <el-switch v-model="currentTemplate.includeLogo" />
            </el-form-item>
            <el-form-item label="字体大小">
              <el-slider v-model="currentTemplate.fontSize" :min="10" :max="20" show-stops />
            </el-form-item>
            <el-form-item label="自定义CSS">
              <el-input v-model="currentTemplate.customCss" type="textarea" :rows="4" placeholder="请输入自定义CSS样式" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const templates = ref([
  { id: 1, name: '销售订单', type: '订单', active: true },
  { id: 2, name: '采购订单', type: '订单', active: false },
  { id: 3, name: '发票', type: '财务', active: false },
  { id: 4, name: '报价单', type: '销售', active: false },
])

const currentTemplate = ref({
  name: '销售订单',
  orientation: 'portrait',
  paperSize: 'a4',
  includeLogo: true,
  fontSize: 14,
  customCss: '.invoice-title { color: #409EFF; }',
})

const handleSelect = (template: any) => {
  templates.value.forEach(t => t.active = false)
  template.active = true
  currentTemplate.value.name = template.name
  ElMessage.info(`已选择模板: ${template.name}`)
}

const handleSave = () => { ElMessage.success('模板已保存') }
const handlePreview = () => { ElMessage.info('正在打开预览...') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.template-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: all 0.2s; }
.template-item:hover { background: #f5f7fa; }
.template-item.active { background: #E3F2FD; border-left: 3px solid #409EFF; }
.template-icon { color: #409EFF; }
.template-info { flex: 1; }
.template-name { font-weight: 500; }
.template-type { color: #909399; font-size: 13px; }
</style>