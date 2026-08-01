/**
 * AI模块Store入口
 * @module modules/ai/store/index
 */

import { defineStore } from 'pinia'

export const useAiStore = defineStore('ai', {
  state: () => ({
    list: [] as any[],
    detail: null as any,
    loading: false,
    error: null as string | null,
    total: 0,
    filters: {}
  }),
  actions: {
    async fetchList() {
      this.loading = true
      this.error = null
      try {
        return this.list
      } finally {
        this.loading = false
      }
    },
    async fetchDetail() {
      return this.detail
    },
    async create() {
      return this.detail
    },
    async update() {
      return this.detail
    },
    async remove() {
      return true
    }
  }
})

export default useAiStore