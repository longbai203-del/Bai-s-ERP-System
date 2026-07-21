<template>
  <div class="settings-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Settings 详情</span>
          <div>
            <el-button type="warning" @click="handleEdit">编辑</el-button>
            <el-button @click="handleBack">返回</el-button>
          </div>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailData.status === 'active' ? 'success' : 'danger'">
            {{ detailData.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ detailData.description || '暂无描述' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getSettingsDetail } from '@/api/settings'

const router = useRouter()
const route = useRoute()
const detailData = ref<any>({})

const handleBack = () => {
  router.push('/settings')
}

const handleEdit = () => {
  router.push('/settings/' + route.params.id + '/edit')
}

const loadDetail = async () => {
  try {
    const id = Number(route.params.id)
    const res = await getSettingsDetail(id)
    detailData.value = res.data || {}
  } catch (error) {
    ElMessage.error('加载详情失败')
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.settings-detail {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
