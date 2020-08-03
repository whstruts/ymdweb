/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  //供应商列表
  supplierList: params => {
    return API.GET('/api-usercenter/supplier/list', params)
  },
  //新增供应商
  addSupplier: params => {
    return API.POST('/api-usercenter/supplier', params)
  },
  //禁用供应商
  forbiddenSupplier: params => {
    return API.PUT('/api-usercenter/supplier/forbidden', params)
  },
  //启用供应商
  startSupplier: params => {
    return API.PUT('/api-usercenter/supplier/start', params)
  },
  //删除供应商
  deleteSupplier: params => {
    return API.DELETE('/api-usercenter/supplier', params)
  },
  //修改供应商信息
  editSupplier: params => {
    return API.PUT('/api-usercenter/supplier', params)
  },
  //重置供应商密码
  resetPwd: params => {
    return API.PUT('/api-usercenter/supplier/restPwd', params)
  },
}
