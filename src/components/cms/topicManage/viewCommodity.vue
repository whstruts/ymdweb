<template>
  <!-- 编辑弹框 -->
  <div class="view-commodity">
    <el-dialog
      title="查看商品"
      :visible.sync="viewDialogVisible"
      class=" edit_customer_dialog cms_dialog_visible"
      :close-on-click-modal="false"
      :before-close="clearFormData">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="90px" class="edit-customer-form">
        <div class="info-list">
          <div class="commodity_data_setting fl">
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
            height="550"
            ref="multipleTable"
            :data="editCommodityData.data.slice((editCommodityData.currentPage-1)*editCommodityData.pageSize,editCommodityData.currentPage*editCommodityData.pageSize)"
            style="width: 100%"
            border
            :row-key="getRowKeys"
            :row-class-name="tableRowClassName"
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
              <el-table-column label="供应商报价" prop="supplierPrice" sortable="custom" width="120px"></el-table-column>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
           <el-button @click="clearFormData">取 消</el-button>
           <el-button type="primary" :loading="loading" @click="handleSave()">保存</el-button>
      </span>
    </el-dialog>
    <add-commodity :addCommodityDialog="addCommodityDialog" :commodityList = 'originCommodityData.data' @closeAddCommodityDiaolg='closeAddCommodityDiaolg' @addCommoditySave = 'addCommoditySave'></add-commodity>
  </div>
</template>
<script>
import API from "../../../api/api_topic";
import api_homesetting from "../../../api/api_homeSetting";
import addCommodity from "./addCommodity"
export default {
  name:"addTopic",
  data(){
    var valiHeaderImg = (rule, value, callback) => { // 图片验证
      if (!this.hasFmt) {
        callback(new Error('请上传图片'));
      } else {
        callback();
      }
    }
    var valiFooterImg = (rule, value, callback) => { // 图片验证
      if (!this.hasFmt) {
        callback(new Error('请上传图片'));
      } else {
        callback();
      }
    }
    return{
      loading: false,
      color: "", // 取色器颜色
      formData: {
        name: "",
        activeTime:"",
        color: "",
        headerImg:"",
        footerImg:""
      },
      filters:{
        status:'',
        searchParam:'',
        supplierName:''
      },
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
      selectionCommodity:[],
      rules: {
        name: [
          {required: true, message: "请输入专题名称", trigger: "blur"}
        ],
        activeTime: [{required: true, message: "请选择活动时间", trigger: "change"}],
        color: [
          {required: true, message: "请输入背景颜色值", trigger: "blur"},
          {
            pattern: /^#([a-fA-F\d]{3}|[a-fA-F\d]{6})$/,
            message: '背景颜色值格式不正确'
          }
        ],
        headerImg:[{required: true, validator: valiHeaderImg, trigger: "change"}],
        footerImg:[{required: true, validator: valiFooterImg, trigger: "change"}]
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
      ],
    }
  },
  props:{
    viewDialogVisible:{
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
  methods:{
    clearFormData() {
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
      this.$refs.multipleTable.clearSelection();
      this.$emit("closeViewDialog")
    },
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
      api_homesetting.getCommodityStatus({commodityIds: commodityIds}).then( res=> {
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
    //点击添加商品行
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    tableRowClassName({row, rowIndex}) {
      let arr =  this.selectionCommodity;
      for(let i = 0; i < arr.length; i++){
        if(row.commodityId === arr[i].commodityId){
          return 'rowStyle'
        }
      }
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
    // 打开添加商品弹框
    openAddCommodityDialog(){
      this.addCommodityDialog = true;
    },
    // 关闭添加商品弹框
    closeAddCommodityDiaolg(){
      this.addCommodityDialog = false;
    },
    // 保存添加商品
    addCommoditySave(val){
      let data  = this.originCommodityData.data
      console.log(data);
      data = data.concat(val);
      console.log(data)
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
                this.clearFormData();
                this.$message.success("操作成功");
              } else {
                this.$message.error(res.msg);
              }
            })
          } else { // 新增
            API.addActivity(params).then( (res) => {
              this.loadingbtn = false;
              if(res.code == 0) {
                this.$emit("closeViewDialog",'add')
                this.$message.success("操作成功");
              } else {
                this.$message.error(res.msg);
              }
            })
          }
        }
      })
    },
    // 搜索已添加的商品
    addSearchCommodityList(){
      var restaurants = this.originCommodityData.data;
      console.log(restaurants)
      for(let i in restaurants) {
        console.log(restaurants[i].status)
      }
      var results = restaurants.filter(item =>
      (item.status.indexOf(this.filters.status) != -1 && (item.drugName.indexOf(this.filters.searchParam) != -1 ||item.drugCommonName.indexOf(this.filters.searchParam) != -1 || item.drugSkuCode.indexOf(this.filters.searchParam) != -1) && item.supplierName.indexOf(this.filters.supplierName) != -1 ));
      this.editCommodityData.data = results;
      this.editCommodityData.total = results.length;
    },
  }
}
</script>
<style lang="scss">
.view-commodity{
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
}
</style>
