<template>
  <div class="maintenance">
    <div class="setting_button_bg">
      <div class="setting_button_tag button_add" @click="dialogVisibleShow('addProduct','')"
           v-if="$utils.checkButton('maintenance:add:product')">
        <i class="iconfont icon-xinjian"></i><span>添加产品</span>
      </div>
    </div>
    <div class="search_bg_wrap ">
      <div class="search-box flex-row" v-if="isDisplaySearch">
        <p>
          <span class="search_hint">产品名称</span>
          <el-input v-model="filters.drugNameLike" clearable placeholder=""
                    @keyup.enter.native="handleSearch" size="mini"></el-input>
        </p>
        <p>
          <span class="search_hint">通&nbsp;用&nbsp;名&nbsp;</span>
          <el-input v-model="filters.drugCommonNameLike" clearable placeholder=""
                    @keyup.enter.native="handleSearch" size="mini" ></el-input>
        </p>
        <p>
          <span class="search_hint">批准文号</span>
          <el-input v-model="filters.approveNumberLike" clearable placeholder=""
                    @keyup.enter.native="handleSearch" size="mini" ></el-input>
        </p>
        <p>
          <span class="search_hint">创建时间</span>
          <el-date-picker
            v-model="createTime"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" :editable="false" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd" ></el-date-picker>
        </p>
        <p>
          <span class="search_hint">更新时间</span>
          <el-date-picker
            v-model="updateTime"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" :editable="false" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd" ></el-date-picker>
        </p>
        <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询
        </el-button>
      </div>
      <a href="javascript:;" v-if="isDisplaySearch" class="opr-search-btn" @click="isDisplaySearch = false">收起<i
        class="iconfont icon-shouqi2"></i></a>
      <a href="javascript:;" v-if="!isDisplaySearch" class="opr-search-btn search-btn" @click="isDisplaySearch = true">查询<i
        class="iconfont icon-zhankai1"></i></a>
    </div>
    <div class="wrap_main flex-item scrollbar">
      <el-table :data="table.data" border ref="table" class="my_table" height="100%">
        <el-table-column label=" " type="index" width="40" align="center"></el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <div class="table_setting_button">
              <el-button type="primary" plain size="mini" v-if="$utils.checkButton('maintenance:edit:product')"
                         @click="dialogVisibleShow('editProduct',scope.row.drugId)">编辑
              </el-button>
              <el-button type="primary" plain size="mini" v-if="$utils.checkButton('maintenance:add:commodity')"
                         @click="dialogVisibleShow('addCommodity','',scope.row)">添加商品
              </el-button>
              <el-button type="danger" plain size="mini" v-if="$utils.checkButton('maintenance:delete:product')"
                         @click="deleteProduct(scope.row.drugId)">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="72px">
          <template slot-scope="scope">
            <img :src="scope.row.drugImg" style="width: 41px;height: 36px"/>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" prop="drugName" min-width="175px">
          <template slot-scope="scope">
            <div class="flex-row">
              <p class="flex-item text_overflow">{{scope.row.drugName}}</p>
              <span v-if="$utils.checkButton('maintenance:look:product')" class="look_info"
                    @click="dialogVisibleShow('productInfo',scope.row.drugId)">查看</span>
            </div>

          </template>
        </el-table-column>
        <el-table-column label="规格" prop="name" min-width="200px">
          <template slot-scope="scope">
            <div class="flex-row">
              <p class="flex-item text_overflow">
                该产品存在 <span style="color: #0680FD">{{scope.row.drugSkuNum}}</span> 个规格
              </p>
              <span @click="toogleExpand(scope.row)" class="look_info"
                    v-if="scope.row.drugSkuNum>0 && $utils.checkButton('maintenance:look:commodityList') "
                    :style="{color:toogleRowId==scope.row.drugId?'#0680FD':''}"> {{toogleRowId==scope.row.drugId?'收起':'查看'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="通用名称" prop="drugCommonName" width="115px">
          <template slot-scope="scope"><p class="text_overflow" :title="scope.row.drugCommonName">
            {{scope.row.drugCommonName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="生产厂家" prop="manufacturer" width="115px">
          <template slot-scope="scope"><p class="text_overflow" :title="scope.row.manufacturer">
            {{scope.row.manufacturer}}</p>
          </template>
        </el-table-column>
        <el-table-column label="批准文号" prop="approveNumber" min-width="140px"></el-table-column>
        <el-table-column label="所属分类" prop="typeCodeName" min-width="160px">
          <template slot-scope="scope">
            <el-tree :data="scope.row.levels"
                     :props="defaultProps" default-expand-all class="filter-tree" ref="tree"></el-tree>
          </template>
        </el-table-column>
        <el-table-column label="处方分类" prop="recipeType" min-width="104px"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="155px"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="155px"></el-table-column>
        <el-table-column type="expand" width="1px">
          <template slot-scope="props">
            <div class="table_info flex-row" v-for="(item,index) in drugSkuList" :key="index">
              <img :src="item.frontView" style="width: 41px;height: 36px"/>
              <div class="table_content flex-item">
                <span>规格：{{item.specifications}}</span>
                <span>包装单位：{{item.packageUnit}}</span>
                <span>中包装：{{item.mediumPackage}}{{item.packageUnit}}</span>
                <span>大包装：{{item.largePackage}}{{item.packageUnit}}</span>
                <span>商品条码：{{item.barCode}}</span>
              </div>

              <div class="table_setting_button" style="width: 500px">
                <span v-if="$utils.checkButton('maintenance:look:commodity')" class="look_info"
                      @click="dialogVisibleShow('commodityInfo','',props.row ,item)">查看</span>
                <span v-if="$utils.checkButton('maintenance:edit:commodity')" class="look_info"
                      @click="dialogVisibleShow('editCommodity','',props.row ,item)">修改</span>
                <span v-if="$utils.checkButton('maintenance:delete:commodity')" class="look_info"
                      @click="deleteCommodity(item.drugSkuId)">删除</span>
              </div>
            </div>
            <!--  <div class="shouqi"><span @click="toogleExpandSetting(props.row)">收起<i
                class="iconfont icon-shouqi"></i></span></div>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="setting_pagination" v-if="table.total>0 ">
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :page-sizes="[10, 50, 100, 150]"
                     small
                     :total="table.total" :current-page.sync="table.currentPage"
                     :page-size="table.pageSize"></el-pagination>
      <el-button type="primary" size="mini" plain>确 定</el-button>
    </div>


    <el-dialog
      :title="dialogSettingTitle"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible"
      width="960px"
      top="10vh"
      :close-on-click-modal="false"
      :before-close="closeDataDialog"
    >
      <add-product ref="product" v-if="dialogTag=='addProduct' ||dialogTag=='editProduct'  || dialogTag=='productInfo'"
                   :productData="productData"
                   :review="false"
                   @submitProductData="submitProductDatas" @closeDialog="dialogVisible=false"></add-product>

      <add-commodity ref="product"
                     v-if="dialogTag=='addCommodity' || dialogTag=='editCommodity' || dialogTag=='commodityInfo'"
                     :productInfo="productInfo"
                     :commodityData="commodityData"
                     :review="false"
                     @submitProductData="submitProductDatas"
                     @closeDialog="dialogVisible=false"></add-commodity>
    </el-dialog>
  </div>
</template>

<script>
  import addProduct from "./addProduct"
  import addCommodity from "./addCommodity"
  import API from "../../../api/api_maintenance"

  export default {
    name: "maintenance",
    components: {addProduct, addCommodity},
    data() {
      return {
        isDisplaySearch: true,
        filters: {
          drugNameLike: "",
          drugCommonNameLike: "",
          approveNumberLike: "",

        },
        createTime: null,
        updateTime: null,
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        drugSkuList: [],
        defaultProps:
          {
            children: 'children',
            label: 'text',
          },
        dialogVisible: false,
        dialogSettingTitle: "添加产品",
        dialogTag: "addProduct",
        productData: {},
        productInfo: {},
        commodityData: {},
        toogleRowId: '-1',//点击查看规格的行id
      }
    },
    created() {
      this.initData();
    },
    methods: {
      initData() {
        this.toogleRowId = "-1";
        let param = {
          limit: this.table.pageSize,
          page: this.table.currentPage,
          drugNameLike: this.filters.drugNameLike,
          drugCommonNameLike: this.filters.drugCommonNameLike,
          approveNumberLike: this.filters.approveNumberLike,
        }
        if (this.createTime && this.createTime.length >= 2) {
          param.createTimeStart = this.createTime[0];
          param.createTimeEnd = this.createTime[1];
        }
        if (this.updateTime && this.updateTime.length >= 2) {
          param.updateTimeStart = this.updateTime[0];
          param.updateTimeEnd = this.updateTime[1];
        }
        API.spuList(param).then(res => {
          if (res.code == 0) {
            this.table.data = res.data.rows;
            this.table.total = res.data.total;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleSearch() {
        this.table.currentPage = 1;
        this.initData();
      },
      submitProductDatas() {
        this.dialogVisible = false;
        this.initData();
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

      dialogVisibleShow(tag, drugId, item, commodityData) {
        // this.productData = {};
        this.dialogTag = tag;
        this.dialogSettingTitle = tag == 'addProduct' ? '添加产品' : tag == 'addCommodity' ?
          '添加商品' : tag == 'editProduct' ? '编辑产品' : tag == 'editCommodity' ? '编辑商品' : tag == 'commodityInfo' ? '商品详情' : tag == 'productInfo' ? '产品详情' : '暂无标题'

        if ((tag == 'editProduct' || tag == 'productInfo') && drugId) {
          API.spuInfo({drugId: drugId}).then(res => {
            if (res.code == 0) {
              this.productData = res.data;
              this.dialogVisible = true
            } else {
              this.$message.error(res.msg)
            }
          })
        } else if (tag == 'addCommodity' && item) {
          this.dialogVisible = true
          this.productInfo = item;
          this.commodityData = null;
        } else if ((tag == 'editCommodity' || tag == 'commodityInfo') && item && commodityData) {
          this.productInfo = item;
          API.skuInfo({drugSkuId: commodityData.drugSkuId}).then(res => {
            if (res.code == 0) {
              this.commodityData = res.data;
              this.dialogVisible = true
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.dialogVisible = true
        }
      },
      deleteProduct(drugId) {
        this.$confirm('确认删除产品信息?', '提示', {
          type: 'warning'
        }).then(() => {
          API.delete({drugId}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.initData();
            } else {
              this.$message.error(res.msg)
            }
          })
          done();
        }).catch(() => {

        });
      },
      deleteCommodity(drugSkuId) {
        this.$confirm('确认删除规格信息信息?', '提示', {
          type: 'warning'
        }).then(() => {
          API.deleteCommodity({drugSkuId}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.initData();
            } else {
              this.$message.error(res.msg)
            }
          })
          done();
        }).catch(() => {

        });
      },
      closeDataDialog() {
        this.$refs.product.resetForm();
      },
      toogleExpand(row) {
        this.drugSkuList = [];
        let param = {
          drugId: row.drugId
        }
        if (this.toogleRowId == row.drugId) {
          this.toogleRowId = -1;
        } else {
          this.toogleRowId = row.drugId;
        }
        API.drugSkuList(param).then(res => {
          if (res.code == 0) {
            this.toogleExpandSetting(row);
            this.drugSkuList = res.data;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      toogleExpandSetting(row) {
        let $table = this.$refs.table;
        this.table.data.map((item) => {
          if (row.drugId != item.drugId) {
            $table.toggleRowExpansion(item, false);
          }
        });
        $table.toggleRowExpansion(row)
      }
    }
  }
</script>

<style lang="scss">
  .maintenance {
    .search_bg_wrap {
      p {
        margin-right: 15px;
        .el-input {
          width: 155px;
        }
      }
    }
    .el-table__expand-column {
      display: none;
    }
    .el-table__expanded-cell {
      background: #F5F5F5;
    }
    .el-table__expanded-cell:hover {
      background: #F5F5F5 !important;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0px;
    }
    .table_info {
      margin: 10px;
      border-radius: 10px;
      padding: 2px 10px 2px 72px;
      min-width: 1200px;
      background: #fff;
      .table_content {
        margin-left: 50px;
        span {
          margin-right: 60px;
        }
      }

    }
    .shouqi {
      text-align: center;
      line-height: 33px;
      background: #fff;
      color: #79BBFF;
      border: 1px solid #ECF0F1;

      span {
        vertical-align: middle;
        cursor: pointer;
      }
      i {
        margin-left: 8px;
        color: #666;
        vertical-align: middle;
      }
    }
    /*  .table_info:last-child {
        margin-bottom: 0px;
      }*/
    /* .title_hint {
       font-size: 16px;
       line-height: 20px;
       padding-bottom: 10px;
       .circle {
         display: inline-block;
         width: 6px;
         height: 6px;
         background: rgba(20, 217, 182, 1);
         border-radius: 50%;
         margin-right: 5px;
       }
       span {
         vertical-align: middle;
         font-weight: 600;
       }
     }*/
    .important_hint {
      color: #FF290C;
      margin-bottom: 15px;
      height: 20px;
      line-height: 20px;
      i {
        font-size: 16px;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
      }
    }
    .el-tree {
      background: initial;
      color: #333333;
      .el-tree-node__expand-icon:not(.is-leaf) {
        color: #333333;
        font-size: 16px;
      }
    }
    .el-dialog__body {
      padding: 0px !important;
    }
  }
</style>
