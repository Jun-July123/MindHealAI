<!-- 2-1.8 设置后台一级路由内容 -->
<template>
  <!-- 3-1.1 后台结构 -->
  <div class="backend-layout">
    <!-- 5-1.5 侧边菜单栏高度100% -->
    <el-container class="main-container">
    <!-- 3-1.4 侧边菜单栏,顶部导航栏单独封装成组件，引入使用组件 -->
      <Sidebar></Sidebar>
      <!-- <el-aside width="200px">Aside</el-aside> -->
      <el-container>
        <el-header>
          <NavBar></NavBar>
        </el-header>
        <!-- <el-header>Header</el-header> -->
        <el-main class="main-content">
          <!-- 3-1.6 后台二级路由出口 -->
          <!-- 7-1.1 内容区域content-container -->
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
// 3-1.4 引入侧边菜单栏组件
import Sidebar from '@/components/Sidebar.vue'
import NavBar from '@/components/NavBar.vue'
</script>

<style lang="scss" scoped>
/* 3-1.3 后台页面占满全屏 */
.backend-layout{
  height: 100vh;
  // 7-2.9 设置el-header高度为74px
  // （el-header组件有默认高度，覆盖默认高度）
  .el-header{
    height: 74px !important;
  }
  // 5-1.5.1 main-container继承backend-layout高度100%
  .main-container{
    height: 100%;
    .content-container{
      padding: 20px;
      background-color: #fff;
      min-height: calc(100% - 74px);
    }
  }
}
</style>