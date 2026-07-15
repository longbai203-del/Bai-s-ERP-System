/**
 * @file datatable.js
 * @description 数据表格组件
 * @module components/datatable
 */

import { formatDate, formatCurrency } from '@utils/helpers.js';

/**
 * 表格列配置
 * @typedef {Object} ColumnConfig
 * @property {string} key - 数据字段名
 * @property {string} label - 列标题
 * @property {string} [type] - 数据类型: text|number|currency|date|datetime|status|action
 * @property {Function} [render] - 自定义渲染函数
 * @property {string} [width] - 列宽度
 * @property {string} [align] - 对齐方式: left|center|right
 * @property {boolean} [sortable] - 是否可排序
 * @property {string} [className] - 自定义CSS类
 */

/**
 * 表格配置
 * @typedef {Object} DataTableConfig
 * @property {Array<ColumnConfig>} columns - 列配置
 * @property {Array} data - 数据数组
 * @property {string} [rowKey] - 行唯一标识字段
 * @property {Function} [onRowClick] - 行点击回调
 * @property {Array} [actions] - 操作按钮配置
 * @property {string} [emptyText] - 空数据提示
 * @property {boolean} [loading] - 加载状态
 */

/**
 * 数据表格组件
 */
export const datatable = {
    /**
     * 渲染表格
     * @param {HTMLElement} container - 容器元素
     * @param {DataTableConfig} config - 表格配置
     */
    render(container, config) {
        const { columns, data = [], rowKey = 'id', onRowClick, actions = [], emptyText = '暂无数据', loading = false } = config;

        let html = `
            <div class="table-wrapper">
                ${loading ? '<div class="table-loading"><div class="spinner"></div></div>' : ''}
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                        `;

        columns.forEach(col => {
            const align = col.align || 'left';
            const width = col.width ? `style="width:${col.width};"` : '';
            html += `<th class="text-${align}" ${width}>${col.label}</th>`;
        });

        if (actions.length > 0) {
            html += `<th class="text-center" style="width:120px;">操作</th>`;
        }

        html += `
                            </tr>
                        </thead>
                        <tbody>
                        `;

        if (data.length === 0) {
            html += `
                <tr>
                    <td colspan="${columns.length + (actions.length > 0 ? 1 : 0)}" class="text-center empty-state">
                        <div class="empty-icon">📭</div>
                        <p>${emptyText}</p>
                    </td>
                </tr>
            `;
        } else {
            data.forEach((row, index) => {
                const rowId = row[rowKey] || index;
                html += `<tr class="${onRowClick ? 'clickable' : ''}" data-row-id="${rowId}">`;

                columns.forEach(col => {
                    const value = row[col.key];
                    let displayValue = this._formatValue(value, col);
                    const align = col.align || 'left';
                    html += `<td class="text-${align}">${displayValue}</td>`;
                });

                if (actions.length > 0) {
                    html += `<td class="text-center">`;
                    actions.forEach(action => {
                        const visible = action.visible ? action.visible(row) : true;
                        if (visible) {
                            const classes = action.className || 'btn btn-sm btn-outline';
                            const icon = action.icon ? `<i class="fas ${action.icon}"></i>` : '';
                            html += `
                                <button class="${classes}" data-action="${action.key}" data-row-id="${rowId}">
                                    ${icon} ${action.label || ''}
                                </button>
                            `;
                        }
                    });
                    html += `</td>`;
                }

                html += `</tr>`;
            });
        }

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // 绑定事件
        this._bindEvents(container, config);
    },

    /**
     * 格式化值
     * @private
     * @param {*} value - 原始值
     * @param {ColumnConfig} col - 列配置
     * @returns {string}
     */
    _formatValue(value, col) {
        if (col.render && typeof col.render === 'function') {
            return col.render(value);
        }

        if (value === undefined || value === null) return '-';

        switch (col.type) {
            case 'currency':
                return `¥${formatCurrency(value)}`;
            case 'date':
                return formatDate(value, 'short');
            case 'datetime':
                return formatDate(value, 'long');
            case 'status':
                return this._renderStatus(value);
            default:
                return String(value);
        }
    },

    /**
     * 渲染状态标签
     * @private
     * @param {string} status - 状态值
     * @returns {string}
     */
    _renderStatus(status) {
        const statusMap = {
            active: { label: '启用', class: 'status-active' },
            inactive: { label: '停用', class: 'status-inactive' },
            pending: { label: '待处理', class: 'status-pending' },
            completed: { label: '已完成', class: 'status-completed' },
            cancelled: { label: '已取消', class: 'status-cancelled' },
            processing: { label: '处理中', class: 'status-processing' }
        };

        const info = statusMap[status] || { label: status, class: '' };
        return `<span class="status-badge ${info.class}">${info.label}</span>`;
    },

    /**
     * 绑定事件
     * @private
     * @param {HTMLElement} container - 容器元素
     * @param {DataTableConfig} config - 表格配置
     */
    _bindEvents(container, config) {
        const { onRowClick, actions = [], rowKey = 'id' } = config;

        // 行点击
        if (onRowClick) {
            container.querySelectorAll('tbody tr.clickable').forEach(row => {
                row.addEventListener('click', () => {
                    const rowId = row.dataset.rowId;
                    const data = config.data.find(d => d[rowKey] == rowId);
                    if (data) onRowClick(data);
                });
            });
        }

        // 操作按钮
        container.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const actionKey = btn.dataset.action;
                const rowId = btn.dataset.rowId;
                const data = config.data.find(d => d[rowKey] == rowId);
                
                const action = actions.find(a => a.key === actionKey);
                if (action && action.onClick) {
                    action.onClick(data, rowId);
                }
            });
        });
    },

    /**
     * 更新数据
     * @param {HTMLElement} container - 容器元素
     * @param {DataTableConfig} config - 新的表格配置
     */
    update(container, config) {
        this.render(container, config);
    }
};

export default datatable;