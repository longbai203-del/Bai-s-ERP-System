<template>
  <div v-html="htmlContent" class="html-wrapper"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const htmlContent = ref('<div style="padding: 20px; color: #666;">正在加载页面...</div>')

const loadHtml = async () => {
  // 1. 从路由的 meta 中获取当前模块 ID
  const moduleId = route.meta?.moduleId
  if (!moduleId) {
    htmlContent.value = '<div style="color:red;">错误：路由配置中缺少 moduleId</div>'
    return
  }

  try {
    // 2. 使用 Vite 原生支持的 ?raw 后缀，以纯文本方式读取 HTML 文件
    // 它会先找模块文件夹下的 index.html
    const module = await import(`../modules/${moduleId}/index.html?raw`)
    htmlContent.value = module.default
  } catch (error) {
    // 3. 如果找不到 index.html，尝试找同名文件夹的 HTML (如 02-pos/02-pos.html)
    try {
      const moduleAlt = await import(`../modules/${moduleId}/${moduleId}.html?raw`)
      htmlContent.value = moduleAlt.default
    } catch (error2) {
      console.error(`加载模块 [${moduleId}] 的 HTML 失败:`, error2)
      htmlContent.value = `
        <div style="color: #dc3545; padding: 40px; text-align: center; background: white; border-radius: 8px; margin: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-bottom: 10px;">⚠️ 模块未渲染</h3>
          <p style="color: #666; margin-bottom: 20px;">路由已激活，但未找到对应的 HTML 文件。</p>
          <p style="font-size: 13px; background: #f8f9fa; padding: 12px; border-radius: 4px; display: inline-block;">
            <strong>模块 ID:</strong> ${moduleId} <br>
            <strong>尝试路径:</strong> src/modules/${moduleId}/index.html
          </p>
          <p style="margin-top: 16px; font-size: 12px; color: #999;">如果该模块是纯 Vue 组件，请检查路由配置。</p>
        </div>
      `
    }
  }
}

// 4. 路由变化时重新加载
onMounted(loadHtml)
watch(() => route.path, loadHtml)
</script>

<style scoped>
.html-wrapper {
  width: 100%;
  min-height: 100%;
  background: #f5f7fa;
}
</style>