<template>
  <div class="dashboard-page">
    <el-row :gutter="20">
      <el-col :span="6" v-for="stat in stats" :key="stat.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="24"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>最近订单</span></template>
          <el-table :data="orders" style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" />
            <el-table-column prop="customer" label="客户" />
            <el-table-column prop="amount" label="金额" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>系统信息</span></template>
          <div class="system-info">
            <p><strong>系统版本：</strong>v3.0.0</p>
            <p><strong>运行时间：</strong>{{ uptime }}</p>
            <p><strong>当前用户：</strong>{{ username }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const username = computed(() => userStore.username || 'admin')

const stats = ref([
  { title: '总订单', value: '1,234', icon: 'Document', color: '#409EFF' },
  { title: '总用户', value: '56', icon: 'User', color: '#67C23A' },
  { title: '总收入', value: '¥98,765', icon: 'Money', color: '#E6A23C' },
  { title: '库存商品', value: '4,321', icon: 'Box', color: '#F56C6C' },
])

const orders = ref([
  { orderNo: 'ORD-2026-001', customer: '张三', amount: '¥1,200', status: '已完成' },
  { orderNo: 'ORD-2026-002', customer: '李四', amount: '¥850', status: '处理中' },
  { orderNo: 'ORD-2026-003', customer: '王五', amount: '¥2,300', status: '已完成' },
])

const uptime = ref('12小时30分钟')
</script>

<style scoped>
.dashboard-page { padding: 0; }
.stat-card { cursor: pointer; transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-5px); }
.stat-content { display: flex; align-items: center; gap: 15px; }
.stat-icon { width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; }
.stat-number { font-size: 24px; font-weight: bold; color: #333; }
.stat-title { font-size: 14px; color: #999; margin-top: 4px; }
.system-info p { margin: 8px 0; color: #666; }
</style>
