<template>
  <div class="customer-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/customers' }">客户管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑客户 #{{ customerData?.name || '加载中...' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">编辑客户</h1>
      </div>
      <div class="header-right">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          保存客户
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 编辑表单 -->
    <template v-else-if="customerData">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="customer-form"
      >
        <el-row :gutter="20">
          <el-col :span="16">
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
              <el-form-item label="客户名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入客户名称" />
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" placeholder="请输入邮箱" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="formData.phone" placeholder="请输入手机号" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="formData.status">
                  <el-radio label="active">活跃</el-radio>
                  <el-radio label="inactive">非活跃</el-radio>
                  <el-radio label="lead">潜在客户</el-radio>
                  <el-radio label="vip">VIP</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-card>

            <!-- 地址信息 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>地址信息</span>
                </div>
              </template>
              <el-form-item label="地址" prop="address">
                <el-input v-model="formData.address" placeholder="请输入详细地址" />
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="城市" prop="city">
                    <el-input v-model="formData.city" placeholder="请输入城市" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="国家" prop="country">
                    <el-input v-model="formData.country" placeholder="请输入国家" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="邮编" prop="postalCode">
                    <el-input v-model="formData.postalCode" placeholder="请输入邮编" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <!-- 商业信息 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>商业信息</span>
                </div>
              </template>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="税号" prop="taxId">
                    <el-input v-model="formData.taxId" placeholder="请输入税号" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="行业" prop="industry">
                    <el-select v-model="formData.industry" placeholder="请选择行业" style="width: 100%">
                      <el-option
                        v-for="industry in industryOptions"
                        :key="industry"
                        :label="industry"
                        :value="industry"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="备注" prop="notes">
                <el-input
                  v-model="formData.notes"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注信息"
                />
              </el-form-item>
            </el-card>

            <!-- 标签 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>标签</span>
                </div>
              </template>
              <el-form-item label="标签" prop="tags">
                <el-select
                  v-model="formData.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请输入标签，按回车确认"
                  style="width: 100%"
                >
                  <el-option
                    v-for="tag in tagOptions"
                    :key="tag"
                    :label="tag"
                    :value="tag"
                  />
                </el-select>
              </el-form-item>
            </el-card>
          </el-col>

          <el-col :span="8">
            <!-- 统计信息 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>客户统计</span>
                </div>
              </template>
              <div class="stats-info">
                <div class="stat-item">
                  <span class="stat-label">订单总数</span>
                  <span class="stat-value">{{ customerData.totalOrders || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">总消费金额</span>
                  <span class="stat-value">¥{{ (customerData.totalSpent || 0).toFixed(2) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">最后下单</span>
                  <span class="stat-value">{{ formatDate(customerData.lastOrderAt) || '-' }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">注册时间</span>
                  <span class="stat-value">{{ formatDate(customerData.createdAt) }}</span>
                </div>
              </div>
            </el-card>

            <!-- 快捷操作 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>快捷操作</span>
                </div>
              </template>
              <div class="quick-actions">
                <el-button
                  type="primary"
                  size="small"
                  @click="goToOrders"
                  block
                >
                  查看订单
                </el-button>
                <el-button
                  type="success"
                  size="small"
                  @click="createOrder"
                  block
                >
                  创建订单
                </el-button>
                <el-button
                  type="warning"
                  size="small"
                  @click="sendEmail"
                  block
                >
                  发送邮件
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { useCustomerStore } from '../store';
import { formatDate } from '@/utils/format';

// ==================== 路由和Store ====================
const route = useRoute();
const router = useRouter();
const customerStore = useCustomerStore();

// ==================== 引用 ====================
const formRef = ref<FormInstance>();

// ==================== 状态 ====================
const loading = ref(true);
const submitting = ref(false);

// ==================== 数据 ====================
const customerData = ref<any>(null);
const industryOptions = ['Technology', 'Retail', 'Manufacturing', 'Finance', 'Healthcare', 'Education', 'Consulting', 'Real Estate'];
const tagOptions = ['VIP', 'Enterprise', 'Startup', 'Long-term', 'New', 'International'];

// ==================== 表单数据 ====================
const formData = reactive({
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  postalCode: '',
  taxId: '',
  industry: '',
  status: 'active' as 'active' | 'inactive' | 'lead' | 'vip',
  notes: '',
  tags: [] as string[],
});

// ==================== 表单验证规则 ====================
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入客户名称', trigger: 'blur' },
    { min: 1, max: 200, message: '客户名称长度在1-200个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式无效', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^[\+\d\s\-()]{7,20}$/, message: '手机号格式无效', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

// ==================== 计算属性 ====================
const statusText = computed(() => {
  const map: Record<string, string> = {
    active: '活跃',
    inactive: '非活跃',
    lead: '潜在客户',
    vip: 'VIP',
  };
  return map[formData.status] || formData.status;
});

const statusType = computed(() => {
  const map: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    lead: 'warning',
    vip: 'danger',
  };
  return map[formData.status] || 'info';
});

// ==================== 方法 ====================

/**
 * 加载客户数据
 */
const loadCustomerData = async () => {
  const id = route.params.id as string;
  if (!id) {
    ElMessage.error('客户ID无效');
    router.push('/customers');
    return;
  }

  loading.value = true;
  try {
    const data = await customerStore.getCustomerDetail(id);
    if (data) {
      customerData.value = data;
      Object.assign(formData, {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || '',
        postalCode: data.postalCode || '',
        taxId: data.taxId || '',
        industry: data.industry || '',
        status: data.status || 'active',
        notes: data.notes || '',
        tags: data.tags || [],
      });
    } else {
      ElMessage.error('客户不存在');
      router.push('/customers');
    }
  } catch (error) {
    console.error('加载客户数据失败:', error);
    ElMessage.error('加载客户数据失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 取消编辑
 */
const handleCancel = () => {
  router.push(`/customers/${customerData.value?.id}`);
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
    await customerStore.updateCustomer(customerData.value.id, formData);
    ElMessage.success('客户更新成功');
    router.push(`/customers/${customerData.value.id}`);
  } catch (error) {
    console.error('保存客户失败:', error);
    ElMessage.error('保存客户失败');
  } finally {
    submitting.value = false;
  }
};

/**
 * 查看订单
 */
const goToOrders = () => {
  router.push(`/orders?customerId=${customerData.value.id}`);
};

/**
 * 创建订单
 */
const createOrder = () => {
  router.push(`/orders/create?customerId=${customerData.value.id}`);
};

/**
 * 发送邮件
 */
const sendEmail = async () => {
  try {
    await ElMessageBox.confirm(`确定要向 ${customerData.value.email} 发送邮件吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });
    // 实际项目中打开邮件编辑器
    ElMessage.success('邮件发送功能已打开');
  } catch {
    // 用户取消
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadCustomerData();
});
</script>

<style scoped lang="scss">
.customer-edit-page {
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

  .stats-info {
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f5f7fa;

      &:last-child {
        border-bottom: none;
      }

      .stat-label {
        color: #909399;
        font-size: 14px;
      }

      .stat-value {
        color: #303133;
        font-weight: 500;
      }
    }
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .customer-edit-page {
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