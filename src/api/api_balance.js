/**
 * Created by lyy.
 * 用户相关api
 */
import * as API from './'

export default {
  balanceList: params => {
    return API.GET('/api-admin-order/order/balanceList', params)
  },
}
