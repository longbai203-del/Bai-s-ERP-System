/**
 * @file auth.js
 * @description 认证 API
 */

import request from './request'

/**
 * 用户登录
 * @param {Object} data
 * @param {string} data.email - 邮箱
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 用户注册
 * @param {Object} data
 * @param {string} data.email - 邮箱
 * @param {string} data.password - 密码
 * @param {string} data.name - 姓名
 * @param {string} data.phone - 电话
 * @returns {Promise}
 */
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

/**
 * 获取当前用户信息
 * @returns {Promise}
 */
export function getCurrentUser() {
  return request({
    url: '/auth/me',
    method: 'get'
  })
}

/**
 * 退出登录
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

/**
 * 刷新 Token
 * @returns {Promise}
 */
export function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'post'
  })
}