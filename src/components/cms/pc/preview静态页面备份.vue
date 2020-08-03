<template>
  <div class="preview">
    <div class="top_wrap">
      <div class="top">
        <span class="top_left">欢迎来到药药购！</span>
        <div class="top_right">
          <span class="go_login">请登录</span>
          <p class="top_text">
            <span class="hint">买家注册</span><span class="line"></span><span class="hint">商家入驻</span>
          </p>
          <p class="top_text">
            <span class="hint">帮助中心</span><span class="line"></span><span class="hint">关于我们</span>
          </p>
          <p class="top_text">
            <span class="hint">客服热线：027-84653162</span>
          </p>
        </div>
      </div>
    </div>
    <div class="search_wrap">
      <img src="../../../assets/img/preview/home_logo.png"/>
      <div class="search_bg">
        <div class="search_content">
          <el-input v-model="searchInput" placeholder="药品名/助记码/厂家名称/店铺" class="search_input"></el-input>
          <div class="search_button">搜索</div>
        </div>
        <p class="popular_search">
          <label>热门搜索：</label><span>阿莫西林</span><span>感冒药</span><span>阿莫西林</span><span>感冒药</span>
        </p>
      </div>
      <div class="shopping_cart">
        <div class="commodity_number">9</div>
        <i class="iconfont icon-gouwuche"></i>
        <span>我的购物车</span>
      </div>
    </div>
    <div class="nav_bar">
      <span>首页首页首页</span>
      <span>首页首页首页</span>
      <span>首页首页首页</span>
      <span>首页首页首页</span>
      <span>首页首页首页</span>
      <span>首页首页首页</span>
      <span>首页首页首页</span>
    </div>
    <div class="banner_wrap">
      <el-carousel trigger="click" class="carousel_img">
        <el-carousel-item v-for="item in 4" :key="item">
          <div class="banner_img"></div>
        </el-carousel-item>
      </el-carousel>
      <div class="banner_left">
        <div class="type_title">商品分类</div>
        <div class="type_wrap">
          <p><i class="iconfont icon-xinnaoxieguan"></i><span>心脑系统</span><i class="el-icon-arrow-right"></i></p>
          <p><i class="iconfont icon-huxike"></i><span>呼吸系统</span><i class="el-icon-arrow-right"></i></p>
          <p><i class="iconfont icon-xiaohuaneike_iconx"></i><span>消化系统</span><i class="el-icon-arrow-right"></i></p>
          <p><i class="iconfont icon-neifenmizhiliao"></i><span>内分泌</span><i class="el-icon-arrow-right"></i></p>
          <p><i class="iconfont icon-geren"></i><span>妇科/儿科/男科</span><i class="el-icon-arrow-right"></i></p>
          <p><i class="iconfont icon-yanbu_iconx"></i><span>皮肤外科/五官科</span><i class="el-icon-arrow-right"></i></p>
          <p><i class="iconfont icon-jingshenke"></i><span>精神科/肿瘤科</span><i class="el-icon-arrow-right"></i></p>
        </div>
      </div>
      <div class="banner_right">
        <div>
          <!--未登录的-->
          <img src="../../../assets/img/preview/login_default_icon.png"/>
          <p class="welcome_msg">hi,欢迎来到药药购</p>
          <div class="go_login button_bg">登录</div>
          <div class="go_register button_bg">注册</div>
        </div>
        <p class="headline_wrap">
          <i class="iconfont icon-gg"></i>
          <span class="headline_title">药头条</span>
          <span class="headline_more">更多 > </span>
        </p>
        <p class="headline_new_wrap">
          <img src="../../../assets/img/preview/hot_icon.png"/>
          <span class="headline_new_title">电子首营资料交换</span>
        </p>
        <p class="headline_new_wrap">
          <img src="../../../assets/img/preview/new_icon.png"/>
          <span class="headline_new_title">药品成本价格调差将入法</span>
        </p>
        <p class="headline_new_wrap">
          <img src="../../../assets/img/preview/new_icon.png"/>
          <span class="headline_new_title">药品成本价格调差将入...</span>
        </p>
        <p class="headline_new_wrap">
          <img src="../../../assets/img/preview/new_icon.png"/>
          <span class="headline_new_title">药品成本价格调差将入法</span>
        </p>
      </div>
    </div>

    <preview-merchant></preview-merchant>
    <preview-commodity></preview-commodity>
    <preview-ad></preview-ad>
  </div>
</template>

<script>
  import previewMerchant from "../../common/preview/pc/previewMerchant"
  import previewCommodity from "../../common/preview/pc/previewCommodity"
  import previewAd from "../../common/preview/pc/previewAd"

  export default {
    name: "preview",
    components: {previewCommodity, previewMerchant, previewAd},
    data() {
      return {
        searchInput: "",
        navigationBar: [],
        bannerData: [],
        settingDataList: []
      }
    },
    created() {
     /* let data = JSON.parse(this.$route.query.data);
      this.navigationBar = data.navigationBar;
      this.bannerData = data.bannerData;
      this.settingDataList = data.settingDataList;*/
    },
    methods: {}
  }
</script>

<style lang="scss">
  .preview {
    background-color: #fff;
    /*height: 100%;*/
    width: 100%;
    min-width: 1280px;
    padding-bottom: 90px;
    box-sizing: border-box;
    .top_wrap {
      width: 100%;
      height: 36px;
      line-height: 36px;
      box-sizing: border-box;
      background-color: #F5F5F5;
      .top {
        width: 920px;
        margin: auto;
        .top_left {
          color: #333;
        }
        .top_right {
          float: right;
          .go_login {
            color: #00B78D;

          }
          .top_text {
            margin-left: 22px;
            display: inline-block;
            color: #666;
            .hint {
              vertical-align: middle;
            }
            .line {
              display: inline-block;
              width: 1px;
              height: 14px;
              background: rgba(153, 153, 153, 1);
              vertical-align: middle;
              margin: 0px 10px;
            }
          }
        }

      }
    }
    .search_wrap {
      width: 1125px;
      margin: 17px auto 0px;
      display: flex;
      img {
        vertical-align: middle;
        width: 193px;
        height: 66px;
      }
      .search_bg {
        width: 606px;
        margin: 8px 125px 34px 74px;
        vertical-align: top;
        display: inline-block;
        .search_content {
          width: 606px;
          height: 44px;
          border: 2px solid #00B78D;
          border-radius: 20px;
          box-sizing: border-box;
          .search_input {
            width: 480px;
            .el-input__inner {
              border: initial;
              border-radius: 20px;
              padding: 0px 25px;
              box-sizing: border-box;
            }
          }
          .search_button {
            float: right;
            width: 104px;
            height: 42px;
            line-height: 42px;
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
            background-color: #00B78D;
            text-align: center;
            color: #fff;
            font-size: 16px;
            box-sizing: border-box;
          }
        }
        .popular_search {
          margin-top: 5px;
          label {
            color: #333;
          }
          span {
            color: #666;
            margin-right: 5px;
          }
          span:nth-child(2n+1) {
            color: #00B78D;
          }
        }
      }
      .shopping_cart {
        width: 120px;
        height: 40px;
        line-height: 40px;
        border: 1px solid #00B78D;
        display: inline-block;
        vertical-align: top;
        margin-top: 8px;
        padding-left: 11px;
        position: relative;
        box-sizing: border-box;
        .commodity_number {
          width: 25px;
          height: 25px;
          line-height: 25px;
          color: #fff;
          font-size: 12px;
          background: #E24924;
          border-radius: 50%;
          -moz-border-radius: 50%;
          -webkit-border-radius: 50%;
          text-align: center;
          position: absolute;
          left: 22px;
          top: -6px;
        }
        i {
          color: #00B78D;
          font-size: 20px;
          vertical-align: middle;
        }
        span {
          margin-left: 9px;
          color: #666666;
          vertical-align: middle;
        }
      }
    }
    .nav_bar {
      margin-left: 635px;
      width: calc(100% - 635px);
      width: -moz-calc(100% - 635px);
      width: -webkit-calc(100% - 635px);
      span {
        margin-left: 45px;
        color: #333;
      }
      span:first-child {
        margin-left: 0px;
      }
    }
    @media (min-width: 1320px) and (max-width: 1530px) {
      .nav_bar {
        margin-left: 435px;
        width: calc(100% - 435px);
        width: -moz-calc(100% - 435px);
        width: -webkit-calc(100% - 435px);
      }
    }
    @media (min-width: 800px) and (max-width: 1320px) {
      .nav_bar {
        margin-left: 335px;
        width: calc(100% - 335px);
        width: -moz-calc(100% - 335px);
        width: -webkit-calc(100% - 335px);
      }
    }
    .banner_wrap {
      width: 100%;
      margin-top: 12px;
      position: relative;
      .carousel_img {
        width: 100%;
        .el-carousel__container {
          height: 442px;
        }
        .banner_img {
          background: #ccc;
          width: 100%;
          height: 100%;
        }
      }
      .banner_left {
        width: 232px;
        position: absolute;
        left: 358px;
        top: -43px;
        z-index: 100;
        .type_title {
          width: 100%;
          height: 43px;
          line-height: 43px;
          color: #fff;
          background: #00B78D;
          text-align: center;
          border-top-right-radius: 20px;
          border-top-left-radius: 20px;
        }
        .type_wrap {
          width: 100%;
          height: 440px;
          background: #404B5A;
          padding: 15px 22px 0px;
          box-sizing: border-box;
          p {
            color: #fff;
            /*position: relative;*/
            margin-bottom: 30px;
            line-height: 22px;
            i {
              vertical-align: middle;
              font-size: 16px;
            }
            span {
              vertical-align: middle;
              margin-left: 10px;
              cursor: pointer;
            }
            .el-icon-arrow-right {
              /* position: absolute;
               right: 24px;
               top: 50%;
               transform: translateY(-50%);*/
              vertical-align: middle;
              float: right;
              line-height: 22px;
            }
          }
        }
      }
      .banner_right {
        position: absolute;
        top: 5px;
        right: 360px;
        width: 204px;
        height: 430px;
        background: #FFFFFF;
        z-index: 100;
        padding: 32px 14px 0px 14px;
        box-sizing: border-box;
        text-align: center;
        text-align: center;
        .welcome_msg {
          text-align: center;
        }
        .button_bg {
          width: 66px;
          height: 30px;
          border-radius: 15px;
          text-align: center;
          line-height: 30px;
          display: inline-block;
          margin-top: 18px;
        }
        .go_login {
          background-color: #00B78D;
          color: #fff;
        }
        .go_register {
          border: 1px solid #00B78D;
          box-sizing: border-box;
          color: #00B78D;
          margin-left: 25px;
        }
        .headline_wrap {
          margin: 35px 0px 19px;
          font-weight: bold;
          color: #333;
          line-height: 22px;

          i {
            font-size: 20px;
            vertical-align: middle;
          }
          .headline_title {
            vertical-align: middle;
          }
          .headline_more {
            vertical-align: middle;
            float: right;
          }
        }
        .headline_new_wrap {
          line-height: 14px;
          margin-bottom: 13px;
          img {
            vertical-align: middle;
          }
          .headline_new_title {
            vertical-align: middle;
            font-size: 12px;
            color: #666666;
            font-weight: bold;
            margin-left: 7px;
            width: 134px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      @media (min-width: 1320px) and (max-width: 1530px) {
        .banner_left {
          left: 158px;
        }
        .banner_right {
          right: 160px;
        }
      }
      @media (min-width: 800px) and (max-width: 1320px) {
        .banner_left {
          left: 58px;
        }
        .banner_right {
          right: 60px;
        }
      }
    }

    .navigation_nav_common {
      width: 100%;
      line-height: 24px;
      height: 24px;
      margin-bottom: 22px;
      .floor_index {
        background-image: url("../../../assets/img/preview/floor_left_icon.png");
        width: 25px;
        height: 24px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        display: inline-block;
        vertical-align: middle;
      }
      .floor_right {
        vertical-align: middle;
      }
      .navigation_nav_common_title {
        color: #333;
        font-size: 24px;
        vertical-align: middle;
        margin-left: 12px;
      }
      .navigation_nav_common_min_title {
        margin-left: 10px;
        color: #666666;
        display: inline-block;
        height: 19px;
        vertical-align: bottom;
      }

      .navigation_nav_common_more {
        float: right;
        color: #999999;
      }
    }

  }
</style>
