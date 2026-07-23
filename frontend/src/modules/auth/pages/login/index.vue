<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">Bai's ERP System</h1>
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" @keyup.enter="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" size="large" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" @click="handleLogin" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({ username: 'admin', password: '123456' })

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const success = await userStore.login(loginForm)
      if (success) {
        const redirect = route.query.redirect as string || '/dashboard'
        router.push(redirect)
      }
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container { height: 100vh; display: flex; justify-content: center; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.login-box { width: 400px; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
.login-title { text-align: center; margin-bottom: 30px; color: #333; font-size: 24px; }
</style>
