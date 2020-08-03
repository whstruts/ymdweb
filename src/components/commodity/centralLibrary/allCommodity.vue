<template>
  <div class="central_library">
    <div class="search_bg_wrap ">
      <div class="search-box flex-row" v-if="isDisplaySearch">
        <p>
          <span class="search_hint">状&nbsp;&nbsp;&nbsp;&nbsp;态</span>
          <el-select v-model="filters.commodityStatus" placeholder="请选择" size="mini" @change="handleSearch">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in statusData"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </p>
        <p>
          <span class="search_hint">商品</span>
          <el-input v-model="filters.conditionLike" placeholder="商品编码/商品名称/通用名称"
                    clearable @keyup.enter.native="handleSearch" size="mini" style="width: 200px"></el-input>
        </p>
        <p>
          <span class="search_hint">所属供应商</span>
          <el-input v-model="filters.supplierName" placeholder=" 供应商名称"
                    clearable @keyup.enter.native="handleSearch" size="mini"></el-input>
        </p>
        <p>
          <span class="search_hint">厂家</span>
          <el-input v-model="filters.manufacturer" placeholder=" 厂家"
                    clearable @keyup.enter.native="handleSearch" size="mini"></el-input>
        </p>
        <p>
          <span class="search_hint">批准文号</span>
          <el-input v-model="filters.approveNumber" placeholder=" 批准文号"
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
            format="yyyy-MM-dd" style="width: 210px">
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
      <el-table :data="table.data" border class="my_table" height="100%" stripe ref="table" v-loading="loading"
                @sort-change="tableDataSortChange" :default-sort="{prop: 'drugSkuCode', order: 'descending'}">
        <el-table-column label=" " type="index" width="40" align="center"></el-table-column>
        <el-table-column prop="commodityStatus" label="状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.commodityStatus == 1">新品</span>
            <span v-if="scope.row.commodityStatus == 2">在售</span>
            <span v-if="scope.row.commodityStatus == 3">库存紧张</span>
            <span v-if="scope.row.commodityStatus == 4">售罄</span>
            <span v-if="scope.row.commodityStatus == 5">下架</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsSn" label="供应商编码" min-width="90px"></el-table-column>
        <el-table-column prop="drugName" label="商品名称" width="180px" sortable="custom"></el-table-column>
        <el-table-column prop="drugCommonName" label="通用名称" min-width="200px" sortable="custom"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160px">
        </el-table-column>
        <el-table-column prop="specifications" label="规格" width="120px">
          <template slot-scope="scope">
            {{scope.row.specifications}}
          </template>
        </el-table-column>
        <el-table-column prop="manufacturer" label="生产厂家" min-width="200px" sortable="custom"></el-table-column>
        <el-table-column prop="approveNumber" label="批准文号" min-width="180px" sortable="custom">
        </el-table-column>
        <el-table-column prop="productionBatch" label="批号" min-width="100px"></el-table-column>
        <el-table-column prop="dateExpiration" label="效期" min-width="160px" sortable="custom"></el-table-column>
        <el-table-column prop="supplierPrice" label="供应商报价" min-width="110px" sortable="custom"></el-table-column>
        <el-table-column prop="drugSkuCode" label="商品编码" width="180px" sortable="custom"></el-table-column>
        <el-table-column prop="baseUnitPrice" label="单体价" min-width="90px"></el-table-column>
        <el-table-column prop="baseChainPrice" label="连锁价" min-width="90px"></el-table-column>
        <el-table-column prop="baseCommercialPrice" label="商业价" min-width="90px"></el-table-column>
        <el-table-column prop="repertory" label="库存" min-width="100px" sortable="custom"></el-table-column>
        <el-table-column prop="isRetail" label="是否可拆零" min-width="110px" sortable="custom">
          <template slot-scope="scope">
            {{scope.row.isRetail == 1? "是":"否"}}
          </template>
        </el-table-column>
        <el-table-column prop="mediumPackage" label="中/大包装" min-width="120">
          <template slot-scope="scope">
            {{scope.row.mediumPackage}}/{{scope.row.largePackage}}
          </template>
        </el-table-column>

        <el-table-column prop="supplierName" label="所属供应商" min-width="110px"></el-table-column>
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
    name: "allCommodity",
    data() {
      return {
        isDisplaySearch: true,
        loading: false,
        filters: {
          conditionLike: "",
          approveNumber: "",
          commodityStatus: '',
          manufacturer: '',
          supplierName: "",
        },
        shelveTime: null,
        updateTime: null,
        dataStatus: "0",
        statusData: [
          {
            label: "新品",
            value: "1"
          },
          {
            label: "在售",
            value: "2"
          },
          {
            label: "库存紧张",
            value: "3"
          },
          {
            label: "售罄",
            value: "4"
          },
          {
            label: "下架",
            value: "5"
          }
        ],
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1,
          sort: "drugSkuCode",//排序字段
          order: "descending",//排序方式
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
    methods: {
      initData() {
        this.table.data = []
        let param = Object.assign({}, this.filters);
        if (this.updateTime && this.updateTime.length >= 2) {
          param.updateTimeStart = this.updateTime[0];
          param.updateTimeEnd = this.updateTime[1];
        }
        param.limit = this.table.pageSize;
        param.page = this.table.currentPage;
        param.sort = this.table.sort;
        param.order = this.table.order == 'descending' ? 'desc' : '';
        this.loading = true;
        API.list(param).then(res => {
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
      //排序
      tableDataSortChange(column) {
        this.table.sort = column.prop;
        this.table.order = column.order;
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
      getReviewData(status) {
        this.dataStatus = status;
        this.table.currentPage = 1;
        this.initData();
      },
    }
  }
</script>

<style lang="scss">

  .central_library {
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
