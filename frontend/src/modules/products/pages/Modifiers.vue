<template>
  <div class="modifier-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h1>
          <i class="fas fa-plus-circle" style="color:#4F46E5;"></i>
          附加项管理
          <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">增值服务</span>
        </h1>
        <div class="subtitle">管理商品附加项/选项 · 如洗车附加服务、增值选项</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-success" @click="showCreateModal">
          <i class="fas fa-plus"></i> 新建附加项
        </button>
        <button class="btn btn-outline" @click="refreshData">
          <i class="fas fa-sync"></i>
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number primary">{{ stats.total }}</div>
        <div class="stat-label">📊 附加项总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number success">{{ stats.active }}</div>
        <div class="stat-label">✅ 活跃</div>
      </div>
      <div class="stat-card">
        <div class="stat-number purple">{{ stats.products }}</div>
        <div class="stat-label">📦 关联商品</div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <input 
        type="text" 
        class="search-box" 
        v-model="searchKeyword" 
        placeholder="🔍 搜索附加项名称..."
        @keyup.enter="handleSearch"
      />
      <select class="filter-select" v-model="selectedStatus" @change="handleSearch">
        <option value="">全部状态</option>
        <option value="active">活跃</option>
        <option value="inactive">停用</option>
      </select>
      <button class="btn btn-primary" @click="handleSearch">
        <i class="fas fa-search"></i> 搜索
      </button>
      <button class="btn btn-outline" @click="resetSearch">
        <i class="fas fa-undo"></i> 重置
      </button>
    </div>

    <!-- 附加项列表 -->
    <div class="modifier-list" v-if="filteredModifiers.length > 0">
      <div class="modifier-item" v-for="modifier in paginatedModifiers" :key="modifier.id">
        <div class="modifier-info">
          <div>
            <div class="modifier-name">{{ modifier.name }}</div>
            <div class="modifier-desc">{{ modifier.desc || '无描述' }}</div>
          </div>
          <span class="modifier-price">+¥{{ formatPrice(modifier.price) }}</span>
          <span class="badge" :class="modifier.status === 'active' ? 'badge-success' : 'badge-danger'">
            {{ modifier.status === 'active' ? '活跃' : '停用' }}
          </span>
          <span class="modifier-products">📦 {{ modifier.products || 0 }}</span>
        </div>
        <div class="modifier-actions">
          <button class="btn-icon btn-icon-primary" @click="editModifier(modifier.id)" title="编辑">
            <i class="fas fa-edit"></i>
          </button>
          <button 
            class="btn-icon" 
            :class="modifier.status === 'active' ? 'btn-icon-warning' : 'btn-icon-success'"
            @click="toggleModifier(modifier.id)"
            :title="modifier.status === 'active' ? '停用' : '启用'"
          >
            <i class="fas" :class="modifier.status === 'active' ? 'fa-pause' : 'fa-play'"></i>
          </button>
          <button class="btn-icon btn-icon-danger" @click="deleteModifier(modifier.id)" title="删除">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <i class="fas fa-plus-circle"></i>
      <p>暂无附加项</p>
      <span class="hint">点击「新建附加项」创建</span>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="filteredModifiers.length > 0">
      <span class="info">共 {{ filteredModifiers.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页</span>
      <div class="btn-group">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button 
          v-for="page in pageNumbers" 
          :key="page"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- 附加项编辑模态框 -->
    <div class="modal-overlay" :class="{ active: showModal }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingId ? '编辑附加项' : '新建附加项' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveModifier" autocomplete="off">
            <div class="form-group">
              <label>附加项名称 <span class="required">*</span></label>
              <input type="text" v-model="form.name" placeholder="如: 真皮护理" required>
            </div>
            <div class="form-group">
              <label>价格 <span class="required">*</span></label>
              <input type="number" v-model.number="form.price" placeholder="0.00" step="0.01" min="0" required>
            </div>
            <div class="form-group">
              <label>描述</label>
              <textarea v-model="form.desc" placeholder="附加项描述..." rows="2"></textarea>
            </div>
            <div class="form-group">
              <label>状态</label>
              <select v-model="form.status">
                <option value="active">活跃</option>
                <option value="inactive">停用</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveModifier">
            <i class="fas fa-save"></i> 保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modifiers',
  data() {
    return {
      modifiers: [],
      filteredModifiers: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      searchKeyword: '',
      selectedStatus: '',
      showModal: false,
      editingId: null,
      form: {
        name: '',
        price: 0,
        desc: '',
        status: 'active'
      }
    }
  },
  computed: {
    stats() {
      const total = this.modifiers.length
      const active = this.modifiers.filter(m => m.status === 'active').length
      const products = this.modifiers.reduce((sum, m) => sum + (m.products || 0), 0)
      return { total, active, products }
    },
    totalPages() {
      return Math.ceil(this.filteredModifiers.length / this.pageSize) || 1
    },
    paginatedModifiers() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredModifiers.slice(start, end)
    },
    pageNumbers() {
      const pages = []
      const total = this.totalPages
      const current = this.currentPage
      if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
      } else {
        pages.push(1)
        if (current > 3) pages.push('...')
        for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) {
          pages.push(i)
        }
        if (current < total - 2) pages.push('...')
        pages.push(total)
      }
      return pages
    }
  },
  mounted() {
    this.loadModifiers()
  },
  methods: {
    loadModifiers() {
      this.loading = true
      try {
        const saved = localStorage.getItem('modifier_data')
        if (saved) {
          this.modifiers = JSON.parse(saved)
        } else {
          this.modifiers = this.getMockModifiers()
          localStorage.setItem('modifier_data', JSON.stringify(this.modifiers))
        }
      } catch (e) {
        this.modifiers = this.getMockModifiers()
      }
      this.filteredModifiers = [...this.modifiers]
      this.loading = false
    },
    getMockModifiers() {
      return [
        { id: 'MD-001', name: '真皮护理', price: 50, desc: '高级真皮座椅护理', products: 3, status: 'active' },
        { id: 'MD-002', name: '香薰服务', price: 30, desc: '车内香薰服务', products: 2, status: 'active' },
        { id: 'MD-003', name: '紫外线杀菌', price: 80, desc: '车内紫外线杀菌', products: 1, status: 'active' },
        { id: 'MD-004', name: '轮毂清洗', price: 40, desc: '轮毂深度清洗', products: 4, status: 'inactive' },
        { id: 'MD-005', name: '发动机舱清洁', price: 60, desc: '发动机舱深度清洁', products: 2, status: 'active' }
      ]
    },
    saveModifiers() {
      try {
        localStorage.setItem('modifier_data', JSON.stringify(this.modifiers))
      } catch (e) {}
    },
    formatPrice(price) {
      return (price || 0).toFixed(2)
    },
    handleSearch() {
      this.applyFilters()
    },
    resetSearch() {
      this.searchKeyword = ''
      this.selectedStatus = ''
      this.applyFilters()
    },
    applyFilters() {
      let filtered = [...this.modifiers]
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(m => 
          m.name.toLowerCase().includes(keyword) ||
          (m.desc && m.desc.toLowerCase().includes(keyword))
        )
      }
      if (this.selectedStatus) {
        filtered = filtered.filter(m => m.status === this.selectedStatus)
      }
      this.filteredModifiers = filtered
      this.currentPage = 1
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
    showCreateModal() {
      this.editingId = null
      this.form = {
        name: '',
        price: 0,
        desc: '',
        status: 'active'
      }
      this.showModal = true
    },
    editModifier(id) {
      const modifier = this.modifiers.find(m => m.id === id)
      if (!modifier) return
      this.editingId = id
      this.form = { ...modifier }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editingId = null
    },
    saveModifier() {
      if (!this.form.name) {
        alert('请输入附加项名称')
        return
      }
      if (this.form.price < 0) {
        alert('请输入有效的价格')
        return
      }

      if (this.editingId) {
        const index = this.modifiers.findIndex(m => m.id === this.editingId)
        if (index >= 0) {
          this.modifiers[index] = { ...this.modifiers[index], ...this.form }
        }
        alert('✅ 附加项已更新')
      } else {
        const newModifier = {
          id: 'MD-' + Date.now().toString().slice(-6),
          ...this.form,
          products: 0
        }
        this.modifiers.push(newModifier)
        alert('✅ 附加项已创建')
      }

      this.saveModifiers()
      this.filteredModifiers = [...this.modifiers]
      this.closeModal()
    },
    toggleModifier(id) {
      const modifier = this.modifiers.find(m => m.id === id)
      if (modifier) {
        modifier.status = modifier.status === 'active' ? 'inactive' : 'active'
        this.saveModifiers()
        this.filteredModifiers = [...this.modifiers]
        alert(`✅ 附加项 "${modifier.name}" 已${modifier.status === 'active' ? '启用' : '停用'}`)
      }
    },
    deleteModifier(id) {
      const modifier = this.modifiers.find(m => m.id === id)
      if (!modifier) return
      if (!confirm(`确认删除附加项 "${modifier.name}"？`)) return
      this.modifiers = this.modifiers.filter(m => m.id !== id)
      this.filteredModifiers = [...this.modifiers]
      this.saveModifiers()
      alert('🗑️ 附加项已删除')
    },
    refreshData() {
      this.loadModifiers()
      alert('✅ 数据已刷新')
    }
  }
}
</script>

<style scoped>
.modifier-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-header .subtitle {
  font-size: 14px;
  color: #6B7280;
  margin-top: 4px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-success {
  background: #10B981;
  color: white;
}
.btn-success:hover { background: #059669; }

.btn-outline {
  background: white;
  color: #1F2937;
  border: 1px solid #D1D5DB;
}
.btn-outline:hover { background: #F9FAFB; }

.btn-primary {
  background: #4F46E5;
  color: white;
}
.btn-primary:hover { background: #4338CA; }

.btn-secondary {
  background: #F3F4F6;
  color: #374151;
}
.btn-secondary:hover { background: #E5E7EB; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 14px 16px;
  border: 1px solid #E5E7EB;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-card .stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
}

.stat-card .stat-number.primary { color: #4F46E5; }
.stat-card .stat-number.success { color: #10B981; }
.stat-card .stat-number.purple { color: #8B5CF6; }

.stat-card .stat-label {
  font-size: 12px;
  color: #6B7280;
  margin-top: 2px;
}

.toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  align-items: center;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
}

.toolbar .search-box {
  flex: 1;
  min-width: 160px;
  padding: 8px 14px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.toolbar .search-box:focus {
  border-color: #4F46E5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.toolbar .filter-select {
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  min-width: 120px;
}

.modifier-list {
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  overflow: hidden;
}

.modifier-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #F3F4F6;
  transition: background 0.2s;
}

.modifier-item:last-child {
  border-bottom: none;
}

.modifier-item:hover {
  background: #F9FAFB;
}

.modifier-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.modifier-name {
  font-weight: 500;
  font-size: 15px;
}

.modifier-desc {
  font-size: 13px;
  color: #6B7280;
}

.modifier-price {
  font-weight: 600;
  color: #4F46E5;
  font-size: 15px;
}

.modifier-products {
  font-size: 13px;
  color: #6B7280;
}

.modifier-actions {
  display: flex;
  gap: 4px;
}

.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
}

.badge-success { background: #D1FAE5; color: #065F46; }
.badge-danger { background: #FEE2E2; color: #991B1B; }

.btn-icon {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid #D1D5DB;
  background: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover {
  transform: scale(1.05);
}

.btn-icon-primary { color: #4F46E5; border-color: #4F46E5; }
.btn-icon-primary:hover { background: #EEF2FF; }

.btn-icon-success { color: #10B981; border-color: #10B981; }
.btn-icon-success:hover { background: #D1FAE5; }

.btn-icon-warning { color: #F59E0B; border-color: #F59E0B; }
.btn-icon-warning:hover { background: #FEF3C7; }

.btn-icon-danger { color: #EF4444; border-color: #EF4444; }
.btn-icon-danger:hover { background: #FEE2E2; }

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9CA3AF;
}

.empty-state i {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
  color: #D1D5DB;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

.empty-state .hint {
  font-size: 13px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.pagination .info {
  font-size: 13px;
  color: #6B7280;
}

.pagination .btn-group {
  display: flex;
  gap: 4px;
}

.pagination .btn-group button {
  padding: 4px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.pagination .btn-group button:hover:not(:disabled) {
  background: #F3F4F6;
}

.pagination .btn-group button.active {
  background: #4F46E5;
  color: white;
  border-color: #4F46E5;
}

.pagination .btn-group button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: none;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.modal-overlay.active {
  display: flex;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 520px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(30px) scale(0.96);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #9CA3AF;
  padding: 0 4px;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #374151;
}

.modal-body {
  padding: 20px 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #E5E7EB;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #4B5563;
  margin-bottom: 4px;
}

.form-group .required {
  color: #EF4444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #4F46E5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
}

/* 暗色模式 */
[data-theme="dark"] .stat-card,
[data-theme="dark"] .toolbar,
[data-theme="dark"] .modifier-list,
[data-theme="dark"] .pagination,
[data-theme="dark"] .modal-content {
  background: #2C2C2E;
  border-color: #48484A;
}

[data-theme="dark"] .stat-card .stat-number,
[data-theme="dark"] .page-header h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .modifier-item {
  border-color: #3A3A3C;
}

[data-theme="dark"] .modifier-item:hover {
  background: #3A3A3C;
}

[data-theme="dark"] .modifier-desc,
[data-theme="dark"] .modifier-products {
  color: #9CA3AF;
}

[data-theme="dark"] .toolbar .search-box,
[data-theme="dark"] .toolbar .filter-select,
[data-theme="dark"] .form-group input,
[data-theme="dark"] .form-group select,
[data-theme="dark"] .form-group textarea {
  background: #3A3A3C;
  border-color: #48484A;
  color: #F5F5F7;
}

[data-theme="dark"] .modal-overlay {
  background: rgba(0, 0, 0, 0.7);
}

[data-theme="dark"] .modal-header,
[data-theme="dark"] .modal-footer {
  border-color: #48484A;
}

[data-theme="dark"] .pagination .btn-group button {
  background: #3A3A3C;
  border-color: #48484A;
  color: #F5F5F7;
}

[data-theme="dark"] .pagination .btn-group button.active {
  background: #4F46E5;
  color: white;
  border-color: #4F46E5;
}

[data-theme="dark"] .btn-outline {
  background: #2C2C2E;
  border-color: #48484A;
  color: #F5F5F7;
}

[data-theme="dark"] .btn-outline:hover {
  background: #3A3A3C;
}

[data-theme="dark"] .btn-secondary {
  background: #3A3A3C;
  color: #F5F5F7;
}

[data-theme="dark"] .btn-secondary:hover {
  background: #4A4A4C;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar .search-box {
    width: 100%;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .header-actions button {
    flex: 1;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .modifier-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .modifier-info {
    flex-wrap: wrap;
  }
  
  .modifier-actions {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .modifier-container {
    padding: 12px;
  }
  
  .page-header h1 {
    font-size: 20px;
  }
  
  .modal-content {
    width: 98%;
    margin: 8px;
  }
  
  .pagination {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .pagination .btn-group {
    justify-content: center;
  }
}
</style>