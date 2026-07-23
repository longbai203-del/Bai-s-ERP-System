import { reactive, ref, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

export interface FormOptions<T = any> {
  submit: (data: T) => Promise<any>;
  update?: (id: string, data: T) => Promise<any>;
  fetch?: (id: string) => Promise<T>;
  delete?: (id: string) => Promise<any>;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useForm<T extends Record<string, any>>(
  initialData: T,
  options: FormOptions<T>
) {
  const {
    submit,
    update,
    fetch: fetchFn,
    delete: deleteFn,
    onSuccess,
    onError,
    successMessage = '操作成功',
    errorMessage = '操作失败'
  } = options;
  
  // ===== State =====
  const formRef = ref<FormInstance>();
  const formData = reactive<T>({ ...initialData });
  const loading = ref(false);
  const editMode = ref(false);
  const currentId = ref<string>('');
  
  // ===== Getters =====
  const isEdit = computed(() => editMode.value);
  const isSubmitting = computed(() => loading.value);
  const formTitle = computed(() => isEdit.value ? '编辑' : '创建');
  
  // ===== Actions =====
  async function loadData(id: string) {
    if (!fetchFn) return;
    
    loading.value = true;
    try {
      const result = await fetchFn(id);
      Object.assign(formData, result);
      currentId.value = id;
      editMode.value = true;
      return result;
    } catch (error) {
      ElMessage.error('加载数据失败');
      if (onError) onError(error);
      throw error;
    } finally {
      loading.value = false;
    }
  }
  
  async function handleSubmit() {
    if (!formRef.value) return;
    
    await formRef.value.validate(async (valid) => {
      if (!valid) return;
      
      loading.value = true;
      try {
        let result;
        if (editMode.value && update) {
          result = await update(currentId.value, formData);
        } else {
          result = await submit(formData);
        }
        
        ElMessage.success(successMessage);
        if (onSuccess) onSuccess(result);
        reset();
        return result;
      } catch (error) {
        ElMessage.error(errorMessage);
        if (onError) onError(error);
        throw error;
      } finally {
        loading.value = false;
      }
    });
  }
  
  async function handleDelete(id: string, name: string = '') {
    if (!deleteFn) return;
    
    await ElMessageBox.confirm(
      `确定要删除${name ? ` ${name}` : ''}吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    loading.value = true;
    try {
      await deleteFn(id);
      ElMessage.success('删除成功');
      if (onSuccess) onSuccess(null);
      return true;
    } catch (error) {
      ElMessage.error('删除失败');
      if (onError) onError(error);
      throw error;
    } finally {
      loading.value = false;
    }
  }
  
  function reset() {
    Object.keys(formData).forEach(key => {
      formData[key] = initialData[key] as any;
    });
    editMode.value = false;
    currentId.value = '';
    formRef.value?.resetFields();
  }
  
  function setField(field: keyof T, value: any) {
    formData[field] = value;
  }
  
  function setFields(fields: Partial<T>) {
    Object.assign(formData, fields);
  }
  
  function setEditMode(id: string, data?: Partial<T>) {
    currentId.value = id;
    editMode.value = true;
    if (data) {
      Object.assign(formData, data);
    }
  }
  
  return {
    // State
    formRef,
    formData,
    loading,
    editMode,
    currentId,
    
    // Getters
    isEdit,
    isSubmitting,
    formTitle,
    
    // Actions
    loadData,
    handleSubmit,
    handleDelete,
    reset,
    setField,
    setFields,
    setEditMode
  };
}
