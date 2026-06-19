<template>
  <!-- 12-1.2 Auth包含左右两个部分 -->
  <div class="auth-layout">
    <!-- 12-1.3 左侧包含标题、文本和图标 -->
    <div class="left-section">
      <div class="content">
        <h2 class="title">心理健康AI助手</h2>
        <p class="text">登录后即可开始使用心理健康AI助手</p>
        <div class="robot">
          <el-image :src="iconUrl" style="width: 90px; height: 90px;" alt="心理健康AI助手"></el-image>
        </div>
      </div>
    </div>
    <!-- 12-1.5 右侧登录注册路由出口 -->
    <div class="right-section">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
// 12-1.4 new URL导入图片
const iconUrl = new URL('@/assets/images/robot-FILL.png', import.meta.url).href
</script>

<!-- 12-1.6 Auth样式 -->
<style lang="scss" scoped>
.auth-layout {
    display: flex;
    .left-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        background: linear-gradient(90deg, rgb(74, 156, 140) 0%, rgb(61, 138, 122) 100%) rgba(74, 156, 140, 0.95);
        height: 100vh;
        .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .title {
                margin-bottom: 20px;
                font-size: 40px;
                font-weight: bold;
                color: #fff;
            }
            .text {
                margin-bottom: 20px;
                width: 460px;
                font-size: 20px;
                color: #fff;
                text-align: center;
            }
            .robot {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 160px;
                height: 160px;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.2);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1),inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }
        }
    }
    .right-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 100vh;
        background-color: #fff;
    }
}
</style>