<!-- 
  文件路径: frontend/src/modules/customers/pages/CustomerMap.vue
  功能: 客户地图 - 客户地理位置分布
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="地区">
              <el-select v-model="searchForm.region" placeholder="请选择地区" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="利雅得" value="riyadh" />
                <el-option label="吉达" value="jeddah" />
                <el-option label="达曼" value="dammam" />
                <el-option label="麦加" value="makkah" />
                <el-option label="麦地那" value="madinah" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header><span>客户地理分布</span></template>
          <div class="map-container">
            <!-- 模拟地图 - 实际项目可使用ECharts地图 -->
            <div class="map-placeholder">
              <el-row :gutter="20" class="map-grid">
                <el-col :span="8" v-for="city in cities" :key="city.name" class="map-city">
                  <div class="city-marker" @click="handleCityClick(city)">
                    <div class="city-dot" :style="{ background: city.color }"></div>
                    <div class="city-name">{{ city.name }}</div>
                    <div class="city-count">{{ city.count }}家客户</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>地区统计</span></template>
          <el-table :data="regionData" style="width: 100%">
            <el-table-column prop="region" label="地区" />
            <el-table-column prop="count" label="客户数" align="center" />
            <el-table-column label="占比" align="center">
              <template #default="{ row }">
                <el-progress :percentage="row.percentage" :color="row.percentage > 20 ? '#67C23A' : '#409EFF'" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ region: 'all' })

const cities = ref([
  { name: '利雅得', count: 856, color: '#409EFF' },
  { name: '吉达', count: 520, color: '#67C23A' },
  { name: '达曼', count: 386, color: '#E6A23C' },
  { name: '麦加', count: 256, color: '#F56C6C' },
  { name: '麦地那', count: 186, color: '#9B59B6' },
  { name: '其他地区', count: 654, color: '#909399' },
])

const regionData = ref([
  { region: '利雅得', count: 856, percentage: 30 },
  { region: '吉达', count: 520, percentage: 18 },
  { region: '达曼', count: 386, percentage: 13.5 },
  { region: '麦加', count: 256, percentage: 9 },
  { region: '麦地那', count: 186, percentage: 6.5 },
  { region: '其他', count: 654, percentage: 23 },
])

const handleSearch = () => { ElMessage.success('查询完成') }
const handleReset = () => { searchForm.region = 'all' }
const handleCityClick = (city: any) => { ElMessage.info(`查看 ${city.name} 地区客户`) }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.map-container { min-height: 400px; display: flex; align-items: center; justify-content: center; }
.map-placeholder { width: 100%; padding: 20px; }
.map-grid { display: flex; flex-wrap: wrap; justify-content: center; }
.map-city { text-align: center; padding: 20px; cursor: pointer; transition: all 0.3s; border-radius: 12px; }
.map-city:hover { background: #f5f7fa; transform: translateY(-4px); }
.city-dot { width: 16px; height: 16px; border-radius: 50%; margin: 0 auto 8px; }
.city-name { font-weight: 600; color: #303133; }
.city-count { color: #909399; font-size: 13px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>