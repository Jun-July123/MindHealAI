import service from '@/utils/request'

// 25-4.1 api/user.js配置导出注册用户接口，接收表单参数
export const postUserAddAPI = (data) => {
  return service({
    url: '/user/add',
    method: 'post',
    data
  })
}

// 26-3.1 api/user.js配置导出创建新会话接口，接收用户输入的信息，会话标题
export const postSessionStartAPI = (data) => {
  return service({
    url: '/psychological-chat/session/start',
    method: 'post',
    data
  })
}

// 26-4.1 api/user.js配置导出获取会话列表接口，接收当前页码和每页数量
export const getSessionListAPI = (params) => {
  return service({
    url: '/psychological-chat/sessions',
    method: 'get',
    params
  })
}
