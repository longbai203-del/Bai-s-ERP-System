/**
 * @file http.exception.ts
 * @description HTTP 异常类
 */

import { BaseException } from './base.exception';

export class HttpException extends BaseException {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default HttpException;
