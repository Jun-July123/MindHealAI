// 8-1.3 创建src/stores/admin.js后台管理仓库，引入defineStore函数
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 8-1.4 定义后台管理仓库
// 8-1.4.4 向外暴露后台管理仓库实例
export const useAdminStore = defineStore('admin', () => {
  // 8-1.4.1 定义折叠状态isCollapse,默认false不折叠
  const isCollapse = ref(false)
  // 8-1.4.2 定义切换折叠状态函数toggleCollapse
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  // 8-1.4.3 返回isCollapse和toggleCollapse，供外面文件使用
  return {
    isCollapse,
    toggleCollapse,
  }
})
