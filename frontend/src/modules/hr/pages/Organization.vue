<!-- 
  文件路径: frontend/src/modules/hr/pages/Organization.vue
  功能: 组织架构 - 公司组织架构图
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 添加部门</el-button>
          <el-button @click="handleEdit"><el-icon><Edit /></el-icon> 编辑</el-button>
        </el-col>
        <el-col :span="6" :offset="12">
          <el-select v-model="selectedLevel" placeholder="选择层级" style="width: 100%">
            <el-option label="全部" value="all" />
            <el-option label="一级部门" value="1" />
            <el-option label="二级部门" value="2" />
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <div class="org-chart">
        <div class="org-node ceo">
          <div class="node-card">
            <div class="node-avatar">
              <el-avatar icon="UserFilled" />
            </div>
            <div class="node-name">CEO</div>
            <div class="node-title">总经理</div>
          </div>
        </div>

        <div class="org-level">
          <div v-for="dept in departments" :key="dept.name" class="org-node">
            <div class="node-card" @click="handleNodeClick(dept)">
              <div class="node-avatar" :style="{ background: dept.color }">
                <el-icon :size="24"><component :is="dept.icon" /></el-icon>
              </div>
              <div class="node-name">{{ dept.name }}</div>
              <div class="node-title">{{ dept.manager }}</div>
              <div class="node-count">{{ dept.count }}人</div>
            </div>
            <div v-if="dept.subDepartments" class="org-children">
              <div v-for="sub in dept.subDepartments" :key="sub.name" class="org-node child">
                <div class="node-card mini">
                  <div class="node-name">{{ sub.name }}</div>
                  <div class="node-title">{{ sub.manager }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const selectedLevel = ref('all')

const departments = ref([
  { name: '销售部', manager: 'Ahmed Al-Fahd', count: 45, color: '#409EFF', icon: 'TrendCharts', subDepartments: [{ name: '国内销售', manager: 'Khalid' }, { name: '国际销售', manager: 'Faisal' }] },
  { name: '采购部', manager: 'Mohammed Al-Qahtani', count: 28, color: '#67C23A', icon: 'ShoppingCart', subDepartments: [{ name: '国内采购', manager: 'Saud' }, { name: '国际采购', manager: 'Abdullah' }] },
  { name: '财务部', manager: 'Saud Al-Otaibi', count: 18, color: '#E6A23C', icon: 'Money', subDepartments: [{ name: '会计', manager: 'Nasser' }, { name: '出纳', manager: 'Sultan' }] },
  { name: '运营部', manager: 'Faisal Al-Dossary', count: 35, color: '#F56C6C', icon: 'Setting', subDepartments: [{ name: '物流', manager: 'Majed' }, { name: '仓储', manager: 'Turki' }] },
])

const handleAdd = () => { ElMessage.info('添加部门') }
const handleEdit = () => { ElMessage.info('编辑组织架构') }
const handleNodeClick = (dept: any) => { ElMessage.info(`查看部门: ${dept.name}`) }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.org-chart { display: flex; flex-direction: column; align-items: center; padding: 20px; }
.org-level { display: flex; justify-content: center; flex-wrap: wrap; gap: 40px; margin-top: 40px; }
.org-node { display: flex; flex-direction: column; align-items: center; }
.org-node.ceo { margin-bottom: 40px; }
.node-card { background: white; border-radius: 12px; padding: 16px 24px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.08); cursor: pointer; transition: all 0.3s; min-width: 120px; }
.node-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
.node-card.mini { padding: 12px 16px; min-width: 80px; }
.node-avatar { width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; }
.ceo .node-avatar { background: #1a1a2e; }
.node-name { font-weight: 600; font-size: 16px; color: #303133; }
.node-title { font-size: 13px; color: #909399; }
.node-count { font-size: 12px; color: #409EFF; margin-top: 4px; }
.org-children { display: flex; gap: 16px; margin-top: 16px; }
.org-children .org-node { flex: 1; }
</style>