<template>
  <div class="floor-img">
    <div class="floor" @click="editFloor">
      <div class="floor-title">
        <!-- <i class="iconfont icon-tupian-copy-copy"></i> -->
        <p>楼层</p>
        <img class="icon-del" src="../../../../assets/img/cms/del_icon.png" @click.stop="delSetting"/>
      </div>
      <ul class="product-list">
        <li class="product-item" v-for="item in 10">
          <i class="iconfont icon-tupian-copy-copy"></i>
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
      floorDataEdit:{}
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
  watch:{
    'floorData':{
      handler(newVal) {
        this.floorDataEdit = newVal
      },
      deep: true,
      immediate: true
    }
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
<style scoped lang="scss">
  .floor{
    margin-top: 10px;
    cursor: move;
    .floor-title{
      position: relative;
      height: 86px;
      line-height: 86px;
      background-color: #f8f8f8;
      text-align: center;
      cursor: move;
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
        top: -11px;
        right: -5px;
      }
    }
    .product-list{
      margin-top: 5px;
      height: 108px;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
      li {
        display: inline-block;
        margin-right: 5px;
        width: 114px;
        height: 108px;
        line-height: 108px;
        text-align: center;
        background-color: #f8f8f8;
        white-space: nowrap;
        color: #ccc;
        cursor: move;
        i{
          font-size: 26px;
        }
      }
    }
  }
</style>
