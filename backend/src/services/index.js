const UserService = require('./UserService');
const OrderService = require('./OrderService');
const ProductService = require('./ProductService');

module.exports = {
    User: UserService,
    Order: OrderService,
    Product: ProductService
};
