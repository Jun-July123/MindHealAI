// 13-2.1 创建src/api/admin.js
// 13-2.2 引入service
import service from '@/utils/request'

// 13-2.3 配置导出登录接口
export const login = (data) => {
  return service({
    url: '/user/login',
    method: 'post',     
    data,
  })
}
// 14-1.2 src/api/admin.js配置导出知识文章分类树接口
export const categoryTree = () => {
  return service({
    url: '/knowledge/category/tree',
    method: 'get'
  })
}


// 15-1.1 src/api/admin.js配置导出知识文章列表接口
export const getKnowledgeArticlePageAPI = (params) => {
  return service({
    url: '/knowledge/article/page',
    method: 'get',
    params:params
  })
}

// 18-2.3.1 src/api/admin.js配置导出文件上传接口
// 18-2.3.2 接口接收的是formData格式数据,创建FormData对象,
// 将传入的文件和业务信息添加到formData中
export const uploadFile = (file,businessInfo) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessFile', 'cover')
  return service({
    url: '/file/upload',
    method: 'post',
    data: formData,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}


// 20-1.2.2 src/api/admin.js配置导出新增文章接口
export const postKnowledgeArticleAPI = (data) => {
  return service({
    url: '/knowledge/article',
    method: 'post',
    data,
  })
}

// src/api/admin.js配置导出编辑文章接口
export const putKnowledgeArticleByIdAPI = (id,data) => {
  return service({
    url: `/knowledge/article/${id}`,
    method: 'put',
    data,
  })
}

// 20-2.1 src/api/admin.js配置导出知识文章详情接口
export const getKnowledgeArticleByIdAPI= (id) => {
  return service({
    url: `/knowledge/article/${id}`,
    method: 'get',
  })
}

