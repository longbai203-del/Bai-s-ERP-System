<template>
  <div class="purchase-dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="stat in stats" :key="stat.title">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>采购趋势</span></template>
          <div id="purchase-trend" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>待处理采购单</span></template>
          <el-table :data="pendingOrders" style="width: 100%;">
            <el-table-column prop="poNo" label="采购单号" />
            <el-table-column prop="supplierName" label="供应商" />
            <el-table-column prop="finalAmount" label="金额" />
            <el-table-column label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status === 'draft' ? 'info' : 'warning'">
                  {{ row.status === 'draft' ? '草稿' : '待审批' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const stats = ref([
  { title: '采购总额', value: '¥567,890', color: '#409EFF' },
  { title: '待审批采购单', value: '12', color: '#E6A23C' },
  { title: '本月采购', value: '45', color: '#67C23A' },
  { title: '待收货', value: '8', color: '#F56C6C' }
]);

const pendingOrders = ref([
  { poNo: 'PO-2026-001', supplierName: '供应商A', finalAmount: '¥12,500', status: 'draft' },
  { poNo: 'PO-2026-002', supplierName: '供应商B', finalAmount: '¥8,900', status: 'pending' },
  { poNo: 'PO-2026-003', supplierName: '供应商C', finalAmount: '¥23,400', status: 'pending' }
]);

onMounted(() => {
  const chart = echarts.init(document.getElementById('purchase-trend'));
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [{
      data: [120, 200, 150, 180, 220, 290],
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3 }
    }]
  });
});
</script>

<style scoped>
.purchase-dashboard { padding: 20px; }
.stat-item { text-align: center; }
.stat-value { font-size: 24px; font-weight: bold; }
.stat-title { font-size: 14px; color: #909399; margin-top: 8px; }
</style>
