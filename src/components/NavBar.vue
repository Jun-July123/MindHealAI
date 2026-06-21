<template>
<!-- 6-2.1 顶部导航栏分为左侧导航按钮和右侧用户下拉菜单，且均是flex布局 -->
  <div class="navbar">
    <!-- 6-2.2 左侧按钮，Expand图标组件 -->
    <div class="flex-box">
    <!-- 8-1.6 NavBar组件左侧导航按钮，点击触发handleCollapse切换折叠状态事件 -->
      <el-button @click="handleCollapse" type="primary">
        <el-icon><Expand /></el-icon>
      </el-button>
      <!-- 24-1.2 NavBar左侧导航标题，获取渲染当前路由信息的meta.title标题 -->
      <p class="page-title">{{ route.meta.title }}</p>
    </div>

    <div class="flex-box">
      <!-- 6-2.4 右侧下拉菜单组件el-dropdown，包含触发下拉的用户区及下拉菜单，触发下拉command事件 -->
      <el-dropdown @command="handleCommand">
        <!-- 6-2.6 触发下拉的用户区flex布局，包含用户头像、用户名及下拉图标 -->
        <div class="flex-box">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          <p class="user-name">用户名</p>
          <el-icon><ArrowDown /></el-icon>
        </div>

      <!-- 6-2.7 插槽下拉菜单内容选项el-dropdown-menu，下拉选项command -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
  </div>
</template>

<script setup>
// 8-1.5 NavBar引入后台管理仓库useAdminStore
import { useAdminStore } from '@/stores/admin'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { postuserLogoutAPI } from '@/api/admin'

// 24-1.1 NavBar引入使用useRouter路由,创建路由实例
const router = useRouter()
const route = useRoute()

const adminStore = useAdminStore()
// 8-1.7 切换折叠状态事件,调用toggleCollapse
const handleCollapse = () => {
  adminStore.toggleCollapse()
}

// 6-2.5 下拉菜单事件，处理对应菜单选项
const handleCommand = (command) => {
  if (command === 'logout') {
    // console.log('退出登录');
    // 24-1.4 点击退出登录，弹出确认框
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 24-1.4.1 确认退出登录,调用退出登录接口,清除本地token及userInfo
      postuserLogoutAPI().then(res => {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        // 24-1.4.2 清除信息后,提示退出成功,跳转登录页
        ElMessage.success('退出成功')
        router.push('/auth/login')  
      })
    })
  }

}


</script>

<style scoped lang="scss">
/* 6-2.3 navbar及左侧导航样式 */
.navbar{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;//两端对齐
  padding: 0 15px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e4e7ed; 
}
.flex-box {
    display: flex;
    align-items: center;
    .page-title {
        margin-left: 20px;
        font-size: 26px;
        font-weight: bold;
        color: #1f2937;
    }
    /* 6-2.8 用户名样式 */
    .user-name {
        margin: 0 5px;
        font-weight: bold;
    }
}
</style>
