<template>
  <div>
    <el-dialog
      title="添加商品"
      :visible.sync="addCommodityDialog"
      class="cms_dialog_visible"
      width="900px"
      :close-on-click-modal="false"
      :before-close="closeAddCommodityDiaolg">
      <div class="search_bg_wrap" style="margin-bottom: 15px">
        <el-input v-model="searchCommodityname" clearable placeholder="编码/商品名/通用名"
                  style="width: 260px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
        ></el-input>
        <el-input v-model="manufacturer" clearable placeholder="厂家"
                  style="width: 260px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
        ></el-input>
        <el-input v-model="supplierName" clearable placeholder="供应商"
                  style="width: 260px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
        ></el-input>
        <el-input v-model="specifications" clearable placeholder="规格"
                  style="width: 260px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
        ></el-input>
        <el-input v-model="approveNumber" clearable placeholder="批准文号"
                  style="width: 260px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
        ></el-input>
        <el-button size="small" type="warning" @click="addSearchCommodityList"><i class="iconfont icon-chaxun"></i>查询
        </el-button>
      </div>
      <el-table
        :data="table.data"
        border
        height="500"
        ref="multipleTable"
        style="width: 100%;"
        :row-class-name="tableRowClassName4"
        :row-key="getRowKeys"
        @row-click="rowClick"
        @selection-change="handleselectChange"
        @sort-change="tableDataSortChange"
        :default-sort="{prop: 'drugSkuCode', order: 'descending'}">
        <el-table-column type="selection" width="45" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column label="商品编码" prop="drugSkuCode" sortable width="120px"></el-table-column>
        <el-table-column label="商品通用名" prop="drugCommonName" sortable width="120px">
          <template slot-scope="scope">
            {{scope.row.drugName?scope.row.drugName+'&nbsp;&nbsp;':''}}
            {{scope.row.drugCommonName}}
          </template>
        </el-table-column>
        <el-table-column label="批准文号" prop="approveNumber"></el-table-column>
        <el-table-column label="规格/单位" prop="specifications" width="120px">
          <template slot-scope="scope">{{scope.row.specifications}}/ {{scope.row.packageUnit}}</template>
        </el-table-column>
        <el-table-column label="厂家" prop="manufacturer" sortable width="120px"></el-table-column>
        <el-table-column label="中/大包装-可拆零" prop="" width="130px" v-if="isShowAll">
          <template slot-scope="scope">
            {{scope.row.mediumPackage}}/{{scope.row.largePackage}}-
            {{scope.row.isRetail==0?'不可拆零':scope.row.isRetail==1?'可拆零':''}}
          </template>
        </el-table-column>
        <el-table-column label="供应商报价" prop="supplierPrice" sortable width="120px" v-if="isShowAll"></el-table-column>
        <el-table-column label="库存" prop="repertory" v-if="isShowAll"></el-table-column>
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
      <span slot="footer" class="dialog-footer">
           <el-button @click="closeAddCommodityDiaolg">取 消</el-button>
           <el-button type="primary" @click="addCommoditySubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import commodity_api from "../../api/api_homeSetting"

  export default {
    name: "commodityDialog",
    props: {
      addCommodityDialog: {
        type: Boolean,
        default: false
      },
      checkboxCommodity: {
        type: Boolean,
        default: false
      },
      commodityIds: {
        type: Array,
        default: []
      },
      isShowAll:{  //  是否显示所有 中大包装-可拆零 供应商报价 库存等信息  默认为true 显示所有
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        multipleAddCommodity: [], //多选的添加商品
        searchCommodityname: "",//选择添加商品的搜索条件
        manufacturer: "",
        supplierName: "",
        approveNumber: "",
        specifications: "",
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1,
          short: "commodityCode",//排序字段
          order: "descending",//排序方式
        },
      }
    },
    methods: {
      //查询商品所有列表
      queryCommodityList() {
        let goodIds = "";
        console.log(this.commodityIds)
        if (this.commodityIds && this.commodityIds.length > 0) {
          this.commodityIds.forEach(item => {
            goodIds += item + ",";
          })
        }
        let param = {
          goodIds: goodIds,
          sort: this.table.sort == 'descending' ? 'desc' : '',
          order: this.table.order,
          page: this.table.currentPage,
          limit: this.table.pageSize,
          searchParam: this.searchCommodityname,
          manufacturer: this.manufacturer,
          supplierName: this.supplierName,
          approveNumber: this.approveNumber,
          specifications: this.specifications

        }
        commodity_api.queryGoodList(param).then(res => {
          if (res.code == 0) {
            this.table.data = res.data.rows;
            this.table.total = res.data.total;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //商品单选
      handleselectChange(val) {
        if (this.checkboxCommodity) {
          if (val.length > 1) {
            this.$refs.multipleTable.clearSelection()
            this.$refs.multipleTable.toggleRowSelection(val.pop());
          } else {
            this.multipleAddCommodity = val;
          }
        } else {
          this.multipleAddCommodity = val;
        }
      },
      //排序
      tableDataSortChange(column) {
        this.table.sort = column.prop;
        this.table.order = column.order;
        this.queryCommodityList();
      },
      //关闭添加商品弹出框
      closeAddCommodityDiaolg() {
        this.$emit("closeCommodityDialog")
        this.multipleAddCommodity = [];
        this.searchCommodityname = "";
        this.manufacturer = "";
        this.supplierName = "";
        this.approveNumber = "";
        this.specifications = "";
        this.$refs.multipleTable.clearSelection();
        this.table = {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1,
          sort: "commodityCode",//排序字段
          order: "descending",//排序方式
        }

      },
      //确定添加商品
      addCommoditySubmit() {
        let multipleLength = this.multipleAddCommodity.length;
        if (multipleLength <= 0) {
          this.$message.error("请勾选要添加的商品");
          return;
        }
        this.$emit("commoditySubmit", this.multipleAddCommodity)
        this.closeAddCommodityDiaolg();
      },
      //搜索
      addSearchCommodityList() {
        this.table.currentPage = 1;
        if (!this.searchCommodityname && !this.manufacturer && !this.supplierName && !this.specifications && !this.approveNumber) {
          this.$message.error("请输入搜索条件")
          return;
        }
        this.queryCommodityList();
      },
      //添加商品分页
      handleCurrentChange(val) {
        this.table.currentPage = val;
        this.queryCommodityList();
      },
      handleSizeChange(val) {
        this.table.pageSize = val;
        this.queryCommodityList();
        //
      },
      //点击添加商品行
      rowClick(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
      getRowKeys (row) {
        return row.commodityId
      },
      tableRowClassName4({row, rowIndex}) {
        let arr = this.multipleAddCommodity;
        for (let i = 0; i < arr.length; i++) {
          if (row.commodityId === arr[i].commodityId) {
            return 'rowStyle'
          }
        }
      },
    }
  }
</script>

<style scoped>

</style>
