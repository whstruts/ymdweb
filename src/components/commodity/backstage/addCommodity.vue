<template>
  <div class="add_commodity">
    <div class="product_content">
      <fieldset class="cms_dialog_content" style="padding: 10px 20px;margin-bottom: 10px">
        <legend>商品信息</legend>
        <div class="flex-row" style="align-items: initial">
          <img :src="productInfo.drugImg" class="commodity_img"/>
          <div class="commodity_info">
            <p class="text_overflow" :title="productInfo.drugName">产品名称：{{productInfo.drugName}}</p>
            <p class="text_overflow" :title="productInfo.approveNumber">批准文号：{{productInfo.approveNumber}}</p>
          </div>
          <div class="commodity_info">
            <p class="text_overflow" :title="productInfo.drugCommonName">通&nbsp;&nbsp;用&nbsp;名：{{productInfo.drugCommonName}}</p>
            <!--<p>批准文号有效期：{{productInfo.approveEndTime}}</p>-->
            <p class="text_overflow" :title="productInfo.typeCodeName">所属分类：{{productInfo.typeCodeName}}</p>
          </div>
          <div class="commodity_info " style="width: 260px">
            <p class="text_overflow" :title="productInfo.manufacturer"> 生产厂家：{{productInfo.manufacturer}}</p>
            <p class="text_overflow" :title="productInfo.recipeType">处方分类：{{productInfo.recipeType}}</p>
          </div>
        </div>

      </fieldset>
      <fieldset class="cms_dialog_content " style="padding: 10px 20px;margin-bottom: 10px">
        <legend>完善规格属性</legend>
        <!--<p class="title_hint"><span class="circle"></span><span>完善规格属性</span></p>-->
        <p class="important_hint">以下为必填项，填写错误影响商品发布</p>
        <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="80px" class="add_product_form">
          <div class="flex-row">
            <el-form-item label="规格" prop="specifications">
              <el-input v-model="formData.specifications" clearable size="mini" style="width: 180px"></el-input>
            </el-form-item>
            <el-form-item label="包装单位" prop="packageUnit">
              <el-input v-model="formData.packageUnit" clearable  size="mini" style="width: 110px"></el-input>
            </el-form-item>
            <el-form-item label="中包装数量" prop="mediumPackage" style="margin-left: 15px">
              <el-input v-model="formData.mediumPackage" clearable
                        @change="checkNo(formData.mediumPackage,'mediumPackage')" size="mini"
                        style="width: 110px"></el-input>
            </el-form-item>
            <el-form-item label="大包装数量" prop="largePackage" style="margin-left: 15px">
              <el-input v-model="formData.largePackage" clearable
                        @change="checkNo(formData.largePackage,'largePackage')" size="mini"
                        style="width: 110px"></el-input>
            </el-form-item>
          </div>
          <!--      <div class="flex-row">
                  <el-form-item label="条形码" prop="barCode">
                    <el-input v-model="formData.barCode"></el-input>
                  </el-form-item>
                  <el-form-item label="包装单位" prop="packageUnit">
                    <el-input v-model="formData.packageUnit"></el-input>
                  </el-form-item>
                </div>-->
          <el-form-item label="用法用量" prop="usageDosage">
            <el-input v-model="formData.usageDosage" clearable size="mini"></el-input>
          </el-form-item>
        </el-form>

        <div style="position: relative">
          <p class="important_hint"><i class="iconfont icon-xinghao"></i>
            <span>SKU图片上传，提高用户直观体验</span>
            <span style="margin-left: 30px;color: #F67A16">图片尺寸：372px*372px    图片大小：300kb以内</span>
            <el-popover
              placement="left-start"
              popper-class="setting_popover_style"
              :offset="300"
              trigger="click">
              <img src="../../../assets/img/commodity/commodity_hint_img.png"/>
              <span class="picture_schematic" slot="reference">图片示意图</span>
            </el-popover>

          </p>
          <div class="flex-row">
            <div class="commodity_img_bg" v-for="(item,index ) in imgData" :key="index" @mouseenter="mouseEnter(index)"
                 @mouseleave="mouseLeave">
            <span class="add_hint_commodity_img" :class="{'add_hint_commodity_img2':item.imgUrl }"
                  :style="{display:!item.imgUrl || index==isActive?'block':'none'}">{{item.value}}</span>
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="(res,file)=>{return handleAvatarSuccess(res,file,item,index)}"
                :headers="uploadHeaders"
                :data="{size:300}"
                accept="image/jpeg,image/png"
                :before-upload="beforeAvatarUpload">
                <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <p>
             <!--   <el-popover
                  placement="right"
                  trigger="click" v-if="item.imgUrl">
                  <img :src="item.imgUrl"/>
                  <span class="preview_img" slot="reference">预览</span>
                </el-popover>
                 <span class="preview_img" v-else>预览</span>
                -->
                <span class="preview_img" @click="reviewImag(item.imgUrl)" >预览</span>
                <span class="delete_img" @click="deleteImg(index,item.value)">删除</span>
              </p>
            </div>
          </div>
          <!-- <div class="qr_code_wrap">
            <p>扫描下方二维码 </p>
            <p> 支持移动端上传图片</p>
            <img src="../../../assets/img/commodity/qr_code_icon.png"/>
          </div> -->
        </div>
        <div style="margin-top: 30px;" class="flex-row" v-if="review">
          <span>审核意见：</span>
          <el-input v-model="formData.remark" clearable type="textarea" :rows="3" style="width: 90%"></el-input>
        </div>
      </fieldset>
   <!--   <div style="text-align: center;padding-bottom: 10px" v-if="!review">
        <div class="from_button from_button_default" @click="resetForm">取消</div>
        <div class="from_button from_button_setting" @click="submitData">{{formData.drugSkuId?'确认更新':'保存'}}</div>
      </div>
      <div style="text-align: center;padding-bottom: 10px" v-if="review">
        <div class="from_button from_button_default" @click="reviewData(false)">暂不进产品库</div>
        <div class="from_button from_button_setting" @click="reviewData(true)">同意进产品库</div>
      </div>-->
    </div>

    <span class="dialog-footer-bg" v-if="!review">
           <el-button @click="resetForm">取 消</el-button>
           <el-button type="primary" @click="submitData">{{formData.drugSkuId?'确认更新':'保存'}}</el-button>
      </span>
    <span class="dialog-footer-bg" v-if="review">
           <el-button @click="reviewData(false)">暂不进产品库</el-button>
           <el-button type="primary" @click="reviewData(true)">同意进产品库</el-button>
      </span>

  </div>
</template>

<script>
  import commodity_api from "../../../api/api_commodity"

  export default {
    name: "addCommodity",
    props: {
      productInfo: {
        type: Object,
        default() {
          return {}
        }
      },
      commodityData: {
        type: Object,
        default() {
          return {}
        }
      },
      review: {
        type: Boolean, //true 代表从商品审核中过来的。。false 从商品维护中过来的
        default() {
          return false
        }
      }
    },
    watch: {
      commodityData: {
        handler(val) {
          console.log(val, "商品信息")
          this.initData(val)
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        formData: {},
        rules: {
          specifications: [{required: true, message: '请输入规格', trigger: 'blur'}],
          packageUnit: [{required: true, message: '请输入包装单位', trigger: 'blur'}],
          mediumPackage: [{required: true, message: '请输入中包装数量', trigger: 'blur'}],
          largePackage: [{required: true, message: '请输入大包装数量', trigger: 'blur'}],
          usageDosage: [{required: true, message: '请输入用法用量', trigger: 'blur'}],
          // barCode: [{required: true, message: '请输入条形码', trigger: 'blur'}],
          remark: [{required: true, message: '请输入审批意见', trigger: 'blur'}],
        },
        uploadUrl: "",
        uploadHeaders: {Authorization: ''},//token
        imgData: [
          {key: 'frontView', value: '正面图', imgUrl: ""},
          {key: 'leftView', value: '左侧面图', imgUrl: ""},
          {key: 'rightView', value: '右侧面图', imgUrl: ""},
          {key: 'barCodeImg', value: '条码面图', imgUrl: ""},
          {key: 'unpackView', value: '拆包装图', imgUrl: ""},
          {key: 'specificationView', value: '说明书', imgUrl: ""}
        ],
        isActive: ""
      }
    },
    created() {
      this.uploadUrl = commodity_api.upload();

    },
    methods: {
      //判断只能输入数字
      checkNo(value, item) {
        let reg = /^[0-9]\d*$/;
        if (value) {
          if (value > 999999 || new RegExp(reg).test(value) == false) {
            this.$message.error("包装数量只能输入数字")
            setTimeout(() => {
              this.formData[item] = "";
            }, 500);
          }
        }
      },
      initData(val) {
        this.formData = Object.assign({}, val);
        let imgLength = this.imgData.length;
        if (val) {
          for (let key in val) {
            for (let i = 0; i < imgLength; i++) {
              let item = this.imgData[i];
              if (item.key == key) {
                this.$set(this.imgData[i], 'imgUrl', val[key])
                break;
              }
            }
          }
        } else {
          for (let i = 0; i < imgLength; i++) {
            this.$set(this.imgData[i], 'imgUrl', "")
          }
        }
      },

      reviewData(status) {
        if (this.review && !this.formData.remark) {
          this.$message.error("请填写审批意见");
          return;
        }
        if (status) {
          this.$refs["ruleForm"].validate(valid => {
            if (valid) {
              let imgLength = this.imgData.length;
              for (let i = 0; i < imgLength; i++) {
                let item = this.imgData[i];
                if (!item.imgUrl) {
                  this.$message.error("请上传" + item.value);
                  return;
                }
              }

              for (let i = 0; i < imgLength; i++) {
                let item = this.imgData[i];
                this.$set(this.formData, item.key, item.imgUrl);
              }
              let param = Object.assign({}, this.formData);
              param.drugId = this.productInfo.drugId;
              commodity_api.audit(param).then(res => {
                if (res.code == 0) {
                  this.$message.success(res.msg)
                  this.$refs["ruleForm"].resetFields();
                  this.$emit("reviewData")
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
          })
        } else {
          let param = Object.assign({}, this.formData);
          commodity_api.refuse(param).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg)
              this.$refs["ruleForm"].resetFields();
              this.$emit("reviewData")
            } else {
              this.$message.error(res.msg)
            }
          })
        }

      },
      resetForm() {
        this.$refs["ruleForm"].resetFields();
        this.$emit("closeDialog")
      },
      submitData() {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            let imgLength = this.imgData.length;
            for (let i = 0; i < imgLength; i++) {
              let item = this.imgData[i];
              if (!item.imgUrl) {
                this.$message.error("请上传" + item.value);
                return;
              }
            }
            for (let i = 0; i < imgLength; i++) {
              let item = this.imgData[i];
              this.$set(this.formData, item.key, item.imgUrl);
            }
            let param = Object.assign({}, this.formData);
            param.drugId = this.productInfo.drugId;
            if (this.formData.drugSkuId) { //更新商品
              commodity_api.uploadCommodity(param).then(res => {
                if (res.code == 0) {
                  this.$message.success(res.msg)
                  this.$emit("submitProductData")
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else { //保存商品
              commodity_api.saveCommodity(param).then(res => {
                if (res.code == 0) {
                  this.$message.success(res.msg)
                  this.$emit("submitProductData")
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
          }
        })
      },
      //预览图片
      reviewImag(imgUrl){
        // window.location.href=imgUrl;
        window.open(imgUrl);
      },
      //删除图片
      deleteImg(index, value) {
        this.$confirm('确认删除' + value + '?', '提示', {
          type: 'warning'
        }).then(() => {
          this.imgData[index].imgUrl = "";
          done();
        }).catch(() => {

        });
      },
      //   鼠标移入
      mouseEnter(index) {
        this.isActive = index;
      },
      //   鼠标移除
      mouseLeave() {
        this.isActive = null;
      },
      handleAvatarSuccess(res, file, item, index) {
        if (this.loading) {
          this.loading.close();
        }
        if (res.code == 0) {

          this.$set(item, 'imgUrl', res.resPath);//解决图片更新，界面视图无更新问题
          console.log(this.imgData)
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
          return this.$confirm('图片大小不能超过500KB，是否确认压缩?', '提示', {
            type: 'warning'
          }).then(() => {
            this.loading = this.$loading({
              lock: true,
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.4)'
            });
            return true;
          }).catch(() => {
            return false;
          });
        }
        return true;
      },

    }
  }
</script>

<style lang="scss">
  .add_commodity {
    .product_content {
      height: 510px;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 13px 20px 0px;
      box-sizing: border-box;
    }
    .cms_dialog_content {
      padding: 26px 30px;
      align-items: initial;
      .commodity_img {
        width: 78px;
        height: 68px;
      }
      .commodity_info {
        margin-left: 40px;
        width: 200px;
        p {
          line-height: 30px;
          color: #333;
        }
      }
    }
    .picture_schematic {
      margin-left: 35px;
      color: #0680FD;
      line-height: 16px;
      border-bottom: 1px solid #0680FD;
      cursor: pointer;
    }
    .qr_code_wrap {
      position: absolute;
      top: 20px;
      right: 40px;
      text-align: center;
      p {
        color: #333;
        text-align: center;
        line-height: 15px;
        margin-bottom: 10px;
        font-size: 12px;
      }
      img {
        width: 83px;
        height: 83px;
      }
    }
    .commodity_img_bg {
      display: inline-block;
      vertical-align: middle;
      position: relative;
      margin-right: 28px;
      .add_hint_commodity_img {
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        display: inline-block;
        text-align: center;
        line-height: 22px;
        background: rgba(247, 247, 247, 1);
        color: #666666;
        z-index: 100;
      }
      .add_hint_commodity_img2 {
        background: rgba(0, 0, 0, 0.4);
        color: #fff;
      }
      .avatar-uploader {
        display: inline-block;
        width: 90px;
      }
      .avatar-uploader .el-upload {
        border: 1px dashed #DEDEDE;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #00b78d;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #DEDEDE;
        width: 90px;
        height: 90px;
        line-height: 90px;
        text-align: center;
      }
      .avatar {
        width: 90px;
        height: 90px;
        display: block;
      }
      span {
        font-size: 12px;
      }
      .preview_img {
        color: #999999;
        line-height: 18px;
        border-bottom: 1px solid #999999;
        margin-left: 10px;
        cursor: pointer;
        box-sizing: border-box;
      }
      .delete_img {
        color: #999999;
        line-height: 18px;
        border-bottom: 1px solid #999999;
        margin-left: 20px;
        cursor: pointer;
        box-sizing: border-box;
      }
    }
    .el-popover {
      border-radius: 10px;
    }

  }
</style>
