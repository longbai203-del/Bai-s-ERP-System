<!-- 
  文件路径: frontend/src/modules/hr/pages/EmployeeProfile.vue
  功能: 员工档案 - 完整员工档案管理
-->

<template>
  <div class="page-container">
    <el-card>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="员工编号">EMP-001</el-descriptions-item>
            <el-descriptions-item label="姓名">Ahmed Al-Fahd</el-descriptions-item>
            <el-descriptions-item label="性别">男</el-descriptions-item>
            <el-descriptions-item label="国籍">沙特阿拉伯</el-descriptions-item>
            <el-descriptions-item label="身份证/Iqama">SA-1234567890</el-descriptions-item>
            <el-descriptions-item label="出生日期">1985-06-15</el-descriptions-item>
            <el-descriptions-item label="婚姻状况">已婚</el-descriptions-item>
            <el-descriptions-item label="联系电话">+966 50 123 4567</el-descriptions-item>
            <el-descriptions-item label="邮箱">ahmed@company.com</el-descriptions-item>
            <el-descriptions-item label="住址" :span="3">利雅得，沙特阿拉伯</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="工作信息" name="work">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="部门">销售部</el-descriptions-item>
            <el-descriptions-item label="职位">销售经理</el-descriptions-item>
            <el-descriptions-item label="入职日期">2020-01-15</el-descriptions-item>
            <el-descriptions-item label="薪资">SAR 25,000</el-descriptions-item>
            <el-descriptions-item label="工作状态">在职</el-descriptions-item>
            <el-descriptions-item label="直属上级">Mohammed Al-Qahtani</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="合同信息" name="contract">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="合同编号">CT-2020-001</el-descriptions-item>
            <el-descriptions-item label="合同类型">全职</el-descriptions-item>
            <el-descriptions-item label="合同期限">无限期</el-descriptions-item>
            <el-descriptions-item label="生效日期">2020-01-15</el-descriptions-item>
            <el-descriptions-item label="到期日期">无限期</el-descriptions-item>
            <el-descriptions-item label="试用期">3个月</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="教育经历" name="education">
          <el-timeline>
            <el-timeline-item timestamp="2010-2014" placement="top">
              <el-card>
                <h4>利雅得大学</h4>
                <p>工商管理学士 - 市场营销专业</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2006-2010" placement="top">
              <el-card>
                <h4>利雅得高中</h4>
                <p>理科</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>

        <el-tab-pane label="证件管理" name="documents">
          <el-table :data="documents" style="width: 100%">
            <el-table-column prop="name" label="证件名称" />
            <el-table-column prop="number" label="证件编号" />
            <el-table-column prop="expiryDate" label="有效期至" />
            <el-table-column label="状态" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === '有效' ? 'success' : 'danger'">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <el-button type="primary" size="small">查看</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('basic')

const documents = ref([
  { name: 'Iqama', number: 'SA-1234567890', expiryDate: '2025-06-15', status: '有效' },
  { name: '护照', number: 'P-123456789', expiryDate: '2026-12-31', status: '有效' },
  { name: '驾驶证', number: 'D-987654321', expiryDate: '2024-12-31', status: '有效' },
])
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
</style>
