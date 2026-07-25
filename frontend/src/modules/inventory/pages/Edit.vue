<template>
  <div class="inventory-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/inventory' }">库存管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑库存 #{{ inventoryData?.productId || '加载中...' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">编辑库存</h1>
      </div>
      <div class="header-right">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          保存库存
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 编辑表单 -->
    <template v-else-if="inventoryData">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
        class="inventory-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <!-- 产品信息 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>产品信息</span>
                  <el-button type="text" size="small" @click="viewProduct" v-if="formData.productId">
                    查看产品
                  </el-button>
                </div>
              </template>
              <el-form-item label="产品ID" prop="productId">
                <el-input v-model="formData.productId" disabled />
              </el-form-item>
              <el-form-item label="产品名称">
                <el-input v-model="productName" disabled />
              </el-form-item>
              <el-form-item label="SKU">
                <el-input v-model="productSku" disabled />
              </el-form-item>
              <el-form-item label="分类">
                <el-input v-model="productCategory" disabled />
              </el-form-item>
            </el-card>

            <!-- 库存信息 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>库存信息</span>
                  <el-tag type="warning" size="small" v-if="isLowStock">库存偏低</el-tag>
                  <el-tag type="danger" size="small" v-if="isCriticalStock">库存告急</el-tag>
                </div>
              </template>
              <el-form-item label="当前库存" prop="quantity">
                <el-input-number
                  v-model="formData.quantity"
                  :min="0"
                  :max="99999999"
                  style="width: 100%"
                  @change="checkStockLevel"
                />
                <div class="field-hint" v-if="formData.quantity < reorderPoint">
                  <el-text type="danger" size="small">
                    ⚠️ 库存低于补货点 ({{ reorderPoint }})
                  </el-text>
                </div>
              </el-form-item>
              <el-form-item label="预留库存" prop="reservedQuantity">
                <el-input-number
                  v-model="formData.reservedQuantity"
                  :min="0"
                  :max="formData.quantity"
                  style="width: 100%"
                />
                <div class="field-hint" v-if="formData.reservedQuantity > 0">
                  <el-text type="warning" size="small">
                    已预留 {{ formData.reservedQuantity }} 件
                  </el-text>
                </div>
              </el-form-item>
              <el-form-item label="可用库存">
                <span class="available-stock">
                  {{ formData.quantity - formData.reservedQuantity }}
                </span>
                <el-text type="info" size="small">件</el-text>
              </el-form-item>
              <el-form-item label="补货点" prop="reorderPoint">
                <el-input-number
                  v-model="formData.reorderPoint"
                  :min="0"
                  :max="99999"
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item label="最大库存" prop="maxStock">
                <el-input-number
                  v-model="formData.maxStock"
                  :min="0"
                  :max="99999999"
                  style="width: 100%"
                />
                <div class="field-hint">
                  <el-text type="info" size="small">
                    建议补货区间: {{ formData.reorderPoint }} - {{ formData.maxStock }}
                  </el-text>
                </div>
              </el-form-item>
            </el-card>
          </el-col>

          <el-col :span="12">
            <!-- 仓库信息 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>仓库信息</span>
                </div>
              </template>
              <el-form-item label="仓库" prop="warehouseId">
                <el-select v-model="formData.warehouseId" placeholder="请选择仓库" style="width: 100%">
                  <el-option
                    v-for="warehouse in warehouseOptions"
                    :key="warehouse.id"
                    :label="warehouse.name"
                    :value="warehouse.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="库位" prop="location">
                <el-input v-model="formData.location" placeholder="请输入库位编号" />
              </el-form-item>
              <el-form-item label="批次号" prop="batchNumber">
                <el-input v-model="formData.batchNumber" placeholder="请输入批次号" />
              </el-form-item>
              <el-form-item label="过期日期" prop="expiryDate">
                <el-date-picker
                  v-model="formData.expiryDate"
                  type="date"
                  placeholder="请选择过期日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  :disabled-date="disabledExpiryDate"
                />
                <div class="field-hint" v-if="isExpiringSoon">
                  <el-text type="warning" size="small">
                    ⚠️ 即将过期 ({{ daysUntilExpiry }}天后)
                  </el-text>
                </div>
                <div class="field-hint" v-if="isExpired">
                  <el-text type="danger" size="small">
                    ❌ 已过期
                  </el-text>
                </div>
              </el-form-item>
              <el-form-item label="序列号" prop="serialNumbers">
                <el-input
                  v-model="serialNumbersText"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入序列号，每行一个"
                />
                <div class="field-hint">
                  <el-text type="info" size="small">
                    已添加 {{ serialNumberCount }} 个序列号
                  </el-text>
                </div>
              </el-form-item>
            </el-card>

            <!-- 操作记录 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>操作记录</span>
                  <el-button type="text" size="small" @click="loadAdjustmentLogs">
                    刷新
                  </el-button>
                </div>
              </template>
              <div class="adjustment-logs">
                <div v-for="log in adjustmentLogs" :key="log.id" class="log-item">
                  <div class="log-header">
                    <span class="log-type" :class="log.type">
                      {{ log.typeText }}
                    </span>
                    <span class="log-time">{{ formatDate(log.createdAt) }}</span>
                  </div>
                  <div class="log-content">
                    <span class="log-operator">{{ log.operator }}</span>
                    <span class="log-change">
                      {{ log.oldQuantity }} → {{ log.newQuantity }}
                    </span>
                    <span class="log-reason">{{ log.reason }}</span>
                  </div>
                </div>
                <el-empty v-if="adjustmentLogs.length === 0" description="暂无操作记录" />
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 库存调整 -->
        <el-card class="form-section" shadow="hover">
          <template #header>
            <div class="section-header">
              <span>库存调整</span>
              <el-button type="primary" size="small" @click="showAdjustmentDialog = true">
                <el-icon><Edit /></el-icon> 调整库存
              </el-button>
            </div>
          </template>
          <el-table :data="adjustmentHistory" border stripe>
            <el-table-column prop="createdAt" label="时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column prop="operator" label="操作人" width="120" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="row.type === 'add' ? 'success' : 'danger'" size="small">
                  {{ row.type === 'add' ? '入库' : '出库' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="100" align="center" />
            <el-table-column prop="reason" label="原因" min-width="200" />
            <el-table-column prop="reference" label="参考号" width="150" />
          </el-table>
        </el-card>
      </el-form>
    </template>

    <!-- 库存调整对话框 -->
    <el-dialog
      v-model="showAdjustmentDialog"
      title="库存调整"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="adjustmentForm" label-width="100px">
        <el-form-item label="调整类型">
          <el-radio-group v-model="adjustmentForm.type">
            <el-radio label="add">入库</el-radio>
            <el-radio label="subtract">出库</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number
            v-model="adjustmentForm.quantity"
            :min="adjustmentForm.type === 'subtract' ? 1 : 0"
            :max="adjustmentForm.type === 'subtract' ? formData.quantity : 99999"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="原因">
          <el-input
            v-model="adjustmentForm.reason"
            type="textarea"
            :rows="2"
            placeholder="请输入调整原因"
          />
        </el-form-item>
        <el-form-item label="参考号">
          <el-input v-model="adjustmentForm.reference" placeholder="请输入参考号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdjustmentDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAdjustment" :loading="adjusting">
          确认调整
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { Edit } from '@element-plus/icons-vue';
import { useInventoryStore } from '../store';
import { useProductStore } from '@/modules/products/store';
import { formatDate } from '@/utils/format';

// ==================== 路由和Store ====================
const route = useRoute();
const router = useRouter();
const inventoryStore = useInventoryStore();
const productStore = useProductStore();

// ==================== 引用 ====================
const formRef = ref<FormInstance>();

// ==================== 状态 ====================
const loading = ref(true);
const submitting = ref(false);
const adjusting = ref(false);
const showAdjustmentDialog = ref(false);

// ==================== 数据 ====================
const inventoryData = ref<any>(null);
const productName = ref('');
const productSku = ref('');
const productCategory = ref('');
const warehouseOptions = ref([
  { id: 'wh_1', name: '主仓库' },
  { id: 'wh_2', name: '北区仓库' },
  { id: 'wh_3', name: '南区仓库' },
  { id: 'wh_4', name: '保税仓库' },
]);
const adjustmentLogs = ref<any[]>([]);
const adjustmentHistory = ref<any[]>([]);

// ==================== 表单数据 ====================
const formData = reactive({
  productId: '',
  warehouseId: '',
  quantity: 0,
  reservedQuantity: 0,
  reorderPoint: 10,
  maxStock: 1000,
  location: '',
  batchNumber: '',
  expiryDate: '',
  serialNumbers: [] as string[],
});

const serialNumbersText = ref('');

// ==================== 调整表单 ====================
const adjustmentForm = reactive({
  type: 'add' as 'add' | 'subtract',
  quantity: 0,
  reason: '',
  reference: '',
});

// ==================== 表单验证规则 ====================
const formRules: FormRules = {
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  quantity: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存数量不能为负数', trigger: 'blur' },
  ],
  reorderPoint: [
    { required: true, message: '请输入补货点', trigger: 'blur' },
    { type: 'number', min: 0, message: '补货点不能为负数', trigger: 'blur' },
  ],
  maxStock: [
    { required: true, message: '请输入最大库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '最大库存不能为负数', trigger: 'blur' },
  ],
};

// ==================== 计算属性 ====================
const isLowStock = computed(() => {
  return formData.quantity <= formData.reorderPoint && formData.quantity > 0;
});

const isCriticalStock = computed(() => {
  return formData.quantity <= formData.reorderPoint * 0.5 && formData.quantity > 0;
});

const isExpiringSoon = computed(() => {
  if (!formData.expiryDate) return false;
  const days = daysUntilExpiry.value;
  return days >= 0 && days <= 30;
});

const isExpired = computed(() => {
  if (!formData.expiryDate) return false;
  return daysUntilExpiry.value < 0;
});

const daysUntilExpiry = computed(() => {
  if (!formData.expiryDate) return Infinity;
  const today = new Date();
  const expiry = new Date(formData.expiryDate);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
});

const serialNumberCount = computed(() => {
  return serialNumbersText.value ? serialNumbersText.value.split('\n').filter(s => s.trim()).length : 0;
});

const reorderPoint = computed(() => formData.reorderPoint || 0);

// ==================== 方法 ====================

/**
 * 加载库存数据
 */
const loadInventoryData = async () => {
  const id = route.params.id as string;
  if (!id) {
    ElMessage.error('库存ID无效');
    router.push('/inventory');
    return;
  }

  loading.value = true;
  try {
    const data = await inventoryStore.getInventoryDetail(id);
    if (data) {
      inventoryData.value = data;
      Object.assign(formData, {
        productId: data.productId,
        warehouseId: data.warehouseId || '',
        quantity: data.quantity || 0,
        reservedQuantity: data.reservedQuantity || 0,
        reorderPoint: data.reorderPoint || 10,
        maxStock: data.maxStock || 1000,
        location: data.location || '',
        batchNumber: data.batchNumber || '',
        expiryDate: data.expiryDate || '',
        serialNumbers: data.serialNumbers || [],
      });
      serialNumbersText.value = (data.serialNumbers || []).join('\n');

      if (data.productId) {
        await loadProductInfo(data.productId);
      }
      await loadAdjustmentLogs(id);
    } else {
      ElMessage.error('库存记录不存在');
      router.push('/inventory');
    }
  } catch (error) {
    console.error('加载库存数据失败:', error);
    ElMessage.error('加载库存数据失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 加载产品信息
 */
const loadProductInfo = async (productId: string) => {
  try {
    const product = await productStore.getProductDetail(productId);
    if (product) {
      productName.value = product.name || '';
      productSku.value = product.sku || '';
      productCategory.value = product.category || '';
    }
  } catch (error) {
    console.error('加载产品信息失败:', error);
  }
};

/**
 * 加载调整日志
 */
const loadAdjustmentLogs = async (inventoryId: string) => {
  try {
    // 实际项目中调用API
    adjustmentLogs.value = [
      {
        id: '1',
        type: 'add',
        typeText: '入库',
        operator: '管理员',
        oldQuantity: 0,
        newQuantity: 100,
        reason: '初始入库',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        type: 'subtract',
        typeText: '出库',
        operator: '销售员',
        oldQuantity: 100,
        newQuantity: 85,
        reason: '订单 #ORD-000001',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ];
    adjustmentHistory.value = adjustmentLogs.value;
  } catch (error) {
    console.error('加载调整日志失败:', error);
  }
};

/**
 * 检查库存水平
 */
const checkStockLevel = () => {
  // 自动触发计算属性更新
};

/**
 * 禁用过期日期
 */
const disabledExpiryDate = (time: Date) => {
  // 不能选择过去日期
  return time.getTime() < Date.now() - 86400000;
};

/**
 * 查看产品
 */
const viewProduct = () => {
  if (formData.productId) {
    router.push(`/products/${formData.productId}`);
  }
};

/**
 * 确认库存调整
 */
const confirmAdjustment = async () => {
  if (!adjustmentForm.quantity || adjustmentForm.quantity <= 0) {
    ElMessage.warning('请输入有效的调整数量');
    return;
  }

  if (adjustmentForm.type === 'subtract' && adjustmentForm.quantity > formData.quantity) {
    ElMessage.warning('出库数量不能大于当前库存');
    return;
  }

  adjusting.value = true;
  try {
    await inventoryStore.adjustInventory(inventoryData.value.id, {
      type: adjustmentForm.type,
      quantity: adjustmentForm.quantity,
      reason: adjustmentForm.reason || '手动调整',
      reference: adjustmentForm.reference || '',
    });
    ElMessage.success('库存调整成功');
    showAdjustmentDialog.value = false;
    await loadInventoryData();
  } catch (error) {
    console.error('库存调整失败:', error);
    ElMessage.error('库存调整失败');
  } finally {
    adjusting.value = false;
  }
};

/**
 * 取消编辑
 */
const handleCancel = () => {
  router.push(`/inventory/${inventoryData.value?.id}`);
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

  submitting.value = true;
  try {
    const submitData = {
      ...formData,
      serialNumbers: serialNumbersText.value
        ? serialNumbersText.value.split('\n').filter(s => s.trim())
        : [],
    };

    await inventoryStore.updateInventory(inventoryData.value.id, submitData);
    ElMessage.success('库存更新成功');
    router.push(`/inventory/${inventoryData.value.id}`);
  } catch (error) {
    console.error('保存库存失败:', error);
    ElMessage.error('保存库存失败');
  } finally {
    submitting.value = false;
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadInventoryData();
});
</script>

<style scoped lang="scss">
.inventory-edit-page {
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

  .field-hint {
    margin-top: 4px;
  }

  .available-stock {
    font-weight: 700;
    font-size: 20px;
    color: #409EFF;
  }

  .adjustment-logs {
    max-height: 300px;
    overflow-y: auto;

    .log-item {
      padding: 12px;
      border-bottom: 1px solid #f5f7fa;

      .log-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;

        .log-type {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;

          &.add {
            background: #f0f9eb;
            color: #67C23A;
          }

          &.subtract {
            background: #fef0f0;
            color: #F56C6C;
          }
        }

        .log-time {
          color: #909399;
          font-size: 12px;
        }
      }

      .log-content {
        display: flex;
        gap: 12px;
        font-size: 14px;
        color: #606266;

        .log-operator {
          color: #303133;
        }

        .log-change {
          font-weight: 500;
        }

        .log-reason {
          color: #909399;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .inventory-edit-page {
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