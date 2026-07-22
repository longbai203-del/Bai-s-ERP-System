<!--
  文件路径: frontend/src/modules/hr/pages/Create.vue
  功能: 创建HR记录 - 多步骤表单创建人力资源记录
  包含: 基本信息、工作信息、合同信息、证件信息、教育经历、家庭成员
-->

<template>
  <div class="hr-create-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-info">
          <h1 class="page-title">📝 新建人力资源记录</h1>
          <p class="page-subtitle">录入完整的员工信息，支持多步骤填写</p>
        </div>
      </div>
      <div class="header-right">
        <el-button @click="handleSaveDraft" :loading="savingDraft">
          <el-icon><Document /></el-icon> 保存草稿
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          <el-icon><Check /></el-icon> 提交审核
        </el-button>
      </div>
    </div>

    <!-- 步骤条 -->
    <el-card class="step-card" shadow="hover">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="基本信息" description="个人基本信息" icon="User" />
        <el-step title="工作信息" description="职位与部门" icon="Briefcase" />
        <el-step title="合同信息" description="合同与薪资" icon="Files" />
        <el-step title="证件信息" description="证件与签证" icon="Document" />
        <el-step title="教育经历" description="学历与培训" icon="Reading" />
        <el-step title="家庭成员" description="家庭信息" icon="HomeFilled" />
      </el-steps>
    </el-card>

    <!-- 表单内容 -->
    <el-card class="form-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="130px"
        label-position="right"
        size="default"
      >
        <!-- ========== 步骤1: 基本信息 ========== -->
        <div v-show="activeStep === 0" class="step-content">
          <div class="step-header">
            <h3><el-icon><User /></el-icon> 基本信息</h3>
            <span class="step-required">* 为必填项</span>
          </div>
          <el-divider />

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="员工编号" prop="employeeNo">
                <el-input
                  v-model="formData.employeeNo"
                  placeholder="自动生成或手动输入"
                  :disabled="autoGenerateNo"
                >
                  <template #append>
                    <el-button @click="generateEmployeeNo" size="small">
                      生成
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="formData.name" placeholder="请输入员工姓名" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="formData.gender">
                  <el-radio label="男">👨 男</el-radio>
                  <el-radio label="女">👩 女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="出生日期" prop="birthDate">
                <el-date-picker
                  v-model="formData.birthDate"
                  type="date"
                  placeholder="选择出生日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="国籍" prop="nationality">
                <el-select v-model="formData.nationality" placeholder="请选择国籍" style="width: 100%" filterable>
                  <el-option label="沙特阿拉伯" value="沙特阿拉伯" />
                  <el-option label="埃及" value="埃及" />
                  <el-option label="约旦" value="约旦" />
                  <el-option label="阿联酋" value="阿联酋" />
                  <el-option label="科威特" value="科威特" />
                  <el-option label="卡塔尔" value="卡塔尔" />
                  <el-option label="阿曼" value="阿曼" />
                  <el-option label="巴林" value="巴林" />
                  <el-option label="也门" value="也门" />
                  <el-option label="叙利亚" value="叙利亚" />
                  <el-option label="黎巴嫩" value="黎巴嫩" />
                  <el-option label="巴基斯坦" value="巴基斯坦" />
                  <el-option label="印度" value="印度" />
                  <el-option label="菲律宾" value="菲律宾" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="身份证/Iqama" prop="idNumber">
                <el-input v-model="formData.idNumber" placeholder="请输入身份证或Iqama号码" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="formData.phone" placeholder="请输入联系电话" clearable>
                  <template #prepend>
                    <el-select v-model="formData.phoneCode" style="width: 80px">
                      <el-option label="+966" value="+966" />
                      <el-option label="+971" value="+971" />
                      <el-option label="+20" value="+20" />
                      <el-option label="+962" value="+962" />
                      <el-option label="+92" value="+92" />
                      <el-option label="+91" value="+91" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="formData.email" placeholder="请输入邮箱地址" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="婚姻状况" prop="maritalStatus">
                <el-select v-model="formData.maritalStatus" placeholder="请选择婚姻状况" style="width: 100%">
                  <el-option label="未婚" value="未婚" />
                  <el-option label="已婚" value="已婚" />
                  <el-option label="离异" value="离异" />
                  <el-option label="丧偶" value="丧偶" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="宗教信仰" prop="religion">
                <el-select v-model="formData.religion" placeholder="请选择宗教信仰" style="width: 100%">
                  <el-option label="伊斯兰教" value="伊斯兰教" />
                  <el-option label="基督教" value="基督教" />
                  <el-option label="佛教" value="佛教" />
                  <el-option label="其他" value="其他" />
                  <el-option label="无" value="无" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="现住址" prop="address">
                <el-input
                  v-model="formData.address"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入详细住址"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="紧急联系人" prop="emergencyContact">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-input v-model="formData.emergencyName" placeholder="联系人姓名" clearable />
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="formData.emergencyPhone" placeholder="联系电话" clearable />
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="formData.emergencyRelation" placeholder="关系" clearable />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- ========== 步骤2: 工作信息 ========== -->
        <div v-show="activeStep === 1" class="step-content">
          <div class="step-header">
            <h3><el-icon><Briefcase /></el-icon> 工作信息</h3>
            <span class="step-required">* 为必填项</span>
          </div>
          <el-divider />

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="所属部门" prop="department">
                <el-select v-model="formData.department" placeholder="请选择部门" style="width: 100%" filterable>
                  <el-option label="销售部" value="销售部" />
                  <el-option label="采购部" value="采购部" />
                  <el-option label="财务部" value="财务部" />
                  <el-option label="运营部" value="运营部" />
                  <el-option label="技术部" value="技术部" />
                  <el-option label="人力资源部" value="人力资源部" />
                  <el-option label="市场部" value="市场部" />
                  <el-option label="行政部" value="行政部" />
                  <el-option label="后勤部" value="后勤部" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="职位名称" prop="position">
                <el-input v-model="formData.position" placeholder="请输入职位名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="职级" prop="jobLevel">
                <el-select v-model="formData.jobLevel" placeholder="请选择职级" style="width: 100%">
                  <el-option label="高管" value="高管" />
                  <el-option label="经理级" value="经理级" />
                  <el-option label="主管级" value="主管级" />
                  <el-option label="员工级" value="员工级" />
                  <el-option label="实习生" value="实习生" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="入职日期" prop="hireDate">
                <el-date-picker
                  v-model="formData.hireDate"
                  type="date"
                  placeholder="选择入职日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="转正日期" prop="probationEndDate">
                <el-date-picker
                  v-model="formData.probationEndDate"
                  type="date"
                  placeholder="选择转正日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="工作状态" prop="status">
                <el-select v-model="formData.status" placeholder="请选择工作状态" style="width: 100%">
                  <el-option label="在职" value="active" />
                  <el-option label="试用期" value="probation" />
                  <el-option label="待入职" value="pending" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="直属上级" prop="supervisor">
                <el-select v-model="formData.supervisor" placeholder="请选择直属上级" style="width: 100%" filterable>
                  <el-option label="Ahmed Al-Fahd" value="Ahmed Al-Fahd" />
                  <el-option label="Mohammed Al-Qahtani" value="Mohammed Al-Qahtani" />
                  <el-option label="Saud Al-Otaibi" value="Saud Al-Otaibi" />
                  <el-option label="Faisal Al-Dossary" value="Faisal Al-Dossary" />
                  <el-option label="Nasser Al-Harbi" value="Nasser Al-Harbi" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="工作地点" prop="workLocation">
                <el-select v-model="formData.workLocation" placeholder="请选择工作地点" style="width: 100%">
                  <el-option label="利雅得总部" value="利雅得总部" />
                  <el-option label="吉达分部" value="吉达分部" />
                  <el-option label="达曼分部" value="达曼分部" />
                  <el-option label="麦加分部" value="麦加分部" />
                  <el-option label="麦地那分部" value="麦地那分部" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="工作邮箱" prop="workEmail">
                <el-input v-model="formData.workEmail" placeholder="请输入工作邮箱" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="工作备注" prop="workRemark">
                <el-input
                  v-model="formData.workRemark"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入工作相关备注"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- ========== 步骤3: 合同信息 ========== -->
        <div v-show="activeStep === 2" class="step-content">
          <div class="step-header">
            <h3><el-icon><Files /></el-icon> 合同信息</h3>
            <span class="step-required">* 为必填项</span>
          </div>
          <el-divider />

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="合同编号" prop="contractNo">
                <el-input v-model="formData.contractNo" placeholder="请输入合同编号" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="合同类型" prop="contractType">
                <el-select v-model="formData.contractType" placeholder="请选择合同类型" style="width: 100%">
                  <el-option label="全职合同" value="全职" />
                  <el-option label="兼职合同" value="兼职" />
                  <el-option label="实习合同" value="实习" />
                  <el-option label="顾问合同" value="顾问" />
                  <el-option label="项目合同" value="项目" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="合同期限" prop="contractDuration">
                <el-select v-model="formData.contractDuration" placeholder="请选择合同期限" style="width: 100%">
                  <el-option label="1年" value="1年" />
                  <el-option label="2年" value="2年" />
                  <el-option label="3年" value="3年" />
                  <el-option label="5年" value="5年" />
                  <el-option label="无限期" value="无限期" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="生效日期" prop="contractStartDate">
                <el-date-picker
                  v-model="formData.contractStartDate"
                  type="date"
                  placeholder="选择生效日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="到期日期" prop="contractEndDate">
                <el-date-picker
                  v-model="formData.contractEndDate"
                  type="date"
                  placeholder="选择到期日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="试用期(月)" prop="probationPeriod">
                <el-input-number
                  v-model="formData.probationPeriod"
                  :min="0"
                  :max="6"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="基本薪资" prop="basicSalary">
                <el-input-number
                  v-model="formData.basicSalary"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="请输入基本薪资"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="津贴" prop="allowance">
                <el-input-number
                  v-model="formData.allowance"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="请输入津贴"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="奖金/佣金" prop="bonus">
                <el-input-number
                  v-model="formData.bonus"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="请输入奖金"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="薪资周期" prop="payCycle">
                <el-select v-model="formData.payCycle" placeholder="请选择薪资周期" style="width: 100%">
                  <el-option label="月薪" value="月薪" />
                  <el-option label="周薪" value="周薪" />
                  <el-option label="时薪" value="时薪" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="银行名称" prop="bankName">
                <el-select v-model="formData.bankName" placeholder="请选择银行" style="width: 100%" filterable>
                  <el-option label="沙特国家银行" value="沙特国家银行" />
                  <el-option label="利雅得银行" value="利雅得银行" />
                  <el-option label="拉吉希银行" value="拉吉希银行" />
                  <el-option label="沙特英国银行" value="沙特英国银行" />
                  <el-option label="阿拉伯银行" value="阿拉伯银行" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="银行账号" prop="bankAccount">
                <el-input v-model="formData.bankAccount" placeholder="请输入银行账号" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="合同备注" prop="contractRemark">
                <el-input
                  v-model="formData.contractRemark"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入合同相关备注"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- ========== 步骤4: 证件信息 ========== -->
        <div v-show="activeStep === 3" class="step-content">
          <div class="step-header">
            <h3><el-icon><Document /></el-icon> 证件信息</h3>
            <span class="step-required">* 为必填项</span>
          </div>
          <el-divider />

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="护照号码" prop="passportNumber">
                <el-input v-model="formData.passportNumber" placeholder="请输入护照号码" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="护照签发国" prop="passportCountry">
                <el-input v-model="formData.passportCountry" placeholder="请输入护照签发国" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="护照有效期" prop="passportExpiry">
                <el-date-picker
                  v-model="formData.passportExpiry"
                  type="date"
                  placeholder="选择护照有效期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Iqama号码" prop="iqamaNumber">
                <el-input v-model="formData.iqamaNumber" placeholder="请输入Iqama号码" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Iqama签发日期" prop="iqamaIssueDate">
                <el-date-picker
                  v-model="formData.iqamaIssueDate"
                  type="date"
                  placeholder="选择Iqama签发日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="Iqama有效期" prop="iqamaExpiry">
                <el-date-picker
                  v-model="formData.iqamaExpiry"
                  type="date"
                  placeholder="选择Iqama有效期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="驾照号码" prop="drivingLicense">
                <el-input v-model="formData.drivingLicense" placeholder="请输入驾照号码" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="驾照有效期" prop="drivingLicenseExpiry">
                <el-date-picker
                  v-model="formData.drivingLicenseExpiry"
                  type="date"
                  placeholder="选择驾照有效期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="签证信息" prop="visaInfo">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-select v-model="formData.visaType" placeholder="签证类型" style="width: 100%" clearable>
                      <el-option label="工作签证" value="工作签证" />
                      <el-option label="商务签证" value="商务签证" />
                      <el-option label="访问签证" value="访问签证" />
                      <el-option label="居留签证" value="居留签证" />
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="formData.visaNumber" placeholder="签证号码" clearable />
                  </el-col>
                  <el-col :span="8">
                    <el-date-picker
                      v-model="formData.visaExpiry"
                      type="date"
                      placeholder="签证有效期"
                      style="width: 100%"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- ========== 步骤5: 教育经历 ========== -->
        <div v-show="activeStep === 4" class="step-content">
          <div class="step-header">
            <h3><el-icon><Reading /></el-icon> 教育经历</h3>
            <el-button type="primary" size="small" @click="addEducation">
              <el-icon><Plus /></el-icon> 添加教育经历
            </el-button>
          </div>
          <el-divider />

          <div v-for="(edu, index) in formData.educations" :key="index" class="education-item">
            <div class="education-header">
              <span class="edu-index">#{{ index + 1 }}</span>
              <el-button type="danger" size="small" link @click="removeEducation(index)">
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </div>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item :label="'学校名称'" :prop="'educations.' + index + '.school'">
                  <el-input v-model="edu.school" placeholder="请输入学校名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item :label="'专业'" :prop="'educations.' + index + '.major'">
                  <el-input v-model="edu.major" placeholder="请输入专业" clearable />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item :label="'学位'" :prop="'educations.' + index + '.degree'">
                  <el-select v-model="edu.degree" placeholder="请选择学位" style="width: 100%">
                    <el-option label="博士" value="博士" />
                    <el-option label="硕士" value="硕士" />
                    <el-option label="本科" value="本科" />
                    <el-option label="大专" value="大专" />
                    <el-option label="高中" value="高中" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item :label="'毕业年份'" :prop="'educations.' + index + '.year'">
                  <el-input-number
                    v-model="edu.year"
                    :min="1970"
                    :max="new Date().getFullYear()"
                    controls-position="right"
                    style="width: 100%"
                    placeholder="年份"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-empty v-if="formData.educations.length === 0" description="暂无教育经历，点击上方按钮添加" :image-size="80" />
        </div>

        <!-- ========== 步骤6: 家庭成员 ========== -->
        <div v-show="activeStep === 5" class="step-content">
          <div class="step-header">
            <h3><el-icon><HomeFilled /></el-icon> 家庭成员</h3>
            <el-button type="primary" size="small" @click="addFamilyMember">
              <el-icon><Plus /></el-icon> 添加家庭成员
            </el-button>
          </div>
          <el-divider />

          <div v-for="(member, index) in formData.familyMembers" :key="index" class="family-item">
            <div class="family-header">
              <span class="family-index">#{{ index + 1 }}</span>
              <el-button type="danger" size="small" link @click="removeFamilyMember(index)">
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </div>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item :label="'姓名'" :prop="'familyMembers.' + index + '.name'">
                  <el-input v-model="member.name" placeholder="请输入姓名" clearable />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item :label="'关系'" :prop="'familyMembers.' + index + '.relation'">
                  <el-select v-model="member.relation" placeholder="请选择关系" style="width: 100%">
                    <el-option label="配偶" value="配偶" />
                    <el-option label="子女" value="子女" />
                    <el-option label="父亲" value="父亲" />
                    <el-option label="母亲" value="母亲" />
                    <el-option label="兄弟" value="兄弟" />
                    <el-option label="姐妹" value="姐妹" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item :label="'联系电话'" :prop="'familyMembers.' + index + '.phone'">
                  <el-input v-model="member.phone" placeholder="请输入联系电话" clearable />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item :label="'职业'" :prop="'familyMembers.' + index + '.occupation'">
                  <el-input v-model="member.occupation" placeholder="请输入职业" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-empty v-if="formData.familyMembers.length === 0" description="暂无家庭成员，点击上方按钮添加" :image-size="80" />
        </div>
      </el-form>
    </el-card>

    <!-- 底部操作栏 -->
    <div class="form-actions">
      <div class="actions-left">
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon> 取消
        </el-button>
        <el-button @click="handleSaveDraft" :loading="savingDraft">
          <el-icon><Document /></el-icon> 保存草稿
        </el-button>
      </div>
      <div class="actions-right">
        <el-button @click="prevStep" :disabled="activeStep === 0">
          <el-icon><ArrowLeft /></el-icon> 上一步
        </el-button>
        <el-button type="primary" @click="nextStep" v-if="activeStep < 5">
          下一步 <el-icon><ArrowRight /></el-icon>
        </el-button>
        <el-button type="success" @click="handleSubmit" :loading="submitting" v-if="activeStep === 5">
          <el-icon><Check /></el-icon> 提交审核
        </el-button>
      </div>
    </div>

    <!-- 提交成功对话框 -->
    <el-dialog v-model="showSuccessDialog" title="🎉 提交成功" width="420px" :close-on-click-modal="false">
      <div class="success-content">
        <el-icon class="success-icon" :size="64"><CircleCheck /></el-icon>
        <h3>人力资源记录已提交</h3>
        <p>员工 <strong>{{ formData.name }}</strong> 的信息已成功提交审核</p>
        <p class="success-id">记录编号: {{ submittedId || 'HR-2026-001' }}</p>
        <el-alert type="info" :closable="false" show-icon>
          <template #title>
            审核流程已启动，预计 1-3 个工作日内完成审批
          </template>
        </el-alert>
      </div>
      <template #footer>
        <el-button @click="showSuccessDialog = false">继续填写</el-button>
        <el-button type="primary" @click="handleViewDetail">查看详情</el-button>
        <el-button type="success" @click="handleCreateAnother">新建另一个</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import {
  ArrowLeft, ArrowRight, User, Briefcase, Files, Document, Reading,
  HomeFilled, Plus, Delete, Check, CircleCheck, Document as DocIcon,
  Edit, Search, Clock, Warning, InformationFilled, Calendar,
  Phone, Message, Location, OfficeBuilding, Setting, Money,
  Grid, Promotion, Tickets, DataLine, UserFilled, Service,
  School, Medal, Crown, Notebook, FolderOpened
} from '@element-plus/icons-vue'

// ==================== Router ====================
const router = useRouter()

// ==================== 引用 ====================
const formRef = ref<FormInstance>()
const activeStep = ref(0)
const submitting = ref(false)
const savingDraft = ref(false)
const autoGenerateNo = ref(true)
const showSuccessDialog = ref(false)
const submittedId = ref('')

// ==================== 表单数据 ====================
const formData = reactive({
  // 基本信息
  employeeNo: '',
  name: '',
  gender: '男',
  birthDate: '',
  nationality: '沙特阿拉伯',
  idNumber: '',
  phone: '',
  phoneCode: '+966',
  email: '',
  maritalStatus: '未婚',
  religion: '伊斯兰教',
  address: '',
  emergencyName: '',
  emergencyPhone: '',
  emergencyRelation: '',

  // 工作信息
  department: '',
  position: '',
  jobLevel: '员工级',
  hireDate: '',
  probationEndDate: '',
  status: 'probation',
  supervisor: '',
  workLocation: '利雅得总部',
  workEmail: '',
  workRemark: '',

  // 合同信息
  contractNo: '',
  contractType: '全职',
  contractDuration: '2年',
  contractStartDate: '',
  contractEndDate: '',
  probationPeriod: 3,
  basicSalary: 0,
  allowance: 0,
  bonus: 0,
  payCycle: '月薪',
  bankName: '',
  bankAccount: '',
  contractRemark: '',

  // 证件信息
  passportNumber: '',
  passportCountry: '',
  passportExpiry: '',
  iqamaNumber: '',
  iqamaIssueDate: '',
  iqamaExpiry: '',
  drivingLicense: '',
  drivingLicenseExpiry: '',
  visaType: '',
  visaNumber: '',
  visaExpiry: '',

  // 教育经历
  educations: [] as Education[],

  // 家庭成员
  familyMembers: [] as FamilyMember[]
})

// ==================== 类型定义 ====================
interface Education {
  school: string
  major: string
  degree: string
  year: number | null
}

interface FamilyMember {
  name: string
  relation: string
  phone: string
  occupation: string
}

// ==================== 表单验证规则 ====================
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '姓名长度应在2-50字符之间', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birthDate: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  nationality: [{ required: true, message: '请选择国籍', trigger: 'change' }],
  idNumber: [
    { required: true, message: '请输入身份证/Iqama号码', trigger: 'blur' },
    { min: 6, max: 20, message: '证件号码长度应在6-20字符之间', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^[0-9\s\-+()]{8,20}$/, message: '请输入有效的电话号码', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  address: [{ required: true, message: '请输入住址', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  position: [
    { required: true, message: '请输入职位名称', trigger: 'blur' },
    { min: 2, max: 30, message: '职位名称长度应在2-30字符之间', trigger: 'blur' }
  ],
  hireDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择工作状态', trigger: 'change' }],
  supervisor: [{ required: true, message: '请选择直属上级', trigger: 'change' }],
  contractType: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
  contractStartDate: [{ required: true, message: '请选择合同生效日期', trigger: 'change' }],
  basicSalary: [
    { required: true, message: '请输入基本薪资', trigger: 'blur' },
    { type: 'number', min: 0, message: '薪资必须大于等于0', trigger: 'blur' }
  ],
  iqamaNumber: [
    { pattern: /^[A-Za-z0-9\-]{6,20}$/, message: '请输入有效的Iqama号码', trigger: 'blur' }
  ]
}

// ==================== 方法 ====================
// 生成员工编号
const generateEmployeeNo = () => {
  const year = new Date().getFullYear().toString().slice(-2)
  const count = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  formData.employeeNo = `EMP-${year}-${count}`
  ElMessage.success(`已生成编号: ${formData.employeeNo}`)
}

// 添加上一步
const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

// 下一步
const nextStep = async () => {
  // 验证当前步骤
  const stepFields = getStepFields(activeStep.value)
  if (stepFields.length > 0) {
    try {
      await formRef.value?.validateFields(stepFields)
      if (activeStep.value < 5) {
        activeStep.value++
      }
    } catch (error) {
      ElMessage.warning('请完善当前步骤的必填信息')
    }
  } else {
    if (activeStep.value < 5) {
      activeStep.value++
    }
  }
}

// 获取当前步骤的字段
const getStepFields = (step: number): string[] => {
  const fieldMap: Record<number, string[]> = {
    0: ['name', 'gender', 'birthDate', 'nationality', 'idNumber', 'phone', 'address'],
    1: ['department', 'position', 'hireDate', 'status', 'supervisor'],
    2: ['contractType', 'contractStartDate', 'basicSalary'],
    3: [],
    4: [],
    5: []
  }
  return fieldMap[step] || []
}

// 添加教育经历
const addEducation = () => {
  formData.educations.push({
    school: '',
    major: '',
    degree: '本科',
    year: null
  })
}

// 删除教育经历
const removeEducation = (index: number) => {
  formData.educations.splice(index, 1)
}

// 添加家庭成员
const addFamilyMember = () => {
  formData.familyMembers.push({
    name: '',
    relation: '配偶',
    phone: '',
    occupation: ''
  })
}

// 删除家庭成员
const removeFamilyMember = (index: number) => {
  formData.familyMembers.splice(index, 1)
}

// 保存草稿
const handleSaveDraft = async () => {
  savingDraft.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    localStorage.setItem('hr_draft_data', JSON.stringify(formData))
    ElMessage.success('草稿已保存')
  } catch (error) {
    ElMessage.error('保存草稿失败')
  } finally {
    savingDraft.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true

    // 模拟提交API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 生成提交ID
    submittedId.value = `HR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`

    ElMessage.success('提交成功！')
    showSuccessDialog.value = true

    // 清除草稿
    localStorage.removeItem('hr_draft_data')

  } catch (error) {
    ElMessage.error('提交失败，请检查表单')
  } finally {
    submitting.value = false
  }
}

// 查看详情
const handleViewDetail = () => {
  showSuccessDialog.value = false
  router.push(`/hr/detail/${submittedId.value}`)
}

// 创建另一个
const handleCreateAnother = () => {
  showSuccessDialog.value = false
  // 重置表单
  Object.assign(formData, {
    employeeNo: '',
    name: '',
    gender: '男',
    birthDate: '',
    nationality: '沙特阿拉伯',
    idNumber: '',
    phone: '',
    phoneCode: '+966',
    email: '',
    maritalStatus: '未婚',
    religion: '伊斯兰教',
    address: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    department: '',
    position: '',
    jobLevel: '员工级',
    hireDate: '',
    probationEndDate: '',
    status: 'probation',
    supervisor: '',
    workLocation: '利雅得总部',
    workEmail: '',
    workRemark: '',
    contractNo: '',
    contractType: '全职',
    contractDuration: '2年',
    contractStartDate: '',
    contractEndDate: '',
    probationPeriod: 3,
    basicSalary: 0,
    allowance: 0,
    bonus: 0,
    payCycle: '月薪',
    bankName: '',
    bankAccount: '',
    contractRemark: '',
    passportNumber: '',
    passportCountry: '',
    passportExpiry: '',
    iqamaNumber: '',
    iqamaIssueDate: '',
    iqamaExpiry: '',
    drivingLicense: '',
    drivingLicenseExpiry: '',
    visaType: '',
    visaNumber: '',
    visaExpiry: '',
    educations: [],
    familyMembers: []
  })
  activeStep.value = 0
  generateEmployeeNo()
  ElMessage.success('已重置表单，可继续创建')
}

// 返回
const handleBack = () => {
  if (formData.name || formData.phone || formData.department) {
    ElMessageBox.confirm('有未保存的数据，确定要离开吗？', '提示', {
      confirmButtonText: '确定离开',
      cancelButtonText: '继续填写',
      type: 'warning'
    }).then(() => {
      router.push('/hr')
    }).catch(() => {})
  } else {
    router.push('/hr')
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 生成默认员工编号
  generateEmployeeNo()

  // 恢复草稿
  const draft = localStorage.getItem('hr_draft_data')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      ElMessageBox.confirm('发现未完成的草稿，是否恢复？', '草稿恢复', {
        confirmButtonText: '恢复草稿',
        cancelButtonText: '丢弃草稿',
        type: 'info'
      }).then(() => {
        Object.assign(formData, draftData)
        ElMessage.success('草稿已恢复')
      }).catch(() => {
        localStorage.removeItem('hr_draft_data')
      })
    } catch (error) {
      localStorage.removeItem('hr_draft_data')
    }
  }
})
</script>

<style scoped>
/* ==================== 全局容器 ==================== */
.hr-create-page {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* ==================== 页面头部 ==================== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  padding: 8px 16px;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
}

.page-subtitle {
  margin: 2px 0 0 0;
  color: #909399;
  font-size: 13px;
}

.header-right {
  display: flex;
  gap: 8px;
}

/* ==================== 步骤条 ==================== */
.step-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.step-card :deep(.el-step__title) {
  font-size: 13px;
}

.step-card :deep(.el-step__description) {
  font-size: 11px;
}

/* ==================== 表单卡片 ==================== */
.form-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.step-content {
  padding: 8px 4px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.step-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-required {
  font-size: 12px;
  color: #F56C6C;
}

/* ==================== 教育经历 ==================== */
.education-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.edu-index {
  font-weight: 600;
  color: #409EFF;
  font-size: 14px;
}

/* ==================== 家庭成员 ==================== */
.family-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
}

.family-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.family-index {
  font-weight: 600;
  color: #67C23A;
  font-size: 14px;
}

/* ==================== 底部操作栏 ==================== */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
  gap: 12px;
  position: sticky;
  bottom: 0;
  z-index: 100;
  margin-top: -10px;
}

.actions-left,
.actions-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ==================== 成功对话框 ==================== */
.success-content {
  text-align: center;
  padding: 16px 0;
}

.success-icon {
  color: #67C23A;
  margin-bottom: 16px;
}

.success-content h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #303133;
}

.success-content p {
  margin: 4px 0;
  color: #606266;
}

.success-id {
  font-size: 14px;
  color: #409EFF;
  font-weight: 600;
  background: #ecf5ff;
  padding: 4px 16px;
  border-radius: 4px;
  display: inline-block;
  margin: 8px 0 !important;
}

.success-content .el-alert {
  margin-top: 16px;
  text-align: left;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .hr-create-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left {
    width: 100%;
  }

  .header-right {
    width: 100%;
    justify-content: flex-start;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-left,
  .actions-right {
    justify-content: center;
  }

  .actions-right .el-button {
    flex: 1;
  }

  .step-card :deep(.el-step) {
    padding: 0 4px;
  }

  .step-card :deep(.el-step__title) {
    font-size: 11px;
  }

  .step-card :deep(.el-step__description) {
    display: none;
  }

  .education-item,
  .family-item {
    padding: 12px 14px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }

  .form-actions {
    padding: 12px 16px;
  }

  .actions-left .el-button,
  .actions-right .el-button {
    font-size: 13px;
    padding: 8px 12px;
  }

  .step-header h3 {
    font-size: 16px;
  }
}

/* ==================== 打印样式 ==================== */
@media print {
  .hr-create-page {
    background: white;
    padding: 16px;
  }

  .form-actions,
  .header-right,
  .back-btn {
    display: none !important;
  }

  .step-card :deep(.el-step__icon) {
    display: none;
  }

  .page-subtitle {
    color: #303133 !important;
  }
}
</style>