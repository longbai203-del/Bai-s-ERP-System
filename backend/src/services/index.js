/**
 * Service层 - 统一导出
 */

const repositories = require('../repositories');
const UserService = require('./UserService');
const OrderService = require('./OrderService');
const ProductService = require('./ProductService');

const services = {
    User: new UserService(repositories.User),
    Order: new OrderService(repositories.Order),
    Product: new ProductService(repositories.Product)
};

module.exports = services;
