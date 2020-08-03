/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  spuList: params => {
    return API.GET('/api-mallcenter/drugManager/spu/list', params)
  },
  drugSkuList: params => {
    return API.GET('/api-mallcenter/drugManager/drugSkuList', params)
  },
  spuInfo: params => {
    return API.GET('/api-mallcenter/drugManager/spu', params)
  },
  delete: params => {
    return API.DELETE('/api-mallcenter/drugManager/spu', params)
  },
  skuInfo: params => {
    return API.GET('/api-mallcenter/drugManager/sku', params)
  },
  deleteCommodity: params => {
    return API.DELETE('/api-mallcenter/drugManager/sku', params)
  },

}
