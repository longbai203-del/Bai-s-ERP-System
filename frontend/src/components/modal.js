/**
 * @file modal.js
 * @description 模态框组件
 * @module components/modal
 */

/**
 * 模态框配置
 * @typedef {Object} ModalConfig
 * @property {string} title - 模态框标题
 * @property {string|HTMLElement} content - 内容
 * @property {Array<ModalButton>} buttons - 按钮配置
 * @property {string} [size] - 尺寸: sm|md|lg|xl
 * @property {boolean} [closable] - 是否可关闭
 * @property {Function} [onClose] - 关闭回调
 * @property {Function} [onOpen] - 打开回调
 */

/**
 * 按钮配置
 * @typedef {Object} ModalButton
 * @property {string} label - 按钮文字
 * @property {string} [type] - 按钮类型: primary|success|danger|warning|secondary
 * @property {Function} onClick - 点击回调
 * @property {boolean} [autoClose] - 点击后自动关闭
 * @property {string} [className] - 自定义CSS类
 */

/**
 * 模态框组件
 */
export const modal = {
    /** @type {HTMLElement} 当前模态框元素 */
    _currentModal: null,

    /** @type {Function} 关闭回调 */
    _onClose: null,

    /**
     * 打开模态框
     * @param {ModalConfig} config - 模态框配置
     * @returns {Promise<void>}
     */
    open(config) {
        return new Promise((resolve) => {
            const { title, content, buttons = [], size = 'md', closable = true, onClose, onOpen } = config;

            // 关闭已有模态框
            this.close();

            // 创建遮罩
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay active';
            overlay.id = 'modalOverlay';

            // 创建模态框
            const modalBox = document.createElement('div');
            modalBox.className = `modal-box modal-${size}`;

            // 标题
            let headerHtml = `
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
            `;
            if (closable) {
                headerHtml += `
                    <button class="modal-close" aria-label="关闭">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            }
            headerHtml += `</div>`;

            // 内容
            let contentHtml = `<div class="modal-body">`;
            if (typeof content === 'string') {
                contentHtml += content;
            } else if (content instanceof HTMLElement) {
                contentHtml += content.outerHTML;
            }
            contentHtml += `</div>`;

            // 按钮
            let footerHtml = '';
            if (buttons.length > 0) {
                footerHtml = `<div class="modal-footer">`;
                buttons.forEach(btn => {
                    const type = btn.type || 'secondary';
                    const classes = btn.className || `btn btn-${type}`;
                    footerHtml += `
                        <button class="${classes}" data-modal-action="${btn.label}">
                            ${btn.label}
                        </button>
                    `;
                });
                footerHtml += `</div>`;
            }

            modalBox.innerHTML = headerHtml + contentHtml + footerHtml;
            overlay.appendChild(modalBox);
            document.body.appendChild(overlay);

            this._currentModal = overlay;
            this._onClose = onClose || null;

            // 关闭按钮
            if (closable) {
                const closeBtn = modalBox.querySelector('.modal-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        this.close();
                    });
                }
            }

            // 点击遮罩关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay && closable) {
                    this.close();
                }
            });

            // 按钮事件
            modalBox.querySelectorAll('[data-modal-action]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const label = btn.dataset.modalAction;
                    const buttonConfig = buttons.find(b => b.label === label);
                    if (buttonConfig && buttonConfig.onClick) {
                        buttonConfig.onClick();
                    }
                    if (buttonConfig?.autoClose !== false) {
                        this.close();
                    }
                });
            });

            // ESC 键关闭
            this._handleKeydown = (e) => {
                if (e.key === 'Escape' && closable) {
                    this.close();
                }
            };
            document.addEventListener('keydown', this._handleKeydown);

            // 触发打开回调
            if (onOpen) onOpen();

            // 解决 resolve
            this._resolve = resolve;
        });
    },

    /**
     * 关闭模态框
     */
    close() {
        if (this._currentModal) {
            // 触发关闭回调
            if (this._onClose) {
                this._onClose();
            }

            this._currentModal.classList.remove('active');
            setTimeout(() => {
                if (this._currentModal && this._currentModal.parentNode) {
                    this._currentModal.parentNode.removeChild(this._currentModal);
                }
                this._currentModal = null;
                this._onClose = null;
            }, 300);

            document.removeEventListener('keydown', this._handleKeydown);
        }

        if (this._resolve) {
            this._resolve();
            this._resolve = null;
        }
    },

    /**
     * 确认对话框
     * @param {string} title - 标题
     * @param {string} message - 消息
     * @param {string} confirmText - 确认按钮文字
     * @param {string} cancelText - 取消按钮文字
     * @returns {Promise<boolean>}
     */
    confirm(title, message, confirmText = '确认', cancelText = '取消') {
        return new Promise((resolve) => {
            this.open({
                title,
                content: `<p style="color:var(--color-gray-600);">${message}</p>`,
                size: 'sm',
                buttons: [
                    {
                        label: cancelText,
                        type: 'secondary',
                        onClick: () => resolve(false)
                    },
                    {
                        label: confirmText,
                        type: 'danger',
                        onClick: () => resolve(true)
                    }
                ]
            });
        });
    },

    /**
     * 提示对话框
     * @param {string} title - 标题
     * @param {string} message - 消息
     * @param {string} buttonText - 按钮文字
     * @param {string} [type] - 类型: info|success|warning|danger
     * @returns {Promise<void>}
     */
    alert(title, message, buttonText = '确定', type = 'info') {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            danger: '❌'
        };

        return this.open({
            title,
            content: `<div style="text-align:center;padding:20px 0;">
                <div style="font-size:48px;margin-bottom:16px;">${icons[type] || 'ℹ️'}</div>
                <p style="color:var(--color-gray-600);">${message}</p>
            </div>`,
            size: 'sm',
            buttons: [
                {
                    label: buttonText,
                    type: 'primary',
                    onClick: () => {}
                }
            ]
        });
    },

    /**
     * 确认删除
     * @param {string} itemName - 要删除的项目名称
     * @returns {Promise<boolean>}
     */
    confirmDelete(itemName) {
        return this.confirm(
            '确认删除',
            `确定要删除 "${itemName}" 吗？此操作不可撤销。`,
            '删除',
            '取消'
        );
    }
};

export default modal;