import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';

export interface TableOptions {
  fetchData: (params: any) => Promise<any>;
  immediate?: boolean;
  defaultParams?: Record<string, any>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useTable(options: TableOptions) {
  const { fetchData, immediate = true, defaultParams = {}, onSuccess, onError } = options;
  
  // ===== State =====
  const data = ref<any[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const params = reactive({ ...defaultParams });
  const selectedRows = ref<any[]>([]);
  
  // ===== Getters =====
  const pagination = computed(() => ({
    page: page.value,
    limit: limit.value,
    total: total.value
  }));
  
  const hasData = computed(() => data.value.length > 0);
  const isEmpty = computed(() => !loading.value && data.value.length === 0);
  
  // ===== Actions =====
  async function loadData() {
    loading.value = true;
    try {
      const result = await fetchData({
        page: page.value,
        limit: limit.value,
        ...params
      });
      
      data.value = result.data || [];
      total.value = result.total || 0;
      
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      ElMessage.error('加载数据失败');
      if (onError) onError(error);
      throw error;
    } finally {
      loading.value = false;
    }
  }
  
  function handlePageChange(pageNum: number) {
    page.value = pageNum;
    loadData();
  }
  
  function handleLimitChange(limitNum: number) {
    limit.value = limitNum;
    page.value = 1;
    loadData();
  }
  
  function search(searchParams: Record<string, any>) {
    Object.assign(params, searchParams);
    page.value = 1;
    loadData();
  }
  
  function resetSearch() {
    Object.keys(params).forEach(key => {
      params[key] = defaultParams[key] !== undefined ? defaultParams[key] : undefined;
    });
    page.value = 1;
    loadData();
  }
  
  function refresh() {
    loadData();
  }
  
  function handleSelectionChange(rows: any[]) {
    selectedRows.value = rows;
  }
  
  // ===== Watch =====
  if (immediate) {
    loadData();
  }
  
  return {
    // State
    data,
    loading,
    total,
    page,
    limit,
    params,
    selectedRows,
    
    // Getters
    pagination,
    hasData,
    isEmpty,
    
    // Actions
    loadData,
    handlePageChange,
    handleLimitChange,
    search,
    resetSearch,
    refresh,
    handleSelectionChange
  };
}
