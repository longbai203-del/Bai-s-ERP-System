<template>
  <div class="categories-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h1>
          <i class="fas fa-tags" style="color:#4F46E5;"></i>
          分类管理
          <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">商品分类</span>
        </h1>
        <div class="subtitle">管理商品分类，支持层级结构</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-success" @click="showCreateModal">
          <i class="fas fa-plus"></i> 新建分类
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
        <div class="stat-label">📊 分类总数</div>
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
        placeholder="🔍 搜索分类名称..."
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

    <!-- 分类列表 -->
    <div class="table-container">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th style="min-width:200px;">分类名称</th>
              <th>描述</th>
              <th style="text-align:center;">排序</th>
              <th style="text-align:center;">商品数</th>
              <th style="text-align:center;">状态</th>
              <th style="text-align:center;min-width:140px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" style="text-align:center;padding:40px;color:#9CA3AF;">
                <i class="fas fa-spinner fa-spin" style="font-size:24px;display:block;margin-bottom:8px;"></i>
                加载中...
              </td>
            </tr>
            <tr v-else-if="filteredCategories.length === 0">
              <td colspan="6" style="text-align:center;padding:40px;color:#9CA3AF;">
                <i class="fas fa-folder-open" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                暂无分类数据
              </td>
            </tr>
            <tr v-for="category in paginatedCategories" :key="category.id">
              <td>
                <div class="category-info-cell">
                  <div class="category-icon" :style="{ background: category.color + '20', color: category.color }">
                    <i :class="'fas ' + (category.icon || 'fa-folder')"></i>
                  </div>
                  <div>
                    <div class="category-name">{{ category.name }}</div>
                    <div class="category-id">{{ category.id }}</div>
                  </div>
                </div>
              </td>
              <td>{{ category.description || '-' }}</td>
              <td style="text-align:center;">{{ category.sortOrder || 0 }}</td>
              <td style="text-align:center;">
                <span class="badge badge-info">{{ category.productCount || 0 }}</span>
              </td>
              <td style="text-align:center;">
                <span class="badge" :class="category.status === 'active' ? 'badge-success' : 'badge-danger'">
                  {{ category.status === 'active' ? '活跃' : '停用' }}
                </span>
              </td>
              <td style="text-align:center;">
                <div class="category-actions">
                  <button class="btn-icon btn-icon-primary" @click="editCategory(category.id)" title="编辑">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    class="btn-icon" 
                    :class="category.status === 'active' ? 'btn-icon-warning' : 'btn-icon-success'"
                    @click="toggleCategory(category.id)"
                    :title="category.status === 'active' ? '停用' : '启用'"
                  >
                    <i class="fas" :class="category.status === 'active' ? 'fa-pause' : 'fa-play'"></i>
                  </button>
                  <button class="btn-icon btn-icon-danger" @click="deleteCategory(category.id)" title="删除">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="info">共 {{ filteredCategories.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页</span>
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
    </div>

    <!-- 分类编辑模态框 -->
    <div class="modal-overlay" :class="{ active: showModal }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingId ? '编辑分类' : '新建分类' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCategory" autocomplete="off">
            <div class="form-group">
              <label>分类名称 <span class="required">*</span></label>
              <input type="text" v-model="form.name" placeholder="输入分类名称" required>
            </div>
            <div class="form-group">
              <label>描述</label>
              <textarea v-model="form.description" placeholder="分类描述..." rows="2"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>图标</label>
                <input type="text" v-model="form.icon" placeholder="fa-folder">
              </div>
              <div class="form-group">
                <label>颜色</label>
                <input type="color" v-model="form.color" style="padding:4px;height:42px;">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>排序</label>
                <input type="number" v-model.number="form.sortOrder" placeholder="0" min="0">
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
          <button class="btn btn-primary" @click="saveCategory">
            <i class="fas fa-save"></i> 保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      categories: [],
      filteredCategories: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      searchKeyword: '',
      selectedStatus: '',
      showModal: false,
      editingId: null,
      form: {
        name: '',
        description: '',
        icon: 'fa-folder',
        color: '#4F46E5',
        sortOrder: 0,
        status: 'active'
      }
    }
  },
  computed: {
    stats() {
      const total = this.categories.length
      const active = this.categories.filter(c => c.status === 'active').length
      const inactive = this.categories.filter(c => c.status === 'inactive').length
      const totalProducts = this.categories.reduce((sum, c) => sum + (c.productCount || 0), 0)
      return { total, active, inactive, totalProducts }
    },
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.pageSize) || 1
    },
    paginatedCategories() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredCategories.slice(start, end)
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
    this.loadCategories()
  },
  methods: {
    loadCategories() {
      this.loading = true
      try {
        const saved = localStorage.getItem('category_data')
        if (saved) {
          this.categories = JSON.parse(saved)
        } else {
          this.categories = this.getMockCategories()
          localStorage.setItem('category_data', JSON.stringify(this.categories))
        }
      } catch (e) {
        this.categories = this.getMockCategories()
      }
      this.filteredCategories = [...this.categories]
      this.loading = false
    },
    getMockCategories() {
      return [
        { id: 'CAT001', name: '洗车', icon: 'fa-car', color: '#4F46E5', description: '各类洗车服务', sortOrder: 1, status: 'active', productCount: 0 },
        { id: 'CAT002', name: '美容', icon: 'fa-spray-can', color: '#10B981', description: '汽车美容服务', sortOrder: 2, status: 'active', productCount: 0 },
        { id: 'CAT003', name: '保养', icon: 'fa-engine', color: '#F59E0B', description: '汽车保养服务', sortOrder: 3, status: 'active', productCount: 0 },
        { id: 'CAT004', name: '配件', icon: 'fa-cogs', color: '#8B5CF6', description: '汽车配件销售', sortOrder: 4, status: 'active', productCount: 0 },
        { id: 'CAT005', name: '套餐', icon: 'fa-box', color: '#EF4444', description: '服务套餐', sortOrder: 5, status: 'active', productCount: 0 },
        { id: 'CAT006', name: '会员', icon: 'fa-id-card', color: '#EC4899', description: '会员卡服务', sortOrder: 6, status: 'inactive', productCount: 0 }
      ]
    },
    saveCategories() {
      try {
        localStorage.setItem('category_data', JSON.stringify(this.categories))
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
      let filtered = [...this.categories]
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(keyword) ||
          (c.description && c.description.toLowerCase().includes(keyword))
        )
      }
      if (this.selectedStatus) {
        filtered = filtered.filter(c => c.status === this.selectedStatus)
      }
      this.filteredCategories = filtered
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
        description: '',
        icon: 'fa-folder',
        color: '#4F46E5',
        sortOrder: 0,
        status: 'active'
      }
      this.showModal = true
    },
    editCategory(id) {
      const category = this.categories.find(c => c.id === id)
      if (!category) return
      this.editingId = id
      this.form = { ...category }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editingId = null
    },
    saveCategory() {
      if (!this.form.name) {
        alert('请输入分类名称')
        return
      }

      if (this.editingId) {
        const index = this.categories.findIndex(c => c.id === this.editingId)
        if (index >= 0) {
          this.categories[index] = { ...this.categories[index], ...this.form }
        }
        alert('✅ 分类已更新')
      } else {
        const newCategory = {
          id: 'CAT' + Date.now().toString().slice(-6),
          ...this.form,
          productCount: 0
        }
        this.categories.push(newCategory)
        alert('✅ 分类已创建')
      }

      this.saveCategories()
      this.filteredCategories = [...this.categories]
      this.closeModal()
    },
    toggleCategory(id) {
      const category = this.categories.find(c => c.id === id)
      if (category) {
        category.status = category.status === 'active' ? 'inactive' : 'active'
        this.saveCategories()
        this.filteredCategories = [...this.categories]
        alert(`✅ 分类 "${category.name}" 已${category.status === 'active' ? '启用' : '停用'}`)
      }
    },
    deleteCategory(id) {
      const category = this.categories.find(c => c.id === id)
      if (!category) return
      if ((category.productCount || 0) > 0) {
        if (!confirm(`分类 "${category.name}" 下还有 ${category.productCount} 个商品，确定删除？`)) return
      } else if (!confirm(`确认删除分类 "${category.name}"？`)) return
      this.categories = this.categories.filter(c => c.id !== id)
      this.filteredCategories = [...this.categories]
      this.saveCategories()
      alert('🗑️ 分类已删除')
    },
    refreshData() {
      this.loadCategories()
      alert('✅ 数据已刷新')
    }
  }
}
</script>

<style scoped>
.categories-container {
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

.toolbar .filter-select:focus {
  border-color: #4F46E5;
  outline: none;
}

.table-container {
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  overflow: hidden;
}

.table-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #F9FAFB;
}

th {
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  color: #6B7280;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #E5E7EB;
}

td {
  padding: 10px 14px;
  border-bottom: 1px solid #F3F4F6;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background: #F9FAFB;
}

.category-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.category-name {
  font-weight: 500;
}

.category-id {
  font-size: 11px;
  color: #9CA3AF;
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
.badge-info { background: #DBEAFE; color: #1E40AF; }
.badge-secondary { background: #F3F4F6; color: #6B7280; }

.category-actions {
  display: flex;
  gap: 4px;
  justify-content: center;
}

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

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-top: 1px solid #F3F4F6;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* 暗色模式 */
[data-theme="dark"] .stat-card,
[data-theme="dark"] .toolbar,
[data-theme="dark"] .table-container,
[data-theme="dark"] .modal-content {
  background: #2C2C2E;
  border-color: #48484A;
}

[data-theme="dark"] .stat-card .stat-number,
[data-theme="dark"] .page-header h1 {
  color: #F5F5F7;
}

[data-theme="dark"] thead {
  background: #3A3A3C;
}

[data-theme="dark"] th {
  color: #9CA3AF;
  border-color: #48484A;
}

[data-theme="dark"] td {
  border-color: #3A3A3C;
  color: #F5F5F7;
}

[data-theme="dark"] tr:hover td {
  background: #3A3A3C;
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

[data-theme="dark"] .badge-secondary {
  background: #3A3A3C;
  color: #9CA3AF;
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
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .categories-container {
    padding: 12px;
  }
  
  .page-header h1 {
    font-size: 20px;
  }
  
  .modal-content {
    width: 98%;
    margin: 8px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .modal-header {
    padding: 12px 16px;
  }
  
  .modal-footer {
    padding: 12px 16px;
    flex-direction: column;
  }
  
  .modal-footer button {
    width: 100%;
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