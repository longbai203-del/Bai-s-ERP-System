<template>
  <div class="pos-">
    



    <div class="pos-container">
        
        <div class="pos-header">
            <div>
                <h1>
                    <i class="fas fa-cash-register" style="color:#4F46E5;"></i>
                    收银台
                    <span class="badge badge-success" style="font-size:12px;">🟢 在线</span>
                </h1>
            </div>
            <div class="header-info">
                <span>👤 收银员: 张伟</span>
                <span>📅 2024-07-11 14:30</span>
                <span>🧾 订单: <strong id="orderCount">0</strong></span>
                <button class="btn btn-sm btn-outline" onclick="alert('📊 统计报表功能')">
                    <i class="fas fa-chart-bar"></i>
                </button>
            </div>
        </div>

        
        <div class="pos-grid">
            
            <div class="pos-products">
                <div class="product-toolbar">
                    <input type="text" class="search-box" id="posSearch" placeholder="🔍 搜索商品...">
                    <select class="category-filter" id="posCategory">
                        <option value="">全部分类</option>
                        <option value="洗车">🚗 洗车</option>
                        <option value="保养">🔧 保养</option>
                        <option value="美容">✨ 美容</option>
                        <option value="配件">🧩 配件</option>
                        <option value="套餐">📦 套餐</option>
                    </select>
                    <button class="btn btn-sm btn-primary" id="posSearchBtn">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div class="product-grid" id="posProductGrid">
                    
                    <div style="grid-column:1/-1;text-align:center;padding:40px;color:#9CA3AF;">
                        <i class="fas fa-spinner fa-spin" style="font-size:24px;display:block;margin-bottom:8px;"></i>
                        加载商品...
                    </div>
                </div>
            </div>

            
            <div class="pos-cart">
                <div class="cart-header">
                    <h3><i class="fas fa-shopping-cart" style="color:#4F46E5;"></i> 购物车</h3>
                    <span class="cart-count" id="cartCount">0 件商品</span>
                </div>
                <div class="cart-items" id="cartItems">
                    <div class="cart-empty">
                        <i class="fas fa-shopping-basket"></i>
                        <p>购物车为空</p>
                        <span style="font-size:12px;">点击左侧商品添加</span>
                    </div>
                </div>
                <div class="cart-footer">
                    <div class="cart-summary">
                        <span class="total-label">合计</span>
                        <span class="total-amount">
                            <span class="currency">¥</span>
                            <span id="cartTotal">0.00</span>
                        </span>
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-outline" id="cartClearBtn">
                            <i class="fas fa-trash"></i> 清空
                        </button>
                        <button class="btn btn-outline" id="cartDiscountBtn">
                            <i class="fas fa-percent"></i> 折扣
                        </button>
                        <button class="btn btn-success btn-full" id="cartCheckoutBtn">
                            <i class="fas fa-check"></i> 结算 (F2)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import { init } from './cash-register.js';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('💰 收银台页面加载');
            
            // 模拟商品数据
            const products = [
                { id: 1, name: '标准洗车', category: '洗车', price: 89, icon: '🚗', stock: 999 },
                { id: 2, name: '精致洗车', category: '洗车', price: 159, icon: '🚙', stock: 999 },
                { id: 3, name: '全车镀晶', category: '美容', price: 899, icon: '✨', stock: 50 },
                { id: 4, name: '内饰清洁', category: '美容', price: 299, icon: '🧹', stock: 80 },
                { id: 5, name: '机油更换', category: '保养', price: 399, icon: '🔧', stock: 120 },
                { id: 6, name: '轮胎换位', category: '保养', price: 199, icon: '🛞', stock: 60 },
                { id: 7, name: '行车记录仪', category: '配件', price: 459, icon: '📹', stock: 30 },
                { id: 8, name: '洗车套餐', category: '套餐', price: 599, icon: '📦', stock: 200 },
                { id: 9, name: '空调清洗', category: '保养', price: 259, icon: '❄️', stock: 45 },
                { id: 10, name: '漆面抛光', category: '美容', price: 499, icon: '🌟', stock: 35 },
                { id: 11, name: '脚垫定制', category: '配件', price: 389, icon: '🧩', stock: 25 },
                { id: 12, name: 'VIP洗车卡', category: '套餐', price: 999, icon: '💳', stock: 100 }
            ];

            // 渲染商品
            const grid = document.getElementById('posProductGrid');
            grid.innerHTML = products.map(p => `
                <div class="product-item" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
                    <span class="product-icon">${p.icon}</span>
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">¥${p.price}</div>
                    <div class="product-stock ${p.stock < 50 ? 'low' : ''}">库存: ${p.stock}</div>
                </div>
            `).join('');

            // 商品点击添加
            grid.querySelectorAll('.product-item').forEach(el => {
                el.addEventListener('click', function() {
                    const name = this.dataset.name;
                    const price = parseFloat(this.dataset.price);
                    addToCart(name, price);
                });
            });

            // 购物车状态
            let cart = [];
            let total = 0;

            function addToCart(name, price) {
                const existing = cart.find(item => item.name === name);
                if (existing) {
                    existing.qty += 1;
                } else {
                    cart.push({ name, price, qty: 1 });
                }
                updateCart();
            }

            function updateCart() {
                const container = document.getElementById('cartItems');
                const count = document.getElementById('cartCount');
                const totalEl = document.getElementById('cartTotal');
                
                total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
                count.textContent = cart.reduce((sum, item) => sum + item.qty, 0) + ' 件商品';
                totalEl.textContent = total.toFixed(2);

                if (cart.length === 0) {
                    container.innerHTML = `
                        <div class="cart-empty">
                            <i class="fas fa-shopping-basket"></i>
                            <p>购物车为空</p>
                            <span style="font-size:12px;">点击左侧商品添加</span>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = cart.map((item, index) => `
                    <div class="cart-item">
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-meta">¥${item.price} × ${item.qty}</div>
                        </div>
                        <div class="item-actions">
                            <button class="qty-btn" onclick="updateQty(${index}, -1)">−</button>
                            <span class="qty">${item.qty}</span>
                            <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                            <span class="item-total">¥${(item.price * item.qty).toFixed(2)}</span>
                            <button class="remove-btn" onclick="removeItem(${index})">×</button>
                        </div>
                    </div>
                `).join('');

                // 暴露函数到全局
                window.updateQty = function(index, delta) {
                    if (cart[index]) {
                        cart[index].qty += delta;
                        if (cart[index].qty <= 0) {
                            cart.splice(index, 1);
                        }
                        updateCart();
                    }
                };

                window.removeItem = function(index) {
                    cart.splice(index, 1);
                    updateCart();
                };
            }

            // 清空购物车
            document.getElementById('cartClearBtn')?.addEventListener('click', function() {
                if (cart.length === 0) return;
                if (confirm('确认清空购物车？')) {
                    cart = [];
                    updateCart();
                }
            });

            // 折扣
            document.getElementById('cartDiscountBtn')?.addEventListener('click', function() {
                if (cart.length === 0) {
                    alert('购物车为空，无法应用折扣');
                    return;
                }
                const discount = prompt('请输入折扣百分比 (如: 10 表示9折)：', '0');
                if (discount === null) return;
                const d = parseFloat(discount);
                if (isNaN(d) || d < 0 || d > 100) {
                    alert('请输入0-100之间的数字');
                    return;
                }
                const newTotal = total * (1 - d / 100);
                document.getElementById('cartTotal').textContent = newTotal.toFixed(2);
                alert('✅ 已应用 ' + d + '% 折扣');
            });

            // 结算
            document.getElementById('cartCheckoutBtn')?.addEventListener('click', function() {
                if (cart.length === 0) {
                    alert('购物车为空，请添加商品');
                    return;
                }
                const totalAmount = parseFloat(document.getElementById('cartTotal').textContent);
                if (confirm('确认结算 ¥' + totalAmount.toFixed(2) + '？')) {
                    alert('✅ 订单已创建！\n总金额: ¥' + totalAmount.toFixed(2) + '\n订单号: ORD-' + Date.now().toString().slice(-6));
                    cart = [];
                    updateCart();
                }
            });

            // 搜索功能
            document.getElementById('posSearchBtn')?.addEventListener('click', function() {
                const keyword = document.getElementById('posSearch').value.toLowerCase();
                grid.querySelectorAll('.product-item').forEach(el => {
                    const name = el.dataset.name.toLowerCase();
                    el.style.display = name.includes(keyword) ? '' : 'none';
                });
            });

            document.getElementById('posSearch')?.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    document.getElementById('posSearchBtn').click();
                }
            });

            // 键盘快捷键
            document.addEventListener('keydown', function(e) {
                if (e.key === 'F2') {
                    e.preventDefault();
                    document.getElementById('cartCheckoutBtn').click();
                }
            });

            // 初始化
            init().catch(err => console.warn('POS初始化失败:', err));
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'CashRegister',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    /**
 * @file pos/submodules/cash-register.js
 * @description 收银台子模块
 * @module modules/pos/submodules/cash-register
 */

//  (已注释);
//  (已注释);
import { modal } from '@components/modal.js';

//  (已注释)

export async function render(container) {
    container.innerHTML = `
        <div class="cash-register-container">
            <div class="page-header">
                <h1>🧾 收银台</h1>
                <div class="page-actions">
                    <button class="btn btn-outline" id="openDrawer">
                        <i class="fas fa-cash-register"></i> 打开钱箱
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;">
                        <div id="registerProducts">
                            <div style="display:flex;gap:8px;margin-bottom:12px;">
                                <input type="text" class="form-control" id="registerSearch" placeholder="扫码/搜索商品...">
                                <button class="btn btn-primary" id="registerSearchBtn"><i class="fas fa-search"></i></button>
                            </div>
                            <div id="registerProductGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-height:400px;overflow-y:auto;">
                                <div style="text-align:center;padding:20px;color:#9CA3AF;">加载商品中...</div>
                            </div>
                        </div>
                        <div id="registerCart" style="background:#F9FAFB;border-radius:8px;padding:16px;">
                            <h4 style="margin-bottom:12px;">🛒 购物车</h4>
                            <div id="registerCartItems" style="max-height:300px;overflow-y:auto;"></div>
                            <div style="border-top:2px solid #E5E7EB;padding-top:12px;margin-top:12px;">
                                <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;">
                                    <span>合计</span>
                                    <span id="registerTotal">¥0.00</span>
                                </div>
                                <button class="btn btn-success" style="width:100%;margin-top:8px;" id="registerCheckout">
                                    <i class="fas fa-check"></i> 结账
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 加载商品
    const result = await apiClient.get('/products', { params: { page: 1, pageSize: 50 } });
    const products = result.success ? result.data.list || [] : [];
    
    const grid = document.getElementById('registerProductGrid');
    if (products.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:20px;color:#9CA3AF;">暂无商品</div>';
        return;
    }
    
    grid.innerHTML = products.map(p => `
        <div class="register-product-item" data-id="${p.id}" style="border:1px solid #E5E7EB;border-radius:8px;padding:12px;text-align:center;cursor:pointer;hover:border-color:#4F46E5;">
            <div style="font-weight:500;font-size:14px;">${p.name}</div>
            <div style="font-size:12px;color:#6B7280;">${p.category}</div>
            <div style="font-weight:600;color:#4F46E5;">¥${formatCurrency(p.price)}</div>
        </div>
    `).join('');
    
    let cart = [];
    let total = 0;
    
    function updateCart() {
        const container = document.getElementById('registerCartItems');
        const totalEl = document.getElementById('registerTotal');
        total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalEl.textContent = `¥${formatCurrency(total)}`;
        
        if (cart.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:#9CA3AF;padding:20px;">购物车为空</div>';
            return;
        }
        
        container.innerHTML = cart.map(item => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #E5E7EB;">
                <div>
                    <div style="font-weight:500;">${item.name}</div>
                    <div style="font-size:12px;color:#6B7280;">¥${formatCurrency(item.price)} × ${item.quantity}</div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <span>¥${formatCurrency(item.price * item.quantity)}</span>
                    <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                cart = cart.filter(item => item.id !== btn.dataset.id);
                updateCart();
            });
        });
    }
    
    grid.querySelectorAll('.register-product-item').forEach(el => {
        el.addEventListener('click', () => {
            const id = el.dataset.id;
            const product = products.find(p => p.id === id);
            if (!product) return;
            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCart();
        });
    });
    
    document.getElementById('registerCheckout')?.addEventListener('click', async () => {
        if (cart.length === 0) {
            modal.alert('提示', '购物车为空', '知道了', 'warning');
            return;
        }
        const result = await apiClient.post('/orders', {
            customerName: '散客',
            items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
            totalAmount: total,
            note: 'POS收银'
        });
        if (result.success) {
            modal.alert('✅ 结账成功', `金额 ¥${formatCurrency(total)}`, '知道了', 'success');
            cart = [];
            updateCart();
        } else {
            modal.alert('❌ 失败', result.message, '知道了', 'danger');
        }
    });
    
    document.getElementById('openDrawer')?.addEventListener('click', () => {
        modal.alert('钱箱', '钱箱已打开 ✅', '知道了', 'success');
    });
}

export async function init() {
    console.log('✅ [CashRegister] 已初始化');
}

export default { meta, render, init };
  },
  methods: {}
}
</script>

<style scoped>

</style>

