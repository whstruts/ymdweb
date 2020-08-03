<template>
  <!--中缝广告-->
  <div class="ad_wrap">
    <div class="ad_img_setting" :style="{background:adImgData.imgUrl?'':'#EFEFEF'}" @click="selectEditBar">
      <img :src="adImgData.imgUrl" v-if="adImgData.imgUrl"/>
      <i class="iconfont icon-tupian-copy-copy" v-else></i>
    </div>
    <div class="ad_batch_setting">
      <span @click="selectEditBar">设置</span>
      <img src="../../../../assets/img/cms/del_icon.png" @click="delSetting"/>
    </div>
    <div class="my-handle">
      <img src="../../../../assets/img/cms/drag_icon.png"/>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible"
      width="785px"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="dialog_body">
        <div class="cms_dialog_content">
          <div>
            <span class="setting_item_title">活动日期</span>
            <el-date-picker
              v-model="editAdImg.eventDate"
              type="date" size="small" :editable="false" value-format="yyyy-MM-dd"
              format="yyyy-MM-dd" :picker-options="pickerOptions" style="width: 270px">
            </el-date-picker>
            <span class="setting_item_hint">不填则表示长期有效</span>
          </div>
          <div class="setting_input_wrap" style="margin-top: 25px">
            <span class="setting_item_title"><span class="required_field">*</span>广告图</span>
            <!--     <el-input v-model="item.columnName" maxlength="6" show-word-limit style="width: 150px"
                           size="small"></el-input>-->
            <div class="ad_img_wrap">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="(res,file)=>{return handleAvatarSuccess(res,file)}"
                :headers="uploadHeaders"
                :data="{size:200}"
                :before-upload="beforeAvatarUpload">
                <img v-if="editAdImg.imgUrl" :src="editAdImg.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span>图片尺寸：1200px*100px    图片大小：200kb以内</span>
            </div>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title">跳转页面</span>
            <el-radio-group v-model="editAdImg.jumpPage">
              <el-radio :label="item.id" v-for="(item,index) in jumpData" :key="index">{{item.val}}</el-radio>
            </el-radio-group>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title"></span>
            <template v-if="editAdImg.jumpPage=='0'">
              <el-select v-model="editAdImg.linkAddress0" placeholder="请选择" style="width: 120px" size="small">
                <el-option
                  v-for="item in jumpPages"
                  :key="item.id"
                  :label="item.val"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="editAdImg.keyword" size="small" placeholder="请输入搜索关键字"
                        style="width: 220px;margin-left: 15px" v-if="editAdImg.linkAddress0=='0'"></el-input>
            </template>
            <el-input v-model="editAdImg.linkAddress1" size="small" style="width: 355px"
                      v-if="editAdImg.jumpPage=='1'"></el-input>
            <el-input v-model="editAdImg.linkAddress2" size="small" style="width: 355px"
                      v-if="editAdImg.jumpPage=='2'" :readonly="true"></el-input>
            <el-input v-model="editAdImg.linkAddress3" size="small" style="width: 355px"
                      v-if="this.editAdImg.jumpPage=='3'"></el-input>
            <div class="query_button" v-if="editAdImg.jumpPage=='2'" @click="queryCommodity"> <i class="iconfont icon-chaxun"></i>选择商品</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="adSubmitData">保存</el-button>
        </span>
    </el-dialog>
    <commodity-dialog :checkboxCommodity="true"  :addCommodityDialog='addCommodityDialog' @closeCommodityDialog="closeCommodityDialog"
                      @commoditySubmit="commoditySubmit"  :commodityIds="commodityIds"></commodity-dialog>
  </div>
</template>

<script>
  import img_api from "../../../../api/api_homeSetting"
  import commodityDialog from "../../commodityDialog"
  export default {
    name: "ad",
    components: {commodityDialog},
    props: {
      adData: {
        type: Object,
        default() {
          return []
        }
      },
      jumpPages: {
        type: Array,
        default() {
          return []
        }
      },
      jumpData: {
        type: Array,
        default() {
          return []
        }
      },
      fIndex: Number, //组件在集合中的下标
    },
    watch: {
      adData: {
        handler(val) {
          // console.log("监控adData", val);
          this.initData(val);
        },
        deep: true,
        immediate: true
      }
    },

    data() {
      return {
        dialogVisible: false,
        dialogTitle: "设置中缝广告",
        adImgData: {eventDate: "", imgUrl: "", jumpPage: 0, linkAddress0: "0"},
        editAdImg: {eventDate: "", imgUrl: "", jumpPage: 0, linkAddress0: "0"},
        uploadUrl: "",
        uploadHeaders: {Authorization: ''},//token
        loading: null,
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
          }
        },
        addCommodityDialog: false,
        commodityIds:[]
      }
    },
    created() {
      this.uploadUrl = img_api.upload();
    },
    methods: {
      initData(val) {
        this.adImgData = Object.assign({}, val.data[0]);
        this.editAdImg = Object.assign({}, this.adImgData);
      },
      //查询商品
      queryCommodity() {
        this.addCommodityDialog = true;
        this.commodityIds = [];
        if (this.editAdImg.linkAddress && this.editAdImg.linkAddress.commodityId) {
          this.commodityIds.push(this.editAdImg.linkAddress.commodityId)
        }
      },
      //关闭查询商品窗口
      closeCommodityDialog() {
        this.addCommodityDialog = false;
      },
      //选择商品后
      commoditySubmit(data) {
        this.editAdImg.linkAddress = data[0];
        this.editAdImg.linkAddress2 = data[0].drugCommonName;
      },
      //删除
      delItem(index) {
        this.$confirm('确认删除?', '提示', {
          type: 'warning'
        }).then(() => {
          this.editAdImg.splice(index, 1);
        }).catch(() => {
        });
      },
      //删除父组件中的自己
      delSetting() {
        this.$confirm('确认删除?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$emit("delSetting", this.fIndex);
        }).catch(() => {
        });
      },
      selectEditBar() {
        this.dialogVisible = true;
        this.editAdImg = Object.assign({}, this.adImgData);
      },
      adSubmitData() {
        let status = this.$utils.jumpPageSetting(this.editAdImg);
        if (!status) {
          this.$message.error("请输入搜索关键字")
          return;
        }

        if (!this.editAdImg.imgUrl) {
          this.$message.error("请上传广告图")
          return;
        }
        this.dialogVisible = false
        let arr = [];
        arr.push(this.editAdImg)
        this.$emit("adSubmitData", arr, this.fIndex)
      },

      handleAvatarSuccess(res, file) {
        if (this.loading) {
          this.loading.close();
        }
        if (res.code == 0) {
          this.editAdImg.imgUrl = res.resPath;
          this.editAdImg = Object.assign({}, this.editAdImg);
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
        const imgSize = file.size / 1024 / 1024 < 0.2;
        if (!imgSize) {
          this.$message.error('上传图片的大小不能超过200KB!');
          return false;
        }
        const isSize = new Promise(function(resolve, reject) {
          let width = 1200;
          let height = 100;
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
        this.$message.error("图片尺寸必须是1200px*100px")
          return Promise.reject();
        });
        return isSize;
      },

      handleClose() {
        /*  this.$confirm('确认关闭?', '提示', {
            type: 'warning'
          }).then(() => {
            done();
          }).catch(() => {

          });*/
        this.dialogVisible = false;
      }
    },
  }
</script>

<style lang="scss">
  .ad_wrap {
    width: 1020px;
    position: relative;
    .ad_img_setting {
      width: 900px;
      height: 75px;
      text-align: center;
      line-height: 75px;
      cursor: pointer;
      img {
        width: 900px;
        height: 75px;
      }
      i {
        font-size: 28px;
        color: #DEDEDE;
      }
    }
    .ad_batch_setting {
      color: #6CA3F0;
      position: absolute;
      left: 920px;
      top: -5px;

      span {
        vertical-align: middle;
        cursor: pointer;
      }
      img {
        font-size: 20px;
        margin-left: 5px;
        vertical-align: middle;
        cursor: pointer;
      }
    }

    .ad_img_wrap {
      display: inline-block;
      vertical-align: middle;
      .avatar-uploader .el-upload {
        border: 1px dashed #DEDEDE;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #00b78d;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #DEDEDE;
        width: 400px;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
      .avatar {
        width: 400px;
        height: 30px;
        display: block;
      }
      span {
        color: #FF270A;
        font-size: 12px;
      }
    }
  }
</style>
