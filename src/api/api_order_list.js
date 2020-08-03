/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  list: params => {
    return API.GET('/api-admin-order/order/list', params)
  },
  //订单详情
  commodityList: params => {
    return API.GET('/api-admin-order/order/commodityList', params)
  },
  //取消订单
  cancel: params => {
    return API.POST('/api-admin-order/order/cancel', params)
  },
  //提醒客户支付
  remindPay: params => {
    console.log(params)
    return API.POST('/api-admin-order/order/remindPay', params)
  },
  //开单
  billing: params => {
    return API.POST('/api-admin-order/order/billing', params)
  },
  //开单完成
  billingOK: params => {
    return API.POST('/api-admin-order/order/billingOK', params)
  },
  //配送完成
  delivery: params => {
    return API.POST('/api-admin-order/order/delivery', params)
  },
  //备货完成
  pick: params => {
    return API.POST('/api-admin-order/order/pick', params)
  },
  //打印订单
  print: params => {
    return API.GET('/api-admin-order/order/print', params)
  },

  //根据快递单号，获取快递信息
  autonumber: params => {
    return API.GET('/api-admin-order/order/autonumber', params)
  },
  //上传物流单号
  uploadExp: params => {
    return API.POST('/api-admin-order/order/uploadExp', params)
  },

//获取物流信息
  expInfo: params => {
    return API.GET('/api-admin-order/order/expInfo', params)
  },
  //获取订单流转记录
  history: params => {
    return API.GET('/api-admin-order/order/history', params)
  },
  //上传电子发票
  uploadInvoiceFile: params => {
    return API.uploadFile('/api-admin-order/order/uploadInvoiceFile', params)
  },
  //保存发票信息
  saveOrderInvoice: params => {
    return API.POST('/api-admin-order/order/saveOrderInvoice', params)
  },
  //删除发票信息
  deleteInvoice: params => {
    return API.DELETE('/api-admin-order/order/invoice', params)
  },
  //追加备注
  additionalRemarks: params => {
    return API.PUT('/api-admin-order/order/additionalRemarks', params)
  },
  //获取退货/退款数据
  orderReturn: params => {
    return API.GET('/api-admin-order/order/orderReturn', params)
  },
  //确认退货退款
  orderReturnsAndRefunds: params => {
    return API.PUT('/api-admin-order/order/orderReturnsAndRefunds', params)
  },
  //编辑物流单号
  updateExpNo: params => {
    return API.PUT('/api-admin-order/order/updateExpNo', params)
  },
  //恢复订单
  timeOutOrderAgainPay: params => {
    return API.PUT('/api-admin-order/order/timeOutOrderAgainPay', params)
  },
  getOrderTotal: params => {
    return API.GET('/api-admin-order/order/total', params)
  },
}
