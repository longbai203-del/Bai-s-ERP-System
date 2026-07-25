/**
 * 库存模块类型定义
 * @module modules/inventory/store/types
 */

/**
 * 库存接口
 */
export interface Inventory {
  id: string;
  productId: string;
  productName?: string;
  productSku?: string;
  warehouseId: string;
  warehouseName?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderPoint: number;
  maxStock: number;
  location: string;
  batchNumber: string;
  expiryDate: string | null;
  serialNumbers: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 库存调整类型
 */
export enum InventoryAdjustmentType {
  ADD = 'add',
  SUBTRACT = 'subtract',
}

/**
 * 库存调整请求
 */
export interface AdjustInventoryRequest {
  type: InventoryAdjustmentType;
  quantity: number;
  reason: string;
  reference?: string;
}

/**
 * 库存查询参数
 */
export interface InventoryQueryParams {
  page?: number;
  limit?: number;
  productId?: string;
  warehouseId?: string;
  lowStock?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 库存状态
 */
export interface InventoryState {
  inventories: Inventory[];
  currentInventory: Inventory | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: InventoryQueryParams;
}

export default {
  Inventory,
  InventoryAdjustmentType,
  AdjustInventoryRequest,
  InventoryQueryParams,
  InventoryState,
};