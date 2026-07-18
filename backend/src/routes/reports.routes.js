/**
 * @file reports.routes.js
 * @description 报表路由 - 完整实现
 * @module routes/reports
 * 
 * @route GET /api/reports - 获取报表列表
 * @route GET /api/reports/:id - 获取特定报表
 * @route POST /api/reports - 创建报表
 * @route PUT /api/reports/:id - 更新报表
 * @route DELETE /api/reports/:id - 删除报表
 * @route GET /api/reports/export/:id - 导出报表
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const Joi = require('joi');

// ============================================================
// 报表数据存储（模拟数据库）
// ============================================================
let reports = [
    {
        id: 1,
        name: '销售报表',
        type: 'sales',
        description: '月度销售数据汇总',
        status: 'active',
        createdAt: new Date('2026-01-15'),
        updatedAt: new Date('2026-01-15'),
        createdBy: 1,
        config: {
            dateRange: 'monthly',
            metrics: ['revenue', 'orders', 'customers']
        }
    },
    {
        id: 2,
        name: '库存报表',
        type: 'inventory',
        description: '库存状态及预警',
        status: 'active',
        createdAt: new Date('2026-02-01'),
        updatedAt: new Date('2026-02-01'),
        createdBy: 1,
        config: {
            threshold: 10,
            categories: ['all']
        }
    },
    {
        id: 3,
        name: '财务报表',
        type: 'finance',
        description: '财务收支汇总',
        status: 'draft',
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
        createdBy: 1,
        config: {
            period: 'quarterly',
            includeTax: true
        }
    }
];

// ============================================================
// 报表数据生成器
// ============================================================

/**
 * 生成销售报表数据
 * @param {Object} config - 报表配置
 * @returns {Object} 报表数据
 */
function generateSalesReport(config = {}) {
    const { dateRange = 'monthly' } = config;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    const data = {
        summary: {
            totalRevenue: 0,
            totalOrders: 0,
            averageOrderValue: 0,
            growthRate: 0
        },
        chartData: {
            labels: [],
            revenue: [],
            orders: []
        },
        topProducts: [],
        recentOrders: []
    };

    // 生成图表数据
    const monthsToShow = dateRange === 'yearly' ? 12 : 6;
    const startIdx = Math.max(0, currentMonth - monthsToShow + 1);
    
    for (let i = startIdx; i <= currentMonth; i++) {
        const idx = i % 12;
        const revenue = Math.floor(Math.random() * 50000) + 10000;
        const orders = Math.floor(Math.random() * 200) + 50;
        data.chartData.labels.push(months[idx]);
        data.chartData.revenue.push(revenue);
        data.chartData.orders.push(orders);
        data.summary.totalRevenue += revenue;
        data.summary.totalOrders += orders;
    }
    
    data.summary.averageOrderValue = data.summary.totalOrders > 0 
        ? Math.round(data.summary.totalRevenue / data.summary.totalOrders * 100) / 100 
        : 0;
    
    // 计算增长率
    const midPoint = Math.floor(data.chartData.revenue.length / 2);
    if (data.chartData.revenue.length > 1) {
        const firstHalf = data.chartData.revenue.slice(0, midPoint);
        const secondHalf = data.chartData.revenue.slice(midPoint);
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        data.summary.growthRate = firstAvg > 0 ? Math.round((secondAvg - firstAvg) / firstAvg * 1000) / 10 : 0;
    }

    // 生成热销产品
    const products = ['iPhone 15 Pro', 'MacBook Air', 'AirPods Pro', 'iPad Pro', 'Apple Watch'];
    data.topProducts = products.map((name, i) => ({
        id: i + 1,
        name,
        sales: Math.floor(Math.random() * 1000) + 100,
        revenue: Math.floor(Math.random() * 100000) + 10000,
        growth: Math.round((Math.random() * 40 - 10) * 10) / 10
    })).sort((a, b) => b.revenue - a.revenue);

    return data;
}

/**
 * 生成库存报表数据
 * @param {Object} config - 报表配置
 * @returns {Object} 报表数据
 */
function generateInventoryReport(config = {}) {
    const { threshold = 10 } = config;
    
    const categories = ['电子产品', '服装', '食品', '家具', '文具'];
    const products = [];
    
    for (let i = 1; i <= 20; i++) {
        const stock = Math.floor(Math.random() * 100);
        products.push({
            id: i,
            name: `产品 ${i}`,
            category: categories[i % categories.length],
            sku: `SKU-${String(i).padStart(4, '0')}`,
            stock: stock,
            minStock: Math.floor(Math.random() * 20) + 5,
            price: Math.floor(Math.random() * 1000) + 50,
            status: stock === 0 ? 'out_of_stock' : stock < threshold ? 'low_stock' : 'normal'
        });
    }

    const lowStock = products.filter(p => p.stock < threshold);
    const outOfStock = products.filter(p => p.stock === 0);
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    return {
        summary: {
            totalProducts: products.length,
            totalValue: Math.round(totalValue * 100) / 100,
            lowStockCount: lowStock.length,
            outOfStockCount: outOfStock.length,
            categories: [...new Set(products.map(p => p.category))]
        },
        products: products,
        lowStock: lowStock,
        outOfStock: outOfStock,
        byCategory: categories.map(cat => ({
            category: cat,
            count: products.filter(p => p.category === cat).length,
            value: Math.round(products.filter(p => p.category === cat).reduce((s, p) => s + p.price * p.stock, 0) * 100) / 100
        }))
    };
}

/**
 * 生成财务报表数据
 * @param {Object} config - 报表配置
 * @returns {Object} 报表数据
 */
function generateFinanceReport(config = {}) {
    const { period = 'monthly', includeTax = true } = config;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = {
        summary: {
            totalIncome: 0,
            totalExpense: 0,
            netProfit: 0,
            tax: 0
        },
        income: [],
        expense: [],
        monthlyData: []
    };

    months.forEach((month, i) => {
        const income = Math.floor(Math.random() * 100000) + 50000;
        const expense = Math.floor(Math.random() * 60000) + 30000;
        const tax = includeTax ? Math.floor(income * 0.13) : 0;
        
        data.income.push({ month, amount: income });
        data.expense.push({ month, amount: expense });
        data.monthlyData.push({
            month,
            income,
            expense,
            profit: income - expense,
            tax
        });
        data.summary.totalIncome += income;
        data.summary.totalExpense += expense;
        data.summary.tax += tax;
    });
    
    data.summary.netProfit = data.summary.totalIncome - data.summary.totalExpense - data.summary.tax;

    return data;
}

/**
 * 获取报表数据
 * @param {string} type - 报表类型
 * @param {Object} config - 报表配置
 * @returns {Object} 报表数据
 */
function getReportData(type, config = {}) {
    switch (type) {
        case 'sales':
            return generateSalesReport(config);
        case 'inventory':
            return generateInventoryReport(config);
        case 'finance':
            return generateFinanceReport(config);
        default:
            return { error: '未知报表类型' };
    }
}

// ============================================================
// 路由定义
// ============================================================

/**
 * GET /api/reports
 * @description 获取报表列表
 * @param {number} req.query.page - 页码
 * @param {number} req.query.limit - 每页数量
 * @param {string} req.query.type - 报表类型筛选
 * @param {string} req.query.status - 状态筛选
 * @returns {Object} 报表列表
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 10, type, status } = req.query;
        let filtered = [...reports];
        
        if (type) {
            filtered = filtered.filter(r => r.type === type);
        }
        if (status) {
            filtered = filtered.filter(r => r.status === status);
        }
        
        const total = filtered.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const list = filtered.slice(start, end);
        
        res.json({
            success: true,
            data: list,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取报表列表失败',
            error: error.message
        });
    }
});

/**
 * GET /api/reports/:id
 * @description 获取特定报表数据
 * @param {number} req.params.id - 报表ID
 * @param {string} req.query.startDate - 开始日期
 * @param {string} req.query.endDate - 结束日期
 * @param {string} req.query.format - 输出格式 (json|csv)
 * @returns {Object} 报表数据
 */
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate, format = 'json' } = req.query;
        
        const report = reports.find(r => r.id === parseInt(id));
        if (!report) {
            return res.status(404).json({
                success: false,
                message: '报表不存在'
            });
        }
        
        // 获取报表数据
        const data = getReportData(report.type, report.config);
        
        // 添加时间范围过滤
        if (startDate || endDate) {
            // 实际项目中这里会过滤数据
        }
        
        const result = {
            ...report,
            data: data,
            generatedAt: new Date().toISOString(),
            parameters: {
                startDate: startDate || null,
                endDate: endDate || null
            }
        };
        
        // CSV 导出
        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=${report.name}_${Date.now()}.csv`);
            // 简化CSV导出
            const csv = '报表数据导出\n' + JSON.stringify(result);
            return res.send(csv);
        }
        
        res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '获取报表数据失败',
            error: error.message
        });
    }
});

/**
 * POST /api/reports
 * @description 创建新报表
 * @param {Object} req.body - 报表配置
 * @param {string} req.body.name - 报表名称
 * @param {string} req.body.type - 报表类型 (sales|inventory|finance)
 * @param {string} req.body.description - 描述
 * @param {Object} req.body.config - 报表配置
 * @returns {Object} 创建的报表
 */
router.post('/', authenticate, authorize('admin'), validate(
    Joi.object({
        name: Joi.string().required().min(2).max(100),
        type: Joi.string().valid('sales', 'inventory', 'finance').required(),
        description: Joi.string().max(500).optional(),
        config: Joi.object().optional()
    })
), async (req, res) => {
    try {
        const { name, type, description, config = {} } = req.body;
        
        const newReport = {
            id: reports.length + 1,
            name,
            type,
            description: description || '',
            status: 'active',
            config,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: req.user?.id || 1
        };
        
        reports.push(newReport);
        
        res.status(201).json({
            success: true,
            message: '报表创建成功',
            data: newReport,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '创建报表失败',
            error: error.message
        });
    }
});

/**
 * PUT /api/reports/:id
 * @description 更新报表配置
 * @param {number} req.params.id - 报表ID
 * @param {Object} req.body - 更新数据
 * @returns {Object} 更新后的报表
 */
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, config, status } = req.body;
        
        const reportIndex = reports.findIndex(r => r.id === parseInt(id));
        if (reportIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '报表不存在'
            });
        }
        
        const updated = {
            ...reports[reportIndex],
            name: name || reports[reportIndex].name,
            description: description !== undefined ? description : reports[reportIndex].description,
            config: config || reports[reportIndex].config,
            status: status || reports[reportIndex].status,
            updatedAt: new Date()
        };
        
        reports[reportIndex] = updated;
        
        res.json({
            success: true,
            message: '报表更新成功',
            data: updated,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '更新报表失败',
            error: error.message
        });
    }
});

/**
 * DELETE /api/reports/:id
 * @description 删除报表
 * @param {number} req.params.id - 报表ID
 * @returns {Object} 删除结果
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const reportIndex = reports.findIndex(r => r.id === parseInt(id));
        if (reportIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '报表不存在'
            });
        }
        
        reports.splice(reportIndex, 1);
        
        res.json({
            success: true,
            message: '报表删除成功',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '删除报表失败',
            error: error.message
        });
    }
});

/**
 * GET /api/reports/export/:id
 * @description 导出报表数据
 * @param {number} req.params.id - 报表ID
 * @param {string} req.query.format - 导出格式 (csv|pdf|xlsx)
 * @returns {File} 导出的文件
 */
router.get('/export/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { format = 'csv' } = req.query;
        
        const report = reports.find(r => r.id === parseInt(id));
        if (!report) {
            return res.status(404).json({
                success: false,
                message: '报表不存在'
            });
        }
        
        const data = getReportData(report.type, report.config);
        const filename = `${report.name}_${Date.now()}.${format}`;
        
        // 根据格式导出
        if (format === 'csv') {
            const csvRows = [
                ['报表名称', report.name],
                ['报表类型', report.type],
                ['生成时间', new Date().toISOString()],
                [''],
                ['指标', '数值']
            ];
            
            if (data.summary) {
                Object.entries(data.summary).forEach(([key, value]) => {
                    csvRows.push([key, String(value)]);
                });
            }
            
            const csv = csvRows.map(row => row.join(',')).join('\n');
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            return res.send(csv);
        }
        
        // 默认返回JSON
        res.json({
            success: true,
            data: data,
            report: report,
            exportedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '导出报表失败',
            error: error.message
        });
    }
});

module.exports = router;