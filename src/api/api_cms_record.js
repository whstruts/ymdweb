/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  getPublishVersionList: params => {
    return API.GET('/api-admin/cms/getPublishVersionList', params)
  },
  delTemplate: params => {
    return API.POST('/api-admin/cms/delTemplate', params)
  },
  publishNowTemplate: params => {
    return API.POST('/api-admin/cms/publishNowTemplate', params)
  },

}
