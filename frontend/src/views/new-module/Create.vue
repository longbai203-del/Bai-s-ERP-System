<template>
  <div class="create-module-page">
    <div class="page-header">
      <div class="header-left">
        <router-link to="/new-module" class="btn-back">
          <i class="fas fa-arrow-left"></i>
          返回列表
        </router-link>
        <h1 class="page-title">
          <i class="fas fa-plus-circle"></i>
          创建新项目
        </h1>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" @click="resetForm">
          <i class="fas fa-undo"></i>
          重置
        </button>
        <button class="btn btn-primary" @click="submitForm" :disabled="loading">
          <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
          {{ loading ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>

    <!-- 表单 -->
    <div class="form-container">
      <form @submit.prevent="submitForm" class="module-form">
        <!-- 基本信息 -->
        <div class="form-section">
          <h2 class="section-title">
            <i class="fas fa-info-circle"></i>
            基本信息
          </h2>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label required">项目名称</label>
              <input
                type="text"
                v-model="form.name"
                class="form-input"
                placeholder="请输入项目名称"
                required
                maxlength="100"
              />
              <span class="form-hint">最多100个字符</span>
            </div>

            <div class="form-group">
              <label class="form-label required">项目编码</label>
              <input
                type="text"
                v-model="form.code"
                class="form-input"
                placeholder="请输入项目编码"
                required
                maxlength="50"
              />
              <span class="form-hint">唯一标识，最多50个字符</span>
            </div>

            <div class="form-group">
              <label class="form-label required">状态</label>
              <select v-model="form.status" class="form-select" required>
                <option value="active">进行中</option>
                <option value="completed">已完成</option>
                <option value="archived">已归档</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">优先级</label>
              <select v-model="form.priority" class="form-select">
                <option value="low">低</option>
                <option value="medium" selected>中</option>
                <option value="high">高</option>
                <option value="critical">紧急</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="form-section">
          <h2 class="section-title">
            <i class="fas fa-align-left"></i>
            详细信息
          </h2>
          <div class="form-group">
            <label class="form-label">描述</label>
            <textarea
              v-model="form.description"
              class="form-textarea"
              rows="4"
              placeholder="请输入项目描述"
              maxlength="1000"
            ></textarea>
            <span class="form-hint">{{ form.description.length }}/1000</span>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">开始日期</label>
              <input
                type="date"
                v-model="form.start_date"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">结束日期</label>
              <input
                type="date"
                v-model="form.end_date"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- 负责人信息 -->
        <div class="form-section">
          <h2 class="section-title">
            <i class="fas fa-user"></i>
            负责人信息
          </h2>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">负责人</label>
              <input
                type="text"
                v-model="form.assignee"
                class="form-input"
                placeholder="请输入负责人姓名"
              />
            </div>

            <div class="form-group">
              <label class="form-label">部门</label>
              <input
                type="text"
                v-model="form.department"
                class="form-input"
                placeholder="请输入部门名称"
              />
            </div>
          </div>
        </div>

        <!-- 标签 -->
        <div class="form-section">
          <h2 class="section-title">
            <i class="fas fa-tags"></i>
            标签
          </h2>
          <div class="form-group">
            <div class="tag-input-container">
              <input
                type="text"
                v-model="tagInput"
                class="form-input tag-input"
                placeholder="输入标签后按回车添加"
                @keydown.enter.prevent="addTag"
              />
              <button class="btn-tag-add" @click.prevent="addTag">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="tags-container">
              <span
                v-for="tag in form.tags"
                :key="tag"
                class="tag-item"
              >
                <i class="fas fa-tag"></i>
                {{ tag }}
                <button class="tag-remove" @click="removeTag(tag)">
                  <i class="fas fa-times"></i>
                </button>
              </span>
              <span v-if="form.tags.length === 0" class="text-muted">
                暂无标签
              </span>
            </div>
          </div>
        </div>

        <!-- 附件 -->
        <div class="form-section">
          <h2 class="section-title">
            <i class="fas fa-paperclip"></i>
            附件
          </h2>
          <div class="form-group">
            <div class="file-upload-area" @dragover.prevent @drop.prevent="handleDrop">
              <input
                type="file"
                ref="fileInput"
                class="file-input"
                multiple
                @change="handleFileSelect"
              />
              <div class="upload-placeholder">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>拖拽文件到此处，或点击选择文件</p>
                <span class="text-muted">支持 PDF、Word、Excel、图片等格式</span>
              </div>
            </div>
            <div v-if="form.attachments.length > 0" class="attachment-list">
              <div
                v-for="(file, index) in form.attachments"
                :key="index"
                class="attachment-item"
              >
                <i class="fas" :class="getFileIcon(file.type)"></i>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <button class="btn-remove-file" @click="removeFile(index)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import { useToast } from '@/composables/useToast';

export default {
  name: 'NewModuleCreate',
  setup() {
    const router = useRouter();
    const { showToast } = useToast();
    const loading = ref(false);
    const tagInput = ref('');
    const fileInput = ref(null);

    // 表单数据
    const form = reactive({
      name: '',
      code: '',
      status: 'active',
      priority: 'medium',
      description: '',
      start_date: '',
      end_date: '',
      assignee: '',
      department: '',
      tags: [],
      attachments: []
    });

    // 添加标签
    const addTag = () => {
      const tag = tagInput.value.trim();
      if (tag && !form.tags.includes(tag)) {
        form.tags.push(tag);
        tagInput.value = '';
      }
    };

    // 移除标签
    const removeTag = (tag) => {
      form.tags = form.tags.filter(t => t !== tag);
    };

    // 处理文件选择
    const handleFileSelect = (event) => {
      const files = event.target.files;
      addFiles(files);
      fileInput.value.value = '';
    };

    // 处理拖拽
    const handleDrop = (event) => {
      const files = event.dataTransfer.files;
      addFiles(files);
    };

    // 添加文件
    const addFiles = (files) => {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          showToast(`文件 ${file.name} 超过10MB限制`, 'warning');
          continue;
        }
        form.attachments.push({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        });
      }
    };

    // 移除文件
    const removeFile = (index) => {
      form.attachments.splice(index, 1);
    };

    // 获取文件图标
    const getFileIcon = (type) => {
      if (type.includes('pdf')) return 'fa-file-pdf';
      if (type.includes('word') || type.includes('document')) return 'fa-file-word';
      if (type.includes('excel') || type.includes('sheet')) return 'fa-file-excel';
      if (type.includes('image')) return 'fa-file-image';
      if (type.includes('zip') || type.includes('archive')) return 'fa-file-archive';
      return 'fa-file';
    };

    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // 提交表单
    const submitForm = async () => {
      if (!form.name || !form.code) {
        showToast('请填写项目名称和编码', 'warning');
        return;
      }

      loading.value = true;
      try {
        const formData = new FormData();
        Object.keys(form).forEach(key => {
          if (key === 'attachments') {
            form.attachments.forEach((file, index) => {
              formData.append(`attachments[${index}]`, file.file);
            });
          } else if (key === 'tags') {
            formData.append('tags', JSON.stringify(form.tags));
          } else {
            formData.append(key, form[key]);
          }
        });

        const response = await api.post('/new-module', formData);
        showToast('创建成功！', 'success');
        router.push(`/new-module/${response.data.id}`);
      } catch (error) {
        console.error('创建失败:', error);
        showToast('创建失败，请重试', 'error');
      } finally {
        loading.value = false;
      }
    };

    // 重置表单
    const resetForm = () => {
      if (confirm('确定要重置所有表单数据吗？')) {
        Object.assign(form, {
          name: '',
          code: '',
          status: 'active',
          priority: 'medium',
          description: '',
          start_date: '',
          end_date: '',
          assignee: '',
          department: '',
          tags: [],
          attachments: []
        });
        tagInput.value = '';
        showToast('已重置', 'info');
      }
    };

    return {
      form,
      loading,
      tagInput,
      fileInput,
      addTag,
      removeTag,
      handleFileSelect,
      handleDrop,
      removeFile,
      getFileIcon,
      formatFileSize,
      submitForm,
      resetForm
    };
  }
};
</script>

<style scoped>
.create-module-page {
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

.form-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.module-form {
  max-width: 100%;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #E2E8F0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #4A90D9;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-weight: 500;
  color: #4A5568;
  font-size: 14px;
}

.form-label.required::after {
  content: '*';
  color: #E53E3E;
  margin-left: 4px;
}

.form-input,
.form-select,
.form-textarea {
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4A90D9;
  box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-hint {
  font-size: 12px;
  color: #A0AEC0;
}

.tag-input-container {
  display: flex;
  gap: 8px;
}

.tag-input {
  flex: 1;
}

.btn-tag-add {
  padding: 8px 16px;
  background: #4A90D9;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-tag-add:hover {
  background: #3A7BC8;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
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

.tag-remove {
  background: none;
  border: none;
  color: #4A90D9;
  cursor: pointer;
  padding: 0 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.tag-remove:hover {
  opacity: 1;
}

.file-upload-area {
  border: 2px dashed #E2E8F0;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: border-color 0.2s;
}

.file-upload-area:hover {
  border-color: #4A90D9;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder i {
  font-size: 48px;
  color: #A0AEC0;
  margin-bottom: 12px;
}

.upload-placeholder p {
  margin: 8px 0;
  color: #4A5568;
}

.attachment-list {
  margin-top: 16px;
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

.file-name {
  flex: 1;
  font-size: 14px;
  color: #2D3748;
}

.file-size {
  font-size: 12px;
  color: #A0AEC0;
}

.btn-remove-file {
  background: none;
  border: none;
  color: #E53E3E;
  cursor: pointer;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-remove-file:hover {
  opacity: 1;
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
}

.btn-primary {
  background: #4A90D9;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #3A7BC8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #F7FAFC;
  color: #4A5568;
  border: 1px solid #E2E8F0;
}

.btn-secondary:hover {
  background: #EDF2F7;
}

.text-muted {
  color: #A0AEC0;
}

@media (max-width: 768px) {
  .form-grid {
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