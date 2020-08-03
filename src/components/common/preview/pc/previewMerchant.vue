<template>
  <!--商家推荐-->
  <div class="preview_merchant">
    <div class="navigation_nav_common">
      <div class="floor_index">1</div>
      <img src="../../../../assets/img/preview/floor_right_icon.png" class="floor_right"/>
      <span class="navigation_nav_common_title">{{navBar.title || ''}} </span>
      <span class="navigation_nav_common_min_title">{{navBar.subtitle || ''}}</span>
      <span class="navigation_nav_common_more" v-show="navBar.moreButton=='0'">更多 > </span>
    </div>
    <div class="merchant_content_setting">
      <swiper :options="swiperOption">
        <swiper-slide class="merchant_info"
                      v-for="(item,index) in merchantDataList" :key="index">
          <div class="info_content_wrap">
            <div class="merchant_content_img">
              <div class="merchant_content_img_default">
                <img :src="item.imgUrl" v-if="item.imgUrl" style="width: 100%;height: 100%"/>
                <i class="iconfont icon-tupian-copy-copy" v-else></i>
              </div>

            </div>
            <div class="merchant_info_button" :style="{  background:item.imgUrl?'#00B78D':'#D7D7D7' }">进入商家店铺</div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
  export default {
    name: "previewMerchant",
    props: {
      merchantData: {
        type: Object,
        default() {
          return []
        }
      }, //数据
    },
    data() {
      return {
        swiperOption: {
          slidesPerView: 4,
          spaceBetween: 10,
          slidesPerGroup: 4,
          loop: false,
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        merchantDataList: [],
        navBar: []
      }
    },
    created() {
      this.merchantDataList = this.merchantData.data;
      this.navBar = this.merchantData.navBar;
    },
    methods: {}
    ,
  }
</script>

<style lang="scss">
  .preview_merchant {
    width: 1200px;
    margin: 44px auto 0px;
    position: relative;

    .merchant_content_setting {
      width: 100%;
      height: 200px;

      box-sizing: border-box;
      .merchant_info {
        width: 290px;
        /*height: 200px;*/
        border: 1px solid #EEEEEE;
        padding: 16px 25px;
        box-sizing: border-box;
        .info_content_wrap {
          display: inline-block;
          width: auto;
          height: auto;
          cursor: pointer
        }
        .merchant_content_img {
          border-bottom: 1px solid #EEEEEE;
          margin-bottom: 20px;
          padding-bottom: 20px;
          box-sizing: border-box;
          .merchant_content_img_default {
            width: 242px;
            height: 84px;
            text-align: center;
            line-height: 84px;
            color: #CECECE;
            position: relative;
            i {
              font-size: 22px;
            }
          }
        }
        .merchant_info_button {
          margin: 0 auto 10px;
          width: 120px;
          height: 30px;
          line-height: 30px;
          border-radius: 5px;
          text-align: center;
          font-size: 14px;
          color: #FFFFFF;
        }

      }
      .swiper-button-next {
        background-image: url("../../../../assets/img/cms/button-next.png");
        right: 5px;
        width: 16px;
        height: 31px;
      }
      .swiper-button-prev {
        background-image: url("../../../../assets/img/cms/button-prev.png");
        width: 16px;
        height: 31px;
        left: 2px;
      }
    }
    .merchant_batch_setting {
      color: #6CA3F0;
      position: absolute;
      left: 920px;
      top: -5px;

      span {
        vertical-align: middle;
        cursor: pointer;
      }
      img {
        font-size: 20px;
        margin-left: 5px;
        vertical-align: middle;
        cursor: pointer;
      }
    }

    .merchant_img_wrap {
      display: inline-block;
      vertical-align: middle;
      div {
        width: 153px;
        height: 43px;
        border: 1px dashed #EEEEEE;
        text-align: center;
        line-height: 43px;
        i {
          color: #DEDEDE;
          font-size: 22px;
        }
      }
      span {
        color: #FF270A;
        font-size: 12px;
      }
    }
  }
</style>
