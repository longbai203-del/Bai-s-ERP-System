<!-- 
  文件路径: frontend/src/modules/pos/pages/Create.vue
  功能: 创建POS配置 - 创建新的POS终端配置
  最后更新: 2026-07-25 12:43:15
-->

<template>
  <div class="pos-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/pos' }">POS管理</el-breadcrumb-item>
          <el-breadcrumb-item v-if="pageType !== 'Index' && pageType !== 'Dashboard'">
            创建POS配置
          </el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">创建POS配置</h1>
      </div>
      <div class="header-right">
        <template v-if="pageType === 'Index' || pageType === 'Dashboard'">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon> 新建POS
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </template>
        <template v-if="pageType === 'Detail'">
          <el-button type="primary" @click="handleEdit">
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
          <el-button type="danger" @click="handleDelete">
            <el-icon><Delete /></el-icon> 删除
          </el-button>
        </template>
        <template v-if="pageType === 'Edit' || pageType === 'Create'">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            保存
          </el-button>
        </template>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>

    <!-- 列表/仪表板页面 -->
    <template v-if="(pageType === 'Index' || pageType === 'Dashboard') && !loading">
      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stats-row" v-if="pageType === 'Dashboard'">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">POS总数</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-number">{{ stats.active }}</div>
            <div class="stat-label">运行中</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-number">{{ stats.todayOrders }}</div>
            <div class="stat-label">今日订单</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-number">¥{{ stats.todayRevenue?.toFixed(2) || '0.00' }}</div>
            <div class="stat-label">今日收入</div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 搜索栏 -->
      <el-card class="search-card" shadow="hover">
        <el-form :model="filters" inline @submit.prevent="loadData">
          <el-form-item label="关键词">
            <el-input
              v-model="filters.search"
              placeholder="请输入POS名称/终端ID"
              clearable
              @clear="loadData"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 120px">
              <el-option label="启用" value="active" />
              <el-option label="停用" value="inactive" />
              <el-option label="维护中" value="maintenance" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadData">
              <el-icon><Search /></el-icon> 搜索
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 数据表格 -->
      <el-card class="table-card" shadow="hover">
        <el-table :data="items" border stripe v-loading="loading" style="width: 100%">
          <el-table-column prop="name" label="POS名称" min-width="150" />
          <el-table-column prop="terminalId" label="终端ID" width="140" />
          <el-table-column prop="storeId" label="门店" width="120" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastSync" label="最后同步" width="180" align="center">
            <template #default="{ row }">
              {{ formatDate(row.lastSync) || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180" align="center">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
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
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="loadData"
            @current-change="loadData"
          />
        </div>
      </el-card>
    </template>

    <!-- 详情/表单页面 -->
    <template v-if="(pageType === 'Detail' || pageType === 'Edit' || pageType === 'Create') && !loading">
      <el-card class="form-card" shadow="hover">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="140px"
          class="detail-form"
        >
          <el-form-item label="POS名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入POS名称" :disabled="isViewMode" />
          </el-form-item>
          <el-form-item label="终端ID" prop="terminalId">
            <el-input v-model="formData.terminalId" placeholder="请输入终端ID" :disabled="isViewMode" />
          </el-form-item>
          <el-form-item label="门店" prop="storeId">
            <el-input v-model="formData.storeId" placeholder="请输入门店ID" :disabled="isViewMode" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择状态" :disabled="isViewMode" style="width:100%">
              <el-option label="启用" value="active" />
              <el-option label="停用" value="inactive" />
              <el-option label="维护中" value="maintenance" />
            </el-select>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="formData.address"
              type="textarea"
              :rows="2"
              placeholder="请输入地址"
              :disabled="isViewMode"
            />
          </el-form-item>
          <el-form-item label="硬件配置" prop="hardware">
            <el-checkbox-group v-model="formData.hardware" :disabled="isViewMode">
              <el-checkbox label="printer">打印机</el-checkbox>
              <el-checkbox label="scanner">扫描枪</el-checkbox>
              <el-checkbox label="cashDrawer">钱箱</el-checkbox>
              <el-checkbox label="display">显示屏</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentMethods">
            <el-checkbox-group v-model="formData.paymentMethods" :disabled="isViewMode">
              <el-checkbox label="cash">现金</el-checkbox>
              <el-checkbox label="card">银行卡</el-checkbox>
              <el-checkbox label="wechat">微信支付</el-checkbox>
              <el-checkbox label="alipay">支付宝</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="isViewMode" label="创建时间">
            <span>{{ formatDate(formData.createdAt) }}</span>
          </el-form-item>
          <el-form-item v-if="isViewMode" label="更新时间">
            <span>{{ formatDate(formData.updatedAt) }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </template>

    <!-- 空状态 -->
    <el-empty v-if="!loading && items.length === 0 && (pageType === 'Index' || pageType === 'Dashboard')" description="暂无POS配置数据" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { Plus, Refresh, Edit, Delete, Search } from '@element-plus/icons-vue';
import { formatDate } from '@/utils/format';
import { posApi } from '@/api/pos';

// ==================== 路由 ====================
const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();

// ==================== 页面类型 ====================
const pageType = computed(() => {
  const path = route.path;
  if (path.endsWith('/create')) return 'Create';
  if (path.includes('/edit')) return 'Edit';
  if (path.includes('/detail') || path.includes('/view')) return 'Detail';
  if (path.includes('/dashboard')) return 'Dashboard';
  return 'Index';
});

const isViewMode = computed(() => pageType.value === 'Detail');

// ==================== 状态 ====================
const loading = ref(false);
const submitting = ref(false);
const items = ref<any[]>([]);
const currentItem = ref<any>(null);
const total = ref(0);

// ==================== 统计 ====================
const stats = reactive({
  total: 0,
  active: 0,
  todayOrders: 0,
  todayRevenue: 0,
});

// ==================== 过滤条件 ====================
const filters = reactive({
  page: 1,
  limit: 20,
  search: '',
  status: '',
});

// ==================== 表单数据 ====================
const formData = reactive({
  id: '',
  name: '',
  terminalId: '',
  storeId: '',
  status: 'active',
  address: '',
  hardware: [] as string[],
  paymentMethods: [] as string[],
  createdAt: '',
  updatedAt: '',
});

// ==================== 表单验证规则 ====================
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入POS名称', trigger: 'blur' },
    { min: 2, max: 100, message: '名称长度在2-100个字符', trigger: 'blur' },
  ],
  terminalId: [{ required: true, message: '请输入终端ID', trigger: 'blur' }],
  storeId: [{ required: true, message: '请输入门店ID', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

// ==================== 辅助方法 ====================
const getStatusLabel = (value: string) => {
  const map: Record<string, string> = { active: '启用', inactive: '停用', maintenance: '维护中' };
  return map[value] || value;
};

const getStatusType = (value: string) => {
  const map: Record<string, string> = { active: 'success', inactive: 'danger', maintenance: 'warning' };
  return map[value] || 'info';
};

// ==================== CRUD操作 ====================

/**
 * 加载数据
 */
const loadData = async () => {
  loading.value = true;
  try {
    const response = await posApi.getList(filters);
    items.value = response.data.items || [];
    total.value = response.data.total || 0;
  } catch (error: any) {
    ElMessage.error(error.message || '加载数据失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 加载统计
 */
const loadStats = async () => {
  try {
    const response = await posApi.getStats();
    Object.assign(stats, response.data);
  } catch (error) {
    // 静默失败
  }
};

/**
 * 加载详情
 */
const loadDetail = async (id: string) => {
  loading.value = true;
  try {
    const data = await posApi.getDetail(id);
    currentItem.value = data;
    Object.assign(formData, {
      id: data.id,
      name: data.name || '',
      terminalId: data.terminalId || '',
      storeId: data.storeId || '',
      status: data.status || 'active',
      address: data.address || '',
      hardware: data.hardware || [],
      paymentMethods: data.paymentMethods || [],
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
    });
  } catch (error: any) {
    ElMessage.error(error.message || '加载详情失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 重置搜索
 */
const handleReset = () => {
  filters.search = '';
  filters.status = '';
  filters.page = 1;
  loadData();
};

/**
 * 刷新
 */
const handleRefresh = () => {
  if (pageType.value === 'Dashboard') {
    loadStats();
  }
  loadData();
  ElMessage.success('已刷新');
};

/**
 * 查看详情
 */
const handleView = (id: string) => {
  router.push(/pos/);
};

/**
 * 创建
 */
const handleCreate = () => {
  router.push('/pos/create');
};

/**
 * 编辑
 */
const handleEdit = (id?: string) => {
  const targetId = id || currentItem.value?.id || route.params.id;
  if (targetId) {
    router.push(/pos//edit);
  }
};

/**
 * 取消
 */
const handleCancel = () => {
  router.push('/pos');
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
    const data = { ...formData };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    const isEdit = pageType.value === 'Edit' && currentItem.value?.id;
    if (isEdit) {
      await posApi.update(currentItem.value.id, data);
      ElMessage.success('更新成功');
    } else {
      await posApi.create(data);
      ElMessage.success('创建成功');
    }
    router.push('/pos');
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败');
  } finally {
    submitting.value = false;
  }
};

/**
 * 删除
 */
const handleDelete = async (id?: string) => {
  const targetId = id || currentItem.value?.id || route.params.id;
  if (!targetId) return;

  try {
    await ElMessageBox.confirm('确定要删除此POS配置吗？此操作不可恢复！', '警告', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await posApi.delete(targetId);
    ElMessage.success('删除成功');
    if (pageType.value === 'Detail') {
      router.push('/pos');
    } else {
      loadData();
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  const id = route.params.id as string;

  if (pageType.value === 'Detail' || pageType.value === 'Edit') {
    if (id) loadDetail(id);
  } else if (pageType.value === 'Create') {
    // 初始化空表单
  } else {
    loadData();
    if (pageType.value === 'Dashboard') {
      loadStats();
    }
  }
});
</script>

<style scoped lang="scss">
.pos-page {
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
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

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

  .loading-container {
    padding: 40px 0;
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      text-align: center;
      border-radius: 12px;

      .stat-number {
        font-size: 32px;
        font-weight: 700;
        color: #303133;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-top: 8px;
      }
    }
  }

  .search-card {
    margin-bottom: 20px;
    border-radius: 12px;

    :deep(.el-card__body) {
      padding: 16px 20px;
    }

    .el-form-item {
      margin-bottom: 0;
    }
  }

  .table-card {
    border-radius: 12px;
  }

  .form-card {
    border-radius: 12px;
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .detail-form {
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .pos-page {
    padding: 12px;

    .page-header {
      flex-direction: column;
      gap: 12px;

      .header-right {
        width: 100%;
      }
    }

    .stats-row .el-col {
      margin-bottom: 12px;
    }

    .detail-form {
      max-width: 100%;
    }
  }
}
</style>
