/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  //获取当前模板
  getCurTemplate: params => {
    return API.GET('/api-admin/cms/getCurTemplate', params)
  },
  //根据版本号获取草稿箱模板或者已发布的模板
  getTemplate: params => {
    return API.GET('/api-admin/cms/getTemplate', params)
  },
  saveTemplate: params => {
    return API.POST('/api-admin/cms/saveTemplate', params)
  },
  upload: params => {
    return API.baseUrl('/api-admin/cms/upload', params)
  },
  // 获取商品列表
  queryGoodList: params => {
    return API.POST('/api-admin/cms/queryGoodList', params)
  },

  // app端
  //获取当前模板
  getAppCurTemplate: params => {
    return API.GET('/api-admin/appCms/getCurTemplate', params)
  },
  //获取版本发布列表
  getPublishVersionList: params => {
    return API.GET('/api-admin/appCms/getPublishVersionList', params)
  },
  //获取模板详情
  getAppTemplate: params => {
    return API.GET('/api-admin/appCms/getTemplate', params)
  },
  // 立即发布模板，只可是草稿状态
  publishNowTemplate: params => {
    return API.POST('/api-admin/appCms/publishNowTemplate', params)
  },
  // 保存模板
  saveAppTemplate: params => {
    return API.POST('/api-admin/appCms/saveTemplate', params)
  },
  // 删除模板
  delAppTemplate: params => {
    return API.POST('/api-admin/appCms/delTemplate', params)
  },
  // 获取一级列表
  getTopClass: params => {
    return API.GET('/api-mallcenter/dt/list', params)
  },
  // 获取商品状态
  getCommodityStatus: params => {
    return API.POST('/api-admin/cms/getCommodityStatus', params)
  },
}
