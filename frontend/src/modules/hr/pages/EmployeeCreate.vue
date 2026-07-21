<!-- 
  文件路径: frontend/src/modules/hr/pages/EmployeeCreate.vue
  功能: 新建员工
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新增员工</h2>
          <p class="subtitle">录入员工信息</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSubmit">保存员工</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="员工编号" prop="employeeNo">
                  <el-input v-model="form.employeeNo" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="form.name" placeholder="请输入姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="form.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出生日期" prop="birthDate">
                  <el-date-picker v-model="form.birthDate" type="date" placeholder="选择出生日期" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="国籍" prop="nationality">
                  <el-select v-model="form.nationality" placeholder="请选择国籍" style="width: 100%">
                    <el-option label="沙特阿拉伯" value="沙特阿拉伯" />
                    <el-option label="埃及" value="埃及" />
                    <el-option label="约旦" value="约旦" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证/Iqama" prop="idNumber">
                  <el-input v-model="form.idNumber" placeholder="请输入身份证或Iqama号码" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系电话" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入联系电话" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="婚姻状况" prop="maritalStatus">
                  <el-select v-model="form.maritalStatus" placeholder="请选择" style="width: 100%">
                    <el-option label="已婚" value="已婚" />
                    <el-option label="未婚" value="未婚" />
                    <el-option label="离异" value="离异" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="住址" prop="address">
                  <el-input v-model="form.address" placeholder="请输入详细住址" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="工作信息" name="work">
          <el-form :model="form" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="部门" prop="department">
                  <el-select v-model="form.department" placeholder="请选择部门" style="width: 100%">
                    <el-option label="销售部" value="销售部" />
                    <el-option label="采购部" value="采购部" />
                    <el-option label="财务部" value="财务部" />
                    <el-option label="运营部" value="运营部" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="职位" prop="position">
                  <el-input v-model="form.position" placeholder="请输入职位名称" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="入职日期" prop="hireDate">
                  <el-date-picker v-model="form.hireDate" type="date" placeholder="选择入职日期" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="薪资" prop="salary">
                  <el-input-number v-model="form.salary" :min="0" :precision="2" controls-position="right" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工作状态" prop="status">
                  <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
                    <el-option label="在职" value="active" />
                    <el-option label="试用期" value="probation" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="直属上级" prop="supervisor">
                  <el-select v-model="form.supervisor" placeholder="请选择上级" style="width: 100%">
                    <el-option label="Ahmed Al-Fahd" value="Ahmed Al-Fahd" />
                    <el-option label="Mohammed Al-Qahtani" value="Mohammed Al-Qahtani" />
                    <el-option label="Saud Al-Otaibi" value="Saud Al-Otaibi" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()
const activeTab = ref('basic')

const form = reactive({
  employeeNo: 'EMP-005',
  name: '',
  gender: '男',
  birthDate: '',
  nationality: '沙特阿拉伯',
  idNumber: '',
  phone: '',
  email: '',
  maritalStatus: '未婚',
  address: '',
  department: '',
  position: '',
  hireDate: '',
  salary: 0,
  status: 'probation',
  supervisor: '',
  remark: '',
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  hireDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('员工信息已保存')
  router.push('/hr/employees')
}

const handleCancel = () => { router.push('/hr/employees') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
:deep(.el-tabs__content) { padding-top: 20px; }
</style>