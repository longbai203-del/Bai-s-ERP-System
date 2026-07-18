/**
 * Controller层 - 统一导出
 */

const services = require('../services');
const UserController = require('./UserController');
const OrderController = require('./OrderController');
const ProductController = require('./ProductController');

const controllers = {
    User: new UserController(services.User),
    Order: new OrderController(services.Order),
    Product: new ProductController(services.Product)
};

module.exports = controllers;
