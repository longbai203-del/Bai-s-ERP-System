<template>
  <div class="backup-dashboards">
    <div class="page-header">
      <h1>📊 仪表盘备份</h1>
      <p class="subtitle">历史仪表盘备份与恢复管理</p>
      <el-alert
        title="此模块为备份模块，建议将所需仪表盘迁移到正式模块"
        type="warning"
        :closable="false"
        show-icon
      />
    </div>

    <div class="backup-list">
      <el-table :data="backupList" style="width: 100%">
        <el-table-column prop="name" label="仪表盘名称" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="backupDate" label="备份日期" width="160" />
        <el-table-column prop="size" label="大小" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleRestore(row)">恢复</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="backup-actions" style="margin-top: 20px;">
      <el-button type="success" @click="handleBackup">创建新备份</el-button>
      <el-button @click="handleRefresh">刷新列表</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackupDashboardsIndex',
  data() {
    return {
      backupList: [
        { name: '销售仪表盘_20260720', type: '销售', backupDate: '2026-07-20 14:30', size: '2.3 MB' },
        { name: '库存仪表盘_20260719', type: '库存', backupDate: '2026-07-19 10:15', size: '1.8 MB' },
        { name: '财务仪表盘_20260718', type: '财务', backupDate: '2026-07-18 16:45', size: '3.1 MB' },
        { name: 'HR仪表盘_20260717', type: '人力资源', backupDate: '2026-07-17 09:20', size: '1.5 MB' }
      ]
    }
  },
  methods: {
    handleRestore(row) {
      this..success(正在恢复: )
    },
    handleDelete(row) {
      this.(确定要删除  吗？, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this..success('删除成功')
      }).catch(() => {})
    },
    handleBackup() {
      this..success('开始创建新备份...')
    },
    handleRefresh() {
      this..success('已刷新')
    }
  }
}
</script>

<style scoped>
.backup-dashboards {
  padding: 20px;
}
.page-header {
  margin-bottom: 24px;
}
.page-header h1 {
  color: #2c3e50;
  font-size: 28px;
}
.subtitle {
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 12px;
}
.backup-list {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
</style>
