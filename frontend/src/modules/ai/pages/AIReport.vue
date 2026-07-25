<!--
  文件路径: frontend/src/modules/ai/pages/AIReport.vue
  功能: AI报告生成 - 智能报告生成
  最后更新: 2026-07-25 12:49:10
-->

<template>
  <div class="ai-page">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/ai' }">AI智能</el-breadcrumb-item>
          <el-breadcrumb-item>AI报告生成</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">
          <el-icon class="ai-icon"><Magic /></el-icon>
          AI报告生成
        </h1>
        <p class="page-desc">智能报告生成</p>
      </div>
      <div class="header-right">
        <el-button @click="handleClear">
          <el-icon><Delete /></el-icon> 清空
        </el-button>
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon> 导出结果
        </el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="4" animated />
    </div>

    <template v-else>
      <!-- AI输入区域 -->
      <el-card class="input-card" shadow="hover">
        <div class="ai-input-area">
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="4"
            placeholder="请输入您的问题或需求..."
            class="ai-textarea"
          />
          <div class="input-actions">
            <el-upload
              v-if="showUpload"
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              :limit="1"
              class="upload-btn"
            >
              <el-button>
                <el-icon><Paperclip /></el-icon> 上传文件
              </el-button>
            </el-upload>
            <el-button type="primary" :loading="generating" @click="handleGenerate">
              <el-icon><Magic /></el-icon> 生成
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- AI响应区域 -->
      <el-card class="result-card" shadow="hover" v-if="result">
        <template #header>
          <div class="card-header">
            <span>
              <el-icon><ChatDotRound /></el-icon> AI响应
            </span>
            <el-tag type="success" size="small">生成完成</el-tag>
          </div>
        </template>
        <div class="result-content" v-html="result"></div>
        <div class="result-actions">
          <el-button size="small" @click="handleCopy">
            <el-icon><CopyDocument /></el-icon> 复制
          </el-button>
          <el-button size="small" @click="handleRegenerate">
            <el-icon><Refresh /></el-icon> 重新生成
          </el-button>
        </div>
      </el-card>

      <!-- 历史记录 -->
      <el-card class="history-card" shadow="hover" v-if="history.length > 0">
        <template #header>
          <div class="card-header">
            <span>历史记录</span>
            <el-button type="text" size="small" @click="handleClearHistory">清空</el-button>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="item in history"
            :key="item.id"
            :timestamp="formatDate(item.createdAt)"
            placement="top"
          >
            <div class="history-item">
              <div class="history-question">{{ item.question }}</div>
              <div class="history-answer">{{ item.answer }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <el-empty v-if="!result && history.length === 0" description="暂无数据，请开始使用AI助手" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Magic, Delete, Download, Paperclip, ChatDotRound, CopyDocument, Refresh } from '@element-plus/icons-vue';
import { formatDate } from '@/utils/format';
import { aiApi } from '@/api/ai';

const route = useRoute();
const router = useRouter();

// ==================== 状态 ====================
const loading = ref(false);
const generating = ref(false);
const inputText = ref('');
const result = ref('');
const history = ref<any[]>([]);
const uploadedFile = ref<File | null>(null);

// ==================== 页面类型 ====================
const pageType = computed(() => {
  const path = route.path;
  if (path.includes('/chat')) return 'Chat';
  if (path.includes('/contract')) return 'Contract';
  if (path.includes('/create')) return 'Create';
  if (path.includes('/customer-service')) return 'CustomerService';
  if (path.includes('/invoice')) return 'Invoice';
  if (path.includes('/ocr')) return 'OCR';
  if (path.includes('/qa')) return 'QA';
  if (path.includes('/report')) return 'Report';
  if (path.includes('/purchase-order')) return 'PurchaseOrder';
  if (path.includes('/quotation')) return 'Quotation';
  if (path.includes('/inventory')) return 'Inventory';
  if (path.includes('/profit')) return 'Profit';
  if (path.includes('/purchase-suggestion')) return 'PurchaseSuggestion';
  if (path.includes('/sales-prediction')) return 'SalesPrediction';
  return 'Index';
});

const showUpload = computed(() => {
  return ['Invoice', 'OCR', 'Contract'].includes(pageType.value);
});

// ==================== 方法 ====================

/**
 * 生成AI响应
 */
const handleGenerate = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入内容');
    return;
  }

  generating.value = true;
  try {
    const data = {
      prompt: inputText.value,
      type: pageType.value,
      file: uploadedFile.value,
    };
    const response = await aiApi.generate(data);
    result.value = response.data.result;
    
    // 保存历史
    history.value.unshift({
      id: Date.now(),
      question: inputText.value,
      answer: result.value,
      createdAt: new Date().toISOString(),
    });
    
    ElMessage.success('生成完成');
  } catch (error: any) {
    ElMessage.error(error.message || '生成失败，请重试');
  } finally {
    generating.value = false;
  }
};

/**
 * 文件上传
 */
const handleFileChange = (file: any) => {
  uploadedFile.value = file.raw;
  ElMessage.success(已上传: );
};

/**
 * 复制结果
 */
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(result.value);
    ElMessage.success('已复制到剪贴板');
  } catch {
    ElMessage.error('复制失败');
  }
};

/**
 * 重新生成
 */
const handleRegenerate = () => {
  if (history.value.length > 0) {
    const last = history.value[0];
    inputText.value = last.question;
    handleGenerate();
  }
};

/**
 * 清空
 */
const handleClear = () => {
  inputText.value = '';
  result.value = '';
  uploadedFile.value = null;
};

/**
 * 清空历史
 */
const handleClearHistory = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有历史记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    history.value = [];
    ElMessage.success('已清空历史');
  } catch { /* 用户取消 */ }
};

/**
 * 导出结果
 */
const handleExport = () => {
  if (!result.value) {
    ElMessage.warning('没有可导出的内容');
    return;
  }
  const blob = new Blob([result.value], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = i_result_.txt;
  link.click();
  window.URL.revokeObjectURL(url);
  ElMessage.success('导出成功');
};

/**
 * 加载历史
 */
const loadHistory = async () => {
  loading.value = true;
  try {
    const response = await aiApi.getHistory({ type: pageType.value, limit: 20 });
    history.value = response.data || [];
  } catch (error: any) {
    // 静默失败
  } finally {
    loading.value = false;
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadHistory();
});
</script>

<style scoped lang="scss">
.ai-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    background: #fff;
    padding: 20px 24px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);

    .header-left {
      .page-title {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;

        .ai-icon {
          color: #409EFF;
          font-size: 28px;
        }
      }

      .page-desc {
        color: #909399;
        font-size: 14px;
        margin: 4px 0 0 36px;
      }
    }

    .header-right {
      display: flex;
      gap: 12px;
    }
  }

  .loading-container { padding: 40px 0; }

  .input-card {
    margin-bottom: 20px;
    border-radius: 12px;

    .ai-input-area {
      .ai-textarea {
        :deep(.el-textarea__inner) {
          border-radius: 8px;
          font-size: 15px;
          line-height: 1.8;
        }
      }

      .input-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;

        .upload-btn {
          :deep(.el-upload) {
            display: inline-block;
          }
        }

        .el-button {
          border-radius: 8px;
        }
      }
    }
  }

  .result-card {
    margin-bottom: 20px;
    border-radius: 12px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 16px;

      .el-icon {
        margin-right: 8px;
        color: #409EFF;
      }
    }

    .result-content {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      min-height: 100px;
      white-space: pre-wrap;
      line-height: 1.8;
      color: #303133;
    }

    .result-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
  }

  .history-card {
    border-radius: 12px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 16px;
    }

    .history-item {
      .history-question {
        font-weight: 500;
        color: #303133;
        margin-bottom: 4px;
      }
      .history-answer {
        color: #606266;
        font-size: 14px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}

@media (max-width: 768px) {
  .ai-page {
    padding: 12px;

    .page-header {
      flex-direction: column;
      gap: 12px;

      .header-right {
        width: 100%;
      }
    }
  }
}
</style>
