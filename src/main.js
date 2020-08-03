// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import 'es6-promise/auto'
import ElementUI, {Message} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/style/index.scss';
import "./assets/fonts/iconfont.css"
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import Util from "./utils/index"

import VueQuillEditer from 'vue-quill-editor'

Vue.use(VueQuillEditer)
import './assets/style/common.scss'
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Vue.prototype.$utils = Util;
Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.config.productionTip = false;

// 为了实现Class的私有属性
const showMessage = Symbol('showMessage')

/**
 *  重写ElementUI的Message
 *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
 */
class DonMessage {
  success(options, single = true) {
    this[showMessage]('success', options, single)
  }

  warning(options, single = true) {
    this[showMessage]('warning', options, single)
  }

  info(options, single = true) {
    this[showMessage]('info', options, single)
  }

  error(options, single = true) {
    this[showMessage]('error', options, single)
  }

  [showMessage](type, options, single) {
    if (single) {
      // 判断是否已存在Message
      if (document.getElementsByClassName('el-message').length === 0) {
        Message[type](options)
      }
    } else {
      Message[type](options)
    }
  }
}

Vue.use(ElementUI);
Vue.prototype.$message = new DonMessage()

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/line'


require('echarts/map/js/china')

require('echarts/lib/chart/effectScatter') // 拐点出闪烁，高亮
require('echarts/lib/component/tooltip') // 提示组件
require('echarts/lib/component/legend') // 图例组件
require('echarts/lib/component/markPoint') // 标注组件
Vue.component('chart', ECharts)
import htmlToPdf from './utils/htmlToPdf'

Vue.use(htmlToPdf)
/* eslint-disable no-new */
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  next()
});
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    window.location.reload();
    // router.replace(router.history.pending.fullPath);
  } else {
    console.log(error)
  }
});
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
