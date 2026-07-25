<template>
  <div class="purchase-edit-page">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/purchase' }">采购管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑采购单 #{{ purchaseData?.purchaseOrder || '加载中...' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">编辑采购单</h1>
      </div>
      <div class="header-right">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container"><el-skeleton :rows="10" animated /></div>

    <template v-else-if="purchaseData">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="16">
            <!-- 基本信息 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>基本信息</span>
                  <el-tag :type="statusType" size="small">{{ statusText }}</el-tag>
                </div>
              </template>
              <el-form-item label="采购单号">
                <el-input v-model="formData.purchaseOrder" disabled />
              </el-form-item>
              <el-form-item label="供应商" prop="supplier">
                <el-select v-model="formData.supplierId" placeholder="请选择供应商" filterable style="width:100%">
                  <el-option v-for="s in supplierOptions" :key="s.id" :label="s.name" :value="s.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select v-model="formData.status" style="width:100%">
                  <el-option label="待处理" value="pending" />
                  <el-option label="已下单" value="ordered" />
                  <el-option label="已收货" value="received" />
                  <el-option label="已取消" value="cancelled" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注"><el-input v-model="formData.note" type="textarea" :rows="2" /></el-form-item>
            </el-card>

            <!-- 采购商品 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>采购商品</span>
                  <el-button type="primary" size="small" @click="handleAddItem"><el-icon><Plus /></el-icon>添加</el-button>
                </div>
              </template>
              <el-table :data="formData.items" border stripe>
                <el-table-column prop="name" label="商品名称" min-width="180" />
                <el-table-column prop="sku" label="SKU" width="140" />
                <el-table-column prop="quantity" label="数量" width="120">
                  <template #default="{ row }"><el-input-number v-model="row.quantity" :min="1" size="small" /></template>
                </el-table-column>
                <el-table-column prop="unitPrice" label="单价" width="140">
                  <template #default="{ row }"><el-input-number v-model="row.unitPrice" :min="0" :precision="2" size="small" /></template>
                </el-table-column>
                <el-table-column label="小计" width="140">
                  <template #default="{ row }">¥{{ (row.quantity * row.unitPrice).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="60"><template #default="{ $index }"><el-button type="danger" size="small" circle @click="handleRemoveItem($index)"><el-icon><Delete /></el-icon></el-button></template></el-table-column>
              </el-table>
              <div class="order-summary">
                <div class="summary-row"><span class="label">合计：</span><span class="value">¥{{ totalAmount.toFixed(2) }}</span></div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>供应商信息</span></div></template>
              <div class="supplier-info" v-if="selectedSupplier">
                <div class="supplier-name">{{ selectedSupplier.name }}</div>
                <div class="supplier-contact">{{ selectedSupplier.contact }}</div>
                <div class="supplier-phone">{{ selectedSupplier.phone }}</div>
                <div class="supplier-address">{{ selectedSupplier.address }}</div>
              </div>
              <div v-else class="empty-info">请选择供应商</div>
            </el-card>

            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>采购信息</span></div></template>
              <div class="stats-info">
                <div class="stat-item"><span class="stat-label">创建时间</span><span class="stat-value">{{ formatDate(purchaseData.createdAt) }}</span></div>
                <div class="stat-item"><span class="stat-label">更新时间</span><span class="stat-value">{{ formatDate(purchaseData.updatedAt) }}</span></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
    </template>

    <!-- 添加商品对话框 -->
    <el-dialog v-model="addItemDialogVisible" title="添加商品" width="500px">
      <el-form :model="newItem" label-width="100px">
        <el-form-item label="商品"><el-input v-model="newItem.name" placeholder="请输入商品名称" /></el-form-item>
        <el-form-item label="SKU"><el-input v-model="newItem.sku" placeholder="请输入SKU" /></el-form-item>
        <el-form-item label="数量"><el-input-number v-model="newItem.quantity" :min="1" style="width:100%" /></el-form-item>
        <el-form-item label="单价"><el-input-number v-model="newItem.unitPrice" :min="0" :precision="2" style="width:100%" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addItemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddItem">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';
import { usePurchaseStore } from '../store';
import { formatDate } from '@/utils/format';

const route = useRoute();
const router = useRouter();
const purchaseStore = usePurchaseStore();
const formRef = ref<FormInstance>();
const loading = ref(true);
const submitting = ref(false);
const addItemDialogVisible = ref(false);
const purchaseData = ref<any>(null);

const supplierOptions = ref([
  { id: 'sup_1', name: '供应商A', contact: '张经理', phone: '138-0001-0001', address: '北京市朝阳区' },
  { id: 'sup_2', name: '供应商B', contact: '李经理', phone: '138-0002-0002', address: '上海市浦东新区' },
]);

const formData = reactive({
  purchaseOrder: '',
  supplierId: '',
  status: 'pending' as 'pending' | 'ordered' | 'received' | 'cancelled',
  note: '',
  items: [] as any[],
});

const newItem = reactive({ name: '', sku: '', quantity: 1, unitPrice: 0 });

const formRules: FormRules = {
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const selectedSupplier = computed(() => supplierOptions.value.find(s => s.id === formData.supplierId));
const totalAmount = computed(() => formData.items.reduce((sum, i) => sum + (i.quantity || 0) * (i.unitPrice || 0), 0));
const statusText = computed(() => {
  const map: Record<string, string> = { pending: '待处理', ordered: '已下单', received: '已收货', cancelled: '已取消' };
  return map[formData.status] || formData.status;
});
const statusType = computed(() => {
  const map: Record<string, string> = { pending: 'warning', ordered: 'primary', received: 'success', cancelled: 'danger' };
  return map[formData.status] || 'info';
});

const loadPurchaseData = async () => {
  const id = route.params.id as string;
  if (!id) { ElMessage.error('采购单ID无效'); router.push('/purchase'); return; }
  loading.value = true;
  try {
    const data = await purchaseStore.getPurchaseDetail(id);
    if (data) {
      purchaseData.value = data;
      Object.assign(formData, { ...data, items: data.items || [] });
    } else { ElMessage.error('采购单不存在'); router.push('/purchase'); }
  } catch (error) { console.error('加载数据失败:', error); ElMessage.error('加载数据失败'); }
  finally { loading.value = false; }
};

const handleAddItem = () => { newItem.name = ''; newItem.sku = ''; newItem.quantity = 1; newItem.unitPrice = 0; addItemDialogVisible.value = true; };
const handleRemoveItem = (index: number) => { formData.items.splice(index, 1); };
const confirmAddItem = () => {
  if (!newItem.name) { ElMessage.warning('请输入商品名称'); return; }
  formData.items.push({ ...newItem });
  addItemDialogVisible.value = false;
  ElMessage.success('商品已添加');
};
const handleCancel = () => router.push(`/purchase/${purchaseData.value?.id}`);
const handleSubmit = async () => {
  if (!formRef.value) return;
  try { await formRef.value.validate(); } catch { return; }
  if (formData.items.length === 0) { ElMessage.warning('请至少添加一个商品'); return; }
  submitting.value = true;
  try {
    await purchaseStore.updatePurchase(purchaseData.value.id, { ...formData, totalAmount: totalAmount.value });
    ElMessage.success('更新成功');
    router.push(`/purchase/${purchaseData.value.id}`);
  } catch (error) { console.error('保存失败:', error); ElMessage.error('保存失败'); }
  finally { submitting.value = false; }
};

onMounted(() => loadPurchaseData());
</script>

<style scoped lang="scss">
.purchase-edit-page { padding: 20px;
  .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; .header-left { .page-title { font-size: 24px; font-weight: 600; margin: 8px 0 0; color: #303133; } } .header-right { display: flex; gap: 12px; } }
  .loading-container { padding: 40px 0; }
  .form-section { margin-bottom: 24px; .section-header { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 16px; } }
  .order-summary { margin-top: 16px; padding-top: 16px; border-top: 1px solid #ebeef5; text-align: right; .summary-row { display: flex; justify-content: flex-end; align-items: center; gap: 12px; padding: 6px 0; .label { color: #606266; } .value { font-weight: 700; color: #e6a23c; font-size: 18px; } } }
  .supplier-info { .supplier-name { font-weight: 600; font-size: 16px; color: #303133; } .supplier-contact, .supplier-phone, .supplier-address { color: #606266; font-size: 14px; margin-top: 4px; } }
  .empty-info { color: #909399; text-align: center; padding: 20px 0; }
  .stats-info { .stat-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f7fa; &:last-child { border-bottom: none; } .stat-label { color: #909399; } .stat-value { color: #303133; font-weight: 500; } } }
}
@media (max-width: 768px) { .purchase-edit-page { padding: 12px; .page-header { flex-direction: column; gap: 12px; .header-right { width: 100%; } } } }
</style>