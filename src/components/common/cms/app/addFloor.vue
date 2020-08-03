<template>
  <div class="app-add-container app-add-product" v-if="isShowFloor">
    <div class="scroll-wrap">
      <h2 class="title">楼层</h2>
      <p class="advice">图片尺寸：700x180px</p>
      <div class="add-list">
        <div class="add-item floor-add-item">
          <div class="upload-box" style="width: 100%;height: 89px">
            <el-upload
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="(res,file)=>{return handleAvatarSuccess(res,file)}"
              :headers="uploadHeaders"
              :data="{size:500}"
              :before-upload="beforeAvatarUpload"
              class="avatar-uploader" style="height: 89px">
              <img class="avatar" :src="floorDataEdit.floorTitle.imgUrl" v-if="floorDataEdit.floorTitle.imgUrl">
              <i class="el-icon-plus avatar-uploader-icon" v-else></i>
            </el-upload>
          </div>
          <div class="flex-item add-content">
            <p class="add-link" v-if="!floorDataEdit.floorTitle.jumpPage || floorDataEdit.floorTitle.jumpPage == 4">链接：<a href="javascript:;" @click="addLink">添加链接</a></p>
            <template v-if="floorDataEdit.floorTitle.linkAddress">
              <template v-if="floorDataEdit.floorTitle.jumpPage == 0 ">
                <p class="had-link">链接：{{floorDataEdit.floorTitle.linkAddress.name}}<span v-if="floorDataEdit.floorTitle.linkAddress.keywords">({{floorDataEdit.floorTitle.linkAddress.topClassName}}{{floorDataEdit.floorTitle.linkAddress.keywords}})</span><i class="iconfont icon-edit" @click="addLink"></i></p>
              </template>
              <template v-if="floorDataEdit.floorTitle.jumpPage == 2">
                <p class="had-link">链接：{{floorDataEdit.floorTitle.linkAddress.drugCommonName}}<i class="iconfont icon-edit" @click="addLink"></i></p>
              </template>
              <template v-if="floorDataEdit.floorTitle.jumpPage == 1 || floorDataEdit.floorTitle.jumpPage == 3">
                <p class="had-link">链接：{{floorDataEdit.floorTitle.linkAddress.outlink}}<i class="iconfont icon-edit" @click="addLink"></i></p>
              </template>
            </template>
            <div class="input-box flex-wrp">
              <label>文本：</label>
              <el-input class="flex-item" v-model="floorDataEdit.floorTitle.txt"></el-input>
            </div>
          </div>
        </div>
      </div>

      <div class="product-list bgfff">
        <h2>选择商品</h2>
        <div class="pro-item" v-for="(item,index) in floorDataEdit.data">
          <div class="img-box" :style="{backgroundImage: 'url('+item.drugImg +')'}"></div>
          <p class="p-name">{{item.drugCommonName}}</p>
        </div>
        <div class="upload-box" @click="showDialog()">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <p class="num">{{floorDataEdit.data.length}}/10</p>
        </div>
      </div>
    </div>
    <div class="fixed-footer">
      <el-button size="small" @click="reset">重置</el-button>
      <el-button type="primary" size="small" @click="saveFloor">保存</el-button>
    </div>

    <el-dialog
      title="添加商品"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible"
      width="960px"
      :before-close="closeAddCommodityDiaolg"
      :close-on-click-modal="false">
      <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
        <!--<div class="dialog_nav"><span class="nav_line"></span><span>账号信息</span></div>-->
        <legend>选择商品</legend>
        <div class="search_bg_wrap" style="margin-bottom: 15px">
          <el-input v-model="filters.searchParam" clearable placeholder="编码/商品名/通用名"
                    style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
          ></el-input>
          <el-input v-model="filters.manufacturer" clearable placeholder="厂家"
                    style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
          ></el-input>
          <el-input v-model="filters.supplierName" clearable placeholder="供应商"
                    style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
          ></el-input>
          <el-input v-model="filters.specifications" clearable placeholder="规格"
                    style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
          ></el-input>
          <el-input v-model="filters.approveNumber" clearable placeholder="批准文号  "
                    style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
          ></el-input>
          <el-button size="small" type="warning" @click="addSearchCommodityList"><i class="iconfont icon-chaxun"></i>查询
          </el-button>
        </div>
        <el-table
        class="add-commidity-table"
        :data="table.data"
        border
        height="300"
        ref="multipleTable"
        style="width: 100%;"
        :row-key="getRowKeys"
        :row-class-name="tableRowClassName"
        @selection-change="handleselectRow"
        @row-click="rowClick"
        @sort-change="tableDataSortChange"
        :default-sort="{prop: 'drugSkuCode', order: 'desc'}">
          <el-table-column type="index" width="45" align="center" ></el-table-column>
          <el-table-column type="selection" width="45" align="center" :reserve-selection="true"></el-table-column>
          <el-table-column label="商品编码" prop="drugSkuCode" sortable width="120px"></el-table-column>
          <el-table-column label="商品通用名" prop="drugCommonName" sortable width="120px"></el-table-column>
          <el-table-column label="规格/单位" prop="specifications" width="120px">
            <template slot-scope="scope">{{scope.row.specifications}}/ {{scope.row.packageUnit}}</template>
          </el-table-column>
          <el-table-column label="厂家" prop="manufacturer" sortable width="120px"></el-table-column>
          <el-table-column label="中/大包装-可拆零" prop="" width="130px">
            <template slot-scope="scope">
              {{scope.row.mediumPackage}}/{{scope.row.largePackage}}-
              {{scope.row.isRetail==0?'不可拆零':scope.row.isRetail==1?'可拆零':''}}
            </template>
          </el-table-column>
          <el-table-column label="供应商报价" prop="supplierPrice" sortable width="120px"></el-table-column>
          <el-table-column label="库存" prop="repertory"></el-table-column>
          <el-table-column label="所属供应商" prop="supplierName" sortable width="120px">
          </el-table-column>
      </el-table>
      <div class="setting_pagination" v-if="table.total>0">
        <el-pagination @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10, 50, 100, 150]"
                       small
                       :total="table.total" :current-page.sync="table.currentPage"
                       :page-size="table.pageSize"></el-pagination>
        <el-button type="primary" size="mini" plain>确 定</el-button>
      </div>

      </fieldset>
      <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
        <!--<div class="dialog_nav"><span class="nav_line"></span><span>账号信息</span></div>-->
        <legend>已添加商品</legend>
        <div class="commodity_data_setting">
          <div class="del_commodity_button" @click="deleteCommodity">删除</div>
        </div>
        <el-table
          :data="editCommodityData"
          ref="editTable"
          :row-class-name="tableRowClassName2"
          @selection-change="handleselectRow2"
          @row-click="rowClick2"
          height="300"
          style="width: 100%" border >
            <el-table-column type="index" width="45" align="center"></el-table-column>
            <el-table-column type="selection" width="45" align="center" ></el-table-column>
            <el-table-column label="商品状态" prop="status">
              <template slot-scope="scope">
                <!-- 1上架   0和2下架 -->
                  {{scope.row.status ==1?'已上架':'已下架'}}
              </template>
            </el-table-column>
            <el-table-column label="商品编码" prop="drugSkuCode" width="120px"></el-table-column>
            <el-table-column label="商品通用名" prop="drugCommonName" width="120px"></el-table-column>
            <el-table-column label="规格/单位" prop="specifications" width="120px">
              <template slot-scope="scope">{{scope.row.specifications}}/ {{scope.row.packageUnit}}</template>
            </el-table-column>
            <el-table-column label="厂家" prop="manufacturer" width="120px"></el-table-column>
            <el-table-column label="中/大包装-可拆零" prop="" width="130px">
              <template slot-scope="scope">
                {{scope.row.mediumPackage}}/{{scope.row.largePackage}}-
                {{scope.row.isRetail==0?'不可拆零':scope.row.isRetail==1?'可拆零':''}}
              </template>
            </el-table-column>
            <el-table-column label="供应商报价" prop="supplierPrice"  width="120px"></el-table-column>
            <el-table-column label="库存" prop="repertory"></el-table-column>
            <el-table-column label="所属供应商" prop="supplierName"  width="120px">
            </el-table-column>
        </el-table>

      </fieldset>
      <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddCommodityDiaolg">取 消</el-button>
          <el-button type="primary" @click="addCommoditySubmit">确 定</el-button>
      </span>
    </el-dialog>
    <link-dialog :addLinkDialog='linkDialogVisible' :itemInfo = 'itemInfo' @closeLinkDialog='closeLinkDialog' @submitLink="submitLink"></link-dialog>

  </div>
</template>
<script>
import {bus} from "../../../../bus.js";
import linkDialog from './linkDialog'
import commodity_api from "../../../../api/api_homeSetting"
export default {
  name:"addProduct",
  data(){
    return{
      isShowFloor: false,
      dialogVisible: false,
      linkDialogVisible: false,
      uploadUrl: "",
      uploadHeaders: {Authorization: ''},//token
      filters:{
        searchParam: '',
        manufacturer:'',
        supplierName:'',
        specifications:'',
        approveNumber:''
      },
      itemInfo:{},
      table: {
        data: [],
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      editCommodityData:[],  // 已添加的商品
      copyCommodityData: [], // 传递过来的数据
      selectionCommodity: [],//已选商品列表 勾选的商品
      tempCommodityData: [], // 已选中商品零时数组
      floorDataEdit:{},
      fIndex: null,
    }
  },
  props:[
  ],
  components:{linkDialog},
  created(){
    bus.$on("editOpr", (val,val2, fIndex) => {
      if(val == 'floor') {
        this.isShowFloor = true;
        this.floorDataEdit = val2;
        if(val2.data && val2.data.length > 0) {
          this.getCommodityStatus( JSON.parse(JSON.stringify(val2.data)))
        } else {
          this.floorDataEdit.data = [];
        }

        this.fIndex = fIndex;
      } else {
        this.isShowFloor = false;
      }

    })
    this.uploadUrl = commodity_api.upload();
  },
  destroyed() {
    bus.$off("editOpr");
  },
  methods:{
    showDialog(){
      let floorDataEdit = JSON.parse(JSON.stringify(this.floorDataEdit));
      if(floorDataEdit.data) {
        this.editCommodityData = floorDataEdit.data;
        this.copyCommodityData = JSON.parse(JSON.stringify(floorDataEdit.data));
      } else{
        this.editCommodityData = [];
        this.copyCommodityData = [];
      }
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file, item, index) {
      if (this.loading) {
        this.loading.close();
      }
      if (res.code == 0) {
        this.floorDataEdit.floorTitle.imgUrl = res.resPath;
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
        let height = 180;
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
      this.$message.error("图片尺寸必须是700px*180px")
        return Promise.reject();
      });
      return isSize;
    },
    // 添加链接
    addLink(){
      this.itemInfo = this.floorDataEdit.floorTitle;
      this.linkDialogVisible = true;
    },
    closeLinkDialog(){
      this.itemInfo = {};
      this.linkDialogVisible = false;
    },
    submitLink(obj){
      this.floorDataEdit.floorTitle = obj;
      this.linkDialogVisible = false;
      this.itemInfo = {};
    },
    //查询商品所有列表
    queryCommodityList() {
      let goodIds = "";
      this.copyCommodityData.forEach(item => {
        goodIds += item.commodityId + ",";
      })
      let params = this.filters;
      params.goodIds = goodIds;
      params.page = this.table.currentPage;
      params.limit = this.table.pageSize;
      params.order = this.table.order == 'descending' ? 'desc' : '';
      params.sort = this.table.sort
      commodity_api.queryGoodList(params).then(res => {
        if (res.code == 0) {
          this.table.data = res.data.rows;
          this.table.total = res.data.total;
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 点击搜索
    addSearchCommodityList(){
      this.queryCommodityList();
    },
    //点击添加商品行
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    rowClick2(row) {
      this.$refs.editTable.toggleRowSelection(row)
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKeys (row) {
      return row.commodityId
    },

    //全选
    handleselectRow(val) {
      this.tempCommodityData = val;
      this.editCommodityData = this.copyCommodityData.concat(val)
    },
    handleselectRow2(val) {
      this.selectionCommodity = val;
      console.log(this.selectionCommodity)
    },
    tableRowClassName({row, rowIndex}) {
      let arr =  this.tempCommodityData;
      for(let i = 0; i < arr.length; i++){
        if(row.commodityId === arr[i].commodityId){
          return 'rowStyle'
        }
      }
    },
    tableRowClassName2({row, rowIndex}) {
    let arr =  this.selectionCommodity;
    for(let i = 0; i < arr.length; i++){
      if(row.commodityId === arr[i].commodityId){
        return 'rowStyle'
      }
    }
  },
    //添加商品分页
    handleCurrentChange(val) {
      this.table.currentPage = val;
      this.queryCommodityList();
    },
    handleSizeChange(val) {
      this.table.pageSize = val;
      this.queryCommodityList();
    },
    // 点击取消
    closeAddCommodityDiaolg(){
      this.dialogVisible = false;
      this.$refs.multipleTable.clearSelection();
      this.table = {
        data: [],
        total: 0,
        pageSize: 10,
        currentPage: 1
      };
      this.filters = {
        searchParam: '',
        manufacturer:'',
        supplierName:'',
        specifications:'',
        approveNumber:''
      };
      this.editCommodityData = [];  // 已添加的商品
      this.copyCommodityData = []; // 传递过来的数据
      this.selectionCommodity = [];//已选商品列表 勾选的商品
      this.tempCommodityData =[]; // 已选中商品零时数
    },
    //删除商品
    deleteCommodity() {
      let dataLength = this.selectionCommodity.length;
      if (this.selectionCommodity.length <= 0) {
        this.$message.error("请勾选要删除的商品");
        return;
      }
      this.$confirm('确认删除商品?', '提示', {
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < dataLength; i++) {
          let data = this.selectionCommodity[i];
          console.log(data)
          let itemLength = this.editCommodityData.length;
          let tempLength = this.tempCommodityData.length;
          for (let j = 0; j < itemLength; j++) {
            let item = this.editCommodityData[j];
            if (data.commodityId == item.commodityId) {
              console.log(data.commodityId == item.commodityId)
              this.editCommodityData.splice(j, 1);
              this.copyCommodityData.splice(j,1);
              break;
            }
          }
          console.log(this.editCommodityData)
          for (let k = 0; k < tempLength; k++) {
            let item = this.tempCommodityData[k];
            if (data.commodityId == item.commodityId) {
              this.$refs.multipleTable.toggleRowSelection(item);
              this.tempCommodityData.splice(k, 1);
              break;
            }
          }
        }
        console.log(this.editCommodityData)
      }).catch(() => {

      });

    },
    tableDataSortChange(column) {
      console.log(column)
      this.table.sort = column.prop;
      this.table.order = column.order;
      this.queryCommodityList();
    },
    //  点击添加商品确认按钮
    addCommoditySubmit(){
      let multipleLength = this.editCommodityData.length;
      if (multipleLength <= 0) {
        this.$message.error("请勾选要添加的商品");
        return;
      }
       if (multipleLength > 10) {
        this.$message.error("添加的商品不能超过10个");
        return;
      }
      this.floorDataEdit.data = this.editCommodityData;
      this.clearFilter();
      this.dialogVisible = false;
    },
    // 重置
    reset(){
      this.$confirm("确认要重置吗")
      .then(_ => {
        console.log(this.floorDataEdit)
        this.floorDataEdit = {
          floorTitle: {
            imgUrl: "",
            txt: "",
            jumpPage: 4,
          },
          data:[],
          identifier: 'floor'
        }
      })
      .catch(_ => {});
    },
    // 保存
    saveFloor(){
      let item = this.floorDataEdit.floorTitle;
      let data = this.floorDataEdit.data;
      console.log(this.floorDataEdit)
      if (!item.imgUrl) {
        this.$message.error("请上传楼层图！")
        return;
      }
      if(!item.jumpPage) {
        this.floorDataEdit.floorTitle.linkAddress = {};
      }
      if(!item.txt) {
        this.$message.error("请填写文本！")
        return;
      }
      if(data && data.length <= 0) {
        this.$message.error("请添加商品")
        return;
      }
      this.isShowFloor = false;
      this.$emit("submitFloorData", this.floorDataEdit,this.fIndex)
    },
    // 清空搜索框
    clearFilter(){
      this.$refs.multipleTable.clearSelection();
      this.table = {
        data: [],
        total: 0,
        pageSize: 10,
        currentPage: 1
      };
      this.filters = {
        searchParam: '',
        manufacturer:'',
        supplierName:'',
        specifications:'',
        approveNumber:''
      }
    },
    // 获取商品状态
    getCommodityStatus(commodityData){
      let dataList = commodityData;
      if(dataList && dataList.length <= 0) return;
      let commodityIds = '';
      for(let i = 0; i < dataList.length; i++) {
        dataList[i].supplierPrice = Number(dataList[i].supplierPrice);
        commodityIds += dataList[i].commodityId+ ",";
      }
      commodity_api.getCommodityStatus({commodityIds: commodityIds}).then( res=> {
        if(res.code == 0) {
          if(res.data) {
            let status = res.data;
            for(let i in status) {
              commodityData[i].status = status[i]+'';
            }
           this.editCommodityData = commodityData;
          }
        } else {
          this.$message.error(res.msg);
        }
      })

    },
  }
}
</script>
<style lang="scss">
  .app-add-product{
    .floor-add-item{
      .upload-box{
        margin-bottom: 10px;
        height: 89px;
      }
      .el-upload{
        height: 89px !important;
        line-height: 89px !important;
      }
    }
    .product-list{
      margin-top: 22px;
      padding: 14px;
      background: #fff;
      overflow: hidden;
      h2{
        font-size: 15px;
      }
      .pro-item{
        float: left;
        padding-bottom: 10px;
        width: 25%;
        text-align: center;
        overflow: hidden;
      }
      .img-box{
        margin: 0 auto;
        width: 74px;
        height: 74px;
        background: #FFF;
        border: 1px solid #F8F8F8;
        box-sizing: border-box;
        background-size: 80% auto;
        background-position: center;
        background-repeat: no-repeat;
        border: 1px solid #F8F8F8;
      }
      .p-name{
        display: -webkit-box;
        padding: 0 10px;
        height: 30px;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
        overflow:hidden;
        text-overflow:ellipsis;
        padding-top: 5px;
        font-size: 12px;
        color: #666;
        line-height: 16px;
      }
      .upload-box{
        float: left;
        margin-left: 10px;
        width: 74px;
        height: 74px;
        text-align: center;
        background: #F8F8F8;
        cursor: pointer;
        .avatar-uploader-icon{
          padding-top: 19px;
          font-size: 18px;
          color: #DEDEDE;
        }
        .num{
          font-size: 12px;
          color:#999;
          text-align: center;
        }
      }
    }
    .el-dialog__body{
      height: 660px;
      overflow-y: auto;
    }
    .el-table{
      overflow-y: auto;
    }
     .commodity_data_setting {
      margin: 10px 0px;
      line-height: 30px;
      .add_commodity_button {
        cursor: pointer;
        width: 76px;
        height: 30px;
        background: #0680FD;
        border-radius: 5px;
        display: inline-block;
        text-align: center;
        color: #fff;
      }
      .del_commodity_button {
        cursor: pointer;
        width: 76px;
        height: 30px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(222, 222, 222, 1);
        border-radius: 5px;
        display: inline-block;
        text-align: center;
        color: #666666;
      }
    }
  }
</style>
