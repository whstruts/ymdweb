<template>
  <!-- 编辑弹框 -->
  <div class="add-topic">
    <el-dialog
      title="添加限购页"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible edit_customer_dialog"
      :close-on-click-modal="false"
      :before-close="clearFormData">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width=" 100px" class="edit-customer-form">
        <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
          <legend>专题信息</legend>
          <el-row>
            <el-col :span="11">
              <el-form-item label="应用类型" class="flex-item" prop="activityType">
                <el-checkbox-group v-model="formData.activityType"  @change="handleCheckedChange">
                  <el-checkbox v-for="type in activityTypes" :label="type.label" :key="type.id">{{type.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="专题名称" class="flex-item" prop="activityName">
                <el-input v-model.trim="formData.activityName" size="small"  maxlength="20" show-word-limit clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动时间" autofocus class="flex-item" prop="activeTime">
                <el-date-picker
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                    v-model="formData.activeTime"
                  size="mini" style="width: 240px" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        <fieldset class="cms_dialog_content">
          <legend>页面配置</legend>
          <el-row>
            <el-col :span="24" v-if="isUploadHeadImg">
              <el-form-item label="PC头部宣传图" autofocus class="flex-item" prop="headImg">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="(res,file)=>{return handleAvatarSuccess(res,file,'header')}"
                  :headers="uploadHeaders"
                  :data="{size:300}"
                  :before-upload="beforeAvatarUpload">
                  <img  class="avatar" :src="formData.headImg" v-if="formData.headImg">
                  <i class="el-icon-plus avatar-uploader-icon" v-else></i>
                </el-upload>
                <span class="tips red">图片尺寸：1920px*500px    图片大小：300kb以内</span>
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="isUploadAppHeadImg">
              <el-form-item label="APP头部宣传图" autofocus class="flex-item" prop="appHeadImg">
                <el-upload
                  class="avatar-uploader app-avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="(res,file)=>{return handleAvatarSuccess(res,file,'appheader')}"
                  :headers="uploadHeaders"
                  :data="{size:300}"
                  :before-upload="beforeAvatarUpload2">
                  <img  class="avatar" :src="formData.appHeadImg" v-if="formData.appHeadImg">
                  <i class="el-icon-plus avatar-uploader-icon" v-else></i>
                </el-upload>
                <span class="tips red">图片尺寸：750px*424px    图片大小：300kb以内</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" >
              <el-form-item label="页面背景色" autofocus class="flex-item color-item" prop="backgroundColor">
                <el-color-picker v-model="formData.backgroundColor" class="reset-color-picker"></el-color-picker>
                <el-input v-model="formData.backgroundColor" size="mini" clearable maxlength="7"></el-input>
                <span class="tips">请填写16进制颜色，例如#2f9ffe</span>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
          <legend>商品配置</legend>
          <div class="info-list">
            <div class="commodity_data_setting" style="float:left">
              <div class="add_commodity_button" @click="openAddCommodityDialog">新增商品</div>
              <div class="del_commodity_button" @click="deleteCommodity">删除</div>
            </div>
            <div class="search_bg_wrap" style="float:right">
              <el-select  style="width: 120px;margin-right:15px" v-model="filters.status" placeholder="商品状态" size="mini" @change="addSearchCommodityList">
                <el-option label="全部" :key=" " value=""></el-option>
                <el-option  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <el-input v-model="filters.searchParam" clearable placeholder="编码/商品名/通用名"
                          style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
                ></el-input>
                <el-input v-model="filters.supplierName" clearable placeholder="供应商"
                          style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
                ></el-input>
                <el-button size="small" type="warning" @click="addSearchCommodityList"><i class="iconfont icon-chaxun"></i>查询
                </el-button>
            </div>
            <el-table
              ref="multipleTable"
              :data="editCommodityData.data.slice((editCommodityData.currentPage-1)*editCommodityData.pageSize,editCommodityData.currentPage*editCommodityData.pageSize)"
              style="width: 100%"
              border stripe
              :row-key="getRowKeys"
              @row-click="rowClick"
              @selection-change="handleSelectionChange"
              @sort-change="tableDataSortChange"
              :default-sort = "{prop: 'drugSkuCode', order: 'desc'}">
              <el-table-column type="selection" width="45" align="center" :reserve-selection="true"></el-table-column>
              <el-table-column label="商品状态" prop="status">
                <template slot-scope="scope">
                  <!-- 1上架   0和2下架 -->
                   {{scope.row.status ==1?'已上架':'已下架'}}
                </template>
              </el-table-column>
              <el-table-column label="商品编码" prop="drugSkuCode" sortable width="120px"></el-table-column>
              <el-table-column label="商品通用名" prop="drugCommonName" sortable width="120px"></el-table-column>
              <el-table-column label="规格/单位" prop="specifications" width="120px">
                <template slot-scope="scope">{{scope.row.specifications}}/ {{scope.row.packageUnit}}</template>
              </el-table-column>
              <el-table-column label="厂家" prop="manufacturer" sortable width="120px"></el-table-column>
              <el-table-column label="中/大包装-可拆零" prop="" width="130px">
                <template slot-scope="scope">
                  {{scope.row.mediumPackage}}/{{scope.row.largePackage}}- {{scope.row.isRetail==0?'不可拆零':scope.row.isRetail==1?'可拆零':''}}
                </template>
              </el-table-column>
              <el-table-column label="批号" prop="productionBatch" width="120px"></el-table-column>
              <el-table-column label="效期" prop="dateExpiration" sortable width="80px"></el-table-column>
              <el-table-column label="供应商报价" prop="supplierPrice" sortable width="120px"></el-table-column>
              <el-table-column label="库存" prop="repertory"></el-table-column>
              <el-table-column label="所属供应商" prop="supplierName" sortable width="120px">
              </el-table-column>
            </el-table>
            <div class="setting_pagination" v-if="editCommodityData.total>0">
              <el-pagination @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :page-sizes="[10, 50, 100, 150]"
                            small
                            :total="editCommodityData.total" :current-page.sync="editCommodityData.currentPage"
                            :page-size="editCommodityData.pageSize"></el-pagination>
              <el-button type="primary" size="mini" plain>确 定</el-button>
            </div>
          </div>
        </fieldset>
      </el-form>
      <span slot="footer" class="dialog-footer">
           <el-button @click="clearFormData">取 消</el-button>
           <el-button type="primary" :loading="loadingbtn" @click="handleSave()">保存</el-button>
      </span>
    </el-dialog>
    <add-commodity :addCommodityDialog="addCommodityDialog" :commodityList = originCommodityData.data @closeAddCommodityDiaolg=closeAddCommodityDiaolg @addCommoditySave = addCommoditySave></add-commodity>
  </div>
</template>
<script>
import API from "../../../api/api_topic";
import cms_api from "../../../api/api_homeSetting";
import addCommodity from "./addCommodity"
export default {
  name:"addPurchase",
  data(){
    var valiHeaderImg = (rule, value, callback) => { // 图片验证
      if (this.formData.headImg == "") {
        callback(new Error('请上传图片'));
      } else {
        callback();
      }
    }
    var valiAppHeaderImg = (rule, value, callback) => { // 图片验证
      if (this.formData.appHeadImg == "") {
        callback(new Error('请上传图片'));
      } else {
        callback();
      }
    }
    return{
      loading: false,
      loadingbtn: false,
      color: "", // 取色器颜色
      formData: {
        activityType:['PC','APP'],
        activityName: "",
        activeTime:"",
        backgroundColor: "",
        headImg:"",
        appHeadImg:"",
      },
      activityTypes:[
        {
          label:'PC',
          value:"PC"
        },
        {
          label:'APP',
          value:"APP"
        }
      ],
      isUploadHeadImg: true,
      isUploadAppHeadImg: true,
      uploadUrl:"",
      uploadHeaders: {Authorization: ''},//token
      editCommodityData: {
        data: [],
        total: 0,
        pageSize: 10,
        currentPage: 1,
      },
      originCommodityData: {
        data: [],
        total: 0,
        pageSize: 10,
        currentPage: 1,
      },
       filters:{
        status:'',
        searchParam: '',
        supplierName:''
      },
      selectionCommodity:[],
      rules: {
        activityType: [
          { type: 'array', required: true, message: '请选择应用类型', trigger: 'change' }
        ],
        activityName: [
          {required: true, message: "请输入专题名称", trigger: "blur"}
        ],
        activeTime: [{required: true, message: "请选择活动时间", trigger: "change"}],
        backgroundColor: [
          {required: true, message: "请输入背景颜色值", trigger: "blur"},
          {
            pattern: /^#([a-fA-F\d]{3}|[a-fA-F\d]{6})$/,
            message: '背景颜色值格式不正确'
          }
        ],
        headImg:[{required: true, validator: valiHeaderImg, trigger: "change"}],
        appHeadImg:[{required: true, validator: valiAppHeaderImg, trigger: "change"}],
      },
      addCommodityDialog: false,
      statusList:[{
          value: '1',
          label: '已上架'
        },
        {
          value: '2',
          label: '已下架'
        }
      ]
    }
  },
  props:{
    dialogVisible:{
      type:Boolean,
      default: false
    },
    activityId:{
      type: String,
      default: ""
    }
  },
  components:{
    addCommodity
  },
  created(){
    this.uploadUrl = cms_api.upload();
  },
  methods:{
    // 获取专题页详情
    getActivity(activityId){
      API.getActivity({activityId: activityId}).then( (res) =>{
       if (res.code == 0) {
        let data = res.data;
        if(data.activityType) {
          data.activityType = data.activityType.split(",");
        }
        if(data.activityStartTime && data.activityEndTime) {
          data.activeTime = [data.activityStartTime, data.activityEndTime];
        }
        if(data.headImg) {
          this.isUploadHeadImg = true;
        } else {
          this.isUploadHeadImg = false;
        }
        if(data.appHeadImg) {
          this.isUploadAppHeadImg = true;
        } else{
          this.isUploadAppHeadImg = false;
        }
        if(data.commodityData) {
          let commodityData = JSON.parse(data.commodityData)
          this.getCommodityStatus(commodityData);
        }
         this.formData = data;
      } else {
        this.$message.error(res.msg)
      }
      })
    },
     // 获取商品状态
    getCommodityStatus(commodityData){
      let dataList = commodityData;
      if(dataList && dataList.length <= 0) return;
      let commodityIds = ''
      for(let i = 0; i < dataList.length; i++) {
        dataList[i].supplierPrice = Number(dataList[i].supplierPrice);
        commodityIds += dataList[i].commodityId+ ",";
      }
      cms_api.getCommodityStatus({commodityIds: commodityIds}).then( res=> {
        if(res.code == 0) {
          if(res.data) {
            let status = res.data;
            for(let i in status) {
              commodityData[i].status = status[i]+'';
            }
            this.editCommodityData.data = dataList;
            this.editCommodityData.total = dataList.length;
            this.originCommodityData.data = JSON.parse(JSON.stringify(dataList));
            this.originCommodityData.total = dataList.length;
          }
        } else {
          this.$message.error(res.msg);
        }
      })

    },
    clearFormData() {
      this.clearDialog();
      this.$emit("closeDialog")
    },
    //点击添加商品行
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKeys (row) {
      return row.commodityId
    },
   // 搜索已添加的商品
    addSearchCommodityList(){
      var restaurants = this.originCommodityData.data;
      var results = restaurants.filter(item =>
      (item.status.indexOf(this.filters.status) != -1 && (item.drugName.indexOf(this.filters.searchParam) != -1 ||item.drugCommonName.indexOf(this.filters.searchParam) != -1 || item.drugSkuCode.indexOf(this.filters.searchParam) != -1) && item.supplierName.indexOf(this.filters.supplierName) != -1 ));
      console.log(results)
      this.editCommodityData.data = results;
      this.editCommodityData.total = results.length;
    },
    beforeAvatarUpload(file) {
      this.uploadHeaders.Authorization = localStorage.getItem('access-token');
      if (!this.uploadHeaders.Authorization) {
        return false;
      }
      let isJPG = file.type === 'image/jpg';
      let isJPEG = file.type === 'image/jpeg';
      let isPNG = file.type === 'image/png';
      let imgSize = file.size / 1024 / 1024 < 0.3;
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error('上传图片的格式只能是 JPG或PNG 格式!');
        return false;
      }
      if (!imgSize) {
        this.$message.error('上传图片的大小不能超过 300KB!');
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 1920;
        let height = 500;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width == width && img.height == height;
          console.log(valid)
          valid ? resolve() : reject();
        }
        img.src = _URL.createObjectURL(file);
        }).then(() => {
          return file;
        }, () => {
        this.$message.error("图片尺寸必须是1920px*500px");
          return Promise.reject();
        });
      return isSize;
    },
    beforeAvatarUpload2(file) {
      this.uploadHeaders.Authorization = localStorage.getItem('access-token');
      if (!this.uploadHeaders.Authorization) {
        return false;
      }
      let isJPG = file.type === 'image/jpg';
      let isJPEG = file.type === 'image/jpeg';
      let isPNG = file.type === 'image/png';
      let imgSize = file.size / 1024 / 1024 < 0.3;
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error('上传图片的格式只能是 JPG或PNG 格式!');
        return false;
      }
      if (!imgSize) {
        this.$message.error('上传图片的大小不能超过 300KB!');
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 750;
        let height = 424;
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
       this.$message.error("图片尺寸必须是750px*424px")
        return Promise.reject();
      });
      return isSize;
    },
    handleAvatarSuccess(res, file, type) {
      if (this.loading) {
        this.loading.close();
      }
      if (res.code == 0) {
        if(type == 'header') {
          this.formData.headImg = res.resPath
          console.log(this.formData.headImg)
        } else if(type == 'appheader'){
          this.formData.appHeadImg = res.resPath
        }
      } else {
        this.loading.close();
        this.$message.error(res.msg)
      }
    },
    // 复选框change
    handleCheckedChange(val){
      console.log(val)
      let arr = val;
      if(arr.length <= 0) {
        this.isUploadHeadImg = false;
        this.isUploadAppHeadImg = false;
      } else {
        if(arr.indexOf("PC") != -1) {
          this.isUploadHeadImg = true;
        } else {
          this.isUploadHeadImg = false;
        }
        if(arr.indexOf("APP") != -1) {
          this.isUploadAppHeadImg = true;
        } else {
          this.isUploadAppHeadImg = false;
        }
      }
      this.formData.activityType = val;
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKeys (row) {
      return row.commodityId
    },
    handleSelectionChange(val) {
      this.selectionCommodity = val;
    },
    handleCurrentChange(val) {
      this.editCommodityData.currentPage = val;
    },
    handleSizeChange(val) {
      this.editCommodityData.pageSize = val;
    },
    // 删除商品
    deleteCommodity(){
      if(this.selectionCommodity.length <= 0) {
        this.$message.error("请先勾选要删除的商品");
        return;
      } else {
        let dataLength = this.selectionCommodity.length;
        this.$confirm('确认删除商品?', '提示', {
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < dataLength; i++) {
            let data = this.selectionCommodity[i];
            let itemlength = this.editCommodityData.data.length;
            let oitemlength = this.originCommodityData.data.length;
            for (let j = 0; j < itemlength; j++) {
              let item = this.editCommodityData.data[j];
              if (data.commodityId == item.commodityId) {
                console.log(data.commodityId == item.commodityId)
                this.editCommodityData.data.splice(j, 1);
                break;
              }
            }

            for (let k = 0; k < oitemlength; k++) {
              let item = this.originCommodityData.data[k];
              if (data.commodityId == item.commodityId) {
                this.originCommodityData.data.splice(k, 1);
                break;
              }
            }
          }
          this.$refs.multipleTable.clearSelection();
          console.log(this.editCommodityData.data)
          this.editCommodityData.total = this.editCommodityData.data.length;
        }).catch(() => {

        });
      }
    },
    // 打开添加商品弹框
    openAddCommodityDialog(){
      this.addCommodityDialog = true;
    },
    // 关闭添加商品弹框
    closeAddCommodityDiaolg(){
      this.addCommodityDialog = false;
    },
    // table排序
    tableDataSortChange(column) {
      if(column.prop == "supplierPrice") {
        if(column.order == "descending") {
          this.editCommodityData.data =this.editCommodityData.data.sort(this.$utils.priceSort)
        } else {
          this.editCommodityData.data =this.editCommodityData.data.sort(this.$utils.priceSortDesc)
        }
      } else {
        this.editCommodityData.sort = column.prop;
        this.editCommodityData.order = column.order;
      }
    },
    // 保存添加商品
    addCommoditySave(val){
     let data  = this.originCommodityData.data
      data = data.concat(val);
      this.getCommodityStatus(data)
      this.addCommodityDialog = false;
      this.filters = {
        status:'',
        searchParam:'',
        supplierName:''
      }
    },
    // 点击保存
    handleSave(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.formData));
          if(this.originCommodityData.data.length <= 0) {
            this.$message.error("请添加商品");
            return;
          }
          this.loadingbtn = true;
          if(this.formData.activeTime) {
            params.activityStartTime = this.formData.activeTime[0];
            params.activityEndTime = this.formData.activeTime[1];
          }
          params.commodityData = JSON.stringify(this.originCommodityData.data);
          params.activityType = params.activityType.join(",");
          if(this.activityId) {  // 更新
            params.activityId = this.activityId;
            API.updateActivity(params).then( (res) => {
              this.loadingbtn = false;
              if(res.code == 0) {
                this.clearDialog();
                this.$emit("closeDialog",'update')
                this.$message.success("操作成功");
              } else {
                this.$message.error(res.msg);
              }
            }).catch( () => {
              this.loadingbtn = false;
            })
          } else { // 新增
            API.addActivity(params).then( (res) => {
              this.loadingbtn = false;
              if(res.code == 0) {
                this.clearDialog();
                this.$emit("closeDialog",'add')
                this.$message.success("操作成功");
              } else {
                this.$message.error(res.msg);
              }
            }).catch( () => {
              this.loadingbtn = false;
            })
          }
        }
      })
    },
    clearDialog(){
      this.formData = {
        activityType:['PC','APP'],
        activityName: "",
        activeTime:"",
        backgroundColor: "",
        headImg:"",
        appHeadImg:"",
      };
      this.editCommodityData = {
        data: [],
        total: 0,
        pageSize: 10,
        currentPage: 1,
      }
       this.filters = {
        status:'',
        searchParam:'',
        supplierName:''
      }
      this.$refs.ruleForm.resetFields();
      this.$refs.multipleTable.clearSelection();
    }
  }
}
</script>
<style lang="scss">
.add-topic{
  .avatar-uploader{
    display: inline-block;
    .el-upload--text{
      width: 264px;
      height: 60px;
      line-height: 60px;
      font-size: 19px;
      color: #dedede;
      border: 1px dashed #dedede;
      vertical-align: bottom;
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
  .app-avatar-uploader{
    .el-upload--text{
      width: 132px;
    }
  }
  .reset-color-picker{
    margin-top: -12px;
    width: 32px;
    height: 32px;
    vertical-align: middle;
    .el-color-picker__trigger{
      width: 32px;
      height: 32px;
      vertical-align: middle;
    }
  }
}
</style>
