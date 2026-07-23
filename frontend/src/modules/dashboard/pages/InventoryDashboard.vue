<template>
  <div class="inventory-dashboard">
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
          <template #header><span>库存分类统计</span></template>
          <div id="category-chart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>低库存预警</span></template>
          <el-table :data="lowStockItems" style="width: 100%;">
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="quantity" label="库存数量" />
            <el-table-column prop="minStock" label="最低库存" />
            <el-table-column label="状态">
              <template #default="{ row }">
                <el-tag type="danger">低于安全库存</el-tag>
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
  { title: '总库存商品', value: '4,321', color: '#409EFF' },
  { title: '低库存商品', value: '56', color: '#E6A23C' },
  { title: '缺货商品', value: '23', color: '#F56C6C' },
  { title: '总库存价值', value: '¥1,234,567', color: '#67C23A' }
]);

const lowStockItems = ref([
  { name: '商品A', quantity: 5, minStock: 10 },
  { name: '商品B', quantity: 3, minStock: 8 },
  { name: '商品C', quantity: 0, minStock: 5 }
]);

onMounted(() => {
  const chart = echarts.init(document.getElementById('category-chart'));
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 1048, name: '电子产品' },
        { value: 735, name: '办公用品' },
        { value: 580, name: '原材料' },
        { value: 484, name: '成品' },
        { value: 300, name: '其他' }
      ],
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
    }]
  });
});
</script>

<style scoped>
.inventory-dashboard { padding: 20px; }
.stat-item { text-align: center; }
.stat-value { font-size: 24px; font-weight: bold; }
.stat-title { font-size: 14px; color: #909399; margin-top: 8px; }
</style>
