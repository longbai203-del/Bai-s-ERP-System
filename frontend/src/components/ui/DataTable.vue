<template>
  <div class="data-table">
    <div class="table-toolbar" v-if="hasToolbar">
      <slot name="toolbar">
        <div class="toolbar-left">
          <slot name="toolbar-left" />
        </div>
        <div class="toolbar-right">
          <slot name="toolbar-right" />
        </div>
      </slot>
    </div>

    <el-table
      v-bind="$attrs"
      :data="data"
      v-loading="loading"
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="selectable" type="selection" width="50" />
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :fixed="col.fixed"
        :align="col.align || 'left'"
        :sortable="col.sortable || false"
      >
        <template #default="{ row, $index }">
          <slot :name="col.prop" :row="row" :index="$index">
            {{ row[col.prop] }}
          </slot>
        </template>
      </el-table-column>
      <el-table-column
        v-if="hasActions"
        label="操作"
        width="200"
        fixed="right"
        align="center"
      >
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index" />
        </template>
      </el-table-column>
    </el-table>

    <div class="table-footer">
      <slot name="footer">
        <div class="footer-left">
          <span v-if="selectedRows.length > 0" class="selected-info">
            已选 {{ selectedRows.length }} 项
          </span>
        </div>
        <div class="footer-right">
          <Pagination
            v-if="showPagination"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            :page-sizes="pageSizes"
            @update:current-page="handlePageChange"
            @update:page-size="handleSizeChange"
          />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Pagination from './Pagination.vue'

export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}

const props = withDefaults(defineProps<{
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  total?: number
  currentPage?: number
  pageSize?: number
  pageSizes?: number[]
  selectable?: boolean
  showPagination?: boolean
}>(), {
  loading: false,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  selectable: true,
  showPagination: true
})

const emit = defineEmits<{
  (e: 'selection-change', rows: any[]): void
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
}>()

const selectedRows = ref<any[]>([])

const hasToolbar = computed(() => {
  return !!$slots.toolbar || !!$slots['toolbar-left'] || !!$slots['toolbar-right']
})

const hasActions = computed(() => {
  return !!$slots.actions
})

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
  emit('selection-change', rows)
}

const handlePageChange = (page: number) => {
  emit('update:currentPage', page)
}

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
}
</script>

<style scoped>
.data-table {
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  overflow: hidden;
}

.table-toolbar {
  padding: 12px 16px;
  border-bottom: 1px solid #F3F4F6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.table-footer {
  padding: 12px 16px;
  border-top: 1px solid #F3F4F6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.footer-left {
  display: flex;
  align-items: center;
}

.selected-info {
  font-size: 14px;
  color: #4F46E5;
  font-weight: 500;
}

.footer-right {
  display: flex;
  align-items: center;
}

.data-table :deep(.el-table) {
  border-radius: 0;
}
.data-table :deep(.el-table__header-wrapper) {
  background: #F9FAFB;
}
.data-table :deep(.el-table__header-wrapper th) {
  font-weight: 600;
  color: #4B5563;
}
</style>
