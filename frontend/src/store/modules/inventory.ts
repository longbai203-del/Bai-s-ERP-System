import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { inventoryService, type InventoryItem } from '@/services';

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const items = ref<InventoryItem[]>([]);
  const currentItem = ref<InventoryItem | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // Getters
  const totalItems = computed(() => pagination.value.total);
  const hasItems = computed(() => items.value.length > 0);
  const isLoading = computed(() => loading.value);
  
  // Actions
  async function fetchList(params: any = {}) {
    loading.value = true;
    error.value = null;
    try {
      const result = await inventoryService.getList({
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...params
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
      const result = await inventoryService.getById(id);
      currentItem.value = result;
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function create(data: Partial<InventoryItem>) {
    loading.value = true;
    error.value = null;
    try {
      const result = await inventoryService.create(data);
      await fetchList();
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function update(id: string, data: Partial<InventoryItem>) {
    loading.value = true;
    error.value = null;
    try {
      const result = await inventoryService.update(id, data);
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
      await inventoryService.delete(id);
      await fetchList();
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function updateStock(id: string, quantity: number) {
    loading.value = true;
    error.value = null;
    try {
      const result = await inventoryService.updateStock(id, quantity);
      await fetchList();
      return result;
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
    updateStock,
    reset
  };
});
