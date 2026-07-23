<template>
  <div class="purchase-index">
    <div class="page-header">
      <h1>🛒 采购管理</h1>
      <p class="subtitle">采购流程全生命周期管理</p>
    </div>
    
    <div class="stats-row">
      <div class="stat-item" v-for="stat in stats" :key="stat.label">
        <div class="stat-number">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <div class="purchase-modules">
      <div class="module-card" v-for="mod in modules" :key="mod.name">
        <div class="module-icon">{{ mod.icon }}</div>
        <h3>{{ mod.name }}</h3>
        <p>{{ mod.desc }}</p>
        <el-button type="primary" size="small" @click="navigateTo(mod.route)">
          进入
        </el-button>
      </div>
    </div>

    <div class="recent-orders">
      <h3>最近采购订单</h3>
      <el-table :data="recentOrders" style="width: 100%" size="small">
        <el-table-column prop="id" label="订单号" width="120" />
        <el-table-column prop="supplier" label="供应商" />
        <el-table-column prop="amount" label="金额" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="120" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseIndex',
  data() {
    return {
      stats: [
        { label: '待审批订单', value: '12' },
        { label: '进行中订单', value: '34' },
        { label: '已完成订单', value: '89' },
        { label: '本月采购总额', value: '¥456,789' }
      ],
      modules: [
        { name: '采购申请', icon: '📋', desc: '创建采购申请单', route: '/purchase/requests' },
        { name: '采购订单', icon: '📄', desc: '管理采购订单', route: '/purchase/list' },
        { name: '供应商管理', icon: '🏢', desc: '供应商信息维护', route: '/purchase/suppliers' },
        { name: '采购分析', icon: '📊', desc: '采购数据分析', route: '/purchase/analysis' }
      ],
      recentOrders: [
        { id: 'PO-2026-001', supplier: '宏远科技', amount: '¥12,800', status: '已完成', date: '2026-07-22' },
        { id: 'PO-2026-002', supplier: '瑞丰商贸', amount: '¥8,500', status: '待审核', date: '2026-07-22' },
        { id: 'PO-2026-003', supplier: '华信电子', amount: '¥23,400', status: '进行中', date: '2026-07-21' }
      ]
    }
  },
  methods: {
    navigateTo(route) {
      this..push(route)
    }
  }
}
</script>

<style scoped>
.purchase-index {
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
}
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}
.stat-item {
  text-align: center;
}
.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
}
.stat-label {
  color: #7f8c8d;
  font-size: 13px;
  margin-top: 4px;
}
.purchase-modules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.module-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-align: center;
}
.module-icon {
  font-size: 36px;
  margin-bottom: 10px;
}
.module-card h3 {
  color: #2c3e50;
  margin-bottom: 6px;
}
.module-card p {
  color: #7f8c8d;
  font-size: 13px;
  margin-bottom: 12px;
}
.recent-orders {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.recent-orders h3 {
  color: #2c3e50;
  margin-bottom: 16px;
}
</style>
