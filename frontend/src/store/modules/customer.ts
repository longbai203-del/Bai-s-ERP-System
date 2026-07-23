import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { customerService, type Customer } from '@/services';

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([]);
  const currentCustomer = ref<Customer | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const totalCustomers = computed(() => pagination.value.total);
  
  async function fetchList(params: any = {}) {
    loading.value = true;
    error.value = null;
    try {
      const result = await customerService.getList({
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...params
      });
      customers.value = result.data || [];
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
      const result = await customerService.getById(id);
      currentCustomer.value = result;
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function create(data: Partial<Customer>) {
    loading.value = true;
    error.value = null;
    try {
      const result = await customerService.create(data);
      await fetchList();
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function update(id: string, data: Partial<Customer>) {
    loading.value = true;
    error.value = null;
    try {
      const result = await customerService.update(id, data);
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
      await customerService.delete(id);
      await fetchList();
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function toggleStatus(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const result = await customerService.toggleStatus(id);
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
    customers.value = [];
    currentCustomer.value = null;
    error.value = null;
    pagination.value = { page: 1, limit: 10, total: 0, totalPages: 0 };
  }
  
  return {
    customers,
    currentCustomer,
    loading,
    error,
    pagination,
    totalCustomers,
    fetchList,
    fetchById,
    create,
    update,
    remove,
    toggleStatus,
    reset
  };
});
