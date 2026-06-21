<template>
  <div class="container">
    <!-- 25-3.3 注册页面包含标题和表单内容 -->
    <div class="title">
      <div class="title-text">
        <h2>创建您的账户</h2>
        <p>请填写您的个人信息，开始与我们互动</p>
      </div>
    </div>
   
    <div class="form-container">
      <!-- 25-3.4 注册表单:model绑定表单数据，:rules绑定验证规则，:ref绑定表单实例，label-position设置标签位置为顶部 -->
      <el-form :model="formData" :rules="rules" ref="submitFormRef" label-position="top">
        <!-- 25-3.4.1 用户名，prop绑定username用于验证rules.username规则，v-model绑定formData.username用于更新用户名数据 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" size="large" />
        </el-form-item>

        <!-- 25-3.4.2 邮箱，prop绑定email用于验证rules.email规则，v-model绑定formData.email用于更新邮箱数据 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" size="large" />
        </el-form-item>
        <!-- 25-3.4.3 昵称，prop绑定nickname用于验证rules.nickname规则，v-model绑定formData.nickname用于更新昵称数据 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称" size="large" />
        </el-form-item>
        <!-- 25-3.4.4 手机号，prop绑定phone用于验证rules.phone规则，v-model绑定formData.phone用于更新手机号数据 -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" size="large" />
        </el-form-item>
        <!-- 25-3.4.5 密码，prop绑定password用于验证rules.password规则，v-model绑定formData.password用于更新密码数据 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" size="large" type="password" show-password />
        </el-form-item>
        <!-- 25-3.4.6 确认密码，prop绑定confirmPassword用于验证rules.confirmPassword规则，v-model绑定formData.confirmPassword用于更新确认密码数据 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" type="password" placeholder="请确认密码" size="large" show-password />
        </el-form-item>
        <!-- 25-3.4.7 注册按钮，prop绑定submitFormRef用于提交表单数据 -->
        <el-form-item>
          <!-- 25-3.5 注册按钮添加注册事件，传递submitFormRef表单实例 -->
          <el-button class="btn" type="primary" @click="onRegister(submitFormRef)">注册</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script setup>
import { ref ,reactive} from 'vue'
import { postUserAddAPI } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

// 25-3.1 定义注册表单数据
const formData = reactive({
  "username": '',
  "email": '2323211111@qq.com',
  "nickname": '小样',
  "phone": '13312345678',
  "password": '123456',
  "confirmPassword": '123456',
  "gender":0,
  "userType":1//用户类型 1-普通用户 2-管理员
})

// 25-3.2 定义注册表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ]
})

const submitFormRef = ref(null)
const router = useRouter()
// 25-3.6 注册事件，接收submitFormRef表单（注册表单）
const onRegister = async (form) => {
  // 25-3.6.1 表单不存在，直接返回
  if (!form) {
    return
  }
  form.validate((valid) => {
    if (valid) {
      postUserAddAPI(formData).then(res => {
        if(res.data.code === 'BUSINESS_ERROR'){
          ElMessage.error(res.data.message)
        }
        else{
          ElMessage.success('注册成功')
        }
        console.log(res)
        // 如果你需要注册完成手动跳登录，放开下面一行
        // router.push('/auth/login')
      })
    }
  })
  
}
</script>

<style scoped lang="scss">
.container {
    width: 384px;
    .flex-box {
        display: flex;
        align-items: center;
    }
    .title {
        .title-text {
            text-align: center;
            h2 {
                font-size: 36px;
                margin-bottom: 10px;
            }
            p {
                font-size: 18px;
                color: #6b7280;
            }
        }
    }
    .form-container {
        margin-top: 30px;
        .btn {
            margin-top: 40px;
            width: 100%;
        }
        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}
</style>