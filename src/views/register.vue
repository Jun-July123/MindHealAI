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
// const formData = reactive({
//   "username": " ",
//   "email": "2323211111@qq.com",
//   "nickname": "小样",
//   "phone": "13312345678",
//   "password": "123456",
//   "confirmPassword": "123456",  
//   "gender":1,
//   "userType":1//用户类型 1-普通用户 2-管理员
// })
const formData = ref({
    "username": "abbb",
    "email": "443542407@qq.com",
    "nickname": "Lalala",
    "phone": "15336663236",
    "password": "123456",
    "confirmPassword": "123456",
    "gender": 1,
    "userType": 1
})

// 25-3.2 定义注册表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '用户名3-16位', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_, val, cb) => {
        val !== formData.value.password ? cb(new Error('两次密码不一致')) : cb()
      },
      trigger: 'blur'
    }
  ]
})

const submitFormRef = ref(null)
const router = useRouter()
// 25-3.6 注册事件，接收submitFormRef表单（注册表单）
// const onRegister = async (form) => {
//   // 25-3.6.1 表单不存在，直接返回
//   if (!form) {
//     return
//   }
//   form.validate((valid) => {
//     // 25-4.2 验证表单失败，直接返回
//     if (!valid) {
//       return
//     }
//     // 25-4.3 验证表单成功，调用注册用户接口，传递表单数据
//     postUserAddAPI(formData.value).then(res => {
//       // 25-4.3.1 如果注册失败，显示错误信息
//       // if(res.data.code === 'BUSINESS_ERROR'){
//       //     ElMessage.error(res.data.message)
//       //   }
//         // 25-4.3.2 注册成功，显示成功信息，跳转登录页
//         // else{
//           ElMessage.success('注册成功')
//           router.push('/auth/login')
//         // }  
//       })  
//   })
  
// }

// 吗
// const onRegister = (form) => {
//   if (!form) return
//   form.validate(async (valid) => {
//     if (!valid) return
//     // 直接传完整formData，不要删除confirmPassword
//     try {
//       const res = await postUserAddAPI(formData.value)
//       console.log('后端返回原始数据', res)
//       if (res.code == 200) {
//         ElMessage.success('注册成功')}
//       // } else {
//       //   ElMessage.error(res.msg || '注册失败，请检查填写信息')
//       // }
//     } catch (err) {
//       console.error('请求异常', err)
//       ElMessage.error('服务器响应异常，请检查填写内容')
//     }
//     // 25-3.6.2 注册成功，跳转登录页
//     // router.push('/auth/login')
//   })
// }
const loading = ref(false)
// 注册核心方法 - 完全适配后端接口、修复所有逻辑BUG
const onRegister = async (form) => {
  if (!form) return
  // 表单整体校验
  const valid = await form.validate()
  if (!valid) return

  loading.value = true
  try {
    // 完整传递后端所需全部参数，不做剔除，严格匹配接口文档
    const res = await postUserAddAPI(formData.value)
    // 统一处理后端返回状态
    if (res.code === 200) {
      ElMessage.success('注册成功，请前往登录')
      // 仅成功跳转，失败不跳转
      router.push('/auth/login')
    } else {
      ElMessage.error(res.msg || '注册失败，请检查填写信息')
    }
  } catch (err) {
    ElMessage.error('注册失败，请检查网络或稍后重试')
  } finally {
    // 强制关闭loading，彻底解决按钮卡死
    loading.value = false
  }
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


