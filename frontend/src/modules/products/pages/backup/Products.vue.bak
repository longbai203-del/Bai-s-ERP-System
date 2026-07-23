<template>
  <div class="products-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h1>
          <i class="fas fa-box" style="color:#4F46E5;"></i>
          商品管理
          <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">产品中心</span>
        </h1>
        <div class="subtitle">商品信息管理与库存监控 · 支持分类/品牌/变体管理</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-success" @click="showCreateModal">
          <i class="fas fa-plus"></i> 添加商品
        </button>
        <button class="btn btn-outline" @click="importProducts">
          <i class="fas fa-file-import"></i> 导入
        </button>
        <button class="btn btn-outline" @click="exportProducts">
          <i class="fas fa-file-export"></i> 导出
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
        <div class="stat-label">📦 总商品</div>
      </div>
      <div class="stat-card">
        <div class="stat-number success">{{ stats.active }}</div>
        <div class="stat-label">✅ 上架</div>
      </div>
      <div class="stat-card">
        <div class="stat-number danger">{{ stats.inactive }}</div>
        <div class="stat-label">⛔ 下架</div>
      </div>
      <div class="stat-card">
        <div class="stat-number warning">{{ stats.lowStock }}</div>
        <div class="stat-label">⚠️ 低库存</div>
      </div>
      <div class="stat-card">
        <div class="stat-number purple">{{ stats.categories }}</div>
        <div class="stat-label">📊 分类数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">¥{{ stats.totalValue }}</div>
        <div class="stat-label">💰 库存价值</div>
      </div>
    </div>

    <!-- 快速筛选 -->
    <div class="filter-tags">
      <button 
        v-for="filter in filters" 
        :key="filter.key"
        class="filter-tag" 
        :class="{ active: currentFilter === filter.key }"
        @click="quickFilter(filter.key)"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <input 
        type="text" 
        class="search-box" 
        v-model="searchKeyword" 
        placeholder="🔍 搜索商品名称、编码..."
        @keyup.enter="handleSearch"
      />
      <select class="filter-select" v-model="selectedCategory" @change="handleSearch">
        <option value="">全部分类</option>
        <option v-for="cat in categoryOptions" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
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

    <!-- 商品列表 -->
    <div class="table-container">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th style="min-width:200px;">商品信息</th>
              <th>分类</th>
              <th style="text-align:right;min-width:80px;">售价</th>
              <th style="text-align:right;min-width:80px;">成本</th>
              <th style="text-align:right;min-width:80px;">库存</th>
              <th style="min-width:80px;">状态</th>
              <th style="text-align:center;min-width:120px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" style="text-align:center;padding:40px;color:#9CA3AF;">
                <i class="fas fa-spinner fa-spin" style="font-size:24px;display:block;margin-bottom:8px;"></i>
                加载中...
              </td>
            </tr>
            <tr v-else-if="paginatedProducts.length === 0">
              <td colspan="7" style="text-align:center;padding:40px;color:#9CA3AF;">
                <i class="fas fa-box" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                暂无商品数据
              </td>
            </tr>
            <tr v-for="product in paginatedProducts" :key="product.id">
              <td>
                <div class="product-info-cell">
                  <div class="product-icon">{{ getCategoryIcon(product.category) }}</div>
                  <div>
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-id">{{ product.id }} · {{ product.unit || '个' }}</div>
                  </div>
                </div>
              </td>
              <td>{{ product.category }}</td>
              <td style="text-align:right;font-weight:600;color:#4F46E5;">
                ¥{{ formatPrice(product.price) }}
              </td>
              <td style="text-align:right;color:#6B7280;">
                ¥{{ formatPrice(product.cost) }}
              </td>
              <td style="text-align:right;">
                <span :class="{ 'stock-warning': product.stock < 10 && product.status === 'active' }">
                  {{ product.stock }}
                  <span v-if="product.stock < 10 && product.stock > 0 && product.status === 'active'" class="icon">⚠️</span>
                  <span v-if="product.stock === 0" class="icon">🚫</span>
                </span>
              </td>
              <td>
                <span class="badge" :class="getStatusClass(product)">
                  {{ getStatusLabel(product) }}
                </span>
              </td>
              <td style="text-align:center;">
                <div class="product-actions">
                  <button class="btn-icon btn-icon-primary" @click="editProduct(product.id)" title="编辑">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    class="btn-icon" 
                    :class="product.status === 'active' ? 'btn-icon-warning' : 'btn-icon-success'"
                    @click="toggleProduct(product.id)"
                    :title="product.status === 'active' ? '下架' : '上架'"
                  >
                    <i class="fas" :class="product.status === 'active' ? 'fa-pause' : 'fa-play'"></i>
                  </button>
                  <button class="btn-icon btn-icon-danger" @click="deleteProduct(product.id)" title="删除">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="info">共 {{ filteredProducts.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页</span>
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

    <!-- 商品编辑模态框 -->
    <div class="modal-overlay" :class="{ active: showModal }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingId ? '编辑商品' : '新建商品' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProduct" autocomplete="off">
            <div class="form-group">
              <label>商品名称 <span class="required">*</span></label>
              <input type="text" v-model="form.name" placeholder="输入商品名称" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>分类 <span class="required">*</span></label>
                <select v-model="form.category">
                  <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>单位</label>
                <input type="text" v-model="form.unit" placeholder="个/件/瓶">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>售价 <span class="required">*</span></label>
                <input type="number" v-model.number="form.price" placeholder="0.00" step="0.01" min="0">
              </div>
              <div class="form-group">
                <label>成本</label>
                <input type="number" v-model.number="form.cost" placeholder="0.00" step="0.01" min="0">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>库存 <span class="required">*</span></label>
                <input type="number" v-model.number="form.stock" placeholder="0" min="0">
              </div>
              <div class="form-group">
                <label>状态</label>
                <select v-model="form.status">
                  <option value="active">上架</option>
                  <option value="inactive">下架</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>描述</label>
              <textarea v-model="form.description" placeholder="商品描述信息..." rows="2"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveProduct">
            <i class="fas fa-save"></i> 保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Products',
  data() {
    return {
      products: [],
      filteredProducts: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      searchKeyword: '',
      selectedCategory: '',
      selectedStatus: '',
      currentFilter: 'all',
      showModal: false,
      editingId: null,
      form: {
        name: '',
        category: '洗车',
        unit: '个',
        price: 0,
        cost: 0,
        stock: 0,
        status: 'active',
        description: ''
      },
      categoryOptions: ['洗车', '美容', '保养', '配件', '套餐', '会员'],
      filters: [
        { key: 'all', label: '全部' },
        { key: 'active', label: '✅ 上架' },
        { key: 'inactive', label: '⛔ 下架' },
        { key: 'low-stock', label: '⚠️ 低库存' },
        { key: 'out-of-stock', label: '🚫 缺货' }
      ]
    }
  },
  computed: {
    stats() {
      const total = this.products.length
      const active = this.products.filter(p => p.status === 'active').length
      const inactive = this.products.filter(p => p.status === 'inactive').length
      const lowStock = this.products.filter(p => p.stock < 10 && p.stock > 0 && p.status === 'active').length
      const categories = [...new Set(this.products.map(p => p.category))].length
      const totalValue = this.products.reduce((sum, p) => sum + (p.price * p.stock), 0)
      return { total, active, inactive, lowStock, categories, totalValue: totalValue.toLocaleString() }
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.pageSize) || 1
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredProducts.slice(start, end)
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
    this.loadProducts()
  },
  methods: {
    loadProducts() {
      this.loading = true
      try {
        const saved = localStorage.getItem('product_data')
        if (saved) {
          this.products = JSON.parse(saved)
        } else {
          this.products = this.getMockProducts()
          localStorage.setItem('product_data', JSON.stringify(this.products))
        }
      } catch (e) {
        this.products = this.getMockProducts()
      }
      this.filteredProducts = [...this.products]
      this.loading = false
    },
    getMockProducts() {
      const now = new Date().toISOString()
      return [
        { id: 'P001', name: '泡沫洗车液', category: '洗车', price: 68, cost: 35, stock: 45, unit: '瓶', status: 'active', description: '高浓度泡沫洗车液', createdAt: now, updatedAt: now },
        { id: 'P002', name: '水蜡', category: '洗车', price: 128, cost: 65, stock: 30, unit: '瓶', status: 'active', description: '快速上光水蜡', createdAt: now, updatedAt: now },
        { id: 'P003', name: '轮胎光亮剂', category: '美容', price: 88, cost: 40, stock: 20, unit: '瓶', status: 'active', description: '轮胎增黑光亮', createdAt: now, updatedAt: now },
        { id: 'P004', name: '抛光蜡', category: '美容', price: 388, cost: 200, stock: 15, unit: '盒', status: 'active', description: '镜面抛光蜡', createdAt: now, updatedAt: now },
        { id: 'P005', name: '内饰清洁剂', category: '保养', price: 78, cost: 35, stock: 25, unit: '瓶', status: 'inactive', description: '中性内饰清洁', createdAt: now, updatedAt: now },
        { id: 'P006', name: '发动机清洗剂', category: '保养', price: 188, cost: 90, stock: 10, unit: '瓶', status: 'active', description: '发动机舱清洗', createdAt: now, updatedAt: now },
        { id: 'P007', name: '空调清洗剂', category: '保养', price: 158, cost: 75, stock: 8, unit: '瓶', status: 'active', description: '空调系统清洗', createdAt: now, updatedAt: now },
        { id: 'P008', name: '玻璃镀膜', category: '美容', price: 228, cost: 120, stock: 12, unit: '瓶', status: 'active', description: '玻璃防水镀膜', createdAt: now, updatedAt: now },
        { id: 'P009', name: '漆面镀晶', category: '美容', price: 688, cost: 350, stock: 5, unit: '套', status: 'active', description: '纳米镀晶保护', createdAt: now, updatedAt: now },
        { id: 'P010', name: '洗车月卡', category: '会员', price: 398, cost: 200, stock: 50, unit: '张', status: 'active', description: '月度洗车卡', createdAt: now, updatedAt: now },
        { id: 'P011', name: '洗车季卡', category: '会员', price: 998, cost: 500, stock: 30, unit: '张', status: 'active', description: '季度洗车卡', createdAt: now, updatedAt: now },
        { id: 'P012', name: 'VIP年卡', category: '会员', price: 2998, cost: 1500, stock: 20, unit: '张', status: 'active', description: 'VIP年度会员卡', createdAt: now, updatedAt: now }
      ]
    },
    saveProducts() {
      try {
        localStorage.setItem('product_data', JSON.stringify(this.products))
      } catch (e) {}
    },
    formatPrice(price) {
      return (price || 0).toFixed(2)
    },
    getCategoryIcon(category) {
      const icons = { '洗车': '🚗', '美容': '✨', '保养': '🔧', '配件': '🧩', '套餐': '📦', '会员': '💳' }
      return icons[category] || '📦'
    },
    getStatusClass(product) {
      if (product.stock === 0) return 'badge-danger'
      return product.status === 'active' ? 'badge-success' : 'badge-danger'
    },
    getStatusLabel(product) {
      if (product.stock === 0) return '🚫 缺货'
      return product.status === 'active' ? '上架' : '下架'
    },
    quickFilter(key) {
      this.currentFilter = key
      this.applyFilters()
    },
    handleSearch() {
      this.currentFilter = 'all'
      this.applyFilters()
    },
    resetSearch() {
      this.searchKeyword = ''
      this.selectedCategory = ''
      this.selectedStatus = ''
      this.currentFilter = 'all'
      this.applyFilters()
    },
    applyFilters() {
      let filtered = [...this.products]
      
      // 快速筛选
      switch (this.currentFilter) {
        case 'active':
          filtered = filtered.filter(p => p.status === 'active')
          break
        case 'inactive':
          filtered = filtered.filter(p => p.status === 'inactive')
          break
        case 'low-stock':
          filtered = filtered.filter(p => p.stock < 10 && p.stock > 0 && p.status === 'active')
          break
        case 'out-of-stock':
          filtered = filtered.filter(p => p.stock === 0)
          break
        default:
          break
      }
      
      // 关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(keyword) || 
          p.id.toLowerCase().includes(keyword)
        )
      }
      
      // 分类筛选
      if (this.selectedCategory) {
        filtered = filtered.filter(p => p.category === this.selectedCategory)
      }
      
      // 状态筛选
      if (this.selectedStatus) {
        filtered = filtered.filter(p => p.status === this.selectedStatus)
      }
      
      this.filteredProducts = filtered
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
        category: '洗车',
        unit: '个',
        price: 0,
        cost: 0,
        stock: 0,
        status: 'active',
        description: ''
      }
      this.showModal = true
    },
    editProduct(id) {
      const product = this.products.find(p => p.id === id)
      if (!product) return
      this.editingId = id
      this.form = { ...product }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editingId = null
    },
    saveProduct() {
      if (!this.form.name) {
        alert('请输入商品名称')
        return
      }
      if (this.form.price < 0) {
        alert('请输入有效的价格')
        return
      }
      if (this.form.stock < 0) {
        alert('请输入有效的库存数量')
        return
      }

      if (this.editingId) {
        const index = this.products.findIndex(p => p.id === this.editingId)
        if (index >= 0) {
          this.products[index] = {
            ...this.products[index],
            ...this.form,
            updatedAt: new Date().toISOString()
          }
        }
        alert('✅ 商品已更新')
      } else {
        const newProduct = {
          id: 'P' + Date.now().toString().slice(-6),
          ...this.form,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.products.push(newProduct)
        alert('✅ 商品已创建')
      }

      this.saveProducts()
      this.filteredProducts = [...this.products]
      this.closeModal()
    },
    toggleProduct(id) {
      const product = this.products.find(p => p.id === id)
      if (product) {
        product.status = product.status === 'active' ? 'inactive' : 'active'
        product.updatedAt = new Date().toISOString()
        this.saveProducts()
        this.filteredProducts = [...this.products]
        alert(`✅ 商品 "${product.name}" 已${product.status === 'active' ? '上架' : '下架'}`)
      }
    },
    deleteProduct(id) {
      const product = this.products.find(p => p.id === id)
      if (!product) return
      if (!confirm(`确认删除商品 "${product.name}"？此操作不可恢复！`)) return
      this.products = this.products.filter(p => p.id !== id)
      this.filteredProducts = [...this.products]
      this.saveProducts()
      alert('🗑️ 商品已删除')
    },
    exportProducts() {
      const data = JSON.stringify(this.products, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `products_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      alert('✅ 商品数据已导出')
    },
    importProducts() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target.result)
            if (Array.isArray(data) && data.length > 0 && data[0].name) {
              this.products = data
              this.saveProducts()
              this.filteredProducts = [...this.products]
              alert('✅ 商品数据已导入，共 ' + data.length + ' 条')
            } else {
              alert('❌ 无效的数据格式')
            }
          } catch (err) {
            alert('❌ 解析文件失败: ' + err.message)
          }
        }
        reader.readAsText(file)
      }
      input.click()
    },
    refreshData() {
      this.loadProducts()
      alert('✅ 数据已刷新')
    }
  }
}
</script>

<style scoped>
.products-container {
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
  grid-template-columns: repeat(6, 1fr);
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
.stat-card .stat-number.danger { color: #EF4444; }
.stat-card .stat-number.purple { color: #8B5CF6; }

.stat-card .stat-label {
  font-size: 12px;
  color: #6B7280;
  margin-top: 2px;
}

.filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.filter-tag {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
  background: white;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.filter-tag:hover {
  border-color: #4F46E5;
  color: #4F46E5;
}

.filter-tag.active {
  background: #4F46E5;
  color: white;
  border-color: #4F46E5;
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

.product-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #EEF2FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.product-name {
  font-weight: 500;
}

.product-id {
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
.badge-warning { background: #FEF3C7; color: #92400E; }
.badge-secondary { background: #F3F4F6; color: #6B7280; }

.stock-warning {
  color: #EF4444;
  font-weight: 600;
}

.stock-warning .icon {
  font-size: 12px;
  margin-left: 2px;
}

.product-actions {
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

[data-theme="dark"] .filter-tag {
  background: #2C2C2E;
  border-color: #48484A;
  color: #F5F5F7;
}

[data-theme="dark"] .filter-tag.active {
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
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
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
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .products-container {
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