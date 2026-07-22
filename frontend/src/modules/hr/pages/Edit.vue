<!--
  文件路径: frontend/src/modules/hr/pages/Edit.vue
  功能: 编辑HR记录 - 修改员工档案信息
  包含: 多标签编辑、表单验证、草稿保存、变更历史
-->

<template>
  <div class="hr-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-info">
          <h1 class="page-title">✏️ 编辑员工档案</h1>
          <p class="page-subtitle">修改员工 {{ employeeData.name }} 的信息</p>
        </div>
      </div>
      <div class="header-right">
        <el-button @click="handleSaveDraft" :loading="savingDraft">
          <el-icon><Document /></el-icon> 保存草稿
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          <el-icon><Check /></el-icon> 保存修改
        </el-button>
        <el-button type="danger" @click="handleRevert">
          <el-icon><RefreshLeft /></el-icon> 撤销修改
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <template v-else>
      <!-- 变更状态提示 -->
      <el-alert
        v-if="hasChanges"
        type="warning"
        :closable="false"
        show-icon
        class="change-alert"
      >
        <template #title>
          <span>检测到未保存的修改，请点击「保存修改」按钮提交更改</span>
        </template>
      </el-alert>

      <!-- 主编辑卡片 -->
      <el-card class="edit-card" shadow="hover">
        <el-tabs v-model="activeTab" class="edit-tabs" @tab-change="handleTabChange">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-form
              ref="basicFormRef"
              :model="formData"
              :rules="formRules"
              label-width="130px"
              label-position="right"
            >
              <el-row :gutter="24">
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="员工编号" prop="employeeNo">
                    <el-input v-model="formData.employeeNo" disabled>
                      <template #prepend>
                        <el-tag type="info" size="small">只读</el-tag>
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
            </el-form>
          </el-tab-pane>

          <!-- 工作信息 -->
          <el-tab-pane label="工作信息" name="work">
            <el-form
              ref="workFormRef"
              :model="formData"
              :rules="workRules"
              label-width="130px"
              label-position="right"
            >
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
                      <el-option label="已离职" value="resigned" />
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
                      <el-option label="Abdullah Al-Shammari" value="Abdullah Al-Shammari" />
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
            </el-form>
          </el-tab-pane>

          <!-- 合同与薪资 -->
          <el-tab-pane label="合同与薪资" name="contract">
            <el-form
              ref="contractFormRef"
              :model="formData"
              :rules="contractRules"
              label-width="130px"
              label-position="right"
            >
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
                      <el-option label="阿尔比拉德银行" value="阿尔比拉德银行" />
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
            </el-form>
          </el-tab-pane>

          <!-- 证件信息 -->
          <el-tab-pane label="证件信息" name="documents">
            <el-form
              ref="docFormRef"
              :model="formData"
              label-width="130px"
              label-position="right"
            >
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
            </el-form>
          </el-tab-pane>

          <!-- 教育经历 -->
          <el-tab-pane label="教育经历" name="education">
            <div class="education-actions">
              <el-button type="primary" size="small" @click="addEducation">
                <el-icon><Plus /></el-icon> 添加教育经历
              </el-button>
              <span class="edu-count">共 {{ formData.educations.length }} 条记录</span>
            </div>
            <el-divider />
            <div
              v-for="(edu, index) in formData.educations"
              :key="index"
              class="education-item"
            >
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
            <el-empty v-if="formData.educations.length === 0" description="暂无教育经历" :image-size="80" />
          </el-tab-pane>

          <!-- 家庭成员 -->
          <el-tab-pane label="家庭成员" name="family">
            <div class="family-actions">
              <el-button type="primary" size="small" @click="addFamilyMember">
                <el-icon><Plus /></el-icon> 添加家庭成员
              </el-button>
              <span class="family-count">共 {{ formData.familyMembers.length }} 位成员</span>
            </div>
            <el-divider />
            <div
              v-for="(member, index) in formData.familyMembers"
              :key="index"
              class="family-item"
            >
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
            <el-empty v-if="formData.familyMembers.length === 0" description="暂无家庭成员" :image-size="80" />
          </el-tab-pane>

          <!-- 变更历史 -->
          <el-tab-pane label="变更历史" name="history">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in changeHistory"
                :key="index"
                :timestamp="item.time"
                :type="item.type"
                size="large"
              >
                <div class="history-item">
                  <div class="history-user">{{ item.user }}</div>
                  <div class="history-action">{{ item.action }}</div>
                  <div class="history-detail">
                    <span class="history-old">旧值: {{ item.oldValue }}</span>
                    <span class="history-new">新值: {{ item.newValue }}</span>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 底部操作栏 -->
      <div class="form-actions">
        <div class="actions-left">
          <el-button @click="handleBack">
            <el-icon><ArrowLeft /></el-icon> 取消
          </el-button>
          <el-button type="danger" @click="handleRevert">
            <el-icon><RefreshLeft /></el-icon> 撤销修改
          </el-button>
        </div>
        <div class="actions-right">
          <el-button @click="handleSaveDraft" :loading="savingDraft">
            <el-icon><Document /></el-icon> 保存草稿
          </el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            <el-icon><Check /></el-icon> 保存修改
          </el-button>
        </div>
      </div>
    </template>

    <!-- 保存成功对话框 -->
    <el-dialog v-model="showSuccessDialog" title="✅ 修改成功" width="400px">
      <div class="success-content">
        <el-icon class="success-icon" :size="56"><CircleCheck /></el-icon>
        <h3>员工信息已更新</h3>
        <p>{{ employeeData.name }} 的档案信息已成功保存</p>
        <div class="success-actions">
          <el-button type="primary" @click="showSuccessDialog = false">继续编辑</el-button>
          <el-button @click="handleViewDetail">查看档案</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import {
  ArrowLeft, ArrowRight, User, Briefcase, Files, Document, Reading,
  HomeFilled, Plus, Delete, Check, CircleCheck, Edit, RefreshLeft,
  Search, Clock, Warning, InformationFilled, Calendar, Phone, Message,
  Location, OfficeBuilding, Setting, Money, Grid, Promotion, Tickets,
  DataLine, UserFilled, Service, School, Medal, Crown, Notebook,
  FolderOpened, Refresh, Close, ArrowDown
} from '@element-plus/icons-vue'

// ==================== Router ====================
const route = useRoute()
const router = useRouter()

// ==================== 引用 ====================
const basicFormRef = ref<FormInstance>()
const workFormRef = ref<FormInstance>()
const contractFormRef = ref<FormInstance>()
const docFormRef = ref<FormInstance>()

// ==================== 状态变量 ====================
const loading = ref(true)
const activeTab = ref('basic')
const submitting = ref(false)
const savingDraft = ref(false)
const showSuccessDialog = ref(false)
const hasChanges = ref(false)
const originalData = ref<any>(null)

// ==================== 表单数据 ====================
const formData = reactive({
  id: '1',
  employeeNo: 'EMP-001',
  name: 'Ahmed Al-Fahd',
  gender: '男',
  birthDate: '1985-06-15',
  nationality: '沙特阿拉伯',
  idNumber: 'SA-1234567890',
  phone: '+966 50 123 4567',
  phoneCode: '+966',
  email: 'ahmed@company.com',
  maritalStatus: '已婚',
  religion: '伊斯兰教',
  address: '利雅得 Al Olaya 区 1234 号',
  emergencyName: 'Fatima Al-Fahd',
  emergencyPhone: '+966 50 987 6543',
  emergencyRelation: '妻子',
  department: '销售部',
  position: '销售经理',
  jobLevel: '经理级',
  hireDate: '2020-01-15',
  probationEndDate: '2020-04-15',
  status: 'active',
  supervisor: 'Mohammed Al-Qahtani',
  workLocation: '利雅得总部',
  workEmail: 'ahmed.alfahd@company.com',
  workRemark: '优秀销售业绩，连续两年获得最佳员工奖',
  contractNo: 'CT-2020-001',
  contractType: '全职',
  contractDuration: '无限期',
  contractStartDate: '2020-01-15',
  contractEndDate: '无限期',
  probationPeriod: 3,
  basicSalary: 25000,
  allowance: 3000,
  bonus: 5000,
  payCycle: '月薪',
  bankName: '沙特国家银行',
  bankAccount: 'SA-1234-5678-9012-3456',
  contractRemark: '优秀员工，合同自动续期',
  passportNumber: 'P-123456789',
  passportCountry: '沙特阿拉伯',
  passportExpiry: '2026-06-15',
  iqamaNumber: 'SA-1234567890',
  iqamaIssueDate: '2023-01-15',
  iqamaExpiry: '2025-01-14',
  drivingLicense: 'D-987654321',
  drivingLicenseExpiry: '2025-12-31',
  visaType: '工作签证',
  visaNumber: 'V-123456',
  visaExpiry: '2025-06-15',
  educations: [
    { school: '利雅得大学', major: '工商管理', degree: '学士', year: 2010 },
    { school: '利雅得商学院', major: '市场营销', degree: '硕士', year: 2012 }
  ],
  familyMembers: [
    { name: 'Fatima Al-Fahd', relation: '配偶', phone: '+966 50 987 6543', occupation: '教师' },
    { name: 'Sara Al-Fahd', relation: '子女', phone: '+966 50 111 2222', occupation: '学生' }
  ]
})

// ==================== 员工数据（用于显示） ====================
const employeeData = computed(() => ({
  name: formData.name,
  employeeNo: formData.employeeNo,
  department: formData.department,
  position: formData.position,
  status: formData.status
}))

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
  address: [{ required: true, message: '请输入住址', trigger: 'blur' }]
}

const workRules: FormRules = {
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  position: [
    { required: true, message: '请输入职位名称', trigger: 'blur' },
    { min: 2, max: 30, message: '职位名称长度应在2-30字符之间', trigger: 'blur' }
  ],
  hireDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择工作状态', trigger: 'change' }],
  supervisor: [{ required: true, message: '请选择直属上级', trigger: 'change' }]
}

const contractRules: FormRules = {
  contractType: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
  contractStartDate: [{ required: true, message: '请选择合同生效日期', trigger: 'change' }],
  basicSalary: [
    { required: true, message: '请输入基本薪资', trigger: 'blur' },
    { type: 'number', min: 0, message: '薪资必须大于等于0', trigger: 'blur' }
  ]
}

// ==================== 变更历史 ====================
const changeHistory = ref([
  {
    time: '2026-07-22 10:30',
    user: 'Admin',
    action: '更新基本信息',
    oldValue: '邮箱: ahmed@company.com',
    newValue: '邮箱: ahmed.alfahd@company.com',
    type: 'primary'
  },
  {
    time: '2026-07-20 14:20',
    user: 'HR Manager',
    action: '更新职位',
    oldValue: '销售主管',
    newValue: '销售经理',
    type: 'warning'
  },
  {
    time: '2026-07-15 09:00',
    user: 'Admin',
    action: '更新薪资',
    oldValue: 'SAR 22,000',
    newValue: 'SAR 25,000',
    type: 'success'
  },
  {
    time: '2026-07-10 16:45',
    user: 'HR Manager',
    action: '更新合同',
    oldValue: '合同到期: 2025-01-14',
    newValue: '合同到期: 无限期',
    type: 'info'
  }
])

// ==================== 方法 ====================
// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    await new Promise(resolve => setTimeout(resolve, 600))
    // 保存原始数据副本用于检测变更
    originalData.value = JSON.parse(JSON.stringify(formData))
    ElMessage.success('数据加载成功')
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 检测表单变更
watch(
  formData,
  () => {
    if (originalData.value) {
      const current = JSON.stringify(formData)
      const original = JSON.stringify(originalData.value)
      hasChanges.value = current !== original
    }
  },
  { deep: true, immediate: false }
)

// 添加教育经历
const addEducation = () => {
  formData.educations.push({
    school: '',
    major: '',
    degree: '本科',
    year: null as any
  })
  ElMessage.success('已添加教育经历')
}

// 删除教育经历
const removeEducation = (index: number) => {
  if (formData.educations.length <= 1) {
    ElMessage.warning('至少保留一条教育经历')
    return
  }
  formData.educations.splice(index, 1)
  ElMessage.success('已删除')
}

// 添加家庭成员
const addFamilyMember = () => {
  formData.familyMembers.push({
    name: '',
    relation: '配偶',
    phone: '',
    occupation: ''
  })
  ElMessage.success('已添加家庭成员')
}

// 删除家庭成员
const removeFamilyMember = (index: number) => {
  if (formData.familyMembers.length <= 1) {
    ElMessage.warning('至少保留一位家庭成员')
    return
  }
  formData.familyMembers.splice(index, 1)
  ElMessage.success('已删除')
}

// 切换标签页
const handleTabChange = (tab: string) => {
  // 切换时可以触发一些逻辑
}

// 保存草稿
const handleSaveDraft = async () => {
  savingDraft.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    localStorage.setItem('hr_edit_draft', JSON.stringify(formData))
    ElMessage.success('草稿已保存')
  } catch (error) {
    ElMessage.error('保存草稿失败')
  } finally {
    savingDraft.value = false
  }
}

// 提交修改
const handleSubmit = async () => {
  // 验证所有表单
  try {
    await basicFormRef.value?.validate()
    await workFormRef.value?.validate()
    await contractFormRef.value?.validate()
  } catch (error) {
    ElMessage.warning('请完善所有必填字段')
    return
  }

  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    ElMessage.success('员工信息已成功更新')
    showSuccessDialog.value = true
    originalData.value = JSON.parse(JSON.stringify(formData))
    hasChanges.value = false
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 撤销修改
const handleRevert = () => {
  if (!hasChanges.value) {
    ElMessage.info('没有需要撤销的修改')
    return
  }

  ElMessageBox.confirm('确定要撤销所有未保存的修改吗？', '确认撤销', {
    confirmButtonText: '确定撤销',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (originalData.value) {
      Object.assign(formData, JSON.parse(JSON.stringify(originalData.value)))
      hasChanges.value = false
      ElMessage.success('已撤销所有修改')
    }
  }).catch(() => {})
}

// 查看详情
const handleViewDetail = () => {
  showSuccessDialog.value = false
  const id = route.params.id as string || '1'
  router.push(`/hr/detail/${id}`)
}

// 返回
const handleBack = () => {
  if (hasChanges.value) {
    ElMessageBox.confirm('有未保存的修改，确定要离开吗？', '提示', {
      confirmButtonText: '确定离开',
      cancelButtonText: '继续编辑',
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
  loadData()
  // 恢复草稿
  const draft = localStorage.getItem('hr_edit_draft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      // 检查是否是同一个员工
      if (draftData.id === route.params.id) {
        ElMessageBox.confirm('发现未保存的草稿，是否恢复？', '草稿恢复', {
          confirmButtonText: '恢复草稿',
          cancelButtonText: '丢弃草稿',
          type: 'info'
        }).then(() => {
          Object.assign(formData, draftData)
          originalData.value = JSON.parse(JSON.stringify(formData))
          ElMessage.success('草稿已恢复')
        }).catch(() => {
          localStorage.removeItem('hr_edit_draft')
        })
      }
    } catch (error) {
      localStorage.removeItem('hr_edit_draft')
    }
  }
})
</script>

<style scoped>
/* ==================== 全局容器 ==================== */
.hr-edit-page {
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
  flex-wrap: wrap;
}

/* ==================== 加载状态 ==================== */
.loading-container {
  padding: 40px;
  background: white;
  border-radius: 12px;
}

/* ==================== 变更提示 ==================== */
.change-alert {
  margin-bottom: 20px;
  border-radius: 8px;
}

/* ==================== 编辑卡片 ==================== */
.edit-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.edit-tabs :deep(.el-tabs__content) {
  padding-top: 16px;
}

/* ==================== 教育经历 ==================== */
.education-actions,
.family-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.edu-count,
.family-count {
  font-size: 13px;
  color: #909399;
}

.education-item,
.family-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
}

.education-header,
.family-header {
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

.family-index {
  font-weight: 600;
  color: #67C23A;
  font-size: 14px;
}

/* ==================== 变更历史 ==================== */
.history-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-user {
  font-weight: 600;
  color: #409EFF;
}

.history-action {
  color: #303133;
}

.history-detail {
  display: flex;
  gap: 16px;
  font-size: 13px;
  flex-wrap: wrap;
}

.history-old {
  color: #F56C6C;
}

.history-new {
  color: #67C23A;
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

.success-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .hr-edit-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
  }

  .header-right .el-button {
    flex: 1;
    font-size: 12px;
    padding: 8px 12px;
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

  .edit-tabs :deep(.el-tabs__item) {
    font-size: 13px;
    padding: 0 12px;
  }

  .education-item,
  .family-item {
    padding: 12px 14px;
  }

  .history-detail {
    flex-direction: column;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }

  .page-subtitle {
    font-size: 12px;
  }

  .form-actions {
    padding: 12px 16px;
  }

  .actions-left .el-button,
  .actions-right .el-button {
    font-size: 12px;
    padding: 6px 10px;
  }

  .edit-tabs :deep(.el-tabs__item) {
    font-size: 12px;
    padding: 0 8px;
  }
}

/* ==================== 打印样式 ==================== */
@media print {
  .hr-edit-page {
    background: white;
    padding: 16px;
  }

  .form-actions,
  .header-right,
  .back-btn,
  .change-alert {
    display: none !important;
  }

  .edit-card {
    box-shadow: none !important;
    border: 1px solid #dcdfe6;
  }
}
</style>