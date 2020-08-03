<template>
  <div class="ad-wrap">
    <div class="add-content" @click="editAds">
      <!-- <i class="iconfont icon-tupian-copy-copy"></i> -->
      <p>中缝广告</p>
      <img class="icon-del" src="../../../../assets/img/cms/del_icon.png" @click.stop="delSetting"/>
    </div>
  </div>
</template>
<script>
import {bus} from "../../../../bus.js";

export default {
  name:'ad',
  data(){
    return {
      adDataEdit:{}
    }
  },
  props:{
    'adData':{
      type: Object,
      default() {
        return {}
      }
    },
    fIndex: Number, //组件在集合中的下标
  },
  watch:{
    'adData':{
      handler(newVal) {
        this.adDataEdit = newVal
      },
      deep: true,
      immediate: true
    }
  },
  mounted(){

  },
  methods:{
    editAds (){
      console.log(this.adDataEdit)
      bus.$emit("editOpr", 'ads',this.adDataEdit,this.fIndex)
    },
    delSetting(){
      this.$emit("delAd")
    }
  }
}
</script>
<style scoped lang='scss'>
  .ad-wrap{
    .add-content{
      margin-top: 10px;
      position: relative;
      width: 100%;
      height: 78px;
      line-height: 78px;
      text-align: center;
      background-color: #f8f8f8;
      cursor: move;
      text-align: center;
      p{
        font-size: 14px;
        text-align: center;
        color: #666666;
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
  }
</style>
