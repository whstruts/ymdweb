<template>
  <div class="topic-page">
    <div  :style="{backgroundColor: activityInfo.backgroundColor }">
      <div class="banner-img">
        <img :src="activityInfo.headImg"/>
      </div>
      <div class="w1200">
        <div class="commodity-list">
          <div class="commodity-item" v-for="(item,index) in dataList"
          :class="{'showCart': item.isShowCart}"
            @mouseover="handleMouseover(index,item)"
            @mouseleave="handleMouseleave(index,item)">
            <div class="img-box">
              <img :src="item.drugImg" onerror="javascript:this.src='https://app.ymdb2b.com/ymdDefaultCommodityImg.jpg';"/>
              <!-- commodityStatus  0正常 1 暂无购买权限  2 库存不足/售罄 3  下架-->
              <span class="sell-out" v-if="item.commodityStatus == 2">已售罄</span>
            </div>
            <div class="commodity-info" >
              <p class="price">{{item.price || '价格'}}</p>
              <p class="commodity-title text_overflow" :title="item.manufacturer"><span v-if="item.drugName">{{item.drugName}}&nbsp;</span>{{item.drugCommonName}}</p>
              <p class="commodity-manufacturers text_overflow">{{item.specifications || '规格'}}&nbsp;{{item.manufacturer ||'厂家'}}</p>
              <p title="" class="commodity-date text_overflow">效期：{{item.dateExpiration}}</p>
              <p title="" class="shop-name text_overflow">{{item.supplierName}}</p>
            </div>
            <div class="opr-info">
              <p class="size">中/大包装 </p>
              <div class="cart-num flex-wrp">
                <el-input-number class="reset-input-number flex-item" v-model="item.num" :min="item.isRetail==0?item.largePackage:item.isRetail==1?item.mediumPackage:1" :max="item.repertory" :step="item.isRetail==0?item.largePackage:item.isRetail==1?item.mediumPackage:1" size="mini"
                            step-strictly></el-input-number>
                <el-button type="primary" size="mini" class="btn-add-cart" disabled>加购物车</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from "../../../api/api_topic";
export default {
  name:'topic',
  data(){
    return{
      activityInfo:{},
      dataList:[],
    }
  },
  created(){
    let activityId = this.$route.query.activityId;
    if(activityId) {
      this.getDataList(activityId);
    }

  },
  methods:{
    getDataList(activityId){
      API.getActivity({activityId: activityId}).then( (res) => {
        this.activityInfo = res.data;
          let commodityData = JSON.parse(res.data.commodityData);
          if(commodityData) {
            for( let i  in commodityData ) {
                commodityData[i].num = 0;
                commodityData[i].largePackage = Number(commodityData[i].largePackage);
                commodityData[i].mediumPackage = Number(commodityData[i].mediumPackage);
                commodityData[i].repertory = Number(commodityData[i].repertory)
            }
            this.dataList = commodityData;
            document.title =  res.data.activityName;
          }
      })

    },
    handleMouseover(index,item){
      item.isShowCart = true;
      this.$set(this.dataList, index, item)
    },
    handleMouseleave(index,item){
       item.isShowCart = false;
      this.$set(this.dataList, index, item)
    }
  }
}
</script>
<style lang="scss">
  .topic-page{
    min-height: 600px;
    min-width: 1200px;
    .w1200{
      margin: 0 auto;
      width: 1200px;
    }
    .banner-img{
      img{
        width: 100%;
      }
    }
    .commodity-list{
      padding: 77px 0;
      overflow: hidden;
      .commodity-item{
        position: relative;
        float: left;
        padding: 20px;
        width:240px;
        height:338px;
        background:#fff;
        border:1px solid rgba(238,238,238,1);
        box-sizing: border-box;
        cursor: pointer;
        overflow: hidden;
        &.showCart{
          border-color: #000;
          .opr-info{
            display: block;
          }
        }
        .img-box{
          position: relative;
          padding: 0 25px;
          &:hover{
            img{
              transform: scale(1.1);
            }
          }
          img{
            width: 100%;
            transition: transform 0.1s ease-in;
          }
        }
        .price {
          font-size: 16px;
          color: #FF2424;
        }
        .commodity-title{
          font-size: 14px;
          color: #333333;
        }
        .commodity-manufacturers,.commodity-date{
          font-size: 12px;
          color: #999999;
        }
        .shop-name{
          font-size: 12px;
          color: #666666;
          text-decoration: underline;
        }
        .opr-info{
          display: none;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(0,0,0,.5);
          .size{
            padding: 0 15px;
            color: #fff;
          }
          .cart-num{
            height: 40px;
            line-height: 40px;
            background: #2F3844;
            .reset-input-number{
              margin: 0 15px;
              .el-input--mini .el-input__inner{
                line-height: 29px;
              }
            }
            .btn-add-cart{
              height: 40px;
              border-radius: 0;
              background: #2F9FFE;
            }
          }
        }
      }
    }
  }
</style>
