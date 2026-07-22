<template>
  <div class="variant-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h1>
          <i class="fas fa-code-branch" style="color:#4F46E5;"></i>
          产品变体
          <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">规格管理</span>
        </h1>
        <div class="subtitle">管理商品的不同规格变体 · 如尺寸、颜色、容量等</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-success" @click="showCreateModal">
          <i class="fas fa-plus"></i> 新建变体
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
        <div class="stat-label">📊 变体总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number success">{{ stats.active }}</div>
        <div class="stat-label">✅ 活跃变体</div>
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
        placeholder="🔍 搜索商品名称、SKU..."
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

    <!-- 变体网格 -->
    <div class="variant-grid" v-if="filteredVariants.length > 0">
      <div class="variant-card" v-for="variant in paginatedVariants" :key="variant.id">
        <div class="variant-header">
          <div>
            <div class="variant-product">{{ variant.product }}</div>
            <span class="variant-option">{{ variant.option }}</span>
            <div class="variant-sku">SKU: {{ variant.sku || 'N/A' }}</div>
          </div>
          <span class="badge" :class="variant.status === 'active' ? 'badge-success' : 'badge-danger'">
            {{ variant.status === 'active' ? '活跃' : '停用' }}
          </span>
        </div>
        <div class="variant-price">¥{{ formatPrice(variant.price) }}</div>
        <div class="variant-stock">
          库存: 
          <span :class="{ 'stock-low': variant.stock < 10 && variant.stock > 0, 'stock-out': variant.stock === 0 }">
            {{ variant.stock }}
            <span v-if="variant.stock < 10 && variant.stock > 0"> ⚠️</span>
            <span v-if="variant.stock === 0"> 🚫 缺货</span>
          </span>
        </div>
        <div class="variant-actions">
          <button class="btn-icon btn-icon-primary" @click="editVariant(variant.id)" title="编辑">
            <i class="fas fa-edit"></i>
          </button>
          <button 
            class="btn-icon" 
            :class="variant.status === 'active' ? 'btn-icon-warning' : 'btn-icon-success'"
            @click="toggleVariant(variant.id)"
            :title="variant.status === 'active' ? '停用' : '启用'"
          >
            <i class="fas" :class="variant.status === 'active' ? 'fa-pause' : 'fa-play'"></i>
          </button>
          <button class="btn-icon btn-icon-danger" @click="deleteVariant(variant.id)" title="删除">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <i class="fas fa-code-branch"></i>
      <p>暂无产品变体</p>
      <span class="hint">点击「新建变体」创建</span>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="filteredVariants.length > 0">
      <span class="info">共 {{ filteredVariants.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页</span>
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

    <!-- 变体编辑模态框 -->
    <div class="modal-overlay" :class="{ active: showModal }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingId ? '编辑变体' : '新建变体' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveVariant" autocomplete="off">
            <div class="form-group">
              <label>商品名称 <span class="required">*</span></label>
              <input type="text" v-model="form.product" placeholder="如: 洗车液" required>
            </div>
            <div class="form-group">
              <label>规格选项 <span class="required">*</span></label>
              <input type="text" v-model="form.option" placeholder="如: 500ml / 1L / 红色" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>价格 <span class="required">*</span></label>
                <input type="number" v-model.number="form.price" placeholder="0.00" step="0.01" min="0" required>
              </div>
              <div class="form-group">
                <label>库存</label>
                <input type="number" v-model.number="form.stock" placeholder="0" min="0">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>SKU编码</label>
                <input type="text" v-model="form.sku" placeholder="自动生成" readonly style="background:#F9FAFB;">
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
          <button class="btn btn-primary" @click="saveVariant">
            <i class="fas fa-save"></i> 保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Variants',
  data() {
    return {
      variants: [],
      filteredVariants: [],
      loading: false,
      currentPage: 1,
      pageSize: 9,
      searchKeyword: '',
      selectedStatus: '',
      showModal: false,
      editingId: null,
      form: {
        product: '',
        option: '',
        price: 0,
        stock: 0,
        sku: '',
        status: 'active'
      }
    }
  },
  computed: {
    stats() {
      const total = this.variants.length
      const active = this.variants.filter(v => v.status === 'active').length
      const products = [...new Set(this.variants.map(v => v.product))].length
      return { total, active, products }
    },
    totalPages() {
      return Math.ceil(this.filteredVariants.length / this.pageSize) || 1
    },
    paginatedVariants() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredVariants.slice(start, end)
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
    this.loadVariants()
  },
  methods: {
    loadVariants() {
      this.loading = true
      try {
        const saved = localStorage.getItem('variant_data')
        if (saved) {
          this.variants = JSON.parse(saved)
        } else {
          this.variants = this.getMockVariants()
          localStorage.setItem('variant_data', JSON.stringify(this.variants))
        }
      } catch (e) {
        this.variants = this.getMockVariants()
      }
      this.filteredVariants = [...this.variants]
      this.loading = false
    },
    getMockVariants() {
      return [
        { id: 'VR-001', product: '洗车液', option: '500ml', price: 68, stock: 45, status: 'active', sku: 'SKU-001' },
        { id: 'VR-002', product: '洗车液', option: '1L', price: 128, stock: 30, status: 'active', sku: 'SKU-002' },
        { id: 'VR-003', product: '洗车液', option: '5L', price: 388, stock: 12, status: 'active', sku: 'SKU-003' },
        { id: 'VR-004', product: '抛光蜡', option: '200g', price: 88, stock: 20, status: 'active', sku: 'SKU-004' },
        { id: 'VR-005', product: '抛光蜡', option: '500g', price: 168, stock: 15, status: 'inactive', sku: 'SKU-005' },
        { id: 'VR-006', product: '内饰清洁剂', option: '500ml', price: 78, stock: 25, status: 'active', sku: 'SKU-006' },
        { id: 'VR-007', product: '内饰清洁剂', option: '1L', price: 138, stock: 18, status: 'active', sku: 'SKU-007' },
        { id: 'VR-008', product: '玻璃镀膜', option: '100ml', price: 228, stock: 12, status: 'active', sku: 'SKU-008' },
        { id: 'VR-009', product: '玻璃镀膜', option: '250ml', price: 458, stock: 8, status: 'active', sku: 'SKU-009' },
        { id: 'VR-010', product: '轮胎光亮剂', option: '500ml', price: 88, stock: 20, status: 'inactive', sku: 'SKU-010' }
      ]
    },
    saveVariants() {
      try {
        localStorage.setItem('variant_data', JSON.stringify(this.variants))
      } catch (e) {}
    },
    formatPrice(price) {
      return (price || 0).toFixed(2)
    },
    generateSKU() {
      return 'SKU-' + Date.now().toString().slice(-6)
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
      let filtered = [...this.variants]
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(v => 
          v.product.toLowerCase().includes(keyword) ||
          (v.sku && v.sku.toLowerCase().includes(keyword)) ||
          v.option.toLowerCase().includes(keyword)
        )
      }
      if (this.selectedStatus) {
        filtered = filtered.filter(v => v.status === this.selectedStatus)
      }
      this.filteredVariants = filtered
      this.currentPage = 1
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
    showCreateModal() {
      this.editingId = null
      this.form = {
        product: '',
        option: '',
        price: 0,
        stock: 0,
        sku: this.generateSKU(),
        status: 'active'
      }
      this.showModal = true
    },
    editVariant(id) {
      const variant = this.variants.find(v => v.id === id)
      if (!variant) return
      this.editingId = id
      this.form = { ...variant }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editingId = null
    },
    saveVariant() {
      if (!this.form.product) {
        alert('请输入商品名称')
        return
      }
      if (!this.form.option) {
        alert('请输入规格选项')
        return
      }
      if (this.form.price < 0) {
        alert('请输入有效的价格')
        return
      }

      const sku = this.form.sku || this.generateSKU()

      if (this.editingId) {
        const index = this.variants.findIndex(v => v.id === this.editingId)
        if (index >= 0) {
          this.variants[index] = { 
            ...this.variants[index], 
            ...this.form,
            sku: sku
          }
        }
        alert('✅ 变体已更新')
      } else {
        const newVariant = {
          id: 'VR-' + Date.now().toString().slice(-6),
          ...this.form,
          sku: sku
        }
        this.variants.push(newVariant)
        alert('✅ 变体已创建')
      }

      this.saveVariants()
      this.filteredVariants = [...this.variants]
      this.closeModal()
    },
    toggleVariant(id) {
      const variant = this.variants.find(v => v.id === id)
      if (variant) {
        variant.status = variant.status === 'active' ? 'inactive' : 'active'
        this.saveVariants()
        this.filteredVariants = [...this.variants]
        alert(`✅ 变体 "${variant.product} - ${variant.option}" 已${variant.status === 'active' ? '启用' : '停用'}`)
      }
    },
    deleteVariant(id) {
      const variant = this.variants.find(v => v.id === id)
      if (!variant) return
      if (!confirm(`确认删除变体 "${variant.product} - ${variant.option}"？`)) return
      this.variants = this.variants.filter(v => v.id !== id)
      this.filteredVariants = [...this.variants]
      this.saveVariants()
      alert('🗑️ 变体已删除')
    },
    refreshData() {
      this.loadVariants()
      alert('✅ 数据已刷新')
    }
  }
}
</script>

<style scoped>
.variant-container {
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

.variant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.variant-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #E5E7EB;
  transition: all 0.3s ease;
}

.variant-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: #4F46E5;
}

.variant-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.variant-product {
  font-size: 16px;
  font-weight: 600;
}

.variant-option {
  font-size: 13px;
  color: #6B7280;
}

.variant-sku {
  font-size: 12px;
  color: #9CA3AF;
  font-family: monospace;
  margin-top: 2px;
}

.variant-price {
  font-size: 24px;
  font-weight: 700;
  color: #4F46E5;
  margin: 8px 0;
}

.variant-stock {
  font-size: 14px;
  color: #6B7280;
}

.variant-stock .stock-low {
  color: #F59E0B;
  font-weight: 600;
}

.variant-stock .stock-out {
  color: #EF4444;
  font-weight: 600;
}

.variant-actions {
  display: flex;
  gap: 4px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #F3F4F6;
  justify-content: flex-end;
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
.badge-warning { background: #FEF3C7; color: #92400E; }

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

.form-group input[readonly] {
  background: #F9FAFB;
  cursor: not-allowed;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* 暗色模式 */
[data-theme="dark"] .stat-card,
[data-theme="dark"] .toolbar,
[data-theme="dark"] .variant-card,
[data-theme="dark"] .pagination,
[data-theme="dark"] .modal-content {
  background: #2C2C2E;
  border-color: #48484A;
}

[data-theme="dark"] .stat-card .stat-number,
[data-theme="dark"] .page-header h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .variant-option,
[data-theme="dark"] .variant-stock {
  color: #9CA3AF;
}

[data-theme="dark"] .variant-actions {
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

[data-theme="dark"] .form-group input[readonly] {
  background: #3A3A3C;
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
  
  .variant-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .variant-container {
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