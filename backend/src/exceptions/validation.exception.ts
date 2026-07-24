/**
 * @file validation.exception.ts
 * @description 验证异常类
 */

import { HttpException } from './http.exception';

export class ValidationException extends HttpException {
    public errors: any[];

    constructor(errors: any[], message: string = 'Validation failed') {
        super(400, message);
        this.errors = errors;
    }
}

export default ValidationException;
