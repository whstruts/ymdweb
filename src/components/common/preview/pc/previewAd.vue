<template>
  <div class="preview_ad" :style="{background:adImgData.imgUrl?'':'#EFEFEF'}">
    <img :src="adImgData.imgUrl" v-if="adImgData.imgUrl"/>
    <i class="iconfont icon-tupian-copy-copy" v-else></i>
  </div>
</template>

<script>
  export default {
    name: "previewAd",
    props: {
      adData: {
        type: Object,
        default() {
          return []
        }
      },
    },
    data() {
      return {
        adImgData: {}
      }
    },
    created() {
      this.adImgData = this.adData.data[0];
    }
  }
</script>

<style lang="scss">
  .preview_ad {
    width: 1200px;
    height: 100px;
    line-height: 100px;
    margin: 35px auto 0;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
    i {
      font-size: 28px;
      color: #DEDEDE;

    }
  }
</style>
