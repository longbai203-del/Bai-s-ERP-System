import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, message: string = 'Success') {
    return res.json({
      code: 200,
      data,
      message,
      timestamp: new Date().toISOString()
    });
  }
  
  static created(res: Response, data: any, message: string = 'Created successfully') {
    return res.status(201).json({
      code: 201,
      data,
      message,
      timestamp: new Date().toISOString()
    });
  }
  
  static error(res: Response, message: string = 'Internal server error', status: number = 500) {
    return res.status(status).json({
      code: status,
      message,
      timestamp: new Date().toISOString()
    });
  }
  
  static notFound(res: Response, message: string = 'Resource not found') {
    return res.status(404).json({
      code: 404,
      message,
      timestamp: new Date().toISOString()
    });
  }
  
  static badRequest(res: Response, message: string = 'Bad request', errors?: any) {
    return res.status(400).json({
      code: 400,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }
  
  static unauthorized(res: Response, message: string = 'Unauthorized') {
    return res.status(401).json({
      code: 401,
      message,
      timestamp: new Date().toISOString()
    });
  }
  
  static forbidden(res: Response, message: string = 'Forbidden') {
    return res.status(403).json({
      code: 403,
      message,
      timestamp: new Date().toISOString()
    });
  }
}
