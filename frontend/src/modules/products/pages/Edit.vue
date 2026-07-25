<template>
  <div class="product-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/products' }">产品管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑产品 #{{ productData?.sku || '加载中...' }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="page-title">编辑产品</h1>
      </div>
      <div class="header-right">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          保存产品
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="12" animated />
    </div>

    <!-- 编辑表单 -->
    <template v-else-if="productData">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="product-form"
      >
        <el-row :gutter="20">
          <el-col :span="16">
            <!-- 基本信息 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>基本信息</span>
                  <el-tag :type="statusType" size="small">
                    {{ statusText }}
                  </el-tag>
                </div>
              </template>
              <el-form-item label="产品名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入产品名称" />
              </el-form-item>
              <el-form-item label="SKU" prop="sku">
                <el-input v-model="formData.sku" placeholder="请输入SKU编号" />
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input
                  v-model="formData.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入产品描述"
                />
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="分类" prop="category">
                    <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%">
                      <el-option
                        v-for="cat in categoryOptions"
                        :key="cat.value"
                        :label="cat.label"
                        :value="cat.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="品牌" prop="brand">
                    <el-select
                      v-model="formData.brand"
                      placeholder="请选择品牌"
                      filterable
                      allow-create
                      style="width: 100%"
                    >
                      <el-option
                        v-for="brand in brandOptions"
                        :key="brand"
                        :label="brand"
                        :value="brand"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="formData.status">
                  <el-radio label="active">上架</el-radio>
                  <el-radio label="inactive">下架</el-radio>
                  <el-radio label="discontinued">停售</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="精选产品">
                <el-switch v-model="formData.isFeatured" />
                <span class="field-hint" v-if="formData.isFeatured">该产品将在首页展示</span>
              </el-form-item>
            </el-card>

            <!-- 价格与库存 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>价格与库存</span>
                </div>
              </template>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="价格" prop="price">
                    <el-input-number
                      v-model="formData.price"
                      :min="0"
                      :precision="2"
                      :step="0.01"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="成本" prop="cost">
                    <el-input-number
                      v-model="formData.cost"
                      :min="0"
                      :precision="2"
                      :step="0.01"
                      style="width: 100%"
                    />
                    <div class="field-hint" v-if="formData.cost && formData.price">
                      <el-text :type="formData.price > formData.cost ? 'success' : 'danger'" size="small">
                        {{ formData.price > formData.cost ? '✅ 有利润' : '⚠️ 可能亏损' }}
                        毛利率: {{ ((formData.price - formData.cost) / formData.price * 100).toFixed(1) }}%
                      </el-text>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="库存数量" prop="quantity">
                    <el-input-number
                      v-model="formData.quantity"
                      :min="0"
                      :max="99999999"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="补货点" prop="reorderLevel">
                    <el-input-number
                      v-model="formData.reorderLevel"
                      :min="0"
                      :max="99999"
                      style="width: 100%"
                    />
                    <div class="field-hint" v-if="formData.quantity <= formData.reorderLevel">
                      <el-text type="warning" size="small">⚠️ 需要补货</el-text>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <!-- 标签 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>标签</span>
                </div>
              </template>
              <el-form-item label="标签" prop="tags">
                <el-select
                  v-model="formData.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请输入标签，按回车确认"
                  style="width: 100%"
                >
                  <el-option
                    v-for="tag in tagOptions"
                    :key="tag"
                    :label="tag"
                    :value="tag"
                  />
                </el-select>
              </el-form-item>
            </el-card>
          </el-col>

          <el-col :span="8">
            <!-- 产品图片 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>产品图片</span>
                  <el-button type="text" size="small" @click="handleAddImage">
                    + 添加
                  </el-button>
                </div>
              </template>
              <div class="product-images">
                <div
                  v-for="(image, index) in formData.images"
                  :key="index"
                  class="image-item"
                >
                  <img :src="image" alt="产品图片" />
                  <div class="image-actions">
                    <el-button type="danger" size="small" circle @click="handleRemoveImage(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
                <div
                  v-if="formData.images.length === 0"
                  class="image-empty"
                  @click="handleAddImage"
                >
                  <el-icon><Plus /></el-icon>
                  <span>点击上传图片</span>
                </div>
              </div>
            </el-card>

            <!-- 产品规格 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>产品规格</span>
                </div>
              </template>
              <el-form-item label="重量 (kg)" prop="weight">
                <el-input-number
                  v-model="formData.weight"
                  :min="0"
                  :precision="2"
                  :step="0.1"
                  style="width: 100%"
                />
              </el-form-item>
              <div class="dimensions">
                <el-form-item label="尺寸 (cm)">
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-input-number
                        v-model="formData.dimensions.length"
                        :min="0"
                        :precision="1"
                        :step="1"
                        placeholder="长"
                        style="width: 100%"
                      />
                    </el-col>
                    <el-col :span="8">
                      <el-input-number
                        v-model="formData.dimensions.width"
                        :min="0"
                        :precision="1"
                        :step="1"
                        placeholder="宽"
                        style="width: 100%"
                      />
                    </el-col>
                    <el-col :span="8">
                      <el-input-number
                        v-model="formData.dimensions.height"
                        :min="0"
                        :precision="1"
                        :step="1"
                        placeholder="高"
                        style="width: 100%"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>
            </el-card>

            <!-- 统计信息 -->
            <el-card class="form-section" shadow="hover">
              <template #header>
                <div class="section-header">
                  <span>统计信息</span>
                </div>
              </template>
              <div class="stats-info">
                <div class="stat-item">
                  <span class="stat-label">评分</span>
                  <el-rate
                    v-model="productData.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}分"
                  />
                </div>
                <div class="stat-item">
                  <span class="stat-label">评论数</span>
                  <span class="stat-value">{{ productData.reviews || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">创建时间</span>
                  <span class="stat-value">{{ formatDate(productData.createdAt) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">最后更新</span>
                  <span class="stat-value">{{ formatDate(productData.updatedAt) }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
    </template>

    <!-- 添加图片对话框 -->
    <el-dialog
      v-model="imageDialogVisible"
      title="添加图片"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        action="#"
        :auto-upload="false"
        :multiple="true"
        :limit="5"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        list-type="picture-card"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <template #footer>
        <el-button @click="imageDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddImages" :loading="uploading">
          确认上传
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';
import { useProductStore } from '../store';
import { formatDate } from '@/utils/format';

// ==================== 路由和Store ====================
const route = useRoute();
const router = useRouter();
const productStore = useProductStore();

// ==================== 引用 ====================
const formRef = ref<FormInstance>();
const uploadRef = ref();

// ==================== 状态 ====================
const loading = ref(true);
const submitting = ref(false);
const uploading = ref(false);
const imageDialogVisible = ref(false);
const uploadedFiles = ref<any[]>([]);

// ==================== 数据 ====================
const productData = ref<any>(null);
const categoryOptions = [
  { value: '电子产品', label: '电子产品' },
  { value: '服装服饰', label: '服装服饰' },
  { value: '食品饮料', label: '食品饮料' },
  { value: '家居用品', label: '家居用品' },
  { value: '办公用品', label: '办公用品' },
  { value: '工业设备', label: '工业设备' },
  { value: '汽车配件', label: '汽车配件' },
  { value: '运动户外', label: '运动户外' },
];
const brandOptions = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Xiaomi'];
const tagOptions = ['新品', '热卖', '限时优惠', '高端', '环保', '智能', '推荐'];

// ==================== 表单数据 ====================
const formData = reactive({
  id: '',
  name: '',
  sku: '',
  description: '',
  category: '',
  brand: '',
  price: 0,
  cost: 0,
  quantity: 0,
  reorderLevel: 10,
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
    unit: 'cm',
  },
  images: [] as string[],
  status: 'active' as 'active' | 'inactive' | 'discontinued',
  isFeatured: false,
  tags: [] as string[],
});

// ==================== 表单验证规则 ====================
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { min: 1, max: 200, message: '产品名称长度在1-200个字符', trigger: 'blur' },
  ],
  sku: [
    { required: true, message: '请输入SKU', trigger: 'blur' },
    { min: 1, max: 50, message: 'SKU长度在1-50个字符', trigger: 'blur' },
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能为负数', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

// ==================== 计算属性 ====================
const statusText = computed(() => {
  const map: Record<string, string> = {
    active: '上架',
    inactive: '下架',
    discontinued: '停售',
  };
  return map[formData.status] || formData.status;
});

const statusType = computed(() => {
  const map: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    discontinued: 'danger',
  };
  return map[formData.status] || 'info';
});

// ==================== 方法 ====================

/**
 * 加载产品数据
 */
const loadProductData = async () => {
  const id = route.params.id as string;
  if (!id) {
    ElMessage.error('产品ID无效');
    router.push('/products');
    return;
  }

  loading.value = true;
  try {
    const data = await productStore.getProductDetail(id);
    if (data) {
      productData.value = data;
      Object.assign(formData, {
        id: data.id,
        name: data.name || '',
        sku: data.sku || '',
        description: data.description || '',
        category: data.category || '',
        brand: data.brand || '',
        price: data.price || 0,
        cost: data.cost || 0,
        quantity: data.quantity || 0,
        reorderLevel: data.reorderLevel || 10,
        weight: data.weight || 0,
        dimensions: {
          length: data.dimensions?.length || 0,
          width: data.dimensions?.width || 0,
          height: data.dimensions?.height || 0,
          unit: data.dimensions?.unit || 'cm',
        },
        images: data.images || [],
        status: data.status || 'active',
        isFeatured: data.isFeatured || false,
        tags: data.tags || [],
      });
    } else {
      ElMessage.error('产品不存在');
      router.push('/products');
    }
  } catch (error) {
    console.error('加载产品数据失败:', error);
    ElMessage.error('加载产品数据失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 添加图片
 */
const handleAddImage = () => {
  imageDialogVisible.value = true;
};

/**
 * 移除图片
 */
const handleRemoveImage = (index: number) => {
  formData.images.splice(index, 1);
  ElMessage.success('图片已移除');
};

/**
 * 文件选择
 */
const handleFileChange = (file: any) => {
  uploadedFiles.value.push(file);
};

/**
 * 文件移除
 */
const handleFileRemove = (file: any) => {
  const index = uploadedFiles.value.indexOf(file);
  if (index > -1) {
    uploadedFiles.value.splice(index, 1);
  }
};

/**
 * 确认添加图片
 */
const confirmAddImages = async () => {
  if (uploadedFiles.value.length === 0) {
    ElMessage.warning('请选择图片');
    return;
  }

  uploading.value = true;
  try {
    // 实际项目中上传到服务器
    const imageUrls = uploadedFiles.value.map((file) => {
      // 模拟上传：生成base64 URL
      return URL.createObjectURL(file.raw);
    });

    formData.images.push(...imageUrls);
    ElMessage.success(`成功添加 ${imageUrls.length} 张图片`);
    imageDialogVisible.value = false;
    uploadedFiles.value = [];
  } catch (error) {
    console.error('上传图片失败:', error);
    ElMessage.error('上传图片失败');
  } finally {
    uploading.value = false;
  }
};

/**
 * 取消编辑
 */
const handleCancel = () => {
  router.push(`/products/${productData.value?.id}`);
};

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
  } catch {
    return;
  }

  submitting.value = true;
  try {
    await productStore.updateProduct(productData.value.id, formData);
    ElMessage.success('产品更新成功');
    router.push(`/products/${productData.value.id}`);
  } catch (error) {
    console.error('保存产品失败:', error);
    ElMessage.error('保存产品失败');
  } finally {
    submitting.value = false;
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadProductData();
});
</script>

<style scoped lang="scss">
.product-edit-page {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;

    .header-left {
      .page-title {
        font-size: 24px;
        font-weight: 600;
        margin: 8px 0 0;
        color: #303133;
      }
    }

    .header-right {
      display: flex;
      gap: 12px;
    }
  }

  .loading-container {
    padding: 40px 0;
  }

  .form-section {
    margin-bottom: 24px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 16px;
    }
  }

  .field-hint {
    margin-top: 4px;
  }

  .product-images {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    .image-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #ebeef5;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-actions {
        position: absolute;
        top: 4px;
        right: 4px;
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover .image-actions {
        opacity: 1;
      }
    }

    .image-empty {
      aspect-ratio: 1;
      border: 2px dashed #dcdfe6;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #909399;
      transition: all 0.3s;

      &:hover {
        border-color: #409EFF;
        color: #409EFF;
      }

      .el-icon {
        font-size: 32px;
      }

      span {
        margin-top: 8px;
        font-size: 14px;
      }
    }
  }

  .stats-info {
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f5f7fa;

      &:last-child {
        border-bottom: none;
      }

      .stat-label {
        color: #909399;
        font-size: 14px;
      }

      .stat-value {
        color: #303133;
        font-weight: 500;
      }
    }
  }
}

@media (max-width: 768px) {
  .product-edit-page {
    padding: 12px;

    .page-header {
      flex-direction: column;
      gap: 12px;

      .header-right {
        width: 100%;
      }
    }

    .product-images {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>