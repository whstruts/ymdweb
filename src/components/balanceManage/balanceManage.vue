<template>
  <div class="balance-manage">
    <div class="search_bg_wrap ">
      <div class="search-box flex-row" v-if="isDisplaySearch">
        <p>
          <span class="search_hint">类&nbsp;&nbsp;&nbsp;&nbsp;型</span>
          <el-select v-model="filters.incomeExpenses" placeholder="请选择" size="mini" @change="handleSearch">
            <el-option v-for="item in statusData"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </p>
        <p>
          <span class="search_hint">买家信息</span>
          <el-input v-model="filters.customerInfo" clearable placeholder="客户名称/客户编号" size="mini"
                    @keyup.enter.native="handleSearch"></el-input>
        </p>
        <p>
          <span class="search_hint">订单信息</span>
          <el-input v-model="filters.orderCode" clearable placeholder="订单号" size="mini"
                    @keyup.enter.native="handleSearch"></el-input>
        </p>
        <p>
          <span class="search_hint">时间</span>
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="filters.createTime"
            size="mini" style="width: 240px" :editable="false" value-format="yyyy-MM-dd"
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
    <div class="wrap_main flex-item">
      <el-table
        :data="table.data"
        border
        ref="table"
        height="100%"
      >
        <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
        <el-table-column prop="companyName" label="买家信息" width="120px"></el-table-column>
        <el-table-column label="收入/支出" width="120px">
          <template slot-scope="scope">
            <span :style="{color:scope.row.incomeExpenses==1 || scope.row.incomeExpenses==3?'#00AA5F':'#FF7428'}">{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100px">
          <template slot-scope="scope">
            <!--<span>{{scope.row.incomeExpenses==1?"退货/退款":"订单抵扣"}}</span>-->
            <span>{{scope.row.incomeExpenses == 1?'退货/退款':scope.row.incomeExpenses == 2?'订单抵扣':scope.row.incomeExpenses == 3?'记账收入':scope.row.incomeExpenses == 4?'记账支出':'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联订单" width="230px">
          <template slot-scope="scope">
            <span v-if="scope.row.orderCode">订单号：<a href="javascript:;" @click="linkOrderList(scope.row.orderCode,scope.row.orderStatus)"> {{scope.row.orderCode}}</a></span>
          </template>
        </el-table-column>
        <el-table-column label="订单支付方式" prop="typemsg" width="100px">
        </el-table-column>
        <el-table-column prop="createTime" label="日期" width="160px"></el-table-column>
        <el-table-column label="可用余额" prop="balance" width="120px"></el-table-column>
        <el-table-column label="备注" prop="remark">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="备注"
              width="200"
              trigger="hover"
              :content="scope.row.remark" v-if="scope.row.incomeExpenses!=2">
              <p slot="reference" class="text_overflow">{{scope.row.remark}}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="operatorName"></el-table-column>
      </el-table>
    </div>
    <div class="setting_pagination" v-if="table.total>0">
      <el-pagination @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :page-sizes="[10, 50, 100, 150]"
                     :total="table.total" :current-page.sync="table.currentPage"
                     :page-size="table.pageSize"></el-pagination>
      <el-button type="primary" size="mini" plain>确 定</el-button>
    </div>
  </div>
</template>

<script>
  import API from "../../api/api_balance";
  import {bus} from "../../bus"

  export default {
    name: "balanceManage",
    data() {
      return {
        isDisplaySearch: true,
        filters: {
          incomeExpenses: "",
          customerInfo: "",
          orderId: "",
          createTime: ""
        },
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        statusData: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '退货/退款'
        }, {
          value: '2',
          label: '订单抵扣',
        }, {
          value: '3',
          label: '记账收入',
        },{
          value: '4',
          label: '记账支出',
        }],
      }
    },
    created() {
      this.initData();
    },
    methods: {
      initData() {
        let params = {
          page: this.table.currentPage,
          limit: this.table.pageSize,
          incomeExpenses: this.filters.incomeExpenses,
          customerInfo: this.filters.customerInfo,
          orderCode: this.filters.orderCode
        }
        if (this.filters.createTime && this.filters.createTime.length > 0) {
          params.startTime = this.filters.createTime[0];
          params.endTime = this.filters.createTime[1];
        }
        API.balanceList(params).then(res => {
          if (res.code == 0) {
            this.table.total = res.data.total;
            this.table.data = res.data.rows;
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      //查询
      handleSearch() {
        this.table.total = 0;
        this.table.currentPage = 1;
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
      // 链接到订单列表
      linkOrderList(orderCode, queryStatus) {
        bus.$emit("refreshOrder", orderCode, queryStatus)
        this.$router.push({name: 'orderList', params: {orderCode, queryStatus}})
        // this.$router.push({name: 'orderList', params: {orderCode, queryStatus}})
      }
    },
  }
</script>

<style lang="scss">
  .balance-manage {
    .el-dialog {
      width: 570px !important;
    }
    .provider-form {
      padding: 20px;
    }
  }

</style>
