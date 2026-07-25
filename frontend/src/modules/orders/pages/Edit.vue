<template>
  <div class="order-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/orders' }">订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑订单 #{{ orderData?.orderNumber || '加载中...' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">编辑订单</h1>
      </div>
      <div class="header-right">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          保存订单
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 编辑表单 -->
    <template v-else-if="orderData">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="order-form"
      >
        <!-- 基本信息 -->
        <el-card class="form-section" shadow="hover">
          <template #header>
            <div class="section-header">
              <span>基本信息</span>
              <el-tag :type="statusType" size="small">
                {{ statusText }}
              </el-tag>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="订单编号" prop="orderNumber">
                <el-input v-model="formData.orderNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单状态" prop="status">
                <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户" prop="customerId">
                <el-select
                  v-model="formData.customerId"
                  placeholder="请选择客户"
                  filterable
                  remote
                  :remote-method="searchCustomers"
                  :loading="customerSearching"
                  style="width: 100%"
                >
                  <el-option
                    v-for="customer in customerOptions"
                    :key="customer.id"
                    :label="customer.name"
                    :value="customer.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付方式" prop="paymentMethod">
                <el-select v-model="formData.paymentMethod" placeholder="请选择支付方式" style="width: 100%">
                  <el-option label="微信支付" value="wechat" />
                  <el-option label="支付宝" value="alipay" />
                  <el-option label="银行转账" value="bank_transfer" />
                  <el-option label="现金" value="cash" />
                  <el-option label="信用卡" value="credit_card" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="note">
                <el-input
                  v-model="formData.note"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注信息"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 订单商品 -->
        <el-card class="form-section" shadow="hover">
          <template #header>
            <div class="section-header">
              <span>订单商品</span>
              <el-button type="primary" size="small" @click="handleAddItem">
                <el-icon><Plus /></el-icon> 添加商品
              </el-button>
            </div>
          </template>
          <el-table :data="formData.items" border stripe>
            <el-table-column prop="sku" label="SKU" width="140">
              <template #default="{ row, $index }">
                <el-input v-model="row.sku" size="small" placeholder="SKU" @change="() => handleSkuChange($index)" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" min-width="180">
              <template #default="{ row }">
                <el-input v-model="row.name" size="small" placeholder="商品名称" />
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="120">
              <template #default="{ row, $index }">
                <el-input-number
                  v-model="row.quantity"
                  :min="1"
                  :max="9999"
                  size="small"
                  @change="() => calculateItemTotal($index)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" width="140">
              <template #default="{ row, $index }">
                <el-input-number
                  v-model="row.price"
                  :min="0"
                  :precision="2"
                  :step="0.01"
                  size="small"
                  @change="() => calculateItemTotal($index)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="total" label="小计" width="140">
              <template #default="{ row }">
                ¥{{ (row.price * row.quantity)?.toFixed(2) || '0.00' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template #default="{ $index }">
                <el-button type="danger" size="small" @click="handleRemoveItem($index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 订单汇总 -->
          <div class="order-summary">
            <div class="summary-row">
              <span class="label">商品总额：</span>
              <span class="value">¥{{ totalAmount.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span class="label">折扣：</span>
              <el-input-number
                v-model="formData.discountAmount"
                :min="0"
                :precision="2"
                :step="1"
                size="small"
                style="width: 150px"
                @change="calculateGrandTotal"
              />
            </div>
            <div class="summary-row">
              <span class="label">税费：</span>
              <el-input-number
                v-model="formData.taxAmount"
                :min="0"
                :precision="2"
                :step="1"
                size="small"
                style="width: 150px"
                @change="calculateGrandTotal"
              />
            </div>
            <div class="summary-row">
              <span class="label">运费：</span>
              <el-input-number
                v-model="formData.shippingAmount"
                :min="0"
                :precision="2"
                :step="1"
                size="small"
                style="width: 150px"
                @change="calculateGrandTotal"
              />
            </div>
            <div class="summary-row grand-total">
              <span class="label">合计：</span>
              <span class="value">¥{{ grandTotal.toFixed(2) }}</span>
            </div>
          </div>
        </el-card>

        <!-- 收货地址 -->
        <el-card class="form-section" shadow="hover">
          <template #header>
            <div class="section-header">
              <span>收货地址</span>
              <el-button type="text" size="small" @click="copyFromCustomer">
                从客户信息复制
              </el-button>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="收货人" prop="shippingAddress.name">
                <el-input v-model="formData.shippingAddress.name" placeholder="请输入收货人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="shippingAddress.phone">
                <el-input v-model="formData.shippingAddress.phone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="详细地址" prop="shippingAddress.address">
                <el-input v-model="formData.shippingAddress.address" placeholder="请输入详细地址" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="城市" prop="shippingAddress.city">
                <el-input v-model="formData.shippingAddress.city" placeholder="请输入城市" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国家" prop="shippingAddress.country">
                <el-input v-model="formData.shippingAddress.country" placeholder="请输入国家" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="邮编" prop="shippingAddress.postalCode">
                <el-input v-model="formData.shippingAddress.postalCode" placeholder="请输入邮编" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </template>

    <!-- 添加商品对话框 -->
    <el-dialog
      v-model="addItemDialogVisible"
      title="添加商品"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="newItem" label-width="100px">
        <el-form-item label="商品">
          <el-select
            v-model="newItem.productId"
            placeholder="请选择商品"
            filterable
            remote
            :remote-method="searchProducts"
            :loading="productSearching"
            style="width: 100%"
            @change="handleProductSelect"
          >
            <el-option
              v-for="product in productOptions"
              :key="product.id"
              :label="`${product.name} (${product.sku})`"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number
            v-model="newItem.quantity"
            :min="1"
            :max="9999"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number
            v-model="newItem.price"
            :min="0"
            :precision="2"
            :step="0.01"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addItemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddItem">确定添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';
import { useOrderStore } from '../store';
import { useCustomerStore } from '@/modules/customers/store';
import { useProductStore } from '@/modules/products/store';

// ==================== 路由和Store ====================
const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const customerStore = useCustomerStore();
const productStore = useProductStore();

// ==================== 引用 ====================
const formRef = ref<FormInstance>();

// ==================== 状态 ====================
const loading = ref(true);
const submitting = ref(false);
const customerSearching = ref(false);
const productSearching = ref(false);
const addItemDialogVisible = ref(false);

// ==================== 数据 ====================
const orderData = ref<any>(null);
const customerOptions = ref<any[]>([]);
const productOptions = ref<any[]>([]);

// ==================== 表单数据 ====================
const formData = reactive({
  id: '',
  orderNumber: '',
  customerId: '',
  status: 'pending',
  paymentMethod: '',
  note: '',
  items: [] as any[],
  discountAmount: 0,
  taxAmount: 0,
  shippingAmount: 0,
  shippingAddress: {
    name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  },
});

// ==================== 新商品 ====================
const newItem = reactive({
  productId: '',
  name: '',
  sku: '',
  quantity: 1,
  price: 0,
});

// ==================== 表单验证规则 ====================
const formRules: FormRules = {
  customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  'shippingAddress.name': [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  'shippingAddress.phone': [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  'shippingAddress.address': [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  'shippingAddress.city': [{ required: true, message: '请输入城市', trigger: 'blur' }],
  'shippingAddress.country': [{ required: true, message: '请输入国家', trigger: 'blur' }],
};

// ==================== 计算属性 ====================
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
  return map[formData.status] || formData.status;
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
  return map[formData.status] || 'info';
});

const statusOptions = [
  { value: 'pending', label: '待确认' },
  { value: 'confirmed', label: '已确认' },
  { value: 'processing', label: '处理中' },
  { value: 'shipped', label: '已发货' },
  { value: 'delivered', label: '已送达' },
  { value: 'cancelled', label: '已取消' },
  { value: 'refunded', label: '已退款' },
];

const totalAmount = computed(() => {
  return formData.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
});

const grandTotal = computed(() => {
  return totalAmount.value - formData.discountAmount + formData.taxAmount + formData.shippingAmount;
});

// ==================== 方法 ====================

/**
 * 加载订单数据
 */
const loadOrderData = async () => {
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
      Object.assign(formData, {
        id: data.id,
        orderNumber: data.orderNumber,
        customerId: data.customerId,
        status: data.status || 'pending',
        paymentMethod: data.paymentMethod || '',
        note: data.note || '',
        items: (data.items || []).map((item: any) => ({
          ...item,
          total: (item.price || 0) * (item.quantity || 0),
        })),
        discountAmount: data.discountAmount || 0,
        taxAmount: data.taxAmount || 0,
        shippingAmount: data.shippingAmount || 0,
        shippingAddress: {
          name: data.shippingAddress?.name || '',
          phone: data.shippingAddress?.phone || '',
          address: data.shippingAddress?.address || '',
          city: data.shippingAddress?.city || '',
          country: data.shippingAddress?.country || '',
          postalCode: data.shippingAddress?.postalCode || '',
        },
      });

      if (data.customerId) {
        await loadCustomerInfo(data.customerId);
      }
    } else {
      ElMessage.error('订单不存在');
      router.push('/orders');
    }
  } catch (error) {
    console.error('加载订单数据失败:', error);
    ElMessage.error('加载订单数据失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 加载客户信息
 */
const loadCustomerInfo = async (customerId: string) => {
  try {
    const customer = await customerStore.getCustomerDetail(customerId);
    if (customer) {
      customerOptions.value = [customer];
      // 自动填充收货地址
      if (!formData.shippingAddress.name && customer.name) {
        formData.shippingAddress.name = customer.name;
        formData.shippingAddress.phone = customer.phone || '';
        formData.shippingAddress.address = customer.address || '';
        formData.shippingAddress.city = customer.city || '';
        formData.shippingAddress.country = customer.country || '';
        formData.shippingAddress.postalCode = customer.postalCode || '';
      }
    }
  } catch (error) {
    console.error('加载客户信息失败:', error);
  }
};

/**
 * 搜索客户
 */
const searchCustomers = async (query: string) => {
  if (!query) return;
  customerSearching.value = true;
  try {
    const result = await customerStore.searchCustomers({ search: query, limit: 20 });
    customerOptions.value = result.items || [];
  } catch (error) {
    console.error('搜索客户失败:', error);
  } finally {
    customerSearching.value = false;
  }
};

/**
 * 搜索商品
 */
const searchProducts = async (query: string) => {
  if (!query) return;
  productSearching.value = true;
  try {
    const result = await productStore.searchProducts({ search: query, limit: 20 });
    productOptions.value = result.items || [];
  } catch (error) {
    console.error('搜索商品失败:', error);
  } finally {
    productSearching.value = false;
  }
};

/**
 * 从客户信息复制地址
 */
const copyFromCustomer = async () => {
  if (!formData.customerId) {
    ElMessage.warning('请先选择客户');
    return;
  }
  try {
    const customer = await customerStore.getCustomerDetail(formData.customerId);
    if (customer) {
      formData.shippingAddress.name = customer.name || '';
      formData.shippingAddress.phone = customer.phone || '';
      formData.shippingAddress.address = customer.address || '';
      formData.shippingAddress.city = customer.city || '';
      formData.shippingAddress.country = customer.country || '';
      formData.shippingAddress.postalCode = customer.postalCode || '';
      ElMessage.success('地址已从客户信息复制');
    }
  } catch (error) {
    console.error('复制客户地址失败:', error);
    ElMessage.error('复制客户地址失败');
  }
};

/**
 * 添加商品
 */
const handleAddItem = () => {
  newItem.productId = '';
  newItem.name = '';
  newItem.sku = '';
  newItem.quantity = 1;
  newItem.price = 0;
  addItemDialogVisible.value = true;
};

/**
 * 商品选择
 */
const handleProductSelect = (productId: string) => {
  const product = productOptions.value.find((p) => p.id === productId);
  if (product) {
    newItem.name = product.name;
    newItem.sku = product.sku;
    newItem.price = product.price || 0;
  }
};

/**
 * 确认添加商品
 */
const confirmAddItem = () => {
  if (!newItem.productId) {
    ElMessage.warning('请选择商品');
    return;
  }
  if (!newItem.quantity || newItem.quantity < 1) {
    ElMessage.warning('请输入有效数量');
    return;
  }
  if (!newItem.price || newItem.price < 0) {
    ElMessage.warning('请输入有效价格');
    return;
  }

  formData.items.push({
    productId: newItem.productId,
    name: newItem.name,
    sku: newItem.sku,
    quantity: newItem.quantity,
    price: newItem.price,
  });

  addItemDialogVisible.value = false;
  ElMessage.success('商品已添加');
};

/**
 * 移除商品
 */
const handleRemoveItem = (index: number) => {
  formData.items.splice(index, 1);
  ElMessage.success('商品已移除');
};

/**
 * 计算商品小计
 */
const calculateItemTotal = (index: number) => {
  // 自动计算逻辑，由计算属性处理
};

/**
 * 计算合计
 */
const calculateGrandTotal = () => {
  // 自动计算逻辑，由计算属性处理
};

/**
 * SKU变化处理
 */
const handleSkuChange = async (index: number) => {
  const sku = formData.items[index].sku;
  if (!sku) return;

  try {
    const product = await productStore.getProductBySku(sku);
    if (product) {
      formData.items[index].name = product.name;
      formData.items[index].productId = product.id;
      if (!formData.items[index].price) {
        formData.items[index].price = product.price || 0;
      }
    }
  } catch (error) {
    console.error('查询SKU失败:', error);
  }
};

/**
 * 取消编辑
 */
const handleCancel = () => {
  router.push(`/orders/${orderData.value?.id}`);
};

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
  } catch {
    return;
  }

  if (formData.items.length === 0) {
    ElMessage.warning('请至少添加一个商品');
    return;
  }

  submitting.value = true;
  try {
    const submitData = {
      ...formData,
      items: formData.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalAmount.value,
      grandTotal: grandTotal.value,
    };

    await orderStore.updateOrder(orderData.value.id, submitData);
    ElMessage.success('订单更新成功');
    router.push(`/orders/${orderData.value.id}`);
  } catch (error) {
    console.error('保存订单失败:', error);
    ElMessage.error('保存订单失败');
  } finally {
    submitting.value = false;
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadOrderData();
});

// 监听客户变化
watch(
  () => formData.customerId,
  (newVal) => {
    if (newVal) {
      loadCustomerInfo(newVal);
    }
  }
);
</script>

<style scoped lang="scss">
.order-edit-page {
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
      gap: 12px;
    }
  }

  .loading-container {
    padding: 40px 0;
  }

  .form-section {
    margin-bottom: 24px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 16px;
    }
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
      gap: 12px;
      padding: 6px 0;

      .label {
        color: #606266;
        font-size: 14px;
      }

      .value {
        font-weight: 500;
        min-width: 120px;
        text-align: right;
      }

      &.grand-total {
        font-size: 18px;
        padding-top: 8px;
        border-top: 2px solid #ebeef5;

        .value {
          font-weight: 700;
          color: #e6a23c;
          font-size: 22px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .order-edit-page {
    padding: 12px;

    .page-header {
      flex-direction: column;
      gap: 12px;

      .header-right {
        width: 100%;
      }
    }
  }
}
</style>