<template>
  <div class="login">

    <div class="login_header">
      <img src="../assets/img/logo.png"/>
      <p class="login_title">欢迎登录！</p>
    </div>
    <div class="login_content">
      <img src="../assets/img/login_bg.png"/>
      <div class="login_setting">
        <div class="login_hint_warp flex-row">
          <span class="login_line"></span>
          <span class="login_hint">用户登录</span>
        </div>
        <div class="login_input">
          <el-input
            placeholder="请输入登录账户"
            prefix-icon="iconfont icon-zhanghao" v-model="login.userName" @keyup.native="handleKeyUp"
            @keyup.enter.native="handleLogin"
            maxlength="11"></el-input>
          <el-input
            placeholder="请输入登录密码"
            prefix-icon="iconfont icon-mima" type="password" v-model="login.pwd"
            @keyup.enter.native="handleLogin" maxlength="20"></el-input>
          <div style="position: relative">
            <el-input
              placeholder="验证码"
              prefix-icon="iconfont icon-yanzhengma" style="width:45% " v-model="login.randomString"
              maxlength="4" @keyup.enter.native="handleLogin"></el-input>
            <div class="code_img_wrap" :style="{backgroundImage: 'url('+ getImg +')'}" @click="getImgs"></div>
          </div>

          <el-checkbox v-model="rememberPwd">记住密码</el-checkbox>
          <el-button type="primary" class="login_button" @click="handleLogin" :loading="loading"
                     :disabled="!login.userName||!login.pwd||!login.randomString">登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import API from "../api/api_user";

  export default {
    name: 'login',
    data() {
      return {
        login: {
          userName: "",
          pwd: "",
          randomString: "",//验证码
          timestamp: "",//时间戳
        },
        rememberPwd: false,//记住密码
        loading: false,
        getImg: "",
      }
    },
    created() {
      this.isLogin();
    },
    destroyed() {
      this.$destroy()
    },
    methods: {
      isLogin() {
        let menus = JSON.parse(localStorage.getItem("menus"));
        let user = JSON.parse(localStorage.getItem("access-user"));
        let token = localStorage.getItem("access-token");
        if (user && token && menus) {
          API.queryJwt().then( (res) => {
            if(res.code == 0) {
              if (menus.length > 0) {
                let menu = menus[0];
                let path = ""
                if (!menu.path && menu.children.length > 0) {
                  path = menu.children[0].path;
                } else {
                  path = menu.path;
                }
                this.$router.push({path: path});
                return
              }
            } else {
              this.romeInfo();
              this.getImgs();
              this.getCookie();
            }
          })
        } else {
          this.getImgs();
          this.getCookie();
        }
      },
      romeInfo() {
        localStorage.removeItem("access-user");
        localStorage.removeItem("access-token");
        localStorage.removeItem("menus");
        localStorage.removeItem("perms");
      },
      getImgs() {
        this.login.timestamp = new Date().getTime();
        this.getImg = API.getImg() + "?timestamp=" + this.login.timestamp;
      },
      handleKeyUp(evt) {
        this.$nextTick(() => {
          this.login.userName = this.$utils.regSpecialChar(evt)
        })
      },
      handleLogin() {
        if (!this.login.userName || !this.login.pwd) {
          this.$message.error("请输入用户名和密码！")
          return;
        }
        if (!this.login.randomString || this.login.randomString.length != 4) {
          this.$message.error("请正确输入验证码");
          return
        }
        // 判断记住密码否被勾选; 勾选则调用配置Cookie方法
        if (this.rememberPwd) { // 记住密码
          this.setCookie(this.login.userName, this.login.pwd, 30); // 保存期限为30天
        } else {
          this.clearCookie(); // 清空 Cookie
        }
        this.loading = true;
        API.login(this.login).then((res) => {
          this.loading = false;
          if (res.code == 0) {
            localStorage.setItem("access-user", JSON.stringify(res.user));
            localStorage.setItem("access-token", res.token);
            localStorage.setItem("menus", JSON.stringify(res.router));
            localStorage.setItem("perms", JSON.stringify(res.perms));
            if (res.router.length > 0) {
              let menu = res.router[0];
              let path = ""
              if (!menu.path && menu.children.length > 0) {
                path = menu.children[0].path;
              } else {
                path = menu.path;
              }
              this.$router.push({path: path});
            } else {
              this.$message.error("你沒有菜单权限，请联系管理员！");
            }
          } else {
            this.login.randomString = "";
            this.getImgs();
            this.$message.error(res.msg);
          }
        }).catch(() => {

          this.loading = false
        })
      },
      // 设置Cookie
      setCookie(username, password, exdays) { // 用户名, 密码, 保存天数
        let exdate = new Date(); // 获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
        // 字符串拼接cookie
        window.document.cookie = 'userName=' + username + ';path=/;expires=' + exdate.toGMTString();
        window.document.cookie = 'userPwd=' + password + ';path=/;expires=' + exdate.toGMTString();
      },

      // 读取Cookie
      getCookie() {
        if (document.cookie.length > 0) {
          let arr = document.cookie.split('; '); // 这里显示的格式需要切割一下自己可输出看下
          for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].split('='); // 再次切割
            // 判断查找相对应的值
            if (arr2[0] == 'userName') {
              this.login.userName = arr2[1]; // 保存到保存数据的地方
            } else if (arr2[0] == 'userPwd') {
              this.login.pwd = arr2[1];
            }
          }
          if (this.login.userName && this.login.pwd) {
            this.rememberPwd = true
          }
        }
      },

      // 清除Cookie
      clearCookie() {
        this.setCookie('', '', -1); // 修改2值都为空，天数为负1天就好了
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .login {
    width: 100%;
    height: 100%;
    .login_header {
      height: 8.8%;
      line-height: 8.8%;
      position: relative;
      img {
        position: absolute;
        left: 18.7%;
        top: 50%;
        width: 9.8%;
        transform: translateY(-50%);
      }
      .login_title {
        position: absolute;
        color: #333333;
        left: 35.8%;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        /*font-weight: 600;*/
      }
    }
    .login_content {
      background: linear-gradient(-62deg, rgba(73, 196, 255, 1), rgba(52, 120, 243, 1));
      position: relative;
      height: 600px;
      min-width: 1280px;
      img {
        position: absolute;
        left: 5.2%;
        top: 3.7%;
        width: 668px;
      }
      .login_setting {
        position: absolute;
        width: 361px;
        height: 398px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 5px 7px 0px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        top: 16%;
        right: 15.6%;
        padding: 0px 29px;
        box-sizing: border-box;
        .login_hint_warp {
          margin: 36px 0px;
          .login_line {
            display: inline-block;
            width: 5px;
            height: 21px;
            background: #0680FD;
          }
          .login_hint {
            font-size: 16px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            margin-left: 10px;
          }
        }
        .login_input {
          .el-input {
            margin-bottom: 20px;
          }
          .el-input__inner {
            height: 40px !important;
            line-height: 40px !important;
          }
          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #0680FD;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: #0680FD;
            border-color: #0680FD;
          }
          .el-checkbox__inner:hover {
            border-color: #0680FD;
          }
          .code_img_wrap {
            position: absolute;
            right: 0px;
            top: -4px;
            margin-left: 10px;
            width: 105px;
            height: 45px;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: contain;
          }
        }
        .login_button {
          width: 100%;
          background-color: #0680FD;
          height: 40px;
          font-size: 20px;
          margin-top: 20px;
          padding: 9px 20px;
        }
      }
    }
    @media screen and(max-width: 1360px) {
      .login_content {
        height: 400px;
        img {
          width: 448px;
        }
        .login_setting {
          position: absolute;
          width: 270px;
          height: 280px;
          padding: 0px 15px;
          top: 17%;
          .login_hint_warp {
            margin: 10px 0px;
            .login_line {
              width: 3px;
              height: 16px;
            }
            .login_hint {
              font-size: 12px;
              margin-left: 5px;
            }
          }
          .login_input {
            .el-input {
              margin-bottom: 18px;
            }
            .el-input__inner {
              height: 30px !important;
              line-height: 30px !important;
              font-size: 12px !important;
            }
            .el-input__icon {
              font-size: 14px;
              line-height: 32px;
            }
            .code_img_wrap {
              position: absolute;
              right: 0px;
              top: 5px;
              margin-left: 10px;
              width: 105px;
              height: 25px;
              background-position: center center;
              background-repeat: no-repeat;
              background-size: contain;
            }
            .el-checkbox__label {
              font-size: 12px;
            }
          }
          .login_button {
            width: 100%;
            background-color: #0680FD;
            height: 30px;
            font-size: 14px;
            margin-top: 10px;
            padding: 5px 20px;
          }
        }
      }
    }
  }
</style>
<style lang="scss">

</style>
