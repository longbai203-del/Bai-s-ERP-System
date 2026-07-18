/**
 * DTO基类
 * 定义数据传输对象规范
 */
class BaseDTO {
    constructor(data) {
        this.raw = data;
        this.transformed = null;
    }

    /**
     * 转换数据
     */
    transform() {
        return this.raw;
    }

    /**
     * 验证数据
     */
    validate() {
        return { valid: true, errors: [] };
    }

    /**
     * 获取转换后的数据
     */
    getData() {
        if (!this.transformed) {
            this.transformed = this.transform();
        }
        return this.transformed;
    }

    /**
     * 获取验证结果
     */
    getValidation() {
        return this.validate();
    }
}

module.exports = BaseDTO;
