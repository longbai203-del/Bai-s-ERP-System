<!-- 
  文件路径: frontend/src/modules/dashboard/pages/Edit.vue
  功能: 编辑仪表盘 - 修改仪表盘配置
-->

<template>
  <div class="dashboard-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>✏️ 编辑仪表盘</h1>
          <p class="header-subtitle">修改仪表盘配置 - ID: {{ form.id || 'DASH-001' }}</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          <el-icon><Check /></el-icon> 保存更改
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 编辑表单 -->
    <el-card v-else class="main-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        label-position="right"
        size="large"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">
            <span>📋 基本信息</span>
          </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="仪表盘ID" prop="id">
                <el-input
                  v-model="form.id"
                  disabled
                  style="background: #F9FAFB;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仪表盘类型" prop="type" required>
                <el-select v-model="form.type" placeholder="请选择仪表盘类型" style="width: 100%">
                  <el-option label="📊 总览" value="overview" />
                  <el-option label="📈 销售" value="sales" />
                  <el-option label="💰 财务" value="finance" />
                  <el-option label="📦 库存" value="inventory" />
                  <el-option label="🛒 采购" value="purchase" />
                  <el-option label="⭐ 绩效" value="performance" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="仪表盘名称" prop="name" required>
                <el-input
                  v-model="form.name"
                  placeholder="请输入仪表盘名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio-button label="active">🟢 启用</el-radio-button>
                  <el-radio-button label="inactive">⛔ 停用</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="自动刷新">
                <el-select v-model="form.autoRefresh" placeholder="请选择刷新间隔" style="width: 100%">
                  <el-option label="不自动刷新" value="none" />
                  <el-option label="30秒" value="30" />
                  <el-option label="1分钟" value="60" />
                  <el-option label="5分钟" value="300" />
                  <el-option label="10分钟" value="600" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人">
                <el-input
                  v-model="form.createdBy"
                  disabled
                  style="background: #F9FAFB;"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 布局配置 -->
        <div class="form-section">
          <div class="section-title">
            <span>🎨 布局配置</span>
          </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="布局类型" prop="layout">
                <el-radio-group v-model="form.layout">
                  <el-radio-button label="grid">网格布局</el-radio-button>
                  <el-radio-button label="flex">弹性布局</el-radio-button>
                  <el-radio-button label="custom">自定义</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="列数" prop="columns">
                <el-input-number
                  v-model="form.columns"
                  :min="1"
                  :max="6"
                  controls-position="right"
                  style="width: 120px"
                />
                <span style="margin-left: 12px; color: #9CA3AF;">列</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="主题配色">
                <el-radio-group v-model="form.theme">
                  <el-radio-button label="light">☀️ 明亮</el-radio-button>
                  <el-radio-button label="dark">🌙 暗色</el-radio-button>
                  <el-radio-button label="auto">🔄 跟随系统</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 图表组件 -->
        <div class="form-section">
          <div class="section-title">
            <span>📊 图表组件 ({{ form.charts.length }})</span>
            <el-button type="primary" size="small" text @click="showChartSelector = true">
              <el-icon><Plus /></el-icon> 添加图表
            </el-button>
          </div>

          <div class="chart-list">
            <div
              v-for="(chart, index) in form.charts"
              :key="index"
              class="chart-item"
            >
              <div class="chart-item-content">
                <span class="chart-icon">{{ getChartIcon(chart.type) }}</span>
                <span class="chart-name">{{ chart.name }}</span>
                <span class="chart-type">{{ getChartTypeLabel(chart.type) }}</span>
              </div>
              <div class="chart-item-actions">
                <el-button size="small" text @click="editChart(index)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button size="small" type="danger" text @click="removeChart(index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div v-if="!form.charts.length" class="chart-empty">
              <el-empty description="暂无图表组件，点击上方添加" :image-size="60" />
            </div>
          </div>
        </div>

        <!-- 描述与标签 -->
        <div class="form-section">
          <div class="section-title">
            <span>📝 描述与标签</span>
          </div>

          <el-form-item label="仪表盘描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请描述仪表盘的用途和目标用户..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="标签">
            <div class="tags-container">
              <el-tag
                v-for="tag in form.tags"
                :key="tag"
                size="small"
                class="tag-item"
                closable
                @close="removeTag(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="tagInputVisible"
                ref="tagInputRef"
                v-model="tagInputValue"
                class="tag-input"
                size="small"
                @keyup.enter="addTag"
                @blur="addTag"
              />
              <el-button
                v-else
                class="tag-add-btn"
                size="small"
                @click="showTagInput"
              >
                + 添加标签
              </el-button>
              <span v-if="!form.tags.length" style="color: #9CA3AF; font-size: 13px; margin-left: 8px;">暂无标签</span>
            </div>
          </el-form-item>
        </div>

        <!-- 更新信息 -->
        <div class="update-info">
          <span>创建时间: {{ form.createdAt || '2024-10-15 14:30' }}</span>
          <span>最后更新: {{ form.updatedAt || '2024-10-20 10:00' }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button size="large" @click="handleCancel">取消</el-button>
          <el-button size="large" @click="handlePreview">
            <el-icon><View /></el-icon> 预览
          </el-button>
          <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
            <el-icon><Check /></el-icon> 保存更改
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 图表选择器对话框 -->
    <el-dialog
      v-model="showChartSelector"
      title="添加图表组件"
      width="700px"
      top="5vh"
      :destroy-on-close="true"
    >
      <div class="chart-selector-grid">
        <div
          v-for="chartTemplate in chartTemplates"
          :key="chartTemplate.id"
          class="chart-template"
          @click="addChart(chartTemplate)"
        >
          <div class="chart-template-icon">{{ chartTemplate.icon }}</div>
          <div class="chart-template-name">{{ chartTemplate.name }}</div>
          <div class="chart-template-desc">{{ chartTemplate.desc }}</div>
          <el-button size="small" type="primary" plain>添加</el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="showChartSelector = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="仪表盘预览"
      width="900px"
      top="5vh"
      :destroy-on-close="true"
    >
      <div class="preview-container">
        <div class="preview-header">
          <h3>{{ form.name || '未命名仪表盘' }}</h3>
          <div class="preview-meta">
            <el-tag :type="getTypeTag(form.type)">{{ getTypeLabel(form.type) }}</el-tag>
            <el-tag :type="form.status === 'active' ? 'success' : 'info'">
              {{ form.status === 'active' ? '🟢 已启用' : '⛔ 已停用' }}
            </el-tag>
            <span>布局: {{ form.layout }} | 列数: {{ form.columns }}</span>
          </div>
        </div>

        <el-divider />

        <div class="preview-body">
          <el-row :gutter="16" class="preview-kpi">
            <el-col :span="6" v-for="kpi in previewKpis" :key="kpi.label">
              <div class="preview-kpi-card">
                <div class="preview-kpi-label">{{ kpi.label }}</div>
                <div class="preview-kpi-value">{{ kpi.value }}</div>
                <div class="preview-kpi-change" :class="kpi.trend">
                  {{ kpi.trend === 'up' ? '↑' : '↓' }} {{ kpi.change }}%
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="16" class="preview-charts">
            <el-col
              v-for="chart in form.charts"
              :key="chart.id"
              :span="Math.floor(24 / Math.min(form.columns || 2, 4))"
            >
              <div class="preview-chart-placeholder">
                <div class="chart-placeholder-icon">{{ getChartIcon(chart.type) }}</div>
                <div class="chart-placeholder-name">{{ chart.name }}</div>
                <el-empty description="图表数据加载中" :image-size="40" />
              </div>
            </el-col>
          </el-row>

          <div v-if="!form.charts.length" class="preview-empty">
            <el-empty description="暂无图表组件" />
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSubmit; previewVisible = false">
          <el-icon><Check /></el-icon> 确认保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Check, View, Plus, Edit, Delete } from '@element-plus/icons-vue'

// ============================================================
// 路由
// ============================================================

const router = useRouter()
const route = useRoute()

// ============================================================
// 响应式数据
// ============================================================

const formRef = ref()
const loading = ref(false)
const submitting = ref(false)
const previewVisible = ref(false)
const showChartSelector = ref(false)
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref()

// ============================================================
// 表单数据
// ============================================================

const form = reactive({
  id: 'DASH-001',
  name: '总览仪表盘',
  type: 'overview',
  status: 'active',
  autoRefresh: '60',
  layout: 'grid',
  columns: 2,
  theme: 'light',
  description: '系统总览仪表盘，展示核心业务指标',
  createdBy: 'Ahmed Al-Fahd',
  createdAt: '2024-10-15 14:30',
  updatedAt: '2024-10-20 10:00',
  tags: ['核心', '管理层', '实时'],
  charts: [
    { id: 'chart-1', name: '销售趋势图', type: 'trend' },
    { id: 'chart-2', name: '销售占比图', type: 'pie' },
    { id: 'chart-3', name: 'KPI指标卡', type: 'kpi' },
    { id: 'chart-4', name: '柱状对比图', type: 'bar' },
  ]
})

// ============================================================
// 图表模板
// ============================================================

const chartTemplates = ref([
  { id: 'chart-1', name: '销售趋势图', desc: '展示销售数据趋势', icon: '📈', type: 'trend' },
  { id: 'chart-2', name: '销售占比图', desc: '展示各品类销售占比', icon: '🍩', type: 'pie' },
  { id: 'chart-3', name: 'KPI指标卡', desc: '展示关键绩效指标', icon: '📊', type: 'kpi' },
  { id: 'chart-4', name: '柱状对比图', desc: '对比不同维度数据', icon: '📊', type: 'bar' },
  { id: 'chart-5', name: '表格数据', desc: '展示详细数据列表', icon: '📋', type: 'table' },
  { id: 'chart-6', name: '热力图', desc: '展示数据密度分布', icon: '🔥', type: 'heatmap' },
])

// ============================================================
// 预览KPI数据
// ============================================================

const previewKpis = ref([
  { label: '总销售额', value: 'SAR 12,856,000', change: 12.5, trend: 'up' },
  { label: '总利润', value: 'SAR 4,296,000', change: 18.7, trend: 'up' },
  { label: '订单数', value: '1,286', change: 8.3, trend: 'up' },
  { label: '客单价', value: 'SAR 9,998', change: 3.2, trend: 'up' },
])

// ============================================================
// 表单验证规则
// ============================================================

const rules = {
  name: [
    { required: true, message: '请输入仪表盘名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符之间', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择仪表盘类型', trigger: 'change' }
  ]
}

// ============================================================
// 工具函数
// ============================================================

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    overview: '总览',
    sales: '销售',
    finance: '财务',
    inventory: '库存',
    purchase: '采购',
    performance: '绩效'
  }
  return map[type] || type
}

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    overview: 'primary',
    sales: 'success',
    finance: 'danger',
    inventory: 'warning',
    purchase: 'info',
    performance: 'primary'
  }
  return map[type] || 'info'
}

const getChartIcon = (type: string) => {
  const map: Record<string, string> = {
    trend: '📈',
    pie: '🍩',
    kpi: '📊',
    bar: '📊',
    table: '📋',
    heatmap: '🔥'
  }
  return map[type] || '📊'
}

const getChartTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    trend: '趋势图',
    pie: '饼图',
    kpi: 'KPI指标',
    bar: '柱状图',
    table: '数据表',
    heatmap: '热力图'
  }
  return map[type] || type
}

// ============================================================
// 标签管理
// ============================================================

const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const addTag = () => {
  const value = tagInputValue.value.trim()
  if (value && !form.tags.includes(value)) {
    form.tags.push(value)
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

const removeTag = (tag: string) => {
  form.tags = form.tags.filter(t => t !== tag)
}

// ============================================================
// 图表管理
// ============================================================

const addChart = (template: any) => {
  form.charts.push({
    id: template.id + '-' + Date.now(),
    name: template.name,
    type: template.type
  })
  showChartSelector.value = false
  ElMessage.success(`已添加图表: ${template.name}`)
}

const removeChart = (index: number) => {
  ElMessageBox.confirm('确定要移除此图表组件吗？', '确认移除', {
    type: 'warning'
  }).then(() => {
    form.charts.splice(index, 1)
    ElMessage.success('图表已移除')
  }).catch(() => {})
}

const editChart = (index: number) => {
  ElMessage.info('编辑图表功能开发中')
}

// ============================================================
// 页面操作
// ============================================================

const handleBack = () => {
  if (formRef.value?.isDirty) {
    ElMessageBox.confirm('确定要返回吗？未保存的更改将丢失。', '确认返回', {
      type: 'warning'
    }).then(() => {
      router.push('/dashboard')
    }).catch(() => {})
  } else {
    router.push('/dashboard')
  }
}

const handleCancel = () => {
  handleBack()
}

const handleReset = () => {
  ElMessageBox.confirm('确定要重置所有更改吗？', '确认重置', {
    type: 'warning'
  }).then(() => {
    loadDetail()
    ElMessage.success('已重置所有更改')
  }).catch(() => {})
}

const handlePreview = () => {
  if (!form.name) {
    ElMessage.warning('请先填写仪表盘名称')
    return
  }
  previewVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning('请完善必填信息')
      return
    }

    submitting.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      ElMessage.success({
        message: `✅ 仪表盘 "${form.name}" 已更新！`,
        duration: 3000
      })
      router.push('/dashboard')
    } catch (error) {
      ElMessage.error('更新失败，请重试')
    } finally {
      submitting.value = false
    }
  })
}

// ============================================================
// 加载数据
// ============================================================

const loadDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    // 实际项目中调用 API
    // const res = await api.get(`/dashboards/${id}`)
    // Object.assign(form, res.data)
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.dashboard-edit-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* ============================================================
   页面头部
   ============================================================ */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.back-btn {
  margin-top: 4px;
}

.header-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 4px 0;
}

.header-subtitle {
  color: #6B7280;
  margin: 0;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* ============================================================
   加载状态
   ============================================================ */

.loading-container {
  padding: 20px 0;
}

/* ============================================================
   主卡片
   ============================================================ */

.main-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.main-card :deep(.el-card__body) {
  padding: 32px 40px;
}

/* ============================================================
   表单分区
   ============================================================ */

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #F3F4F6;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.section-title span {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ============================================================
   表单样式
   ============================================================ */

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #4B5563;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background: #F9FAFB;
}

/* ============================================================
   图表列表
   ============================================================ */

.chart-list {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 8px;
  min-height: 80px;
}

.chart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #F3F4F6;
}

.chart-item:last-child {
  border-bottom: none;
}

.chart-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-icon {
  font-size: 20px;
}

.chart-name {
  font-weight: 500;
  color: #1F2937;
}

.chart-type {
  font-size: 12px;
  color: #9CA3AF;
}

.chart-item-actions {
  display: flex;
  gap: 4px;
}

.chart-empty {
  padding: 8px 0;
}

/* ============================================================
   标签
   ============================================================ */

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-item {
  margin-right: 4px;
  margin-bottom: 2px;
}

.tag-input {
  width: 120px;
  margin-right: 4px;
}

.tag-add-btn {
  border-style: dashed;
  border-color: #D1D5DB;
  color: #6B7280;
}

.tag-add-btn:hover {
  border-color: #4F46E5;
  color: #4F46E5;
}

/* ============================================================
   图表选择器
   ============================================================ */

.chart-selector-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.chart-template {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.chart-template:hover {
  border-color: #409EFF;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.chart-template-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.chart-template-name {
  font-weight: 600;
  font-size: 14px;
  color: #1F2937;
}

.chart-template-desc {
  font-size: 12px;
  color: #9CA3AF;
  margin: 4px 0 8px;
  text-align: center;
}

/* ============================================================
   更新信息
   ============================================================ */

.update-info {
  display: flex;
  gap: 24px;
  padding: 12px 0;
  font-size: 13px;
  color: #9CA3AF;
  border-top: 1px solid #F3F4F6;
}

/* ============================================================
   预览对话框
   ============================================================ */

.preview-container {
  padding: 4px 0;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1F2937;
}

.preview-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.preview-kpi {
  margin-bottom: 16px;
}

.preview-kpi-card {
  text-align: center;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
}

.preview-kpi-label {
  font-size: 13px;
  color: #9CA3AF;
}

.preview-kpi-value {
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  margin: 4px 0;
}

.preview-kpi-change {
  font-size: 12px;
}

.preview-kpi-change.up {
  color: #67C23A;
}

.preview-kpi-change.down {
  color: #F56C6C;
}

.preview-charts {
  margin-top: 8px;
}

.preview-chart-placeholder {
  text-align: center;
  padding: 24px;
  background: #F9FAFB;
  border-radius: 8px;
  border: 1px dashed #D1D5DB;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chart-placeholder-icon {
  font-size: 32px;
  margin-bottom: 4px;
}

.chart-placeholder-name {
  font-size: 14px;
  font-weight: 500;
  color: #4B5563;
  margin-bottom: 8px;
}

.preview-empty {
  padding: 20px 0;
}

/* ============================================================
   操作按钮
   ============================================================ */

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #F3F4F6;
  margin-top: 8px;
}

.form-actions .el-button {
  padding: 10px 28px;
  font-weight: 500;
}

/* ============================================================
   暗色模式
   ============================================================ */

[data-theme="dark"] .dashboard-edit-page {
  background: #1A1A2E;
}

[data-theme="dark"] .main-card {
  background: #2C2C2E;
}

[data-theme="dark"] .header-title h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .form-section {
  border-color: #3A3A3C;
}

[data-theme="dark"] .section-title {
  color: #F5F5F7;
}

[data-theme="dark"] :deep(.el-form-item__label) {
  color: #9CA3AF;
}

[data-theme="dark"] :deep(.el-input.is-disabled .el-input__wrapper) {
  background: #3A3A3C;
}

[data-theme="dark"] .update-info {
  border-color: #3A3A3C;
  color: #6B7280;
}

[data-theme="dark"] .form-actions {
  border-color: #3A3A3C;
}

[data-theme="dark"] .chart-item {
  border-color: #3A3A3C;
}

[data-theme="dark"] .chart-name {
  color: #F5F5F7;
}

[data-theme="dark"] .chart-template {
  border-color: #3A3A3C;
}

[data-theme="dark"] .chart-template-name {
  color: #F5F5F7;
}

[data-theme="dark"] .preview-header h3 {
  color: #F5F5F7;
}

[data-theme="dark"] .preview-kpi-card {
  background: #3A3A3C;
}

[data-theme="dark"] .preview-kpi-value {
  color: #F5F5F7;
}

[data-theme="dark"] .preview-chart-placeholder {
  background: #3A3A3C;
  border-color: #48484A;
}

[data-theme="dark"] .chart-placeholder-name {
  color: #D1D5DB;
}

/* ============================================================
   响应式
   ============================================================ */

@media (max-width: 768px) {
  .dashboard-edit-page {
    padding: 16px;
  }

  .main-card :deep(.el-card__body) {
    padding: 20px 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    justify-content: stretch;
  }

  .header-actions .el-button {
    flex: 1;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
    justify-content: center;
  }

  .update-info {
    flex-direction: column;
    gap: 4px;
  }

  .chart-selector-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .preview-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>