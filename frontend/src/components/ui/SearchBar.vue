<template>
  <div class="search-bar">
    <div class="search-bar-content">
      <!-- 搜索输入 -->
      <el-input
        v-model="keyword"
        :placeholder="placeholder"
        size="default"
        clearable
        @keyup.enter="handleSearch"
        @clear="handleReset"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <!-- 筛选条件 -->
      <div v-if="filters.length > 0" class="filters">
        <template v-for="filter in filters" :key="filter.key">
          <el-select
            v-if="filter.type === 'select'"
            v-model="filterValues[filter.key]"
            :placeholder="filter.placeholder"
            clearable
            size="default"
            @change="handleSearch"
          >
            <el-option
              v-for="option in filter.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <el-date-picker
            v-else-if="filter.type === 'date'"
            v-model="filterValues[filter.key]"
            :type="filter.dateType || 'date'"
            :placeholder="filter.placeholder"
            size="default"
            @change="handleSearch"
          />
          <el-input
            v-else
            v-model="filterValues[filter.key]"
            :placeholder="filter.placeholder"
            size="default"
            clearable
            @keyup.enter="handleSearch"
          />
        </template>
      </div>

      <!-- 按钮组 -->
      <div class="actions">
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon> 搜索
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon> 重置
        </el-button>
        <slot name="extra" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

export interface SearchFilter {
  key: string
  type: 'input' | 'select' | 'date'
  placeholder?: string
  options?: { label: string; value: any }[]
  dateType?: 'date' | 'daterange' | 'datetime'
}

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  filters?: SearchFilter[]
}>(), {
  modelValue: '',
  placeholder: '请输入搜索关键词...',
  filters: () => []
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: { keyword: string; filters: Record<string, any> }): void
  (e: 'reset'): void
}>()

const keyword = ref(props.modelValue)
const filterValues = reactive<Record<string, any>>({})

// 初始化筛选值
watch(() => props.filters, (filters) => {
  filters.forEach(f => {
    if (!(f.key in filterValues)) {
      filterValues[f.key] = ''
    }
  })
}, { immediate: true })

const handleSearch = () => {
  emit('update:modelValue', keyword.value)
  emit('search', { keyword: keyword.value, filters: { ...filterValues } })
}

const handleReset = () => {
  keyword.value = ''
  Object.keys(filterValues).forEach(key => {
    filterValues[key] = ''
  })
  emit('reset')
  emit('search', { keyword: '', filters: {} })
}
</script>

<style scoped>
.search-bar {
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  padding: 16px;
  margin-bottom: 16px;
}

.search-bar-content {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.search-bar-content > .el-input {
  flex: 1;
  min-width: 200px;
}
.search-bar-content > .el-input :deep(.el-input__wrapper) {
  border-radius: 8px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 2;
}

.filters .el-select,
.filters .el-date-editor,
.filters .el-input {
  flex: 1;
  min-width: 150px;
}
.filters .el-select :deep(.el-input__wrapper),
.filters .el-date-editor :deep(.el-input__wrapper) {
  border-radius: 8px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .search-bar-content {
    flex-direction: column;
  }
  .search-bar-content > .el-input,
  .filters .el-select,
  .filters .el-date-editor,
  .filters .el-input {
    width: 100%;
    min-width: unset;
  }
  .actions {
    width: 100%;
  }
  .actions .el-button {
    flex: 1;
  }
}
</style>
