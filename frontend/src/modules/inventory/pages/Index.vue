<template>
  <div class="inventory-page">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="搜索名称/编码" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
            <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="有货" value="in_stock" />
            <el-option label="低库存" value="low_stock" />
            <el-option label="缺货" value="out_of_stock" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleCreate">新增库存</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <DataTable
        :data="store.items"
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
        <template #price="{ row }">
          {{ formatMoney(row.price) }}
        </template>
        <template #quantity="{ row }">
          <span :class="{ 'text-danger': row.quantity < 10 }">
            {{ row.quantity }}
          </span>
        </template>
        <template #actions="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" size="small" @click="handleStock(row)">调整库存</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </DataTable>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-input v-model="formData.category" placeholder="请输入分类" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="formData.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input-number v-model="formData.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="formData.supplier" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item label="仓库" prop="warehouse">
          <el-input v-model="formData.warehouse" placeholder="请输入仓库" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="store.loading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 调整库存对话框 -->
    <el-dialog
      v-model="stockDialogVisible"
      title="调整库存"
      width="400px"
    >
      <el-form label-width="100px">
        <el-form-item label="当前库存">
          <span>{{ stockData.currentStock }}</span>
        </el-form-item>
        <el-form-item label="调整数量">
          <el-input-number v-model="stockData.quantity" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stockDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="store.loading" @click="handleStockSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import { useInventoryStore } from '@/store/modules/inventory';
import { formatMoney } from '@/utils/format';
import DataTable from '@/components/common/DataTable.vue';

const store = useInventoryStore();

const searchForm = reactive({
  keyword: '',
  category: '',
  status: ''
});

const categories = ['电子产品', '办公用品', '原材料', '成品', '其他'];

const columns = [
  { prop: 'code', label: '编码', width: 120 },
  { prop: 'name', label: '名称', minWidth: 150 },
  { prop: 'category', label: '分类', width: 120 },
  { prop: 'quantity', label: '数量', width: 100 },
  { prop: 'unit', label: '单位', width: 80 },
  { prop: 'price', label: '单价', width: 120 },
  { prop: 'supplier', label: '供应商', width: 150 },
  { prop: 'status', label: '状态', width: 100 }
];

const dialogVisible = ref(false);
const dialogTitle = ref('新增库存');
const formRef = ref<FormInstance>();
const formData = reactive({
  id: '',
  name: '',
  code: '',
  category: '',
  unit: '',
  price: 0,
  supplier: '',
  warehouse: ''
});

const formRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
  category: [{ required: true, message: '请输入分类', trigger: 'blur' }],
  price: [{ required: true, message: '请输入单价', trigger: 'blur' }]
};

const stockDialogVisible = ref(false);
const stockData = reactive({
  id: '',
  currentStock: 0,
  quantity: 0
});

function getStatusType(status: string) {
  const map: Record<string, string> = {
    in_stock: 'success',
    low_stock: 'warning',
    out_of_stock: 'danger'
  };
  return map[status] || 'info';
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    in_stock: '有货',
    low_stock: '低库存',
    out_of_stock: '缺货'
  };
  return map[status] || status;
}

async function loadData() {
  await store.fetchList({
    keyword: searchForm.keyword || undefined,
    category: searchForm.category || undefined,
    status: searchForm.status || undefined
  });
}

function handleSearch() {
  loadData();
}

function handleReset() {
  searchForm.keyword = '';
  searchForm.category = '';
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
  dialogTitle.value = '新增库存';
  resetForm();
  dialogVisible.value = true;
}

function handleEdit(row: any) {
  dialogTitle.value = '编辑库存';
  Object.assign(formData, row);
  dialogVisible.value = true;
}

function handleStock(row: any) {
  stockData.id = row.id;
  stockData.currentStock = row.quantity;
  stockData.quantity = 0;
  stockDialogVisible.value = true;
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(`确定要删除 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await store.remove(row.id);
    ElMessage.success('删除成功');
    await loadData();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
}

function handleDialogClose() {
  resetForm();
}

function resetForm() {
  Object.assign(formData, {
    id: '',
    name: '',
    code: '',
    category: '',
    unit: '',
    price: 0,
    supplier: '',
    warehouse: ''
  });
  formRef.value?.resetFields();
}

async function handleSubmit() {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      if (formData.id) {
        await store.update(formData.id, formData);
      } else {
        await store.create(formData);
      }
      ElMessage.success(dialogTitle.value === '新增库存' ? '创建成功' : '更新成功');
      dialogVisible.value = false;
      await loadData();
    } catch (error) {
      ElMessage.error('操作失败');
    }
  });
}

async function handleStockSubmit() {
  if (stockData.quantity <= 0) {
    ElMessage.warning('请输入有效的数量');
    return;
  }
  try {
    await store.updateStock(stockData.id, stockData.quantity);
    ElMessage.success('库存调整成功');
    stockDialogVisible.value = false;
    await loadData();
  } catch (error) {
    ElMessage.error('调整失败');
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.inventory-page { padding: 20px; }
.search-card { margin-bottom: 20px; }
.text-danger { color: #f56c6c; font-weight: bold; }
</style>
