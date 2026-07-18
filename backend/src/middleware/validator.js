/**
 * 请求验证中间件
 */
const Joi = require('joi');

/**
 * 创建验证中间件
 */
function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                code: 400,
                success: false,
                message: '数据验证失败',
                errors
            });
        }

        req.body = value;
        next();
    };
}

/**
 * 查询参数验证中间件
 */
function validateQuery(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                code: 400,
                success: false,
                message: '查询参数验证失败',
                errors
            });
        }

        req.query = value;
        next();
    };
}

/**
 * 通用验证规则
 */
const schemas = {
    // 用户注册
    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().max(100).optional(),
        phone: Joi.string().pattern(/^1[3-9]\d{9}$/).optional()
    }),

    // 用户登录
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    // 创建订单
    createOrder: Joi.object({
        customer_id: Joi.string().required(),
        items: Joi.array().items(
            Joi.object({
                product_id: Joi.string().required(),
                quantity: Joi.number().integer().min(1).required(),
                price: Joi.number().min(0).required()
            })
        ).min(1).required(),
        shipping_address: Joi.object().optional(),
        notes: Joi.string().max(500).optional(),
        payment_method: Joi.string().valid('cash', 'card', 'transfer').default('cash')
    }),

    // 更新订单状态
    updateOrderStatus: Joi.object({
        status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required(),
        reason: Joi.string().max(500).optional()
    }),

    // 创建产品
    createProduct: Joi.object({
        sku: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().optional(),
        price: Joi.number().min(0).required(),
        cost: Joi.number().min(0).optional(),
        stock: Joi.number().integer().min(0).default(0),
        category: Joi.string().optional(),
        images: Joi.array().items(Joi.string().uri()).optional(),
        status: Joi.string().valid('active', 'inactive', 'draft').default('active')
    }),

    // 更新库存
    updateStock: Joi.object({
        quantity: Joi.number().integer().min(1).required(),
        operation: Joi.string().valid('add', 'subtract').required()
    })
};

module.exports = {
    validate,
    validateQuery,
    schemas
};
