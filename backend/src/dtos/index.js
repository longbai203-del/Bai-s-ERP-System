/**
 * DTO层 - 统一导出
 */

const UserDTO = require('./UserDTO');
const OrderDTO = require('./OrderDTO');
const ProductDTO = require('./ProductDTO');

module.exports = {
    ...UserDTO,
    ...OrderDTO,
    ...ProductDTO
};
