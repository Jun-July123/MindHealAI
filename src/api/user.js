import service from '@/utils/request'

// 25-4.1 api/user.js配置导出注册用户接口，接收表单参数
export const postUserAddAPI = (data) => {
  return service({
    url: '/user/add',
    method: 'post',
    data
  })
}
