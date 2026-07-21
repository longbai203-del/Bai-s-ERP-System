<template>
  <div class="inventory-filter">
    <el-form :model="formData" inline>
      <el-form-item label="关键词">
        <el-input 
          v-model="formData.keyword" 
          placeholder="请输入搜索关键词" 
          clearable
          @input="handleSearch"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select 
          v-model="formData.status" 
          placeholder="请选择状态" 
          clearable
          @change="handleSearch"
        >
          <el-option label="全部" value="" />
          <el-option label="启用" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const emit = defineEmits<{
  (e: 'search', params: any): void
  (e: 'reset'): void
}>()

const formData = reactive({
  keyword: '',
  status: ''
})

const handleSearch = () => {
  emit('search', { ...formData })
}

const handleReset = () => {
  formData.keyword = ''
  formData.status = ''
  emit('reset')
  handleSearch()
}
</script>

<style scoped>
.inventory-filter {
  padding: 10px 0;
}
</style>
