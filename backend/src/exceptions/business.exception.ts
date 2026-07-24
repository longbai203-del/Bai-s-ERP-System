/**
 * @file business.exception.ts
 * @description 业务异常类
 */

import { BaseException } from './base.exception';

export class BusinessException extends BaseException {
    public code: string;

    constructor(code: string, message: string) {
        super(message);
        this.code = code;
    }
}

export default BusinessException;
