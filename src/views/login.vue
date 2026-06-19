<template>
  <div class="container">
    <!-- 12-2.1 登录包含标题和表单 -->
    <div class="title">
      <!-- 12-2.2 登录标题区域包含返回按钮和标题 -->
      <div class="back-home">
        <el-icon><ArrowLeft></ArrowLeft></el-icon>返回首页
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <!-- 12-2.4 登录表单区域 -->
    <div class="form-container">
    <!-- 12-2.5 el-form配置ref,rules,model,label-position="top" -->
      <el-form 
        ref="ruleFormRef" 
        :model="formData"
        :rules="rules"
        label-position="top"
        >
        <el-form-item label="用户名/邮箱" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入用户名/邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password></el-input>
        </el-form-item>
        <!-- 12-2.7 点击登录，触发submitForm -->
        <div class="footer">
          <el-button type="primary" size="large" class="btn" @click="submitForm(ruleFormRef)">登录</el-button>
          <!-- 12-10 没有账号？路由跳转router-link to注册页面 -->
          <p>还没有账号？<router-link to="/auth/register">去注册</router-link></p>
        </div>     
      </el-form>
    </div>
  </div>
</template>

<script setup>
// 12-2.6 定义formData、rules、ruleFormref
import { ref } from 'vue'
// 13-2.4 login组件导入login接口
import { login } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()

const ruleFormRef = ref()
const formData = ref({
  username: '',
  password: ''
})
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})
// 12-2.8 submitForm函数，提交登录单验证
const submitForm = async (formEl) => {
  if(!formEl) return
  const valid = await formEl.validate()
    if (valid) {
      // console.log(formData.value,'formData.value')
      // 13-2.5 校验表单成功，调用登录接口，传递表单数据至接口
      try{
        const data = await login(formData.value)
        console.log(data);
        // 13-2.6 token判断
        // 13-2.6.1 不存在token，弹出错误信息
        // const token = res.data?.token
        // const user = res.data?.user
        if(!data?.token){
          ElMessage.error('登录失败，请检查用户名和密码')
          return
        }
        // 13-2.6.2 存在token,保存token及userInfo至本地存储
        localStorage.setItem('token',data.token)
        localStorage.setItem('userInfo',JSON.stringify(data.userInfo))
        ElMessage.success('登录成功')
        // 14-1.1 登陆成功根据用户角色跳转不同页面
        if(data.userInfo.userType === 2){
          router.push('/back/dashboard')
        }else{
          // router.push('/user')
        }
      }catch(err){
        // ElMessage.error(err.message)
        console.log(err);
      }
    } 
  
}
</script>
<style lang="scss" scoped>
.container{
  height: 384px;
  width: 350px; 
  /* 12-2.3 登录标题区域样式 */
  .title{
    .back-home{
      margin-bottom: 10px;
    }
    .title-text{
      // margin-bottom: 40px;
      text-align: center;
      h2{
        font-size: 36px;
        margin-bottom: 10px;
      }
      p{
        font-size: 18px;
        color: #666;
      }
    }
   }
   /* 12-2.9 登录表单区域样式 */
   .form-container{
    margin-top: 30px;
    .btn{
      margin-top: 20px;
      width: 100%;
    }
    .footer{
      text-align: center;
      padding: 30px;
      p{
        font-size: 18px;
        color: #666;
      }
    }
   }
}
</style>