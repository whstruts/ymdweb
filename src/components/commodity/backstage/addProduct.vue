<template>
  <div class="add_product">
    <div class="product_content">
      <!--  <p class="title_hint" style="padding-left: 40px;"><span class="circle"></span><span>产品基本信息</span></p>-->
      <p class="important_hint" style="padding-left:40px">以下为必填项，填写错误影响商品发布</p>
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="102px" class="add_product_form">
        <div class="flex-row">
          <el-form-item label="商品名称" prop="drugName">
            <el-input v-model="formData.drugName" clearable :disabled="review" size="small"></el-input>
          </el-form-item>
          <el-form-item label="通用名" prop="drugCommonName">
            <el-input v-model="formData.drugCommonName" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="生产厂家" prop="manufacturer">
            <el-input v-model="formData.manufacturer" clearable :disabled="review" size="small"></el-input>
          </el-form-item>
        </div>
        <div class="flex-row">
          <el-form-item label="批准文号" prop="approveNumber">
            <el-input v-model="formData.approveNumber" clearable :disabled="review" size="small"></el-input>
          </el-form-item>
          <!--    <el-form-item label="批准文号效期" prop="approveEndTime">
                <el-date-picker
                  v-model="formData.approveEndTime"
                  type="date" size="small" style="width: 200px" :editable="false" value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>-->
          <el-form-item label="处方分类" prop="recipeType">
            <el-select v-model="formData.recipeType" placeholder="请选择" size="small">
              <el-option
                v-for="item in typeData"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生产厂家简称" prop="manufacturerShort">
            <el-input v-model="formData.manufacturerShort" clearable size="small"></el-input>
          </el-form-item>
        </div>
        <div class="flex-row">

          <el-form-item label="所属分类" prop="types">
            <el-cascader v-model="formData.types" :options="typeCodeData" :props="props" size="small"></el-cascader>
          </el-form-item>
        </div>
        <p class="important_hint" style="padding-left: 42px;margin-top: 10px">填写以下信息方便用户获取更准确的信息</p>
        <div class="flex-row">
          <el-form-item label="剂型">
            <!--<el-input v-model="formData.dosageForm" clearable size="small"></el-input>-->
            <el-select v-model="formData.dosageForm" filterable placeholder="请选择" size="small">
              <el-option
                v-for="item in dosageFormData"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="英文名">
            <el-input v-model="formData.drugEnName" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="性状">
            <el-input v-model="formData.appearance" clearable size="small"></el-input>
          </el-form-item>
        </div>
        <div class="flex-row" style="margin-bottom: 15px">
          <span class="hint_img">图片</span>
          <div class="product_img_wrap">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :headers="uploadHeaders"
              :data="{size:300}"
              accept="image/jpeg,image/png"
              :before-upload="beforeAvatarUpload">
              <img v-if="formData.drugImg" :src="formData.drugImg" class="avatar">

              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span>图片尺寸：420px*420px    图片大小：300kb以内</span>
          </div>
        </div>
        <div style="margin-right: 20px">
          <el-form-item label="成分">
            <el-input v-model="formData.bases" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="适应症/功能主治">
            <el-input v-model="formData.majorFunctions" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="不良反应">
            <el-input v-model="formData.untowardEffect" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="禁忌">
            <el-input v-model="formData.taboo" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="贮藏">
            <el-input v-model="formData.store" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="注意事项">
            <el-input v-model="formData.warnings" type="textarea" clearable :rows="4" size="small"></el-input>
          </el-form-item>
          <el-form-item label="药物相互作用">
            <el-input v-model="formData.drugInteractions" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="审批意见" v-if="review">
            <el-input v-model="formData.remark" type="textarea" :rows="2" size="small" clearable></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--<el-form-item style="text-align: center" v-if="!review">
      <div class="from_button from_button_default" @click="resetForm">取消</div>
      <div class="from_button from_button_setting" @click="submitData">{{formData.drugId?'确认更新':'保存'}}</div>
    </el-form-item>
    <el-form-item style="text-align: center" v-if="review">
      <div class="from_button from_button_default" @click="reviewData(false)">暂不进产品库</div>
      <div class="from_button from_button_setting" @click="reviewData(true)">同意进产品库</div>
    </el-form-item>
    </el-form>
  -->
    <span class="dialog-footer-bg" v-if="!review">
           <el-button @click="resetForm">取 消</el-button>
           <el-button type="primary" @click="submitData">{{formData.drugId?'确认更新':'保存'}}</el-button>
      </span>
    <span class="dialog-footer-bg" v-if="review">
           <el-button @click="reviewData(false)">暂不进产品库</el-button>
           <el-button type="primary" @click="reviewData(true)">同意进产品库</el-button>
      </span>
  </div>
</template>

<script>
  import prodcut_api from "../../../api/api_product"

  export default {
    name: "addProduct",
    props: {
      productData: {
        type: Object,
        default() {
          return {};
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
      productData: {
        handler(val) {
          console.log(val, "产品信息")
          this.initData(val);
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        formData: {
          recipeType: {},
          types: []
        },
        rules: {
          drugName: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
          drugCommonName: [{required: true, message: '请输入通用名', trigger: 'blur'}],
          manufacturer: [{required: true, message: '请输入生产厂家', trigger: 'blur'}],
          approveNumber: [{required: true, message: '请输入批准文号', trigger: 'blur'}],
          // approveEndTime: [{required: true, message: '请选择批准文号有效期', trigger: 'blur'}],
          manufacturerShort: [{required: true, message: '请输入生产厂家简称', trigger: 'blur'}],
          recipeType: [{required: true, message: '请选择处方分类', trigger: 'blur'}],
          types: [{type: 'array', required: true, message: '请选择所属分类', trigger: 'blur'}],
        },
        uploadUrl: "",
        uploadHeaders: {Authorization: ''},//token
        loading: null,
        imgUrl: "",
        props: {
          label: "text",
          children: 'children',
          value: "id"
        },
        typeCodeData: [],
        typeData: ["甲类OTC", "乙类OTC", "处方药RX", "其它"],
        dosageFormData: [],
      }
    },
    created() {
      this.uploadUrl = prodcut_api.upload();
    },
    destroyed() {
      this.$destroy();
    },
    methods: {
      //获取药剂列表
      drugDosageTypeList() {
        prodcut_api.drugDosageTypeList().then(res => {
          if (res.code == 0) {
            this.dosageFormData = res.data;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      initData(val) {
        this.drugDosageTypeList();
        prodcut_api.dtList().then(res => {
          if (res.code == 0) {
            this.typeCodeData = this.$utils.getTreeData(res.data);
            this.formData = Object.assign({}, val);
            document.getElementsByClassName("product_content")[0].scrollTop = 0;
          } else {
            this.$message.error("所属分类列表获取失败")
          }
        })
      },


      reviewData(status) {
        if (this.review && !this.formData.remark) {
          this.$message.error("请填写审批意见");
          return;
        }
        if (status) {
          this.$refs["ruleForm"].validate(valid => {
            if (valid) {
              if (!this.formData.drugImg) {
                this.$message.error("请上传图片");
                return;
              }
              let param = Object.assign({}, this.formData);
              let len = this.formData.types.length;
              if (this.formData.types && len >= 1) {
                param.typeCode = this.formData.types[len - 1]
              }
              prodcut_api.audit(param).then(res => {
                if (res.code == 0) {
                  this.$message.success(res.msg)
                  this.$refs["ruleForm"].resetFields();
                  this.$emit("reviewData")
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else {
              document.getElementsByClassName("product_content")[0].scrollTop = 0;
            }
          })
        } else {
          let param = Object.assign({}, this.formData);
          prodcut_api.refuse(param).then(res => {
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
      submitData() {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            if (!this.formData.drugImg) {
              this.$message.error("请上传图片");
              return;
            }
            let param = Object.assign({}, this.formData);
            let len = this.formData.types.length;
            if (this.formData.types && len >= 1) {
              param.typeCode = this.formData.types[len - 1]
            }
            if (this.formData.drugId) { //更新产品
              prodcut_api.uploadProduct(param).then(res => {
                if (res.code == 0) {
                  this.$message.success(res.msg)
                  this.$emit("submitProductData")
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else { //保存产品
              prodcut_api.saveProduct(param).then(res => {
                if (res.code == 0) {
                  this.$message.success(res.msg)
                  this.$emit("submitProductData")
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
          } else {
            document.getElementsByClassName("product_content")[0].scrollTop = 0;
          }
        })
      },
      resetForm() {
        this.$refs["ruleForm"].resetFields();
        this.$emit("closeDialog")
      },
      handleAvatarSuccess(res) {
        if (this.loading) {
          this.loading.close();
        }
        if (res.code == 0) {
          // this.$nextTick(() => {
          //   this.formData.drugImg = res.resPath;
          // })
          // this.formData.drugImg = res.resPath
          this.$set(this.formData, 'drugImg', res.resPath);//解决图片更新，界面视图无更新问题
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
  .add_product {
    .product_content {
      height: 520px;
      overflow-y: auto;
      overflow-x: hidden;
      padding-top: 13px;
      padding-left: 20px;
      box-sizing: border-box;
      .flex-row {
        .el-input {
          width: 200px;
        }
      }

    }
    .add_product_form {
      .el-form-item {
        /*margin-right: 14px;*/
      }
      .el-form-item__label {
        color: #333;
      }
    }
    .hint_img {
      display: inline-block;
      width: 102px;
      height: 99px;
      text-align: right;
      padding-right: 12px;
      box-sizing: border-box;
      vertical-align: top;
    }
    .product_img_wrap {
      display: inline-block;
      vertical-align: middle;
      .avatar-uploader {
        display: inline-block;
        width: 90px;
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
        color: #F67A16;
        margin-left: 20px;
      }
    }
    .el-select, .el-cascader {
      width: 200px;
    }

  }
</style>
