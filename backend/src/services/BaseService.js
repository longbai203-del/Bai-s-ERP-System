/**
 * @file BaseService.js
 * @description 基础服务 - 通用业务逻辑
 * @module services/BaseService
 */

class BaseService {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * 获取所有记录
     */
    async getAll(options = {}) {
        return this.repository.findAll(options);
    }

    /**
     * 根据ID获取记录
     */
    async getById(id) {
        const result = await this.repository.findById(id);
        if (!result) {
            throw new Error('记录不存在');
        }
        return result;
    }

    /**
     * 创建记录
     */
    async create(data) {
        return this.repository.create(data);
    }

    /**
     * 更新记录
     */
    async update(id, data) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error('记录不存在');
        }
        return this.repository.update(id, data);
    }

    /**
     * 删除记录
     */
    async delete(id) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error('记录不存在');
        }
        return this.repository.delete(id);
    }

    /**
     * 计数
     */
    async count(where = {}) {
        return this.repository.count(where);
    }
}

module.exports = BaseService;
