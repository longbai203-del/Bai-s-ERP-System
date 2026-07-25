<!--
  文件路径: frontend/src/modules/orders/pages/List.vue
  功能: 订单列表
  最后更新: 2026-07-25 12:46:08
-->

<template>
  <div class="orders-page">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/orders' }">订单管理</el-breadcrumb-item>
          <el-breadcrumb-item v-if="pageType !== 'Dashboard' && pageType !== 'List'">订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">订单列表</h1>
      </div>
      <div class="header-right">
        <template v-if="showCreate">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon> 新建订单
          </el-button>
        </template>
        <template v-if="showEdit">
          <el-button type="primary" @click="handleEdit">
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
          <el-button type="danger" @click="handleDelete">
            <el-icon><Delete /></el-icon> 删除
          </el-button>
        </template>
        <template v-if="showSave">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
        </template>
        <el-button @click="handleRefresh"><el-icon><Refresh /></el-icon> 刷新</el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container"><el-skeleton :rows="6" animated /></div>

    <template v-if="showList && !loading">
      <el-card class="search-card" shadow="hover">
        <el-form :model="filters" inline @submit.prevent="loadData">
          <el-form-item label="订单号">
            <el-input v-model="filters.orderNumber" placeholder="请输入订单号" clearable style="width:150px" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filters.status" placeholder="全部状态" clearable style="width:120px">
              <el-option label="待确认" value="pending" />
              <el-option label="已确认" value="confirmed" />
              <el-option label="处理中" value="processing" />
              <el-option label="已发货" value="shipped" />
              <el-option label="已送达" value="delivered" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadData"><el-icon><Search /></el-icon> 搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="table-card" shadow="hover">
        <el-table :data="items" border stripe v-loading="loading" style="width:100%">
          <el-table-column prop="orderNumber" label="订单号" width="140" />
          <el-table-column prop="customerName" label="客户" min-width="120" />
          <el-table-column prop="grandTotal" label="金额" width="120" align="right">
            <template #default="{ row }">¥{{ row.grandTotal?.toFixed(2) || '0.00' }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180" align="center">
            <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="handleView(row.id)">查看</el-button>
              <el-button type="text" size="small" @click="handleEdit(row.id)">编辑</el-button>
              <el-button type="text" size="small" danger @click="handleDelete(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="filters.page"
            v-model:page-size="filters.limit"
            :total="total"
            :page-sizes="[10,20,50,100]"
            layout="total,sizes,prev,pager,next,jumper"
            @size-change="loadData"
            @current-change="loadData"
          />
        </div>
      </el-card>
    </template>

    <template v-if="showForm && !loading">
      <el-card class="form-card" shadow="hover">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
          <el-form-item label="客户" prop="customerId">
            <el-select v-model="formData.customerId" placeholder="请选择客户" filterable style="width:100%" :disabled="isViewMode">
              <el-option v-for="c in customerOptions" :key="c.id" :label="c.name" :value="c.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择状态" :disabled="isViewMode" style="width:100%">
              <el-option label="待确认" value="pending" />
              <el-option label="已确认" value="confirmed" />
              <el-option label="处理中" value="processing" />
              <el-option label="已发货" value="shipped" />
              <el-option label="已送达" value="delivered" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentMethod">
            <el-select v-model="formData.paymentMethod" placeholder="请选择支付方式" :disabled="isViewMode" style="width:100%">
              <el-option label="微信支付" value="wechat" />
              <el-option label="支付宝" value="alipay" />
              <el-option label="银行转账" value="bank_transfer" />
              <el-option label="现金" value="cash" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="formData.note" type="textarea" :rows="2" placeholder="请输入备注" :disabled="isViewMode" />
          </el-form-item>
          <el-form-item v-if="isViewMode" label="创建时间">
            <span>{{ formatDate(formData.createdAt) }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </template>

    <el-empty v-if="!loading && items.length === 0 && showList" description="暂无订单数据" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { Plus, Edit, Delete, Refresh, Search } from '@element-plus/icons-vue';
import { formatDate } from '@/utils/format';
import { orderApi } from '@/api/orders';

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();

const pageType = computed(() => {
  const path = route.path;
  if (path.endsWith('/create')) return 'Create';
  if (path.includes('/edit')) return 'Edit';
  if (path.includes('/detail')) return 'Detail';
  if (path.includes('/dashboard')) return 'Dashboard';
  return 'List';
});

const isViewMode = computed(() => pageType.value === 'Detail');
const showList = computed(() => pageType.value === 'List' || pageType.value === 'Dashboard');
const showForm = computed(() => pageType.value === 'Detail' || pageType.value === 'Edit' || pageType.value === 'Create');
const showCreate = computed(() => pageType.value === 'List' || pageType.value === 'Dashboard');
const showEdit = computed(() => pageType.value === 'Detail');
const showSave = computed(() => pageType.value === 'Edit' || pageType.value === 'Create');

const loading = ref(false);
const submitting = ref(false);
const items = ref<any[]>([]);
const currentItem = ref<any>(null);
const total = ref(0);
const customerOptions = ref<any[]>([]);

const filters = reactive({
  page: 1,
  limit: 20,
  orderNumber: '',
  status: '',
  dateRange: [] as Date[],
});

const formData = reactive({
  id: '',
  customerId: '',
  status: 'pending',
  paymentMethod: '',
  note: '',
  createdAt: '',
  updatedAt: '',
});

const formRules: FormRules = {
  customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const getStatusLabel = (value: string) => {
  const map: Record<string,string> = { pending:'待确认', confirmed:'已确认', processing:'处理中', shipped:'已发货', delivered:'已送达', cancelled:'已取消' };
  return map[value] || value;
};
const getStatusType = (value: string) => {
  const map: Record<string,string> = { pending:'warning', confirmed:'info', processing:'primary', shipped:'primary', delivered:'success', cancelled:'danger' };
  return map[value] || 'info';
};

const loadData = async () => {
  loading.value = true;
  try {
    const params = { ...filters };
    if (params.dateRange?.length === 2) {
      params.startDate = formatDate(params.dateRange[0]);
      params.endDate = formatDate(params.dateRange[1]);
    }
    delete params.dateRange;
    const response = await orderApi.getList(params);
    items.value = response.data.items || [];
    total.value = response.data.total || 0;
  } catch (error: any) {
    ElMessage.error(error.message || '加载数据失败');
  } finally { loading.value = false; }
};

const loadDetail = async (id: string) => {
  loading.value = true;
  try {
    const data = await orderApi.getDetail(id);
    currentItem.value = data;
    Object.assign(formData, data);
  } catch (error: any) {
    ElMessage.error(error.message || '加载详情失败');
  } finally { loading.value = false; }
};

const loadCustomers = async () => {
  try {
    const response = await orderApi.getCustomers();
    customerOptions.value = response.data || [];
  } catch (error) { /* 静默失败 */ }
};

const handleReset = () => {
  filters.orderNumber = '';
  filters.status = '';
  filters.dateRange = [];
  filters.page = 1;
  loadData();
};

const handleRefresh = () => { loadData(); ElMessage.success('已刷新'); };
const handleView = (id: string) => router.push(/orders/);
const handleCreate = () => router.push('/orders/create');
const handleEdit = (id?: string) => {
  const targetId = id || currentItem.value?.id || route.params.id;
  if (targetId) router.push(/orders//edit);
};
const handleCancel = () => router.push('/orders');

const handleSubmit = async () => {
  if (!formRef.value) return;
  try { await formRef.value.validate(); } catch { return; }
  submitting.value = true;
  try {
    const data = { ...formData };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    if (pageType.value === 'Edit' && currentItem.value?.id) {
      await orderApi.update(currentItem.value.id, data);
      ElMessage.success('更新成功');
    } else {
      await orderApi.create(data);
      ElMessage.success('创建成功');
    }
    router.push('/orders');
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败');
  } finally { submitting.value = false; }
};

const handleDelete = async (id?: string) => {
  const targetId = id || currentItem.value?.id || route.params.id;
  if (!targetId) return;
  try {
    await ElMessageBox.confirm('确定要删除此订单吗？', '警告', { confirmButtonText:'确定删除', cancelButtonText:'取消', type:'warning' });
    await orderApi.delete(targetId);
    ElMessage.success('删除成功');
    if (pageType.value === 'Detail') router.push('/orders');
    else loadData();
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除失败');
  }
};

onMounted(() => {
  const id = route.params.id as string;
  if (pageType.value === 'Detail' || pageType.value === 'Edit') {
    if (id) loadDetail(id);
  } else if (pageType.value === 'Create') {
    loadCustomers();
  } else {
    loadData();
    loadCustomers();
  }
});
</script>

<style scoped lang="scss">
.orders-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    background: #fff;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);

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
      flex-wrap: wrap;
    }
  }

  .search-card { margin-bottom: 20px; border-radius: 12px; }
  .table-card { border-radius: 12px; }
  .form-card { border-radius: 12px; }
  .pagination-container { margin-top: 16px; display: flex; justify-content: flex-end; }
  .detail-form { max-width: 800px; }
  .loading-container { padding: 40px 0; }
}

@media (max-width: 768px) {
  .orders-page {
    padding: 12px;
    .page-header { flex-direction: column; gap: 12px; .header-right { width: 100%; } }
  }
}
</style>
