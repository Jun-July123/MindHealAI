// 13-1.1 下载axios,npm install axios
// 13-1.2 创建src/utils/request.js,引入axios
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 13-1.3  创建axios实例service
const service = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 13-1.4 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 发送请求前添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
     console.log('最终请求头', config.headers)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 13-1.5 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, config } = response
    // 业务码 200：正常返回数据，不弹错误提示
    if (data.code == 200) {
      return data.data
    }
    // 登录过期 code = -1
    else if (data.code == -1) {
      if (!config.url?.includes('/login')) {
        ElMessage.error(data.message || '登录过期，请重新登录')
      }
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/auth/login'
      return Promise.reject(data)
    }
    // 其他业务错误码
    else {
      ElMessage.error(data.message || '网络请求失败')
      return Promise.reject(data)
    }
  },
  // 服务器/网络级错误（404、500、跨域、超时）
  (error) => {
    ElMessage.error('服务器异常或网络超时，请稍后重试')
    return Promise.reject(error)
  }
)

// 13-1.9 向外暴露service
export default service