<!-- 4-1.1 侧边菜单栏组件结构 -->
<template>
  <!-- 8-1.13 菜单被折叠后，图标变形,取消过渡动画-->
  <el-aside :width="isCollapse ? '64px' : '264px'">
  <!-- 8-1.10 菜单添加collapse属性,绑定从useAdminStore获取的iscollapse状态 -->
  <!-- 8-1.12 菜单被折叠后，图标变形,取消过渡动画 -->
     <el-menu
        :collapse="isCollapse"
        :collapse-transition="false"
        default-active="2"
        class="menu-container"
        @open="handleOpen"
        @close="handleClose"
      >
      <!-- 5-1.1 设置侧边菜单栏标题区域logo及标题信息卡片 -->
      <div class="brand">
        <!-- 5-1.3 使用logo图片 -->
        <el-image class="brand-logo" :src="logoUrl" alt="logo"/>
        <!-- 8-1.11 侧边菜单栏标题区域根据iscollapse状态显示或隐藏 -->
        <div v-show="!isCollapse" class="info-card">
          <h1 class="brand-title">心愈智伴AI助手</h1>
          <span class="brand-subtitle">后台管理系统</span>
        </div>
      </div>
      <!-- 4-1.7 v-for循环渲染所有二级路由配置(配置key),path作为唯一标识index -->
      <!-- 6-1.1 菜单栏选择菜单，触发点击事件selectMenu,传递子路由路径 -->
        <el-menu-item 
          v-for="item in menuList" 
          :key="item.path" 
          :index="item.path"
          @click="selectMenu(item.path)">
          <!-- 4-1.10 动态组件is属性,根据meta-icon属性动态渲染图标组件 -->
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
      </el-menu>
  </el-aside>
</template>

<script setup>
// 8-1.8 Sidebar引入后台管理仓库useAdminStore
import { useAdminStore } from '@/stores/admin'
import {computed} from 'vue'
const adminStore = useAdminStore()

// 8-1.9 Sidebar获取useAdminStore仓库的iscollapse状态
const isCollapse = computed(() => adminStore.isCollapse)


// 5-1.2 引入logo图片
const iconL = new URL('@/assets/images/logo.png', import.meta.url)
const iconUrL = iconL.href
const logoUrl = new URL('@/assets/images/机器人.png', import.meta.url).href
// console.log(iconL);
// console.log(iconUrL);

// 4-1.5 引入创建路由实例
import { useRouter } from 'vue-router'
const router = useRouter()
// 4-1.6 从路由实例中获取所有二级路由配置
const menuList = router.options.routes[0].children
console.log(menuList);

// 4-1.2 定义菜单栏结构的默认事件处理函数open和close
const handleOpen = (key) => {
  // console.log(key);
}
const handleClose = (key) => {
  // console.log(key);
}
// 6-1.2 选择菜单事件selectMenu
const selectMenu = (key) => {
  // 6-1.2.1 从路由实例中获取当前路由路径
  const currentRoute = router.options.routes[0]
  console.log(`${currentRoute.path}/${key}`);
  // 6-1.2.2 路由实例跳转到选中的菜单路径
  router.push(`${currentRoute.path}/${key}`)
}


</script>

<style lang="scss" scoped>
// 5-1.4 侧边菜单栏样式
.menu-container{
  // 5-1.5.2 menu-container继承sidebar-container高度100%
  height: 100%;
/* 5-1.4 侧边菜单栏标题样式*/
// 5-1.4.1 侧边菜单栏标题样式:弹性布局，居中对齐，添加背景颜色和边框
  .brand{
    display: flex;//
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    background-color: #dbf3fe;
    border-bottom: 1px solid #e4e7ed;
    // 5-1.4.2 logo图片样式：宽、高、外边距
    .brand-logo{
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    // 5-1.4.3 信息卡片标题样式：字体大小、加粗、颜色
    .info-card{
      .brand-title{
        font-size: 20px;
        font-weight: bold;
        color: #0c0f16;
      }
      .brand-subtitle{
        font-size: 14px;
        color: #0c0f16;
      }
    }
  }
}
</style>


