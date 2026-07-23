import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { orderService, type Order } from '@/services';

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([]);
  const currentOrder = ref<Order | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const statistics = ref<any>(null);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const totalOrders = computed(() => pagination.value.total);
  const hasOrders = computed(() => orders.value.length > 0);
  
  async function fetchList(params: any = {}) {
    loading.value = true;
    error.value = null;
    try {
      const result = await orderService.getList({
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...params
      });
      orders.value = result.data || [];
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
      const result = await orderService.getById(id);
      currentOrder.value = result;
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function create(data: Partial<Order>) {
    loading.value = true;
    error.value = null;
    try {
      const result = await orderService.create(data);
      await fetchList();
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function updateStatus(id: string, status: string) {
    loading.value = true;
    error.value = null;
    try {
      const result = await orderService.updateStatus(id, status);
      await fetchList();
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function cancelOrder(id: string, reason: string) {
    loading.value = true;
    error.value = null;
    try {
      const result = await orderService.cancelOrder(id, reason);
      await fetchList();
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function fetchStatistics() {
    loading.value = true;
    error.value = null;
    try {
      const result = await orderService.getStatistics();
      statistics.value = result;
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  function reset() {
    orders.value = [];
    currentOrder.value = null;
    error.value = null;
    statistics.value = null;
    pagination.value = { page: 1, limit: 10, total: 0, totalPages: 0 };
  }
  
  return {
    orders,
    currentOrder,
    loading,
    error,
    statistics,
    pagination,
    totalOrders,
    hasOrders,
    fetchList,
    fetchById,
    create,
    updateStatus,
    cancelOrder,
    fetchStatistics,
    reset
  };
});
