<template>
  <div class="banner_img">
    <el-carousel :autoplay="false" class="banner_carouse" v-if="bannerImgList.length>0">
      <el-carousel-item v-for="(item,index) in bannerImgList" :key="index"
                        :style="{border:selectItemIndex==index?'1px solid #00b78d': item.imgUrl?'':'1px solid #CECECE'}"
                        style=" box-sizing: border-box;">
        <img :src="item.imgUrl" @click="selectEditBar(item,index)"
             v-if="item.imgUrl"/>
        <div class="banner_default" v-else @click="selectEditBar(item,index)">
          <i class="iconfont icon-tupian-copy-copy"></i>
          <p>banner 图</p>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="banner_carouse " style="position: relative;background: #EFEFEF;" v-else>
      <div class="banner_default">
        <i class="iconfont icon-tupian-copy-copy"></i>
        <p>banner 图</p>
      </div>
    </div>
    <div class="banner_batch_setting" @click="selectEditBar('',-1)">批量设置</div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible"
      width="785px"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="dialog_body" style="max-height: 600px">
        <div class="cms_dialog_add_button" v-if=" selectItemIndex=='-1'" @click="addNavigationBar">
          <i class="iconfont icon-add-fill"></i>
          <span>新增Banner图</span>
        </div>
        <div class="cms_dialog_content" v-for="(item,index) in editBannerImg" :key="index">
          <img src="../../../../assets/img/cms/del_icon.png" class="cms_del_icon"
               v-if="editBannerImg && editBannerImg.length>1 && selectItemIndex=='-1'" @click="delItem(index)"/>
          <div>
            <span class="setting_item_title">活动日期</span>
            <el-date-picker
              v-model="item.eventDate"
              :picker-options="pickerOptions"
              type="date" size="small" style="width: 270px" :editable="false" value-format="yyyy-MM-dd"
              format="yyyy-MM-dd">
            </el-date-picker>
            <span class="setting_item_hint">不填则表示长期有效</span>
          </div>
          <div class="setting_input_wrap" style="margin-top: 25px">
            <span class="setting_item_title" style="vertical-align: top">
              <!--<span class="required_field">*</span>-->
              Banner图</span>
            <!--     <el-input v-model="item.columnName" maxlength="6" show-word-limit style="width: 150px"
                           size="medium"></el-input>-->
            <div class="banner_img_wrap">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="(res,file)=>{return handleAvatarSuccess(res,file,item,index)}"
                :headers="uploadHeaders"
                :data="{size:500}"
                :before-upload="beforeAvatarUpload">
                <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="setting_item_title2" style=" vertical-align: top;">
              <!--<span class="required_field">*</span>-->
              排序</span>
              <el-input v-model="item.sort" onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')"
                        style="width: 70px;vertical-align: top"
                        size="small"></el-input>
              <span style="display: block">图片尺寸：744px*440px    图片大小：500kb以内</span>
            </div>

          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title">跳转页面</span>
            <el-radio-group v-model="item.jumpPage">
              <el-radio :label="item.id" v-for="(item,index) in jumpData" :key="index">{{item.val}}</el-radio>
            </el-radio-group>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title"></span>
            <template v-if="item.jumpPage=='0'">
              <el-select v-model="item.linkAddress0" placeholder="请选择" style="width: 120px" size="small">
                <el-option
                  v-for="item in jumpPages"
                  :key="item.id"
                  :label="item.val"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="item.keyword" size="small" placeholder="请输入搜索关键字"
                        style="width: 220px;margin-left: 15px" v-if="item.linkAddress0=='0'"></el-input>
            </template>
            <el-input v-model="item.linkAddress1" size="small" style="width: 355px"
                      v-if="item.jumpPage=='1'"></el-input>
            <el-input v-model="item.linkAddress2" size="small" style="width: 355px"
                      v-if="item.jumpPage=='2'" :readonly="true"></el-input>
            <el-input v-model="item.linkAddress3" size="small" style="width: 355px"
                      v-if="item.jumpPage=='3'"></el-input>
            <div class="query_button" v-if="item.jumpPage=='2'" @click="queryCommodity(item.linkAddress,index)"><i
              class="iconfont icon-chaxun"></i>选择商品
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitBannerData"
                   v-if="editBannerImg && editBannerImg.length>0 ">保存</el-button>
        </span>
    </el-dialog>
    <commodity-dialog :checkboxCommodity="true" :addCommodityDialog='addCommodityDialog'
                      @closeCommodityDialog="closeCommodityDialog"
                      @commoditySubmit="commoditySubmit" :commodityIds="commodityIds"></commodity-dialog>
  </div>
</template>

<script>
  import img_api from "../../../../api/api_homeSetting"
  import commodityDialog from "../../commodityDialog"

  export default {
    name: "bannerImg",
    components: {commodityDialog},
    props: {
      bannerData: {
        type: Array,
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
      compare: {
        type: Function,
        default: null
      },//父级的排序方法
    },
    watch: {
      bannerData: {
        handler(val) {
          // console.log("监控bannerData", val);
          this.initData(val);
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        bannerImgList: [], //展示的集合
        dialogVisible: false,
        dialogTitle: "批量设置",
        editBannerImg: [],//修改的集合
        selectItemIndex: '-1',
        uploadUrl: "",
        uploadHeaders: {Authorization: ''},//token
        loading: null,
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
          }
        },
        addCommodityDialog: false,
        selectIndex: "",//选择查询商品的数据下标
        commodityIds: []
      }
    },
    created() {
      this.uploadUrl = img_api.upload();
    },
    methods: {
      initData(val) {
        this.bannerImgList = val;
      },
      //查询商品
      queryCommodity(item, index) {
        this.addCommodityDialog = true;
        this.selectIndex = index;
        this.commodityIds = [];
        if (item && item.commodityId) {
          this.commodityIds.push(item.commodityId)
        }
      },
      //关闭查询商品窗口
      closeCommodityDialog() {
        this.addCommodityDialog = false;
      },
      //选择商品后
      commoditySubmit(data) {
        let item = this.editBannerImg[this.selectIndex];
        item.linkAddress = data[0];
        item.linkAddress2 = data[0].drugCommonName;
      },
      handleAvatarSuccess(res, file, item, index) {
        if (this.loading) {
          this.loading.close();
        }
        if (res.code == 0) {
          item.imgUrl = res.resPath;
          this.$set(this.editBannerImg, index, item);//解决图片更新，界面视图无更新问题
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
        const isSize = new Promise(function (resolve, reject) {
          let width = 744;
          let height = 440;
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.onload = function () {
            let valid = img.width == width && img.height == height;
            valid ? resolve() : reject();
          }
          img.src = _URL.createObjectURL(file);
        }).then(() => {
          return file;
        }, () => {
          this.$message.error("图片尺寸必须是744px*440px")
          return Promise.reject();
        });
        return isSize;
      },

      //删除
      delItem(index) {
        this.$confirm('确认删除?', '提示', {
          type: 'warning'
        }).then(() => {
          this.editBannerImg.splice(index, 1);
        }).catch(() => {
        });
      },
      //添加
      addNavigationBar() {
        if (this.editBannerImg.length >= 4) {
          this.$message.error("最多只有4张Banner图")
          return;
        }
        this.editBannerImg.unshift({eventDate: "", imgUrl: "", sort: "", jumpPage: 0, linkAddress0: "0"});
      },
      selectEditBar(item, index) {
        this.dialogVisible = true;
        this.editBannerImg = [];
        this.selectItemIndex = index;
        if (item && index >= 0) {
          let temporaryData = Object.assign({}, item)//深copy，防止改动数据时影响到原数据
          this.editBannerImg.push(temporaryData);
          this.dialogTitle = "编辑Banner图"
        } else if (!item && index == '-1') {
          this.dialogTitle = "批量设置"
          this.editBannerImg = JSON.parse(JSON.stringify(this.bannerImgList));//深copy数组，为了防止改动的值影响merchantDataList里的值
        }
      },
      submitBannerData() {
        let itemLenght = this.editBannerImg.length;
        for (let i = 0; i < itemLenght; i++) {
          let item = this.editBannerImg[i];
          let status = this.$utils.jumpPageSetting(item);
          if (!status) {
            this.$message.error("请输入搜索关键字")
            return;
          }
          if (!item.imgUrl) {
            this.$message.error("请上传Banner图！")
            return;
          }
          if (!item.sort) {
            this.$message.error("请填写排序顺序！")
            return;
          } else if (item.sort == '0') {
            this.$message.error("排序顺序不能为0！")
            return;
          }

          if (item.jumpPage != '4' && !item.linkAddress) {
            this.$message.error("请填写跳转页面！")
            return;
          }
        }

        if (this.selectItemIndex >= 0) {
          this.bannerImgList[this.selectItemIndex] = Object.assign({}, this.editBannerImg[0])
        } else if (this.selectItemIndex == '-1') {
          this.bannerImgList = JSON.parse(JSON.stringify(this.editBannerImg));
        }
        this.bannerImgList.sort(this.compare('sort'));//把集合根据sort进行排序
        this.dialogVisible = false;
        this.$emit("submitBannerData", this.bannerImgList)
      },
      handleClose() {
        /* this.$confirm('确认关闭?', '提示', {
           type: 'warning'
         }).then(() => {
           done();
         }).catch(() => {

         });*/
        this.dialogVisible = false;
      },
    },
  }
</script>

<style lang="scss">
  .banner_img {
    width: 1020px;
    min-height: 330px;
    position: relative;
    .banner_carouse {
      height: 330px;
      width: 557px;
      margin: auto;
      box-sizing: border-box;
      .el-carousel__container {
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
    .banner_default {
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #CECECE;
      font-size: 22px;
      i {
        font-size: 50px;
      }
    }
    .banner_batch_setting {
      color: #6CA3F0;
      position: absolute;
      /*left: 92%;*/
      top: -5px;
      cursor: pointer;
      right: 50px;
    }
    .banner_img_wrap {
      display: inline-block;
      vertical-align: middle;
      .avatar-uploader {
        width: 101px;
        display: inline-block;
      }
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
        width: 101px;
        height: 60px;
        line-height: 60px;
        text-align: center;
      }
      .avatar {
        width: 101px;
        height: 60px;
        display: block;
      }
      span {
        color: #FF270A;
        font-size: 12px;
      }
    }
  }
</style>

