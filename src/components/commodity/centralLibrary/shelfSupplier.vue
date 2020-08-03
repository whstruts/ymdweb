<template>
  <div class="central_library">
    <div class="search_bg_wrap ">
      <div class="search-box flex-row" v-if="isDisplaySearch">
        <p>
          <span class="search_hint">商品</span>
          <el-input v-model="filters.conditionLike" placeholder="编码/商品名/通用名/厂家"
                    clearable @keyup.enter.native="handleSearch" size="mini" ></el-input>
        </p>
        <p>
          <span class="search_hint">所属供应商</span>
          <el-input v-model="filters.supplierNameLike" placeholder="供应商名称"
                    clearable @keyup.enter.native="handleSearch" size="mini"></el-input>
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
            format="yyyy-MM-dd">
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
    <div class="setting_button_bg" style="margin-bottom: 0;padding-right: 10px">
      <div class=" setting_button_tag">
        <span class="primary_button" v-if="$utils.checkButton('shelfSupplier:shelf')" @click="handleShelf">上架供应商</span>
      </div>
    </div>
    <div class="wrap_main flex-item scrollbar" style="margin-top:15px">
      <el-table
        :data="table.data"
        border
        class=""
        height="100%"
        ref="table"
        :row-class-name="tableRowClassName"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        v-loading="loading">
        <el-table-column label=" " type="index" width="40" align="center"></el-table-column>
        <el-table-column
          type="selection"
          width="45" align="center" :selectable="chkstu">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">未上架</span>
            <span v-if="scope.row.status == 1">已上架</span>
            <span v-if="scope.row.status == 2">已下架</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="drugSkuCode"
          label="商品编码" width="180px">
        </el-table-column>
        <el-table-column
          prop="drugName"
          label="商品名称" min-width="180px">
        </el-table-column>

        <el-table-column
          prop="drugSkuCode"
          label="规格" width="120px">
          <template slot-scope="scope">
            {{scope.row.specifications}}
          </template>
        </el-table-column>
        <el-table-column
          prop="drugCommonName"
          label="通用名称" min-width="200px">
        </el-table-column>
        <el-table-column
          prop="manufacturer"
          label="生产厂家" min-width="200px">
        </el-table-column>
        <el-table-column
          prop="approveNumber"
          label="批准文号" width="180px">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间" width="180px">
        </el-table-column>
        <el-table-column
          prop="supplierName"
          label="所属供应商" min-width="100px">
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
  </div>
</template>

<script>
  import API from '../../../api/api_central_library'

  export default {
    name: "shelfSupplier",
    data() {
      return {
        loading: false,
        isDisplaySearch:true,
        filters: {
          conditionLike: "",
          supplierNameLike: ""
        },
        updateTime: null,
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        multipleSelection: []
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
      tableRowClassName({row, rowIndex}) {
        let arr = this.multipleSelection;
        if (row.status != 1) {
          for (let i = 0; i < arr.length; i++) {
            if (row.drugSkuId === arr[i].drugSkuId) {
              return 'rowStyle'
            }
          }
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //点击行触发，选中或不选中复选框
      handleRowClick(row, column, event) {
        if (row.status != 1) {
          this.$refs.table.toggleRowSelection(row);
        }
      },
      // 根据状态设置复选框是否能选
      chkstu(row, index) {
        return row.status != 1 ? true : false;
      },
      handleShelf() {
        if (this.multipleSelection.length <= 0) {
          this.$message.error("请选择要上架的供应商");
          return;
        }
        this.$confirm('确认要上架吗?', '提示', {
          type: 'warning'
        }).then(() => {
          let str = ''
          for (let i in this.multipleSelection) {
            str += this.multipleSelection[i].scId + ","
          }
          API.shelve({scId: str}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg)
              this.initData();
            } else {
              this.$message.error(res.msg)
            }
          })

        }).catch(() => {
        });
      },
      initData() {
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
        this.loading = true;
        API.shelfSupplier(param).then(res => {
          this.loading = false;
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
    }
  }
</script>

<style lang="scss">

  .central_library {
    .setting_button_tag {
      .primary_button {
        padding: 6px 12px;
        border-radius: 5px;
        font-size: 12px;
        margin-right: 12px;
        border: 1px solid #E5E6E7;
        color: #333333;
        cursor: pointer;
        background: #EDF8FF;
        border-color: #A5D1FF;
        color: #0680FD;
      }
    }
    .el-table--striped .el-table__body tr.hover-row > td {
      background-color: #EDF8FF !important;
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
