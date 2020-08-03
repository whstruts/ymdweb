/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  //登录
  login: params => {
    return API.POST('/api-admin/login', params)
  },
  //登出
  logout: params => {
    return API.GET('/api-admin/logout', params)
  },
  //登录验证
  check: params => {
    return API.POST('/api-admin/check', params)
  },
  //获取验证图片
  getImg: params => {
    return API.baseUrl('/api-admin/imageCode')
  },
  getUserList: params => {
    return API.GET('/api-admin/user/list', params)
  },
  addUser: params => {
    return API.POST('/api-admin/user', params)
  },
  editUser: params => {
    return API.PUT('/api-admin/user', params)
  },
  removeUser: params => {
    return API.DELETE('/api-admin/user', params)
  },
  resetPwd: params => {
    return API.PUT('/api-admin/user/resetPwd', params)
  },
  // 修改密码
  upPwd: params => {
    return API.PUT('/api-usercenter/user/updatePassword', params)
  },
  // 获取配送设置信息
  getSysDistributionConf: params => {
    return API.GET('/api-usercenter/sysDistributionConf', params)
  },
  // 配送设置
  setSysDistributionConf: params => {
    return API.POST('/api-usercenter/sysDistributionConf', params)
  },
  // 获取城市列表
  getOneLayerSysArea: params => {
    return API.GET('/api-usercenter/partner/getOneLayerSysArea', params)
  },
  // 获取app版本列表
  appVersionList: params => {
    return API.GET('/api-admin/appVersion/list', params)
  },
  // 新增app版本
  addVersion: params => {
    return API.POST('/api-admin/appVersion/add', params)
  },
  uploadApp: params => {
    return API.baseUrl('/api-admin/appVersion/upload', params)
  },
  // 获取客服热线
  queryKf: params => {
    return API.GET('/api-admin/kefu/query', params)
  },
  // 更新客服热线
  updateKf: params => {
    return API.GET('/api-admin/kefu/update', params)
  },
  queryJwt: params => {
    return API.GET('/api-admin/base/default', params)
  },
}
