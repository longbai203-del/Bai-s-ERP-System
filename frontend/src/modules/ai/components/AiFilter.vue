<template>
  <div class="ai-filter">
    <el-form :model="filters" inline>
      <el-form-item label="状态">
        <el-select v-model="filters.status" placeholder="全部" clearable @change="emit('change', filters)">
          <el-option label="全部" value="" />
          <el-option label="启用" value="active" />
          <el-option label="停用" value="inactive" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="emit('search', filters)">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits<{
  (e: 'change', value: any): void
  (e: 'search', value: any): void
}>()

const filters = reactive({ status: '' })

const reset = () => {
  filters.status = ''
  emit('search', filters)
}
</script>
