/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  userList: params => {
    return API.GET('/api-usercenter/price/userList', params)
  },
  commodityList: params => {
    return API.GET('/api-usercenter/price/commodityList', params)
  },
  list: params => {
    return API.POST('/api-usercenter/price/list', params)
  },
  // 获取报价设置
  getplatformPrice: params => {
    return API.POST('/api-usercenter/platformPrice/getList', params)
  },
  // 更改报价设置
  setValue: params => {
    return API.POST('/api-usercenter/platformPrice/setValue', params)
  },
  // 获取平台指定商品报价设置列表
  getConfigList: params => {
    return API.GET('/api-usercenter/price/configList', params)
  },
  // 添加指定商品
  addCommodity: params => {
    return API.POST('/api-usercenter/price/configList', params)
  },
  // 修改指定商品报价
  updateCommodityPrice: params => {
    return API.PUT('/api-usercenter/price/configList', params)
  },
  // 删除指定商品报价
  delCommodityPrice: params => {
    return API.DELETE('/api-usercenter/price/configList', params)
  },
}
