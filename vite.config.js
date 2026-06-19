import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],

    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 13-2.7 vite.config.js配置代理，解决跨域问题
  server:{
    proxy:{
      '/api':{
        target:'http://159.75.169.224:1235',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api/,'/api')
      }
    }
  }
})
