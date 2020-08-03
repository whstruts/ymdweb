<template>
  <div class="central_library">
    <div class="tab_bg">
      <span class="switch_tab" @click="getReviewData('0')"
            :class="{'tab_active':dataStatus=='0'}">未处理（{{undisposedNumber}}）</span>
      <span class="switch_tab" @click="getReviewData('1')"
            :class="{'tab_active':dataStatus=='1'}">已处理（{{processedNumber}}）</span>
    </div>
    <div class="search_bg_wrap flex-row">
      <p>
        <span class="search_hint">商品</span>
        <el-input v-model="filters.conditionLike" placeholder="编码/商品名/通用名/厂家"
                  clearable   @keyup.enter.native="handleSearch" size="mini" style="width: 180px"></el-input>
      </p>
      <p>
        <span class="search_hint">通用名</span>
        <el-input v-model="filters.supplierNameLike" placeholder="请输入通用名"
                  clearable    @keyup.enter.native="handleSearch" size="mini"></el-input>
      </p>
      <p>
        <span class="search_hint">上架时间</span>
        <el-date-picker
          v-model="shelveTime"
          type="daterange"
          size="mini"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间" :editable="false" value-format="yyyy-MM-dd"
          format="yyyy-MM-dd" style="width: 210px">
        </el-date-picker>
      </p>

      <p>
        <span class="search_hint">更新时间</span>
        <el-date-picker
          v-model="updateTime"
          type="daterange"
          size="mini"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间" :editable="false" value-format="yyyy-MM-dd"
          format="yyyy-MM-dd" style="width: 210px">
        </el-date-picker>
      </p>
      <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询
      </el-button>
    </div>
    <div class="wrap_main flex-item scrollbar">
      <el-table
        :data="table.data"
        :span-method="objectSpanMethod"
        border
        :cell-class-name="colspanStyle"
        class="my_table"
        height="100%"
        stripe
        ref="table"
        :header-cell-class-name="headerCellClass"
      >
        <el-table-column fixed="left" label=" " type="index" width="40" align="center"></el-table-column>
        <el-table-column
          prop="drugName"
          fixed="left"
          label="商品名称" width="180px">
        </el-table-column>
        <el-table-column
          prop="drugSkuCode"
          label="商品编码" min-width width="120px">
        </el-table-column>
        <el-table-column
          prop="drugImg"
          label="通用名" width="180px">
        </el-table-column>
        <el-table-column
          prop="drugSkuCode"
          label="规格/单位" width="120px">
          <template slot-scope="scope">
            {{scope.row.specifications}} / {{ scope.row.packageUnit}}
          </template>
        </el-table-column>
        <el-table-column
          prop="drugSkuCode"
          label="中/大包装" width="100px">
          <template slot-scope="scope">
            {{scope.row.mediumPackage}} / {{scope.row.largePackage}}
          </template>
        </el-table-column>
        <el-table-column
          prop="manufacturer"
          label="厂家" width="200px">
        </el-table-column>
        <el-table-column
          prop="drugSkuCode"
          label="生产批次" width="120px" v-if="dataStatus=='1'" :key="Math.random()">
          <template slot-scope="scope">
            等待调试
          </template>
        </el-table-column>
        <el-table-column
          prop="drugSkuCode"
          label="近/远效期" width="120px" v-if="dataStatus=='1'" :key="Math.random()">
          <template slot-scope="scope">
            等待调试
          </template>
        </el-table-column>
        <el-table-column :width="dataStatus=='0'?'1092px':'1762px'">
          <template slot="header" slot-scope="scope">
            <div class="table_data_header ">
              <p class="title_span" style="width: 200px;padding-left: 0px">所属供应商<span
                class="title_span_line_right"></span></p>
              <p class="title_span">状态<span class="title_span_line_right"></span></p>
              <p class="table_column">
                <span class="title_span">价格类型</span>
                <span class="title_span">供应商报价</span>
                <span class="title_span">基础报价</span>
                <span class="title_span">最高报价
                    <el-tooltip class="item" effect="dark" content="用于控制合伙人乱加价现象，设定最高报价值" placement="top-end">
                     <i class="iconfont icon-question-valign-bottom"></i>
                   </el-tooltip>
                  <span class="title_span_line_right"></span></span>
              </p>
              <p class="title_span">可用库存 <span class="title_span_line_right"></span></p>
              <p class="title_span">搜索排序 <span class="title_span_line_right"></span></p>
              <p class="title_span" v-show="dataStatus=='1'">采购数据 <span class="title_span_line_right"></span></p>
              <p class="title_span data_style_length" v-show="dataStatus=='1' ">上架时间 <span
                class="title_span_line_right"></span></p>
              <p class="title_span data_style_length" v-show="dataStatus=='1'">下架时间 <span
                class="title_span_line_right"></span></p>
              <p class="title_span" v-show="dataStatus=='1'">下架原因 <span class="title_span_line_right"></span></p>
              <p class="title_span data_style_length" v-show="dataStatus=='1'">更新时间 <span
                class="title_span_line_right"></span></p>
              <p class="title_span">更新人</p>
            </div>
          </template>
          <template slot-scope="scope">
            <div class="table_content_row" v-for="(data,position) in scope.row.list" :key="position">
              <div class="title_span gong_ying_shagn" style="width: 200px;padding-left: 0px">
                <template v-if="data.supplierName">
                  <p style="display: inline-block;width: 130px" class="text_overflow" :title="data.supplierName">
                    {{data.supplierName}}</p>
                  <span class="span_setting" @click="commoditySetting(data)"
                        :class="{'span_active':data.shelveStatus=='1'}"
                  >{{data.shelveStatus=='1'?'下架':'上架'}}</span>
                </template>
                <span class="title_span_line_right"></span>
              </div>
              <p class="title_span">
                {{data.shelveStatus=='1'?'已上架':'已下架'}}<span class="title_span_line_right"></span>
              </p>
              <div class="table_column" style="padding-bottom: 10px">
                <p>
                  <span class="title_span ">单体价</span>
                  <span class="title_span">{{data.supplierPrice}}</span>
                  <span class="title_span">
                      <el-input v-model="data.baseUnitPrice"
                                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" size="mini"
                                style="width: 80px;"></el-input>
                    </span>
                  <span class="title_span">
                      <el-input v-model="data.maxUnitPrice"
                                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" size="mini"
                                style="width: 80px;"></el-input>
                    </span>
                </p>
                <p>
                  <span class="title_span">连锁价</span>
                  <span class="title_span">{{data.supplierPrice}}</span>
                  <span class="title_span">
                      <el-input v-model="data.baseChainPrice"
                                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" size="mini"
                                style="width: 80px;"></el-input>
                    </span>
                  <span class="title_span">
                      <el-input v-model="data.maxChainPrice"
                                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" size="mini"
                                style="width: 80px;"></el-input>
                    </span>
                </p>
                <p>
                  <span class="title_span">商业价</span>
                  <span class="title_span">{{data.supplierPrice}}</span>
                  <span class="title_span">
                      <el-input v-model="data.baseCommercialPrice"
                                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"
                                size="mini" style="width: 80px;"></el-input>
                    </span>
                  <span class="title_span">
                      <el-input v-model="data.maxCommercialPrice"
                                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"
                                size="mini"
                                style="width: 80px;"></el-input>
                    </span>
                </p>
                <span class="title_span_line_right"></span>
              </div>

              <p class="title_span">{{data.repertory}} <span class="title_span_line_right"></span></p>
              <p class="title_span">
                <el-input v-model="data.orderNum" onkeyup="value=value.replace(/[^\d]/g,'')" size="mini"
                          style="width: 80px;"></el-input>
                <span class="title_span_line_right"></span>
              </p>

              <p class="title_span " v-show="dataStatus=='1'">等待调试<span class="title_span_line_right"></span></p>
              <p class="title_span data_style_length" v-show="dataStatus=='1'">{{data.shelveTime}}<span
                class="title_span_line_right"></span></p>
              <p class="title_span data_style_length"
                 v-show="dataStatus=='1'">{{data.unshelveTime}}<span class="title_span_line_right"></span></p>
              <p class="title_span" v-show="dataStatus=='1'">{{data.unshelveRemark}}<span
                class="title_span_line_right"></span>
              </p>
              <p class="title_span data_style_length" v-show="dataStatus=='1'">{{data.updateTime}}<span
                class="title_span_line_right"></span></p>
              <p class="title_span"> {{data.updateUser}} <span class="title_span_line_right"></span></p>
            </div>
          </template>
        </el-table-column>

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
      title="下架原因"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible setting_dialog"
      width="585px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="dialog_body" style="background: #fff;padding-bottom: 0px">
        <el-input type="textarea" placeholder="请输入下架原因" :rows="6" maxlength="500" show-word-limit
                  v-model="unshelveRemark"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="handleClose">取 消</el-button>
           <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from '../../../api/api_central_library'

  export default {
    name: "centralLibrary",
    data() {
      return {
        filters: {
          conditionLike: "",
          supplierNameLike: ""
        },
        shelveTime: null,
        updateTime: null,
        dataStatus: "0",
        table: {
          data: [],
          total: 3,
          pageSize: 10,
          currentPage: 1
        },
        processedNumber: 0,//已处理的数据
        undisposedNumber: 0,//未处理的数据
        inputPrice: "",
        dialogVisible: false,
        unshelveRemark: '',
        commodityId: '',
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
      colspanStyle({row, column, rowIndex, columnIndex}) {
        let index = this.dataStatus == '0' ? 7 : 9;
        if (columnIndex == index) {
          return 'colspan_style';
        } else {
          return 'default_cell'
        }
      },
      headerCellClass({row, column, rowIndex, columnIndex}) {
        let index = this.dataStatus == '0' ? 7 : 9;
        if (columnIndex == index) {
          return 'header_cell_class';
        }
      },
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        /* if (rowIndex % 2 === 0) {
           if (columnIndex === 0) {
             return [1, 2];
           } else if (columnIndex === 1) {
             return [0, 0];
           }
         }*/
      },
      commoditySetting(item) {
        let hint = item.shelveStatus == '1' ? '下架' : '上架';
        this.$confirm('确认' + hint + '商品?', '提示', {
          type: 'warning'
        }).then(() => {
          //上架状态,0未上架，1上架，2下架
          if (item.shelveStatus == '1') {
            this.dialogVisible = true;
            this.commodityId = item.commodityId;
          } else if (item.shelveStatus == '0' || item.shelveStatus == '2') {
            API.shelve(item).then(res => {
              if (res.code == 0) {
                this.$message.success(res.msg)
                this.initData();
              } else {
                this.$message.error(res.msg)
              }
            })
          }

        }).catch(() => {
        });
      },
      submitData() {
        if (!this.unshelveRemark) {
          this.$message.error("请填写下架原因");
          return;
        }
        API.unshelve({commodityId: this.commodityId, unshelveRemark: this.unshelveRemark}).then(res => {
          this.dialogVisible = false;
          if (res.code == 0) {
            this.$message.success(res.msg)
            this.initData();
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleClose() {
        this.dialogVisible = false;
        this.commodityId = '';
        this.unshelveRemark = '';
      },
      initNum() {
        API.initDataNum().then(res => {
          if (res.code == 0) {
            this.processedNumber = res.data.processedNumber;
            this.undisposedNumber = res.data.undisposedNumber;
          } else {
            this.processedNumber = 0;
            this.undisposedNumber = 0;
          }
        })
      },
      initData() {
        this.initNum();
        this.table.data = []
        let param = Object.assign({}, this.filters);
        if (this.shelveTime && this.shelveTime.length >= 2) {
          param.shelveTimeStart = this.shelveTime[0];
          param.shelveTimeEnd = this.shelveTime[1];
        }
        if (this.updateTime && this.updateTime.length >= 2) {
          param.updateTimeStart = this.updateTime[0];
          param.updateTimeEnd = this.updateTime[1];
        }
        param.limit = this.table.pageSize;
        param.page = this.table.currentPage;
        param.status = this.dataStatus;
        API.list(param).then(res => {
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
      }
      ,
      //分页
      handleCurrentChange(val) {
        this.table.currentPage = val;
        this.initData();
      },
      handleSizeChange(val) {
        this.table.pageSize = val;
        this.initData();
      },
      getReviewData(status) {
        this.dataStatus = status;
        this.table.currentPage = 1;
        this.initData();
      },
      //判断只能输入数字
      checkNo(value, index, position) {
        let reg = /^[1-9]\d*$/;
        if (value) {
          if (value > 999999 || new RegExp(reg).test(value) == false) {
            this.$message.error("排序只能输入数字")
            setTimeout(() => {
              this.table.data[index].list[position].orderNum = ''
            }, 500);
          }
        }
      },
      numberCheck(value, index, position, str) {
        let reg = /^\d+$|^\d*\.\d+$/g;
        if (value) {
          if (value > 999999 || new RegExp(reg).test(value) == false) {
            this.$message.error("只能输入数字和小数点")
            setTimeout(() => {
              this.table.data[index].list[position][str] = ""
            }, 500);
          }
        }
      },
    }
  }
</script>

<style lang="scss">

  .central_library {
    .el-table--striped .el-table__body tr.hover-row > td {
      background-color: #EDF8FF !important;
    }
    .default_cell {
    }
    .colspan_style {
      padding: 0px;
      .cell {
        padding: 0px;
      }
    }
    .header_cell_class {
      padding: 0px;
      .cell {
        height: 34px;
        line-height: 32px;
      }
    }
    .table_data_header {
      height: 100%;
      height: 34px;
      padding: 0px;
      font-size: 0px;
    }

    .title_span {
      width: 110px;
      height: 100%;
      font-size: 12px;
      display: inline-block;
      padding-left: 10px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #333;
      line-height: 36px;
    }
    .table_column {
      display: inline-block;
      height: inherit;
      position: relative;
      p {
        height: 40px;
        .title_span {
          line-height: 28px;
        }
      }
    }
    .data_style_length {
      width: 150px;
    }
    .title_span_line_right {
      box-sizing: border-box;
      display: inline-block;
      position: absolute;
      right: 0px;
      top: 0px;
      bottom: 0px;
      width: 1px;
      background: #ECEFF6;
    }
    .table_content_row {
      border-bottom: 1px solid #ECEFF6;
      padding-left: 10px;
      display: flex;
      display: -webkit-flex;
      align-items: stretch;
      font-size: 0px;
      .title_span_line_right {
        top: -12px;
        bottom: -12px;
      }
      .title_span {
        height: inherit;
        padding: 10px;
      }
      .gong_ying_shagn {
        p {
          vertical-align: middle;
        }

        .span_setting {
          color: #0680FD;
          border: 1px solid #A5D1FF;
          background: #EDF8FF;
          cursor: pointer;
          border-radius: 5px;
          padding: 2px 11px;
          vertical-align: middle;
          box-sizing: border-box;
        }
        .span_active {
          color: #333;
          background: #fff;
          border-color: #DEDEDE;
        }
      }
    }
    .table_content_row:last-child {
      border-bottom: initial;
    }


  }
</style>
