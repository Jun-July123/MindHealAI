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

// 26-5.1 api/user.js配置导出删除会话接口，接收会话id
export const deleteSessionAPI = (sessionId) => {
  return service({
    url: `/psychological-chat/sessions/${sessionId}`,
    method: 'delete',
  })
}

// 26-5.4 api/user.js配置导出获取会话的消息记录接口，接收会话id
export const getSessionMessagesAPI = (sessionId) => {
  return service({
    url: `/psychological-chat/sessions/${sessionId}/messages`,
    method: 'get',
  })
}

// 27-3.1 api/user.js配置导出获取会话情绪接口，接收会话id
export const getSessionEmotionAPI = (sessionId) => {
  return service({
    url: `/psychological-chat/session/${sessionId}/emotion`,
    method: 'get',
  })
}

// 28-2.6 api/user.js配置导出提交情绪日志接口，接收用户输入的表单信息
export const postEmotionDiaryAPI = (data) => {
  return service({
    url: '/emotion-diary',
    method: 'post',
    data
  })
}

// 29-1.1 api/user.js配置导出获取知识列表接口，接收查询参数
export const getKnowledgeListAPI = (params) => {
  return service({
    url: '/knowledge/article/page',
    method: 'get',
    params
  })
}

