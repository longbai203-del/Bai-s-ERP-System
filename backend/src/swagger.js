/**
 * @file swagger.js
 * @description Swagger API 文档配置
 * @module swagger
 * 
 * 提供完整的 API 文档，支持在线调试
 * 访问地址: /api-docs
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Swagger 配置选项
 */
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bai\'s ERP System API',
            version: '1.0.0',
            description: `
                ## Bai's ERP 系统 API 文档
                
                企业资源管理系统后端 API 接口文档。
                
                ### 认证方式
                所有需要认证的接口需要在请求头中携带 JWT Token：
                \`Authorization: Bearer <token>\`
                
                ### 响应格式
                所有接口统一返回格式：
                \`\`\`json
                {
                    "success": true,
                    "data": {...},
                    "message": "操作成功",
                    "timestamp": "2026-01-01T00:00:00.000Z"
                }
                \`\`\`
                
                ### 错误码
                | 错误码 | 说明 |
                |--------|------|
                | 0 | 成功 |
                | 1001 | 验证失败 |
                | 1002 | 未授权 |
                | 1003 | 权限不足 |
                | 1004 | 资源不存在 |
                | 5000 | 服务器内部错误 |
            `,
            contact: {
                name: 'Bai\'s ERP Team',
                email: 'support@bais-erp.com',
                url: 'https://www.bais-erp.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: '开发服务器'
            },
            {
                url: 'https://bais-erp-backend.onrender.com',
                description: '生产服务器'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: '输入 JWT Token'
                }
            },
            schemas: {
                // ============================================================
                // 通用响应模型
                // ============================================================
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: '是否成功' },
                        message: { type: 'string', description: '响应消息' },
                        data: { type: 'object', description: '响应数据' },
                        timestamp: { type: 'string', format: 'date-time', description: '时间戳' }
                    }
                },
                PaginationResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: { type: 'array', items: { type: 'object' } },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'integer' },
                                limit: { type: 'integer' },
                                total: { type: 'integer' },
                                totalPages: { type: 'integer' },
                                hasNext: { type: 'boolean' },
                                hasPrev: { type: 'boolean' }
                            }
                        },
                        timestamp: { type: 'string', format: 'date-time' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        code: { type: 'integer', description: '错误码' },
                        message: { type: 'string', description: '错误消息' },
                        details: { type: 'object', description: '错误详情' },
                        timestamp: { type: 'string', format: 'date-time' }
                    }
                },

                // ============================================================
                // 用户模型
                // ============================================================
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', description: '用户ID' },
                        email: { type: 'string', format: 'email', description: '邮箱' },
                        name: { type: 'string', description: '姓名' },
                        role: { type: 'string', enum: ['user', 'admin', 'manager'], description: '角色' },
                        status: { type: 'string', enum: ['active', 'inactive', 'suspended'], description: '状态' },
                        avatar: { type: 'string', description: '头像URL' },
                        phone: { type: 'string', description: '手机号' },
                        created_at: { type: 'string', format: 'date-time', description: '创建时间' },
                        updated_at: { type: 'string', format: 'date-time', description: '更新时间' }
                    }
                },
                UserCreate: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', description: '邮箱' },
                        password: { type: 'string', minLength: 6, description: '密码' },
                        name: { type: 'string', description: '姓名' },
                        phone: { type: 'string', description: '手机号' },
                        role: { type: 'string', enum: ['user', 'admin', 'manager'], description: '角色' }
                    }
                },
                UserLogin: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', description: '邮箱' },
                        password: { type: 'string', description: '密码' }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'object',
                            properties: {
                                user: { $ref: '#/components/schemas/User' },
                                token: { type: 'string', description: 'JWT Token' }
                            }
                        },
                        message: { type: 'string' },
                        timestamp: { type: 'string', format: 'date-time' }
                    }
                },

                // ============================================================
                // 订单模型
                // ============================================================
                Order: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', description: '订单ID' },
                        order_number: { type: 'string', description: '订单编号' },
                        customer_id: { type: 'string', format: 'uuid', description: '客户ID' },
                        total: { type: 'number', description: '订单总额' },
                        status: { 
                            type: 'string', 
                            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
                            description: '订单状态'
                        },
                        payment_status: {
                            type: 'string',
                            enum: ['unpaid', 'paid', 'refunded', 'failed'],
                            description: '支付状态'
                        },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    product_id: { type: 'string', description: '产品ID' },
                                    quantity: { type: 'integer', description: '数量' },
                                    price: { type: 'number', description: '单价' }
                                }
                            }
                        },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                OrderCreate: {
                    type: 'object',
                    required: ['customer_id', 'items'],
                    properties: {
                        customer_id: { type: 'string', format: 'uuid', description: '客户ID' },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['product_id', 'quantity', 'price'],
                                properties: {
                                    product_id: { type: 'string', description: '产品ID' },
                                    quantity: { type: 'integer', minimum: 1, description: '数量' },
                                    price: { type: 'number', minimum: 0, description: '单价' }
                                }
                            }
                        },
                        shipping_address: { type: 'object', description: '收货地址' },
                        notes: { type: 'string', maxLength: 500, description: '备注' },
                        payment_method: { 
                            type: 'string', 
                            enum: ['cash', 'card', 'transfer'],
                            description: '支付方式'
                        }
                    }
                },
                OrderStatusUpdate: {
                    type: 'object',
                    required: ['status'],
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
                            description: '订单状态'
                        },
                        reason: { type: 'string', maxLength: 500, description: '取消原因' }
                    }
                },

                // ============================================================
                // 产品模型
                // ============================================================
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', description: '产品ID' },
                        sku: { type: 'string', description: 'SKU编码' },
                        name: { type: 'string', description: '产品名称' },
                        description: { type: 'string', description: '产品描述' },
                        price: { type: 'number', description: '销售价格' },
                        cost: { type: 'number', description: '成本价格' },
                        stock: { type: 'integer', description: '库存数量' },
                        category: { type: 'string', description: '分类' },
                        images: { type: 'array', items: { type: 'string' }, description: '图片URL列表' },
                        status: { type: 'string', enum: ['active', 'inactive', 'draft'], description: '状态' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                ProductCreate: {
                    type: 'object',
                    required: ['sku', 'name', 'price'],
                    properties: {
                        sku: { type: 'string', description: 'SKU编码' },
                        name: { type: 'string', maxLength: 100, description: '产品名称' },
                        description: { type: 'string', maxLength: 500, description: '产品描述' },
                        price: { type: 'number', minimum: 0, description: '销售价格' },
                        cost: { type: 'number', minimum: 0, description: '成本价格' },
                        stock: { type: 'integer', minimum: 0, default: 0, description: '库存数量' },
                        category: { type: 'string', description: '分类' },
                        images: { type: 'array', items: { type: 'string' }, description: '图片URL列表' },
                        status: { type: 'string', enum: ['active', 'inactive', 'draft'], default: 'active' }
                    }
                },
                StockUpdate: {
                    type: 'object',
                    required: ['quantity', 'operation'],
                    properties: {
                        quantity: { type: 'integer', minimum: 1, description: '数量' },
                        operation: { type: 'string', enum: ['add', 'subtract'], description: '操作类型' }
                    }
                },

                // ============================================================
                // 报表模型
                // ============================================================
                Report: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: '报表ID' },
                        name: { type: 'string', description: '报表名称' },
                        type: { type: 'string', enum: ['sales', 'inventory', 'finance'], description: '报表类型' },
                        description: { type: 'string', description: '报表描述' },
                        status: { type: 'string', enum: ['active', 'draft', 'archived'], description: '状态' },
                        config: { type: 'object', description: '报表配置' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                ReportCreate: {
                    type: 'object',
                    required: ['name', 'type'],
                    properties: {
                        name: { type: 'string', minLength: 2, maxLength: 100, description: '报表名称' },
                        type: { type: 'string', enum: ['sales', 'inventory', 'finance'], description: '报表类型' },
                        description: { type: 'string', maxLength: 500, description: '报表描述' },
                        config: { type: 'object', description: '报表配置' }
                    }
                },

                // ============================================================
                // 设置模型
                // ============================================================
                Settings: {
                    type: 'object',
                    properties: {
                        system: {
                            type: 'object',
                            properties: {
                                siteName: { type: 'string' },
                                siteDescription: { type: 'string' },
                                language: { type: 'string' },
                                timezone: { type: 'string' },
                                maintenanceMode: { type: 'boolean' }
                            }
                        },
                        company: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                address: { type: 'string' },
                                phone: { type: 'string' },
                                email: { type: 'string' }
                            }
                        },
                        orders: {
                            type: 'object',
                            properties: {
                                autoConfirm: { type: 'boolean' },
                                shippingMethods: { type: 'array', items: { type: 'string' } },
                                paymentMethods: { type: 'array', items: { type: 'string' } }
                            }
                        },
                        products: {
                            type: 'object',
                            properties: {
                                enableInventory: { type: 'boolean' },
                                lowStockThreshold: { type: 'integer' },
                                defaultTaxRate: { type: 'number' }
                            }
                        },
                        users: {
                            type: 'object',
                            properties: {
                                allowRegistration: { type: 'boolean' },
                                requireEmailVerification: { type: 'boolean' },
                                passwordMinLength: { type: 'integer' },
                                sessionTimeout: { type: 'integer' }
                            }
                        },
                        security: {
                            type: 'object',
                            properties: {
                                twoFactorEnabled: { type: 'boolean' },
                                rateLimit: {
                                    type: 'object',
                                    properties: {
                                        enabled: { type: 'boolean' },
                                        max: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    }
                },
                SettingsUpdate: {
                    type: 'object',
                    properties: {
                        value: { type: 'any', description: '设置值' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        tags: [
            { name: '认证', description: '用户认证相关接口' },
            { name: '用户', description: '用户管理相关接口' },
            { name: '订单', description: '订单管理相关接口' },
            { name: '产品', description: '产品管理相关接口' },
            { name: '客户', description: '客户管理相关接口' },
            { name: '仪表板', description: '仪表板数据接口' },
            { name: '报表', description: '报表相关接口' },
            { name: '分析', description: '数据分析接口' },
            { name: '设置', description: '系统设置接口' }
        ]
    },
    apis: [
        './src/routes/*.routes.js',
        './src/controllers/*.controller.js',
        './src/models/*.model.js'
    ]
};

/**
 * 初始化 Swagger
 * @param {Express} app - Express 应用实例
 */
function setupSwagger(app) {
    // 生成 Swagger 规范
    const specs = swaggerJsdoc(options);

    // 挂载 Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        explorer: true,
        customCss: `
            .swagger-ui .topbar { display: none }
            .swagger-ui .info { margin: 20px 0 }
        `,
        customSiteTitle: 'Bai\'s ERP API 文档',
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            filter: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha'
        }
    }));

    // 提供 JSON 格式的规范
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(specs);
    });

    console.log('📚 Swagger API 文档已挂载: /api-docs');
    console.log('📄 Swagger JSON 规范: /api-docs.json');
}

module.exports = setupSwagger;