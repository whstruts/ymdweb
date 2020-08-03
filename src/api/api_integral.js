/**
 * Created by lyy.
 * 用户相关api
 */
import * as API from './'

export default {
  //获取可选择的年
  listReportYear: params => {
    return API.GET('/api-admin-order/integralManagement/listReportYear', params)
  },
  //获取可选择的月
  listReportMonth: params => {
    return API.GET('/api-admin-order/integralManagement/listReportMonth', params)
  },
  //获取积分列表
  listReportPartner: params => {
    return API.GET('/api-admin-order/integralManagement/listReportPartner', params)
  },
  //获取当前时间
  nowTime: params => {
    return API.GET('/api-admin-order/integralManagement/nowTime', params)
  },
  //合伙人积分结算
  account: params => {
    return API.POST('/api-admin-order/integralManagement/account', params)
  },
}
