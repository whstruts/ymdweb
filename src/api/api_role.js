/**
 * Created by bootdo.
 * 角色相关api
 */
import * as API from './'

export default {

  //查询获取role列表(通过page分页)
  findList: params => {
    return API.GET('/api-admin/role/list', params)
  },

  //查询获取一条role信息
  findById: id => {
    return API.GET(`/api-admin/role/userRoles`,id)
  },

  add: params => {
    return API.POST(`/api-admin/role`, params)
  },
  update: (params) => {
    return API.PUT('/api-admin/role', params)
  },
  //单个删除role
  remove: params => {
    return API.DELETE(`/api-admin/role`, params)
  },


}
