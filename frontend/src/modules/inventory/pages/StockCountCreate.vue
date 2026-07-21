<!-- 
  文件路径: frontend/src/modules/inventory/pages/StockCountCreate.vue
  功能: 新建盘点单
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建库存盘点</h2>
          <p class="subtitle">创建盘点计划</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交盘点</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header><span>盘点信息</span></template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="盘点编号" prop="countNo">
              <el-input v-model="form.countNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库" prop="warehouse">
              <el-select v-model="form.warehouse" placeholder="请选择仓库" style="width: 100%">
                <el-option label="利雅得仓库" value="利雅得仓库" />
                <el-option label="吉达仓库" value="吉达仓库" />
                <el-option label="达曼仓库" value="达曼仓库" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="盘点类型" prop="countType">
              <el-select v-model="form.countType" placeholder="请选择类型" style="width: 100%">
                <el-option label="全盘" value="full" />
                <el-option label="抽盘" value="sample" />
                <el-option label="循环盘点" value="cycle" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="盘点说明" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入盘点说明" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header><span>盘点范围</span></template>
      <el-radio-group v-model="form.scope" style="margin-bottom: 16px;">
        <el-radio-button label="all">全库盘点</el-radio-button>
        <el-radio-button label="category">分类盘点</el-radio-button>
        <el-radio-button label="location">区域盘点</el-radio-button>
      </el-radio-group>
      <div v-if="form.scope === 'category'">
        <el-select v-model="form.categories" multiple placeholder="请选择分类" style="width: 100%">
          <el-option label="电子产品" value="electronics" />
          <el-option label="服装鞋帽" value="clothing" />
          <el-option label="食品饮料" value="food" />
        </el-select>
      </div>
      <div v-if="form.scope === 'location'">
        <el-select v-model="form.locations" multiple placeholder="请选择区域" style="width: 100%">
          <el-option label="A区" value="A" />
          <el-option label="B区" value="B" />
          <el-option label="C区" value="C" />
        </el-select>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()

const form = reactive({
  countNo: 'SC-2024-004',
  warehouse: '',
  countType: 'full',
  description: '',
  scope: 'all',
  categories: [] as string[],
  locations: [] as string[],
})

const rules = {
  warehouse: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  countType: [{ required: true, message: '请选择盘点类型', trigger: 'change' }],
}

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('盘点计划已创建')
  router.push('/inventory/count')
}
const handleCancel = () => { router.push('/inventory/count') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>