/**
 * @file auth.exception.ts
 * @description 认证异常类
 */

import { HttpException } from './http.exception';

export class AuthException extends HttpException {
    constructor(message: string = 'Unauthorized') {
        super(401, message);
    }
}

export default AuthException;
