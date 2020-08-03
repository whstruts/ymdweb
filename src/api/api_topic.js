/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  //获取专题页列表
  getActivityList: params => {
    return API.GET('/api-admin/activity/listByPage', params)
  },
  // 新增专题页
  addActivity: params => {
    return API.POST('/api-admin/activity/addActivity', params)
  },
  // 修改专题页
  updateActivity: params => {
    return API.POST('/api-admin/activity/updateActivity', params)
  },
  // 删除专题页
  deleteActivity: params => {
    return API.GET('/api-admin/activity/deleteActivity', params)
  },
  // 获取专题页详情
  getActivity: params => {
    return API.GET('/api-admin/activity/getActivity', params)
  },
  // 启用禁用
  updateDisableStatus: params => {
    return API.GET('/api-admin/activity/updateDisableStatus', params)
  },
  // 搜索商品
  queryActivityGoodList: params => {
    return API.POST('/api-admin/activity/queryActivityGoodList', params)
  },
}
