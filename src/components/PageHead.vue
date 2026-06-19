<!-- 7-2.1 封装页面头部组件PageHead -->
<template>
  <!-- 7-2.2 PageHead包含左侧页面标题和右侧操作按钮 -->
  <div class="page-head">
    <!-- 7-2.3 左侧页面标题 -->
    <p class="page-title">{{ title }}</p>
    <!-- 7-2.4 右侧操作按钮，通过slot具名插槽buttons传递 -->
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup>
// 7-2.7 定义props属性，PageHead接收使用knowledge组件的title参数
const props = defineProps({
  title: {
    type: String,
    default: '页面标题'
  }
})
</script>

<style lang="scss" scoped>
/* 7-2.8 页面标题组件样式 */
.page-head{
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .page-title{
    font-size: 20px;
    font-weight: bold;
  }
}
</style>  
