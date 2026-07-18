/**
 * 中间件层 - 统一导出
 */

const auth = require('./auth');
const logger = require('./logger');
const validator = require('./validator');

module.exports = {
    ...auth,
    ...logger,
    ...validator
};
