import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

// 测试组件示例
describe('测试示例', () => {
  it('应该通过基础测试', () => {
    expect(1 + 1).toBe(2)
  })

  it('应该能测试 Vue 组件', () => {
    const TestComponent = {
      template: '<div class="test">Hello World</div>'
    }
    const wrapper = mount(TestComponent)
    expect(wrapper.find('.test').text()).toBe('Hello World')
  })
})
