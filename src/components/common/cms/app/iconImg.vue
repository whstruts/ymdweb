<template>
  <div class="app-icon-img" @click="editIcon">
    <ul>
      <li v-for="item in 10">
        <span class="icon"></span>
        <p>icon</p>
      </li>
    </ul>
  </div>
</template>
<script>
import {bus} from "../../../../bus.js";

export default {
  name:"iconImg",
  data(){
    return{

    }
  },
  methods:{
    editIcon(){
      bus.$emit("editOpr", 'icon')
    }
  }
}
</script>
<style lang="scss">
  .app-icon-img{
    margin-top: 11px;
    background-color: #f8f8f8;
    li{
      display: inline-block;
      padding: 12px 0;
      width: 20%;
      text-align: center;
      cursor: pointer;
      span{
        margin: 0 auto;
        display: inline-block;
        width: 43px;
        height: 43px;
        line-height: 43px;
        color: #cccccc;
        border-radius: 50%;
        background-color: #f2f2f2;
      }
      p{
        line-height: 1;
        font-size: 12px;
        color: #666;
        text-align: center;
      }
    }
  }
</style>
