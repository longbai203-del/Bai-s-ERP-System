<template>
  <div class="order-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/orders' }">订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情 #{{ orderData?.orderNumber || '加载中...' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">订单详情</h1>
      </div>
      <div class="header-right">
        <el-button-group>
          <el-button type="primary" :icon="Edit" @click="handleEdit" v-if="canEdit">
            编辑订单
          </el-button>
          <el-button type="success" :icon="DocumentAdd" @click="handleDuplicate" v-if="canDuplicate">
            复制订单
          </el-button>
          <el-button type="warning" :icon="Printer" @click="handlePrint">
            打印
          </el-button>
          <el-button type="danger" :icon="Delete" @click="handleDelete" v-if="canDelete">
            删除
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 订单详情内容 -->
    <template v-else-if="orderData">
      <!-- 订单状态横幅 -->
      <div class="status-banner" :class="statusClass">
        <div class="status-info">
          <el-tag :type="statusType" size="large" effect="dark">
            {{ statusText }}
          </el-tag>
          <span class="order-number">订单编号：{{ orderData.orderNumber }}</span>
          <span class="order-date">创建时间：{{ formatDate(orderData.createdAt) }}</span>
        </div>
        <div class="status-actions">
          <el-button
            v-if="canUpdateStatus"
            type="primary"
            size="small"
            @click="handleStatusUpdate"
          >
            更新状态
          </el-button>
        </div>
      </div>

      <!-- 主内容区 -->
      <el-row :gutter="20">
        <!-- 左侧：订单信息 -->
        <el-col :span="16">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>订单信息</span>
                <el-tag :type="paymentStatusType" size="small">
                  支付状态：{{ paymentStatusText }}
                </el-tag>
              </div>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="订单编号">
                {{ orderData.orderNumber }}
              </el-descriptions-item>
              <el-descriptions-item label="订单状态">
                <el-tag :type="statusType">{{ statusText }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="客户名称">
                <el-link type="primary" @click="goToCustomer(orderData.customerId)">
                  {{ orderData.customerName || '未知客户' }}
                </el-link>
              </el-descriptions-item>
              <el-descriptions-item label="客户电话">
                {{ orderData.customerPhone || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="订单金额">
                <span class="amount">¥{{ orderData.grandTotal?.toFixed(2) || '0.00' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="支付方式">
                {{ orderData.paymentMethod || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ formatDate(orderData.createdAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="更新时间">
                {{ formatDate(orderData.updatedAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">
                {{ orderData.note || '无' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 订单商品 -->
          <el-card class="items-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>订单商品</span>
                <span class="item-count">共 {{ orderItems.length }} 件商品</span>
              </div>
            </template>
            <el-table :data="orderItems" border stripe>
              <el-table-column prop="sku" label="SKU" width="120" />
              <el-table-column prop="name" label="商品名称" min-width="200" />
              <el-table-column prop="quantity" label="数量" width="80" align="center" />
              <el-table-column prop="price" label="单价" width="120" align="right">
                <template #default="{ row }">
                  ¥{{ row.price?.toFixed(2) || '0.00' }}
                </template>
              </el-table-column>
              <el-table-column prop="total" label="小计" width="140" align="right">
                <template #default="{ row }">
                  ¥{{ (row.price * row.quantity)?.toFixed(2) || '0.00' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template #default="{ row }">
                  <el-button type="text" size="small" @click="viewProduct(row.productId)">
                    查看商品
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 订单汇总 -->
            <div class="order-summary">
              <div class="summary-row">
                <span class="label">商品总额：</span>
                <span class="value">¥{{ orderData.totalAmount?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="summary-row" v-if="orderData.discountAmount">
                <span class="label">折扣：</span>
                <span class="value discount">-¥{{ orderData.discountAmount?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="summary-row" v-if="orderData.taxAmount">
                <span class="label">税费：</span>
                <span class="value">¥{{ orderData.taxAmount?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="summary-row" v-if="orderData.shippingAmount">
                <span class="label">运费：</span>
                <span class="value">¥{{ orderData.shippingAmount?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="summary-row grand-total">
                <span class="label">合计：</span>
                <span class="value">¥{{ orderData.grandTotal?.toFixed(2) || '0.00' }}</span>
              </div>
            </div>
          </el-card>

          <!-- 订单日志 -->
          <el-card class="log-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>操作日志</span>
                <el-button type="text" size="small" @click="loadLogs">
                  刷新
                </el-button>
              </div>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="log in orderLogs"
                :key="log.id"
                :timestamp="formatDate(log.createdAt)"
                :type="log.type"
                :color="log.color"
                placement="top"
              >
                <div class="log-content">
                  <span class="log-action">{{ log.action }}</span>
                  <span class="log-operator">{{ log.operator }}</span>
                  <span class="log-detail">{{ log.detail }}</span>
                </div>
              </el-timeline-item>
              <el-timeline-item v-if="orderLogs.length === 0" placement="top">
                <div class="log-empty">暂无操作记录</div>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>

        <!-- 右侧：客户信息 & 收货地址 -->
        <el-col :span="8">
          <!-- 客户信息 -->
          <el-card class="customer-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>客户信息</span>
                <el-button type="text" size="small" @click="goToCustomer(orderData.customerId)">
                  查看详情
                </el-button>
              </div>
            </template>
            <div class="customer-info">
              <div class="customer-avatar">
                <el-avatar :size="64" :src="customerAvatar">
                  {{ customerInitials }}
                </el-avatar>
              </div>
              <div class="customer-details">
                <div class="customer-name">{{ orderData.customerName || '未知客户' }}</div>
                <div class="customer-email">{{ orderData.customerEmail || '-' }}</div>
                <div class="customer-phone">{{ orderData.customerPhone || '-' }}</div>
                <div class="customer-stats">
                  <el-tag size="small" type="info">订单数：{{ orderData.customerOrderCount || 0 }}</el-tag>
                  <el-tag size="small" type="warning">总消费：¥{{ orderData.customerTotalSpent?.toFixed(2) || '0.00' }}</el-tag>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 收货地址 -->
          <el-card class="address-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>收货地址</span>
              </div>
            </template>
            <div class="address-info" v-if="orderData.shippingAddress">
              <div class="address-line">
                <el-icon><Location /></el-icon>
                <span>{{ orderData.shippingAddress.name }}</span>
              </div>
              <div class="address-line">
                <el-icon><Phone /></el-icon>
                <span>{{ orderData.shippingAddress.phone }}</span>
              </div>
              <div class="address-line full-address">
                <span>{{ orderData.shippingAddress.address }}</span>
              </div>
              <div class="address-line">
                <span>{{ orderData.shippingAddress.city }}，{{ orderData.shippingAddress.country }}</span>
              </div>
              <div class="address-line" v-if="orderData.shippingAddress.postalCode">
                <span>邮编：{{ orderData.shippingAddress.postalCode }}</span>
              </div>
            </div>
            <div v-else class="address-empty">
              暂无收货地址
            </div>
          </el-card>

          <!-- 支付信息 -->
          <el-card class="payment-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>支付信息</span>
              </div>
            </template>
            <div class="payment-info">
              <div class="payment-row">
                <span class="label">支付状态：</span>
                <el-tag :type="paymentStatusType" size="small">
                  {{ paymentStatusText }}
                </el-tag>
              </div>
              <div class="payment-row" v-if="orderData.paymentMethod">
                <span class="label">支付方式：</span>
                <span>{{ orderData.paymentMethod }}</span>
              </div>
              <div class="payment-row" v-if="orderData.paymentDate">
                <span class="label">支付时间：</span>
                <span>{{ formatDate(orderData.paymentDate) }}</span>
              </div>
              <div class="payment-row" v-if="orderData.transactionId">
                <span class="label">交易号：</span>
                <span class="transaction-id">{{ orderData.transactionId }}</span>
              </div>
            </div>
          </el-card>

          <!-- 快捷操作 -->
          <el-card class="quick-actions-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>快捷操作</span>
              </div>
            </template>
            <div class="quick-actions">
              <el-button
                v-for="action in quickActions"
                :key="action.key"
                :type="action.type"
                :icon="action.icon"
                size="small"
                @click="action.handler"
                :disabled="!action.enabled"
                block
              >
                {{ action.label }}
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- 空状态 -->
    <el-empty v-else description="订单不存在" />

    <!-- 更新状态对话框 -->
    <el-dialog
      v-model="statusDialogVisible"
      title="更新订单状态"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="statusForm" label-width="100px">
        <el-form-item label="订单状态">
          <el-select v-model="statusForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="statusForm.note"
            type="textarea"
            :rows="3"
            placeholder="请输入状态变更备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmStatusUpdate" :loading="statusUpdating">
          确认更新
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Edit,
  DocumentAdd,
  Printer,
  Delete,
  Location,
  Phone,
} from '@element-plus/icons-vue';
import { useOrderStore } from '../store';
import { useCustomerStore } from '@/modules/customers/store';
import { formatDate } from '@/utils/format';

// ==================== 路由和Store ====================
const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const customerStore = useCustomerStore();

// ==================== 状态 ====================
const loading = ref(true);
const orderData = ref<any>(null);
const orderItems = ref<any[]>([]);
const orderLogs = ref<any[]>([]);
const customerAvatar = ref('');
const statusDialogVisible = ref(false);
const statusUpdating = ref(false);

// ==================== 表单 ====================
const statusForm = reactive({
  status: '',
  note: '',
});

// ==================== 计算属性 ====================
const customerInitials = computed(() => {
  if (!orderData.value?.customerName) return '?';
  return orderData.value.customerName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const statusText = computed(() => {
  const map: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    processing: '处理中',
    shipped: '已发货',
    delivered: '已送达',
    cancelled: '已取消',
    refunded: '已退款',
  };
  return map[orderData.value?.status] || orderData.value?.status || '未知';
});

const statusType = computed(() => {
  const map: Record<string, string> = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'primary',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
    refunded: 'info',
  };
  return map[orderData.value?.status] || 'info';
});

const statusClass = computed(() => {
  return `status-${orderData.value?.status || 'unknown'}`;
});

const paymentStatusText = computed(() => {
  const map: Record<string, string> = {
    pending: '待支付',
    paid: '已支付',
    failed: '支付失败',
    refunded: '已退款',
    partial: '部分支付',
  };
  return map[orderData.value?.paymentStatus] || orderData.value?.paymentStatus || '未知';
});

const paymentStatusType = computed(() => {
  const map: Record<string, string> = {
    pending: 'warning',
    paid: 'success',
    failed: 'danger',
    refunded: 'info',
    partial: 'warning',
  };
  return map[orderData.value?.paymentStatus] || 'info';
});

const canEdit = computed(() => {
  return orderData.value?.status !== 'delivered' && orderData.value?.status !== 'cancelled';
});

const canDuplicate = computed(() => true);
const canDelete = computed(() => {
  return orderData.value?.status === 'pending' || orderData.value?.status === 'cancelled';
});

const canUpdateStatus = computed(() => {
  return orderData.value?.status !== 'delivered' && orderData.value?.status !== 'cancelled';
});

const statusOptions = computed(() => {
  const allStatuses = [
    { value: 'pending', label: '待确认' },
    { value: 'confirmed', label: '已确认' },
    { value: 'processing', label: '处理中' },
    { value: 'shipped', label: '已发货' },
    { value: 'delivered', label: '已送达' },
    { value: 'cancelled', label: '已取消' },
    { value: 'refunded', label: '已退款' },
  ];

  const currentStatus = orderData.value?.status;
  const available: Record<string, string[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: [],
    refunded: [],
  };

  const availableStatuses = available[currentStatus] || [];
  return allStatuses.filter((s) => availableStatuses.includes(s.value) || s.value === currentStatus);
});

// 快捷操作
const quickActions = computed(() => {
  const actions = [];

  if (orderData.value?.status === 'pending') {
    actions.push({
      key: 'confirm',
      label: '确认订单',
      type: 'success',
      icon: 'Check',
      enabled: true,
      handler: () => handleQuickAction('confirm'),
    });
  }

  if (orderData.value?.status === 'confirmed' || orderData.value?.status === 'processing') {
    actions.push({
      key: 'ship',
      label: '标记发货',
      type: 'primary',
      icon: 'Ship',
      enabled: true,
      handler: () => handleQuickAction('ship'),
    });
  }

  if (orderData.value?.status === 'shipped') {
    actions.push({
      key: 'deliver',
      label: '标记送达',
      type: 'success',
      icon: 'Finished',
      enabled: true,
      handler: () => handleQuickAction('deliver'),
    });
  }

  if (['pending', 'confirmed', 'processing', 'shipped'].includes(orderData.value?.status)) {
    actions.push({
      key: 'cancel',
      label: '取消订单',
      type: 'danger',
      icon: 'CircleClose',
      enabled: true,
      handler: () => handleQuickAction('cancel'),
    });
  }

  return actions;
});

// ==================== 方法 ====================

/**
 * 加载订单详情
 */
const loadOrderDetail = async () => {
  const id = route.params.id as string;
  if (!id) {
    ElMessage.error('订单ID无效');
    router.push('/orders');
    return;
  }

  loading.value = true;
  try {
    const data = await orderStore.getOrderDetail(id);
    if (data) {
      orderData.value = data;
      orderItems.value = data.items || [];
      await loadCustomerInfo(data.customerId);
      await loadOrderLogs(id);
    } else {
      ElMessage.error('订单不存在');
      router.push('/orders');
    }
  } catch (error) {
    console.error('加载订单详情失败:', error);
    ElMessage.error('加载订单详情失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 加载客户信息
 */
const loadCustomerInfo = async (customerId: string) => {
  if (!customerId) return;
  try {
    const customer = await customerStore.getCustomerDetail(customerId);
    if (customer) {
      orderData.value.customerName = customer.name;
      orderData.value.customerEmail = customer.email;
      orderData.value.customerPhone = customer.phone;
      orderData.value.customerOrderCount = customer.totalOrders || 0;
      orderData.value.customerTotalSpent = customer.totalSpent || 0;
      customerAvatar.value = customer.avatar || '';
    }
  } catch (error) {
    console.error('加载客户信息失败:', error);
  }
};

/**
 * 加载订单日志
 */
const loadOrderLogs = async (orderId: string) => {
  try {
    // 实际项目中调用API获取日志
    orderLogs.value = [
      {
        id: '1',
        action: '订单创建',
        operator: '系统',
        detail: '客户提交订单',
        createdAt: orderData.value?.createdAt,
        type: 'primary',
        color: '#409EFF',
      },
      {
        id: '2',
        action: '订单确认',
        operator: '管理员',
        detail: '订单已确认',
        createdAt: new Date(Date.now() - 3600000),
        type: 'success',
        color: '#67C23A',
      },
    ];
  } catch (error) {
    console.error('加载订单日志失败:', error);
  }
};

/**
 * 加载日志（刷新）
 */
const loadLogs = async () => {
  if (orderData.value?.id) {
    await loadOrderLogs(orderData.value.id);
    ElMessage.success('日志已刷新');
  }
};

/**
 * 编辑订单
 */
const handleEdit = () => {
  router.push(`/orders/${orderData.value.id}/edit`);
};

/**
 * 复制订单
 */
const handleDuplicate = async () => {
  try {
    await ElMessageBox.confirm('确定要复制此订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });
    // 实际项目中调用复制API
    ElMessage.success('订单复制成功');
    router.push(`/orders/create?copy=${orderData.value.id}`);
  } catch {
    // 用户取消
  }
};

/**
 * 打印订单
 */
const handlePrint = () => {
  window.print();
};

/**
 * 删除订单
 */
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除此订单吗？此操作不可恢复！', '警告', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await orderStore.deleteOrder(orderData.value.id);
    ElMessage.success('订单删除成功');
    router.push('/orders');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除订单失败:', error);
      ElMessage.error('删除订单失败');
    }
  }
};

/**
 * 更新订单状态
 */
const handleStatusUpdate = () => {
  statusForm.status = orderData.value?.status || '';
  statusForm.note = '';
  statusDialogVisible.value = true;
};

/**
 * 确认更新状态
 */
const confirmStatusUpdate = async () => {
  if (!statusForm.status) {
    ElMessage.warning('请选择订单状态');
    return;
  }

  statusUpdating.value = true;
  try {
    await orderStore.updateOrderStatus(orderData.value.id, {
      status: statusForm.status,
      note: statusForm.note,
    });
    ElMessage.success('订单状态更新成功');
    statusDialogVisible.value = false;
    await loadOrderDetail();
  } catch (error) {
    console.error('更新订单状态失败:', error);
    ElMessage.error('更新订单状态失败');
  } finally {
    statusUpdating.value = false;
  }
};

/**
 * 快捷操作
 */
const handleQuickAction = async (action: string) => {
  const actionMap: Record<string, { label: string; status: string; message: string }> = {
    confirm: { label: '确认', status: 'confirmed', message: '订单已确认' },
    ship: { label: '发货', status: 'shipped', message: '订单已标记为发货' },
    deliver: { label: '送达', status: 'delivered', message: '订单已标记为已送达' },
    cancel: { label: '取消', status: 'cancelled', message: '订单已取消' },
  };

  const actionInfo = actionMap[action];
  if (!actionInfo) return;

  try {
    await ElMessageBox.confirm(`确定要${actionInfo.label}此订单吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await orderStore.updateOrderStatus(orderData.value.id, {
      status: actionInfo.status,
      note: `通过快捷操作${actionInfo.label}订单`,
    });
    ElMessage.success(actionInfo.message);
    await loadOrderDetail();
  } catch (error) {
    if (error !== 'cancel') {
      console.error(`${actionInfo.label}订单失败:`, error);
      ElMessage.error(`${actionInfo.label}订单失败`);
    }
  }
};

/**
 * 查看客户
 */
const goToCustomer = (customerId: string) => {
  if (customerId) {
    router.push(`/customers/${customerId}`);
  }
};

/**
 * 查看商品
 */
const viewProduct = (productId: string) => {
  if (productId) {
    router.push(`/products/${productId}`);
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadOrderDetail();
});
</script>

<style scoped lang="scss">
.order-detail-page {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;

    .header-left {
      .page-title {
        font-size: 24px;
        font-weight: 600;
        margin: 8px 0 0;
        color: #303133;
      }
    }

    .header-right {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  }

  .loading-container {
    padding: 40px 0;
  }

  .status-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-radius: 8px;
    margin-bottom: 24px;
    background: #f0f9ff;
    border: 1px solid #b3d8ff;

    &.status-pending {
      background: #fdf6ec;
      border-color: #f5dab1;
    }

    &.status-confirmed {
      background: #f0f9ff;
      border-color: #b3d8ff;
    }

    &.status-processing {
      background: #ecf5ff;
      border-color: #b3d8ff;
    }

    &.status-shipped {
      background: #ecf5ff;
      border-color: #b3d8ff;
    }

    &.status-delivered {
      background: #f0f9eb;
      border-color: #b3e0b3;
    }

    &.status-cancelled {
      background: #fef0f0;
      border-color: #f5baba;
    }

    .status-info {
      display: flex;
      align-items: center;
      gap: 16px;

      .order-number {
        font-weight: 500;
        color: #303133;
      }

      .order-date {
        color: #909399;
        font-size: 14px;
      }
    }
  }

  .info-card,
  .items-card,
  .log-card,
  .customer-card,
  .address-card,
  .payment-card,
  .quick-actions-card {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;

    .item-count {
      font-size: 14px;
      font-weight: 400;
      color: #909399;
    }
  }

  .amount {
    font-weight: 600;
    color: #e6a23c;
    font-size: 16px;
  }

  .order-summary {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #ebeef5;
    text-align: right;

    .summary-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      padding: 4px 0;

      .label {
        color: #606266;
        font-size: 14px;
      }

      .value {
        font-weight: 500;
        min-width: 100px;
        text-align: right;

        &.discount {
          color: #f56c6c;
        }
      }

      &.grand-total {
        font-size: 18px;

        .value {
          font-weight: 700;
          color: #e6a23c;
          font-size: 20px;
        }
      }
    }
  }

  .customer-info {
    display: flex;
    gap: 16px;
    align-items: flex-start;

    .customer-avatar {
      flex-shrink: 0;
    }

    .customer-details {
      flex: 1;

      .customer-name {
        font-weight: 600;
        font-size: 16px;
        color: #303133;
      }

      .customer-email,
      .customer-phone {
        color: #606266;
        font-size: 14px;
        margin-top: 4px;
      }

      .customer-stats {
        margin-top: 8px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    }
  }

  .address-info {
    .address-line {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
      color: #606266;
      font-size: 14px;

      .el-icon {
        color: #909399;
        flex-shrink: 0;
      }

      &.full-address {
        margin-top: 4px;
        padding: 8px 12px;
        background: #f5f7fa;
        border-radius: 4px;
        font-weight: 500;
      }
    }
  }

  .address-empty {
    color: #909399;
    text-align: center;
    padding: 16px 0;
  }

  .payment-info {
    .payment-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #f5f7fa;

      &:last-child {
        border-bottom: none;
      }

      .label {
        color: #606266;
      }

      .transaction-id {
        font-family: monospace;
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .log-content {
    .log-action {
      font-weight: 500;
      color: #303133;
      margin-right: 8px;
    }

    .log-operator {
      color: #606266;
      margin-right: 8px;
    }

    .log-detail {
      color: #909399;
    }
  }

  .log-empty {
    color: #909399;
    text-align: center;
    padding: 12px 0;
  }
}

@media print {
  .page-header .header-right,
  .status-banner .status-actions,
  .quick-actions-card {
    display: none !important;
  }

  .el-card {
    box-shadow: none !important;
    border: 1px solid #dcdfe6 !important;
  }
}

@media (max-width: 768px) {
  .order-detail-page {
    padding: 12px;

    .page-header {
      flex-direction: column;
      gap: 12px;

      .header-right {
        width: 100%;
        flex-wrap: wrap;
      }
    }

    .status-banner {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;

      .status-info {
        flex-wrap: wrap;
      }
    }
  }
}
</style>