<template>
  <!--商品推荐-->
  <div class="preview_commodity_wrap item_wrap">
    <div class="navigation_nav_common">
      <span class="navigation_nav_common_title">{{navBar.title || ''}} </span>
      <span class="navigation_nav_common_min_title">{{navBar.subtitle || ''}}</span>
      <span class="navigation_nav_common_more" v-show="navBar.moreButton=='0'">更多 > </span>
    </div>

    <div class="commodity_content_setting flex-row">
      <div class="commodity_max_img ">
        <img :src="mainPicture.imgUrl" v-if="mainPicture.imgUrl"/>
        <div class="commodity_max_default" v-else>
          <i class="iconfont icon-tupian-copy-copy"></i>
        </div>
      </div>
      <div class="commodity_min_img  "
           v-for="(item,index) in commodityDataList" :key="index"
           @mouseenter="enter(index)" @mouseleave="leave()"
           :class="{item_box_shadow:currentIndex==index}"
           :style="{marginLeft:index==3?'0px':'10px',marginTop:index>=3?'10px':'0px'}">
        <div class="commodity_min_img_setting">
          <img :src="item.drugImg" v-if="item.drugImg"/>
          <div class="commodity_max_default" v-else>
            <i class="iconfont icon-tupian-copy-copy"></i>
          </div>
        </div>
        <div class="commodity_info">
          <p class="price">{{item.minMaxPrice || '价格'}}</p>
          <p class="commodity_title text_overflow" :title="item.drugCommonName">{{item.drugName || '商品名'}}&nbsp;&nbsp;  {{item.drugCommonName}}</p>
          <p class="shop_name text_overflow" :title="item.manufacturer">{{item.specifications || '规格'}} {{item.manufacturer ||'厂家'}}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

  export default {
    name: "previewCommodity",
    props: {
      commodityData: {
        type: Object,
        default() {
          return []
        }
      }, //数据
    },
    data() {
      return {
        mainPicture: {},
        navBar: {},
        commodityDataList: []
      }
    },
    created() {
      this.commodityDataList = this.commodityData.data;
     /* let arr = [];
      this.commodityDataList = [];
      for (let i in data) {
        if (arr.indexOf(data[i].commodityCode) == -1) {
          arr.push(data[i].commodityCode);
          this.commodityDataList.push(data[i]);//只展示不同商品编码的8个商品
        }
      }*/
      this.navBar = this.commodityData.navBar;
      this.mainPicture = this.commodityData.mainPicture
    },
    methods: {},
  }
</script>

<style lang="scss">
  .preview_commodity_wrap {
    width: 1200px;
    margin: 44px auto 0px;
    /*   .commodity_setting {
         width: 900px;*/
    .commodity_nav {
      color: #999;
      font-size: 12px;
      .commodity_title_default {
        display: inline-block;
        background: #EFEFEF;
        padding: 8px 36px;
        vertical-align: bottom;
        cursor: pointer;
      }
      .commodity_title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        background: initial;
        padding: initial;
        line-height: 25px;
      }
      .commodity_min_title_default {
        display: inline-block;
        background: #EFEFEF;
        padding: 3px 30px;
        vertical-align: bottom;
        cursor: pointer;
      }
      .commodity_min_title {
        margin-left: 10px;
        color: #666666;
        background: initial;
        padding: initial;
      }
      .commodity_more {
        float: right;
      }
    }
    .commodity_content_setting {
      width: 100%;
      .commodity_max_img {
        width: 473px;
        height: 324px;
        line-height: 324px;
        box-sizing: border-box;
        background: #fff;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
        i {
          font-size: 45px;
        }
      }
      .commodity_min_img_hint {
        border: 1px solid #6CA3F0;
      }
      .commodity_min_img {
        display: inline-block;
        width: 232px;
        height: 324px;
        padding: 19px;
        background: #fff;
        box-sizing: border-box;
        cursor: pointer;
        .commodity_min_img_setting {
          width: 162px;
          height: 153px;
          line-height: 133px;
          margin: 0 auto;
          img {
            width: 100%;
            height: 100%;
          }
          i {
            font-size: 35px;
          }
        }
      }
      .commodity_max_default {
        width: 100%;
        height: 100%;
        text-align: center;
        background: #EFEFEF;
        color: #CECECE;
      }
    }

    .commodity_batch_setting {
      color: #6CA3F0;
      position: absolute;
      left: 920px;
      top: -5px;
      span {
        cursor: pointer;
        vertical-align: middle;
      }
      img {
        font-size: 20px;
        margin-left: 5px;
        vertical-align: middle;
        cursor: pointer;
      }
    }

    .dialog_body {
      .commodity_img_wrap {
        display: inline-block;
        vertical-align: middle;
        .avatar-uploader .el-upload {
          border: 1px dashed #DEDEDE;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #6CA3F0;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #DEDEDE;
          width: 129px;
          height: 89px;
          line-height: 89px;
          text-align: center;
        }
        .avatar {
          width: 129px;
          height: 89px;
          display: block;
        }
        span {
          color: #FF270A;
          font-size: 12px;
        }
      }
      .commodity_data_setting {
        margin: 20px 0px;

        line-height: 30px;
        .add_commodity_button {
          width: 76px;
          height: 30px;
          background: #6CA3F0;
          border-radius: 5px;
          display: inline-block;
          text-align: center;
          color: #fff;
        }
        .del_commodity_button {
          width: 76px;
          height: 30px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(222, 222, 222, 1);
          border-radius: 5px;
          display: inline-block;
          text-align: center;
          color: #666666;
        }
      }
    }

    /*  .el-table__header {
        thead {
          color: #333;
          tr {
            th {
              padding: 6px 0px;
              background: #F0F0F0;
            }
          }
        }
      }
      .el-table td, .el-table th.is-leaf {
        border-bottom: 1px solid #DEDEDE;
      }
      .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
        border-right: 1px solid #DEDEDE;
      }
      .el-table--border::after, .el-table--group::after, .el-table::before {
        background-color: #DEDEDE
      }
      .el-table--border, .el-table--group {
        border: 1px solid #DEDEDE;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #00B78D;
        border-color: #00B78D;
      }
      .el-checkbox__inner:hover {
        border-color: #00B78D;
      }*/
  }
</style>
