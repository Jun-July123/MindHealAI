<!-- 25-1.1 创建前台布局组件FrontendLayout（包含导航栏、主体内容、底部页脚）-->
<template>
  <div class="frontend-layout">
    <!-- 25-1.5 导航栏分为左右两部分 -->
    <div class="navbar-container">
        <!-- 25-1.5.1 左侧logo,el-image配置logo图片 -->
        <div class="brand-section">
          <el-image :src="logoUrl" class="brand-logo" style="height: 50px; width: 50px;" />
          <h1 class="brand-name">心愈智伴AI助手</h1>
        </div>
        <!-- 25-1.5.2 右侧导航栏，router-link配置首页、AI咨询、情绪日记、知识库、登录/注册、退出登录按钮 -->
        <!-- 25-1.5.3 只有登录后才显示AI咨询、退出登录按钮；在未登录时，才显示登录、注册按钮 -->
        <div class="nav-section">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/consultation" v-if="isLogin" class="nav-link">AI咨询</router-link>
          <router-link to="/emotion-diary" class="nav-link">情绪日记</router-link>
          <router-link to="/knowledge" class="nav-link">知识库</router-link>
          <!-- 26-1.3 退出登录按钮注册点击事件 -->
          <el-button @click="onLogout" v-if="isLogin" class="logout-btn">退出登录</el-button>
          <template v-else>
            <router-link to="/auth/login" class="nav-link">登录</router-link>
            <router-link to="/auth/register" class="nav-link">
              <el-button type="primary">注册</el-button>
            </router-link>
          </template>
        </div>
    </div>

    <!-- 25-1.6 router-view配置主体内容 -->
    <div class="main-container">
      <router-view></router-view>
    </div>

    <!-- 25-1.7 底部页脚，包含页脚内容 -->
    <div class="footer-container">
      <div class="footer-bottom">
        <p> &copy; 2026 心愈智伴AI助手. All rights reserved</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { postUserLogoutAPI } from '@/api/admin'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const logoUrl = new URL('@/assets/images/机器人.png', import.meta.url).href

const isLogin = ref(false)
const userInfo = ref(null)

const router = useRouter()
// 25-1.4 退出登录事件
const onLogout = () => {
  // 25-1.4.1 点击退出登录，弹出确认框
  ElMessageBox.confirm('确定退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 25-1.4.2 确认退出登录,引入调用退出登录接口,清除本地token及userInfo
    postUserLogoutAPI().then(res => {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      // 25-1.4.3 清除信息后,提示退出成功,跳转登录页
      ElMessage.success('退出成功')
      router.push('/auth/login')  
    })
  })
}

onMounted(() => {
  // 25-1.4 定义isLogin变量，判断用户登录状态(如果存在token，说明用户已登录)
  const token = localStorage.getItem('token')
  if (token) {
    isLogin.value = true
  }
})
</script>

<style scoped lang="scss">
  .frontend-layout {
     background-color: #fff;
        .navbar-container {
            max-width: 1200px;
            height: 100%;
            margin: 0 auto;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .brand-section {
                display: flex;
                align-items: center;
                .brand-name {
                    margin-left: 10px;
                    font-size: 24px;
                    font-weight: 600;
                    color: #333;
                }
            }
            .nav-section {
                display: flex;
                align-items: center;
                gap: 40px;
                .nav-link {
                    color: #4b5563;
                    font-size: 16px;
                    font-weight: 500;
                    &:hover {
                        color: #4A90E2;
                    }
                }
            }
        }

        .footer-container {
            background: #1f2937;
            color: white;
            padding: 15px 0;
            margin-top: auto;
            .footer-bottom {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 10px;
                text-align: center;
            }
        }   
    }

</style>
