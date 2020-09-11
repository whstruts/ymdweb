<template>
  <div class="add-commodity">
    <el-dialog
      title="添加商品"
      :visible.sync="addCommodityDialog"
      class="cms_dialog_visible"
      width="1080px"
      :close-on-click-modal="false"
      :before-close="closeAddCommodityDiaolg">
      <div class="search_bg_wrap" style="margin-bottom: 15px">
        <el-input v-model="filters.goodsNo" clearable placeholder="供应商编码"
                    style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
          ></el-input>
          <el-input v-model="filters.drugNameLike" clearable placeholder="商品名"
                    style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
          ></el-input>
          <el-input v-model="filters.drugCommonNameLike" clearable placeholder="通用名"
                    style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
          ></el-input>
          <el-input v-model="filters.manufacturerLike" clearable placeholder="厂家"
                    style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
          ></el-input>
          <el-input v-model="filters.specificationsLike" clearable placeholder="规格"
                    style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
          ></el-input>
          <el-input v-model="filters.approveNumberLike" clearable placeholder="批准文号  "
                    style="width: 240px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
          ></el-input>
          <el-button size="small" type="warning" @click="addSearchCommodityList"><i class="iconfont icon-chaxun"></i>查询
          </el-button>
          <el-button style="float:right" size="small" type="primary" @click="addCommoditySubmit" :loading="submitLoading">确 定</el-button>
          <el-button style="float:right" size="small" @click="closeAddCommodityDiaolg">取 消</el-button>
      </div>
      <el-table
        :data="commodityTable.data"
        border
        height="550"
        ref="multipleTable"
        style="width: 120%;height: 100%"
        :row-key="getRowKeys"
        :row-class-name="tableRowClassName"
        @selection-change="handleselectChange"
        @row-click="rowClick"
        @sort-change="tableDataSortChange"
        :default-sort = "{prop: 'drugSkuCode', order: 'desc'}">
       <el-table-column type="selection" width="45" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column label="供应商编码" prop="goodsSn" sortable width="120px"></el-table-column>
        <el-table-column label="商品名" prop="drugName" sortable width="150px"></el-table-column>
        <el-table-column label="通用名" prop="drugCommonName" sortable width="150px"></el-table-column>
        <el-table-column label="规格" prop="specifications" width="120px"></el-table-column>
        <el-table-column label="厂家" prop="manufacturer" sortable width="150px"></el-table-column>
        <el-table-column label="效期" prop="dateExpiration" sortable width="120px"></el-table-column>
        <el-table-column label="批准文号" prop="approveNumber" sortable width="120px"></el-table-column>
        <el-table-column label="供应商" prop="supplierName" sortable width="120px"></el-table-column>
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
    </el-dialog>
  </div>
</template>
<script>

import API from "../../../api/api_purchase_manage"

export default {
  name: 'addCommodity',
  data (){
    return{
      submitLoading: false,
      filters:{
        goodsSn: '',
        drugNameLike:'',
        drugCommonNameLike:'',
        manufacturerLike:'',
        specificationsLike:'',
        approveNumberLike:'',
      },
      commodityTable:{
        data: [],
        total: 0,
        pageSize: 10,
        currentPage: 1,
      },
      multipleAddCommodity:[],
      activeTime:[],
      temporaryId:'',
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
    setActiveTime(time)
    {
      this.activeTime = time;
    },
    setTemporaryId(id)
    {
      this.temporaryId = id;
    },
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
        goodsNo: '',
        drugNameLike:'',
        drugCommonNameLike:'',
        manufacturerLike:'',
        specificationsLike:'',
        approveNumberLike:'',
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
      let params = this.filters;
      params.page = this.commodityTable.currentPage;
      params.limit = this.commodityTable.pageSize;
      params.order = this.commodityTable.order == 'descending' ? 'desc': '';
      params.sort = this.commodityTable.sort
      params.startDateStr = this.activeTime[0]
      params.endDateStr = this.activeTime[1]
      params.temporaryId = this.temporaryId
      API.chooseAbleCommodityList(params).then(res => {
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
