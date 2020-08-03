<template>
  <div class="app-add-container app-add-icon" v-if="isShowAds">
    <div class="scroll-wrap">
      <h2 class="title">中缝广告</h2>
      <p class="advice">图片尺寸：700x138px</p>
      <div class="add-list">
        <div class="add-item" style="padding: 16px 30px">
          <!-- <img class="icon-del" src="../../../../assets/img/cms/del_icon.png"/> -->
          <div class="upload-box" style="margin-bottom:10px;width: 100%">
            <el-upload
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="(res,file)=>{return handleAvatarSuccess(res,file)}"
              :headers="uploadHeaders"
              :data="{size:500}"
              :before-upload="beforeAvatarUpload"
              class="avatar-uploader">
              <img class="avatar" :src="adDataEdit.adInfo.imgUrl" v-if="adDataEdit.adInfo.imgUrl">
              <i class="el-icon-plus avatar-uploader-icon" v-else></i>
            </el-upload>
          </div>
          <div class="add-content">
            <p class="add-link" v-if="!adDataEdit.adInfo.jumpPage || adDataEdit.adInfo.jumpPage == 4">链接：<a href="javascript:;" @click="addLink">添加链接</a></p>
            <template v-if="adDataEdit.adInfo.linkAddress">
              <template v-if="adDataEdit.adInfo.jumpPage == 0">
                <p class="had-link">链接：{{adDataEdit.adInfo.linkAddress.name}}
                  <span v-if="adDataEdit.adInfo.linkAddress.keywords">
                    ({{adDataEdit.adInfo.linkAddress.topClassName }}{{adDataEdit.adInfo.linkAddress.keywords }})
                  </span>
                  <i class="iconfont icon-edit" @click="addLink"></i>
                </p>
              </template>
              <template v-if="adDataEdit.adInfo.jumpPage == 2">
                <p class="had-link">链接：{{adDataEdit.adInfo.linkAddress.drugCommonName}}<i class="iconfont icon-edit" @click="addLink"></i></p>
              </template>
              <template v-if="adDataEdit.adInfo.jumpPage == 1 || adDataEdit.adInfo.jumpPage == 3">
                <p class="had-link">链接：{{adDataEdit.adInfo.linkAddress.outlink}}<i class="iconfont icon-edit" @click="addLink"></i></p>
              </template>
            </template>
            <div class="input-box flex-wrp">
              <label>文本：</label>
              <el-input class="flex-item" v-model="adDataEdit.adInfo.txt"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-footer">
      <el-button size="small" @click="reset">重置</el-button>
      <el-button type="primary" size="small" @click="saveAd">保存</el-button>
    </div>
    <link-dialog :addLinkDialog='linkDialogVisible' :itemInfo = 'itemInfo' @closeLinkDialog='closeLinkDialog' @submitLink="submitLink"></link-dialog>
  </div>
</template>
<script>
import {bus} from "../../../../bus.js";
import linkDialog from './linkDialog'
import img_api from "../../../../api/api_homeSetting"

export default {
  name:"addIcon",
  data(){
    return{
      isShowAds: false,
      linkDialogVisible: false,
      uploadUrl: "",
      uploadHeaders: {Authorization: ''},//token
      adDataEdit:{},
      itemInfo:{},
      fIndex: null
    }
  },
  components:{linkDialog},
  created(){
    bus.$on("editOpr", (val,val2,fIndex) => {
      if(val == 'ads') {
        console.log(val2)
        this.isShowAds = true;
        this.adDataEdit = val2;
        this.fIndex = fIndex;
      } else {
        this.isShowAds = false;
      }
    })
    this.uploadUrl = img_api.upload();
  },
  methods:{
    handleAvatarSuccess(res, file, item, index) {
      if (this.loading) {
        this.loading.close();
      }
      if (res.code == 0) {
        this.adDataEdit.adInfo.imgUrl = res.resPath;
      } else {
        this.$message.error(res.msg)
      }
    },
    beforeAvatarUpload(file) {
      this.uploadHeaders.Authorization = localStorage.getItem('access-token');
      if (!this.uploadHeaders.Authorization) {
        return false;
      }
      let arr = file.type.split("/");
      if (arr.indexOf("image") == -1) {
        this.$message.error('仅支持图片上传');
        return false;
      }
       let imgSize = file.size / 1024 / 1024 < 0.5;
      if (!imgSize) {
        this.$message.error('上传图片的大小不能超过 500KB!');
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 700;
        let height = 138;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width == width && img.height == height;
          valid ? resolve() : reject();
        }
        img.src = _URL.createObjectURL(file);
      }).then(() => {
        return file;
      }, () => {
      this.$message.error("图片尺寸必须是700px*138px")
        return Promise.reject();
      });
      return isSize;
    },
    // 添加链接
    addLink(){
      this.itemInfo = this.adDataEdit.adInfo;
      this.linkDialogVisible = true;
    },
    closeLinkDialog(){
      this.itemInfo = {};
      this.linkDialogVisible = false;
    },
    submitLink(obj){
      this.adDataEdit.adInfo = obj;
      this.linkDialogVisible = false;
      this.itemInfo = {};
    },
    // 重置
    reset(){
      this.$confirm("确认要重置吗")
      .then(_ => {
        this.adDataEdit = [];
        let item  = {
          adInfo:{
            imgUrl: "",
            txt: "",
            jumpPage: ""
          },
          identifier: 'ad'
        }
        console.log(item)
        this.adDataEdit = item
      })
      .catch(_ => {});
    },
    // 保存
    saveAd(){
      let item = this.adDataEdit.adInfo;
      console.log(item)
      if (!item.imgUrl) {
        this.$message.error("请上传中缝广告图！")
        return;
      }
      if(!item.jumpPage) {
        this.adDataEdit.adInfo.linkAddress = {};
      }
      if(!item.txt) {
        this.$message.error("请填写文本！")
        return;
      }
      this.isShowAds = false;
      this.$emit("submitAdData", this.adDataEdit,this.fIndex)
    }
  }
}
</script>
<style lang="scss">
  .app-add-icon{
    .upload-box{
      width: 74px;
      height: 74px;
    }
    .add-btn-padding{
      margin-top: 22px;
      padding: 10px 14px;
      background-color: #ffffff;
      .add-btn{
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #999;
        border: 1px dashed #e5e5ee;
        cursor: pointer;
        .avatar-uploader-icon{
          padding-right: 6px;
          font-size: 13px;
        }
      }
    }
  }
</style>
<style lang="scss">
.app-add-banner{
  .avatar-uploader-icon{
    font-size: 18px;
    color: #DEDEDE;
  }
}
</style>
