<template>
  <div class="customer-page">
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="搜索名称/邮箱/电话" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="个人" value="individual" />
            <el-option label="企业" value="company" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
            <el-option label="已冻结" value="blocked" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleCreate">新增客户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <DataTable
        :data="store.customers"
        :columns="columns"
        :loading="store.loading"
        :total="store.pagination.total"
        :page="store.pagination.page"
        :limit="store.pagination.limit"
        @update:page="handlePageChange"
        @update:limit="handleLimitChange"
      >
        <template #type="{ row }">
          <el-tag :type="row.type === 'company' ? 'primary' : 'success'">
            {{ row.type === 'company' ? '企业' : '个人' }}
          </el-tag>
        </template>
        <template #status="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
        <template #actions="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button
            :type="row.status === 'active' ? 'warning' : 'success'"
            size="small"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'active' ? '禁用' : '启用' }}
          </el-button>
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择类型">
            <el-option label="个人" value="individual" />
            <el-option label="企业" value="company" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="formData.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.notes" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="store.loading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import { useCustomerStore } from '@/store/modules/customer';
import DataTable from '@/components/common/DataTable.vue';

const store = useCustomerStore();

const searchForm = reactive({
  keyword: '',
  type: '',
  status: ''
});

const columns = [
  { prop: 'customerCode', label: '编号', width: 120 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'phone', label: '电话', width: 130 },
  { prop: 'type', label: '类型', width: 80 },
  { prop: 'status', label: '状态', width: 80 }
];

const dialogVisible = ref(false);
const dialogTitle = ref('新增客户');
const formRef = ref<FormInstance>();
const formData = reactive({
  id: '',
  name: '',
  email: '',
  phone: '',
  type: 'individual' as 'individual' | 'company',
  address: '',
  notes: ''
});

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
};

function getStatusType(status: string) {
  const map: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    blocked: 'danger'
  };
  return map[status] || 'info';
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    active: '启用',
    inactive: '禁用',
    blocked: '已冻结'
  };
  return map[status] || status;
}

async function loadData() {
  await store.fetchList({
    keyword: searchForm.keyword || undefined,
    type: searchForm.type || undefined,
    status: searchForm.status || undefined
  });
}

function handleSearch() { loadData(); }
function handleReset() {
  searchForm.keyword = '';
  searchForm.type = '';
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
  dialogTitle.value = '新增客户';
  resetForm();
  dialogVisible.value = true;
}
function handleEdit(row: any) {
  dialogTitle.value = '编辑客户';
  Object.assign(formData, row);
  dialogVisible.value = true;
}
async function handleToggleStatus(row: any) {
  try {
    await store.toggleStatus(row.id);
    ElMessage.success('状态已更新');
    await loadData();
  } catch (error) {
    ElMessage.error('操作失败');
  }
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
function handleDialogClose() { resetForm(); }
function resetForm() {
  Object.assign(formData, {
    id: '',
    name: '',
    email: '',
    phone: '',
    type: 'individual',
    address: '',
    notes: ''
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
      ElMessage.success(dialogTitle.value === '新增客户' ? '创建成功' : '更新成功');
      dialogVisible.value = false;
      await loadData();
    } catch (error) {
      ElMessage.error('操作失败');
    }
  });
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.customer-page { padding: 20px; }
.search-card { margin-bottom: 20px; }
</style>
