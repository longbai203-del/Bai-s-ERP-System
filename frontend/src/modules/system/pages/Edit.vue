<template>
  <div class="system-edit-page">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/system' }">系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑配置 #{{ systemData?.key || '加载中...' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">编辑系统配置</h1>
      </div>
      <div class="header-right">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container"><el-skeleton :rows="8" animated /></div>

    <template v-else-if="systemData">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>配置信息</span></div></template>
              <el-form-item label="配置键"><el-input v-model="formData.key" disabled /></el-form-item>
              <el-form-item label="配置值" prop="value">
                <el-input v-model="formData.value" type="textarea" :rows="3" />
              </el-form-item>
              <el-form-item label="分组" prop="group">
                <el-select v-model="formData.group" style="width:100%">
                  <el-option label="公司设置" value="company" />
                  <el-option label="系统设置" value="system" />
                  <el-option label="邮件设置" value="email" />
                  <el-option label="订单设置" value="order" />
                  <el-option label="库存设置" value="inventory" />
                  <el-option label="认证设置" value="auth" />
                  <el-option label="备份设置" value="backup" />
                  <el-option label="通知设置" value="notification" />
                  <el-option label="安全设置" value="security" />
                </el-select>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input v-model="formData.description" type="textarea" :rows="2" />
              </el-form-item>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>配置信息</span></div></template>
              <div class="stats-info">
                <div class="stat-item"><span class="stat-label">类型</span><span class="stat-value">{{ typeof systemData.value }}</span></div>
                <div class="stat-item"><span class="stat-label">是否可编辑</span><span class="stat-value">{{ systemData.isEditable ? '是' : '否' }}</span></div>
                <div class="stat-item"><span class="stat-label">创建时间</span><span class="stat-value">{{ formatDate(systemData.createdAt) }}</span></div>
                <div class="stat-item"><span class="stat-label">更新时间</span><span class="stat-value">{{ formatDate(systemData.updatedAt) }}</span></div>
              </div>
            </el-card>

            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>其他配置</span></div></template>
              <el-button type="text" block @click="viewAllSettings">查看所有配置</el-button>
              <el-button type="text" block @click="resetToDefault">恢复默认值</el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { useSystemStore } from '../store';
import { formatDate } from '@/utils/format';

const route = useRoute();
const router = useRouter();
const systemStore = useSystemStore();
const formRef = ref<FormInstance>();
const loading = ref(true);
const submitting = ref(false);
const systemData = ref<any>(null);

const formData = reactive({
  key: '',
  value: '',
  group: '',
  description: '',
});

const formRules: FormRules = {
  value: [{ required: true, message: '请输入配置值', trigger: 'blur' }],
  group: [{ required: true, message: '请选择分组', trigger: 'change' }],
};

const loadSystemData = async () => {
  const id = route.params.id as string;
  if (!id) { ElMessage.error('配置ID无效'); router.push('/system'); return; }
  loading.value = true;
  try {
    const data = await systemStore.getSystemConfig(id);
    if (data) {
      systemData.value = data;
      Object.assign(formData, { key: data.key, value: data.value, group: data.group, description: data.description || '' });
    } else { ElMessage.error('配置不存在'); router.push('/system'); }
  } catch (error) { console.error('加载数据失败:', error); ElMessage.error('加载数据失败'); }
  finally { loading.value = false; }
};

const handleCancel = () => router.push(`/system/${systemData.value?.id}`);
const handleSubmit = async () => {
  if (!formRef.value) return;
  try { await formRef.value.validate(); } catch { return; }
  submitting.value = true;
  try {
    await systemStore.updateSystemConfig(systemData.value.id, formData);
    ElMessage.success('配置更新成功');
    router.push(`/system/${systemData.value.id}`);
  } catch (error) { console.error('保存失败:', error); ElMessage.error('保存失败'); }
  finally { submitting.value = false; }
};

const viewAllSettings = () => router.push('/system');
const resetToDefault = async () => {
  try {
    await ElMessageBox.confirm('确定要恢复默认值吗？', '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' });
    // 实际项目中调用重置API
    ElMessage.success('已恢复默认值');
  } catch { /* 用户取消 */ }
};

onMounted(() => loadSystemData());
</script>

<style scoped lang="scss">
.system-edit-page { padding: 20px;
  .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; .header-left { .page-title { font-size: 24px; font-weight: 600; margin: 8px 0 0; color: #303133; } } .header-right { display: flex; gap: 12px; } }
  .loading-container { padding: 40px 0; }
  .form-section { margin-bottom: 24px; .section-header { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 16px; } }
  .stats-info { .stat-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f7fa; &:last-child { border-bottom: none; } .stat-label { color: #909399; } .stat-value { color: #303133; font-weight: 500; } } }
}
</style>