<template>
  <div class="data-table">
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="data"
      :border="border"
      :stripe="stripe"
      :height="height"
      :max-height="maxHeight"
      :row-key="rowKey"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
        align="center"
      />
      
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        width="55"
        align="center"
        label="序号"
        :index="indexMethod"
      />
      
      <!-- 动态列 -->
      <el-table-column
        v-for="col in columns"
        :key="col.prop || col.label"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :fixed="col.fixed"
        :align="col.align || 'left'"
        :sortable="col.sortable"
        :show-overflow-tooltip="col.tooltip !== false"
      >
        <template #default="{ row, $index }">
          <slot :name="col.prop" :row="row" :index="$index">
            <span v-if="col.formatter">{{ col.formatter(row[col.prop], row) }}</span>
            <span v-else-if="col.prop">{{ row[col.prop] }}</span>
          </slot>
        </template>
      </el-table-column>
      
      <!-- 操作列 -->
      <el-table-column
        v-if="hasActions"
        label="操作"
        :width="actionsWidth"
        :fixed="actionsFixed !== false ? 'right' : false"
        align="center"
      >
        <template #default="{ row }">
          <slot name="actions" :row="row" />
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div v-if="showPagination" class="data-table-footer">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

export interface Column {
  prop?: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  fixed?: boolean | 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  sortable?: boolean | 'custom';
  tooltip?: boolean;
  formatter?: (value: any, row: any) => string;
}

interface Props {
  data: any[];
  columns: Column[];
  loading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  border?: boolean;
  stripe?: boolean;
  height?: string | number;
  maxHeight?: string | number;
  selectable?: boolean;
  showIndex?: boolean;
  showPagination?: boolean;
  pageSizes?: number[];
  actionsWidth?: string | number;
  actionsFixed?: boolean;
  rowKey?: string;
  indexStart?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  total: 0,
  page: 1,
  limit: 10,
  border: true,
  stripe: true,
  selectable: false,
  showIndex: true,
  showPagination: true,
  pageSizes: () => [10, 20, 50, 100],
  actionsWidth: 200,
  actionsFixed: true,
  rowKey: 'id',
  indexStart: 0
});

const emit = defineEmits<{
  'update:page': [value: number];
  'update:limit': [value: number];
  selectionChange: [rows: any[]];
  sortChange: [column: any];
}>();

const slots = useSlots();

const currentPage = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val)
});

const pageSize = computed({
  get: () => props.limit,
  set: (val) => emit('update:limit', val)
});

const hasActions = computed(() => !!slots.actions);

function indexMethod(index: number) {
  return props.indexStart + index + 1;
}

function handleSelectionChange(rows: any[]) {
  emit('selectionChange', rows);
}

function handleSizeChange(val: number) {
  emit('update:limit', val);
}

function handlePageChange(val: number) {
  emit('update:page', val);
}

function handleSortChange(column: any) {
  emit('sortChange', column);
}
</script>

<style scoped>
.data-table { width: 100%; }
.data-table-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
