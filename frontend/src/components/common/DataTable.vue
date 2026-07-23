<template>
  <div class="data-table">
    <el-table
      v-loading="loading"
      :data="data"
      :border="border"
      :stripe="stripe"
      :height="height"
      :max-height="maxHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" v-if="selectable" />
      <el-table-column type="index" width="55" v-if="showIndex" label="序号" />
      
      <el-table-column
        v-for="col in columns"
        :key="col.prop || col.label"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :fixed="col.fixed"
        :align="col.align || 'left'"
      >
        <template #default="{ row }">
          <slot :name="col.prop" :row="row">
            <span v-if="col.formatter">{{ col.formatter(row[col.prop], row) }}</span>
            <span v-else>{{ row[col.prop] }}</span>
          </slot>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" v-if="hasActions" :width="actionsWidth" fixed="right">
        <template #default="{ row }">
          <slot name="actions" :row="row" />
        </template>
      </el-table-column>
    </el-table>
    
    <div class="data-table-footer" v-if="showPagination">
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
import { computed } from 'vue';

export interface Column {
  prop?: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  fixed?: boolean | 'left' | 'right';
  align?: 'left' | 'center' | 'right';
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
  actionsWidth: 200
});

const emit = defineEmits<{
  'update:page': [value: number];
  'update:limit': [value: number];
  selectionChange: [rows: any[]];
}>();

const currentPage = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val)
});

const pageSize = computed({
  get: () => props.limit,
  set: (val) => emit('update:limit', val)
});

const hasActions = computed(() => !!useSlots().actions);

function handleSelectionChange(rows: any[]) {
  emit('selectionChange', rows);
}

function handleSizeChange(val: number) {
  emit('update:limit', val);
}

function handlePageChange(val: number) {
  emit('update:page', val);
}
</script>

<style scoped>
.data-table { width: 100%; }
.data-table-footer { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
