<template>
  <div class="floor-img-preview">
    <div class="floor" @click="editFloor">
      <div class="floor-title">
        <img :src="floorData.floorTitle.imgUrl"/>
      </div>
      <ul class="product-list">
        <li class="product-item" v-for="item in floorData.data" >
          <div class="product-img" :style="{backgroundImage: 'url('+item.drugImg+ ')'}"></div>
          <p class="p-name">{{item.drugName || '商品名'}}&nbsp;&nbsp;  {{item.drugCommonName}}</p>
          <p class="p-size">{{item.specifications || '规格'}} {{item.manufacturer ||'厂家'}}</p>
          <p class="p-price">{{item.minMaxPrice  || '价格'}}</p>
           <p class="shop_name text_overflow">{{item.supplierName ||'厂家'}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {bus} from "../../../../bus.js";
export default {
  name: 'floorImg',
  data (){
    return {
    }
  },
  props:{
    'floorData':{
      type: Object,
      default() {
        return {}
      }
    },
    fIndex: Number, //组件在集合中的下标
  },
  methods:{
    editFloor(){
      bus.$emit("editOpr", 'floor',this.floorDataEdit,this.fIndex);
    },
    delSetting(){
      this.$emit("delFloor");
    }
  }
}
</script>
<style lang="scss">
.floor-img-preview{
  .floor{
    margin-top: 10px;
    padding: 24px 25px;
    background: #fff;
    .floor-title{
      position: relative;
      img{
        width: 100%;
      }
      p{
        font-size: 14px;
        text-align: center;
        columns: #666666;
      }
      i{
        font-size: 30px;
        text-align: center;
        color: #ccc;
      }
      .icon-del{
        position: absolute;
        top: -5px;
        right: -5px;
      }
    }
    .product-list{
      margin-top: 5px;
      overflow-x: auto;
      overflow-y: hidden;
      word-break: break-all;
      white-space: nowrap;
      li {
        display: inline-block;
        margin-right: 16px;
        padding: 14px;
        width: 210px;
        border: 1px solid #EEEEEE;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 10px;
        .product-img{
          height: 210px;
          background-size: 90%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .p-name{
          font-size: 16px;
          color: #2c2c2c;
          white-space: nowrap;
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .p-size{
          font-size: 14px;
          color: #666666;
          white-space: nowrap;
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .p-price{
          font-size: 18px;
          color: #FF3344;
        }

        i{
          font-size: 26px;
        }
      }
    }
  }

}
</style>
