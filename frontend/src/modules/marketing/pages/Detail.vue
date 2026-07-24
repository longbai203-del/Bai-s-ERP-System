<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <span class="page-title">营销详情</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>
      <div v-else>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="名称">{{ data.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ data.type || '-' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="data.status === 'active' ? 'success' : 'info'">
              {{ data.status === 'active' ? '进行中' : '已结束' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ data.createTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const data = ref<any>({})

const handleBack = () => {
  router.push('/marketing/list')
}

onMounted(() => {
  const id = route.params.id
  // TODO: 加载数据
  console.log('营销详情ID:', id)
})
</script>

<style scoped>
.page-container { padding: 0; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-title { font-size: 18px; font-weight: bold; }
.loading-container { padding: 20px; }
</style>
