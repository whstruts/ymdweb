import * as API from './'

export default {
  //药头条发布
  newspublish: params => {
    return API.POST('/api-admin/headline', params)
  },
  //药头条列表
  newslist: params => {
    return API.POST('/api-admin/headline/list', params)
  },
  //药头条删除
  newsdelete: params => {
    return API.DELETE('/api-admin/headline', params)
  },
  //药头条删除
  newsmodify: params => {
    return API.PUT('/api-admin/headline', params)
  }
}