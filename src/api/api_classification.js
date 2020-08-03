/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  listAll: params => {
    return API.GET('/api-mallcenter/dt/listAll', params)
  },
  add: params => {
    return API.POST('/api-mallcenter/dt', params)
  },
  edit: params => {
    return API.PUT('/api-mallcenter/dt', params)
  },
  delete: params => {
    return API.DELETE('/api-mallcenter/dt', params)
  },
  upDrugTypeSort: params => {
    return API.POST('/api-mallcenter/dt/upDrugTypeSort', params)
  },
}
