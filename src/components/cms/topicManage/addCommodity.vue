<template>
  <div class="add-commodity">
    <el-dialog
      title="添加商品"
      :visible.sync="addCommodityDialog"
      class="cms_dialog_visible"
      width="900px"
      :close-on-click-modal="false"
      :before-close="closeAddCommodityDiaolg">
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
        :data="commodityTable.data"
        border
        height="550"
        ref="multipleTable"
        style="width: 100%;height: 100%"
        :row-key="getRowKeys"
        :row-class-name="tableRowClassName"
        @selection-change="handleselectChange"
        @row-click="rowClick"
        @sort-change="tableDataSortChange"
        :default-sort = "{prop: 'drugSkuCode', order: 'desc'}">
       <el-table-column type="selection" width="45" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column label="商品编码" prop="drugSkuCode" sortable width="100px"></el-table-column>
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
      <div class="setting_pagination" v-if="commodityTable.total>0">
        <el-pagination @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10, 50, 100, 150]"
                       small
                       :total="commodityTable.total" :current-page.sync="commodityTable.currentPage"
                       :page-size="commodityTable.pageSize"></el-pagination>
        <el-button type="primary" size="mini" plain>确 定</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="closeAddCommodityDiaolg">取 消</el-button>
           <el-button type="primary" @click="addCommoditySubmit" :loading="submitLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import API from "../../../api/api_topic";

export default {
  name: 'addCommodity',
  data (){
    return{
      submitLoading: false,
      filters:{
        searchParam: '',
        manufacturer:'',
        supplierName:'',
        specifications:'',
        approveNumber:''
      },
      commodityTable:{
        data: [],
        total: 0,
        pageSize: 10,
        currentPage: 1,
      },
      multipleAddCommodity:[]
    }
  },
  props:{
    addCommodityDialog:{
      type:Boolean,
      default: false
    },
    commodityList:{
      type: Array,
      default (){
        return []
      }
    }
  },
  methods:{
    closeAddCommodityDiaolg(){
      this.clearData();
      this.$emit("closeAddCommodityDiaolg")
    },
    clearData(){
      this.$refs.multipleTable.clearSelection();
      this.commodityTable = {
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
    },
    //搜索
    addSearchCommodityList() {
      // this.addCommodityDialog.cur 56rentPage = 1;
      this.queryCommodityList();
    },
    handleCurrentChange(val) {
      this.commodityTable.currentPage = val;
      this.queryCommodityList();
    },
    //查询商品所有列表
    queryCommodityList() {
      let goodIds = "";
      this.commodityList.forEach(item => {
        goodIds += item.commodityId + ",";
      })
      let params = this.filters;
      params.goodIds = goodIds;
      params.page = this.commodityTable.currentPage;
      params.limit = this.commodityTable.pageSize;
      params.order = this.commodityTable.order == 'descending' ? 'desc': '';
      params.sort = this.commodityTable.sort
      API.queryActivityGoodList(params).then(res => {
        if (res.code == 0) {
          this.commodityTable.data = res.data.rows;
          this.commodityTable.total = res.data.total;
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSizeChange(val) {
      this.commodityTable.pageSize = val;
      this.queryCommodityList();
    },
    //商品选择
    handleselectChange(val) {
      this.multipleAddCommodity = val;
    },
    //点击添加商品行
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    tableRowClassName({row, rowIndex}) {
      let arr =  this.multipleAddCommodity;
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
    // table排序
    tableDataSortChange(column) {
      this.commodityTable.sort = column.prop;
      this.commodityTable.order = column.order;
      this.queryCommodityList();
    },
    //确定添加商品
    addCommoditySubmit() {
      let status = false;
      let multipleLength = this.multipleAddCommodity.length;
      if (multipleLength <= 0) {
        this.$message.error("请勾选要添加的商品");
        return;
      }
      this.$emit('addCommoditySave',this.multipleAddCommodity)
      this.clearData();

    },
  }
}
</script>
