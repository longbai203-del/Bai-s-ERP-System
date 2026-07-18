客户端请求
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Router 层                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  router.post('/users', authenticate, validate,     │  │
│  │            userController.register)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  职责：路由定义 + 挂载中间件（认证、权限、验证）              │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Controller 层                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  async register(req, res) {                         │  │
│  │    const dto = new RegisterDTO(req.body);           │  │
│  │    const user = await this.service.register(dto);   │  │
│  │    return this.success(res, user);                  │  │
│  │  }                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  职责：提取参数 → 组装DTO → 调用Service → 统一响应          │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Service 层                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  async register(dto) {                             │  │
│  │    // 业务逻辑验证                                  │  │
│  │    if (await this.repository.findByEmail(...))     │  │
│  │      throw new Error('邮箱已存在');                 │  │
│  │    // 密码加密                                     │  │
│  │    const hashed = await bcrypt.hash(password, 10); │  │
│  │    // 调用Repository                               │  │
│  │    return this.repository.create({...});           │  │
│  │  }                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  职责：核心业务逻辑 + 事务管理 + 调用Repository             │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Repository 层                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  async create(data) {                              │  │
│  │    return this.supabase                           │  │
│  │      .from(this.tableName)                         │  │
│  │      .insert(data)                                 │  │
│  │      .select()                                     │  │
│  │      .single();                                    │  │
│  │  }                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  职责：数据库CRUD + 复杂查询构建                            │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Model 层                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  class UserModel extends BaseModel {               │  │
│  │    constructor() {                                 │  │
│  │      super({                                       │  │
│  │        id: { type: 'uuid', required: false },     │  │
│  │        email: { type: 'string', required: true }, │  │
│  │        password_hash: { type: 'string', required: true } │
│  │      });                                           │  │
│  │    }                                                │  │
│  │  }                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  职责：纯数据定义（字段、关联、钩子）                        │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  6. DTO/Validator 层                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  class RegisterDTO extends BaseDTO {               │  │
│  │    validate() {                                    │  │
│  │      if (!this.data.email) errors.push(...);       │  │
│  │      if (!this.data.password) errors.push(...);    │  │
│  │      return { valid: errors.length === 0, errors };│  │
│  │    }                                                │  │
│  │  }                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  职责：请求数据校验和转换（独立于 Model）                    │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  7. Error Handler 层                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  function errorHandler(err, req, res, next) {      │  │
│  │    res.status(err.statusCode || 500).json({        │  │
│  │      code: err.code || 5000,                       │  │
│  │      success: false,                               │  │
│  │      message: err.message || '服务器内部错误',      │  │
│  │      timestamp: new Date().toISOString()           │  │
│  │    });                                              │  │
│  │  }                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  职责：全局捕获异常，统一错误码和响应格式                    │
└─────────────────────────────────────────────────────────────┘

backend/
├── src/
│   ├── app.js                    # 主应用入口
│   ├── server.js                 # 服务器启动
│   │
│   ├── routes/                   # Router 层
│   │   ├── index.js              # 路由统一导出
│   │   ├── user.routes.js        # 用户路由
│   │   ├── order.routes.js       # 订单路由
│   │   ├── product.routes.js     # 产品路由
│   │   └── ...
│   │
│   ├── controllers/              # Controller 层
│   │   ├── index.js              # 控制器统一导出
│   │   ├── BaseController.js     # 基础控制器
│   │   ├── UserController.js     # 用户控制器
│   │   ├── OrderController.js    # 订单控制器
│   │   └── ProductController.js  # 产品控制器
│   │
│   ├── services/                 # Service 层
│   │   ├── index.js              # 服务统一导出
│   │   ├── BaseService.js        # 基础服务
│   │   ├── UserService.js        # 用户服务
│   │   ├── OrderService.js       # 订单服务
│   │   └── ProductService.js     # 产品服务
│   │
│   ├── repositories/             # Repository 层
│   │   ├── index.js              # Repository统一导出
│   │   ├── BaseRepository.js     # 基础Repository
│   │   ├── UserRepository.js     # 用户Repository
│   │   ├── OrderRepository.js    # 订单Repository
│   │   └── ProductRepository.js  # 产品Repository
│   │
│   ├── models/                   # Model 层
│   │   ├── index.js              # 模型统一导出
│   │   ├── BaseModel.js          # 基础模型
│   │   ├── UserModel.js          # 用户模型
│   │   ├── OrderModel.js         # 订单模型
│   │   └── ProductModel.js       # 产品模型
│   │
│   ├── dtos/                     # DTO 层
│   │   ├── index.js              # DTO统一导出
│   │   ├── BaseDTO.js            # 基础DTO
│   │   ├── UserDTO.js            # 用户DTO
│   │   ├── OrderDTO.js           # 订单DTO
│   │   └── ProductDTO.js         # 产品DTO
│   │
│   ├── middleware/               # 中间件
│   │   ├── index.js              # 中间件统一导出
│   │   ├── auth.js               # 认证授权
│   │   ├── logger.js             # 日志
│   │   └── validator.js          # 验证器
│   │
│   ├── errors/                   # Error Handler 层
│   │   └── ErrorHandler.js       # 全局错误处理
│   │
│   └── utils/                    # 工具函数
│       └── index.js              # 工具统一导出
│
├── logs/                         # 日志目录
├── .env                          # 环境变量
├── package.json                  # 依赖管理
└── vercel.json                   # Vercel部署配置