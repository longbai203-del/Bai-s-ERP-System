<template>
  <div class="hr-edit-page">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/hr' }">人力资源</el-breadcrumb-item>
          <el-breadcrumb-item>编辑员工 #{{ employeeData?.employeeId || '加载中...' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">编辑员工</h1>
      </div>
      <div class="header-right">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container"><el-skeleton :rows="10" animated /></div>

    <template v-else-if="employeeData">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>个人信息</span><el-tag :type="statusType" size="small">{{ statusText }}</el-tag></div></template>
              <el-row :gutter="20">
                <el-col :span="12"><el-form-item label="员工ID"><el-input v-model="formData.employeeId" disabled /></el-form-item></el-col>
                <el-col :span="12"><el-form-item label="状态" prop="status"><el-select v-model="formData.status" style="width:100%"><el-option label="在职" value="active" /><el-option label="休假" value="on_leave" /><el-option label="试用期" value="probation" /><el-option label="已离职" value="terminated" /></el-select></el-form-item></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12"><el-form-item label="名" prop="firstName"><el-input v-model="formData.firstName" /></el-form-item></el-col>
                <el-col :span="12"><el-form-item label="姓" prop="lastName"><el-input v-model="formData.lastName" /></el-form-item></el-col>
              </el-row>
              <el-form-item label="邮箱" prop="email"><el-input v-model="formData.email" /></el-form-item>
              <el-form-item label="电话" prop="phone"><el-input v-model="formData.phone" /></el-form-item>
              <el-row :gutter="20">
                <el-col :span="12"><el-form-item label="部门" prop="department"><el-input v-model="formData.department" /></el-form-item></el-col>
                <el-col :span="12"><el-form-item label="职位" prop="position"><el-input v-model="formData.position" /></el-form-item></el-col>
              </el-row>
              <el-form-item label="上级主管" prop="managerId"><el-input v-model="formData.managerId" placeholder="请输入上级主管ID" /></el-form-item>
            </el-card>

            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>薪酬信息</span></div></template>
              <el-form-item label="薪资" prop="salary"><el-input-number v-model="formData.salary" :min="0" :step="1000" style="width:100%" /></el-form-item>
              <el-row :gutter="20">
                <el-col :span="12"><el-form-item label="入职日期" prop="hireDate"><el-date-picker v-model="formData.hireDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width:100%" /></el-form-item></el-col>
                <el-col :span="12"><el-form-item label="出生日期" prop="birthDate"><el-date-picker v-model="formData.birthDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width:100%" /></el-form-item></el-col>
              </el-row>
              <el-form-item label="地址" prop="address"><el-input v-model="formData.address" type="textarea" :rows="2" /></el-form-item>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>紧急联系人</span></div></template>
              <el-form-item label="姓名"><el-input v-model="formData.emergencyContact.name" /></el-form-item>
              <el-form-item label="关系"><el-input v-model="formData.emergencyContact.relationship" /></el-form-item>
              <el-form-item label="电话"><el-input v-model="formData.emergencyContact.phone" /></el-form-item>
            </el-card>

            <el-card class="form-section" shadow="hover">
              <template #header><div class="section-header"><span>技能</span></div></template>
              <el-select v-model="formData.skills" multiple filterable allow-create placeholder="输入技能" style="width:100%">
                <el-option v-for="skill in skillOptions" :key="skill" :label="skill" :value="skill" />
              </el-select>
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
import { useHrStore } from '../store';
import { formatDate } from '@/utils/format';

const route = useRoute();
const router = useRouter();
const hrStore = useHrStore();
const formRef = ref<FormInstance>();
const loading = ref(true);
const submitting = ref(false);
const employeeData = ref<any>(null);
const skillOptions = ['JavaScript', 'Python', 'Java', 'SQL', 'AWS', 'Docker', 'React', 'Node.js', 'MongoDB', 'TypeScript'];

const formData = reactive({
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  managerId: '',
  hireDate: '',
  birthDate: '',
  status: 'active' as 'active' | 'on_leave' | 'probation' | 'terminated',
  salary: 0,
  address: '',
  emergencyContact: { name: '', relationship: '', phone: '' },
  skills: [] as string[],
});

const formRules: FormRules = {
  firstName: [{ required: true, message: '请输入名', trigger: 'blur' }],
  lastName: [{ required: true, message: '请输入姓', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '邮箱格式无效', trigger: 'blur' }],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
};

const statusText = computed(() => {
  const map: Record<string, string> = { active: '在职', on_leave: '休假', probation: '试用期', terminated: '已离职' };
  return map[formData.status] || formData.status;
});
const statusType = computed(() => {
  const map: Record<string, string> = { active: 'success', on_leave: 'warning', probation: 'warning', terminated: 'danger' };
  return map[formData.status] || 'info';
});

const loadEmployeeData = async () => {
  const id = route.params.id as string;
  if (!id) { ElMessage.error('员工ID无效'); router.push('/hr'); return; }
  loading.value = true;
  try {
    const data = await hrStore.getEmployeeDetail(id);
    if (data) {
      employeeData.value = data;
      Object.assign(formData, { ...data });
    } else { ElMessage.error('员工不存在'); router.push('/hr'); }
  } catch (error) { console.error('加载数据失败:', error); ElMessage.error('加载数据失败'); }
  finally { loading.value = false; }
};

const handleCancel = () => router.push(`/hr/${employeeData.value?.id}`);
const handleSubmit = async () => {
  if (!formRef.value) return;
  try { await formRef.value.validate(); } catch { return; }
  submitting.value = true;
  try {
    await hrStore.updateEmployee(employeeData.value.id, formData);
    ElMessage.success('更新成功');
    router.push(`/hr/${employeeData.value.id}`);
  } catch (error) { console.error('保存失败:', error); ElMessage.error('保存失败'); }
  finally { submitting.value = false; }
};

onMounted(() => loadEmployeeData());
</script>

<style scoped lang="scss">
.hr-edit-page { padding: 20px; .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; .header-left { .page-title { font-size: 24px; font-weight: 600; margin: 8px 0 0; color: #303133; } } .header-right { display: flex; gap: 12px; } } .loading-container { padding: 40px 0; } .form-section { margin-bottom: 24px; .section-header { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 16px; } } }
@media (max-width: 768px) { .hr-edit-page { padding: 12px; .page-header { flex-direction: column; gap: 12px; .header-right { width: 100%; } } } }
</style>