<template>
  <div class="app-add-container app-add-icon" v-if="isShowIcon">
    <div class="scroll-wrap">
      <h2 class="title">icon</h2>
      <p class="advice">图片尺寸：85x85px</p>
      <div class="add-list">
        <draggable :options="draggableOptions" v-model="iconDataEdit">
          <div class="add-item flex-wrp" v-for="(item, index) in iconDataEdit" :key="index">
            <img class="icon-del" src="../../../../assets/img/cms/del_icon.png" v-if="iconDataEdit.length >1" @click="handleDelIcon(index)"/>
            <div style="padding-right: 10px" >
              <img src="@/assets/img/cms/icon_sort.png" title="排序"/>
            </div>
            <div class="upload-box" style="width: 74px;">
              <el-upload
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="(res,file)=>{return handleAvatarSuccess(res,file,item,index)}"
                :headers="uploadHeaders"
                :data="{size:500}"
                :before-upload="beforeAvatarUpload"
                class="avatar-uploader">
                <img class="avatar" :src="item.imgUrl" v-if="item.imgUrl">
                <i class="el-icon-plus avatar-uploader-icon" v-else></i>
              </el-upload>
            </div>
            <div class="flex-item add-content">
              <p class="add-link" v-if="!item.jumpPage || item.jumpPage == 4">链接：<a href="javascript:;" @click="addLink(item,index)">添加链接</a></p>
              <template v-if="item.linkAddress">
                <template v-if="item.jumpPage == 0">
                  <p class="had-link">链接：{{item.linkAddress.name}}<span v-if="item.linkAddress.keywords">({{item.linkAddress.topClassName}}{{item.linkAddress.keywords}})</span><i class="iconfont icon-edit" style="cursor:pointer" @click="addLink(item,index)"></i></p>
                </template>
                <template v-if="item.jumpPage == 2">
                  <p class="had-link">链接：{{item.linkAddress.drugCommonName}}<i class="iconfont icon-edit" style="cursor:pointer" @click="addLink(item,index)"></i></p>
                </template>
                <template v-if="item.jumpPage == 1 || item.jumpPage == 3">
                  <p class="had-link">链接：{{item.linkAddress.outlink}}<i class="iconfont icon-edit" style="cursor:pointer" @click="addLink(item,index)"></i></p>
                </template>
              </template>
              <div class="input-box flex-wrp">
                <label>文本：</label>
                <el-input class="flex-item" v-model="item.txt"></el-input>
              </div>
            </div>
          </div>
        </draggable>
        <div class="add-btn-padding" v-if="iconDataEdit.length < 10">
          <div class="add-btn" @click="addIcon"><i class="el-icon-plus avatar-uploader-icon"></i> 添加图片 {{iconDataEdit.length}}/10</div>
        </div>
      </div>
    </div>
    <div class="fixed-footer">
      <el-button size="small" @click="reset">重置</el-button>
      <el-button type="primary" size="small" @click="saveIcon">保存</el-button>
    </div>
    <link-dialog :addLinkDialog='linkDialogVisible' :itemInfo = 'itemInfo' @closeLinkDialog='closeLinkDialog' @submitLink="submitLink"></link-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import {bus} from "../../../../bus.js";
import linkDialog from './linkDialog'
import img_api from "../../../../api/api_homeSetting"

export default {
  name:"addIcon",
  data(){
    return{
      isShowIcon: false,
      linkDialogVisible: false,
      uploadUrl: "",
      uploadHeaders: {Authorization: ''},//token
      iconDataEdit: [],
      itemInfo: {}, // 传递给linkDialog的信息
      draggableOptions: {
        group: 'setting',//名字
        sort: true, //内部排序
        animation: 150, // ms, 动画速度运动项目排序时
        ghostClass: 'sortable-ghost', // 设置拖动元素的class的占位符的类名。
        chosenClass: 'chosenClass',// 设置被选中的元素的class
        scroll: true,
      },
    }
  },
  props:{
    'iconData':{
      type: Array,
      default() {
        return []
      }
    }
  },
  components:{draggable,linkDialog},
  watch:{
    'iconData'(val) {
      let arr = JSON.parse(JSON.stringify(val));
      if(arr.length <= 0) {
        let item  = {
          imgUrl: "",
          txt: "",
          jumpPage: ""
        }
        this.iconDataEdit.push(item)
      } else {
        this.iconDataEdit = JSON.parse(JSON.stringify(val));
      }
    }
  },
  created(){
    bus.$on("editOpr", (val) => {
      // console.log(val)
      if(val == 'icon') {
        this.isShowIcon = true;
      } else {
        this.isShowIcon = false;
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
        item.imgUrl = res.resPath;
        this.$set(this.iconDataEdit, index, item);//解决图片更新，界面视图无更新问题
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
        let width = 85;
        let height = 85;
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
      this.$message.error("图片尺寸必须是85px*85px")
        return Promise.reject();
      });
      return isSize;
    },
    // 添加链接
    addLink(item,index){
      this.itemInfo = item;
      this.itemInfo.idx = index;
      this.linkDialogVisible = true;
    },
    closeLinkDialog(){
      this.itemInfo = {};
      this.linkDialogVisible = false;
    },
    submitLink(obj){
      this.iconDataEdit[obj.idx] = obj;
      this.linkDialogVisible = false;
      this.itemInfo = {};
    },
    // 添加icon
    addIcon(){
      if(this.iconDataEdit.length >=  10) {
        return;
      }
      let item  = {
        imgUrl: "",
        txt: "",
        jumpPage: 0
      }
      this.iconDataEdit.push(item)
    },
     // 删除icon
    handleDelIcon(index){
      this.$confirm("确认要删除吗")
      .then(_ => {
        this.iconDataEdit.splice(index,1);
      })
      .catch(_ => {});

    },
    // 重置
    reset(){
      this.$confirm("确认要重置吗")
      .then(_ => {
        this.iconDataEdit = [];
        let item  = {
          imgUrl: "",
          txt: "",
          jumpPage: ""
        }
        this.iconDataEdit.push(item)
      })
      .catch(_ => {});
    },
    // 保存
    saveIcon(){
      for (let i=0; i< this.iconDataEdit.length; i++) {
        let item = this.iconDataEdit[i];
        if (!item.imgUrl) {
          this.$message.error("请上传icon图！")
          return;
        }
        // 链接可为空
        if(!item.jumpPage) {
          this.iconDataEdit[i].linkAddress = {};
        }
        if(!item.txt) {
          this.$message.error("请填写文本！")
          return;
        }
      }
      if(this.iconDataEdit.length < 5) {
        this.$message.error("icon至少要设置5个！")
        return;
      }
      this.isShowIcon = false;
      this.$emit("submitIconData", this.iconDataEdit)
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
