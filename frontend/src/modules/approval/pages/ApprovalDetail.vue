<!--
  文件路径: frontend/src/modules/approval/pages/ApprovalDetail.vue
  功能: 审批详情
  最后更新: 2026-07-25 12:48:17
-->

<template>
  <div class="approval-page">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/approval' }">审批管理</el-breadcrumb-item>
          <el-breadcrumb-item v-if="pageType !== 'Dashboard'">审批详情</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">审批详情</h1>
      </div>
      <div class="header-right">
        <template v-if="showCreate">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon> 发起审批
          </el-button>
        </template>
        <template v-if="showEdit">
          <el-button type="primary" @click="handleEdit"><el-icon><Edit /></el-icon> 编辑</el-button>
          <el-button type="danger" @click="handleDelete"><el-icon><Delete /></el-icon> 删除</el-button>
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
          <el-form-item label="关键词">
            <el-input v-model="filters.search" placeholder="请输入标题" clearable style="width:180px" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filters.status" placeholder="全部状态" clearable style="width:120px">
              <el-option label="待审批" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已驳回" value="rejected" />
              <el-option label="已撤回" value="withdrawn" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadData"><el-icon><Search /></el-icon> 搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="table-card" shadow="hover">
        <el-table :data="items" border stripe v-loading="loading" style="width:100%">
          <el-table-column prop="title" label="标题" min-width="180" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag size="small">{{ getTypeLabel(row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="发起时间" width="180" align="center">
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
          <el-form-item label="标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入标题" :disabled="isViewMode" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择类型" :disabled="isViewMode" style="width:100%">
              <el-option label="合同审批" value="contract" />
              <el-option label="费用审批" value="expense" />
              <el-option label="请假审批" value="leave" />
              <el-option label="付款审批" value="payment" />
              <el-option label="采购审批" value="purchase" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择状态" :disabled="isViewMode" style="width:100%">
              <el-option label="待审批" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已驳回" value="rejected" />
              <el-option label="已撤回" value="withdrawn" />
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入描述" :disabled="isViewMode" />
          </el-form-item>
          <el-form-item v-if="isViewMode" label="创建时间">
            <span>{{ formatDate(formData.createdAt) }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </template>

    <el-empty v-if="!loading && items.length === 0 && showList" description="暂无审批数据" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { Plus, Edit, Delete, Refresh, Search } from '@element-plus/icons-vue';
import { formatDate } from '@/utils/format';
import { approvalApi } from '@/api/approval';

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();

const pageType = computed(() => {
  const path = route.path;
  if (path.endsWith('/create')) return 'Create';
  if (path.includes('/edit')) return 'Edit';
  if (path.includes('/detail')) return 'Detail';
  return 'Dashboard';
});

const isViewMode = computed(() => pageType.value === 'Detail');
const showList = computed(() => pageType.value === 'Dashboard');
const showForm = computed(() => pageType.value === 'Detail' || pageType.value === 'Edit' || pageType.value === 'Create');
const showCreate = computed(() => pageType.value === 'Dashboard');
const showEdit = computed(() => pageType.value === 'Detail');
const showSave = computed(() => pageType.value === 'Edit' || pageType.value === 'Create');

const loading = ref(false);
const submitting = ref(false);
const items = ref<any[]>([]);
const currentItem = ref<any>(null);
const total = ref(0);

const filters = reactive({ page: 1, limit: 20, search: '', status: '' });

const formData = reactive({
  id: '', title: '', type: '', status: 'pending', description: '', createdAt: '', updatedAt: ''
});

const formRules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const getTypeLabel = (value: string) => {
  const map: Record<string,string> = { contract:'合同', expense:'费用', leave:'请假', payment:'付款', purchase:'采购' };
  return map[value] || value;
};
const getStatusLabel = (value: string) => {
  const map: Record<string,string> = { pending:'待审批', approved:'已通过', rejected:'已驳回', withdrawn:'已撤回' };
  return map[value] || value;
};
const getStatusType = (value: string) => {
  const map: Record<string,string> = { pending:'warning', approved:'success', rejected:'danger', withdrawn:'info' };
  return map[value] || 'info';
};

const loadData = async () => {
  loading.value = true;
  try {
    const response = await approvalApi.getList(filters);
    items.value = response.data.items || [];
    total.value = response.data.total || 0;
  } catch (error: any) {
    ElMessage.error(error.message || '加载数据失败');
  } finally { loading.value = false; }
};

const loadDetail = async (id: string) => {
  loading.value = true;
  try {
    const data = await approvalApi.getDetail(id);
    currentItem.value = data;
    Object.assign(formData, data);
  } catch (error: any) {
    ElMessage.error(error.message || '加载详情失败');
  } finally { loading.value = false; }
};

const handleReset = () => { filters.search = ''; filters.status = ''; filters.page = 1; loadData(); };
const handleRefresh = () => { loadData(); ElMessage.success('已刷新'); };
const handleView = (id: string) => router.push('/')
const handleCreate = () => router.push('/approval/create');
const handleEdit = (id?: string) => {
  const targetId = id || currentItem.value?.id || route.params.id;
  if (targetId) router.push('/')
};
const handleCancel = () => router.push('/approval');

const handleSubmit = async () => {
  if (!formRef.value) return;
  try { await formRef.value.validate(); } catch { return; }
  submitting.value = true;
  try {
    const data = { ...formData };
    delete data.id; delete data.createdAt; delete data.updatedAt;
    if (pageType.value === 'Edit' && currentItem.value?.id) {
      await approvalApi.update(currentItem.value.id, data);
      ElMessage.success('更新成功');
    } else {
      await approvalApi.create(data);
      ElMessage.success('创建成功');
    }
    router.push('/approval');
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败');
  } finally { submitting.value = false; }
};

const handleDelete = async (id?: string) => {
  const targetId = id || currentItem.value?.id || route.params.id;
  if (!targetId) return;
  try {
    await ElMessageBox.confirm('确定要删除此审批吗？', '警告', { confirmButtonText:'确定删除', cancelButtonText:'取消', type:'warning' });
    await approvalApi.delete(targetId);
    ElMessage.success('删除成功');
    if (pageType.value === 'Detail') router.push('/approval');
    else loadData();
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除失败');
  }
};

onMounted(() => {
  const id = route.params.id as string;
  if (pageType.value === 'Detail' || pageType.value === 'Edit') {
    if (id) loadDetail(id);
  } else {
    loadData();
  }
});
</script>

<style scoped lang="scss">
.approval-page {
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
  .loading-container { padding: 40px 0; }
}

@media (max-width: 768px) {
  .approval-page { padding: 12px; .page-header { flex-direction: column; gap: 12px; .header-right { width: 100%; } } }
}
</style>
