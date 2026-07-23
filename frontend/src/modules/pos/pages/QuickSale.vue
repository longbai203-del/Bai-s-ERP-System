<template>
  <div class="quick-sale-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1>
          <el-icon :size="28" color="#F59E0B"><Lightning /></el-icon>
          快速销售
          <span class="badge">一键开单</span>
        </h1>
        <span class="subtitle">常用商品快速选择，支持自定义金额</span>
      </div>
      <div class="header-actions">
        <el-button @click="handleStats">
          <el-icon><DataLine /></el-icon> 统计
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon> 重置
        </el-button>
      </div>
    </div>

    <!-- 快速销售主体 -->
    <el-row :gutter="20" class="quick-sale-grid">
      <!-- 左侧：商品快捷按钮 -->
      <el-col :xs="24" :lg="16">
        <el-card class="products-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><Grid /></el-icon> 常用服务
              </span>
              <span class="card-subtitle">点击添加到购物车</span>
            </div>
          </template>

          <div class="product-buttons">
            <el-button
              v-for="product in quickProducts"
              :key="product.id"
              class="product-btn"
              size="large"
              @click="addToCart(product)"
            >
              <span class="product-icon">{{ product.icon }}</span>
              <span class="product-name">{{ product.name }}</span>
              <span class="product-price">¥{{ formatNumber(product.price) }}</span>
            </el-button>
          </div>

          <!-- 自定义金额 -->
          <div class="custom-amount-section">
            <el-divider>
              <span style="color: #909399; font-size: 13px;">
                <el-icon><Edit /></el-icon> 自定义金额
              </span>
            </el-divider>
            <el-row :gutter="12">
              <el-col :xs="24" :sm="8">
                <el-input-number
                  v-model="customPrice"
                  :min="0.01"
                  :precision="2"
                  :max="999999.99"
                  placeholder="输入金额"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-col>
              <el-col :xs="24" :sm="8">
                <el-input
                  v-model="customName"
                  placeholder="项目名称（可选）"
                  clearable
                />
              </el-col>
              <el-col :xs="24" :sm="8">
                <el-button type="success" @click="addCustomItem" style="width: 100%">
                  <el-icon><Plus /></el-icon> 添加自定义
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：购物车 -->
      <el-col :xs="24" :lg="8">
        <el-card class="cart-card" shadow="hover">
          <template #header>
            <div class="cart-header">
              <span class="card-title">
                <el-icon><ShoppingCart /></el-icon> 购物车
              </span>
              <span class="cart-count">{{ cartItems.length }} 项</span>
            </div>
          </template>

          <div class="cart-items" ref="cartItemsRef">
            <div v-if="cartItems.length === 0" class="cart-empty">
              <el-icon :size="40" color="#c0c4cc"><ShoppingCart /></el-icon>
              <p>购物车为空</p>
              <span>点击左侧商品添加</span>
            </div>
            <div
              v-for="(item, index) in cartItems"
              :key="index"
              class="cart-item"
            >
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-meta">¥{{ formatNumber(item.price) }} × {{ item.qty }}</div>
              </div>
              <div class="item-actions">
                <el-button size="small" circle @click="updateQty(index, -1)">
                  <el-icon><Minus /></el-icon>
                </el-button>
                <span class="qty">{{ item.qty }}</span>
                <el-button size="small" circle @click="updateQty(index, 1)">
                  <el-icon><Plus /></el-icon>
                </el-button>
                <span class="item-total">¥{{ formatNumber(item.price * item.qty) }}</span>
                <el-button size="small" type="danger" circle @click="removeFromCart(index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>

          <div class="cart-footer">
            <div class="cart-summary">
              <div class="summary-row">
                <span>小计</span>
                <span>¥{{ formatNumber(subtotal) }}</span>
              </div>
              <div class="summary-row total">
                <span>合计</span>
                <span class="total-amount">¥{{ formatNumber(totalAmount) }}</span>
              </div>
            </div>
            <div class="cart-actions">
              <el-button size="large" @click="handleClearCart" :disabled="cartItems.length === 0" style="flex: 1;">
                <el-icon><Delete /></el-icon> 清空
              </el-button>
              <el-button type="success" size="large" @click="handleCheckout" :disabled="cartItems.length === 0" style="flex: 2;">
                <el-icon><Check /></el-icon> 立即结算 (Ctrl+Enter)
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 结算对话框 -->
    <el-dialog
      v-model="checkoutDialogVisible"
      title="结算确认"
      width="450px"
      :close-on-click-modal="false"
    >
      <div class="checkout-confirm">
        <div class="checkout-summary">
          <div class="summary-row">
            <span>商品数量</span>
            <span>{{ totalItems }} 件</span>
          </div>
          <div class="summary-row">
            <span>小计</span>
            <span>¥{{ formatNumber(subtotal) }}</span>
          </div>
          <div class="summary-row total">
            <span>应付金额</span>
            <span class="total-amount">¥{{ formatNumber(totalAmount) }}</span>
          </div>
        </div>

        <el-form :model="checkoutForm" label-width="100px" style="margin-top: 16px;">
          <el-form-item label="支付方式">
            <el-radio-group v-model="checkoutForm.paymentMethod">
              <el-radio label="现金">现金</el-radio>
              <el-radio label="微信支付">微信支付</el-radio>
              <el-radio label="支付宝">支付宝</el-radio>
              <el-radio label="会员卡">会员卡</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="客户姓名">
            <el-input v-model="checkoutForm.customer" placeholder="请输入客户姓名（可选）" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="checkoutForm.remark" placeholder="请输入备注（可选）" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="checkoutDialogVisible = false">取消</el-button>
        <el-button type="success" :loading="checkoutLoading" @click="confirmCheckout">
          确认结算
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Lightning,
  DataLine,
  Refresh,
  Grid,
  Edit,
  Plus,
  Minus,
  Delete,
  ShoppingCart,
  Check,
  Warning
} from '@element-plus/icons-vue'

const router = useRouter()

// ========== 响应式数据 ==========
const checkoutLoading = ref(false)
const checkoutDialogVisible = ref(false)
const customPrice = ref(0)
const customName = ref('')
const cartItemsRef = ref<HTMLElement>()

// 快捷商品列表
const quickProducts = ref([
  { id: 1, name: '标准洗车', price: 89, icon: '🚗' },
  { id: 2, name: '精致洗车', price: 159, icon: '🚙' },
  { id: 3, name: '内饰清洁', price: 299, icon: '🧹' },
  { id: 4, name: '全车镀晶', price: 899, icon: '✨' },
  { id: 5, name: '机油更换', price: 399, icon: '🔧' },
  { id: 6, name: '轮胎护理', price: 120, icon: '🛞' },
  { id: 7, name: '空调清洗', price: 259, icon: '❄️' },
  { id: 8, name: 'VIP洗车卡', price: 999, icon: '💳' }
])

// 购物车
const cartItems = ref<Array<{ id: number; name: string; price: number; qty: number; icon: string }>>([])

// 结算表单
const checkoutForm = reactive({
  paymentMethod: '微信支付',
  customer: '',
  remark: ''
})

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.qty, 0)
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
})

const totalAmount = computed(() => {
  return subtotal.value
})

// ========== 购物车操作 ==========
const addToCart = (product: any) => {
  const existing = cartItems.value.find(item => item.id === product.id)
  if (existing) {
    existing.qty += 1
  } else {
    cartItems.value.push({
      ...product,
      qty: 1
    })
  }
  scrollCartToBottom()
  // 按钮反馈
  const btn = document.querySelector(`[data-product-id="${product.id}"]`)
  if (btn) {
    btn.classList.add('pulse')
    setTimeout(() => btn.classList.remove('pulse'), 300)
  }
}

const addCustomItem = () => {
  if (customPrice.value <= 0) {
    ElMessage.warning('请输入有效的金额')
    return
  }
  const name = customName.value.trim() || '自定义项目'
  cartItems.value.push({
    id: Date.now(),
    name: name,
    price: customPrice.value,
    qty: 1,
    icon: '📦'
  })
  customPrice.value = 0
  customName.value = ''
  scrollCartToBottom()
  ElMessage.success(`已添加 ${name}`)
}

const updateQty = (index: number, delta: number) => {
  const item = cartItems.value[index]
  const newQty = item.qty + delta
  if (newQty < 1) {
    ElMessageBox.confirm(`确定要移除 ${item.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      cartItems.value.splice(index, 1)
    }).catch(() => {})
    return
  }
  item.qty = newQty
}

const removeFromCart = (index: number) => {
  const item = cartItems.value[index]
  ElMessageBox.confirm(`确定要移除 ${item.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cartItems.value.splice(index, 1)
  }).catch(() => {})
}

const handleClearCart = () => {
  if (cartItems.value.length === 0) return
  ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cartItems.value = []
    ElMessage.success('已清空购物车')
  }).catch(() => {})
}

const scrollCartToBottom = () => {
  setTimeout(() => {
    if (cartItemsRef.value) {
      cartItemsRef.value.scrollTop = cartItemsRef.value.scrollHeight
    }
  }, 50)
}

// ========== 结算操作 ==========
const handleCheckout = () => {
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车为空')
    return
  }
  checkoutForm.paymentMethod = '微信支付'
  checkoutForm.customer = ''
  checkoutForm.remark = ''
  checkoutDialogVisible.value = true
}

const confirmCheckout = async () => {
  checkoutLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    const orderNo = `QS-${Date.now().toString().slice(-6)}`
    ElMessage.success(`订单 ${orderNo} 结算成功！`)
    checkoutDialogVisible.value = false
    cartItems.value = []
  } finally {
    checkoutLoading.value = false
  }
}

// ========== 其他操作 ==========
const handleStats = () => {
  ElMessage.info('统计功能开发中')
}

const handleReset = () => {
  if (cartItems.value.length === 0) return
  ElMessageBox.confirm('确定要重置购物车吗？', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cartItems.value = []
    ElMessage.success('已重置')
  }).catch(() => {})
}

// ========== 键盘快捷键 ==========
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    handleCheckout()
  }
}

// ========== 生命周期 ==========
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.quick-sale-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  font-size: 12px;
  font-weight: 400;
  background: #fef3c7;
  color: #92400e;
  padding: 2px 12px;
  border-radius: 12px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.quick-sale-grid {
  min-height: calc(100vh - 180px);
}

.products-card {
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-subtitle {
  font-size: 13px;
  color: #909399;
}

.product-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.product-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  height: auto;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  background: #ffffff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-btn:hover {
  border-color: #409eff;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.12);
}

.product-btn:active {
  transform: scale(0.95);
}

.product-btn .product-icon {
  font-size: 28px;
  margin-bottom: 4px;
}

.product-btn .product-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
}

.product-btn .product-price {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
}

.product-btn.pulse {
  animation: pulse 0.3s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.95); }
}

.custom-amount-section {
  margin-top: 8px;
}

.custom-amount-section .el-row {
  align-items: center;
}

.cart-card {
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-count {
  font-size: 13px;
  color: #909399;
}

.cart-items {
  flex: 1;
  max-height: calc(100vh - 420px);
  overflow-y: auto;
  padding: 4px 0;
  min-height: 200px;
}

.cart-items::-webkit-scrollbar {
  width: 4px;
}

.cart-items::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.cart-empty {
  text-align: center;
  padding: 30px 0;
  color: #909399;
}

.cart-empty p {
  margin: 8px 0 4px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.3s ease;
}

.cart-item:hover {
  background: #f5f7fa;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.item-meta {
  font-size: 12px;
  color: #909399;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-actions .qty {
  min-width: 20px;
  text-align: center;
  font-weight: 500;
}

.item-total {
  font-weight: 600;
  color: #409eff;
  min-width: 70px;
  text-align: right;
}

.cart-footer {
  border-top: 1px solid #ebeef5;
  padding-top: 16px;
  margin-top: auto;
}

.cart-summary {
  margin-bottom: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
  color: #606266;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
  border-top: 2px solid #ebeef5;
  padding-top: 8px;
  margin-top: 4px;
}

.total-amount {
  color: #409eff;
}

.cart-actions {
  display: flex;
  gap: 8px;
}

.cart-actions .el-button {
  flex: 1;
}

.cart-actions .el-button.el-button--success {
  flex: 2;
}

.checkout-confirm {
  padding: 8px 0;
}

.checkout-summary {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.checkout-summary .summary-row {
  padding: 6px 0;
  font-size: 15px;
}

.checkout-summary .summary-row.total {
  font-size: 20px;
}

@media (max-width: 992px) {
  .quick-sale-grid {
    flex-direction: column;
  }

  .cart-items {
    max-height: 300px;
  }
}

@media (max-width: 768px) {
  .quick-sale-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }

  .product-buttons {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .product-btn {
    padding: 12px 8px;
  }

  .product-btn .product-icon {
    font-size: 22px;
  }

  .product-btn .product-name {
    font-size: 12px;
  }

  .product-btn .product-price {
    font-size: 12px;
  }

  .custom-amount-section .el-col {
    margin-bottom: 8px;
  }

  .cart-items {
    max-height: 200px;
  }

  .cart-item {
    flex-wrap: wrap;
    gap: 6px;
  }

  .item-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .cart-actions {
    flex-direction: column;
  }

  .cart-actions .el-button {
    width: 100%;
  }
}
</style>