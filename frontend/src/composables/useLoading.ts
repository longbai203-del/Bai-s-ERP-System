import { ref, computed } from 'vue';
import { ElLoading } from 'element-plus';

export function useLoading(initialState: boolean = false) {
  const isLoading = ref(initialState);
  const loadingInstance = ref<any>(null);
  
  const isBusy = computed(() => isLoading.value);
  
  function startLoading(text: string = '加载中...') {
    isLoading.value = true;
    loadingInstance.value = ElLoading.service({
      fullscreen: true,
      text,
      background: 'rgba(0,0,0,0.7)'
    });
  }
  
  function stopLoading() {
    isLoading.value = false;
    if (loadingInstance.value) {
      loadingInstance.value.close();
      loadingInstance.value = null;
    }
  }
  
  async function withLoading<T>(fn: () => Promise<T>, text?: string): Promise<T> {
    startLoading(text);
    try {
      return await fn();
    } finally {
      stopLoading();
    }
  }
  
  return {
    isLoading,
    isBusy,
    startLoading,
    stopLoading,
    withLoading
  };
}
