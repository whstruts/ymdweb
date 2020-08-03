<template>
  <div class="ad-wrap-preview">
    <div class="add-content">
      <img :src="adData.adInfo.imgUrl"/>
    </div>
  </div>
</template>
<script>

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
  }
}
</script>
<style scoped lang='scss'>
  .ad-wrap-preview{
    padding: 10px 25px;
    .add-content{
      margin-top: 10px;
      position: relative;
      width: 100%;
      text-align: center;
      img{
        width: 100%;
      }
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
        top: -5px;
        right: -5px;
      }
    }
  }
</style>
