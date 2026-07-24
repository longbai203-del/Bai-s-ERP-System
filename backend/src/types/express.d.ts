/**
 * @file express.d.ts
 * @description Express 类型扩展
 */

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export {};
