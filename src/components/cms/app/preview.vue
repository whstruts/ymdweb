<template>
  <div class="app-preview">
    <div class="phone-area">
      <!-- <img class="phone-top" src="../../../assets/img/cms/phone_top.png"/> -->
      <div class="app-banner">
        <el-carousel class="banner-carousel" :autoplay="false"  v-if="bannerData.length > 0">
          <el-carousel-item v-for="(item,index) in bannerData" :key="index">
            <img :src="item.imgUrl" v-if="item.imgUrl"/>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="app-icon">
        <ul>
          <li v-for="item in iconData">
            <span class="icon" :style="{backgroundImage: 'url('+ item.imgUrl+ ')'}"></span>
            <p>{{item.txt}}</p>
          </li>
        </ul>
      </div>
      <div v-for="(item, index) in settingDataList" :key="index">
        <ad v-if="item.identifier == 'ad'" :adData='item':fIndex="index"></ad>
        <floor-img  v-if="item.identifier == 'floor'" :floorData='item' :fIndex="index"></floor-img>
      </div>
    </div>
  </div>
</template>
<script>
import ad from "../../common/preview/app/ad"
import floorImg from "../../common/preview/app/floorImg"
export default {
  name:"appPreview",
  data(){
    return{
      bannerData:[],
      iconData:[],
      settingDataList:[]
    }
  },
  components:{ad,floorImg},
  created(){
    let data = JSON.parse(this.$route.query.data);
    this.bannerData = data.bannerData;
    this.iconData = data.iconData;
    this.settingDataList = data.settingDataList;
    console.log(data);
  },
  methods:{

  }
}
</script>
<style lang="scss">
  .app-preview{
    .phone-area {
      margin: 20px auto 56px;
      width: 750px;
      border: 1px solid #DEDEDE;
      background: #F8F8F8;
      .phone-top{
        width: 100%;
      }
      .el-carousel__indicator--horizontal{
        padding: 18px 10px;
        &.is-active{
          .el-carousel__button{
            background-color: #FFF;
          }
        }
        .el-carousel__button{
          display: block;
          opacity:  1;
          width: 10px;
          height: 10px;
          background-color: #FFF;
          border: none;
          outline: 0;
          padding: 0;
          margin: 0;
          cursor: pointer;
          -webkit-transition: .3s;
          transition: .3s;
          border-radius: 50%;
          background: transparent;
          border: 2px solid #fff;
        }
      }
      .app-banner{
        height: 280px;
        width: 100%;
        position: relative;
        .banner-carousel{
          height: 280px;
          cursor: pointer;
          background: #F8F8F8;
          overflow: hidden;
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
      }
      .app-icon{
        padding: 0 5px 30px;
        background-color: #fff;
        li{
          display: inline-block;
          padding-top: 38px;
          width: 20%;
          text-align: center;
          cursor: pointer;
          span{
            margin: 0 auto;
            display: inline-block;
            width: 84px;
            height: 84px;
            line-height: 43px;
            color: #cccccc;
            border-radius: 50%;
            background-color: #f2f2f2;
            background-position: center;
            background-size: cover;
          }
          p{
            padding-top: 5px;
            line-height: 1;
            font-size: 18px;
            color: #666;
            text-align: center;
          }
        }
      }
    }
  }
</style>
