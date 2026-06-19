import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 2-1.7 main.js引入挂载路由实例
import router from './router'
// 4-1.8 main.js下载引入elment-plus图标组件库
//  npm install @element-plus/icons-vue
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 8-1.1 main.js下载引入pinia
//  npm install pinia
import { createPinia } from 'pinia'

// 8-1.2 创建挂载pinia实例
const pinia = createPinia()

const app = createApp(App)
app.use(pinia)

app.use(ElementPlus)
app.use(router)
app.mount('#app')
// 4-1.9 main.js注册所有图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


