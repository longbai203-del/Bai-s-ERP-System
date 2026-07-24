/**
 * @file base.exception.ts
 * @description 基础异常类
 */

export class BaseException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export default BaseException;
