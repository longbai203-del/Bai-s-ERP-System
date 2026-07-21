<!-- 
  文件路径: frontend/src/modules/settings/pages/PaymentSettings.vue
  功能: 支付设置 - 管理支付方式配置
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>支付设置</h2>
          <p class="subtitle">管理支付方式</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-divider content-position="left">支付方式</el-divider>
          </el-col>
          <el-col :span="12" v-for="(method, index) in form.paymentMethods" :key="index">
            <el-card class="payment-method-card">
              <div class="method-header">
                <el-checkbox v-model="method.enabled" />
                <span class="method-name">{{ method.name }}</span>
                <el-tag :type="method.enabled ? 'success' : 'danger'" size="small">
                  {{ method.enabled ? '已启用' : '已禁用' }}
                </el-tag>
              </div>
              <div class="method-desc">{{ method.description }}</div>
              <div v-if="method.config" class="method-config">
                <el-input v-model="method.config" placeholder="配置参数" size="small" style="width: 200px;" />
              </div>
            </el-card>
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
  paymentMethods: [
    { name: '银行转账', enabled: true, description: '通过银行转账支付', config: 'SA-1234567890' },
    { name: '信用卡/借记卡', enabled: true, description: '支持Visa、Mastercard', config: '' },
    { name: '现金', enabled: true, description: '线下现金支付', config: '' },
    { name: '支付宝', enabled: false, description: '支付宝扫码支付', config: 'app_id: xxxxx' },
    { name: '微信支付', enabled: false, description: '微信扫码支付', config: 'app_id: xxxxx' },
    { name: 'Apple Pay', enabled: false, description: 'Apple Pay移动支付', config: '' },
  ],
})

const handleSave = () => {
  ElMessage.success('支付设置已保存')
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.payment-method-card { margin-bottom: 12px; border-radius: 8px; }
.payment-method-card:last-child { margin-bottom: 0; }
.method-header { display: flex; align-items: center; gap: 12px; }
.method-name { font-weight: 600; }
.method-desc { color: #909399; font-size: 13px; margin-left: 28px; margin-top: 4px; }
.method-config { margin-left: 28px; margin-top: 8px; }
</style>