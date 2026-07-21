<!-- 
  文件路径: frontend/src/modules/analytics/pages/ComparisonAnalysisDetail.vue
  功能: 对比分析详情 - 深度对比分析
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>对比分析详情</h2>
          <p class="subtitle">深度对比数据解读</p>
        </div>
        <div>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
        </div>
      </div>
    </el-card>

    <!-- 对比矩阵 -->
    <el-card>
      <template #header><span>对比矩阵</span></template>
      <el-table :data="matrixData" border style="width: 100%">
        <el-table-column prop="name" label="维度" fixed width="120" />
        <el-table-column v-for="col in columns" :key="col" :prop="col" :label="col" align="right">
          <template #default="{ row }">
            <span :style="{ color: row[col] === row.best ? '#67C23A' : row[col] === row.worst ? '#F56C6C' : '#303133', fontWeight: row[col] === row.best ? 700 : 400 }">
              {{ row[col] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>优势分析</span></template>
          <div v-for="strength in strengths" :key="strength" class="strength-item">
            <el-icon color="#67C23A"><Check /></el-icon>
            <span>{{ strength }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>改进机会</span></template>
          <div v-for="opportunity in opportunities" :key="opportunity" class="opportunity-item">
            <el-icon color="#E6A23C"><Warning /></el-icon>
            <span>{{ opportunity }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Download, Check, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const columns = ref(['iPhone', '三星', 'MacBook', 'iPad'])

const matrixData = ref([
  { name: '销售额(K)', iPhone: 1285, 三星: 985, MacBook: 876, iPad: 654, best: 1285, worst: 654 },
  { name: '利润率(%)', iPhone: 33.4, 三星: 34.0, MacBook: 29.2, iPad: 31.2, best: 34.0, worst: 29.2 },
  { name: '增长率(%)', iPhone: 12.5, 三星: 8.3, MacBook: -3.2, iPad: 5.7, best: 12.5, worst: -3.2 },
  { name: '满意度', iPhone: 4.8, 三星: 4.6, MacBook: 4.2, iPad: 4.5, best: 4.8, worst: 4.2 },
])

const strengths = ref([
  'iPhone 在销售额和满意度上领先',
  '三星 在利润率上表现最优',
  '整体产品线覆盖完整，客户选择丰富',
])

const opportunities = ref([
  'MacBook 增长率下降，需要关注产品更新',
  'iPad 利润率有提升空间',
  '产品差异化策略需要加强',
])

const handleBack = () => { router.push('/analytics/comparison') }
const handleExport = () => { ElMessage.success('导出完成') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.strength-item, .opportunity-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.strength-item:last-child, .opportunity-item:last-child { border-bottom: none; }
</style>