/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  ottOrderList: params => {
    return API.GET('/api-admin-order/order/ottOrderList', params)
  },
  //审核通过
  ottAuditApprove: params => {
    return API.PUT('/api-admin-order/order/ottAuditApprove', params)
  },
  //审核拒绝
  ottAuditRefuse: params => {
    return API.PUT('/api-admin-order/order/ottAuditRefuse', params)
  },

}
