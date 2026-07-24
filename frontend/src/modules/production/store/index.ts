import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '@/services';

export const useproductionStore = defineStore('production', () => {
  // ===== State =====
  const items = ref<any[]>([]);
  const currentItem = ref<any | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // ===== Getters =====
  const totalItems = computed(() => pagination.value.total);
  const hasItems = computed(() => items.value.length > 0);
  const isLoading = computed(() => loading.value);

  // ===== Actions =====
  async function fetchList(params: any = {}) {
    loading.value = true;
    error.value = null;
    try {
      // API 调用
      const result = await apiService.get('/production', {
        params: { page: pagination.value.page, limit: pagination.value.limit, ...params }
      });
      items.value = result.data || [];
      pagination.value = {
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      };
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const result = await apiService.get(`/production/${id}`);
      currentItem.value = result;
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function create(data: any) {
    loading.value = true;
    error.value = null;
    try {
      const result = await apiService.post('/production', data);
      await fetchList();
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, data: any) {
    loading.value = true;
    error.value = null;
    try {
      const result = await apiService.put(`/production/${id}`, data);
      await fetchList();
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await apiService.delete(`/production/${id}`);
      await fetchList();
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    items.value = [];
    currentItem.value = null;
    error.value = null;
    pagination.value = { page: 1, limit: 10, total: 0, totalPages: 0 };
  }

  return {
    items,
    currentItem,
    loading,
    error,
    pagination,
    totalItems,
    hasItems,
    isLoading,
    fetchList,
    fetchById,
    create,
    update,
    remove,
    reset
  };
});
