/**
 * Created by lyy.
 * 用户相关api
 */
import * as API from './'

export default {
  //获取用户列表
  getList: params => {
    return API.GET('/api-usercenter/customer/list', params)
  },
  //重置密码
  resetPwd: params => {
    return API.POST('/api-usercenter/customer/resetPwd', params)
  },
  //禁用用户
  userDisabled: params => {
    return API.POST('/api-usercenter/customer/disabled', params)
  },
  //启用用户
  userEnabled: params => {
    return API.POST('/api-usercenter/customer/enabled', params)
  },
  //获取用户详情
  getInfo: params => {
    return API.POST('/api-usercenter/customer/getInfo', params)
  },
  // 获取用户类型
  getCustomerType: params => {
    return API.GET('/api-usercenter/customer/getCustomerType', params)
  },
  // 获取省市区
  getSysAreaTree: params => {
    return API.GET('/api-usercenter/partner/getSysAreaTree', params)
  },
  // 查合伙人
  getPartner: params => {
    return API.POST('/api-usercenter/customer/partner/list', params)
  },
  // 审核用户
  verifyUser: params => {
    return API.POST('/api-usercenter/customer/verifyUser', params)
  },
  // 获取用户更改记录
  getCustomerTypeChangeLog: params => {
    return API.GET('/api-usercenter/customer/getCustomerTypeChangeLog', params)
  },
  // 用户余额明细
  balanceList: params => {
    return API.GET('/api-usercenter/balance/list', params)
  },
  // 订单列表
  balanceOrderList: params => {
    return API.GET('/api-admin-order/order/balanceOrderList', params)
  },
  // 新增记账
  upUserBlance: params => {
    return API.POST('/api-usercenter/balance/upUserBlance', params)
  },
  //查询合伙人列表
  partnerlistByArea: params => {
    return API.GET('/api-usercenter/partner/listByArea', params)
  },
  // 获取用户证件信息
  getQualificationInfo: params => {
    return API.POST('/api-usercenter/customer/getQualificationInfo', params)
  },
  // 基本信息修改
  basicInfoUpdate: params => {
    return API.POST('/api-usercenter/customer/basicInfoUpdate', params)
  },
  // 检索用户征信代码
  checkTaxNumber: params => {
    return API.POST('/api-usercenter/customer/checkTaxNumber', params)
  },
}
