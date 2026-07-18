<template>
  <div class="pos-">
    



    <div class="touch-pos-container">
        
        <div class="touch-header">
            <div>
                <h1>
                    <i class="fas fa-hand-pointer" style="color:#4F46E5;"></i>
                    触屏收银
                    <span class="badge badge-success" style="font-size:12px;">🟢 在线</span>
                </h1>
            </div>
            <div class="info-bar">
                <span>👤 张伟</span>
                <span id="touchTime">14:30</span>
                <span>🧾 <strong id="touchOrderCount">0</strong></span>
                <button class="btn btn-sm btn-outline" onclick="alert('📊 统计')">
                    <i class="fas fa-chart-bar"></i>
                </button>
            </div>
        </div>

        
        <div class="touch-grid">
            
            <div class="touch-products">
                <div class="category-bar" id="touchCategoryBar">
                    <button class="cat-btn active">全部</button>
                    <button class="cat-btn">🚗 洗车</button>
                    <button class="cat-btn">🔧 保养</button>
                    <button class="cat-btn">✨ 美容</button>
                    <button class="cat-btn">🧩 配件</button>
                    <button class="cat-btn">📦 套餐</button>
                </div>
                <div class="product-grid" id="touchProductGrid">
                    
                    <div style="grid-column:1/-1;text-align:center;padding:20px;color:#9CA3AF;">
                        <i class="fas fa-spinner fa-spin" style="font-size:24px;"></i> 加载中...
                    </div>
                </div>
            </div>

            
            <div class="touch-cart">
                <div class="cart-header">
                    <h3><i class="fas fa-shopping-cart" style="color:#4F46E5;"></i> 购物车</h3>
                    <span class="cart-count" id="touchCartCount">0 件</span>
                </div>
                <div class="cart-items" id="touchCartItems">
                    <div class="cart-empty">
                        <i class="fas fa-shopping-basket"></i>
                        <p>点击左侧商品添加</p>
                    </div>
                </div>
                <div class="cart-footer">
                    <div class="summary-row">
                        <span>小计</span>
                        <span id="touchSubtotal">¥0.00</span>
                    </div>
                    <div class="summary-row total">
                        <span>合计</span>
                        <span class="amount" id="touchTotal">¥0.00</span>
                    </div>
                    <div class="action-row">
                        <button class="btn btn-outline" id="touchClearBtn">
                            <i class="fas fa-trash"></i> 清空
                        </button>
                        <button class="btn btn-outline" id="touchDiscountBtn">
                            <i class="fas fa-percent"></i> 折扣
                        </button>
                        <button class="btn btn-success" id="touchCheckoutBtn" disabled>
                            <i class="fas fa-check"></i> 结算
                        </button>
                    </div>
                    
                    <div class="touch-keypad" id="touchKeypad">
                        <button class="key">1</button>
                        <button class="key">2</button>
                        <button class="key">3</button>
                        <button class="key clear" id="keyClear">⌫</button>
                        <button class="key">4</button>
                        <button class="key">5</button>
                        <button class="key">6</button>
                        <button class="key enter" id="keyEnter">↵</button>
                        <button class="key">7</button>
                        <button class="key">8</button>
                        <button class="key">9</button>
                        <button class="key">.</button>
                        <button class="key">0</button>
                        <button class="key" id="keyDouble">00</button>
                        <button class="key clear" id="keyClearAll">C</button>
                        <button class="key enter" id="keyConfirm">确认</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import { init } from './touch-pos.js';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('🖐️ 触屏收银页面加载');
            
            // 模拟商品数据
            const products = [
                { id: 1, name: '标准洗车', category: '洗车', price: 89, icon: '🚗' },
                { id: 2, name: '精致洗车', category: '洗车', price: 159, icon: '🚙' },
                { id: 3, name: '全车镀晶', category: '美容', price: 899, icon: '✨' },
                { id: 4, name: '内饰清洁', category: '美容', price: 299, icon: '🧹' },
                { id: 5, name: '机油更换', category: '保养', price: 399, icon: '🔧' },
                { id: 6, name: '轮胎护理', category: '保养', price: 120, icon: '🛞' },
                { id: 7, name: '行车记录仪', category: '配件', price: 459, icon: '📹' },
                { id: 8, name: '洗车套餐', category: '套餐', price: 599, icon: '📦' },
                { id: 9, name: '空调清洗', category: '保养', price: 259, icon: '❄️' },
                { id: 10, name: '漆面抛光', category: '美容', price: 499, icon: '🌟' },
                { id: 11, name: '脚垫定制', category: '配件', price: 389, icon: '🧩' },
                { id: 12, name: 'VIP洗车卡', category: '套餐', price: 999, icon: '💳' }
            ];

            // 购物车状态
            let cart = [];
            let total = 0;
            let currentCategory = '全部';

            // 渲染商品
            function renderProducts(category) {
                const grid = document.getElementById('touchProductGrid');
                const filtered = category === '全部' 
                    ? products 
                    : products.filter(p => p.category === category);
                
                if (filtered.length === 0) {
                    grid.innerHTML = `
                        <div style="grid-column:1/-1;text-align:center;padding:30px;color:#9CA3AF;">
                            <i class="fas fa-box-open" style="font-size:28px;display:block;margin-bottom:8px;"></i>
                            该分类暂无商品
                        </div>
                    `;
                    return;
                }

                grid.innerHTML = filtered.map(p => `
                    <button class="product-btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
                        <span class="icon">${p.icon}</span>
                        <span class="name">${p.name}</span>
                        <span class="price">¥${p.price}</span>
                    </button>
                `).join('');

                // 商品点击
                grid.querySelectorAll('.product-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const name = this.dataset.name;
                        const price = parseFloat(this.dataset.price);
                        addToCart(name, price);
                        // 触屏反馈
                        this.style.transform = 'scale(0.92)';
                        setTimeout(() => this.style.transform = '', 150);
                    });
                });
            }

            // 分类切换
            document.querySelectorAll('#touchCategoryBar .cat-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('#touchCategoryBar .cat-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentCategory = this.textContent.trim();
                    renderProducts(currentCategory);
                });
            });

            // 添加购物车
            function addToCart(name, price) {
                const existing = cart.find(item => item.name === name && item.price === price);
                if (existing) {
                    existing.qty += 1;
                } else {
                    cart.push({ name, price, qty: 1 });
                }
                updateCart();
            }

            // 更新购物车
            function updateCart() {
                const container = document.getElementById('touchCartItems');
                const countEl = document.getElementById('touchCartCount');
                const subtotalEl = document.getElementById('touchSubtotal');
                const totalEl = document.getElementById('touchTotal');
                const checkoutBtn = document.getElementById('touchCheckoutBtn');
                const orderCount = document.getElementById('touchOrderCount');

                total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
                const count = cart.reduce((sum, item) => sum + item.qty, 0);
                
                countEl.textContent = count + ' 件';
                subtotalEl.textContent = '¥' + total.toFixed(2);
                totalEl.textContent = '¥' + total.toFixed(2);
                checkoutBtn.disabled = cart.length === 0;
                orderCount.textContent = count;

                if (cart.length === 0) {
                    container.innerHTML = `
                        <div class="cart-empty">
                            <i class="fas fa-shopping-basket"></i>
                            <p>点击左侧商品添加</p>
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
                            <button class="qty-btn" onclick="window.touchUpdateQty(${index}, -1)">−</button>
                            <span class="qty">${item.qty}</span>
                            <button class="qty-btn" onclick="window.touchUpdateQty(${index}, 1)">+</button>
                            <span class="item-total">¥${(item.price * item.qty).toFixed(2)}</span>
                            <button class="remove-btn" onclick="window.touchRemoveItem(${index})">×</button>
                        </div>
                    </div>
                `).join('');

                // 暴露函数到全局
                window.touchUpdateQty = function(index, delta) {
                    if (cart[index]) {
                        cart[index].qty += delta;
                        if (cart[index].qty <= 0) {
                            cart.splice(index, 1);
                        }
                        updateCart();
                    }
                };

                window.touchRemoveItem = function(index) {
                    cart.splice(index, 1);
                    updateCart();
                };
            }

            // 清空购物车
            document.getElementById('touchClearBtn')?.addEventListener('click', function() {
                if (cart.length === 0) return;
                if (confirm('确认清空购物车？')) {
                    cart = [];
                    updateCart();
                }
            });

            // 折扣
            document.getElementById('touchDiscountBtn')?.addEventListener('click', function() {
                if (cart.length === 0) { alert('购物车为空'); return; }
                const d = prompt('折扣百分比 (如: 10 表示9折)：', '0');
                if (d === null) return;
                const discount = parseFloat(d);
                if (isNaN(discount) || discount < 0 || discount > 100) {
                    alert('请输入0-100之间的数字');
                    return;
                }
                const newTotal = total * (1 - discount / 100);
                document.getElementById('touchTotal').textContent = '¥' + newTotal.toFixed(2);
                alert('✅ 已应用 ' + discount + '% 折扣');
            });

            // 结算
            document.getElementById('touchCheckoutBtn')?.addEventListener('click', function() {
                if (cart.length === 0) return;
                const totalAmount = parseFloat(document.getElementById('touchTotal').textContent.replace('¥', ''));
                if (confirm('确认结算 ¥' + totalAmount.toFixed(2) + '？')) {
                    alert('✅ 订单已创建！\n总金额: ¥' + totalAmount.toFixed(2) + '\n订单号: POS-' + Date.now().toString().slice(-6));
                    cart = [];
                    updateCart();
                }
            });

            // 数字键盘
            let keypadInput = '';

            document.querySelectorAll('#touchKeypad .key:not(.clear):not(.enter)').forEach(key => {
                key.addEventListener('click', function() {
                    keypadInput += this.textContent;
                    // 显示输入
                    const totalEl = document.getElementById('touchTotal');
                    if (keypadInput) {
                        totalEl.textContent = '¥' + parseFloat(keypadInput).toFixed(2);
                    }
                });
            });

            document.getElementById('keyClear')?.addEventListener('click', function() {
                keypadInput = keypadInput.slice(0, -1);
                const totalEl = document.getElementById('touchTotal');
                totalEl.textContent = keypadInput ? '¥' + parseFloat(keypadInput).toFixed(2) : '¥0.00';
            });

            document.getElementById('keyClearAll')?.addEventListener('click', function() {
                keypadInput = '';
                document.getElementById('touchTotal').textContent = '¥0.00';
            });

            document.getElementById('keyDouble')?.addEventListener('click', function() {
                keypadInput += '00';
                const totalEl = document.getElementById('touchTotal');
                totalEl.textContent = '¥' + parseFloat(keypadInput).toFixed(2);
            });

            document.getElementById('keyConfirm')?.addEventListener('click', function() {
                if (keypadInput && parseFloat(keypadInput) > 0) {
                    alert('✅ 金额已确认: ¥' + parseFloat(keypadInput).toFixed(2));
                    keypadInput = '';
                } else {
                    alert('请输入有效金额');
                }
            });

            // 初始化
            renderProducts('全部');
            updateCart();

            // 时钟
            function updateClock() {
                document.getElementById('touchTime').textContent = new Date().toLocaleTimeString('zh-CN', { hour12: false });
            }
            updateClock();
            setInterval(updateClock, 1000);

            // 初始化模块
            init().catch(err => console.warn('触屏收银初始化失败:', err));
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'TouchPos',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    export const meta = { name: '触屏收银', path: '/pos/touch-pos', icon: 'fa-hand-pointer', permission: 'pos:touch' };
export async function render(container) {
    container.innerHTML = `
        <div class="touch-pos-container">
            <div class="page-header"><h1>👆 触屏收银</h1></div>
            <div class="card"><div class="card-body">
                <div style="text-align:center;padding:40px;">
                    <i class="fas fa-hand-pointer" style="font-size:48px;color:#4F46E5;"></i>
                    <h3 style="margin-top:12px;">触屏收银模式</h3>
                    <p style="color:#6B7280;">针对触屏设备优化的收银界面</p>
                    <div style="margin-top:16px;display:grid;grid-template-columns:repeat(5,1fr);gap:8px;max-width:600px;margin:16px auto;">
                        ${[1,2,3,4,5,6,7,8,9,0,'清空','结账'].map(n => `
                            <button class="btn btn-outline" style="padding:16px;font-size:20px;">${n}</button>
                        `).join('')}
                    </div>
                </div>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [TouchPOS] 已初始化'); }
export default { meta, render, init };
  },
  methods: {}
}
</script>

<style scoped>

</style>
