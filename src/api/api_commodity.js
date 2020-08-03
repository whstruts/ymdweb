/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  upload: params => {
    return API.baseUrl('/api-admin/file/upload', params)
  },
  uploadCommodity: params => {
    return API.PUT('/api-mallcenter/drugManager/sku', params)
  },
  saveCommodity: params => {
    return API.POST('/api-mallcenter/drugManager/sku', params)
  },
  audit: params => {
    return API.PUT('/api-mallcenter/da/sku/audit', params)
  },
  refuse: params => {
    return API.PUT('/api-mallcenter/da/sku/refuse', params)
  },
}
