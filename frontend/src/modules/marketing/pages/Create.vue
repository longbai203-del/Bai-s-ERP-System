<!--
  文件路径: frontend/src/modules/marketing/pages/Create.vue
  功能: 创建营销记录 - 多步骤表单创建营销活动
  包含: 基本信息、预算与目标、渠道配置、内容编辑、审核与发布
-->

<template>
  <div class="marketing-create-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-info">
          <h1 class="page-title">📝 创建营销活动</h1>
          <p class="page-subtitle">策划新的营销活动，提升品牌影响力</p>
        </div>
      </div>
      <div class="header-right">
        <el-button @click="handleSaveDraft" :loading="savingDraft">
          <el-icon><Document /></el-icon> 保存草稿
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          <el-icon><Check /></el-icon> 发布活动
        </el-button>
      </div>
    </div>

    <!-- 步骤条 -->
    <el-card class="step-card" shadow="hover">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="基本信息" description="活动名称与类型" icon="Edit" />
        <el-step title="预算与目标" description="预算与KPI" icon="Money" />
        <el-step title="渠道配置" description="推广渠道" icon="Share" />
        <el-step title="内容编辑" description="活动内容" icon="Document" />
        <el-step title="审核与发布" description="确认发布" icon="Check" />
      </el-steps>
    </el-card>

    <!-- 表单内容 -->
    <el-card class="form-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
        label-position="right"
        size="default"
      >
        <!-- ========== 步骤1: 基本信息 ========== -->
        <div v-show="activeStep === 0" class="step-content">
          <div class="step-header">
            <h3><el-icon><Edit /></el-icon> 基本信息</h3>
            <span class="step-required">* 为必填项</span>
          </div>
          <el-divider />

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="活动名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入活动名称" clearable />
                <div class="form-hint">建议使用简洁有力的名称，便于传播</div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="活动类型" prop="type">
                <el-select v-model="formData.type" placeholder="请选择活动类型" style="width: 100%">
                  <el-option label="🎉 促销活动" value="promotion" />
                  <el-option label="🏷️ 品牌活动" value="brand" />
                  <el-option label="📈 获客活动" value="acquisition" />
                  <el-option label="👑 会员活动" value="member" />
                  <el-option label="🎊 节日活动" value="holiday" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="活动口号" prop="slogan">
                <el-input v-model="formData.slogan" placeholder="请输入活动口号" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="活动状态" prop="status">
                <el-radio-group v-model="formData.status">
                  <el-radio-button label="pending">⏳ 待启动</el-radio-button>
                  <el-radio-button label="active">🟢 进行中</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="开始日期" prop="startDate">
                <el-date-picker
                  v-model="formData.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="结束日期" prop="endDate">
                <el-date-picker
                  v-model="formData.endDate"
                  type="date"
                  placeholder="选择结束日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="负责团队" prop="team">
                <el-select v-model="formData.team" placeholder="请选择负责团队" style="width: 100%">
                  <el-option label="市场部" value="市场部" />
                  <el-option label="销售部" value="销售部" />
                  <el-option label="品牌部" value="品牌部" />
                  <el-option label="产品部" value="产品部" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="活动优先级" prop="priority">
                <el-select v-model="formData.priority" placeholder="请选择优先级" style="width: 100%">
                  <el-option label="🔥 高优先级" value="high" />
                  <el-option label="⚡ 中优先级" value="medium" />
                  <el-option label="📌 低优先级" value="low" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="活动描述" prop="description">
                <el-input
                  v-model="formData.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请详细描述活动内容、目标和预期效果..."
                  maxlength="1000"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- ========== 步骤2: 预算与目标 ========== -->
        <div v-show="activeStep === 1" class="step-content">
          <div class="step-header">
            <h3><el-icon><Money /></el-icon> 预算与目标</h3>
            <span class="step-required">* 为必填项</span>
          </div>
          <el-divider />

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="预算金额" prop="budget">
                <el-input-number
                  v-model="formData.budget"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="请输入预算金额"
                />
                <div class="form-hint">SAR 沙特里亚尔</div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="目标触达人数" prop="targetReach">
                <el-input-number
                  v-model="formData.targetReach"
                  :min="0"
                  :step="100"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="请输入目标触达人数"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="目标转化率" prop="targetConversion">
                <el-input-number
                  v-model="formData.targetConversion"
                  :min="0"
                  :max="100"
                  :precision="1"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="目标转化率 %"
                />
                <div class="form-hint">预计转化率百分比</div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="预期ROI" prop="expectedRoi">
                <el-input-number
                  v-model="formData.expectedRoi"
                  :min="0"
                  :precision="1"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="预期ROI %"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="预期销售额" prop="expectedRevenue">
                <el-input-number
                  v-model="formData.expectedRevenue"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="预期销售额"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="获客成本目标" prop="targetCac">
                <el-input-number
                  v-model="formData.targetCac"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="目标获客成本"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item label="成功标准" prop="successCriteria">
                <el-input
                  v-model="formData.successCriteria"
                  type="textarea"
                  :rows="2"
                  placeholder="请描述活动的成功衡量标准"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 预算分配 -->
          <div class="budget-allocation">
            <div class="sub-section-title">
              <span>预算分配</span>
              <span class="allocation-total">总计: {{ totalAllocated }}%</span>
            </div>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="12" :md="6" v-for="(item, index) in budgetAllocation" :key="index">
                <el-form-item :label="item.label">
                  <el-input-number
                    v-model="item.value"
                    :min="0"
                    :max="100"
                    controls-position="right"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-progress :percentage="totalAllocated" :color="totalAllocated === 100 ? '#67C23A' : totalAllocated > 100 ? '#F56C6C' : '#409EFF'" />
            <div class="allocation-hint" :class="{ 'allocation-error': totalAllocated > 100 }">
              {{ totalAllocated === 100 ? '✅ 预算分配完成' : totalAllocated > 100 ? '⚠️ 预算分配超过100%' : `请分配剩余 ${100 - totalAllocated}% 预算` }}
            </div>
          </div>
        </div>

        <!-- ========== 步骤3: 渠道配置 ========== -->
        <div v-show="activeStep === 2" class="step-content">
          <div class="step-header">
            <h3><el-icon><Share /></el-icon> 渠道配置</h3>
          </div>
          <el-divider />

          <el-form-item label="推广渠道" prop="channels">
            <el-checkbox-group v-model="formData.channels">
              <el-checkbox label="social">📱 社交媒体</el-checkbox>
              <el-checkbox label="email">📧 邮件营销</el-checkbox>
              <el-checkbox label="sms">💬 短信营销</el-checkbox>
              <el-checkbox label="offline">🏢 线下活动</el-checkbox>
              <el-checkbox label="partner">🤝 合作伙伴</el-checkbox>
              <el-checkbox label="website">🌐 官网</el-checkbox>
              <el-checkbox label="seo">🔍 SEO</el-checkbox>
              <el-checkbox label="paid">📊 付费广告</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-divider />

          <div v-for="channel in selectedChannelDetails" :key="channel.key" class="channel-config">
            <div class="channel-config-header">
              <span class="channel-config-icon">{{ channel.icon }}</span>
              <span class="channel-config-name">{{ channel.label }}</span>
            </div>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item :label="`${channel.label} 预算`">
                  <el-input-number
                    v-model="channel.budget"
                    :min="0"
                    :precision="2"
                    controls-position="right"
                    style="width: 100%"
                    placeholder="分配预算"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${channel.label} 负责人`">
                  <el-input v-model="channel.manager" placeholder="请输入负责人" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${channel.label} 备注`">
                  <el-input v-model="channel.remark" placeholder="请输入备注" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-empty v-if="selectedChannelDetails.length === 0" description="请选择至少一个推广渠道" :image-size="80" />
        </div>

        <!-- ========== 步骤4: 内容编辑 ========== -->
        <div v-show="activeStep === 3" class="step-content">
          <div class="step-header">
            <h3><el-icon><Document /></el-icon> 内容编辑</h3>
            <div class="step-actions">
              <el-button size="small" @click="insertTag('{{customer_name}}')">插入客户名称</el-button>
              <el-button size="small" @click="insertTag('{{campaign_name}}')">插入活动名称</el-button>
              <el-button size="small" @click="insertTag('{{discount}}')">插入折扣</el-button>
              <el-button size="small" @click="insertTag('{{link}}')">插入链接</el-button>
            </div>
          </div>
          <el-divider />

          <el-form-item label="活动内容" prop="content" required>
            <el-input
              v-model="formData.content"
              type="textarea"
              :rows="8"
              placeholder="请编辑活动内容，支持HTML标签和变量替换..."
              maxlength="5000"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="活动亮点" prop="highlights">
            <el-input
              v-model="formData.highlights"
              type="textarea"
              :rows="3"
              placeholder="请输入活动亮点，每行一个..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="活动素材">
            <el-upload
              action="#"
              multiple
              :auto-upload="false"
              :limit="5"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
              list-type="text"
            >
              <el-button type="primary" text>
                <el-icon><Upload /></el-icon> 上传素材
              </el-button>
              <template #tip>
                <div class="upload-tip">支持图片、PDF、视频等格式，单个文件不超过20MB</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="内容预览">
            <el-card class="preview-card" shadow="hover">
              <div class="preview-content" v-html="previewContent || '预览内容将在此显示...'" />
            </el-card>
          </el-form-item>
        </div>

        <!-- ========== 步骤5: 审核与发布 ========== -->
        <div v-show="activeStep === 4" class="step-content">
          <div class="step-header">
            <h3><el-icon><Check /></el-icon> 审核与发布</h3>
          </div>
          <el-divider />

          <el-alert type="info" :closable="false" show-icon style="margin-bottom: 20px;">
            <template #title>请仔细核对以下信息，确认无误后发布活动</template>
          </el-alert>

          <el-descriptions :column="3" border>
            <el-descriptions-item label="活动名称">{{ formData.name || '未填写' }}</el-descriptions-item>
            <el-descriptions-item label="活动类型">{{ getTypeLabel(formData.type) }}</el-descriptions-item>
            <el-descriptions-item label="活动状态">{{ formData.status === 'active' ? '进行中' : '待启动' }}</el-descriptions-item>
            <el-descriptions-item label="开始日期">{{ formData.startDate || '未选择' }}</el-descriptions-item>
            <el-descriptions-item label="结束日期">{{ formData.endDate || '未选择' }}</el-descriptions-item>
            <el-descriptions-item label="负责团队">{{ formData.team || '未选择' }}</el-descriptions-item>
            <el-descriptions-item label="预算">{{ formatCurrency(formData.budget) }}</el-descriptions-item>
            <el-descriptions-item label="目标触达">{{ formData.targetReach?.toLocaleString() || 0 }}</el-descriptions-item>
            <el-descriptions-item label="目标转化率">{{ formData.targetConversion || 0 }}%</el-descriptions-item>
            <el-descriptions-item label="预期ROI">{{ formData.expectedRoi || 0 }}%</el-descriptions-item>
            <el-descriptions-item label="预期销售额">{{ formatCurrency(formData.expectedRevenue) }}</el-descriptions-item>
            <el-descriptions-item label="推广渠道" :span="3">
              <el-tag v-for="ch in formData.channels" :key="ch" size="small" style="margin-right: 4px;">
                {{ getChannelLabel(ch) }}
              </el-tag>
              <span v-if="!formData.channels?.length" style="color: #909399;">未选择</span>
            </el-descriptions-item>
            <el-descriptions-item label="活动描述" :span="3">{{ formData.description || '未填写' }}</el-descriptions-item>
            <el-descriptions-item label="活动亮点" :span="3">{{ formData.highlights || '未填写' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-form>
    </el-card>

    <!-- 底部操作栏 -->
    <div class="form-actions">
      <div class="actions-left">
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon> 取消
        </el-button>
        <el-button @click="handleSaveDraft" :loading="savingDraft">
          <el-icon><Document /></el-icon> 保存草稿
        </el-button>
        <el-button @click="handlePreview">
          <el-icon><View /></el-icon> 预览
        </el-button>
      </div>
      <div class="actions-right">
        <el-button @click="prevStep" :disabled="activeStep === 0">
          <el-icon><ArrowLeft /></el-icon> 上一步
        </el-button>
        <el-button type="primary" @click="nextStep" v-if="activeStep < 4">
          下一步 <el-icon><ArrowRight /></el-icon>
        </el-button>
        <el-button type="success" @click="handleSubmit" :loading="submitting" v-if="activeStep === 4">
          <el-icon><Check /></el-icon> 发布活动
        </el-button>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="活动预览"
      width="700px"
      top="5vh"
      :destroy-on-close="true"
    >
      <div class="preview-container">
        <div class="preview-header">
          <div class="preview-icon">
            <span class="icon-large">{{ getTypeIcon(formData.type) }}</span>
          </div>
          <div class="preview-info">
            <div class="preview-name">{{ formData.name || '未命名活动' }}</div>
            <div class="preview-meta">
              <el-tag :type="getTypeTag(formData.type)" size="small">{{ getTypeLabel(formData.type) }}</el-tag>
              <el-tag :type="formData.status === 'active' ? 'success' : 'warning'" size="small">
                {{ formData.status === 'active' ? '进行中' : '待启动' }}
              </el-tag>
              <span>{{ formData.startDate || '未选择' }} ~ {{ formData.endDate || '未选择' }}</span>
            </div>
          </div>
        </div>
        <el-divider />
        <div class="preview-body">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="预算">{{ formatCurrency(formData.budget) }}</el-descriptions-item>
            <el-descriptions-item label="目标触达">{{ formData.targetReach?.toLocaleString() || 0 }}</el-descriptions-item>
            <el-descriptions-item label="活动口号">{{ formData.slogan || '-' }}</el-descriptions-item>
            <el-descriptions-item label="推广渠道">
              <el-tag v-for="ch in formData.channels" :key="ch" size="small" style="margin-right: 4px;">
                {{ getChannelLabel(ch) }}
              </el-tag>
              <span v-if="!formData.channels?.length">未选择</span>
            </el-descriptions-item>
            <el-descriptions-item label="活动描述" :span="2">{{ formData.description || '-' }}</el-descriptions-item>
            <el-descriptions-item label="活动亮点" :span="2">{{ formData.highlights || '-' }}</el-descriptions-item>
          </el-descriptions>
          <div class="preview-content-area" v-html="formData.content || '暂无内容'"></div>
        </div>
      </div>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSubmit; previewVisible = false">
          <el-icon><Check /></el-icon> 确认发布
        </el-button>
      </template>
    </el-dialog>

    <!-- 提交成功对话框 -->
    <el-dialog v-model="showSuccessDialog" title="🎉 发布成功" width="420px" :close-on-click-modal="false">
      <div class="success-content">
        <el-icon class="success-icon" :size="64"><CircleCheck /></el-icon>
        <h3>营销活动已发布</h3>
        <p><strong>{{ formData.name }}</strong> 已成功发布</p>
        <p class="success-id">活动ID: {{ submittedId || 'CAM-2026-001' }}</p>
        <el-alert type="info" :closable="false" show-icon>
          <template #title>活动已进入执行阶段，请在活动列表中查看进度</template>
        </el-alert>
      </div>
      <template #footer>
        <el-button @click="showSuccessDialog = false">继续编辑</el-button>
        <el-button type="primary" @click="handleViewDetail">查看活动</el-button>
        <el-button type="success" @click="handleCreateAnother">创建下一个</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import {
  ArrowLeft, ArrowRight, Edit, Money, Share, Document, Check,
  Plus, Delete, Refresh, CircleCheck, View, Upload, Search,
  Clock, Warning, InformationFilled, Calendar, Phone, Message,
  Location, OfficeBuilding, Setting, User, Grid, Promotion,
  Files, Tickets, HomeFilled, Briefcase, Star, Medal, Trophy,
  Collection, Goods, DataLine, TrendCharts, Present, Odometer,
  Bell, UserFilled, ArrowDown, Close, CircleClose
} from '@element-plus/icons-vue'

// ==================== Router ====================
const router = useRouter()

// ==================== 引用 ====================
const formRef = ref<FormInstance>()
const activeStep = ref(0)
const submitting = ref(false)
const savingDraft = ref(false)
const previewVisible = ref(false)
const showSuccessDialog = ref(false)
const submittedId = ref('')

// ==================== 表单数据 ====================
const formData = reactive({
  // 基本信息
  name: '',
  type: 'promotion',
  slogan: '',
  status: 'pending',
  startDate: '',
  endDate: '',
  team: '',
  priority: 'medium',
  description: '',

  // 预算与目标
  budget: 0,
  targetReach: 0,
  targetConversion: 0,
  expectedRoi: 0,
  expectedRevenue: 0,
  targetCac: 0,
  successCriteria: '',

  // 渠道配置
  channels: [] as string[],

  // 内容
  content: '',
  highlights: '',

  // 附件
  attachments: [] as File[]
})

// ==================== 预算分配 ====================
const budgetAllocation = ref([
  { label: '广告投放', value: 30 },
  { label: '内容制作', value: 20 },
  { label: '渠道费用', value: 25 },
  { label: '活动运营', value: 15 },
  { label: '其他费用', value: 10 }
])

// ==================== 渠道配置详情 ====================
const channelConfigs = ref([
  { key: 'social', icon: '📱', label: '社交媒体', budget: 0, manager: '', remark: '' },
  { key: 'email', icon: '📧', label: '邮件营销', budget: 0, manager: '', remark: '' },
  { key: 'sms', icon: '💬', label: '短信营销', budget: 0, manager: '', remark: '' },
  { key: 'offline', icon: '🏢', label: '线下活动', budget: 0, manager: '', remark: '' },
  { key: 'partner', icon: '🤝', label: '合作伙伴', budget: 0, manager: '', remark: '' },
  { key: 'website', icon: '🌐', label: '官网', budget: 0, manager: '', remark: '' },
  { key: 'seo', icon: '🔍', label: 'SEO', budget: 0, manager: '', remark: '' },
  { key: 'paid', icon: '📊', label: '付费广告', budget: 0, manager: '', remark: '' }
])

// ==================== 计算属性 ====================
const totalAllocated = computed(() => {
  return budgetAllocation.value.reduce((sum, item) => sum + (item.value || 0), 0)
})

const selectedChannelDetails = computed(() => {
  return channelConfigs.value.filter(c => formData.channels.includes(c.key))
})

const previewContent = computed(() => {
  let content = formData.content || ''
  // 替换变量
  content = content.replace(/{{customer_name}}/g, '客户名称')
  content = content.replace(/{{campaign_name}}/g, formData.name || '活动名称')
  content = content.replace(/{{discount}}/g, '8折')
  content = content.replace(/{{link}}/g, '点击此处')
  return content
})

// ==================== 表单验证规则 ====================
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符之间', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  budget: [
    { required: true, message: '请输入预算金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '预算必须大于0', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入活动描述', trigger: 'blur' },
    { min: 10, message: '描述至少10个字符', trigger: 'blur' }
  ],
  content: [{ required: true, message: '请输入活动内容', trigger: 'blur' }],
  channels: [{ type: 'array', min: 1, message: '请至少选择一个推广渠道', trigger: 'change' }]
}

// ==================== 工具函数 ====================
const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    promotion: '促销活动',
    brand: '品牌活动',
    acquisition: '获客活动',
    member: '会员活动',
    holiday: '节日活动'
  }
  return map[type] || type
}

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    promotion: 'danger',
    brand: 'primary',
    acquisition: 'success',
    member: 'warning',
    holiday: 'info'
  }
  return map[type] || 'info'
}

const getTypeIcon = (type: string) => {
  const map: Record<string, string> = {
    promotion: '🎉',
    brand: '🏷️',
    acquisition: '📈',
    member: '👑',
    holiday: '🎊'
  }
  return map[type] || '📢'
}

const getChannelLabel = (channel: string) => {
  const map: Record<string, string> = {
    social: '社交媒体',
    email: '邮件营销',
    sms: '短信营销',
    offline: '线下活动',
    partner: '合作伙伴',
    website: '官网',
    seo: 'SEO',
    paid: '付费广告'
  }
  return map[channel] || channel
}

const formatCurrency = (value: number) => {
  if (!value) return 'SAR 0'
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0
  }).format(value)
}

// ==================== 方法 ====================
const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const nextStep = async () => {
  const stepFields = getStepFields(activeStep.value)
  if (stepFields.length > 0) {
    try {
      await formRef.value?.validateFields(stepFields)
      if (activeStep.value < 4) {
        activeStep.value++
      }
    } catch (error) {
      ElMessage.warning('请完善当前步骤的必填信息')
    }
  } else {
    if (activeStep.value < 4) {
      activeStep.value++
    }
  }
}

const getStepFields = (step: number): string[] => {
  const fieldMap: Record<number, string[]> = {
    0: ['name', 'type', 'startDate', 'endDate', 'description'],
    1: ['budget'],
    2: ['channels'],
    3: ['content'],
    4: []
  }
  return fieldMap[step] || []
}

const insertTag = (tag: string) => {
  formData.content += tag
  ElMessage.success(`已插入标签: ${tag}`)
}

const handleFileChange = (file: any) => {
  formData.attachments.push(file.raw)
  ElMessage.success(`已添加文件: ${file.name}`)
}

const handleFileRemove = (file: any) => {
  const index = formData.attachments.indexOf(file.raw)
  if (index > -1) {
    formData.attachments.splice(index, 1)
  }
}

const handleSaveDraft = async () => {
  savingDraft.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    localStorage.setItem('marketing_draft_data', JSON.stringify(formData))
    ElMessage.success('草稿已保存')
  } catch (error) {
    ElMessage.error('保存草稿失败')
  } finally {
    savingDraft.value = false
  }
}

const handlePreview = () => {
  if (!formData.name) {
    ElMessage.warning('请先填写活动名称')
    return
  }
  if (!formData.description) {
    ElMessage.warning('请先填写活动描述')
    return
  }
  previewVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))

    submittedId.value = `CAM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`

    ElMessage.success('活动发布成功！')
    showSuccessDialog.value = true
    localStorage.removeItem('marketing_draft_data')
  } catch (error) {
    ElMessage.error('发布失败，请检查表单')
  } finally {
    submitting.value = false
  }
}

const handleViewDetail = () => {
  showSuccessDialog.value = false
  router.push(`/marketing/detail/${submittedId.value}`)
}

const handleCreateAnother = () => {
  showSuccessDialog.value = false
  Object.assign(formData, {
    name: '',
    type: 'promotion',
    slogan: '',
    status: 'pending',
    startDate: '',
    endDate: '',
    team: '',
    priority: 'medium',
    description: '',
    budget: 0,
    targetReach: 0,
    targetConversion: 0,
    expectedRoi: 0,
    expectedRevenue: 0,
    targetCac: 0,
    successCriteria: '',
    channels: [],
    content: '',
    highlights: '',
    attachments: []
  })
  activeStep.value = 0
  ElMessage.success('已重置表单，可继续创建')
}

const handleBack = () => {
  if (formData.name || formData.description) {
    ElMessageBox.confirm('有未保存的数据，确定要离开吗？', '提示', {
      confirmButtonText: '确定离开',
      cancelButtonText: '继续填写',
      type: 'warning'
    }).then(() => {
      router.push('/marketing')
    }).catch(() => {})
  } else {
    router.push('/marketing')
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  const draft = localStorage.getItem('marketing_draft_data')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      ElMessageBox.confirm('发现未完成的草稿，是否恢复？', '草稿恢复', {
        confirmButtonText: '恢复草稿',
        cancelButtonText: '丢弃草稿',
        type: 'info'
      }).then(() => {
        Object.assign(formData, draftData)
        ElMessage.success('草稿已恢复')
      }).catch(() => {
        localStorage.removeItem('marketing_draft_data')
      })
    } catch (error) {
      localStorage.removeItem('marketing_draft_data')
    }
  }
})
</script>

<style scoped>
/* ==================== 全局容器 ==================== */
.marketing-create-page {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

/* ==================== 页面头部 ==================== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  padding: 8px 16px;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
}

.page-subtitle {
  margin: 2px 0 0 0;
  color: #909399;
  font-size: 13px;
}

.header-right {
  display: flex;
  gap: 8px;
}

/* ==================== 步骤条 ==================== */
.step-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.step-card :deep(.el-step__title) {
  font-size: 13px;
}

.step-card :deep(.el-step__description) {
  font-size: 11px;
}

/* ==================== 表单卡片 ==================== */
.form-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.step-content {
  padding: 8px 4px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.step-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-required {
  font-size: 12px;
  color: #F56C6C;
}

.step-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.form-hint {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
  line-height: 1.4;
}

/* ==================== 预算分配 ==================== */
.budget-allocation {
  margin-top: 16px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.sub-section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 15px;
  color: #1F2937;
}

.allocation-total {
  font-weight: 400;
  font-size: 14px;
  color: #6B7280;
}

.allocation-hint {
  margin-top: 8px;
  font-size: 13px;
  color: #6B7280;
}

.allocation-hint.allocation-error {
  color: #F56C6C;
}

/* ==================== 渠道配置 ==================== */
.channel-config {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
}

.channel-config:last-child {
  margin-bottom: 0;
}

.channel-config-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 15px;
  color: #303133;
}

.channel-config-icon {
  font-size: 20px;
}

/* ==================== 预览区域 ==================== */
.preview-card {
  background: #fafafa;
}

.preview-content {
  min-height: 100px;
  padding: 12px;
  line-height: 1.8;
  color: #303133;
}

/* ==================== 预览对话框 ==================== */
.preview-container {
  padding: 4px 0;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-large {
  font-size: 36px;
}

.preview-name {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.preview-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 4px;
}

.preview-body {
  padding: 8px 0;
}

.preview-content-area {
  margin-top: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  min-height: 80px;
  line-height: 1.8;
}

.upload-tip {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
}

/* ==================== 底部操作栏 ==================== */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
  gap: 12px;
  position: sticky;
  bottom: 0;
  z-index: 100;
  margin-top: -10px;
}

.actions-left,
.actions-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ==================== 成功对话框 ==================== */
.success-content {
  text-align: center;
  padding: 16px 0;
}

.success-icon {
  color: #67C23A;
  margin-bottom: 16px;
}

.success-content h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #303133;
}

.success-content p {
  margin: 4px 0;
  color: #606266;
}

.success-id {
  font-size: 14px;
  color: #409EFF;
  font-weight: 600;
  background: #ecf5ff;
  padding: 4px 16px;
  border-radius: 4px;
  display: inline-block;
  margin: 8px 0 !important;
}

.success-content .el-alert {
  margin-top: 16px;
  text-align: left;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .marketing-create-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left {
    width: 100%;
  }

  .header-right {
    width: 100%;
    justify-content: flex-start;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-left,
  .actions-right {
    justify-content: center;
  }

  .actions-right .el-button {
    flex: 1;
  }

  .step-card :deep(.el-step) {
    padding: 0 4px;
  }

  .step-card :deep(.el-step__title) {
    font-size: 11px;
  }

  .step-card :deep(.el-step__description) {
    display: none;
  }

  .channel-config {
    padding: 12px 14px;
  }

  .budget-allocation {
    padding: 12px 14px;
  }

  .preview-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }

  .form-actions {
    padding: 12px 16px;
  }

  .actions-left .el-button,
  .actions-right .el-button {
    font-size: 13px;
    padding: 8px 12px;
  }

  .step-header h3 {
    font-size: 16px;
  }

  .preview-name {
    font-size: 16px;
  }
}

/* ==================== 打印样式 ==================== */
@media print {
  .marketing-create-page {
    background: white;
    padding: 16px;
  }

  .form-actions,
  .header-right,
  .back-btn {
    display: none !important;
  }

  .step-card :deep(.el-step__icon) {
    display: none;
  }

  .page-subtitle {
    color: #303133 !important;
  }
}
</style>