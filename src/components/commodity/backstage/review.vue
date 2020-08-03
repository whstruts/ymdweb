<template>
  <div class="review">
    <div class="tab_bg">
      <span class="switch_tab" @click="getReviewData('1')"
            :class="{'tab_active':dataStatus=='1'}">待审核（{{waitNumber}}）</span>
      <span class="switch_tab" @click="getReviewData('2')"
            :class="{'tab_active':dataStatus=='2'}">已审核（{{passNumber}}）</span>
      <span class="switch_tab" @click="getReviewData('9')"
            :class="{'tab_active':dataStatus=='9'}">未通过（{{ubpassNumber}}）</span>
    </div>
    <div class="search_bg_wrap ">
      <div class="search-box flex-row" v-if="isDisplaySearch">
        <!--   <p>
             <span class="search_hint">审核状态</span>
             <el-select v-model="filters.status">
               <el-option
                 v-for="item in statusData"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
             </el-select>
           </p>-->
        <p>
          <span class="search_hint">类&nbsp;&nbsp;&nbsp;型&nbsp;</span>
          <el-select v-model="filters.type" @change="handleSearch" size="mini">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </p>
        <p>
          <span class="search_hint">产品名称</span>
          <el-input v-model="filters.drugNameLike" clearable placeholder=""
                    @keyup.enter.native="handleSearch" size="mini"></el-input>
        </p>
        <p>
          <span class="search_hint">通用名</span>
          <el-input v-model="filters.drugCommonNameLike" clearable placeholder=""
                    @keyup.enter.native="handleSearch" size="mini"></el-input>
        </p>
        <p>
          <span class="search_hint">批准文号</span>
          <el-input v-model="filters.approveNumberLike" clearable placeholder=""
                    @keyup.enter.native="handleSearch" size="mini"></el-input>
        </p>

        <p>
          <span class="search_hint">提交时间</span>
          <el-date-picker
            v-model="submitTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" :editable="false" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"  size="mini">
          </el-date-picker>
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
      <el-table stripe :data="table.data" border ref="table" height="100%" default-expand-all class="my_table "
                :cell-class-name="cell">
        <el-table-column label=" " type="index" width="40" align="center"></el-table-column>
        <el-table-column label="产品信息（spu）" min-width="350px">
          <template slot-scope="scope">
            <div class="product_spu">
              <img :src="scope.row.drugImg"
                   class="product_spu_img"/>
              <div class="product_spu_content">
                <p class="text_overflow">
                  <span class="product_title_hint ">产品名称：</span>
                  <span :title="scope.row.drugName">{{scope.row.drugName}}</span>
                </p>
                <p class="text_overflow">
                  <span class="product_title_hint">通用名称：</span>
                  <span :title="scope.row.drugCommonName">{{scope.row.drugCommonName}}</span>
                </p>
                <p class="text_overflow">
                  <span class="product_title_hint">生产厂家：</span>
                  <span :title="scope.row.manufacturer">{{scope.row.manufacturer}}</span>
                </p>
                <p class="text_overflow">
                  <span class="product_title_hint">批准文号：</span>
                  <span :title="scope.row.approveNumber">{{scope.row.approveNumber}}</span>
                </p>
                <p style="margin: 5px 0px">
                    <span class="span_button"
                          @click="reviewProduct(scope.row)"
                          v-if=" dataStatus=='1' && scope.row.auditStatus=='1' && scope.row.submitType!='3' && $utils.checkButton('review:product')">审核产品</span>

                  <span :style="{color:scope.row.auditStatus=='2'?' #00B78D':'#F85C5D'}"
                        v-if="dataStatus!='1' && scope.row.auditStatus!='1' ">{{scope.row.auditStatus=='2'?'审核已通过':scope.row.auditStatus=='9'?'审核未通过':' '}}</span>
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息（sku）" min-width="430px">
          <template slot-scope="scope">
            <div class="product_spu commodity_sku flex-row" v-for="(item,index) in scope.row.skuAuditList" :key="index"
                 v-if="scope.row.skuAuditList.length>0" style="padding-left: 0px">
              <!--   <img :src="item.drugImg"
                      class="product_spu_img"/>-->
              <div class="commodity_sku_content flex-item" style="margin-left: 0px">
                <div>
                  <p class="text_overflow"><span class="product_title_hint ">规格：</span>
                    <span>{{item.specifications}}</span>
                  </p>
                  <p class="text_overflow">
                    <span class="product_title_hint "> 中/大包装：</span>
                    <span>{{item.mediumPackage}}/{{item.largePackage}}</span>
                  </p>
                </div>
                <div>
                  <p class="text_overflow"><span class="product_title_hint ">包装单位：</span>
                    <span>{{item.packageUnit}}</span>
                  </p>
                  <p class="text_overflow">
                    <span class="product_title_hint">提交人：</span>
                    <span>{{item.submitUser}}</span>
                  </p>
                </div>
              </div>
              <p>
                    <span class="span_button"
                          @click="reviewCommodityku(item,scope.row.auditStatus)"
                          v-if="item.auditStatus=='1' && $utils.checkButton('review:commodity')">商品审核</span>
                <span :style="{color:item.auditStatus=='2'?' #00B78D':'#F85C5D'}"
                      v-if="item.auditStatus!='1' ">{{item.auditStatus=='2'?'审核已通过':item.auditStatus=='9'?'审核未通过':'-'}}</span>
              </p>
            </div>
            <span style="color: #999999" v-if="scope.row.skuAuditList.length<=0">暂无商品信息</span>
          </template>
        </el-table-column>


        <el-table-column label="审核意见" prop="remark" min-width="200px" v-if="dataStatus!='1'"
                         :key="Math.random()"></el-table-column>
        <el-table-column label="申请理由" prop="submitRemark" min-width="200px"></el-table-column>
        <el-table-column label="申请类型" prop="submitType" min-width="100px">
          <template slot-scope="scope">
            <span>{{scope.row.submitType=='1'?'产品规格新增':scope.row.submitType=='2'?'产品修改':scope.row.submitType=='3'?'规格新增':'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="spu提交人" prop="submitUser" min-width="100px"></el-table-column>
        <el-table-column label="提交时间" prop="submitTime" width="160px"></el-table-column>
        <el-table-column label="提交流水号" prop="提交流水号" min-width="140px"></el-table-column>
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
      :title="dialogSettingTitle"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible"
      width="1045px"
      center
      :close-on-click-modal="false"
      :before-close="closeDataDialog"
    >
      <add-product ref="product" v-if="dialogTag=='reviewProduct'" :review="true" :productData="productData"
                   @reviewData="reviewData" @closeDialog="dialogVisible=false"></add-product>
      <add-commodity ref="product" v-if="dialogTag=='reviewCommodity'" :review="true" :productInfo="productInfo"
                     @reviewData="reviewData" :commodityData="commodityData"
                     @closeDialog="dialogVisible=false"></add-commodity>
    </el-dialog>
  </div>
</template>

<script>
  import addProduct from "./addProduct"
  import addCommodity from "./addCommodity"
  import API from "../../../api/api_review"

  export default {
    name: "review",
    components: {addProduct, addCommodity},
    data() {
      return {
        isDisplaySearch:true,
        filters: {
          status: "0",
          type: "0",
          drugNameLike: "",
          drugCommonNameLike: "",
          approveNumberLike: "",
        },
        submitTime: null,
        typeData: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '产品规格新增',
          disabled: true
        }, {
          value: '2',
          label: '产品修改'
        },
          {
            value: '3',
            label: '规格新增'
          }],
        /*  statusData: [{
            value: '0',
            label: '全部'
          }, {
            value: '1',
            label: '待审核'
          }, {
            value: '2',
            label: '通过',
            disabled: true
          }, {
            value: '9',
            label: '拒绝'
          }],*/
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        dialogVisible: false,
        dialogSettingTitle: "审核产品规格信息",
        dialogTag: "reviewProduct",
        productData: {},
        productInfo: {},
        commodityData: {},
        dataStatus: "1",
        passNumber: 0,
        ubpassNumber: 0,
        waitNumber: 0
      }
    },
    created() {
      this.initData();
    },
    beforeUpdate() {
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
    },
    methods: {
      cell({row, column, rowIndex, columnIndex}) {
        //第2列添加 table_commodity_info 类
        if (columnIndex == 1) {
          return 'table_commodity_info'
        }
      },
      getReviewData(status) {
        this.dataStatus = status;
        this.table.currentPage = 1;
        this.initData();
      },
      initNum() {
        API.initDataNum().then(res => {
          if (res.code == 0) {
            this.passNumber = res.data.passNumber;
            this.ubpassNumber = res.data.ubpassNumber;
            this.waitNumber = res.data.waitNumber;
          } else {
            this.passNumber = 0;
            this.ubpassNumber = 0;
            this.waitNumber = 0;
          }
        })
      },
      initData() {
        this.initNum();
        this.table.data = []
        let param = Object.assign({}, this.filters);
        console.log(this.submitTime)
        if (this.submitTime && this.submitTime.length >= 2) {
          param.submitTimeStart = this.submitTime[0];
          param.submitTimeEnd = this.submitTime[1];
        }
        param.limit = this.table.pageSize;
        param.page = this.table.currentPage;
        param.status = this.dataStatus;
        API.spuList(param).then(res => {
          if (res.code == 0) {
            this.table.data = res.data.rows;
            this.table.total = res.data.total;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //审核产品
      reviewProduct(item) {
        if (!item || !item.auditId) {
          this.$message.error('数据信息有误，请联系管理员')
          return;
        }
        API.getSpuInfo({auditId: item.auditId}).then(res => {
            if (res.code == 0) {
              let data = res.data;
              if (data.originalDrugSpu == null) {
                data.originalDrugSpu = {}
              }
              if (data.changeDrugSpu) {
                for (var obj in data.changeDrugSpu) {
                  data.originalDrugSpu[obj] = data.changeDrugSpu[obj];
                }
              }

              data.originalDrugSpu.auditId = data.auditId;
              this.productData = data.originalDrugSpu;
              this.dialogVisibleShow('reviewProduct')
            } else {
              this.$message.error(res.msg)
            }
          }
        )
      },
      reviewData() {
        this.dialogVisible = false;
        this.initData();
      },
      //审核商品
      reviewCommodityku(item, auditStatus) {
        //审核状态为通过时。不允许再审核  同时如果产品状态没有审核。商品信息也不允许被审核
        if (auditStatus == '1') {
          this.$message.error("请先审核产品信息")
          return;
        }
        if (item.auditStatus == 2 || !item.auditId) {
          return;
        }
        API.getSkuInfo({auditId: item.auditId}).then(res => {
          if (res.code == 0) {
            let data = res.data;
            this.productInfo = data.drugSpuSimple;
            this.commodityData = data.changeDrugSku;
            this.commodityData.auditId = data.auditId;
            this.dialogVisibleShow('reviewCommodity')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
      ,
      //分页
      handleCurrentChange(val) {
        this.table.currentPage = val;
        this.initData();
      }
      ,
      handleSizeChange(val) {
        this.table.pageSize = val;
        this.initData();
      },
      handleSearch() {
        this.table.currentPage = 1;
        this.initData();
      }
      ,
      dialogVisibleShow(tag) {
        this.dialogTag = tag;
        this.dialogSettingTitle = tag == 'reviewProduct' ? '审核产品规格信息' : tag == 'reviewCommodity' ? '审核规格信息' : '暂无标题';
        this.dialogVisible = true
      }
      ,
      closeDataDialog() {
        this.$refs.product.resetForm();
      },
    }
  }
</script>

<style lang="scss">
  .review {
    .table_commodity_info {
      .cell {
        padding-left: 0px;
        padding-right: 0px;
      }
    }

    .product_spu {
      text-align: left;
      padding-left: 5px;
      .product_spu_img {
        width: 41px;
        height: 36px;
        vertical-align: top;
        margin-top: 6px
      }
      .product_spu_content {
        width: 260px;
      }
      .product_spu_content, .commodity_sku_content {
        display: inline-block;
        vertical-align: top;
        margin-left: 16px;
        div {
          width: 100%;
          height: 25px;
          p {
            color: #333;
            line-height: 30px;
            width: 49%;
            display: inline-block;
            .product_title_hint {
              color: #999999;
            }
          }
        }

      }
    }
    .commodity_sku {
      border-bottom: 1px solid #DEDEDE;
      padding: 15px;
      box-sizing: border-box;
    }
    .commodity_sku:first-child {
      padding-top: 0px;
    }
    .commodity_sku:last-child {
      border-bottom: 0px;

    }
    .span_button {
      margin-right: 5px;
      padding: 5px 11px;
      background: #EDF8FF;
      color: #0680FD;
      border-radius: 3px;
      cursor: pointer;
      border: 1px solid #A5D1FF;
      box-sizing: border-box;
    }
    .look_info {
      cursor: pointer;
      display: inline-block;
      border: 1px solid #DEDEDE;
      padding: 1px 8px;
      margin-top: 5px;
      border-radius: 3px;
    }
    /*.el-table__expanded-cell {
      background: #F5F5F5;
    }
    .el-table__expanded-cell:hover {
      background: #F5F5F5 !important;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0px;
    }*/
    .table_info {
      margin: 14px;
      border-radius: 10px;
      padding: 24px 0px 24px 72px;
      min-width: 1200px;
      background: #fff;
      .audit_status {
        background: #DEDEDE;
        color: #666;
        cursor: not-allowed;
      }
      .table_content {
        min-width: 700px;
        margin-left: 50px;
        padding-right: 20px;
        box-sizing: border-box;
        span {
          margin-right: 60px;
        }
      }
      .table_setting_button {
        width: 180px;
        height: 100%;

        .audit_status {
          background: #DEDEDE;
          color: #666;
          cursor: not-allowed;
        }
        .delete {
          background: #fff;
          color: #333;
          border: 1px solid #DEDEDE;
          box-sizing: border-box;
        }
      }
    }
    .title_hint {
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
    }
    .important_hint {
      color: #EB5454;
      margin-bottom: 15px;
      height: 20px;
      line-height: 20px;
    }

    .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
      content: ""
    }
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: #EDF8FF !important;
  }
</style>
