<template>
  <div class="production-edit-page">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/production' }">生产管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑工单 #{{ workOrderData?.workOrder || '加载中...' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">编辑生产工单</h1>
      </div>
      <div class="header-right">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container"><el-skeleton :rows="10" animated /></div>

    <template v-else-if="workOrderData">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="130px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>工单信息</span>
                  <el-tag :type="statusType" size="small">{{ statusText }}</el-tag>
                </div>
              </template>
              <el-form-item label="工单号"><el-input v-model="formData.workOrder" disabled /></el-form-item>
              <el-form-item label="产品" prop="product"><el-input v-model="formData.product" /></el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select v-model="formData.status" style="width:100%">
                  <el-option label="计划中" value="scheduled" />
                  <el-option label="进行中" value="in_progress" />
                  <el-option label="已完成" value="completed" />
                  <el-option label="已延迟" value="delayed" />
                  <el-option label="已取消" value="cancelled" />
                </el-select>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12"><el-form-item label="计划数量" prop="plannedQuantity"><el-input-number v-model="formData.plannedQuantity" :min="1" style="width:100%" /></el-form-item></el-col>
                <el-col :span="12"><el-form-item label="已完成数量"><el-input-number v-model="formData.completedQuantity" :min="0" :max="formData.plannedQuantity" style="width:100%" /></el-form-item></el-col>
              </el-row>
              <el-form-item label="备注"><el-input v-model="formData.note" type="textarea" :rows="2" /></el-form-item>
            </el-card>

            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>物料清单</span></div></template>
              <el-table :data="formData.materials || []" border stripe>
                <el-table-column prop="name" label="物料名称" min-width="150" />
                <el-table-column prop="sku" label="SKU" width="140" />
                <el-table-column prop="required" label="需要数量" width="120" align="center" />
                <el-table-column prop="available" label="可用数量" width="120" align="center">
                  <template #default="{ row }">
                    <span :style="{ color: row.available < row.required ? '#F56C6C' : '#67C23A' }">{{ row.available || 0 }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100" align="center">
                  <template #default="{ row }">
                    <el-tag :type="row.available >= row.required ? 'success' : 'danger'" size="small">
                      {{ row.available >= row.required ? '充足' : '不足' }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>时间信息</span></div></template>
              <el-form-item label="开始日期" prop="startDate">
                <el-date-picker v-model="formData.startDate" type="date" format="YYYY-MM-DD" style="width:100%" />
              </el-form-item>
              <el-form-item label="结束日期" prop="endDate">
                <el-date-picker v-model="formData.endDate" type="date" format="YYYY-MM-DD" style="width:100%" />
              </el-form-item>
              <div class="stats-info">
                <div class="stat-item"><span class="stat-label">进度</span>
                  <el-progress :percentage="progressPercent" :status="progressStatus" />
                </div>
                <div class="stat-item"><span class="stat-label">创建时间</span><span class="stat-value">{{ formatDate(workOrderData.createdAt) }}</span></div>
                <div class="stat-item"><span class="stat-label">更新时间</span><span class="stat-value">{{ formatDate(workOrderData.updatedAt) }}</span></div>
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
import { useProductionStore } from '../store';
import { formatDate } from '@/utils/format';

const route = useRoute();
const router = useRouter();
const productionStore = useProductionStore();
const formRef = ref<FormInstance>();
const loading = ref(true);
const submitting = ref(false);
const workOrderData = ref<any>(null);

const formData = reactive({
  workOrder: '',
  product: '',
  plannedQuantity: 1,
  completedQuantity: 0,
  status: 'scheduled' as 'scheduled' | 'in_progress' | 'completed' | 'delayed' | 'cancelled',
  startDate: '',
  endDate: '',
  note: '',
  materials: [] as any[],
});

const formRules: FormRules = {
  product: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  plannedQuantity: [{ required: true, message: '请输入计划数量', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const statusText = computed(() => {
  const map: Record<string, string> = { scheduled: '计划中', in_progress: '进行中', completed: '已完成', delayed: '已延迟', cancelled: '已取消' };
  return map[formData.status] || formData.status;
});
const statusType = computed(() => {
  const map: Record<string, string> = { scheduled: 'info', in_progress: 'primary', completed: 'success', delayed: 'warning', cancelled: 'danger' };
  return map[formData.status] || 'info';
});
const progressPercent = computed(() => {
  if (!formData.plannedQuantity || formData.plannedQuantity === 0) return 0;
  return Math.min((formData.completedQuantity / formData.plannedQuantity) * 100, 100);
});
const progressStatus = computed(() => {
  const p = progressPercent.value;
  if (p >= 100) return 'success';
  if (p >= 50) return 'warning';
  return 'info';
});

const loadWorkOrderData = async () => {
  const id = route.params.id as string;
  if (!id) { ElMessage.error('工单ID无效'); router.push('/production'); return; }
  loading.value = true;
  try {
    const data = await productionStore.getWorkOrderDetail(id);
    if (data) {
      workOrderData.value = data;
      Object.assign(formData, { ...data, materials: data.materials || [] });
    } else { ElMessage.error('工单不存在'); router.push('/production'); }
  } catch (error) { console.error('加载数据失败:', error); ElMessage.error('加载数据失败'); }
  finally { loading.value = false; }
};

const handleCancel = () => router.push(`/production/${workOrderData.value?.id}`);
const handleSubmit = async () => {
  if (!formRef.value) return;
  try { await formRef.value.validate(); } catch { return; }
  submitting.value = true;
  try {
    await productionStore.updateWorkOrder(workOrderData.value.id, formData);
    ElMessage.success('更新成功');
    router.push(`/production/${workOrderData.value.id}`);
  } catch (error) { console.error('保存失败:', error); ElMessage.error('保存失败'); }
  finally { submitting.value = false; }
};

onMounted(() => loadWorkOrderData());
</script>

<style scoped lang="scss">
.production-edit-page { padding: 20px;
  .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; .header-left { .page-title { font-size: 24px; font-weight: 600; margin: 8px 0 0; color: #303133; } } .header-right { display: flex; gap: 12px; } }
  .loading-container { padding: 40px 0; }
  .form-section { margin-bottom: 24px; .section-header { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 16px; } }
  .stats-info { .stat-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f5f7fa; &:last-child { border-bottom: none; } .stat-label { color: #909399; } .stat-value { color: #303133; font-weight: 500; } } }
}
</style>