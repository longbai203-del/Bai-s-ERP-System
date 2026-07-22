<template>
  <div class="barcode-container">
    <!-- 页面头部 -->
    <div class="page-header no-print">
      <div>
        <h1>
          <i class="fas fa-barcode" style="color:#4F46E5;"></i>
          条码管理
          <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">商品条码</span>
        </h1>
        <div class="subtitle">商品条码生成、打印与管理</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-success" @click="printAllBarcodes">
          <i class="fas fa-print"></i> 打印所有
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
        <div class="stat-label">📊 总条码</div>
      </div>
      <div class="stat-card">
        <div class="stat-number success">{{ stats.used }}</div>
        <div class="stat-label">✅ 已使用</div>
      </div>
      <div class="stat-card">
        <div class="stat-number warning">{{ stats.unused }}</div>
        <div class="stat-label">📭 未使用</div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar no-print">
      <input 
        type="text" 
        class="search-box" 
        v-model="searchKeyword" 
        placeholder="🔍 搜索商品名称、条码..."
        @keyup.enter="handleSearch"
      />
      <select class="filter-select" v-model="selectedStatus" @change="handleSearch">
        <option value="">全部状态</option>
        <option value="used">已使用</option>
        <option value="unused">未使用</option>
      </select>
      <button class="btn btn-primary" @click="handleSearch">
        <i class="fas fa-search"></i> 搜索
      </button>
      <button class="btn btn-outline" @click="resetSearch">
        <i class="fas fa-undo"></i> 重置
      </button>
    </div>

    <!-- 生成条码 -->
    <div class="card no-print">
      <div class="card-header">
        <h3><i class="fas fa-plus-circle" style="color:#4F46E5;"></i> 生成条码</h3>
      </div>
      <div class="card-body">
        <div class="add-barcode-form">
          <input 
            type="text" 
            v-model="barcodeForm.productName" 
            placeholder="商品名称"
            @keyup.enter="generateBarcode"
          />
          <input 
            type="text" 
            v-model="barcodeForm.number" 
            placeholder="条码号 (留空自动生成)"
            @keyup.enter="generateBarcode"
          />
          <select v-model="barcodeForm.type">
            <option value="EAN-13">EAN-13</option>
            <option value="EAN-8">EAN-8</option>
            <option value="CODE128">CODE128</option>
            <option value="QR">QR Code</option>
          </select>
          <button class="btn btn-primary" @click="generateBarcode">
            <i class="fas fa-plus"></i> 生成
          </button>
        </div>
      </div>
    </div>

    <!-- 条码列表 -->
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-th" style="color:#4F46E5;"></i> 条码列表</h3>
        <span style="font-size:12px;color:#6B7280;">共 {{ filteredBarcodes.length }} 个</span>
      </div>
      <div class="card-body">
        <div class="barcode-grid" v-if="filteredBarcodes.length > 0">
          <div class="barcode-card" v-for="barcode in paginatedBarcodes" :key="barcode.id">
            <div class="barcode-image">
              <div class="barcode-visual">{{ generateBarcodeVisual(barcode.number) }}</div>
            </div>
            <div class="barcode-number">{{ barcode.number }}</div>
            <div class="barcode-product">{{ barcode.product || '未关联' }}</div>
            <div style="margin-top:4px;">
              <span class="badge" :class="barcode.status === 'used' ? 'badge-success' : 'badge-secondary'">
                {{ barcode.status === 'used' ? '✅ 已使用' : '📭 未使用' }}
              </span>
            </div>
            <div class="barcode-actions">
              <button class="btn-icon btn-icon-primary" @click="printBarcode(barcode.id)" title="打印">
                <i class="fas fa-print"></i>
              </button>
              <button 
                class="btn-icon" 
                :class="barcode.status === 'used' ? 'btn-icon-warning' : 'btn-icon-success'"
                @click="toggleBarcodeStatus(barcode.id)"
                :title="barcode.status === 'used' ? '标记为未使用' : '标记为已使用'"
              >
                <i class="fas" :class="barcode.status === 'used' ? 'fa-undo' : 'fa-check'"></i>
              </button>
              <button class="btn-icon btn-icon-danger" @click="deleteBarcode(barcode.id)" title="删除">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <i class="fas fa-barcode"></i>
          <p>暂无条码数据</p>
          <span class="hint">使用上方表单生成条码</span>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="filteredBarcodes.length > 0">
          <span class="info">共 {{ filteredBarcodes.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页</span>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'Barcodes',
  data() {
    return {
      barcodes: [],
      filteredBarcodes: [],
      loading: false,
      currentPage: 1,
      pageSize: 12,
      searchKeyword: '',
      selectedStatus: '',
      barcodeForm: {
        productName: '',
        number: '',
        type: 'EAN-13'
      }
    }
  },
  computed: {
    stats() {
      const total = this.barcodes.length
      const used = this.barcodes.filter(b => b.status === 'used').length
      const unused = total - used
      return { total, used, unused }
    },
    totalPages() {
      return Math.ceil(this.filteredBarcodes.length / this.pageSize) || 1
    },
    paginatedBarcodes() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredBarcodes.slice(start, end)
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
    this.loadBarcodes()
  },
  methods: {
    loadBarcodes() {
      this.loading = true
      try {
        const saved = localStorage.getItem('barcode_data')
        if (saved) {
          this.barcodes = JSON.parse(saved)
        } else {
          this.barcodes = this.getMockBarcodes()
          localStorage.setItem('barcode_data', JSON.stringify(this.barcodes))
        }
      } catch (e) {
        this.barcodes = this.getMockBarcodes()
      }
      this.filteredBarcodes = [...this.barcodes]
      this.loading = false
    },
    getMockBarcodes() {
      const products = ['标准洗车', '精致洗车', '全车镀晶', '内饰清洁', '机油更换', '轮胎护理']
      return products.map((p, i) => ({
        id: 'BC-' + String(i + 1).padStart(6, '0'),
        number: '6901234' + String(10000 + i).padStart(5, '0'),
        product: p,
        type: 'EAN-13',
        status: i % 3 === 0 ? 'unused' : 'used'
      }))
    },
    saveBarcodes() {
      try {
        localStorage.setItem('barcode_data', JSON.stringify(this.barcodes))
      } catch (e) {}
    },
    generateBarcodeVisual(number) {
      const chars = number.split('')
      return chars.map(c => {
        const pattern = parseInt(c) % 2 === 0 ? '█' : '▄'
        return pattern.repeat(2)
      }).join('')
    },
    generateBarcodeNumber() {
      const prefix = ['690', '691', '692', '693', '694', '695'][Math.floor(Math.random() * 6)]
      const number = String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')
      const checkDigit = String(Math.floor(Math.random() * 10))
      return prefix + number + checkDigit
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
      let filtered = [...this.barcodes]
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(b => 
          b.number.includes(keyword) || 
          (b.product && b.product.toLowerCase().includes(keyword))
        )
      }
      if (this.selectedStatus) {
        filtered = filtered.filter(b => b.status === this.selectedStatus)
      }
      this.filteredBarcodes = filtered
      this.currentPage = 1
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
    generateBarcode() {
      const product = this.barcodeForm.productName.trim()
      if (!product) {
        alert('请输入商品名称')
        return
      }

      const number = this.barcodeForm.number.trim() || this.generateBarcodeNumber()
      const newBarcode = {
        id: 'BC-' + Date.now().toString().slice(-6),
        number: number,
        product: product,
        type: this.barcodeForm.type,
        status: 'unused'
      }

      this.barcodes.push(newBarcode)
      this.saveBarcodes()
      this.filteredBarcodes = [...this.barcodes]
      this.barcodeForm.productName = ''
      this.barcodeForm.number = ''
      alert('✅ 条码已生成: ' + number)
    },
    toggleBarcodeStatus(id) {
      const barcode = this.barcodes.find(b => b.id === id)
      if (barcode) {
        barcode.status = barcode.status === 'used' ? 'unused' : 'used'
        this.saveBarcodes()
        this.filteredBarcodes = [...this.barcodes]
      }
    },
    deleteBarcode(id) {
      if (!confirm('确认删除该条码？')) return
      this.barcodes = this.barcodes.filter(b => b.id !== id)
      this.filteredBarcodes = [...this.barcodes]
      this.saveBarcodes()
    },
    printBarcode(id) {
      const barcode = this.barcodes.find(b => b.id === id)
      if (!barcode) return
      
      const printWindow = window.open('', '_blank', 'width=400,height=300')
      if (!printWindow) {
        alert('请允许弹出窗口')
        return
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>条码打印</title>
            <style>
              body { font-family: 'Courier New', monospace; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: white; }
              .barcode { font-size: 32px; letter-spacing: 2px; text-align: center; padding: 20px; }
              .number { font-size: 24px; font-weight: bold; text-align: center; }
              .product { font-size: 16px; text-align: center; color: #6B7280; }
            </style>
          </head>
          <body>
            <div>
              <div class="barcode">${this.generateBarcodeVisual(barcode.number)}</div>
              <div class="number">${barcode.number}</div>
              <div class="product">${barcode.product}</div>
              <script>
                window.onload = function() { 
                  window.print(); 
                  window.close(); 
                }
              <\/script>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
    },
    printAllBarcodes() {
      if (this.barcodes.length === 0) {
        alert('没有条码可打印')
        return
      }
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      if (!printWindow) {
        alert('请允许弹出窗口')
        return
      }
      
      let html = `
        <html>
          <head>
            <title>条码打印</title>
            <style>
              body { font-family: 'Courier New', monospace; padding: 20px; }
              .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
              .item { text-align: center; border: 1px solid #E5E7EB; padding: 16px; border-radius: 8px; }
              .barcode { font-size: 24px; letter-spacing: 2px; }
              .number { font-size: 18px; font-weight: bold; margin: 8px 0; }
              .product { font-size: 14px; color: #6B7280; }
            </style>
          </head>
          <body>
            <div class="grid">
      `
      
      this.barcodes.forEach(b => {
        html += `
          <div class="item">
            <div class="barcode">${this.generateBarcodeVisual(b.number)}</div>
            <div class="number">${b.number}</div>
            <div class="product">${b.product || ''}</div>
          </div>
        `
      })
      
      html += `
            </div>
            <script>
              window.onload = function() { 
                window.print(); 
                window.close(); 
              }
            <\/script>
          </body>
        </html>
      `
      
      printWindow.document.write(html)
      printWindow.document.close()
    },
    refreshData() {
      this.loadBarcodes()
      alert('✅ 数据已刷新')
    }
  }
}
</script>

<style scoped>
.barcode-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.no-print {
  /* 打印时隐藏 */
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

.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  margin-bottom: 16px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #E5E7EB;
  background: #F9FAFB;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-body {
  padding: 16px;
}

.add-barcode-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.add-barcode-form input,
.add-barcode-form select {
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  flex: 1;
  min-width: 120px;
}

.add-barcode-form input:focus,
.add-barcode-form select:focus {
  border-color: #4F46E5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.barcode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.barcode-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #E5E7EB;
  text-align: center;
  transition: all 0.3s ease;
}

.barcode-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.barcode-image {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
}

.barcode-visual {
  font-family: 'Courier New', monospace;
  font-size: 20px;
  letter-spacing: 1px;
  color: #1F2937;
  word-break: break-all;
}

.barcode-number {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: 600;
  margin: 4px 0;
}

.barcode-product {
  font-size: 14px;
  color: #6B7280;
}

.barcode-actions {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-top: 8px;
  padding-top: 8px;
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
.badge-secondary { background: #F3F4F6; color: #6B7280; }

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
  padding: 40px 20px;
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
  border-top: 1px solid #F3F4F6;
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

@media print {
  .no-print {
    display: none !important;
  }
}

/* 暗色模式 */
[data-theme="dark"] .stat-card,
[data-theme="dark"] .toolbar,
[data-theme="dark"] .card,
[data-theme="dark"] .barcode-card,
[data-theme="dark"] .pagination {
  background: #2C2C2E;
  border-color: #48484A;
}

[data-theme="dark"] .stat-card .stat-number,
[data-theme="dark"] .page-header h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .card-header {
  background: #3A3A3C;
  border-color: #48484A;
}

[data-theme="dark"] .barcode-image {
  background: #3A3A3C;
}

[data-theme="dark"] .barcode-product {
  color: #9CA3AF;
}

[data-theme="dark"] .barcode-actions {
  border-color: #3A3A3C;
}

[data-theme="dark"] .add-barcode-form input,
[data-theme="dark"] .add-barcode-form select,
[data-theme="dark"] .toolbar .search-box,
[data-theme="dark"] .toolbar .filter-select {
  background: #3A3A3C;
  border-color: #48484A;
  color: #F5F5F7;
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

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .add-barcode-form {
    flex-direction: column;
  }
  
  .add-barcode-form input,
  .add-barcode-form select {
    width: 100%;
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
  
  .barcode-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .barcode-container {
    padding: 12px;
  }
  
  .page-header h1 {
    font-size: 20px;
  }
  
  .barcode-grid {
    grid-template-columns: 1fr 1fr;
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