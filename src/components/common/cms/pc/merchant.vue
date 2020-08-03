<template>
  <!--商家推荐-->
  <div class="merchant_recommendation">
    <div class="merchant_setting">
      <div class="merchant_nav">
        <span class="merchant_title_default" :class="{merchant_title:navBar.title}" @click="selectEditBar('',-2)">{{navBar.title || '标题'}} </span>
        <span class="merchant_min_title_default"
              :class="{merchant_min_title:navBar.subtitle}"
              @click="selectEditBar('',-2)">{{navBar.subtitle || '副标题'}}</span>
        <span class="merchant_more" v-show="navBar.moreButton=='0'">更多> </span>
      </div>
    </div>
    <div class="merchant_content_setting">
      <swiper :options="swiperOption">
        <swiper-slide class="merchant_info" :style="{borderColor:selectItemIndex==index?'#00b78d':''}"
                      v-for="(item,index) in merchantDataList" :key="index">
          <div class="info_content_wrap"
               @click.stop="selectEditBar(item,index)">
            <div class="merchant_content_img">
              <div class="merchant_content_img_default" :style="{  background:item.imgUrl?'':'#EFEFEF' }">
                <img :src="item.imgUrl" v-if="item.imgUrl" style="width: 100%;height: 100%"/>
                <i class="iconfont icon-tupian-copy-copy" v-else></i>
              </div>

            </div>
            <div class="merchant_info_button" :style="{  background:item.imgUrl?'#00B78D':'#D7D7D7' }">进入商家店铺</div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
    <div class="merchant_batch_setting">
      <span @click="selectEditBar('',-1)">批量设置</span>
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
      <div class="dialog_body" style="max-height: 600px">
        <p class="floor_setting" v-if="selectItemIndex<0">楼层信息</p>
        <div class="cms_dialog_content" v-if="selectItemIndex<0">
          <div class="setting_input_wrap">
            <span class="setting_item_title"><span class="required_field">*</span>标题</span>
            <el-input v-model="editNavBar.title" maxlength="5" show-word-limit style="width: 150px"
                      size="small"></el-input>
            <span class="setting_item_title2">副标题</span>
            <el-input v-model="editNavBar.subtitle" maxlength="8" show-word-limit style="width: 150px"
                      size="small"></el-input>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title" style="width: 160px">是否有【更多按钮】</span>
            <el-radio-group v-model="editNavBar.moreButton">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </div>
          <div class="setting_input_wrap" v-if="editNavBar.moreButton=='0'">
            <span class="setting_item_title">跳转页面</span>
            <el-radio-group v-model="editNavBar.jumpPage">
              <el-radio :label="0" disabled>指定商品</el-radio>
              <el-radio :label="1" disabled>促销活动</el-radio>
              <el-radio :label="2" disabled>其他店铺</el-radio>
              <el-radio :label="3">外部链接</el-radio>
            </el-radio-group>
          </div>
          <div class="setting_input_wrap" v-if="editNavBar.moreButton=='0'">
            <span class="setting_item_title"></span>
            <el-input v-model="editNavBar.linkAddress" size="small" style="width: 355px"></el-input>
            <div class="query_button" v-if="editNavBar.jumpPage=='0' || editNavBar.jumpPage=='2'">查询</div>
          </div>
        </div>
        <div class="cms_dialog_add_button"
             v-if="editMerchantData && editMerchantData.length>0 && selectItemIndex=='-1'" @click="addMerchant">
          <i class="iconfont icon-add-fill"></i>
          <span>新增商家</span>
        </div>
        <div class="cms_dialog_content" v-for="(item,index) in editMerchantData" :key="index">
          <!--只有在批量设置的时候才会出现删除按钮-->
          <img src="../../../../assets/img/cms/del_icon.png" class="cms_del_icon"
               v-if="editMerchantData && editMerchantData.length>0 && selectItemIndex=='-1'"
               @click="delItem(index)"/>
          <div>
            <span class="setting_item_title">活动日期</span>
            <el-date-picker
              v-model="item.eventDate"
              type="date" size="small" :picker-options="pickerOptions" :editable="false" value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"

              style="width: 270px">
            </el-date-picker>
            <span class="setting_item_hint">不填则表示长期有效</span>
          </div>
          <div class="setting_input_wrap" style="margin-top: 25px">
            <span class="setting_item_title"><span class="required_field">*</span>商家logo</span>
            <div class="merchant_img_wrap">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :data="{size:200}"
                :on-success="(res,file)=>{return handleAvatarSuccess(res,file,item,index)}"
                :headers="uploadHeaders"
                :before-upload="beforeAvatarUpload">
                <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span>图片尺寸：222px*61px    图片大小：200kb以内</span>
            </div>
            <span class="setting_item_title2"><span class="required_field">*</span>排序</span>
            <el-input v-model="item.sort" onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" style="width: 70px"
                      size="small"></el-input>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title">跳转页面</span>
            <el-radio-group v-model="item.jumpPage">
              <el-radio :label="0" disabled>指定商品</el-radio>
              <el-radio :label="1" disabled>促销活动</el-radio>
              <el-radio :label="2" disabled>无</el-radio>
              <el-radio :label="3">外部链接</el-radio>
            </el-radio-group>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title"></span>
            <el-input v-model="item.linkAddress" size="small" style="width: 355px"></el-input>
            <div class="query_button" v-if="item.jumpPage=='0' || item.jumpPage=='2'">查询</div>
          </div>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="merchantSubmitData"
                 >保存</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import img_api from "../../../../api/api_homeSetting"

  export default {
    name: "merchant",
    props: {
      merchantData: {
        type: Object,
        default() {
          return []
        }
      }, //数据
      fIndex: Number, //组件在集合中的下标
      compare: {
        type: Function,
        default: null
      },//父级的排序方法
    },
    watch: {
      //每次数据发送改变就重新赋值
      merchantData: {
        handler(newVal) {
          // console.log("merchant")
          this.initData(newVal);
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        swiperOption: {
          slidesPerView: 4,
          spaceBetween: 10,
          slidesPerGroup: 4,
          loop: false,
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        navBar: {
          title: "",
          subtitle: "",
          moreButton: 0,//是否有更多按钮 0是 1否
          jumpPage: 3,
          linkAddress: ""
        },
        editNavBar: {title: "", subtitle: "", moreButton: 0, jumpPage: 3, linkAddress: ""},
        merchantDataList: [],
        selectItemIndex: -1,//点击选中的商家推荐  -1表示批量设置 ， -2表示点击导航栏设置title楼层信息
        dialogVisible: false,
        dialogTitle: "批量设置",
        editMerchantData: [], //被编辑的数据 批量的或者单个的
        uploadUrl: "",
        uploadHeaders: {Authorization: ''},//token
        loading: null,
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
          }
        },
      }
    },
    created() {
      this.uploadUrl = img_api.upload();
    },
    methods: {
      initData(val) {
        this.merchantDataList = val.data;
        this.navBar = val.navBar;
        this.editNavBar = Object.assign({}, this.navBar)//深copy，防止改动数据时影响到原数据
      },
      /*选择设置*/
      selectEditBar(item, index) {
        this.dialogVisible = true;
        this.selectItemIndex = index;
        // this.editNavBar = Object.assign({}, this.navBar)//深copy，防止改动数据时影响到原数据
        this.editMerchantData = [];
        if (item && index >= 0) { //点击单个设置
          this.dialogTitle = "编辑商家推荐"
          let temporaryData = Object.assign({}, item)//深copy，防止改动数据时影响到原数据
          this.editMerchantData.push(temporaryData)
        } else if (!item && index == -1) { //点击批量设置
          this.dialogTitle = "批量设置";
          this.editMerchantData = JSON.parse(JSON.stringify(this.merchantDataList));//深copy数组，为了防止改动的值影响merchantDataList里的值
        } else if (!item && index == -2) {
          this.dialogTitle = "编辑楼层信息"
        }
      },
      //删除
      delItem(index) {
        this.$confirm('确认删除?', '提示', {
          type: 'warning'
        }).then(() => {
          this.editMerchantData.splice(index, 1);
        }).catch(() => {
        });
      },
      //添加
      addMerchant() {
        let item = {
          eventDate: "",
          imgUrl: "",
          sort: "",
          jumpPage: 3,
          linkAddress: ""
        }
        this.editMerchantData.unshift(item);
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
      //提交数据
      merchantSubmitData() {
        if (this.selectItemIndex < 0) {
          if (!this.editNavBar.title) {
            this.$message.error("请填写楼层标题！")
            return;
          }
          if (this.editNavBar.moreButton == '0' && !this.editNavBar.linkAddress) {
            this.$message.error("请填写跳转页面！")
            return;
          }
        }
        let itemLenght = this.editMerchantData.length;
        for (let i = 0; i < itemLenght; i++) {
          let item = this.editMerchantData[i];
          if (!item.imgUrl) {
            this.$message.error("请上传商家logo！")
            return;
          }
          if (!item.sort) {
            this.$message.error("请填写排序顺序！")
            return;
          } else if (item.sort == '0') {
            this.$message.error("排序顺序不能为0！")
            return;
          }
        }
        let mrchantData = {
          navBar: this.editNavBar,
          data: []
        };
        //表示该的是楼层信息。没有新商家推荐列表，所以赋值原来的数据
        /* if (this.selectItemIndex == '-2') {
           mrchantData.data = this.merchantDataList;
         } */
        if (this.selectItemIndex >= 0) { //表示单个编辑商品推荐信息，修改this.merchantDataList下标下的商品信息
          this.merchantDataList[this.selectItemIndex] = Object.assign({}, this.editMerchantData[0])
        }
        else if (this.selectItemIndex == "-1") { //表示批量设置，代表着所有的元素都有可能会改变
          this.merchantDataList = JSON.parse(JSON.stringify(this.editMerchantData));
        }
        this.merchantDataList.sort(this.compare('sort'));//把集合根据sort进行排序
        mrchantData.data = JSON.parse(JSON.stringify(this.merchantDataList));
        this.dialogVisible = false;
        this.$emit("merchantSubmitData", mrchantData, this.fIndex);
      },

      handleClose() {
     /*   this.$confirm('确认关闭?', '提示', {
          type: 'warning'
        }).then(() => {
          done();
        }).catch(() => {

        });*/
        this.dialogVisible = false
      },
      handleAvatarSuccess(res, file, item, index) {
        if (this.loading) {
          this.loading.close();
        }
        if (res.code == 0) {
          item.imgUrl = res.resPath;
          this.$set(this.editMerchantData, index, item);//解决图片更新，界面视图无更新问题
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
         this.$message.error('上传图片的大小不能超过 200KB!');
          return false;
        }
        const isSize = new Promise(function(resolve, reject) {
          let width = 222;
          let height = 61;
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
        this.$message.error("图片尺寸必须是222px*61px")
          return Promise.reject();
        });
        return isSize;
      },
    },
  }
</script>

<style lang="scss">
  .merchant_recommendation {
    width: 1020px;
    position: relative;
    .merchant_setting {
      width: 900px;
      .merchant_nav {
        font-size: 12px;
        color: #999;
        .merchant_title_default {
          display: inline-block;
          background: #EFEFEF;
          padding: 8px 36px;
          vertical-align: bottom;
          cursor: pointer;
        }
        .merchant_title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          background: initial;
          padding: initial;
          line-height: 25px;
        }
        .merchant_min_title_default {
          display: inline-block;
          background: #EFEFEF;
          padding: 3px 30px;
          vertical-align: bottom;
          cursor: pointer;
        }
        .merchant_min_title {
          margin-left: 10px;
          color: #666666;
          background: initial;
          padding: initial;
        }

        .merchant_more {
          float: right;
        }
      }
    }

    .merchant_content_setting {
      width: 900px;
      height: 150px;
      margin-top: 5px;
      box-sizing: border-box;
      .merchant_info {
        width: 217px;
        height: 149px;
        border: 1px solid rgba(222, 222, 222, 1);
        padding: 16px 25px;
        box-sizing: border-box;
        .info_content_wrap {
          display: inline-block;
          width: auto;
          height: auto;
          cursor: pointer
        }
        .merchant_content_img {
          height: 75px;
          border-bottom: 1px solid rgba(222, 222, 222, 1);
          margin-bottom: 14px;
          .merchant_content_img_default {
            width: 167px;
            height: 46px;
            text-align: center;
            line-height: 46px;
            color: #CECECE;
            position: relative;
            i {
              font-size: 22px;
            }
          }
        }
        .merchant_info_button {
          margin: 0 auto;
          width: 100px;
          height: 23px;
          border-radius: 5px;
          text-align: center;
          font-size: 12px;
          color: #FFFFFF;
          line-height: 23px;
        }

      }
      .swiper-button-next {
        background-image: url("../../../../assets/img/cms/button-next.png");
        right: 5px;
        width: 16px;
        height: 31px;
      }
      .swiper-button-prev {
        background-image: url("../../../../assets/img/cms/button-prev.png");
        width: 16px;
        height: 31px;
        left: 2px;
      }
    }
    .merchant_batch_setting {
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

    .merchant_img_wrap {
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
        width: 153px;
        height: 43px;
        line-height: 43px;
        text-align: center;
      }
      .avatar {
        width: 153px;
        height: 43px;
        display: block;
      }
      span {
        color: #FF270A;
        font-size: 12px;
      }
    }
  }
</style>
