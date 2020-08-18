/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  addTemporaryCommodity: params => {
    return API.POST('/api-mallcenter/CommodityPurchaseManage/addTemporaryCommodity', params)
  },
  batchRemove: params => {
    return API.DELETE('/api-mallcenter/CommodityPurchaseManage/batchRemove', params)
  },
  cancelAdd: params => {
    return API.DELETE('/api-mallcenter/CommodityPurchaseManage/cancelAdd', params)
  },
  chooseAbleCommodityList: params => {
    return API.GET('/api-mallcenter/CommodityPurchaseManage/chooseAbleCommodityList', params)
  },
  getAddTemporaryId: params => {
    return API.GET('/api-mallcenter/commodityPurchaseManage/getAddTemporaryId', params)
  },
  list: params => {
    return API.GET('/api-mallcenter/commodityPurchaseManage/list', params)
  },
  saveTemporary: params => {
    return API.PUT('/api-mallcenter/CommodityPurchaseManage/saveTemporary', params)
  },
  selectAddTemporaryList: params => {
    return API.GET('/api-mallcenter/CommodityPurchaseManage/selectAddTemporaryList', params)
  },
  update: params => {
    return API.POST('/api-mallcenter/commodityPurchaseManage/update', params)
  },
}
