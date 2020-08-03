/**
 * Created by lyy.
 * 用户相关api
 */
import * as API from '.'

export default {
  dashboard: params => {
    return API.GET('/api-admin/base/dashboard', params)
  },
}
