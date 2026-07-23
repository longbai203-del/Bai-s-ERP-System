import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';

export interface TableOptions {
  fetchData: (params: any) => Promise<any>;
  immediate?: boolean;
  defaultParams?: Record<string, any>;
}

export function useTable(options: TableOptions) {
  const { fetchData, immediate = true, defaultParams = {} } = options;
  
  const data = ref<any[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const params = reactive({ ...defaultParams });
  
  const pagination = computed(() => ({
    page: page.value,
    limit: limit.value,
    total: total.value
  }));
  
  const hasData = computed(() => data.value.length > 0);
  
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
      return result;
    } catch (error) {
      ElMessage.error('加载数据失败');
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
      params[key] = defaultParams[key] || undefined;
    });
    page.value = 1;
    loadData();
  }
  
  function refresh() {
    loadData();
  }
  
  if (immediate) {
    loadData();
  }
  
  return {
    data,
    loading,
    total,
    page,
    limit,
    params,
    pagination,
    hasData,
    loadData,
    handlePageChange,
    handleLimitChange,
    search,
    resetSearch,
    refresh
  };
}
