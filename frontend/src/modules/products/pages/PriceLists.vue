<template>
  <div class="pricelist-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h1>
          <i class="fas fa-tags" style="color:#4F46E5;"></i>
          价格表
          <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">多套价格体系</span>
        </h1>
        <div class="subtitle">管理不同客户群体的价格策略</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-success" @click="showCreateModal">
          <i class="fas fa-plus"></i> 新建价格表
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
        <div class="stat-label">📊 价格表总数</div>
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
        placeholder="🔍 搜索价格表名称..."
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

    <!-- 价格表网格 -->
    <div class="pricelist-grid" v-if="filteredPriceLists.length > 0">
      <div class="pricelist-card" v-for="pricelist in paginatedPriceLists" :key="pricelist.id">
        <div class="pricelist-badge">
          <span class="badge" :class="pricelist.status === 'active' ? 'badge-success' : 'badge-danger'">
            {{ pricelist.status === 'active' ? '活跃' : '停用' }}
          </span>
        </div>
        <div class="pricelist-header">
          <div>
            <div class="pricelist-name">{{ pricelist.name }}</div>
            <span class="pricelist-type" :style="{ background: getTypeColor(pricelist.type) + '20', color: getTypeColor(pricelist.type) }">
              {{ pricelist.type || '通用' }}
            </span>
          </div>
        </div>
        <div class="pricelist-desc">{{ pricelist.desc || '无描述' }}</div>
        <div class="pricelist-products">📦 {{ pricelist.products || 0 }} 个商品</div>
        <div class="pricelist-actions">
          <button class="btn-icon btn-icon-primary" @click="editPricelist(pricelist.id)" title="编辑">
            <i class="fas fa-edit"></i>
          </button>
          <button 
            class="btn-icon" 
            :class="pricelist.status === 'active' ? 'btn-icon-warning' : 'btn-icon-success'"
            @click="togglePricelist(pricelist.id)"
            :title="pricelist.status === 'active' ? '停用' : '启用'"
          >
            <i class="fas" :class="pricelist.status === 'active' ? 'fa-pause' : 'fa-play'"></i>
          </button>
          <button class="btn-icon btn-icon-danger" @click="deletePricelist(pricelist.id)" title="删除">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <i class="fas fa-tags"></i>
      <p>暂无价格表</p>
      <span class="hint">点击「新建价格表」创建</span>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="filteredPriceLists.length > 0">
      <span class="info">共 {{ filteredPriceLists.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页</span>
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

    <!-- 价格表编辑模态框 -->
    <div class="modal-overlay" :class="{ active: showModal }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingId ? '编辑价格表' : '新建价格表' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="savePricelist" autocomplete="off">
            <div class="form-group">
              <label>价格表名称 <span class="required">*</span></label>
              <input type="text" v-model="form.name" placeholder="如: 会员价目表" required>
            </div>
            <div class="form-group">
              <label>类型</label>
              <select v-model="form.type">
                <option value="零售">零售</option>
                <option value="会员">会员</option>
                <option value="批发">批发</option>
                <option value="促销">促销</option>
                <option value="内部">内部</option>
              </select>
            </div>
            <div class="form-group">
              <label>描述</label>
              <textarea v-model="form.desc" placeholder="价格表描述信息..." rows="2"></textarea>
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
          <button class="btn btn-primary" @click="savePricelist">
            <i class="fas fa-save"></i> 保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PriceLists',
  data() {
    return {
      priceLists: [],
      filteredPriceLists: [],
      loading: false,
      currentPage: 1,
      pageSize: 8,
      searchKeyword: '',
      selectedStatus: '',
      showModal: false,
      editingId: null,
      form: {
        name: '',
        type: '零售',
        desc: '',
        status: 'active'
      }
    }
  },
  computed: {
    stats() {
      const total = this.priceLists.length
      const active = this.priceLists.filter(p => p.status === 'active').length
      const products = this.priceLists.reduce((sum, p) => sum + (p.products || 0), 0)
      return { total, active, products }
    },
    totalPages() {
      return Math.ceil(this.filteredPriceLists.length / this.pageSize) || 1
    },
    paginatedPriceLists() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredPriceLists.slice(start, end)
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
    this.loadPriceLists()
  },
  methods: {
    loadPriceLists() {
      this.loading = true
      try {
        const saved = localStorage.getItem('pricelist_data')
        if (saved) {
          this.priceLists = JSON.parse(saved)
        } else {
          this.priceLists = this.getMockPriceLists()
          localStorage.setItem('pricelist_data', JSON.stringify(this.priceLists))
        }
      } catch (e) {
        this.priceLists = this.getMockPriceLists()
      }
      this.filteredPriceLists = [...this.priceLists]
      this.loading = false
    },
    getMockPriceLists() {
      return [
        { id: 'PL-001', name: '标准价目表', type: '零售', desc: '标准零售价格', products: 12, status: 'active' },
        { id: 'PL-002', name: '会员价目表', type: '会员', desc: '会员专享价格', products: 12, status: 'active' },
        { id: 'PL-003', name: '批发价目表', type: '批发', desc: '批量采购价格', products: 8, status: 'inactive' },
        { id: 'PL-004', name: '节日促销价', type: '促销', desc: '节假日促销价格', products: 6, status: 'active' },
        { id: 'PL-005', name: '员工内部价', type: '内部', desc: '员工内部优惠价格', products: 10, status: 'active' },
        { id: 'PL-006', name: 'VIP尊享价', type: '会员', desc: 'VIP客户专享价格', products: 15, status: 'active' }
      ]
    },
    savePriceLists() {
      try {
        localStorage.setItem('pricelist_data', JSON.stringify(this.priceLists))
      } catch (e) {}
    },
    getTypeColor(type) {
      const colors = {
        '零售': '#3B82F6',
        '会员': '#10B981',
        '批发': '#F59E0B',
        '促销': '#EF4444',
        '内部': '#8B5CF6'
      }
      return colors[type] || '#6B7280'
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
      let filtered = [...this.priceLists]
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword))
      }
      if (this.selectedStatus) {
        filtered = filtered.filter(p => p.status === this.selectedStatus)
      }
      this.filteredPriceLists = filtered
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
        type: '零售',
        desc: '',
        status: 'active'
      }
      this.showModal = true
    },
    editPricelist(id) {
      const pricelist = this.priceLists.find(p => p.id === id)
      if (!pricelist) return
      this.editingId = id
      this.form = { ...pricelist }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editingId = null
    },
    savePricelist() {
      if (!this.form.name) {
        alert('请输入价格表名称')
        return
      }

      if (this.editingId) {
        const index = this.priceLists.findIndex(p => p.id === this.editingId)
        if (index >= 0) {
          this.priceLists[index] = { ...this.priceLists[index], ...this.form }
        }
        alert('✅ 价格表已更新')
      } else {
        const newPricelist = {
          id: 'PL-' + Date.now().toString().slice(-6),
          ...this.form,
          products: 0
        }
        this.priceLists.push(newPricelist)
        alert('✅ 价格表已创建')
      }

      this.savePriceLists()
      this.filteredPriceLists = [...this.priceLists]
      this.closeModal()
    },
    togglePricelist(id) {
      const pricelist = this.priceLists.find(p => p.id === id)
      if (pricelist) {
        pricelist.status = pricelist.status === 'active' ? 'inactive' : 'active'
        this.savePriceLists()
        this.filteredPriceLists = [...this.priceLists]
        alert(`✅ 价格表 "${pricelist.name}" 已${pricelist.status === 'active' ? '启用' : '停用'}`)
      }
    },
    deletePricelist(id) {
      const pricelist = this.priceLists.find(p => p.id === id)
      if (!pricelist) return
      if (!confirm(`确认删除价格表 "${pricelist.name}"？`)) return
      this.priceLists = this.priceLists.filter(p => p.id !== id)
      this.filteredPriceLists = [...this.priceLists]
      this.savePriceLists()
      alert('🗑️ 价格表已删除')
    },
    refreshData() {
      this.loadPriceLists()
      alert('✅ 数据已刷新')
    }
  }
}
</script>

<style scoped>
.pricelist-container {
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

.pricelist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.pricelist-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #E5E7EB;
  transition: all 0.3s ease;
  position: relative;
}

.pricelist-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: #4F46E5;
}

.pricelist-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.pricelist-name {
  font-size: 18px;
  font-weight: 600;
  margin-right: 60px;
}

.pricelist-type {
  display: inline-block;
  padding: 2px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
}

.pricelist-desc {
  font-size: 14px;
  color: #6B7280;
  margin: 8px 0;
}

.pricelist-products {
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 12px;
}

.pricelist-actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #F3F4F6;
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
  grid-column: 1 / -1;
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

/* 暗色模式 */
[data-theme="dark"] .stat-card,
[data-theme="dark"] .toolbar,
[data-theme="dark"] .pricelist-card,
[data-theme="dark"] .pagination,
[data-theme="dark"] .modal-content {
  background: #2C2C2E;
  border-color: #48484A;
}

[data-theme="dark"] .stat-card .stat-number,
[data-theme="dark"] .page-header h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .pricelist-desc,
[data-theme="dark"] .pricelist-products {
  color: #9CA3AF;
}

[data-theme="dark"] .pricelist-actions {
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
  
  .pricelist-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .pricelist-container {
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