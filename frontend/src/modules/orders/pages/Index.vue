<template>
  <div class="order-page">
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleCreate">新建订单</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="stat in stats" :key="stat.label">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <DataTable
        :data="store.orders"
        :columns="columns"
        :loading="store.loading"
        :total="store.pagination.total"
        :page="store.pagination.page"
        :limit="store.pagination.limit"
        @update:page="handlePageChange"
        @update:limit="handleLimitChange"
      >
        <template #status="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
        <template #finalAmount="{ row }">
          {{ formatMoney(row.finalAmount) }}
        </template>
        <template #createdAt="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
        <template #actions="{ row }">
          <el-button type="primary" size="small" @click="handleView(row)">查看</el-button>
          <el-button
            v-if="row.status === 'pending'"
            type="warning"
            size="small"
            @click="handleProcess(row)"
          >
            处理
          </el-button>
          <el-button
            v-if="row.status === 'pending'"
            type="danger"
            size="small"
            @click="handleCancel(row)"
          >
            取消
          </el-button>
        </template>
      </DataTable>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useOrderStore } from '@/store/modules/order';
import { formatMoney, formatDate } from '@/utils/format';
import DataTable from '@/components/common/DataTable.vue';

const store = useOrderStore();

const searchForm = reactive({
  orderNo: '',
  status: ''
});

const stats = computed(() => {
  const s = store.statistics || {};
  return [
    { label: '总订单', value: s.totalOrders || 0 },
    { label: '待处理', value: s.pendingCount || 0 },
    { label: '已完成', value: s.completedCount || 0 },
    { label: '总收入', value: formatMoney(s.totalRevenue || 0) }
  ];
});

const columns = [
  { prop: 'orderNo', label: '订单号', width: 150 },
  { prop: 'customerName', label: '客户', width: 120 },
  { prop: 'finalAmount', label: '金额', width: 120 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'createdAt', label: '创建时间', width: 180 }
];

function getStatusType(status: string) {
  const map: Record<string, string> = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger'
  };
  return map[status] || 'info';
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return map[status] || status;
}

async function loadData() {
  await store.fetchList({
    orderNo: searchForm.orderNo || undefined,
    status: searchForm.status || undefined
  });
  await store.fetchStatistics();
}

function handleSearch() { loadData(); }
function handleReset() {
  searchForm.orderNo = '';
  searchForm.status = '';
  loadData();
}
function handlePageChange(page: number) {
  store.pagination.page = page;
  loadData();
}
function handleLimitChange(limit: number) {
  store.pagination.limit = limit;
  loadData();
}
function handleCreate() {
  // 跳转到创建订单页面
}
function handleView(row: any) {
  // 跳转到订单详情
}
async function handleProcess(row: any) {
  try {
    await store.updateStatus(row.id, 'processing');
    ElMessage.success('订单已开始处理');
    await loadData();
  } catch (error) {
    ElMessage.error('操作失败');
  }
}
async function handleCancel(row: any) {
  try {
    await ElMessageBox.prompt('请输入取消原因', '取消订单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    });
    await store.cancelOrder(row.id, '用户取消');
    ElMessage.success('订单已取消');
    await loadData();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.order-page { padding: 20px; }
.search-card { margin-bottom: 20px; }
.stats-row { margin-bottom: 20px; }
.stat-item { text-align: center; }
.stat-value { font-size: 24px; font-weight: bold; color: #409EFF; }
.stat-label { font-size: 14px; color: #909399; margin-top: 8px; }
</style>
