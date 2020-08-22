/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  addTemporaryCommodity: params => {
    return API.POST('/api-mallcenter/commodityPurchaseManage/addTemporaryCommodity', params)
  },
  batchRemove: params => {
    return API.DELETE('/api-mallcenter/commodityPurchaseManage/batchRemove', params)
  },
  cancelAdd: params => {
    return API.DELETE('/api-mallcenter/commodityPurchaseManage/cancelAdd', params)
  },
  chooseAbleCommodityList: params => {
    return API.GET('/api-mallcenter/commodityPurchaseManage/chooseAbleCommodityList', params)
  },
  getAddTemporaryId: params => {
    return API.GET('/api-mallcenter/commodityPurchaseManage/getAddTemporaryId', params)
  },
  list: params => {
    return API.GET('/api-mallcenter/commodityPurchaseManage/list', params)
  },
  saveTemporary: params => {
    return API.PUT('/api-mallcenter/commodityPurchaseManage/saveTemporary', params)
  },
  selectAddTemporaryList: params => {
    return API.GET('/api-mallcenter/commodityPurchaseManage/selectAddTemporaryList', params)
  },
  update: params => {
    return API.PUT('/api-mallcenter/commodityPurchaseManage/update', params)
  },
}
