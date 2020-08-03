/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  upload: params => {
    return API.baseUrl('/api-admin/file/upload', params)
  },
  uploadProduct: params => {
    return API.PUT('/api-mallcenter/drugManager/spu', params)
  },
  saveProduct: params => {
    return API.POST('/api-mallcenter/drugManager/spu', params)
  },
  dtList: params => {
    return API.GET('/api-mallcenter/dt/listAll', params)
  },
  audit: params => {
    return API.PUT('/api-mallcenter/da/spu/audit', params)
  },
  refuse: params => {
    return API.PUT('/api-mallcenter/da/spu/refuse', params)
  },
  drugDosageTypeList: params => {
    return API.GET('/api-mallcenter/commodityStoreManage/drugDosageTypeList', params)
  },
}
