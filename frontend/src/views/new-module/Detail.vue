<template>
  <div class="detail-module-page" v-if="item">
    <div class="page-header">
      <div class="header-left">
        <router-link to="/new-module" class="btn-back">
          <i class="fas fa-arrow-left"></i>
          返回列表
        </router-link>
        <h1 class="page-title">
          <i class="fas fa-cube"></i>
          {{ item.name }}
        </h1>
        <span :class="['badge', getStatusClass(item.status)]">
          {{ getStatusLabel(item.status) }}
        </span>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" @click="goToEdit">
          <i class="fas fa-edit"></i>
          编辑
        </button>
        <button class="btn btn-danger" @click="deleteItem">
          <i class="fas fa-trash"></i>
          删除
        </button>
      </div>
    </div>

    <!-- 详情内容 -->
    <div class="detail-container">
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="color: #4A90D9;">
            <i class="fas fa-code"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ item.code }}</div>
            <div class="stat-label">项目编码</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" :style="{ color: getPriorityColor(item.priority) }">
            <i class="fas fa-flag"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ getPriorityLabel(item.priority) }}</div>
            <div class="stat-label">优先级</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color: #28A745;">
            <i class="fas fa-user"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ item.assignee || '-' }}</div>
            <div class="stat-label">负责人</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color: #6C757D;">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ formatDate(item.created_at) }}</div>
            <div class="stat-label">创建时间</div>
          </div>
        </div>
      </div>

      <!-- 详细信息 -->
      <div class="detail-grid">
        <div class="detail-main">
          <div class="detail-section">
            <h3 class="section-title">
              <i class="fas fa-align-left"></i>
              项目描述
            </h3>
            <p class="description-text">{{ item.description || '暂无描述' }}</p>
          </div>

          <div class="detail-section">
            <h3 class="section-title">
              <i class="fas fa-tags"></i>
              标签
            </h3>
            <div class="tags-container">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="tag-item"
              >
                <i class="fas fa-tag"></i>
                {{ tag }}
              </span>
              <span v-if="!item.tags || item.tags.length === 0" class="text-muted">
                暂无标签
              </span>
            </div>
          </div>

          <div class="detail-section">
            <h3 class="section-title">
              <i class="fas fa-paperclip"></i>
              附件
            </h3>
            <div v-if="item.attachments && item.attachments.length > 0" class="attachment-list">
              <div
                v-for="(file, index) in item.attachments"
                :key="index"
                class="attachment-item"
              >
                <i class="fas" :class="getFileIcon(file.type)"></i>
                <a :href="file.url" target="_blank" class="file-link">
                  {{ file.name }}
                </a>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <button class="btn-download" @click="downloadFile(file)">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
            <p v-else class="text-muted">暂无附件</p>
          </div>

          <div class="detail-section">
            <h3 class="section-title">
              <i class="fas fa-history"></i>
              活动记录
            </h3>
            <div v-if="activities.length > 0" class="activity-timeline">
              <div
                v-for="activity in activities"
                :key="activity.id"
                class="activity-item"
              >
                <div class="activity-icon">
                  <i class="fas" :class="getActivityIcon(activity.type)"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-message">{{ activity.message }}</div>
                  <div class="activity-time">{{ formatDate(activity.created_at) }}</div>
                </div>
              </div>
            </div>
            <p v-else class="text-muted">暂无活动记录</p>
          </div>
        </div>

        <div class="detail-sidebar">
          <div class="info-card">
            <h4 class="info-title">基本信息</h4>
            <div class="info-item">
              <span class="info-label">状态</span>
              <span :class="['badge', getStatusClass(item.status)]">
                {{ getStatusLabel(item.status) }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">优先级</span>
              <span :style="{ color: getPriorityColor(item.priority) }">
                {{ getPriorityLabel(item.priority) }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">负责人</span>
              <span>{{ item.assignee || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">部门</span>
              <span>{{ item.department || '-' }}</span>
            </div>
          </div>

          <div class="info-card">
            <h4 class="info-title">时间信息</h4>
            <div class="info-item">
              <span class="info-label">开始日期</span>
              <span>{{ item.start_date ? formatDate(item.start_date) : '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">结束日期</span>
              <span>{{ item.end_date ? formatDate(item.end_date) : '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">最后更新</span>
              <span>{{ formatDate(item.updated_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="loading" class="loading-container">
    <i class="fas fa-spinner fa-spin"></i>
    加载中...
  </div>
  <div v-else class="error-container">
    <i class="fas fa-exclamation-triangle"></i>
    <p>项目不存在或已被删除</p>
    <router-link to="/new-module" class="btn btn-primary">返回列表</router-link>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { api } from '@/services/api';
import { useToast } from '@/composables/useToast';

export default {
  name: 'NewModuleDetail',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { showToast } = useToast();
    const loading = ref(true);
    const item = ref(null);
    const activities = ref([]);

    const fetchDetail = async () => {
      const id = route.params.id;
      if (!id) {
        router.push('/new-module');
        return;
      }

      loading.value = true;
      try {
        const response = await api.get(`/new-module/${id}`);
        item.value = response.data;
        activities.value = response.data.activities || [];
      } catch (error) {
        console.error('加载详情失败:', error);
        if (error.response?.status === 404) {
          showToast('项目不存在', 'error');
        } else {
          showToast('加载详情失败', 'error');
        }
      } finally {
        loading.value = false;
      }
    };

    const goToEdit = () => {
      router.push(`/new-module/${item.value.id}/edit`);
    };

    const deleteItem = async () => {
      if (!confirm(`确定要删除项目 "${item.value.name}" 吗？此操作不可恢复！`)) {
        return;
      }

      try {
        await api.delete(`/new-module/${item.value.id}`);
        showToast('删除成功', 'success');
        router.push('/new-module');
      } catch (error) {
        console.error('删除失败:', error);
        showToast('删除失败，请重试', 'error');
      }
    };

    const downloadFile = (file) => {
      if (file.url) {
        window.open(file.url, '_blank');
      }
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '-';
      const date = new Date(dateStr);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getStatusLabel = (status) => {
      const map = {
        active: '进行中',
        completed: '已完成',
        archived: '已归档'
      };
      return map[status] || status;
    };

    const getStatusClass = (status) => {
      const map = {
        active: 'badge-primary',
        completed: 'badge-success',
        archived: 'badge-secondary'
      };
      return map[status] || 'badge-secondary';
    };

    const getPriorityLabel = (priority) => {
      const map = {
        low: '低',
        medium: '中',
        high: '高',
        critical: '紧急'
      };
      return map[priority] || priority;
    };

    const getPriorityColor = (priority) => {
      const map = {
        low: '#6C757D',
        medium: '#4A90D9',
        high: '#D69E2E',
        critical: '#E53E3E'
      };
      return map[priority] || '#6C757D';
    };

    const getFileIcon = (type) => {
      if (type?.includes('pdf')) return 'fa-file-pdf';
      if (type?.includes('word') || type?.includes('document')) return 'fa-file-word';
      if (type?.includes('excel') || type?.includes('sheet')) return 'fa-file-excel';
      if (type?.includes('image')) return 'fa-file-image';
      if (type?.includes('zip') || type?.includes('archive')) return 'fa-file-archive';
      return 'fa-file';
    };

    const formatFileSize = (bytes) => {
      if (!bytes) return '-';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getActivityIcon = (type) => {
      const map = {
        create: 'fa-plus-circle text-success',
        update: 'fa-edit text-info',
        delete: 'fa-trash text-danger',
        status_change: 'fa-exchange-alt text-warning'
      };
      return map[type] || 'fa-circle text-muted';
    };

    onMounted(() => {
      fetchDetail();
    });

    return {
      loading,
      item,
      activities,
      goToEdit,
      deleteItem,
      downloadFile,
      formatDate,
      getStatusLabel,
      getStatusClass,
      getPriorityLabel,
      getPriorityColor,
      getFileIcon,
      formatFileSize,
      getActivityIcon
    };
  }
};
</script>

<style scoped>
.detail-module-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #4A5568;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #F7FAFC;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #2D3748;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.page-title i {
  color: #4A90D9;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.badge-primary {
  background: #EBF4FF;
  color: #4A90D9;
}

.badge-success {
  background: #E6F7E6;
  color: #28A745;
}

.badge-secondary {
  background: #F1F3F5;
  color: #6C757D;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #F7FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #2D3748;
}

.stat-label {
  font-size: 14px;
  color: #718096;
}

.detail-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.detail-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.detail-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #E2E8F0;
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #4A90D9;
}

.description-text {
  color: #4A5568;
  line-height: 1.6;
  white-space: pre-wrap;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: #EBF4FF;
  color: #4A90D9;
  border-radius: 20px;
  font-size: 13px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F7FAFC;
  border-radius: 6px;
}

.attachment-item i {
  font-size: 20px;
  color: #4A90D9;
}

.file-link {
  flex: 1;
  color: #4A90D9;
  text-decoration: none;
}

.file-link:hover {
  text-decoration: underline;
}

.file-size {
  font-size: 12px;
  color: #A0AEC0;
}

.btn-download {
  background: none;
  border: none;
  color: #4A90D9;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-download:hover {
  background: #EBF4FF;
}

.activity-timeline {
  position: relative;
  padding-left: 20px;
}

.activity-timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #E2E8F0;
}

.activity-item {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  position: relative;
}

.activity-item:last-child {
  margin-bottom: 0;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F7FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-message {
  color: #2D3748;
  font-size: 14px;
}

.activity-time {
  font-size: 12px;
  color: #A0AEC0;
  margin-top: 4px;
}

.text-success {
  color: #28A745 !important;
}

.text-info {
  color: #17A2B8 !important;
}

.text-danger {
  color: #E53E3E !important;
}

.text-warning {
  color: #D69E2E !important;
}

.text-muted {
  color: #A0AEC0;
}

.info-card {
  background: #F7FAFC;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-card:last-child {
  margin-bottom: 0;
}

.info-title {
  font-size: 14px;
  font-weight: 600;
  color: #4A5568;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #EDF2F7;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #718096;
  font-size: 13px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #4A5568;
}

.loading-container i {
  font-size: 40px;
  margin-bottom: 16px;
  color: #4A90D9;
}

.error-container i {
  font-size: 48px;
  color: #E53E3E;
  margin-bottom: 16px;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary {
  background: #4A90D9;
  color: white;
}

.btn-primary:hover {
  background: #3A7BC8;
}

.btn-secondary {
  background: #F7FAFC;
  color: #4A5568;
  border: 1px solid #E2E8F0;
}

.btn-secondary:hover {
  background: #EDF2F7;
}

.btn-danger {
  background: #E53E3E;
  color: white;
}

.btn-danger:hover {
  background: #C53030;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    flex-wrap: wrap;
  }

  .page-actions {
    justify-content: stretch;
  }

  .page-actions .btn {
    flex: 1;
  }
}
</style>