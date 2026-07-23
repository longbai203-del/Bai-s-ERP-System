/**
 * 项目数据验证中间件
 */
export const validateProject = (req, res, next) => {
    const { name, customer, budget, deadline } = req.body
    const errors = []
  
    if (!name || name.trim().length < 2) {
      errors.push('项目名称至少2个字符')
    }
  
    if (!customer || customer.trim().length < 2) {
      errors.push('客户名称至少2个字符')
    }
  
    if (budget !== undefined && budget < 0) {
      errors.push('预算不能为负数')
    }
  
    if (deadline) {
      const date = new Date(deadline)
      if (isNaN(date.getTime())) {
        errors.push('截止日期格式无效')
      }
    }
  
    if (errors.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '数据验证失败',
        errors
      })
    }
  
    next()
  }