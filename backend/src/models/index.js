/**
 * 模型层 - 统一导出
 */

const UserModel = require('./UserModel');
const OrderModel = require('./OrderModel');
const ProductModel = require('./ProductModel');

module.exports = {
    User: UserModel,
    Order: OrderModel,
    Product: ProductModel
};
