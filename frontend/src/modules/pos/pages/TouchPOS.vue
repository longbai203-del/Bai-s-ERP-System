<template>
  <div class="touch-pos-page">
    <!-- 页面标题 -->
    <div class="touch-header">
      <div class="header-left">
        <h1>
          <el-icon :size="28" color="#4F46E5"><HandPointer /></el-icon>
          触屏收银
          <el-tag type="success" size="small">🟢 在线</el-tag>
        </h1>
      </div>
      <div class="header-info">
        <span><el-icon><User /></el-icon> {{ cashierName }}</span>
        <span><el-icon><Clock /></el-icon> {{ currentTime }}</span>
        <span><el-icon><ShoppingCart /></el-icon> <strong>{{ cartItems.length }}</strong></span>
        <el-button size="small" @click="handleStats">
          <el-icon><DataAnalysis /></el-icon> 统计
        </el-button>
      </div>
    </div>

    <!-- 触屏收银主体 -->
    <div class="touch-grid">
      <!-- 左侧：商品区域 -->
      <div class="touch-products">
        <div class="category-bar">
          <el-button
            v-for="cat in categories"
            :key="cat"
            size="large"
            :type="currentCategory === cat ? 'primary' : 'default'"
            @click="selectCategory(cat)"
          >
            {{ cat }}
          </el-button>
        </div>

        <div class="product-grid" v-loading="productLoading">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-btn"
            @click="addToCart(product)"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <span class="icon">{{ product.icon }}</span>
            <span class="name">{{ product.name }}</span>
            <span class="price">¥{{ formatNumber(product.price) }}</span>
            <span class="stock" :class="{ 'low-stock': product.stock < 50 }">
              {{ product.stock }}
            </span>
          </div>
          <div v-if="filteredProducts.length === 0" class="product-empty">
            <el-empty description="暂无商品" />
          </div>
        </div>
      </div>

      <!-- 右侧：购物车 -->
      <div class="touch-cart">
        <div class="cart-header">
          <span class="cart-title">
            <el-icon><ShoppingCart /></el-icon> 购物车
          </span>
          <span class="cart-count">{{ cartItems.length }} 项</span>
        </div>

        <div class="cart-items" ref="cartItemsRef">
          <div v-if="cartItems.length === 0" class="cart-empty">
            <el-icon :size="48" color="#c0c4cc"><ShoppingCart /></el-icon>
            <p>点击左侧商品添加</p>
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
            <el-button size="large" @click="handleClearCart" :disabled="cartItems.length === 0">
              <el-icon><Delete /></el-icon> 清空
            </el-button>
            <el-button size="large" @click="handleApplyDiscount" :disabled="cartItems.length === 0">
              <el-icon><Percent /></el-icon> 折扣
            </el-button>
            <el-button type="success" size="large" @click="handleCheckout" :disabled="cartItems.length === 0">
              <el-icon><Check /></el-icon> 结算
            </el-button>
          </div>

          <!-- 数字键盘 -->
          <div class="touch-keypad">
            <button v-for="key in keypadKeys" :key="key" class="key-btn" @click="handleKeyPress(key)">
              {{ key }}
            </button>
            <button class="key-btn key-clear" @click="handleKeyPress('clear')">⌫</button>
            <button class="key-btn key-enter" @click="handleKeyPress('enter')">↵</button>
            <button class="key-btn key-double" @click="handleKeyPress('00')">00</button>
            <button class="key-btn key-clear-all" @click="handleKeyPress('clearAll')">C</button>
            <button class="key-btn key-confirm" @click="handleKeyPress('confirm')">确认</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 折扣对话框 -->
    <el-dialog
      v-model="discountDialogVisible"
      title="应用折扣"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="discountForm" label-width="100px">
        <el-form-item label="折扣类型">
          <el-radio-group v-model="discountForm.type">
            <el-radio label="percent">百分比</el-radio>
            <el-radio label="fixed">固定金额</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="折扣值">
          <el-input-number
            v-model="discountForm.value"
            :min="0"
            :precision="discountForm.type === 'percent' ? 0 : 2"
            :max="discountForm.type === 'percent' ? 100 : subtotal"
            controls-position="right"
            style="width: 100%"
          />
          <span style="margin-left: 8px; color: #909399;">
            {{ discountForm.type === 'percent' ? '%' : '元' }}
          </span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="discountDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDiscount">确认应用</el-button>
      </template>
    </el-dialog>

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
          <div class="summary-row" v-if="discount > 0">
            <span>折扣</span>
            <span style="color: #e6a23c;">-¥{{ formatNumber(discountAmount) }}</span>
          </div>
          <div class="summary-row total">
            <span>应付金额</span>
            <span class="total-amount">¥{{ formatNumber(totalAmount) }}</span>
          </div>
        </div>

        <el-form :model="checkoutForm" label-width="100px" style="margin-top: 16px;">
          <el-form-item label="支付方式">
            <el-radio-group v-model="checkoutForm.paymentMethod" size="large">
              <el-radio-button label="现金">现金</el-radio-button>
              <el-radio-button label="微信支付">微信</el-radio-button>
              <el-radio-button label="支付宝">支付宝</el-radio-button>
              <el-radio-button label="会员卡">会员卡</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="客户姓名">
            <el-input v-model="checkoutForm.customer" placeholder="请输入客户姓名（可选）" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="checkoutDialogVisible = false">取消</el-button>
        <el-button type="success" size="large" :loading="checkoutLoading" @click="confirmCheckout">
          确认结算
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  HandPointer,
  User,
  Clock,
  ShoppingCart,
  DataAnalysis,
  Plus,
  Minus,
  Delete,
  Percent,
  Check,
  Warning
} from '@element-plus/icons-vue'

// ========== 响应式数据 ==========
const cashierName = ref('张伟')
const currentTime = ref('')
const productLoading = ref(false)
const discountDialogVisible = ref(false)
const checkoutDialogVisible = ref(false)
const checkoutLoading = ref(false)
const discount = ref(0)
const currentCategory = ref('全部')
const cartItemsRef = ref<HTMLElement>()

// 分类
const categories = ['全部', '洗车', '美容', '保养', '配件', '套餐']

// 商品列表
const products = ref([
  { id: 1, name: '标准洗车', category: '洗车', price: 89, stock: 999, icon: '🚗' },
  { id: 2, name: '精致洗车', category: '洗车', price: 159, stock: 999, icon: '🚙' },
  { id: 3, name: '全车镀晶', category: '美容', price: 899, stock: 50, icon: '✨' },
  { id: 4, name: '内饰清洁', category: '美容', price: 299, stock: 80, icon: '🧹' },
  { id: 5, name: '机油更换', category: '保养', price: 399, stock: 120, icon: '🔧' },
  { id: 6, name: '轮胎护理', category: '保养', price: 120, stock: 60, icon: '🛞' },
  { id: 7, name: '行车记录仪', category: '配件', price: 459, stock: 30, icon: '📹' },
  { id: 8, name: '洗车套餐', category: '套餐', price: 599, stock: 200, icon: '📦' },
  { id: 9, name: '空调清洗', category: '保养', price: 259, stock: 45, icon: '❄️' },
  { id: 10, name: '漆面抛光', category: '美容', price: 499, stock: 35, icon: '🌟' },
  { id: 11, name: '脚垫定制', category: '配件', price: 389, stock: 25, icon: '🧩' },
  { id: 12, name: 'VIP洗车卡', category: '套餐', price: 999, stock: 100, icon: '💳' }
])

// 购物车
const cartItems = ref<Array<{ id: number; name: string; category: string; price: number; qty: number; stock: number; icon: string }>>([])

// 折扣表单
const discountForm = reactive({
  type: 'percent' as 'percent' | 'fixed',
  value: 0
})

// 结算表单
const checkoutForm = reactive({
  paymentMethod: '微信支付',
  customer: ''
})

// 数字键盘
const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0']
let keypadInput = ''

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const filteredProducts = computed(() => {
  if (currentCategory.value === '全部') {
    return products.value
  }
  return products.value.filter(p => p.category === currentCategory.value)
})

const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.qty, 0)
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
})

const discountAmount = computed(() => {
  if (discountForm.type === 'percent') {
    return subtotal.value * (discount.value / 100)
  } else {
    return discount.value
  }
})

const totalAmount = computed(() => {
  return Math.max(0, subtotal.value - discountAmount.value)
})

// ========== 时钟更新 ==========
const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
}

let clockInterval: number | null = null

// ========== 分类选择 ==========
const selectCategory = (category: string) => {
  currentCategory.value = category
}

// ========== 购物车操作 ==========
const addToCart = (product: any) => {
  const existing = cartItems.value.find(item => item.id === product.id)
  if (existing) {
    if (existing.qty + 1 > existing.stock) {
      ElMessage.warning('库存不足')
      return
    }
    existing.qty += 1
  } else {
    cartItems.value.push({
      ...product,
      qty: 1
    })
  }
  scrollCartToBottom()
  // 触屏反馈
  const btn = document.querySelector(`[data-product-id="${product.id}"]`)
  if (btn) {
    btn.classList.add('touch-pulse')
    setTimeout(() => btn.classList.remove('touch-pulse'), 300)
  }
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
  if (newQty > item.stock) {
    ElMessage.warning('库存不足')
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
    discount.value = 0
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

// ========== 触屏反馈 ==========
const handleTouchStart = (e: TouchEvent) => {
  const target = e.currentTarget as HTMLElement
  target.style.transform = 'scale(0.92)'
}

const handleTouchEnd = (e: TouchEvent) => {
  const target = e.currentTarget as HTMLElement
  target.style.transform = 'scale(1)'
}

// ========== 折扣操作 ==========
const handleApplyDiscount = () => {
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车为空')
    return
  }
  discountForm.type = 'percent'
  discountForm.value = 0
  discountDialogVisible.value = true
}

const confirmDiscount = () => {
  if (discountForm.value <= 0) {
    ElMessage.warning('请输入有效的折扣值')
    return
  }
  if (discountForm.type === 'percent' && discountForm.value > 100) {
    ElMessage.warning('折扣百分比不能超过100%')
    return
  }
  if (discountForm.type === 'fixed' && discountForm.value > subtotal.value) {
    ElMessage.warning('折扣金额不能超过小计')
    return
  }
  discount.value = discountForm.value
  discountDialogVisible.value = false
  ElMessage.success(`已应用折扣`)
}

// ========== 结算操作 ==========
const handleCheckout = () => {
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车为空')
    return
  }
  checkoutForm.paymentMethod = '微信支付'
  checkoutForm.customer = ''
  checkoutDialogVisible.value = true
}

const confirmCheckout = async () => {
  checkoutLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const orderNo = `POS-${Date.now().toString().slice(-6)}`
    ElMessage.success(`订单 ${orderNo} 结算成功！`)
    checkoutDialogVisible.value = false
    cartItems.value = []
    discount.value = 0
  } finally {
    checkoutLoading.value = false
  }
}

// ========== 数字键盘 ==========
const handleKeyPress = (key: string) => {
  if (key === 'clear') {
    keypadInput = keypadInput.slice(0, -1)
    updateKeypadDisplay()
    return
  }
  if (key === 'clearAll') {
    keypadInput = ''
    updateKeypadDisplay()
    return
  }
  if (key === '00') {
    keypadInput += '00'
    updateKeypadDisplay()
    return
  }
  if (key === 'enter' || key === 'confirm') {
    if (keypadInput && parseFloat(keypadInput) > 0) {
      // 将输入作为自定义金额添加到购物车
      const amount = parseFloat(keypadInput)
      cartItems.value.push({
        id: Date.now(),
        name: '自定义金额',
        category: '其他',
        price: amount,
        qty: 1,
        stock: 999,
        icon: '💰'
      })
      keypadInput = ''
      updateKeypadDisplay()
      scrollCartToBottom()
      ElMessage.success(`已添加 ¥${formatNumber(amount)}`)
    } else {
      ElMessage.warning('请输入有效金额')
    }
    return
  }
  keypadInput += key
  updateKeypadDisplay()
}

const updateKeypadDisplay = () => {
  const totalEl = document.querySelector('.total-amount')
  if (totalEl) {
    if (keypadInput) {
      totalEl.textContent = `¥${formatNumber(parseFloat(keypadInput))}`
    } else {
      totalEl.textContent = `¥${formatNumber(totalAmount.value)}`
    }
  }
}

// ========== 统计 ==========
const handleStats = () => {
  ElMessage.info('统计功能开发中')
}

// ========== 生命周期 ==========
onMounted(() => {
  updateClock()
  clockInterval = window.setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (clockInterval) {
    clearInterval(clockInterval)
  }
})
</script>

<style scoped>
.touch-pos-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.touch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
  background: #ffffff;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

.header-info {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
  color: #606266;
}

.header-info span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.touch-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  min-height: calc(100vh - 180px);
}

.touch-products {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.category-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.category-bar .el-button {
  flex: 1;
  min-width: 60px;
  height: 44px;
  font-size: 15px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding: 4px;
  max-height: calc(100vh - 320px);
}

.product-grid::-webkit-scrollbar {
  width: 4px;
}

.product-grid::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.product-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 8px;
  background: #fafbfc;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  min-height: 110px;
}

.product-btn:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.product-btn:active,
.product-btn.touch-pulse {
  transform: scale(0.92);
}

.product-btn .icon {
  font-size: 32px;
  margin-bottom: 4px;
}

.product-btn .name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  text-align: center;
  line-height: 1.2;
}

.product-btn .price {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
}

.product-btn .stock {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 10px;
  color: #909399;
  background: #f0f2f5;
  padding: 0 6px;
  border-radius: 8px;
}

.product-btn .stock.low-stock {
  color: #f56c6c;
}

.product-empty {
  grid-column: 1 / -1;
  padding: 40px 0;
}

/* 购物车 */
.touch-cart {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f2f5;
}

.cart-title {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cart-count {
  font-size: 13px;
  color: #909399;
}

.cart-items {
  flex: 1;
  max-height: calc(100vh - 480px);
  overflow-y: auto;
  padding: 4px 0;
  min-height: 150px;
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
  padding: 8px 10px;
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
  gap: 3px;
}

.item-actions .qty {
  min-width: 20px;
  text-align: center;
  font-weight: 500;
}

.item-total {
  font-weight: 600;
  color: #409eff;
  min-width: 60px;
  text-align: right;
  font-size: 13px;
}

.cart-footer {
  border-top: 1px solid #ebeef5;
  padding-top: 12px;
  margin-top: auto;
}

.cart-summary {
  margin-bottom: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
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
  gap: 6px;
}

.cart-actions .el-button {
  flex: 1;
}

.cart-actions .el-button.el-button--success {
  flex: 2;
}

/* 数字键盘 */
.touch-keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-top: 10px;
}

.key-btn {
  padding: 12px 0;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #fafbfc;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.key-btn:active {
  transform: scale(0.92);
  background: #ecf5ff;
}

.key-clear {
  background: #fef0f0;
  color: #f56c6c;
}

.key-clear:active {
  background: #fde2e2;
}

.key-enter {
  background: #ecf5ff;
  color: #409eff;
}

.key-enter:active {
  background: #d9ecff;
}

.key-double {
  background: #f5f7fa;
}

.key-clear-all {
  background: #fef0f0;
  color: #f56c6c;
}

.key-confirm {
  background: #67c23a;
  color: #fff;
  border-color: #67c23a;
}

.key-confirm:active {
  background: #5daf34;
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

@media (max-width: 1024px) {
  .touch-grid {
    grid-template-columns: 1fr 340px;
  }
}

@media (max-width: 768px) {
  .touch-pos-page {
    padding: 12px;
  }

  .touch-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-info {
    justify-content: space-between;
  }

  .touch-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    max-height: 300px;
  }

  .product-btn {
    min-height: 90px;
    padding: 10px 6px;
  }

  .product-btn .icon {
    font-size: 24px;
  }

  .product-btn .name {
    font-size: 12px;
  }

  .product-btn .price {
    font-size: 12px;
  }

  .cart-items {
    max-height: 200px;
    min-height: 100px;
  }

  .touch-keypad {
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
  }

  .key-btn {
    padding: 10px 0;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .category-bar .el-button {
    font-size: 12px;
    padding: 8px 10px;
    min-width: 50px;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }

  .product-btn {
    min-height: 80px;
    padding: 8px 4px;
  }

  .product-btn .icon {
    font-size: 20px;
  }

  .product-btn .name {
    font-size: 11px;
  }

  .product-btn .price {
    font-size: 11px;
  }

  .cart-item {
    flex-wrap: wrap;
    gap: 4px;
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