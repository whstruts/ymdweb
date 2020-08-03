<template>
  <div class="preview">
    <div class="top_wrap">
      <div class="top">
        <span class="top_left">欢迎来到药满多！</span>
        <div class="top_right">
          <!--<span class="go_login">请登录</span>-->
          <p class="top_text" style="margin-right: 74px">
            <span class="hint go_login">请登录</span><span class="line"></span><span class="hint">买家注册</span>
          </p>
          <p class="top_text" style="margin-right: 30px">
            <span class="hint">帮助中心</span><span class="line"></span><span class="hint">关于我们</span>
          </p>
          <p class="top_text">
            <span class="hint">客服热线：027-84653162</span>
          </p>
        </div>
      </div>
    </div>
    <div style="background: #fff;padding:12px 0px">
      <div class="search_wrap">
        <img src="@/assets/img/preview/home_logo.png"/>
        <div class="search_bg">
          <div class="search_content">
            <el-input v-model="searchInput" placeholder="药品名/助记码/厂家名称/店铺" class="search_input"></el-input>
            <div class="search_button">搜索</div>
          </div>
          <p class="popular_search">
            &nbsp;
            <!--<label>热门搜索：</label><span>阿莫西林</span><span>感冒药</span><span>阿莫西林</span><span>感冒药</span>-->
          </p>
        </div>
        <div class="shopping_cart">
          <i class="iconfont icon-gouwuche"></i>
          <span>我的购物车</span>
        </div>
      </div>
    </div>
    <div class="banner_wrap item_wrap">
      <div class="nav_bar">
        <span v-for="(item,index) in navigationBar" :key="index">{{item.columnName}}</span>
      </div>
      <div class="banner_left">
        <div class="type_title">商品分类</div>
        <div class="type_wrap">
          <p><span>心脑系统</span><i class="el-icon-arrow-right"></i></p>
          <p><span>呼吸系统</span><i class="el-icon-arrow-right"></i></p>
          <p><span>消化系统</span><i class="el-icon-arrow-right"></i></p>
          <p><span>内分泌</span><i class="el-icon-arrow-right"></i></p>
          <p><span>妇科/儿科/男科</span><i class="el-icon-arrow-right"></i></p>
          <p><span>皮肤外科/五官科</span><i class="el-icon-arrow-right"></i>
          </p>
          <p><span>精神科/肿瘤科</span><i class="el-icon-arrow-right"></i></p>
        </div>
      </div>
      <div class="banner_right">
        <div>
          <!--未登录的-->
          <img src="../../../assets/img/preview/login_default_icon.png"/>
          <p class="welcome_msg">hi,欢迎来到药满多</p>
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
      <el-carousel trigger="click" class="carousel_img">
        <el-carousel-item v-for="(item,index) in bannerData" :key="index">
          <img :src="item.imgUrl" @click="selectEditBar(item,index)"
               v-if="item.imgUrl"/>
          <div class="banner_img" v-else>暂无图片</div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div style="clear: both"></div>
    <div v-for="(item,index) in settingDataList" :key="index">
      <preview-merchant :merchantData="item" v-if="item.identifier=='merchant'"></preview-merchant>
      <preview-commodity :commodityData="item" v-if="item.identifier=='commodity'"></preview-commodity>
      <preview-ad :adData="item" v-if="item.identifier=='ad'"></preview-ad>
    </div>
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
      let data = JSON.parse(this.$route.query.data);
      this.navigationBar = data.navigationBar;
      this.bannerData = data.bannerData;
      this.settingDataList = data.settingDataList;
    },
    methods: {}
  }
</script>

<style lang="scss">
  .preview {
    .commodity_info {
      margin-top: 15px;
      box-sizing: border-box;
      width: 100%;
      .price {
        font-size: 16px;
        color: #FF2424;
      }
      .commodity_title {
        font-size: 14px;
        color: #333;
      }
      .shop_name {
        color: #999999;
        font-size: 12px;
      }
    }
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
        width: 1130px;
        margin: auto;
        .top_left {
          color: #333;
        }
        .top_right {
          float: right;
          .go_login {
            color: #2F9FFE;
          }
          .top_text {
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
        height: 53px;
      }
      .search_bg {
        width: 606px;
        margin: 8px 70px 34px 100px;
        vertical-align: top;
        display: inline-block;
        .search_content {
          width: 606px;
          height: 44px;
          border: 2px solid #2F9FFE;
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
            background-color: #2F9FFE;
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
            color: #999999;
            margin-right: 5px;
          }
          span:nth-child(2n+1) {
            color: #2F9FFE;
          }
        }
      }
      .shopping_cart {
        height: 40px;
        line-height: 39px;
        padding: 0px 8px;
        /*border: 1px solid #2F9FFE;*/
        display: inline-block;
        vertical-align: top;
        margin-top: 8px;
        position: relative;
        box-shadow: 0px 0px 5px rgba(47, 159, 254, 0.7);
        box-sizing: border-box;
        color: #2F9FFE;
        i {
          vertical-align: middle;
        }
        span {
          margin-left: 3px;
          vertical-align: middle;
        }
      }
    }
    background-color: #F5F5F5;
    /*height: 100%;*/
    width: 100%;
    min-width: 1280px;
    padding-bottom: 90px;
    box-sizing: border-box;

    .banner_wrap {
      margin-top: 0px !important;
      .carousel_img {
        width: 746px;
        position: absolute;
        left: 240px;
        img {
          width: 100%;
          height: 100%;
        }
        .el-carousel__container {
          height: 440px;
        }
        .banner_img {
          background: #EFEFEF;
          width: 100%;
          height: 100%;
          text-align: center;
          line-height: 442px;
          color: #999;
          font-size: 26px;
          font-weight: bold;
        }
      }
      .nav_wrap {
        width: 1200px;
        position: absolute;
        left: 50%;
        z-index: 100;
        transform: translateX(-50%);
        top: 0px;
        bottom: 0px;
      }
      .nav_bar {
        position: absolute;
        left: 250px;
        top: -36px;
        color: #333;
        font-size: 14px;
        font-weight: 600;
        right: 0px;
        span {
          margin-left: 45px;
          cursor: pointer;
        }
        span:first-child {
          margin-left: 0px;
        }
      }
      .banner_left {
        width: 232px;
        float: left;
        z-index: 100;
        position: relative;
        .type_title {
          width: 100%;
          height: 43px;
          position: absolute;
          top: -43px;
          line-height: 43px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          background: #2F9FFE;
          text-align: center;
          border-top-right-radius: 20px;
          border-top-left-radius: 20px;
        }
        .type_wrap {
          width: 100%;
          height: 440px;
          font-size: 14px;
          background: #404B5A;
          box-sizing: border-box;
          p {
            color: #fff;
            position: relative;
            line-height: 50px;
            height: 50px;
            padding-left: 22px;
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
              position: absolute;
              right: 22px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
      }
      .banner_right {
        float: right;
        margin-top: 5px;
        height: 430px;
        background: #FFFFFF;
        z-index: 100;
        padding: 32px 14px 0px 14px;
        box-sizing: border-box;
        text-align: center;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.4);
        .sign_out {
          position: absolute;
          right: 6px;
          top: -18px;
          color: #999999;
          font-size: 14px;
          cursor: pointer;
        }
        .welcome_msg {
          text-align: center;
          font-size: 14px;
          font-weight: bold;
        }
        .button_bg {
          width: 66px;
          height: 30px;
          border-radius: 15px;
          text-align: center;
          line-height: 30px;
          display: inline-block;
          margin-top: 18px;
          cursor: pointer;
        }
        .go_login {
          background-color: #2F9FFE;
          color: #fff;
        }
        .go_register {
          border: 1px solid #2F9FFE;
          box-sizing: border-box;
          color: #2F9FFE;
          margin-left: 25px;
        }
        .login_info {
          text-align: center;
          margin-top: 20px;
          span {
            display: block;
            line-height: 20px;
          }
          .order_num {
            font-size: 14px;
            color: #2F9FFE;
          }
          .order_status {
            font-size: 12px;
            color: #666666;
          }
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
            color: #999999;
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
    }

    .navigation_nav_common {
      width: 100%;
      line-height: 24px;
      height: 24px;
      margin-bottom: 22px;
      .navigation_nav_common_title {
        color: #333;
        font-size: 24px;
        vertical-align: middle;
      }
      .navigation_nav_common_min_title {
        font-size: 14px;
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
    .item_wrap {
      width: 1200px;
      margin: 44px auto 0px;
      position: relative;
    }

    .commodity_info {
      margin-top: 15px;
      box-sizing: border-box;
      width: 100%;

      .commodity_title {
        font-size: 14px;
        color: #333;
      }
      .shop_name {
        color: #999999;
        font-size: 12px;
      }
    }

    .item_box_shadow {
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    }

  }
</style>
