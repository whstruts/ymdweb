<template>
  <div class="quote_wrap">
    <div class="search_bg_wrap quote_wrap_search flex-row">
      <el-dropdown @command="objectTypeSelect" trigger="click" style="padding-top: 2px">
        <span class="select_button">{{objectTypeIndex==1?'1合伙人':objectTypeIndex==2?'1买家':'1选择对象'}}</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">合伙人</el-dropdown-item>
          <el-dropdown-item command="2">买家</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-input placeholder="" v-model="currentObjectName"
                size="small" style="width: 240px;margin-right: 10px" readonly></el-input>

      <span class="select_button" @click="openSelectCommodityDialog" style="margin-left: 35px">2选择商品</span>
      <el-input placeholder="" v-model="commodityName"
                size="small" style="width: 240px;margin-right: 10px" readonly></el-input>

      <el-button size="mini" type="warning" @click="handleSearch" style="margin-left: 45px;margin-top: 5px"><i
        class="iconfont icon-chaxun"></i>查询
      </el-button>
    </div>
    <div class="wrap_main flex-item scrollbar">
      <el-table :data="table.data" border height="100%" class="my_table " style="width: 100%">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="合伙人" align="center" width="100">
          <template slot-scope="scope">
            {{tempCurrentObject.partnerName }}
          </template>
        </el-table-column>
        <el-table-column label="买家" align="center" v-if="tempCurrentObject.objectTypeIndex==2"
                         :key="Math.random()">
          <template slot-scope="scope">
            {{tempCurrentObject.name}}
          </template>
        </el-table-column>
        <el-table-column prop="drugSkuCode" label="商品编码"></el-table-column>
        <el-table-column prop="drugName" label="商品名称"></el-table-column>
        <el-table-column label="通用名称" prop="drugCommonName"></el-table-column>
        <el-table-column prop="specifications" label="规格" width="100px"></el-table-column>
        <el-table-column prop="manufacturer" label="厂家"></el-table-column>
        <el-table-column prop="supplierName" label="供应商"></el-table-column>
        <el-table-column prop="dateExpiration" label="效期"></el-table-column>
        <el-table-column prop="createTime" label="价格" v-if="tempCurrentObject.objectTypeIndex==2"
                         :key="Math.random()">
          <template slot-scope="scope">
            {{tempCurrentObject.specifyQuotation
            ==1?scope.row.unitPrice:tempCurrentObject.specifyQuotation==2?scope.row.chainPrice:tempCurrentObject.specifyQuotation
            ==3?scope.row.commercialPrice:'-'}}
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单体价" v-if="tempCurrentObject.objectTypeIndex==1"
                         :key="Math.random()"></el-table-column>
        <el-table-column prop="chainPrice" label="连锁价" v-if="tempCurrentObject.objectTypeIndex==1"
                         :key="Math.random()"></el-table-column>
        <el-table-column prop="commercialPrice" label="商业价" v-if="tempCurrentObject.objectTypeIndex==1"
                         :key="Math.random()"></el-table-column>
      </el-table>
    </div>
    <div class="setting_pagination" v-if="table.total>0">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 50, 100, 150]"
        small
        :total="table.total" :current-page.sync="table.currentPage"
        :page-size="table.pageSize">
      </el-pagination>
      <el-button type="primary" size="mini" plain>确 定</el-button>
    </div>

    <el-dialog
      :title="objectTypeIndex==1?'合伙人信息':objectTypeIndex==2?'买家信息':'-'"
      :visible.sync="objectTypeDialog"
      class="cms_dialog_visible"
      width="750px"

      :close-on-click-modal="false"
      :before-close="closeObjectTypeDiaolg">
      <div class="search_bg_wrap" style="margin-bottom: 15px">
        <el-input v-model="objectTypeVal" clearable
                  :placeholder="objectTypeIndex==1?'登录账号/合伙人/手机号/邀请码':'登录账号/客户名称/联系人/手机号/客户编码'"
                  style="width: 300px;margin-right:15px" size="small"
        ></el-input>
        <el-button size="small" type="warning" @click="searchObjectType"><i class="iconfont icon-chaxun"></i>查询
        </el-button>
      </div>
      <el-table
        :data="objectType.data"
        border
        height="300"
        ref="objectTable"
        style="width: 100%;"
        :row-class-name="tableRowClassName" @row-click="handleRowClick" @selection-change="handleSelectionChange2"
        :row-key="getObjectTypeRowKeys" class="object_type_table">
        <el-table-column type="index" width="60" label=" " align="center"></el-table-column>
        <el-table-column type="selection" width="45" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column label="登录账号" prop="code"
                         :width="objectTypeIndex==1?'180':'140'"></el-table-column>
        <el-table-column :label="objectTypeIndex==2?'客户名称':objectTypeIndex==1?'合伙人':'-'" prop="name"></el-table-column>
        <el-table-column label="联系人" prop="linkName" v-if="objectTypeIndex==2"></el-table-column>
        <el-table-column label="手机号" prop="phone"
                         min-width="110"></el-table-column>
        <el-table-column label="客户编码" prop="customerCode" v-if="objectTypeIndex==2"></el-table-column>
        <el-table-column label="邀请码" prop="invitationCode" v-if="objectTypeIndex==1"></el-table-column>
      </el-table>
      <div class="setting_pagination" v-if="objectType.total>0">
        <el-pagination @current-change="handleCurrentChange1"
                       @size-change="handleSizeChange1"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10, 50, 100, 150]"
                       small
                       :total="objectType.total" :current-page.sync="objectType.currentPage"
                       :page-size="objectType.pageSize"></el-pagination>
        <el-button type="primary" size="mini" plain>确 定</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="closeObjectTypeDiaolg">取 消</el-button>
           <el-button type="primary" @click="objectTypeDataSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="选择商品"
      :visible.sync="selectCommodityDialog"
      class="cms_dialog_visible"
      width="900px"
      :close-on-click-modal="false"
      :before-close="closeSelectCommodityDiaolg">
      <div class="search_bg_wrap" style="margin-bottom: 15px">
        <el-input v-model="searchCommodityVal" clearable placeholder="编码/商品名/厂家"
                  style="width: 250px;margin-right:15px" size="small"
        ></el-input>
        <el-button size="small" type="warning" @click="searchCommodityList"><i class="iconfont icon-chaxun"></i>查询
        </el-button>
      </div>
      <el-table
        :data="commodity.data"
        border
        height="300"
        ref="multipleTable"
        style="width: 100%;" @row-click="rowClick"
        @selection-change="handleselectAll" :row-key="getRowKeys">
        <!--:row-class-name="tableRowClassName4"-->
        <el-table-column type="selection" width="45" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column label="商品编码" prop="drugSkuCode" width="100px"></el-table-column>
        <el-table-column label="商品名称" prop="drugName"></el-table-column>
        <el-table-column label="通用名称" prop="drugCommonName"></el-table-column>
        <el-table-column label="规格/单位" width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.specifications}}/{{scope.row.packageUnit}}</span>
          </template>
        </el-table-column>
        <el-table-column label="厂家" prop="manufacturer"></el-table-column>
        <el-table-column label="所属供应商" prop="loginName">
          <template slot-scope="scope">
            {{scope.row.supplierName}}
          </template>
        </el-table-column>
      </el-table>
      <div class="setting_pagination" v-if="commodity.total>0">
        <el-pagination @current-change="handleCurrentChange4"
                       @size-change="handleSizeChange4"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10, 50, 100, 150]"
                       small
                       :total="commodity.total" :current-page.sync="commodity.currentPage"
                       :page-size="commodity.pageSize"></el-pagination>
        <el-button type="primary" size="mini" plain>确 定</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="closeSelectCommodityDiaolg">取 消</el-button>
           <el-button type="primary" @click="selectCommoditySubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from "../../api/api_quote"

  export default {
    name: "quote",
    data() {
      return {
        filters: {
          name: ""
        },
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        objectTypeIndex: 0,
        objectTypeDialog: false,
        currentObject: [],//选中的当前对象  关闭弹框后currentObject数据会被清空点所以要把数据保存到copyCurrentObject里
        copyCurrentObject: [],//点击确定后保存currentObject的数据
        tempCurrentObject: [], //点击搜索后，因为列表中选择用户的信息要展示出来。
        objectTypeVal: "",
        openObjectTypeStatue: false,//是否是打开了选择对象的dialog
        currentObjectName: "",
        objectType: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        selectCommodityDialog: false,
        openSelectCommodityStatue: false,//是否是打开了选择商品的dialog
        searchCommodityVal: "",
        multipleSelectCommodity: [],
        //点击确定后保存已经勾选了的商品数据  为了解决用户勾选了数据保存了之后，再次打开dialog勾选数据，
        // 然后点击了取消，然后再次打开dialog要把界面还原成第一次点击保存了数据的样子
        tempMultipleSelectCommodity: [],
        commodityName: "",
        drugSkuIds: [],//选择的sku商品信息
        commodity: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
      }
    },
    created() {
      // this.initData();
    },
    methods: {
      initData() {
        let param = {
          limit: this.table.pageSize,
          page: this.table.currentPage,
          searchType: this.objectTypeIndex,
          partnerId: this.tempCurrentObject.partnerId,
          list: this.drugSkuIds,
        }
        API.list(param).then(res => {
          if (res.code == 0) {
            //清空掉选择商品里的搜索内容和选择的商品
            if (this.tempMultipleSelectCommodity && this.tempMultipleSelectCommodity.length > 0) {
              this.searchCommodityVal = "";
              this.openSelectCommodityStatue = false;
              this.tempMultipleSelectCommodity = [];
              this.multipleSelectCommodity = [];
              if (this.$refs.multipleTable) {
                this.$refs.multipleTable.clearSelection();
              }
              this.commodity = {
                data: [],
                total: 0,
                pageSize: 10,
                currentPage: 1
              };
            }
            this.table.data = res.data.rows;
            this.table.total = res.data.total;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //分页
      handleCurrentChange(val) {
        this.table.currentPage = val;
        this.initData();
      },
      handleSizeChange(val) {
        this.table.pageSize = val;
        this.initData();
      },
      handleSearch() {
        if (!this.currentObjectName || this.copyCurrentObject.length <= 0) {
          this.$message.error("请选择对象")
          return;
        }
        if (this.drugSkuIds.length <= 0) {
          this.$message.error("请选择商品")
          return;
        }

        this.tempCurrentObject = Object.assign({}, this.copyCurrentObject[0]);
        this.tempCurrentObject.objectTypeIndex = this.objectTypeIndex;
        this.table.currentPage = 1;
        this.initData();
      },
      //选择的查询对象
      objectTypeSelect(val) {
        if (this.objectTypeIndex != val) {
          // this.copyCurrentObject = [];
          this.closeObjectTypeDiaolg();
        }
        this.objectTypeIndex = val;
        this.objectTypeDialog = true;
        this.openObjectTypeStatue = true;
        this.$nextTick(() => {
          this.$refs.objectTable.doLayout()
        });
        this.initObjectTypeData();
      },
      closeObjectTypeDiaolg() {
        this.objectTypeDialog = false;
        this.objectTypeVal = "";
        this.currentObject = [];
        if (this.$refs.objectTable) {
          this.$refs.objectTable.clearSelection();
        }
        this.objectType = {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        };
      },
      //选择对象查询
      searchObjectType() {
        this.objectType.currentPage = 1;
        this.initObjectTypeData();
      },
      initObjectTypeData() {
        let param = {
          value: this.objectTypeVal,
          searchType: this.objectTypeIndex,
          limit: this.objectType.pageSize,
          page: this.objectType.currentPage,
        }
        API.userList(param).then(res => {
          if (res.code == 0) {
            this.objectType.data = res.data.rows;
            this.objectType.total = res.data.total;
            if (this.openObjectTypeStatue && this.copyCurrentObject.length > 0) {
              this.$refs.objectTable.toggleRowSelection(this.copyCurrentObject[0], true);
              this.openObjectTypeStatue = false;
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleSelectionChange2(val) {
        if (val.length > 1) {
          this.$refs.objectTable.clearSelection()
          this.$refs.objectTable.toggleRowSelection(val.pop(), true);
        } else {
          this.currentObject = val;
        }
      },
      getObjectTypeRowKeys(row) {
        return row.code + row.name;
      },
      handleRowClick(row, column, event) {
        this.$refs.objectTable.toggleRowSelection(row, true);
      },
      tableRowClassName({row, rowIndex}) {
        let arr = this.currentObject;
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          if (row.code === item.code && row.name === item.name) {
            return 'rowStyle'
          }
        }
      },

      //选中的对象数据提交
      objectTypeDataSubmit() {
        if (!this.currentObject || this.currentObject.length <= 0) {
          this.$message.error("请选择对象")
          return;
        }
        this.currentObjectName = this.currentObject[0].name;
        this.copyCurrentObject = JSON.parse(JSON.stringify(this.currentObject));
        this.objectTypeDialog = false;
        //每次选择新的合伙人或者买家，都要清除掉之前选择的商品
        this.drugSkuIds = [];
        this.tempMultipleSelectCommodity = [];
        this.closeSelectCommodityDiaolg();
      },
      //分页
      handleCurrentChange1(val) {
        this.objectType.currentPage = val;
        this.initObjectTypeData();
      },
      handleSizeChange1(val) {
        this.objectType.pageSize = val;
        this.initObjectTypeData();
      },


      //打开选择商品的dialog
      openSelectCommodityDialog() {
        if (!this.copyCurrentObject || this.copyCurrentObject.length <= 0) {
          this.$message.error("请先选择对象");
          return;
        }
        this.selectCommodityDialog = true;
        this.openSelectCommodityStatue = true;
        if (this.tempMultipleSelectCommodity.length > 0) {
          this.initCommodityData();
        }
      },
      closeSelectCommodityDiaolg() {
        if (this.drugSkuIds.length <= 0) {
          this.searchCommodityVal = "";
          this.commodityName = "";
        }
        this.multipleSelectCommodity = [];
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
        }
        this.selectCommodityDialog = false;
        this.commodity = {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        };
      },
      //选择商品确定
      selectCommoditySubmit() {
        if (this.multipleSelectCommodity.length <= 0) {
          this.$message.error("请勾选选择的商品！")
          return;
        }
        this.drugSkuIds = [];
        this.tempMultipleSelectCommodity = [];
        let num = 1;
        this.multipleSelectCommodity.forEach(item => {
          this.drugSkuIds.push({drugSkuId: item.drugSkuId, supplierId: item.supplierId});
          this.tempMultipleSelectCommodity.push(item);
          if (num <= 10) {
            this.commodityName += item.drugName + "  " + item.drugCommonName + ",";
            num++;
          }
        })
        this.multipleSelectCommodity = [];
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
        }
        this.selectCommodityDialog = false;
      },
      searchCommodityList() {
        this.commodity.currentPage = 1;
        this.initCommodityData();
      },
      initCommodityData() {
        let param = {
          value: this.searchCommodityVal,
          limit: this.commodity.pageSize,
          page: this.commodity.currentPage,
          partnerId: this.copyCurrentObject[0].partnerId
        }
        API.commodityList(param).then(res => {
          if (res.code == 0) {
            this.commodity.data = res.data.rows;
            this.commodity.total = res.data.total;
            if (this.openSelectCommodityStatue && this.tempMultipleSelectCommodity.length > 0) {
              this.tempMultipleSelectCommodity.forEach(item => {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              })
              this.openSelectCommodityStatue = false;
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //添加商品分页
      handleCurrentChange4(val) {
        this.commodity.currentPage = val;
        this.initCommodityData();
      },
      handleSizeChange4(val) {
        this.commodity.pageSize = val;
        this.initCommodityData();
      },
      //点击添加商品行
      rowClick(row) {
        this.$refs.multipleTable.toggleRowSelection(row, true)

      },
      //全选函数  点击全选遍历当页数据若无添加,若是反选则删除(判断是否是全选还是反选)
      handleselectAll(val) {
        this.multipleSelectCommodity = val;
      },
      getRowKeys(row) {//记录每行的key值
        return row.drugSkuId + row.supplierId;
      },
      tableRowClassName4({row, rowIndex}) {
        let arr = this.multipleSelectCommodity;
        for (let i = 0; i < arr.length; i++) {
          if (row.commodityId === arr[i].commodityId) {
            return 'rowStyle'
          }
        }
      },
    }
  }
</script>

<style lang="scss">
  .quote_wrap {
    .quote_wrap_search {
      margin-top: 15px;
      .select_button {
        border: 1px solid #DEDEDE;
        display: inline-block;
        width: 95px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border-radius: 5px;
        margin-right: 10px;
        color: #333;
        cursor: pointer;
        box-sizing: border-box;
        font-size: 12px;
      }

    }
  }

  .object_type_table {
    .el-table__header-wrapper .cell {
      .el-checkbox {
        display: none !important;
      }
    }
  }
</style>
