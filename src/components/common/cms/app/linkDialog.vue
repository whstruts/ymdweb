<template>
  <div>
    <el-dialog
      title="添加链接"
      class="cms_dialog_visible add-link-dialog"
      width="899px"
      :visible.sync="addLinkDialog"
      :close-on-click-modal="false"
      :before-close="closeLinkDialog">
      <div class="nav-tabs">
        <el-tabs v-model="linkType" type="card">
          <el-tab-pane label="跳转到页面" name="first"></el-tab-pane>
          <el-tab-pane label="活动" name="second"></el-tab-pane>
          <el-tab-pane label="商品" name="third"></el-tab-pane>
          <el-tab-pane label="外部链接" name="fourth"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="link-content">
        <template v-if="linkType == 'first'">
          <el-table
            :data="pageData"
            ref="fTable"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            @row-click="handleRowClick"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="">
            </el-table-column>
            <el-table-column
              prop=""
              label="keywords" name="input-colum" width="320px">
              <template slot-scope="scope">
                <div style="width:200px" v-if="scope.row.id == 1">
                  <el-input v-model="scope.row.keywords" size="mini" placeholder="请输入搜索关键字"></el-input>
                </div>
                <el-select v-model="scope.row.keywords" size="mini" placeholder="请选择一级分类" v-if="scope.row.id == 5" @change="handleTopClassChange">
                  <el-option
                    v-for="item in topClass"
                    :key="item.typeCode"
                    :label="item.name"
                    :value="item.typeCode">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-if="linkType == 'second'">
          <!-- <el-table
            :data="activeData"
            ref="aTable"
            style="width: 100%"
            :row-class-name="tableRowClassName2"
            @row-click="handleRowClick2"
            @selection-change="handleSelectionChange2">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="栏目">
            </el-table-column>
            <el-table-column
              prop="desc"
              label="">
            </el-table-column>
          </el-table> -->
          <div class="flex-wrp">
            <label style="padding-right:10px">活动链接</label>
            <el-input class="flex-item" placeholder="https://" size="mini" v-model="activityAddress"></el-input>
          </div>
        </template>
        <template v-if="linkType == 'third'">
          <div class="search_bg_wrap" style="margin-bottom: 15px">
            <el-input v-model="commodityName" clearable placeholder=""
                      style="width: 350px;margin-right:15px" size="small"
                      disabled></el-input>
            <el-button size="small" type="warning" @click="searchCommodityValue"><i class="iconfont icon-chaxun"></i>选择商品
            </el-button>
          </div>
        </template>
        <template v-if="linkType == 'fourth'">
          <div class="flex-wrp">
            <label style="padding-right:10px">外部链接</label>
            <el-input class="flex-item" placeholder="https://" size="mini" v-model="linkAddress"></el-input>
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeLinkDialog">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
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
        :row-class-name="tableRowClassName3"
        @selection-change="handleselectChange3"
        @row-click="rowClick3"
        @sort-change="tableDataSortChange3"
        :default-sort="{prop: 'drugSkuCode', order: 'desc'}">
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column label="商品编码" prop="drugSkuCode" sortable width="120px"></el-table-column>
        <el-table-column label="商品通用名" prop="drugCommonName" sortable width="120px"></el-table-column>
        <el-table-column label="批准文号" prop="approveNumber"></el-table-column>
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
      <div class="setting_pagination" v-if="commodityTable.total>0">
        <el-pagination @current-change="handleCurrentChange3"
                       @size-change="handleSizeChange3"
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
  import commodity_api from "../../../../api/api_homeSetting"
  import topic_api from "../../../../api/api_topic"
  export default {
    name: 'linkDialog',
    data() {
      return {
        loading: false,
        linkType: 'first',
        multipleSelection: [],
        multipleSelection2: [],
        multipleAddCommodity: [],
        editCommodityData: [], //编辑商品集合
        pageData: [],
        activeData: [],
        commodityName: '', // 选中的商品名
        commodityTable: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1,
        },
        activityAddress: '',  // 活动链接
        linkAddress: '',  // 外链
        addCommodityDialog: false,
        submitLoading: false,
        filters: {
          searchParam: '',
          manufacturer: '',
          supplierName: '',
          specifications: '',
          approveNumber: ''
        },
        topClass: [] // 一级分类
      }
    },
    props: {
      addLinkDialog: {
        type: Boolean,
        default: false
      },
      itemInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    watch: {
      'itemInfo': {
        handler(val) {
          let jumpPage = val.jumpPage;
          let obj = {
            id: val.id
          }
          switch (jumpPage) {
            case "0":
              this.linkType = 'first';
              this.$nextTick(() => {
                let pdata = this.pageData;
                for (let i in pdata) {
                  // 如果传递过来的id值跟data里边的id相同，将该列表选中
                  if (pdata[i].id == val.linkAddress.id) {
                    this.multipleSelection.push(this.pageData[i]);
                    this.$refs.fTable.toggleRowSelection(this.pageData[i], true);
                  }
                }
                if (val.linkAddress.id == 1) {
                  this.pageData[0].keywords = val.linkAddress.keywords
                }
                if (val.linkAddress.id == 5) {
                  this.pageData[4].keywords = val.linkAddress.keywords
                }

              })
              break;
            case "1":
              this.linkType = 'second';
              // this.$refs.aTable.toggleRowSelection(this.activeData[val.idx], true);
              // this.activeData[val.idx].keywords = val.linkAddress.keywords
              this.activityAddress = val.linkAddress.outlink;
              break;
            case "2":
              this.linkType = 'third';
              this.$nextTick(() => {
                this.commodityName = val.linkAddress.drugCommonName;
                let commodityTable = this.commodityTable.data;
                this.multipleAddCommodity.push(val.linkAddress);
              })
              break;
            case "3":
              this.linkType = 'fourth';
              this.linkAddress = val.linkAddress.outlink;
              break;
            default:
              this.linkType = 'first';
          }
        },
        deep: true
      },
      linkType(newVal){
        if(newVal == 'first') {
          this.$nextTick(() => {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.$refs.fTable.toggleRowSelection(this.multipleSelection[i]);
            }
          })
        }
      }
    },
    created() {
      this.pageData = [
        {
          id: 1,
          name: "搜索列表",
          keywords: ''
        },
        {
          id: 2,
          name: "历史采购",
          keywords: ''
        },
        {
          id: 3,
          name: "我的关注",
          keywords: ''
        },
        {
          id: 4,
          name: "我的缺货篮",
          keywords: ''
        },
        {
          id: 5,
          name: "分类搜索",
          keywords: ''
        },
      ]
      this.getTopClass();
    },
    methods: {
      // 获取活动列表
      getTopic(){
        topic_api.getActivityList().then( (res) =>{
          if(res.code == 0) {

          } else {
            this.$message.error(res.msg);
          }
        })
      },
      // 获取一级分类
      getTopClass(){
        commodity_api.getTopClass().then( (res) =>{
          if(res.code == 0) {
            this.topClass = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      handleSelectionChange(val) {
        if (val.length > 1) {
          this.$refs.fTable.clearSelection()
          this.$refs.fTable.toggleRowSelection(val.pop());
        } else {
          this.multipleSelection = val;
        }
      },
      handleTopClassChange(val){
        console.log(val)
      },
      handleRowClick(row, column, event) {
        if (column && column.label && column.label == "keywords") return;
        this.$refs.fTable.toggleRowSelection(row);
      },
      tableRowClassName({row, rowIndex}) {
        let arr = this.multipleSelection;
        for (let i = 0; i < arr.length; i++) {
          if (row.id === arr[i].id) {
            return 'rowStyle'
          }
        }
      },
      handleSelectionChange2(val) {
        if (val.length > 1) {
          this.$refs.aTable.clearSelection()
          this.$refs.aTable.toggleRowSelection(val.pop())
        } else {
          this.multipleSelection2 = val;
        }
      },
      handleRowClick2(row, column, event) {
        this.$refs.aTable.toggleRowSelection(row);
      },
      tableRowClassName2({row, rowIndex}) {
        let arr = this.multipleSelection2;
        for (let i = 0; i < arr.length; i++) {
          if (row.id === arr[i].id) {
            return 'rowStyle'
          }
        }
      },
      // 选择商品
      searchCommodityValue() {
        this.addCommodityDialog = true;
      },
      //搜索
      addSearchCommodityList() {
        this.commodityTable.currentPage = 1;
        this.queryCommodityList();
      },
      //查询商品所有列表
      queryCommodityList() {
        let goodIds = "";
        this.editCommodityData.forEach(item => {
          goodIds += item.commodityId + ",";
        })
        let params = this.filters;
        params.goodIds = goodIds;
        params.page = this.commodityTable.currentPage;
        params.limit = this.commodityTable.pageSize;
        params.order = this.commodityTable.order == 'descending' ? 'desc' : '';
        params.sort = this.commodityTable.sort
        commodity_api.queryGoodList(params).then(res => {
          if (res.code == 0) {
            this.commodityTable.data = res.data.rows;
            this.commodityTable.total = res.data.total;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //添加商品分页
      closeAddCommodityDiaolg() {
        this.addCommodityDialog = false
      },
      handleCurrentChange3(val) {
        this.commodityTable.currentPage = val;
        this.queryCommodityList();
      },
      handleSizeChange3(val) {
        this.commodityTable.pageSize = val;
      },
      //商品单选
      handleselectChange3(val) {
        if (val.length > 1) {
          this.$refs.multipleTable.clearSelection()
          this.$refs.multipleTable.toggleRowSelection(val.pop());
        } else {
          this.multipleAddCommodity = val;
        }
      },
      //点击添加商品行
      rowClick3(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      tableRowClassName3({row, rowIndex}) {
        let arr = this.multipleAddCommodity;
        for (let i = 0; i < arr.length; i++) {
          if (row.commodityId === arr[i].commodityId) {
            return 'rowStyle'
          }
        }
      },
      tableDataSortChange3(column) {
        console.log(column)
        this.commodityTable.sort = column.prop;
        this.commodityTable.order = column.order;
        this.queryCommodityList();
      },
      closeLinkDialog() {
        this.clearLinkDialog();
        this.$emit("closeLinkDialog")
      },
      //确定添加商品
      addCommoditySubmit() {
        let status = false;
        let multipleLength = this.multipleAddCommodity.length;
        if (multipleLength <= 0) {
          this.$message.error("请勾选要添加的商品");
          return;
        }
        this.commodityName = this.multipleAddCommodity[0].drugCommonName;
        this.addCommodityDialog = false;
      },
      // 清除 linkDialog信息
      clearLinkDialog() {
        if (this.$refs.fTable) {
          this.$refs.fTable.clearSelection()
        }
        this.multipleSelection = [];
        this.multipleSelection2 = [];
        this.multipleAddCommodity = [];
        this.searchCommodityname = "";
        this.linkAddress = "";
        this.pageData[0].keywords = "";
        this.commodityName = "";
        this.filters = {
          searchParam: '',
          manufacturer: '',
          supplierName: '',
          specifications: '',
          approveNumber: ''
        }
        this.commodityTable = {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1,
        }
      },
      submit() {
        let obj = this.itemInfo;
        if (this.linkType == 'first') {
          if (this.multipleSelection.length == 0) {
            this.$message.error("请选择跳转页面");
            return;
          } else {
            if (this.multipleSelection[0].id == '1' && this.multipleSelection[0].keywords == '') {
              this.$message.error("请填写搜索关键字");
              return;
            }
            if (this.multipleSelection[0].id == '5' && this.multipleSelection[0].keywords == '') {
                this.$message.error("请选择一级分类");
                return;
            }
            obj.linkAddress = this.multipleSelection[0];
            if(this.multipleSelection[0].id == '5') {
              for( let i in this.topClass) {
                if(this.multipleSelection[0].keywords == this.topClass[i].typeCode) {
                  obj.linkAddress.topClassName = this.topClass[i].name
                }
              }
            }
            obj.jumpPage = "0";
            obj.linkAddress.keywords = this.multipleSelection[0].keywords;
            obj.keywords = this.multipleSelection[0].keywords;
          }
        } else if (this.linkType == 'second') {
          if (this.activityAddress == '') {
            this.$message.error("请选择活动");
            return;
          } else {
            obj.linkAddress = {
              outlink: this.activityAddress
            };
            obj.jumpPage = "1";
          }
        } else if (this.linkType == 'third') {
          console.log(this.commodityTable)
          if (this.multipleAddCommodity.length == 0) {
            this.$message.error("请选择商品");
            return;
          } else {
            obj.linkAddress = this.multipleAddCommodity[0];
            obj.jumpPage = "2";
          }
        } else if (this.linkType == 'fourth') {
          if (this.linkAddress == '') {
            this.$message.error("请输入外部链接地址");
            return;
          } else {
            obj.linkAddress = {
              outlink: this.linkAddress
            };
            obj.jumpPage = "3";
          }
        }
        console.log(obj)
        let data = JSON.parse(JSON.stringify(obj));
        this.clearLinkDialog();
        this.$emit('submitLink', data);
      }
    }
  }

</script>
<style lang="scss">
  .add-link-dialog {
    .el-dialog__body {
      height: 436px;
    }
    .el-tabs__header {
      margin: 0 -20px 15px;
      padding-left: 21px;
      .el-tabs__nav {
        border-radius: 0;
      }
      .el-tabs__item {
        padding: 0 !important;
        width: 87px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: #999;
        text-align: center;
        background-color: #F5F7FA;
        border-bottom: 1px solid #E5E6E7;
        box-sizing: border-box;
        &.is-active {
          color: #333;
          background-color: #ffffff;
        }
      }
    }
    .el-table {
      thead {
        display: none;
      }
    }
  }
</style>
