/**
 * @module purchase/store
 * @description Purchase 状态管理
 */

import { defineStore } from 'pinia'
import { purchaseApi } from '../api'

export const usePurchaseStore = defineStore('purchase', {
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
        const { data } = await purchaseApi.list(params)
        this.list = data.data || []
        this.total = data.pagination?.total || 0
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: string) {
      const { data } = await purchaseApi.detail(id)
      this.current = data.data
    },

    async create(data: any) {
      const { data: result } = await purchaseApi.create(data)
      this.list.unshift(result.data)
      return result
    },

    async update(id: string, data: any) {
      const { data: result } = await purchaseApi.update(id, data)
      const index = this.list.findIndex((item: any) => item.id === id)
      if (index > -1) this.list[index] = result.data
      return result
    },

    async delete(id: string) {
      await purchaseApi.delete(id)
      this.list = this.list.filter((item: any) => item.id !== id)
    }
  }
})
