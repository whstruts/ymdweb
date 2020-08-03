/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  list: params => {
    return API.GET('/api-mallcenter/commodityStoreManage/commodityData', params)
  },
  // 上架
  shelve: params => {
    return API.PUT('/api-mallcenter/commodityStoreManage/shelve', params)
  },
  //下架
  unshelve: params => {
    return API.PUT('/api-mallcenter/commodityStoreManage/unshelve', params)
  },

  initDataNum: params => {
    return API.GET('/api-mallcenter/commodityStoreManage/index', params)
  },

  // 上架供应商
  shelfSupplier: params => {
    return API.GET('/api-mallcenter/commodityStoreManage/shelfSupplier', params)
  },
  //
}
