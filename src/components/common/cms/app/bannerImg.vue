<template>
  <div class="app-banner-img" @click="editBanner">
    <el-carousel class="banner-carousel" :autoplay="false"  v-if="bannerData.length > 0">
      <el-carousel-item v-for="(item,index) in bannerData" :key="index">
        <img :src="item.imgUrl" v-if="item.imgUrl"/>
      </el-carousel-item>
    </el-carousel>
    <div class="banner-carousel" v-if="bannerData.length <= 0">
      <div class="banner-default">
        <i class="iconfont icon-tupian-copy-copy"></i>
        <p>banner图</p>
      </div>
    </div>
  </div>
</template>
<script>
import {bus} from "../../../../bus.js";
export default {
  name:"bannerImg",
  data(){
    return{

    }
  },
  props:{
    'bannerData':{
      type: Array,
      default() {
        return []
      }
    }
  },

  methods:{
    editBanner(){
      bus.$emit("editOpr", 'banner')
    }
  }
}
</script>
<style lang="scss">
  .app-banner-img{
    height: 128px;
    width: 100%;
    position: relative;
    .banner-carousel{
      height: 128px;
      cursor: pointer;
      background: #F8F8F8;
      img{
        width: 100%;
        height: 100%;
      }
      .el-carousel__container{
        width: 100%;
        height: 100%;
        text-align: center;
      }
      .banner-default{
        text-align: center;
        i{
          padding-top: 35px;
          line-height: 1;
          font-size: 30px;
          color: #ccc;
        }
        p{
          text-align: center;
          color: #666;
        }

      }
    }
    .add-banner{
      position: absolute;
      right: -422px;
      width: 412px;
      height: 709px;
      background: #f8f8f8;
      border: 1px solid #DEDEDE;
    }
  }
</style>
