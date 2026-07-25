/**
 * Helmet安全头配置
 * 配置各类安全HTTP头，防护常见Web攻击
 * @module helmet.config
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Helmet配置接口
 */
export interface HelmetConfig {
  /** 是否启用 */
  enabled?: boolean;
  /** CSP配置 */
  csp?: {
    enabled?: boolean;
    directives?: Record<string, string[]>;
    reportOnly?: boolean;
    reportUri?: string;
  };
  /** HSTS配置 */
  hsts?: {
    enabled?: boolean;
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  /** X-Frame-Options配置 */
  frameGuard?: {
    enabled?: boolean;
    action?: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
    domain?: string;
  };
  /** XSS防护 */
  xssFilter?: {
    enabled?: boolean;
    mode?: 'block' | 'filter';
  };
  /** MIME类型嗅探防护 */
  noSniff?: {
    enabled?: boolean;
  };
  /** 内容类型选项 */
  contentType?: {
    enabled?: boolean;
  };
  /** 缓存控制 */
  cacheControl?: {
    enabled?: boolean;
    maxAge?: number;
    noCache?: boolean;
  };
  /** 自定义头 */
  customHeaders?: Record<string, string>;
}

/**
 * 默认Helmet配置
 */
export const DEFAULT_HELMET_CONFIG: HelmetConfig = {
  enabled: true,
  csp: {
    enabled: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'blob:'],
      'font-src': ["'self'", 'data:'],
      'connect-src': ["'self'"],
      'frame-src': ["'self'"],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'manifest-src': ["'self'"],
      'worker-src': ["'self'"],
      'child-src': ["'self'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'frame-ancestors': ["'self'"],
    },
    reportOnly: false,
  },
  hsts: {
    enabled: true,
    maxAge: 31536000, // 1年
    includeSubDomains: true,
    preload: true,
  },
  frameGuard: {
    enabled: true,
    action: 'DENY',
  },
  xssFilter: {
    enabled: true,
    mode: 'block',
  },
  noSniff: {
    enabled: true,
  },
  contentType: {
    enabled: true,
  },
  cacheControl: {
    enabled: true,
    maxAge: 86400, // 24小时
    noCache: false,
  },
  customHeaders: {},
};

/**
 * Helmet安全管理器
 */
export class HelmetManager {
  private config: Required<HelmetConfig>;

  constructor(config: HelmetConfig = {}) {
    this.config = {
      enabled: true,
      csp: {
        enabled: true,
        directives: {},
        reportOnly: false,
        reportUri: '',
      },
      hsts: {
        enabled: true,
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameGuard: {
        enabled: true,
        action: 'DENY',
        domain: '',
      },
      xssFilter: {
        enabled: true,
        mode: 'block',
      },
      noSniff: {
        enabled: true,
      },
      contentType: {
        enabled: true,
      },
      cacheControl: {
        enabled: true,
        maxAge: 86400,
        noCache: false,
      },
      customHeaders: {},
      ...config,
    };
  }

  /**
   * 获取CSP策略
   */
  private getCSPDirectives(): Record<string, string[]> {
    const csp = this.config.csp;
    if (!csp.enabled) return {};

    const directives: Record<string, string[]> = {
      ...DEFAULT_HELMET_CONFIG.csp!.directives,
      ...csp.directives,
    };

    // 如果配置了reportUri，添加report-uri
    if (csp.reportUri && !directives['report-uri']) {
      directives['report-uri'] = [csp.reportUri];
    }

    return directives;
  }

  /**
   * 构建CSP字符串
   */
  private buildCSPString(): string {
    const directives = this.getCSPDirectives();
    const parts: string[] = [];

    for (const [key, values] of Object.entries(directives)) {
      if (values.length > 0) {
        parts.push(`${key} ${values.join(' ')}`);
      } else {
        parts.push(key);
      }
    }

    return parts.join('; ');
  }

  /**
   * 获取中间件
   */
  getMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.config.enabled) {
        return next();
      }

      // 1. Content-Security-Policy
      if (this.config.csp.enabled) {
        const cspString = this.buildCSPString();
        const headerName = this.config.csp.reportOnly
          ? 'Content-Security-Policy-Report-Only'
          : 'Content-Security-Policy';
        res.setHeader(headerName, cspString);
      }

      // 2. Strict-Transport-Security (HSTS)
      if (this.config.hsts.enabled) {
        const hsts = this.config.hsts;
        let hstsValue = `max-age=${hsts.maxAge}`;
        if (hsts.includeSubDomains) {
          hstsValue += '; includeSubDomains';
        }
        if (hsts.preload) {
          hstsValue += '; preload';
        }
        res.setHeader('Strict-Transport-Security', hstsValue);
      }

      // 3. X-Frame-Options
      if (this.config.frameGuard.enabled) {
        const frame = this.config.frameGuard;
        let value = frame.action;
        if (value === 'ALLOW-FROM' && frame.domain) {
          value = `ALLOW-FROM ${frame.domain}`;
        }
        res.setHeader('X-Frame-Options', value);
      }

      // 4. X-Content-Type-Options
      if (this.config.noSniff.enabled) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }

      // 5. X-XSS-Protection
      if (this.config.xssFilter.enabled) {
        const mode = this.config.xssFilter.mode;
        if (mode === 'block') {
          res.setHeader('X-XSS-Protection', '1; mode=block');
        } else {
          res.setHeader('X-XSS-Protection', '1');
        }
      }

      // 6. Content-Type
      if (this.config.contentType.enabled) {
        res.setHeader('Content-Type-Options', 'nosniff');
      }

      // 7. Cache-Control
      if (this.config.cacheControl.enabled) {
        const cache = this.config.cacheControl;
        if (cache.noCache) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
          res.setHeader('Pragma', 'no-cache');
        } else {
          res.setHeader('Cache-Control', `public, max-age=${cache.maxAge}`);
        }
      }

      // 8. 安全相关头
      res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

      // 9. 自定义头
      for (const [key, value] of Object.entries(this.config.customHeaders)) {
        res.setHeader(key, value);
      }

      next();
    };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<HelmetConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * 获取当前配置
   */
  getConfig(): HelmetConfig {
    return { ...this.config };
  }

  /**
   * 获取CSP报告端点中间件
   */
  getCSPReportMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.config.csp.enabled || !this.config.csp.reportUri) {
        return next();
      }

      // 如果请求路径匹配reportUri，处理CSP报告
      if (req.path === this.config.csp.reportUri) {
        const report = req.body;
        console.warn('[CSP] 安全策略违规报告:', JSON.stringify(report, null, 2));

        // 记录到日志系统
        // 这里可以集成日志系统

        return res.status(204).end();
      }

      next();
    };
  }

  /**
   * 为特定路由应用安全头
   */
  applyToRoute(route: string): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.path.startsWith(route)) {
        this.getMiddleware()(req, res, next);
      } else {
        next();
      }
    };
  }

  /**
   * 禁用某些安全头（用于特定路径）
   */
  disableForRoute(route: string, headers: string[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.path.startsWith(route)) {
        headers.forEach((header) => {
          res.removeHeader(header);
        });
      }
      next();
    };
  }
}

/**
 * 创建Helmet管理器实例（工厂函数）
 */
export function createHelmetManager(config?: HelmetConfig): HelmetManager {
  return new HelmetManager(config);
}

export default HelmetManager;