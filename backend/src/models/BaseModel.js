/**
 * 基础模型 - 纯数据定义
 * 不包含任何数据库操作逻辑
 */
class BaseModel {
    /**
     * 定义模型字段
     * @param {Object} schema - 字段定义
     */
    constructor(schema) {
        this.schema = schema;
        this.fields = Object.keys(schema);
        this.timestamps = true;
    }

    /**
     * 获取模型字段列表
     */
    getFields() {
        return this.fields;
    }

    /**
     * 获取字段类型
     */
    getFieldType(field) {
        return this.schema[field]?.type || 'string';
    }

    /**
     * 检查字段是否必填
     */
    isRequired(field) {
        return this.schema[field]?.required || false;
    }

    /**
     * 获取字段默认值
     */
    getDefaultValue(field) {
        return this.schema[field]?.default || null;
    }

    /**
     * 验证数据是否符合模型定义
     */
    validate(data) {
        const errors = [];
        for (const field of this.fields) {
            if (this.isRequired(field) && (data[field] === undefined || data[field] === null)) {
                errors.push(`${field} 是必填字段`);
            }
        }
        return errors;
    }

    /**
     * 转换数据为模型格式
     */
    toModel(data) {
        const result = {};
        for (const field of this.fields) {
            if (data[field] !== undefined) {
                result[field] = data[field];
            } else if (this.getDefaultValue(field) !== null) {
                result[field] = this.getDefaultValue(field);
            }
        }
        return result;
    }

    /**
     * 转换为JSON（排除敏感字段）
     */
    toJSON(data, exclude = ['password_hash']) {
        const result = { ...data };
        for (const field of exclude) {
            delete result[field];
        }
        return result;
    }
}

module.exports = BaseModel;
