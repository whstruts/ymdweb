/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  list: params => {
    return API.POST('/api-usercenter/partner/list', params)
  },
  getSysArea: params => {
    return API.GET('/api-usercenter/partner/getSysAreaTree', params)
  },
  getSysAreaTreeByPartnerId: params => {
    return API.GET('/api-usercenter/partner/getSysAreaTreeByPartnerId', params)
  },
  //查询商品列表
  queryCommodityList: params => {
    return API.GET('/api-usercenter/partner/queryCommodityList', params)
  },
  //新增和合作人
  add: params => {
    return API.POST('/api-usercenter/partner', params)
  },
  //删除合伙人
  deleteUser: params => {
    return API.DELETE('/api-usercenter/partner', params)
  },
  /*  //按价格类型加价
    quoteFromPriceType: params => {
      return API.PUT('/api-usercenter/partner/quoteFromPriceType', params)
    },*/
  /*  //查询商品加价列表
    queryCommodityPriceList: params => {
      return API.GET('/api-usercenter/partner/queryCommodityPriceList', params)
    },*/

  //按商品加价
  quoteFromCommodity: params => {
    return API.PUT('/api-usercenter/partner/quoteFromCommodity', params)
  },
  //修改合伙人状态 。。禁用/启用
  updateStatus: params => {
    return API.PUT('/api-usercenter/partner/updateStatus', params)
  },
  //新建用户选择黑、白名单数据列表
  getCommodityTempData: params => {
    return API.GET('/api-usercenter/partner/getCommodityTempData', params)
  },
  //新增商品权限临时数据
  addCommodityTempData: params => {
    return API.POST('/api-usercenter/partner/addCommodityTempData', params)
  },
  //删除选择的商品
  delCommodityTempData: params => {
    return API.DELETE('/api-usercenter/partner/delCommodityTempData', params)
  },
  //保存选择的商品
  saveCommodityTempOperation: params => {
    return API.PUT('/api-usercenter/partner/saveCommodityTempOperation', params)
  },
  //取消保存
  cancelCommodityTempOperation: params => {
    return API.PUT('/api-usercenter/partner/cancelCommodityTempOperation', params)
  },

  //获取合伙人根据价格类型加价
  getPrice: params => {
    return API.GET('/api-usercenter/partner/price', params)
  },
  //获取合伙人根据商品加价列表
  commodityList: params => {
    return API.GET('/api-usercenter/partner/price/commodityList', params)
  },
  //预保存商品加价信息
  beforehand: params => {
    return API.PUT('/api-usercenter/partner/price/beforehand', params)
  },
  //查询合伙人可见商品列表
  queryPartnerCommodityList: params => {
    return API.GET('/api-usercenter/partner/price/list', params)
  },
  //商品加价中的添加商品
  chooseCommodity: params => {
    return API.POST('/api-usercenter/partner/price/chooseCommodity', params)
  },
  //商品加价中的删除商品
  deleteCommodity: params => {
    return API.DELETE('/api-usercenter/partner/price/chooseCommodity', params)
  },
  //保存商品加价信息
  saveCommodity: params => {
    return API.PUT('/api-usercenter/partner/price', params)
  },

  //重置合伙人密码
  resetPassword: params => {
    return API.PUT('/api-usercenter/partner/resetPassword', params)
  },
  //删除合伙人
  deleteSuppliser: params => {
    return API.DELETE('/api-usercenter/partner', params)
  },
  //修改合伙人
  editPartner: params => {
    return API.PUT('/api-usercenter/partner', params)
  },

  //选择商品中供应商
  upCommodityTempData: params => {
    return API.PUT('/api-usercenter/partner/upCommodityTempData', params)
  },
  //加价中选择商品中供应商
  upPriceTempData: params => {
    return API.PUT('/api-usercenter/partner/price/upPriceTempData', params)
  },
  //编辑用户时获取用户共选择了多少件商品和供应商
  getCommodityAndParterNum: params => {
    return API.GET('/api-usercenter/partner/edit', params)
  },
}
