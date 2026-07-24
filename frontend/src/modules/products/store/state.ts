import { ref, reactive } from 'vue';

export const useproductsState = () => {
  const items = ref<any[]>([]);
  const currentItem = ref<any | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  return {
    items,
    currentItem,
    loading,
    error,
    pagination
  };
};
