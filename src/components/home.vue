<template>
  <div class="home_wrap">
    <el-container class="home_el_container">
      <el-header class="home_header">
        <img src="../assets/logo.png" class="logo" style="width: 110px"/>
        <div class="header_right">
          <el-dropdown @command="handleCommand" trigger="click">
          <span class="el-dropdown-link" style="cursor:pointer">
          欢迎：{{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown" class="reset-drop-menu">
              <el-dropdown-item command="editPwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>

        <el-aside class="home_left" :style="{width:isCollapse?'60px':'190px'}">
          <p style="text-align: right;padding-right: 22px">
            <i class="iconfont icon-daohangzhankai-" @click="isCollapse=false" v-if="isCollapse" style="cursor: pointer"></i>
            <i class="iconfont icon-daohangshouqi-" @click="isCollapse=true" v-if="!isCollapse" style="cursor: pointer"></i>
          </p>
          <el-menu
            :default-active="activedMenu($route.path)"
            class="el-menu-vertical-demo"
            background-color="#fff"
            text-color="#666666"
            router
            :collapse-transition="false"
            :collapse="isCollapse"
            @select="handleSelect">
            <template v-for="(item,index) in menus">
              <el-menu-item :index="resolvePath(item)" v-if="item.leaf==true || item.path">
                <i :class="item.iconCls" class="iconCls"></i>
                <span slot="title" class="single_menu_item">{{item.name}}</span>
              </el-menu-item>
              <el-submenu :index="index+''" v-else class="first_nav_title">
                <template slot="title">
                  <i :class="item.iconCls" class="iconCls"></i>
                  <span>{{item.name}}</span>
                </template>

                <template v-for="(data,dataIndex) in item.children">
                  <el-submenu :index="index+'-'+dataIndex+''" v-if="data.children && data.leaf==false && !item.path"
                              class="second_nav_title">
                    <template slot="title">
                      <i :class="data.iconCls" class="iconCls"></i>
                      {{data.name}}
                    </template>
                    <el-menu-item :index="resolvePath(data1)" v-for="(data1,dataIndex1) in data.children"
                                  :key="dataIndex1">
                      <!--<i :class="data.iconCls"></i>-->
                      <span slot="title">{{data1.name}}</span>
                    </el-menu-item>
                  </el-submenu>

                  <el-menu-item :index="resolvePath(data)" v-else>
                    <!--<i :class="data.iconCls"></i>-->
                    <span slot="title">{{data.name}}</span>
                  </el-menu-item>
                </template>


              </el-submenu>


            </template>

          </el-menu>
        </el-aside>
        <el-main class="home_right ">
          <tag-views/>
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <router-view :key="key" class="home_main flex-column "></router-view>
            </keep-alive>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import {bus} from "../bus.js";
  import TagViews from "./tageViews/index"
  import API from "../api/api_user";

  export default {
    name: "home",
    components: {TagViews},
    computed: {
      key() {
        return this.$route.fullPath;
      },
    },
    data() {
      return {
        cachedViews: [],//需要被缓存的集合
        noCache: true,//点击左边菜单时为true 清楚keep-alive 集合里面的缓存，确保数据刷新
        user: {
          name: ''
        },
        isCollapse: false
      }
    },
    watch: {
      //home里的$route先执行，所以清除掉了之后，执行tageViews里面的$route时候又重新加进去了
      $route(to) {
        if (this.noCache) {
          for (const i of this.cachedViews) {
            if (i === to.name) {
              const index = this.cachedViews.indexOf(i)
              this.cachedViews.splice(index, 1)
              break
            }
          }
        }
      }
    },
    created() {
      let menus = JSON.parse(localStorage.getItem("menus"));
      let user = JSON.parse(localStorage.getItem("access-user"));
      if(menus && user) {
        this.user = user;
        this.menus = menus;
      } else{
        this.$router.push({
          name: "login"
        }); //用go刷新
      }
      bus.$on("goto", url => {
        this.romeInfo();
        this.$router.push({
          path: url
        });
      });

      //路由改变时加入缓存
      bus.$on("addTags", currentRoute => {
        //为了避免刚清除掉的缓存被马上加上，就写延时添加
        this.noCache = false;
        setTimeout(() => {
          if (this.cachedViews.includes(currentRoute.name)) return
          if (!currentRoute.meta.noCache) { //如果路由中noCache为true表示该路由不想被缓存
            this.cachedViews.push(currentRoute.name);
          }
        }, 10)
      });
      //当顶部标签被删除时缓存中集合也要被删除
      bus.$on("closeSelectedTag", view => {
        for (const i of this.cachedViews) {
          if (i === view.name) {
            const index = this.cachedViews.indexOf(i)
            this.cachedViews.splice(index, 1)
            break
          }
        }
      });
      //当顶部标签被右键选择时
      bus.$on("closeOthersTags", (view) => {
        this.cachedViews = this.cachedViews.filter(v => {
          return v === view.name;
        })
      });
    },
    methods: {
      activedMenu: function (val) {
        if (val.indexOf('/cms/homeSetting') != -1) {
          return '/cms/homeSetting'
        } else {
          return val;
        }
      },
      handleSelect(index) {
        this.noCache = true;//当选择左侧菜单时改变为true
      },
      resolvePath(routePath) {
        return routePath.path;
      },

      handleCommand(command) {
        if (command === 'editPwd') {
          this.$router.push({
            path: '/resetPwd'
          })
        } else if (command === 'logout') {
          this.logout();
        }
      },
      // 退出登录
      logout() {
        this.$confirm("确认退出吗?", "提示", {
          confirmButtonClass: 'el-button--warning'
        }).then(() => {
          API.logout('').then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.romeInfo();
              this.$router.push({
                name: "login"
              }); //用go刷新
            } else {
              this.$message.error(res.msg);
            }
          })
        })
      },
      romeInfo() {
        localStorage.removeItem("access-user");
        localStorage.removeItem("access-token");
        localStorage.removeItem("menus");
        localStorage.removeItem("perms");
      },
    }
  }
</script>

<style lang="scss">
  .home_wrap {
    height: 100%;
    .home_el_container {
      height: 100%;
      .home_header {
        height: 50px !important;
        line-height: 50px;
        background: rgba(58, 61, 65, 1);
        .logo {
          vertical-align: middle;
          padding-left: 15px;
        }
        .header_right {
          position: absolute;
          top: 0px;
          right: 40px;
          display: inline-block;
          span {
            font-family: PingFang-SC-Bold;
            font-size: 14px;
            color: #fff;
          }
          i {
            font-size: 14px;
            margin-left: 6px;
            color: #FFFFFF;
          }
        }
      }
      .el-container {
        overflow: hidden;
      }
      .home_left {
        /*width: 190px !important;*/
        text-align: center;
        background: #fff;
        border-right: 1px solid #DEDEDE;
        /*保证菜单超出不会出现滚动条的 火狐*/
        scrollbar-width: none;
        /*保证菜单超出不会出现滚动条的 谷歌*/
        &::-webkit-scrollbar {
          display: none;
        }
        .el-submenu__title, .single_menu_item {
          font-size: 14px;
        }
        .el-menu {
          border-right: initial;
        }
        .el-menu-item {
          font-size: 14px;
          &.is-active {

          }
        }
        .el-menu-item, .el-submenu__title {
          height: 54px;
          line-height: 54px;
          text-align: left;
        }
        .el-menu-item:hover, .el-submenu__title:hover {
          background: #EDF8FF !important;
        }
        .first_nav_title.el-submenu.is-active.is-opened > .el-submenu__title {
          color: #409EFF !important;
          background: #EDF8FF !important;
          border-left: 3px solid #409EFF !important;
          .iconfont {
            color: #409EFF !important;
          }
        }
        .second_nav_title.el-submenu.is-active.is-opened > .el-submenu__title {
          color: #409EFF !important;
          .iconfont {
            color: #409EFF !important;
          }
        }
        .iconCls {
          color: #666666;
        }

      }
      .home_right {
        padding: 0px !important;
        overflow: hidden;
        .home_main {
          padding: 0 20px;
          height: calc(100% - 25px);
          height: -moz-calc(100% - 25px);
          height: -webkit-calc(100% - 25px);
          box-sizing: border-box;
          overflow: hidden;

        }
        .el-dialog__wrapper::-webkit-scrollbar, .scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .el-dialog__wrapper::-webkit-scrollbar-track, .scrollbar::-webkit-scrollbar-track {
          background-color: #fff;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
        }
        .el-dialog__wrapper::-webkit-scrollbar-thumb, .scrollbar::-webkit-scrollbar-thumb {
          background-color: #ccc;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
        }
        .scrollbar_height::-webkit-scrollbar {
          height: 8px;
        }
        .scrollbar_height::-webkit-scrollbar-track {
          background-color: #fff;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
        }
        .scrollbar_height::-webkit-scrollbar-thumb {
          background-color: #ccc;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
        }
      }
    }
  }

  .reset-drop-menu {
    padding: 0 !important;
    margin-top: 6px;
    .el-dropdown-menu__item--divided {
      margin-top: 0 !important;
      &:before {
        height: 0 !important;
      }
    }
  }
</style>
