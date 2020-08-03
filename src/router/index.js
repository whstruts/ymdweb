import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/',
        name: 'login',
        component: resolve => require(['@/components/login'], resolve),
        meta: {
          title: '登录',
        }
      },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/components/login'], resolve),
      meta: {
        title: '登录',
      }
    },
    //cms 预览
    {
      path: '/preview',
      name: "preview",
      component: resolve => require(['@/components/cms/pc/preview'], resolve),
      meta: {
        title: '预览',
        noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        breadcrumb: false, // 如果设置为false，则不会在breadcrumb面包屑中显示
        affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
      }
    },
    {
      path: '/appPreview',
      name: "appPreview",
      component: resolve => require(['@/components/cms/app/preview'], resolve),
      meta: {
        title: 'APP预览',
        noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        breadcrumb: false, // 如果设置为false，则不会在breadcrumb面包屑中显示
        affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
      }
    },
    {
      path: '/topicView',
      name: "topicView",
      component: resolve => require(['@/components/cms/topicManage/topicView'], resolve),
      meta: {
        title: '专题页预览',
        noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        breadcrumb: false, // 如果设置为false，则不会在breadcrumb面包屑中显示
        affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
      }
    },
    {
      path: '/',
      name: 'home',
      component: resolve => require(['@/components/home'], resolve),
      meta: {
        title: '首页',
      },
      children: [
        //菜单管理
        {
          path: 'menu',
          name: "menus", //name必须和vue里的nama，不然<keep-alive> 缓存不起作用
          component: resolve => require(['@/components/system/menu'], resolve),
          meta: {
            title: '菜单管理',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        //用户管理
        {
          path: 'user',
          name: "user",
          component: resolve => require(['@/components/system/user'], resolve),
          meta: {
            title: '用户管理',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        //角色管理
        {
          path: 'role',
          name: "role",
          component: resolve => require(['@/components/system/role'], resolve),
          meta: {
            title: '角色管理',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        //首页看板
        {
          path: 'board',
          name: "homeBoard",
          component: resolve => require(['@/components/homeBoard'], resolve),
          meta: {
            title: '首页看板',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: true,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        //商品管理
        {
          path: 'maintenance',
          name: "maintenance",
          component: resolve => require(['@/components/commodity/backstage/maintenance'], resolve),
          meta: {
            title: '产品维护',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'classification',
          name: "classification",
          component: resolve => require(['@/components/commodity/backstage/classification'], resolve),
          meta: {
            title: '产品分类',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'review',
          name: "review",
          component: resolve => require(['@/components/commodity/backstage/review'], resolve),
          meta: {
            title: '产品更新/审核',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'centralLibrary',
          name: "centralLibrary",
          component: resolve => require(['@/components/commodity/centralLibrary/centralLibrary'], resolve),
          meta: {
            title: '商品中心库',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'shelfSupplier',
          name: "shelfSupplier",
          component: resolve => require(['@/components/commodity/centralLibrary/shelfSupplier'], resolve),
          meta: {
            title: '上架供应商',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'allCommodity',
          name: "allCommodity",
          component: resolve => require(['@/components/commodity/centralLibrary/allCommodity'], resolve),
          meta: {
            title: '所有商品',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        //cms 首页配置
        {
          path: 'cms/homeSetting',
          name: "homeSetting",
          component: resolve => require(['@/components/cms/pc/homeSetting'], resolve),
          meta: {
            title: '首页配置',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        //cms 发布记录
        {
          path: 'cms/release',
          name: "releaseRecord",
          component: resolve => require(['@/components/cms/releaseRecord'], resolve),
          meta: {
            title: '发布记录',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        //cms 草稿记录
        {
          path: 'cms/draft',
          name: "draftRecord",
          component: resolve => require(['@/components/cms/draftRecord'], resolve),
          meta: {
            title: '草稿记录',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'cms/news',
          name: "news",
          component: resolve => require(['@/components/cms/news/publish'], resolve),
          meta: {
            title: '药头条发布',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'providerManage',
          name: "providerManage",
          component: resolve => require(['@/components/providerUser/providerManage'], resolve),
          meta: {
            title: '供应商管理',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'partnerManage',
          name: "partnerManage",
          component: resolve => require(['@/components/providerUser/partnerManage'], resolve),
          meta: {
            title: '合伙人管理',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'orderList',
          name: "orderList",
          component: resolve => require(['@/components/order/orderList'], resolve),
          meta: {
            title: '订单列表',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'ottOrderList',
          name: "ottOrderList",
          component: resolve => require(['@/components/order/ottOrderList'], resolve),
          meta: {
            title: '线下电汇',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'customerManage',
          name: "customerManage",
          component: resolve => require(['@/components/providerUser/customerMng/customerManage'], resolve),
          meta: {
            title: '买家管理',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        {
          path: 'editCustomer',
          name: "editCustomer",
          component: resolve => require(['@/components/providerUser/customerMng/editCustomer'], resolve),
          meta: {
            title: '编辑买家',
            noCache: true,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        //cms app首页配置
        {
          path: 'cms/app/homeSetting',
          name: "appHomeSetting",
          component: resolve => require(['@/components/cms/app/homeSetting'], resolve),
          meta: {
            title: '首页配置',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        // 专题页配置
        {
          path: 'cms/topicManage',
          name: "topicManage",
          component: resolve => require(['@/components/cms/topicManage/topicManage'], resolve),
          meta: {
            title: '专题页配置',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        //报价查询
        {
          path: 'quote',
          name: "quote",
          component: resolve => require(['@/components/quote/quote'], resolve),
          meta: {
            title: '报价查询',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        // 平台报价设置
        {
          path: 'platformPriceSet',
          name: "platformPriceSet",
          component: resolve => require(['@/components/quote/platformPriceSet'], resolve),
          meta: {
            title: '平台报价设置',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        // 余额管理
        {
          path: 'balanceManage',
          name: "balanceManage",
          component: resolve => require(['@/components/balanceManage/balanceManage'], resolve),
          meta: {
            title: '余额管理',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
            affix: false,// 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）
          }
        },
        // 修改密码
        {
          path: 'resetPwd',
          name: "resetPwd",
          component: resolve => require(['@/components/systemSafe/resetPwd'], resolve),
          meta: {
            title: '修改密码',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
          }
        },
        // 配送设置
        {
          path: 'distributionSet',
          name: "distributionSet",
          component: resolve => require(['@/components/systemSafe/distributionSet'], resolve),
          meta: {
            title: '配送设置',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
          }
        },
        // APP版本管理
        {
          path: 'versionManage',
          name: "versionManage",
          component: resolve => require(['@/components/systemSafe/versionManage'], resolve),
          meta: {
            title: 'APP版本管理',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
          }
        },
        // 客服热线
        {
          path: 'kefu',
          name: "kefu",
          component: resolve => require(['@/components/systemSafe/kefu'], resolve),
          meta: {
            title: '客服热线',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
          }
        },
        // 积分管理
        {
          path: 'integral',
          name: "integralList",
          component: resolve => require(['@/components/integral/integralList'], resolve),
          meta: {
            title: '积分管理',
            noCache: false,//如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
            breadcrumb: true, // 如果设置为false，则不会在breadcrumb面包屑中显示
          }
        },
      ]
    }
  ]
})
