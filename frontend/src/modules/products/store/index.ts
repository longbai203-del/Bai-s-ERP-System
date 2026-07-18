/**
 * @module products/store
 * @description Products 状态管理
 */

import { defineStore } from 'pinia'
import { productsApi } from '../api'

export const useProductsStore = defineStore('products', {
  state: () => ({
    list: [] as any[],
    current: null as any,
    loading: false,
    total: 0
  }),

  actions: {
    async fetchList(params?: any) {
      this.loading = true
      try {
        const { data } = await productsApi.list(params)
        this.list = data.data || []
        this.total = data.pagination?.total || 0
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: string) {
      const { data } = await productsApi.detail(id)
      this.current = data.data
    },

    async create(data: any) {
      const { data: result } = await productsApi.create(data)
      this.list.unshift(result.data)
      return result
    },

    async update(id: string, data: any) {
      const { data: result } = await productsApi.update(id, data)
      const index = this.list.findIndex((item: any) => item.id === id)
      if (index > -1) this.list[index] = result.data
      return result
    },

    async delete(id: string) {
      await productsApi.delete(id)
      this.list = this.list.filter((item: any) => item.id !== id)
    }
  }
})
