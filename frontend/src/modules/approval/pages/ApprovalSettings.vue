<!-- 
  文件路径: frontend/src/modules/approval/pages/ApprovalSettings.vue
  功能: 审批设置 - 审批系统设置
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>审批设置</h2>
          <p class="subtitle">审批系统配置</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本设置" name="basic">
          <el-form :model="basicSettings" label-width="180px">
            <el-form-item label="审批超时提醒">
              <el-switch v-model="basicSettings.timeoutReminder" />
              <span style="margin-left: 12px; color: #909399;">开启后将在审批超时前发送提醒</span>
            </el-form-item>
            <el-form-item label="超时天数" v-if="basicSettings.timeoutReminder">
              <el-input-number v-model="basicSettings.timeoutDays" :min="1" :max="30" controls-position="right" />
              <span style="margin-left: 12px; color: #909399;">天</span>
            </el-form-item>
            <el-form-item label="审批人可驳回">
              <el-switch v-model="basicSettings.allowReject" />
            </el-form-item>
            <el-form-item label="驳回后重新审批">
              <el-switch v-model="basicSettings.reapproveAfterReject" />
            </el-form-item>
            <el-form-item label="自动通过金额下限">
              <el-input-number v-model="basicSettings.autoApproveLimit" :min="0" :precision="2" controls-position="right" style="width: 200px;" />
              <span style="margin-left: 12px; color: #909399;">SAR</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="通知设置" name="notification">
          <el-form :model="notificationSettings" label-width="180px">
            <el-form-item label="审批提交通知">
              <el-switch v-model="notificationSettings.onSubmit" />
            </el-form-item>
            <el-form-item label="审批结果通知">
              <el-switch v-model="notificationSettings.onResult" />
            </el-form-item>
            <el-form-item label="超时提醒通知">
              <el-switch v-model="notificationSettings.onTimeout" />
            </el-form-item>
            <el-form-item label="通知方式">
              <el-checkbox-group v-model="notificationSettings.methods">
                <el-checkbox label="email">邮件</el-checkbox>
                <el-checkbox label="sms">短信</el-checkbox>
                <el-checkbox label="app">系统内通知</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="审批人规则" name="rules">
          <el-form :model="ruleSettings" label-width="180px">
            <el-form-item label="审批人自动分配">
              <el-switch v-model="ruleSettings.autoAssign" />
            </el-form-item>
            <el-form-item label="审批人选择策略" v-if="ruleSettings.autoAssign">
              <el-radio-group v-model="ruleSettings.assignStrategy">
                <el-radio label="round_robin">轮询</el-radio>
                <el-radio label="least_work">最少工作量</el-radio>
                <el-radio label="random">随机</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="允许委托审批">
              <el-switch v-model="ruleSettings.allowDelegate" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')

const basicSettings = reactive({
  timeoutReminder: true,
  timeoutDays: 3,
  allowReject: true,
  reapproveAfterReject: true,
  autoApproveLimit: 5000,
})

const notificationSettings = reactive({
  onSubmit: true,
  onResult: true,
  onTimeout: true,
  methods: ['email', 'app'],
})

const ruleSettings = reactive({
  autoAssign: true,
  assignStrategy: 'round_robin',
  allowDelegate: true,
})

const handleSave = () => { ElMessage.success('审批设置已保存') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
:deep(.el-tabs__content) { padding-top: 20px; }
</style>