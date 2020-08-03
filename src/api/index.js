/**
 * Created by bootdo.
 */
import axios from 'axios'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {Message, Loading} from 'element-ui';

NProgress.configure({showSpinner: false}) // NProgress Configuration
axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
//  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//配置请求头
import {
  bus
} from '../bus.js'

// let loadingInstance = null;
//添加一个请求拦截器
axios.interceptors.request.use(
  config => {
    NProgress.start();
    /*    loadingInstance = Loading.service({
          lock: true,
          text: ' ',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
        });*/
    //请求头需要带token
    if (window.localStorage.getItem('access-token')) {
      config.headers.Authorization = window.localStorage.getItem('access-token');
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
);
// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  NProgress.done()
  // loadingInstance.close();
  if (response.data && response.data.code) {
    if (parseInt(response.data.code) === 402 || parseInt(response.data.code) === 401) {
      // 未登录
      Message.error(response.data.msg)
      bus.$emit('goto', '/login');
    } else if (parseInt(response.data.code) === 111) {
      return axios.request(response.config);
    }
  }
  return response;
}, function (error) {
  Message.error("网络请求失败！")
  // loadingInstance.close();
  NProgress.done();
  // Do something with response error
  return Promise.reject(error);
});


//基地址
let base = process.env.API_ROOT


//通用方法
export const POST = (url, params) => {
  return axios.post(`${base}${url}`, params).then(res => res.data)
}
export const uploadFile = (url,params) => {
  return axios.post(`${base}${url}`, params,{ headers:{'Content-Type':'Multipart/form-data'} }).then(res => res.data)
}
export const GET = (url, params) => {
  return axios.get(`${base}${url}`, {
    params: params
  }).then(res => res.data)
}
export const PUT = (url, params) => {
  return axios.put(`${base}${url}`, params).then(res => res.data)
}

//不支持传数组的支持传数组的
export const DELETE = (url, params) => {
  return axios.delete(`${base}${url}`, {
    data: params
  }).then(res => res.data)
}
/*//支持传数组的
export const DELETE2 = (url, params) => {
  return axios.delete(`${base}${url}`, {
    data: params
  }).then(res => res.data)
}*/
export const PATCH = (url, params) => {
  return axios.patch(`${base}${url}`, params).then(res => res.data)
}

export const baseUrl = (url) => {
  return `${base}${url}`;
}
