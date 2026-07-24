/**
 * @file tests/example.test.ts
 * 示例测试文件
 */

describe('示例测试', () => {
    it('应该通过基本测试', () => {
      expect(1 + 1).toBe(2);
    });
  
    it('应该处理异步操作', async () => {
      const result = await Promise.resolve('success');
      expect(result).toBe('success');
    });
  
    it('应该处理对象比较', () => {
      const obj = { name: 'test', value: 123 };
      expect(obj).toHaveProperty('name');
      expect(obj.name).toBe('test');
    });
  });