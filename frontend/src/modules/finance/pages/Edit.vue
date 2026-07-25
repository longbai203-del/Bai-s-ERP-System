<template>
  <div class="finance-edit-page">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/finance' }">财务管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑财务记录 #{{ financeData?.transactionId || '加载中...' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">编辑财务记录</h1>
      </div>
      <div class="header-right">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <template v-else-if="financeData">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>交易信息</span>
                  <el-tag :type="statusType" size="small">{{ statusText }}</el-tag>
                </div>
              </template>
              <el-form-item label="交易类型" prop="type">
                <el-select v-model="formData.type" placeholder="请选择交易类型" style="width: 100%">
                  <el-option label="收入" value="income" />
                  <el-option label="支出" value="expense" />
                  <el-option label="转账" value="transfer" />
                  <el-option label="退款" value="refund" />
                  <el-option label="调整" value="adjustment" />
                </el-select>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="分类" prop="category">
                    <el-input v-model="formData.category" placeholder="请输入分类" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="子分类" prop="subCategory">
                    <el-input v-model="formData.subCategory" placeholder="请输入子分类" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="描述" prop="description">
                <el-input v-model="formData.description" type="textarea" :rows="2" placeholder="请输入描述" />
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="金额" prop="amount">
                    <el-input-number v-model="formData.amount" :min="0.01" :precision="2" :step="1" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="货币" prop="currency">
                    <el-select v-model="formData.currency" style="width: 100%">
                      <el-option label="CNY" value="CNY" />
                      <el-option label="USD" value="USD" />
                      <el-option label="EUR" value="EUR" />
                      <el-option label="SAR" value="SAR" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="支付方式" prop="paymentMethod">
                <el-select v-model="formData.paymentMethod" placeholder="请选择支付方式" style="width: 100%">
                  <el-option label="银行转账" value="bank_transfer" />
                  <el-option label="现金" value="cash" />
                  <el-option label="信用卡" value="credit_card" />
                  <el-option label="微信支付" value="wechat" />
                  <el-option label="支付宝" value="alipay" />
                </el-select>
              </el-form-item>
              <el-form-item label="交易日期" prop="transactionDate">
                <el-date-picker v-model="formData.transactionDate" type="datetime" placeholder="选择日期时间" style="width: 100%" />
              </el-form-item>
            </el-card>

            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header"><span>关联信息</span></div>
              </template>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="参考ID" prop="referenceId">
                    <el-input v-model="formData.referenceId" placeholder="请输入参考ID" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="参考类型" prop="referenceType">
                    <el-input v-model="formData.referenceType" placeholder="请输入参考类型" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="客户ID" prop="customerId">
                <el-input v-model="formData.customerId" placeholder="请输入客户ID" />
              </el-form-item>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>状态信息</span></div></template>
              <el-form-item label="状态" prop="status">
                <el-select v-model="formData.status" style="width: 100%">
                  <el-option label="待处理" value="pending" />
                  <el-option label="已完成" value="completed" />
                  <el-option label="失败" value="failed" />
                  <el-option label="已取消" value="cancelled" />
                </el-select>
              </el-form-item>
              <div class="stats-info">
                <div class="stat-item"><span class="stat-label">创建时间</span><span class="stat-value">{{ formatDate(financeData.createdAt) }}</span></div>
                <div class="stat-item"><span class="stat-label">更新时间</span><span class="stat-value">{{ formatDate(financeData.updatedAt) }}</span></div>
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
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useFinanceStore } from '../store';
import { formatDate } from '@/utils/format';

const route = useRoute();
const router = useRouter();
const financeStore = useFinanceStore();
const formRef = ref<FormInstance>();
const loading = ref(true);
const submitting = ref(false);
const financeData = ref<any>(null);

const formData = reactive({
  id: '',
  type: '',
  category: '',
  subCategory: '',
  description: '',
  amount: 0,
  currency: 'CNY',
  status: 'pending' as 'pending' | 'completed' | 'failed' | 'cancelled',
  paymentMethod: '',
  transactionDate: new Date(),
  referenceId: '',
  referenceType: '',
  customerId: '',
});

const formRules: FormRules = {
  type: [{ required: true, message: '请选择交易类型', trigger: 'change' }],
  category: [{ required: true, message: '请输入分类', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const statusText = computed(() => {
  const map: Record<string, string> = { pending: '待处理', completed: '已完成', failed: '失败', cancelled: '已取消' };
  return map[formData.status] || formData.status;
});
const statusType = computed(() => {
  const map: Record<string, string> = { pending: 'warning', completed: 'success', failed: 'danger', cancelled: 'info' };
  return map[formData.status] || 'info';
});

const loadFinanceData = async () => {
  const id = route.params.id as string;
  if (!id) { ElMessage.error('记录ID无效'); router.push('/finance'); return; }
  loading.value = true;
  try {
    const data = await financeStore.getFinanceDetail(id);
    if (data) {
      financeData.value = data;
      Object.assign(formData, { ...data, transactionDate: new Date(data.transactionDate || data.createdAt) });
    } else { ElMessage.error('记录不存在'); router.push('/finance'); }
  } catch (error) { console.error('加载数据失败:', error); ElMessage.error('加载数据失败'); }
  finally { loading.value = false; }
};

const handleCancel = () => router.push(`/finance/${financeData.value?.id}`);
const handleSubmit = async () => {
  if (!formRef.value) return;
  try { await formRef.value.validate(); } catch { return; }
  submitting.value = true;
  try {
    await financeStore.updateFinance(financeData.value.id, formData);
    ElMessage.success('更新成功');
    router.push(`/finance/${financeData.value.id}`);
  } catch (error) { console.error('保存失败:', error); ElMessage.error('保存失败'); }
  finally { submitting.value = false; }
};

onMounted(() => loadFinanceData());
</script>

<style scoped lang="scss">
.finance-edit-page { padding: 20px; .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; .header-left { .page-title { font-size: 24px; font-weight: 600; margin: 8px 0 0; color: #303133; } } .header-right { display: flex; gap: 12px; } } .loading-container { padding: 40px 0; } .form-section { margin-bottom: 24px; .section-header { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 16px; } } .stats-info { .stat-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f7fa; &:last-child { border-bottom: none; } .stat-label { color: #909399; } .stat-value { color: #303133; font-weight: 500; } } } }
@media (max-width: 768px) { .finance-edit-page { padding: 12px; .page-header { flex-direction: column; gap: 12px; .header-right { width: 100%; } } } }
</style>