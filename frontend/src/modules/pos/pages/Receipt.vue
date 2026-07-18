<template>
  <div class="pos-">
    



    <div class="receipt-container">
        
        <div class="page-header no-print">
            <div>
                <h1>
                    <i class="fas fa-receipt" style="color:#4F46E5;"></i>
                    小票打印
                </h1>
            </div>
            <div>
                <button class="btn btn-sm btn-outline" onclick="window.location.href='#/02-pos/quick-sale'">
                    <i class="fas fa-arrow-left"></i> 返回
                </button>
            </div>
        </div>

        
        <div class="receipt-paper" id="receiptPaper">
            <div class="receipt-header">
                <div class="store-name">🚗 Carwash Pro</div>
                <div class="store-info">
                    智能洗车连锁 · 旗舰店<br>
                    地址: 北京市朝阳区建国路88号<br>
                    电话: 010-8888-6666
                </div>
            </div>

            <div class="receipt-body" id="receiptBody">
                <div class="row header">
                    <span>商品</span>
                    <span>数量</span>
                    <span>金额</span>
                </div>
                
                <div style="text-align:center;padding:20px;color:#9CA3AF;">加载中...</div>
            </div>

            <div class="receipt-footer">
                <div class="thanks">感谢您的光临！</div>
                <div style="margin-top:4px;">
                    支付时间: <span id="receiptTime">--</span><br>
                    订单号: <span id="receiptOrderId">--</span>
                </div>
                <div style="margin-top:6px;font-size:10px;color:#9CA3AF;">
                    本小票为电子凭证，请妥善保管
                </div>
            </div>
        </div>

        
        <div class="receipt-actions no-print">
            <button class="btn btn-primary" id="printBtn">
                <i class="fas fa-print"></i> 打印小票
            </button>
            <button class="btn btn-success" id="saveReceiptBtn">
                <i class="fas fa-save"></i> 保存
            </button>
            <button class="btn btn-outline" id="shareReceiptBtn">
                <i class="fas fa-share-alt"></i> 分享
            </button>
        </div>
    </div>

    <script type="module">
        import { init } from './receipt.js';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('🧾 小票打印页面加载');
            
            // 从URL参数获取订单数据
            const params = new URLSearchParams(window.location.search);
            const orderData = params.get('order');
            
            let order = null;
            if (orderData) {
                try {
                    order = JSON.parse(decodeURIComponent(orderData));
                } catch (e) {
                    console.warn('解析订单数据失败，使用示例数据');
                }
            }

            // 示例订单数据
            if (!order) {
                order = {
                    id: 'ORD-2024-001',
                    items: [
                        { name: '标准洗车', qty: 2, price: 89 },
                        { name: '内饰清洁', qty: 1, price: 299 },
                        { name: '轮胎护理', qty: 1, price: 120 }
                    ],
                    total: 597,
                    time: new Date().toISOString(),
                    payment: '微信支付'
                };
            }

            // 渲染小票
            function renderReceipt(order) {
                const body = document.getElementById('receiptBody');
                const timeEl = document.getElementById('receiptTime');
                const idEl = document.getElementById('receiptOrderId');

                // 渲染商品行
                let html = '';
                let subtotal = 0;
                order.items.forEach(item => {
                    const total = item.price * item.qty;
                    subtotal += total;
                    html += `
                        <div class="row">
                            <span>${item.name}</span>
                            <span>×${item.qty}</span>
                            <span>¥${total.toFixed(2)}</span>
                        </div>
                    `;
                });

                // 添加合计
                const tax = Math.round(subtotal * 0.06);
                const total = subtotal + tax;
                
                html += `
                    <div class="row" style="border-top:1px dotted #D1D5DB;padding-top:4px;margin-top:4px;">
                        <span>小计</span>
                        <span></span>
                        <span>¥${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="row">
                        <span>税费 (6%)</span>
                        <span></span>
                        <span>¥${tax.toFixed(2)}</span>
                    </div>
                    <div class="row total">
                        <span>合计</span>
                        <span></span>
                        <span class="amount">¥${total.toFixed(2)}</span>
                    </div>
                    <div class="row" style="font-size:12px;color:#6B7280;padding-top:4px;">
                        <span>支付方式</span>
                        <span></span>
                        <span>${order.payment || '现金'}</span>
                    </div>
                `;

                body.innerHTML = html;
                timeEl.textContent = new Date(order.time).toLocaleString('zh-CN');
                idEl.textContent = order.id;
            }

            renderReceipt(order);

            // 打印功能
            document.getElementById('printBtn')?.addEventListener('click', function() {
                window.print();
            });

            // 保存功能
            document.getElementById('saveReceiptBtn')?.addEventListener('click', function() {
                const receiptHTML = document.getElementById('receiptPaper').outerHTML;
                try {
                    localStorage.setItem('saved_receipt_' + order.id, receiptHTML);
                    alert('✅ 小票已保存到本地');
                } catch (e) {
                    alert('❌ 保存失败: ' + e.message);
                }
            });

            // 分享功能
            document.getElementById('shareReceiptBtn')?.addEventListener('click', function() {
                if (navigator.share) {
                    navigator.share({
                        title: '洗车小票 - Carwash Pro',
                        text: '订单 ' + order.id + ' 金额 ¥' + order.total.toFixed(2),
                        url: window.location.href
                    }).catch(() => {});
                } else {
                    // 复制订单信息
                    const text = 'Carwash Pro 洗车小票\n' +
                        '订单号: ' + order.id + '\n' +
                        '金额: ¥' + order.total.toFixed(2) + '\n' +
                        '时间: ' + new Date(order.time).toLocaleString('zh-CN');
                    navigator.clipboard.writeText(text).then(() => {
                        alert('✅ 订单信息已复制到剪贴板');
                    }).catch(() => {
                        alert('📋 订单信息:\n' + text);
                    });
                }
            });

            // 初始化模块
            init().catch(err => console.warn('小票打印初始化失败:', err));
        });
    </script>


  </div>
</template>

<script>
export default {
  name: 'Receipt',
  data() {
    return {}
  },
  mounted() {
    // 从原 JS 迁移的初始化逻辑
    export const meta = { name: '小票管理', path: '/pos/receipt', icon: 'fa-receipt', permission: 'pos:receipt' };
export async function render(container) {
    container.innerHTML = `
        <div class="receipt-container">
            <div class="page-header"><h1>🧾 小票管理</h1></div>
            <div class="card"><div class="card-body" id="receiptTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div></div>
        </div>
    `;
    const result = await apiClient.get('/orders', { params: { limit: 20 } });
    const data = result.success ? result.data.list || [] : [];
    const columns = [
        { key: 'orderNumber', label: '订单号' },
        { key: 'customerName', label: '客户' },
        { key: 'totalAmount', label: '金额', render: v => `¥${v}` },
        { key: 'createdAt', label: '时间', type: 'datetime' }
    ];
    const tableContainer = document.getElementById('receiptTable');
    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无小票' });
}
export async function init() { console.log('✅ [Receipt] 已初始化'); }
export default { meta, render, init };
  },
  methods: {}
}
</script>

<style scoped>

</style>
