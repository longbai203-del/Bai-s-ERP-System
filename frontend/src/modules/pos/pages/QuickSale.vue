<template>
  <div class="pos-">
    



    <div class="quick-sale-container">
        
        <div class="page-header">
            <div>
                <h1>
                    <i class="fas fa-bolt" style="color:#F59E0B;"></i>
                    快速销售
                    <span style="font-size:13px;font-weight:400;color:#6B7280;margin-left:8px;">一键开单</span>
                </h1>
                <div class="subtitle">常用商品快速选择，支持自定义金额</div>
            </div>
            <div>
                <button class="btn btn-outline" onclick="alert('📊 销售统计')">
                    <i class="fas fa-chart-bar"></i> 统计
                </button>
                <button class="btn btn-outline" id="quickResetBtn">
                    <i class="fas fa-undo"></i> 重置
                </button>
            </div>
        </div>

        
        <div class="quick-sale-grid">
            
            <div class="quick-products">
                <div class="section-title">
                    <i class="fas fa-th" style="color:#4F46E5;"></i>
                    常用服务
                    <span style="font-size:12px;color:#6B7280;font-weight:400;">点击添加到购物车</span>
                </div>
                <div class="product-buttons" id="quickProductButtons">
                    
                    <div style="grid-column:1/-1;text-align:center;padding:20px;color:#9CA3AF;">
                        <i class="fas fa-spinner fa-spin" style="font-size:20px;"></i> 加载中...
                    </div>
                </div>

                
                <div style="margin-top:16px;padding-top:16px;border-top:1px solid #F3F4F6;">
                    <div style="font-size:14px;font-weight:500;color:#1F2937;margin-bottom:6px;">
                        <i class="fas fa-pen" style="color:#4F46E5;"></i> 自定义金额
                    </div>
                    <div class="custom-amount">
                        <input type="number" id="customAmountInput" placeholder="输入金额" step="0.01" min="0">
                        <input type="text" id="customNameInput" placeholder="项目名称" style="flex:0.8;">
                        <button id="customAddBtn"><i class="fas fa-plus"></i> 添加</button>
                    </div>
                </div>
            </div>

            
            <div class="quick-cart">
                <div class="cart-header">
                    <h3><i class="fas fa-shopping-cart" style="color:#4F46E5;"></i> 购物车</h3>
                    <span style="font-size:13px;color:#6B7280;" id="quickCartCount">0 件</span>
                </div>
                <div class="cart-items" id="quickCartItems">
                    <div class="cart-empty">
                        <i class="fas fa-shopping-basket"></i>
                        <p>购物车为空</p>
                        <span style="font-size:12px;">点击左侧商品添加</span>
                    </div>
                </div>
                <div class="cart-footer">
                    <div class="summary-row">
                        <span>小计</span>
                        <span id="quickSubtotal">¥0.00</span>
                    </div>
                    <div class="summary-row total">
                        <span>合计</span>
                        <span class="amount" id="quickTotal">¥0.00</span>
                    </div>
                    <button class="checkout-btn" id="quickCheckoutBtn" disabled>
                        <i class="fas fa-check"></i> 立即结算
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import { init } from './quick-sale.js';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('⚡ 快速销售页面加载');
            
            // 模拟商品数据
            const products = [
                { id: 1, name: '标准洗车', price: 89, icon: '🚗' },
                { id: 2, name: '精致洗车', price: 159, icon: '🚙' },
                { id: 3, name: '内饰清洁', price: 299, icon: '🧹' },
                { id: 4, name: '全车镀晶', price: 899, icon: '✨' },
                { id: 5, name: '机油更换', price: 399, icon: '🔧' },
                { id: 6, name: '轮胎护理', price: 120, icon: '🛞' },
                { id: 7, name: '空调清洗', price: 259, icon: '❄️' },
                { id: 8, name: 'VIP洗车卡', price: 999, icon: '💳' }
            ];

            // 渲染商品按钮
            const container = document.getElementById('quickProductButtons');
            container.innerHTML = products.map(p => `
                <button class="product-btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
                    <span class="icon">${p.icon}</span>
                    <span class="name">${p.name}</span>
                    <span class="price">¥${p.price}</span>
                </button>
            `).join('');

            // 购物车状态
            let cart = [];
            let total = 0;

            // 添加商品到购物车
            function addToCart(name, price) {
                const existing = cart.find(item => item.name === name && item.price === price);
                if (existing) {
                    existing.qty += 1;
                } else {
                    cart.push({ name, price, qty: 1 });
                }
                updateCart();
            }

            // 更新购物车UI
            function updateCart() {
                const container = document.getElementById('quickCartItems');
                const countEl = document.getElementById('quickCartCount');
                const subtotalEl = document.getElementById('quickSubtotal');
                const totalEl = document.getElementById('quickTotal');
                const checkoutBtn = document.getElementById('quickCheckoutBtn');

                total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
                const count = cart.reduce((sum, item) => sum + item.qty, 0);
                
                countEl.textContent = count + ' 件';
                subtotalEl.textContent = '¥' + total.toFixed(2);
                totalEl.textContent = '¥' + total.toFixed(2);
                checkoutBtn.disabled = cart.length === 0;

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
                            <button class="qty-btn" onclick="window.quickSaleUpdateQty(${index}, -1)">−</button>
                            <span class="qty">${item.qty}</span>
                            <button class="qty-btn" onclick="window.quickSaleUpdateQty(${index}, 1)">+</button>
                            <span class="item-total">¥${(item.price * item.qty).toFixed(2)}</span>
                            <button class="remove-btn" onclick="window.quickSaleRemoveItem(${index})">×</button>
                        </div>
                    </div>
                `).join('');

                // 暴露函数到全局
                window.quickSaleUpdateQty = function(index, delta) {
                    if (cart[index]) {
                        cart[index].qty += delta;
                        if (cart[index].qty <= 0) {
                            cart.splice(index, 1);
                        }
                        updateCart();
                    }
                };

                window.quickSaleRemoveItem = function(index) {
                    cart.splice(index, 1);
                    updateCart();
                };
            }

            // 商品按钮点击
            container.querySelectorAll('.product-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const name = this.dataset.name;
                    const price = parseFloat(this.dataset.price);
                    addToCart(name, price);
                    // 按钮反馈
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => this.style.transform = '', 150);
                });
            });

            // 自定义金额添加
            document.getElementById('customAddBtn')?.addEventListener('click', function() {
                const amountInput = document.getElementById('customAmountInput');
                const nameInput = document.getElementById('customNameInput');
                const amount = parseFloat(amountInput.value);
                const name = nameInput.value.trim() || '自定义项目';
                if (isNaN(amount) || amount <= 0) {
                    alert('请输入有效金额');
                    return;
                }
                addToCart(name, amount);
                amountInput.value = '';
                nameInput.value = '';
            });

            // 回车键支持
            document.getElementById('customAmountInput')?.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    document.getElementById('customAddBtn').click();
                }
            });
            document.getElementById('customNameInput')?.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    document.getElementById('customAddBtn').click();
                }
            });

            // 结算
            document.getElementById('quickCheckoutBtn')?.addEventListener('click', function() {
                if (cart.length === 0) return;
                const totalAmount = total;
                if (confirm('确认结算 ¥' + totalAmount.toFixed(2) + '？')) {
                    alert('✅ 订单已创建！\n总金额: ¥' + totalAmount.toFixed(2) + '\n订单号: QS-' + Date.now().toString().slice(-6));
                    cart = [];
                    updateCart();
                }
            });

            // 重置
            document.getElementById('quickResetBtn')?.addEventListener('click', function() {
                if (cart.length === 0) return;
                if (confirm('确认清空购物车？')) {
                    cart = [];
                    updateCart();
                }
            });

            // 键盘快捷键
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    document.getElementById('quickCheckoutBtn').click();
                }
            });

            // 初始化模块
            init().catch(err => console.warn('快速销售初始化失败:', err));
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'QuickSale',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    //  (已注释)
export async function render(container) {
    container.innerHTML = `
        <div class="quick-sale-container">
            <div class="page-header"><h1>⚡ 快速销售</h1></div>
            <div class="card"><div class="card-body">
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
                    ${['标准洗车','精洗','打蜡','内饰清洁','发动机清洗','轮胎护理','空调清洗','镀膜'].map(name => `
                        <button class="btn btn-primary quick-sale-btn" style="padding:20px;font-size:16px;text-align:center;height:80px;">
                            <div style="font-size:24px;">🚗</div>
                            <div>${name}</div>
                            <div style="font-size:12px;font-weight:300;">¥${Math.floor(Math.random()*200+50)}</div>
                        </button>
                    `).join('')}
                </div>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [QuickSale] 已初始化'); }
export default { meta, render, init };
  },
  methods: {}
}
</script>

<style scoped>

</style>

