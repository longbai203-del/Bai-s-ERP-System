<template>
  <div class="pagination-container">
    <div class="pagination-info" v-if="showInfo">
      共 {{ total }} 条记录，第 {{ currentPage }}/{{ totalPages }} 页
    </div>
    <el-pagination
      v-bind="$attrs"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      layout="prev, pager, next, jumper, sizes"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  showInfo?: boolean
}>(), {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: () => [10, 20, 50, 100],
  showInfo: true
})

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'change', page: number, size: number): void
}>()

const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize) || 1
})

const handleCurrentChange = (page: number) => {
  emit('update:currentPage', page)
  emit('change', page, props.pageSize)
}

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
  emit('change', 1, size)
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 0;
}

.pagination-info {
  font-size: 14px;
  color: #6B7280;
}

@media (max-width: 640px) {
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
  }
  .pagination-info {
    text-align: center;
  }
}
</style>
