<!-- 
  文件路径: frontend/src/modules/pos/pages/ScanPayment.vue
  功能: 扫码支付 - POS扫码支付
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>扫码支付</h2>
          <p class="subtitle">支持微信支付、支付宝、银行卡扫码</p>
        </div>
        <div>
          <el-tag type="success" size="large">扫码设备已连接</el-tag>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>扫码支付</span></template>
          <div class="scan-area">
            <div class="scanner">
              <div class="scan-frame">
                <div class="scan-line"></div>
              </div>
              <p class="scan-tip">请将二维码放入扫描框</p>
            </div>
            <div class="scan-actions">
              <el-button type="primary" size="large" style="width: 100%;" @click="handleScan">
                <el-icon><Camera /></el-icon> 开始扫描
              </el-button>
              <el-button size="large" style="width: 100%;" @click="handleManual">
                <el-icon><Edit /></el-icon> 手动输入
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>支付信息</span></template>
          <div class="payment-info" v-if="paymentInfo">
            <div class="info-row">
              <span class="info-label">商户名称</span>
              <span class="info-value">{{ paymentInfo.merchant }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">交易金额</span>
              <span class="info-value amount">{{ formatCurrency(paymentInfo.amount) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">订单号</span>
              <span class="info-value">{{ paymentInfo.orderNo }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">支付方式</span>
              <span class="info-value">
                <el-radio-group v-model="paymentInfo.method">
                  <el-radio label="alipay">支付宝</el-radio>
                  <el-radio label="wechat">微信支付</el-radio>
                  <el-radio label="card">银行卡</el-radio>
                </el-radio-group>
              </span>
            </div>
            <div class="info-row" v-if="paymentInfo.method === 'card'">
              <span class="info-label">选择银行</span>
              <span class="info-value">
                <el-select v-model="paymentInfo.bank" placeholder="请选择银行" style="width: 200px;">
                  <el-option label="沙特国家银行" value="sab" />
                  <el-option label="阿尔拉吉银行" value="alrajhi" />
                  <el-option label="利雅得银行" value="riyad" />
                </el-select>
              </span>
            </div>
            <el-button type="success" size="large" style="width: 100%; margin-top: 16px;" @click="handlePay" :loading="paying">
              <el-icon><Money /></el-icon> 确认支付 {{ formatCurrency(paymentInfo.amount) }}
            </el-button>
          </div>
          <div v-else class="empty-payment">
            <el-empty description="请扫描或输入订单" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 手动输入弹窗 -->
    <el-dialog v-model="manualDialog" title="手动输入订单" width="400px">
      <el-form :model="manualForm" label-width="100px">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="manualForm.orderNo" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="manualForm.amount" :min="0" :precision="2" controls-position="right" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="manualDialog = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmManual">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Camera, Edit, Money } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const paying = ref(false)
const manualDialog = ref(false)

const paymentInfo = ref({
  merchant: 'Bai\'s ERP 旗舰店',
  amount: 0,
  orderNo: '',
  method: 'alipay',
  bank: '',
})

const manualForm = reactive({
  orderNo: '',
  amount: 0,
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
}

const handleScan = () => {
  // 模拟扫描
  ElMessage.loading('扫描中...', { duration: 1500 })
  setTimeout(() => {
    paymentInfo.value.amount = 1250
    paymentInfo.value.orderNo = 'ORD-2024-001'
    ElMessage.success('扫描成功')
  }, 1500)
}

const handleManual = () => {
  manualDialog.value = true
}

const handleConfirmManual = () => {
  if (!manualForm.orderNo || manualForm.amount <= 0) {
    ElMessage.warning('请填写完整信息')
    return
  }
  paymentInfo.value.amount = manualForm.amount
  paymentInfo.value.orderNo = manualForm.orderNo
  manualDialog.value = false
  ElMessage.success('订单已加载')
}

const handlePay = () => {
  if (paymentInfo.value.amount <= 0) {
    ElMessage.warning('请先加载订单')
    return
  }
  paying.value = true
  setTimeout(() => {
    paying.value = false
    ElMessage.success('支付成功！')
    paymentInfo.value.amount = 0
    paymentInfo.value.orderNo = ''
  }, 2000)
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.scan-area { text-align: center; }
.scanner { margin-bottom: 20px; }
.scan-frame { width: 280px; height: 280px; border: 3px dashed #409EFF; border-radius: 16px; margin: 0 auto; position: relative; display: flex; align-items: center; justify-content: center; }
.scan-line { width: 240px; height: 2px; background: #409EFF; animation: scanMove 2s infinite; }
@keyframes scanMove { 0% { transform: translateY(-100px); } 50% { transform: translateY(100px); } 100% { transform: translateY(-100px); } }
.scan-tip { color: #909399; font-size: 14px; margin-top: 12px; }
.scan-actions { display: flex; gap: 12px; justify-content: center; }
.scan-actions .el-button { width: 150px; }
.payment-info { padding: 8px 0; }
.info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
.info-row:last-child { border-bottom: none; }
.info-label { color: #909399; }
.info-value { font-weight: 500; }
.info-value.amount { font-size: 24px; font-weight: 700; color: #409EFF; }
.empty-payment { padding: 40px 0; }
</style>