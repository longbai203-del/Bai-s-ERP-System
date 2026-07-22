<template>
  <div class="combo-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h1>
          <i class="fas fa-object-group" style="color:#4F46E5;"></i>
          组合产品
          <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">套餐管理</span>
        </h1>
        <div class="subtitle">管理商品套餐组合 · 打包销售提升客单价</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-success" @click="showCreateModal">
          <i class="fas fa-plus"></i> 新建组合
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
        <div class="stat-label">📊 组合总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number success">{{ stats.active }}</div>
        <div class="stat-label">✅ 上架</div>
      </div>
      <div class="stat-card">
        <div class="stat-number warning">{{ stats.bestSaving }}</div>
        <div class="stat-label">💰 最大节省</div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <input 
        type="text" 
        class="search-box" 
        v-model="searchKeyword" 
        placeholder="🔍 搜索组合名称..."
        @keyup.enter="handleSearch"
      />
      <select class="filter-select" v-model="selectedStatus" @change="handleSearch">
        <option value="">全部状态</option>
        <option value="active">上架</option>
        <option value="inactive">下架</option>
      </select>
      <button class="btn btn-primary" @click="handleSearch">
        <i class="fas fa-search"></i> 搜索
      </button>
      <button class="btn btn-outline" @click="resetSearch">
        <i class="fas fa-undo"></i> 重置
      </button>
    </div>

    <!-- 组合网格 -->
    <div class="combo-grid" v-if="filteredCombos.length > 0">
      <div class="combo-card" v-for="combo in paginatedCombos" :key="combo.id">
        <div class="combo-header">
          <div>
            <span class="combo-name">{{ combo.name }}</span>
            <span class="badge" :class="combo.status === 'active' ? 'badge-success' : 'badge-danger'">
              {{ combo.status === 'active' ? '上架' : '下架' }}
            </span>
          </div>
          <div>
            <span class="combo-price">¥{{ formatPrice(combo.price) }}</span>
            <span class="combo-original">¥{{ formatPrice(combo.original) }}</span>
          </div>
        </div>
        <div style="font-size:13px;color:#6B7280;margin-bottom:8px;">
          <span class="combo-saving">节省 ¥{{ combo.saving || (combo.original - combo.price) }}</span>
        </div>
        <div class="combo-items">
          <div class="combo-item" v-for="(item, index) in combo.items" :key="index">
            <span>{{ item }}</span>
          </div>
        </div>
        <div class="combo-actions">
          <button class="btn-icon btn-icon-primary" @click="editCombo(combo.id)" title="编辑">
            <i class="fas fa-edit"></i>
          </button>
          <button 
            class="btn-icon" 
            :class="combo.status === 'active' ? 'btn-icon-warning' : 'btn-icon-success'"
            @click="toggleCombo(combo.id)"
            :title="combo.status === 'active' ? '下架' : '上架'"
          >
            <i class="fas" :class="combo.status === 'active' ? 'fa-pause' : 'fa-play'"></i>
          </button>
          <button class="btn-icon btn-icon-danger" @click="deleteCombo(combo.id)" title="删除">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <i class="fas fa-object-group"></i>
      <p>暂无组合产品</p>
      <span class="hint">点击「新建组合」创建</span>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="filteredCombos.length > 0">
      <span class="info">共 {{ filteredCombos.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页</span>
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

    <!-- 组合编辑模态框 -->
    <div class="modal-overlay" :class="{ active: showModal }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingId ? '编辑组合' : '新建组合' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCombo" autocomplete="off">
            <div class="form-group">
              <label>组合名称 <span class="required">*</span></label>
              <input type="text" v-model="form.name" placeholder="如: 洗车套餐A" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>组合价格 <span class="required">*</span></label>
                <input type="number" v-model.number="form.price" placeholder="0.00" step="0.01" min="0" required>
              </div>
              <div class="form-group">
                <label>原价（总价） <span class="required">*</span></label>
                <input type="number" v-model.number="form.original" placeholder="0.00" step="0.01" min="0" required>
              </div>
            </div>
            <div class="form-group">
              <label>包含商品 <span class="required">*</span></label>
              <div class="items-editor">
                <div class="item-row" v-for="(item, index) in form.items" :key="index">
                  <input type="text" v-model="form.items[index]" placeholder="商品名称" style="flex:1;">
                  <button type="button" class="btn-icon btn-icon-danger" @click="removeItem(index)" title="移除">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <button type="button" class="btn btn-outline btn-sm" @click="addItem">
                  <i class="fas fa-plus"></i> 添加商品
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>状态</label>
              <select v-model="form.status">
                <option value="active">上架</option>
                <option value="inactive">下架</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveCombo">
            <i class="fas fa-save"></i> 保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Combos',
  data() {
    return {
      combos: [],
      filteredCombos: [],
      loading: false,
      currentPage: 1,
      pageSize: 6,
      searchKeyword: '',
      selectedStatus: '',
      showModal: false,
      editingId: null,
      form: {
        name: '',
        price: 0,
        original: 0,
        items: [''],
        status: 'active'
      }
    }
  },
  computed: {
    stats() {
      const total = this.combos.length
      const active = this.combos.filter(c => c.status === 'active').length
      const bestSaving = this.combos.reduce((max, c) => {
        const saving = c.saving || (c.original - c.price)
        return Math.max(max, saving)
      }, 0)
      return { total, active, bestSaving: '¥' + bestSaving.toFixed(2) }
    },
    totalPages() {
      return Math.ceil(this.filteredCombos.length / this.pageSize) || 1
    },
    paginatedCombos() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredCombos.slice(start, end)
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
    this.loadCombos()
  },
  methods: {
    loadCombos() {
      this.loading = true
      try {
        const saved = localStorage.getItem('combo_data')
        if (saved) {
          this.combos = JSON.parse(saved)
        } else {
          this.combos = this.getMockCombos()
          localStorage.setItem('combo_data', JSON.stringify(this.combos))
        }
      } catch (e) {
        this.combos = this.getMockCombos()
      }
      this.filteredCombos = [...this.combos]
      this.loading = false
    },
    getMockCombos() {
      return [
        { 
          id: 'CB-001', 
          name: '洗车套餐A', 
          price: 128, 
          original: 168, 
          status: 'active',
          items: ['标准洗车 ¥68', '内饰清洁 ¥100'],
          saving: 40 
        },
        { 
          id: 'CB-002', 
          name: '美容套餐', 
          price: 388, 
          original: 488, 
          status: 'active',
          items: ['抛光打蜡 ¥388', '玻璃镀膜 ¥100'],
          saving: 100 
        },
        { 
          id: 'CB-003', 
          name: '保养套餐', 
          price: 268, 
          original: 348, 
          status: 'inactive',
          items: ['发动机清洗 ¥188', '空调清洗 ¥160'],
          saving: 80 
        },
        { 
          id: 'CB-004', 
          name: 'VIP尊享套餐', 
          price: 588, 
          original: 788, 
          status: 'active',
          items: ['精致洗车 ¥128', '全车镀晶 ¥388', '内饰清洁 ¥272'],
          saving: 200 
        }
      ]
    },
    saveCombos() {
      try {
        localStorage.setItem('combo_data', JSON.stringify(this.combos))
      } catch (e) {}
    },
    formatPrice(price) {
      return (price || 0).toFixed(2)
    },
    addItem() {
      this.form.items.push('')
    },
    removeItem(index) {
      if (this.form.items.length > 1) {
        this.form.items.splice(index, 1)
      } else {
        alert('至少保留一个商品')
      }
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
      let filtered = [...this.combos]
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(keyword) ||
          c.items.some(item => item.toLowerCase().includes(keyword))
        )
      }
      if (this.selectedStatus) {
        filtered = filtered.filter(c => c.status === this.selectedStatus)
      }
      this.filteredCombos = filtered
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
        original: 0,
        items: [''],
        status: 'active'
      }
      this.showModal = true
    },
    editCombo(id) {
      const combo = this.combos.find(c => c.id === id)
      if (!combo) return
      this.editingId = id
      this.form = { ...combo }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editingId = null
    },
    saveCombo() {
      if (!this.form.name) {
        alert('请输入组合名称')
        return
      }
      if (this.form.price < 0 || this.form.original < 0) {
        alert('请输入有效的价格')
        return
      }
      const validItems = this.form.items.filter(item => item.trim())
      if (validItems.length === 0) {
        alert('请至少添加一个商品')
        return
      }

      const data = {
        ...this.form,
        items: validItems,
        saving: this.form.original - this.form.price
      }

      if (this.editingId) {
        const index = this.combos.findIndex(c => c.id === this.editingId)
        if (index >= 0) {
          this.combos[index] = { ...this.combos[index], ...data }
        }
        alert('✅ 组合已更新')
      } else {
        const newCombo = {
          id: 'CB-' + Date.now().toString().slice(-6),
          ...data
        }
        this.combos.push(newCombo)
        alert('✅ 组合已创建')
      }

      this.saveCombos()
      this.filteredCombos = [...this.combos]
      this.closeModal()
    },
    toggleCombo(id) {
      const combo = this.combos.find(c => c.id === id)
      if (combo) {
        combo.status = combo.status === 'active' ? 'inactive' : 'active'
        this.saveCombos()
        this.filteredCombos = [...this.combos]
        alert(`✅ 组合 "${combo.name}" 已${combo.status === 'active' ? '上架' : '下架'}`)
      }
    },
    deleteCombo(id) {
      const combo = this.combos.find(c => c.id === id)
      if (!combo) return
      if (!confirm(`确认删除组合 "${combo.name}"？`)) return
      this.combos = this.combos.filter(c => c.id !== id)
      this.filteredCombos = [...this.combos]
      this.saveCombos()
      alert('🗑️ 组合已删除')
    },
    refreshData() {
      this.loadCombos()
      alert('✅ 数据已刷新')
    }
  }
}
</script>

<style scoped>
.combo-container {
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

.btn-sm {
  padding: 4px 10px;
  font-size: 12px;
}

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
.stat-card .stat-number.warning { color: #F59E0B; }

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

.combo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.combo-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #E5E7EB;
  transition: all 0.3s ease;
}

.combo-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: #4F46E5;
}

.combo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.combo-name {
  font-size: 18px;
  font-weight: 600;
}

.combo-price {
  font-size: 20px;
  font-weight: 700;
  color: #4F46E5;
}

.combo-original {
  font-size: 14px;
  color: #9CA3AF;
  text-decoration: line-through;
  margin-left: 8px;
}

.combo-saving {
  color: #10B981;
  font-weight: 600;
}

.combo-items {
  margin: 8px 0;
  padding: 8px 0;
  border-top: 1px solid #F3F4F6;
  border-bottom: 1px solid #F3F4F6;
}

.combo-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
}

.combo-actions {
  display: flex;
  gap: 4px;
  margin-top: 12px;
  justify-content: flex-end;
}

.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  margin-left: 8px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.items-editor {
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  padding: 8px;
  background: #F9FAFB;
}

.item-row {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
  align-items: center;
}

.item-row:last-child {
  margin-bottom: 0;
}

.item-row input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 13px;
  background: white;
}

.item-row input:focus {
  border-color: #4F46E5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* 暗色模式 */
[data-theme="dark"] .stat-card,
[data-theme="dark"] .toolbar,
[data-theme="dark"] .combo-card,
[data-theme="dark"] .pagination,
[data-theme="dark"] .modal-content {
  background: #2C2C2E;
  border-color: #48484A;
}

[data-theme="dark"] .stat-card .stat-number,
[data-theme="dark"] .page-header h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .combo-item {
  border-color: #3A3A3C;
}

[data-theme="dark"] .combo-items {
  border-color: #3A3A3C;
}

[data-theme="dark"] .combo-original {
  color: #6B7280;
}

[data-theme="dark"] .toolbar .search-box,
[data-theme="dark"] .toolbar .filter-select,
[data-theme="dark"] .form-group input,
[data-theme="dark"] .form-group select,
[data-theme="dark"] .form-group textarea,
[data-theme="dark"] .items-editor,
[data-theme="dark"] .item-row input {
  background: #3A3A3C;
  border-color: #48484A;
  color: #F5F5F7;
}

[data-theme="dark"] .items-editor {
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
  
  .combo-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .combo-container {
    padding: 12px;
  }
  
  .page-header h1 {
    font-size: 20px;
  }
  
  .modal-content {
    width: 98%;
    margin: 8px;
  }
  
  .combo-header {
    flex-direction: column;
    gap: 8px;
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