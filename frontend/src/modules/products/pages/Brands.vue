<template>
  <div class="brands-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h1>
          <i class="fas fa-trademark" style="color:#4F46E5;"></i>
          品牌管理
          <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">商品品牌</span>
        </h1>
        <div class="subtitle">管理商品品牌信息</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-success" @click="showCreateModal">
          <i class="fas fa-plus"></i> 新建品牌
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
        <div class="stat-label">🏷️ 品牌总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number success">{{ stats.active }}</div>
        <div class="stat-label">✅ 活跃</div>
      </div>
      <div class="stat-card">
        <div class="stat-number warning">{{ stats.inactive }}</div>
        <div class="stat-label">⛔ 停用</div>
      </div>
      <div class="stat-card">
        <div class="stat-number purple">{{ stats.totalProducts }}</div>
        <div class="stat-label">📦 关联商品</div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <input 
        type="text" 
        class="search-box" 
        v-model="searchKeyword" 
        placeholder="🔍 搜索品牌名称..."
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

    <!-- 品牌网格 -->
    <div class="brand-grid" v-if="filteredBrands.length > 0">
      <div class="brand-card" v-for="brand in paginatedBrands" :key="brand.id">
        <div class="brand-logo" :style="{ background: brand.color + '20', color: brand.color }">
          {{ brand.logo || '🏷️' }}
        </div>
        <div class="brand-name">{{ brand.name }}</div>
        <div class="brand-desc">{{ brand.description || '无描述' }}</div>
        <div class="brand-meta">
          <span class="brand-count">📦 {{ brand.productCount || 0 }} 个商品</span>
          <span class="badge" :class="brand.status === 'active' ? 'badge-success' : 'badge-danger'">
            {{ brand.status === 'active' ? '活跃' : '停用' }}
          </span>
        </div>
        <div class="brand-actions">
          <button class="btn-icon btn-icon-primary" @click="editBrand(brand.id)" title="编辑">
            <i class="fas fa-edit"></i>
          </button>
          <button 
            class="btn-icon" 
            :class="brand.status === 'active' ? 'btn-icon-warning' : 'btn-icon-success'"
            @click="toggleBrand(brand.id)"
            :title="brand.status === 'active' ? '停用' : '启用'"
          >
            <i class="fas" :class="brand.status === 'active' ? 'fa-pause' : 'fa-play'"></i>
          </button>
          <button class="btn-icon btn-icon-danger" @click="deleteBrand(brand.id)" title="删除">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <i class="fas fa-trademark"></i>
      <p>暂无品牌数据</p>
      <span class="hint">点击「新建品牌」创建</span>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="filteredBrands.length > 0">
      <span class="info">共 {{ filteredBrands.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页</span>
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

    <!-- 品牌编辑模态框 -->
    <div class="modal-overlay" :class="{ active: showModal }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingId ? '编辑品牌' : '新建品牌' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveBrand" autocomplete="off">
            <div class="form-group">
              <label>品牌名称 <span class="required">*</span></label>
              <input type="text" v-model="form.name" placeholder="输入品牌名称" required>
            </div>
            <div class="form-group">
              <label>Logo</label>
              <input type="text" v-model="form.logo" placeholder="输入Logo图标或Emoji">
            </div>
            <div class="form-group">
              <label>描述</label>
              <textarea v-model="form.description" placeholder="品牌描述..." rows="2"></textarea>
            </div>
            <div class="form-group">
              <label>官网地址</label>
              <input type="url" v-model="form.website" placeholder="https://example.com">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>颜色</label>
                <input type="color" v-model="form.color" style="padding:4px;height:42px;">
              </div>
              <div class="form-group">
                <label>状态</label>
                <select v-model="form.status">
                  <option value="active">活跃</option>
                  <option value="inactive">停用</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveBrand">
            <i class="fas fa-save"></i> 保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Brands',
  data() {
    return {
      brands: [],
      filteredBrands: [],
      loading: false,
      currentPage: 1,
      pageSize: 8,
      searchKeyword: '',
      selectedStatus: '',
      showModal: false,
      editingId: null,
      form: {
        name: '',
        logo: '🏷️',
        description: '',
        website: '',
        color: '#4F46E5',
        status: 'active'
      }
    }
  },
  computed: {
    stats() {
      const total = this.brands.length
      const active = this.brands.filter(b => b.status === 'active').length
      const inactive = this.brands.filter(b => b.status === 'inactive').length
      const totalProducts = this.brands.reduce((sum, b) => sum + (b.productCount || 0), 0)
      return { total, active, inactive, totalProducts }
    },
    totalPages() {
      return Math.ceil(this.filteredBrands.length / this.pageSize) || 1
    },
    paginatedBrands() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredBrands.slice(start, end)
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
    this.loadBrands()
  },
  methods: {
    loadBrands() {
      this.loading = true
      try {
        const saved = localStorage.getItem('brand_data')
        if (saved) {
          this.brands = JSON.parse(saved)
        } else {
          this.brands = this.getMockBrands()
          localStorage.setItem('brand_data', JSON.stringify(this.brands))
        }
      } catch (e) {
        this.brands = this.getMockBrands()
      }
      this.filteredBrands = [...this.brands]
      this.loading = false
    },
    getMockBrands() {
      return [
        { id: 'BRAND001', name: '3M', logo: '🔵', color: '#1E40AF', description: '3M汽车护理产品', website: 'https://www.3m.com', status: 'active', productCount: 0 },
        { id: 'BRAND002', name: 'Turtle Wax', logo: '🐢', color: '#10B981', description: '龟牌汽车护理', website: 'https://www.turtlewax.com', status: 'active', productCount: 0 },
        { id: 'BRAND003', name: 'Meguiars', logo: '⭐', color: '#F59E0B', description: '美光汽车护理', website: 'https://www.meguiars.com', status: 'active', productCount: 0 },
        { id: 'BRAND004', name: 'SONAX', logo: '🇩🇪', color: '#EF4444', description: '德国索纳克斯', website: 'https://www.sonax.com', status: 'inactive', productCount: 0 },
        { id: 'BRAND005', name: 'CarPro', logo: '🚗', color: '#8B5CF6', description: '专业汽车护理品牌', website: 'https://carpro.com', status: 'active', productCount: 0 }
      ]
    },
    saveBrands() {
      try {
        localStorage.setItem('brand_data', JSON.stringify(this.brands))
      } catch (e) {}
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
      let filtered = [...this.brands]
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(b => 
          b.name.toLowerCase().includes(keyword) ||
          (b.description && b.description.toLowerCase().includes(keyword))
        )
      }
      if (this.selectedStatus) {
        filtered = filtered.filter(b => b.status === this.selectedStatus)
      }
      this.filteredBrands = filtered
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
        logo: '🏷️',
        description: '',
        website: '',
        color: '#4F46E5',
        status: 'active'
      }
      this.showModal = true
    },
    editBrand(id) {
      const brand = this.brands.find(b => b.id === id)
      if (!brand) return
      this.editingId = id
      this.form = { ...brand }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editingId = null
    },
    saveBrand() {
      if (!this.form.name) {
        alert('请输入品牌名称')
        return
      }

      if (this.editingId) {
        const index = this.brands.findIndex(b => b.id === this.editingId)
        if (index >= 0) {
          this.brands[index] = { ...this.brands[index], ...this.form }
        }
        alert('✅ 品牌已更新')
      } else {
        const newBrand = {
          id: 'BRAND' + Date.now().toString().slice(-6),
          ...this.form,
          productCount: 0
        }
        this.brands.push(newBrand)
        alert('✅ 品牌已创建')
      }

      this.saveBrands()
      this.filteredBrands = [...this.brands]
      this.closeModal()
    },
    toggleBrand(id) {
      const brand = this.brands.find(b => b.id === id)
      if (brand) {
        brand.status = brand.status === 'active' ? 'inactive' : 'active'
        this.saveBrands()
        this.filteredBrands = [...this.brands]
        alert(`✅ 品牌 "${brand.name}" 已${brand.status === 'active' ? '启用' : '停用'}`)
      }
    },
    deleteBrand(id) {
      const brand = this.brands.find(b => b.id === id)
      if (!brand) return
      if ((brand.productCount || 0) > 0) {
        if (!confirm(`品牌 "${brand.name}" 下还有 ${brand.productCount} 个商品，确定删除？`)) return
      } else if (!confirm(`确认删除品牌 "${brand.name}"？`)) return
      this.brands = this.brands.filter(b => b.id !== id)
      this.filteredBrands = [...this.brands]
      this.saveBrands()
      alert('🗑️ 品牌已删除')
    },
    refreshData() {
      this.loadBrands()
      alert('✅ 数据已刷新')
    }
  }
}
</script>

<style scoped>
.brands-container {
  padding: 20px;
  max-width: 1400px;
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
  grid-template-columns: repeat(4, 1fr);
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
.stat-card .stat-number.warning { color: #F59E0B; }
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

.brand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.brand-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #E5E7EB;
  text-align: center;
  transition: all 0.3s ease;
}

.brand-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: #4F46E5;
}

.brand-logo {
  font-size: 40px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.brand-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.brand-desc {
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 12px;
}

.brand-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #F3F4F6;
}

.brand-count {
  font-size: 13px;
  color: #6B7280;
}

.brand-actions {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-top: 12px;
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

.form-group input[type="color"] {
  padding: 4px;
  height: 42px;
}

.form-group input[type="url"] {
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* 暗色模式 */
[data-theme="dark"] .stat-card,
[data-theme="dark"] .toolbar,
[data-theme="dark"] .brand-card,
[data-theme="dark"] .pagination,
[data-theme="dark"] .modal-content {
  background: #2C2C2E;
  border-color: #48484A;
}

[data-theme="dark"] .stat-card .stat-number,
[data-theme="dark"] .page-header h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .brand-desc,
[data-theme="dark"] .brand-count {
  color: #9CA3AF;
}

[data-theme="dark"] .brand-meta {
  border-color: #3A3A3C;
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

/* 响应式 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-row {
    grid-template-columns: 1fr;
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
  
  .brand-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .brands-container {
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