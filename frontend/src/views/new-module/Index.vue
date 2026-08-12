<template>
  <div class="new-module-page">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-cube"></i>
        新模块首页
      </h1>
      <div class="page-actions">
        <button class="btn btn-primary" @click="goToCreate">
          <i class="fas fa-plus"></i>
          创建新项目
        </button>
        <button class="btn btn-secondary" @click="refresh">
          <i class="fas fa-sync"></i>
          刷新
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="{ color: stat.color }">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-bar">
      <div class="filter-left">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索项目..."
            @keyup.enter="search"
          />
        </div>
        <select v-model="filterStatus" class="filter-select" @change="search">
          <option value="">全部状态</option>
          <option value="active">进行中</option>
          <option value="completed">已完成</option>
          <option value="archived">已归档</option>
        </select>
      </div>
      <div class="filter-right">
        <span class="total-count">共 {{ totalItems }} 个项目</span>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>项目名称</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>最后更新</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="text-center">
              <i class="fas fa-spinner fa-spin"></i> 加载中...
            </td>
          </tr>
          <tr v-else-if="items.length === 0">
            <td colspan="6" class="text-center text-muted">
              暂无数据
            </td>
          </tr>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
              <router-link :to="`/new-module/${item.id}`" class="item-link">
                {{ item.name }}
              </router-link>
            </td>
            <td>
              <span :class="['badge', getStatusClass(item.status)]">
                {{ getStatusLabel(item.status) }}
              </span>
            </td>
            <td>{{ formatDate(item.created_at) }}</td>
            <td>{{ formatDate(item.updated_at) }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-sm btn-info" @click="viewItem(item.id)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn-sm btn-warning" @click="editItem(item.id)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-sm btn-danger" @click="deleteItem(item.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="btn-page" 
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">
        第 {{ currentPage }} / {{ totalPages }} 页
      </span>
      <button 
        class="btn-page" 
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import { useToast } from '@/composables/useToast';

export default {
  name: 'NewModuleIndex',
  setup() {
    const router = useRouter();
    const { showToast } = useToast();

    // 状态
    const loading = ref(false);
    const items = ref([]);
    const totalItems = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const searchKeyword = ref('');
    const filterStatus = ref('');

    // 统计
    const stats = ref([
      { label: '总项目', value: 0, icon: 'fa-cubes', color: '#4A90D9' },
      { label: '进行中', value: 0, icon: 'fa-play-circle', color: '#28A745' },
      { label: '已完成', value: 0, icon: 'fa-check-circle', color: '#17A2B8' },
      { label: '已归档', value: 0, icon: 'fa-archive', color: '#6C757D' }
    ]);

    // 计算
    const totalPages = computed(() => {
      return Math.ceil(totalItems.value / pageSize.value);
    });

    // 方法
    const fetchData = async () => {
      loading.value = true;
      try {
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          keyword: searchKeyword.value,
          status: filterStatus.value || undefined
        };
        const response = await api.get('/new-module', { params });
        items.value = response.data.list || [];
        totalItems.value = response.data.total || 0;
        updateStats(response.data.stats);
      } catch (error) {
        console.error('加载数据失败:', error);
        showToast('加载数据失败', 'error');
      } finally {
        loading.value = false;
      }
    };

    const updateStats = (statsData) => {
      if (statsData) {
        stats.value[0].value = statsData.total || 0;
        stats.value[1].value = statsData.active || 0;
        stats.value[2].value = statsData.completed || 0;
        stats.value[3].value = statsData.archived || 0;
      }
    };

    const search = () => {
      currentPage.value = 1;
      fetchData();
    };

    const goToPage = (page) => {
      currentPage.value = page;
      fetchData();
    };

    const goToCreate = () => {
      router.push('/new-module/create');
    };

    const viewItem = (id) => {
      router.push(`/new-module/${id}`);
    };

    const editItem = (id) => {
      router.push(`/new-module/${id}/edit`);
    };

    const deleteItem = async (id) => {
      if (confirm('确定要删除这个项目吗？')) {
        try {
          await api.delete(`/new-module/${id}`);
          showToast('删除成功', 'success');
          fetchData();
        } catch (error) {
          console.error('删除失败:', error);
          showToast('删除失败', 'error');
        }
      }
    };

    const refresh = () => {
      fetchData();
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

    // 生命周期
    onMounted(() => {
      fetchData();
    });

    return {
      loading,
      items,
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      searchKeyword,
      filterStatus,
      stats,
      search,
      goToPage,
      goToCreate,
      viewItem,
      editItem,
      deleteItem,
      refresh,
      formatDate,
      getStatusLabel,
      getStatusClass
    };
  }
};
</script>

<style scoped>
.new-module-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #2D3748;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title i {
  color: #4A90D9;
}

.page-actions {
  display: flex;
  gap: 10px;
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

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-left {
  display: flex;
  gap: 12px;
  flex: 1;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  padding: 0 12px;
  flex: 1;
  max-width: 300px;
}

.search-box i {
  color: #A0AEC0;
  margin-right: 8px;
}

.search-box input {
  border: none;
  outline: none;
  padding: 8px 0;
  flex: 1;
  font-size: 14px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
}

.filter-right {
  color: #718096;
  font-size: 14px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #F7FAFC;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #4A5568;
  border-bottom: 2px solid #E2E8F0;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #E2E8F0;
}

.data-table tbody tr:hover {
  background: #F7FAFC;
}

.item-link {
  color: #4A90D9;
  text-decoration: none;
}

.item-link:hover {
  text-decoration: underline;
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

.action-buttons {
  display: flex;
  gap: 6px;
}

.btn-sm {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-info {
  background: #EBF4FF;
  color: #4A90D9;
}

.btn-info:hover {
  background: #D6E8FF;
}

.btn-warning {
  background: #FFF8E6;
  color: #D69E2E;
}

.btn-warning:hover {
  background: #FFEDCC;
}

.btn-danger {
  background: #FFE6E6;
  color: #E53E3E;
}

.btn-danger:hover {
  background: #FFCCCC;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.btn-page {
  padding: 6px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  color: #4A5568;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-page:hover:not(:disabled) {
  background: #F7FAFC;
}

.page-info {
  font-size: 14px;
  color: #4A5568;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: #A0AEC0;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-left {
    flex-wrap: wrap;
  }

  .search-box {
    max-width: none;
  }

  .page-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .page-actions {
    justify-content: stretch;
  }

  .page-actions .btn {
    flex: 1;
  }
}
</style>