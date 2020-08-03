/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  spuList: params => {
    return API.GET('/api-mallcenter/da/spu/list', params)
  },
  getSpuInfo: params => {
    return API.GET('/api-mallcenter/da/spu', params)
  },
  getSkuInfo: params => {
    return API.GET('/api-mallcenter/da/sku', params)
  },

  initDataNum: params => {
    return API.GET('/api-mallcenter/da/index', params)
  },
}
