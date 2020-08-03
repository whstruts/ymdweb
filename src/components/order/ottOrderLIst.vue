<template>
  <div class="ott_order_list">
    <div class="search_bg_wrap ">
      <div class="search-box flex-row" v-if="isDisplaySearch">
        <p>
          <span class="search_hint">状态</span>
          <el-select v-model="filters.status" @change="handleSearch" size="mini">
            <el-option
              v-for="item in statusData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </p>
        <p>
          <span class="search_hint">买家信息</span>
          <el-input size="mini" v-model="filters.customerOrCode" clearable placeholder="客户名称/客户编码"
                    @keyup.enter.native="handleSearch" style="width: 175px"></el-input>
        </p>
        <p>
          <span class="search_hint">订单信息</span>
          <el-input size="mini" v-model="filters.orderCode" clearable placeholder="订单号/订单ID"
                    @keyup.enter.native="handleSearch" style="width: 175px"></el-input>
        </p>
        <p>
          <span class="search_hint">下单时间</span>
          <el-date-picker
            v-model="orderTimes"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" :editable="false" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd" style="width: 205px"></el-date-picker>
        </p>
        <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询
        </el-button>
      </div>
      <a href="javascript:;" v-if="isDisplaySearch" class="opr-search-btn" @click="isDisplaySearch = false">收起<i
        class="iconfont icon-shouqi2"></i></a>
      <a href="javascript:;" v-if="!isDisplaySearch" class="opr-search-btn search-btn" @click="isDisplaySearch = true">查询<i
        class="iconfont icon-zhankai1"></i></a>
    </div>
    <div class="order_status_operating">
      <span class="success_button" @click="ottAuditApprove"
            v-if="$utils.checkButton('ottOrder:ottAuditApprove')">审核通过</span>
      <span class="danger_button" @click="openDialogDialog"
            v-if="$utils.checkButton('ottOrder:openDialogDialog')">审核驳回</span>
    </div>
    <div class=" wrap_main  flex-item">
      <el-table :data="table.data" border ref="table" height="100%" @selection-change="handleSelectionChange"
                class="my_table">
        <el-table-column type="index" width="40" label=" " align="center"></el-table-column>
        <el-table-column type="selection" width="50" align="center"
                         :selectable="(row, index)=>{return (row.ottStatus!==1 && row.ottId) }"></el-table-column>
        <el-table-column label="状态" min-width="180">
          <template slot-scope="scope">
            <span
              :style="{color:!scope.row.ottId?'#999':scope.row.ottStatus==0?'#F67A16':scope.row.ottStatus==1?'#57BB44':scope.row.ottStatus==2?'#FF4647':''}">
              {{!scope.row.ottId?'等待上传电汇凭证': scope.row.ottStatus==0?'待审核':scope.row.ottStatus==1?'已通过':scope.row.ottStatus==2?'已驳回':'-'}}</span>
            <p style="color: #666666" v-if="scope.row.ottStatus==0 || scope.row.ottStatus==2">剩余时间 {{ scope.row.time
              }} </p>
          </template>
        </el-table-column>
        <el-table-column label="电汇凭证" min-width="110">
          <template slot-scope="scope">
            <!-- <el-popover
               placement="right"
               trigger="hover">
               <img :src="scope.row.webPath " style="max-width:500px"/>
               <img :src="scope.row.webPath " style="width: 80px;" slot="reference"/>
             </el-popover>-->

            <el-image
              style="width: 80px;height: 60px;cursor: pointer"
              :src="scope.row.webPath"
              :preview-src-list="[scope.row.webPath]" v-if="scope.row.webPath"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="买家信息" prop="companyName" min-width="180"></el-table-column>
        <el-table-column label="订单信息" prop="orderCode" min-width="310">
          <template slot-scope="scope">
            <!--<span style="cursor: pointer" @click="goToOrder(scope.row.orderCode,scope.row.queryStatus)">{{scope.row.orderCode}}</span>-->
            <p>
              订&nbsp;&nbsp;单&nbsp;号：<span style="cursor: pointer"
                                          @click="goToOrder(scope.row.orderCode,scope.row.queryStatus)">{{scope.row.orderCode}}</span>
            </p>
            <p> 订&nbsp;&nbsp;单&nbsp;ID：{{scope.row.orderId}}</p>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="orderTime" min-width="160"></el-table-column>
        <el-table-column label="商品金额" prop="totalPayPrice" min-width="80"></el-table-column>
        <el-table-column label="订单状态" prop="orderStatus" min-width="100">
          <template slot-scope="scope">
            {{scope.row.orderStatus == 2?'待付款':scope.row.orderStatus == 3?'已付款':scope.row.orderStatus == 4?'开单中':
            scope.row.orderStatus ==5?'拣货中':scope.row.orderStatus == 6?'待配送':scope.row.orderStatus == 7?'商品已出库':
            scope.row.orderStatus == 8?'配送完成':scope.row.orderStatus == 9?'订单完成':scope.row.orderStatus == 10?'已取消':
            scope.row.orderStatus == 11?'订单取消': scope.row.orderStatus == 12?'订单取消':scope.row.orderStatus ==
            13?'退货/退款':'验证中'}}
          </template>
        </el-table-column>
        <el-table-column label="驳回原因" prop="failMsg" min-width="200"></el-table-column>
        <el-table-column label="审核时间" prop="auditTime" min-width="160"></el-table-column>
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
      title="审核驳回"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible"
      width="585px"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-input type="textarea" placeholder="请输入驳回理由..." :rows="6" maxlength="200" show-word-limit
                v-model="reason"></el-input>
      <span slot="footer" class="dialog-footer">
           <el-button @click="handleClose">取 消</el-button>
           <el-button type="primary" @click="ottAuditRefuse" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from "../../api/api_ott_order_list"
  import {bus} from "../../bus"

  export default {
    name: "ottOrderList",
    data() {
      return {
        isDisplaySearch: true,
        filters: {
          status: "",
          customerOrCode: "",
          orderCode: "",
          orderTimeStart: "",
          orderTimeEnd: "",
        },
        orderTimes: [],
        statusData: [
          {label: '全部', value: ""},
          {label: '未审核', value: "0"},
          {label: '已通过', value: "1"},
          {label: '已驳回', value: "2"}
        ],
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        multipleSelection: [],
        intervalArr: [],//倒计时集合
        dialogVisible: false,
        reason: "",//拒绝理由
        loading: false,
     /*   showViewer: false,
        imgUrlList: [],*/
      }
    },
    created() {
      this.initData();
    },
    beforeDestroy() {
      this.destroyInterval();
    },
    methods: {
      // 点击查看大图
     /* showBigImg(img) {
        if (img) {
          this.imgUrlList = [];
          this.imgUrlList.push(img)
          this.showViewer = true;
        }
      },
      // 关闭查看器
      closeViewer() {
        this.showViewer = false
      },*/
      handleSearch() {
        this.table.currentPage = 1;
        this.initData();
      },
      initData() {
        //每次调用之前，先关闭所有的定时器
        this.destroyInterval();
        let param = Object.assign(this.filters, {});
        if (this.orderTimes && this.orderTimes.length >= 2) {
          param.orderTimeStart = this.orderTimes[0];
          param.orderTimeEnd = this.orderTimes[1];
        } else {
          param.orderTimeStart = '';
          param.orderTimeEnd = '';
        }
        param.limit = this.table.pageSize;
        param.page = this.table.currentPage;
        API.ottOrderList(param).then(res => {
          if (res.code == 0) {
            this.table.data = res.data.rows;
            this.table.total = res.data.total
            if (this.table.data.length > 0) {
              this.countdown();
            }
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
      //去订单列表
      goToOrder(orderCode, queryStatus) {
        bus.$emit("refreshOrder", orderCode, queryStatus)
        this.$router.push({name: 'orderList', params: {orderCode, queryStatus}})
      },
      //审核通过
      ottAuditApprove() {
        let dataLength = this.multipleSelection.length;
        if (dataLength <= 0) {
          this.$message.error("请选择需要审核的订单");
          return
        }
        if (dataLength > 1) {
          this.$message.error("仅支持单个审核订单");
          return
        }
        this.$confirm('确定审核通过该订单？', '提示', {
          type: 'warning'
        }).then(() => {
          API.ottAuditApprove({orderId: this.multipleSelection[0].orderId}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.initData();
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
        });
      },
      openDialogDialog() {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$message.error("请选择审核驳回的订单")
          return;
        }
        if (this.multipleSelection && this.multipleSelection.length != 1) {
          this.$message.error("仅支持单个审核订单")
          return;
        }
        this.dialogVisible = true;
      },
      handleClose() {
        this.dialogVisible = false;
        this.reason = "";
      },
      // 审核驳回订单
      ottAuditRefuse() {
        if (!this.reason) {
          this.$message.error("请填写驳回订单的理由");
          return;
        }
        this.loading = true;
        let param = {
          orderId: this.multipleSelection[0].orderId,
          failMsg: this.reason
        }
        API.ottAuditRefuse(param).then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.$message.success(res.msg);
            this.handleClose();
            this.initData();
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => {
          this.loading = false;
        })
      },

      countdown() {
        this.intervalArr = []
        let dataLength = this.table.data.length;
        for (let i = 0; i < dataLength; i++) {
          let item = this.table.data[i];
          if ((item.ottStatus == 0 || item.ottStatus == 2) && item.payEndTime > 0) { //待支付时显示支付倒计时
            let endTime = item.payEndTime;
            let interval = setInterval(() => {
              endTime -= 1000;
              if (endTime <= 0) {
                this.initData();
                return;
              }
              var days = parseInt(endTime / (1000 * 60 * 60 * 24));
              var hours = parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) < 10 ? '0' + parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              var minutes = parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60)) < 10 ? '0' + parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60)) : parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60));
              var seconds = parseInt((endTime % (1000 * 60)) / 1000) < 10 ? '0' + parseInt((endTime % (1000 * 60)) / 1000) : parseInt((endTime % (1000 * 60)) / 1000);
              item.time = hours + " : " + minutes + " : " + seconds;
              this.$set(this.table.data, i, item);//解决时间更新，界面视图无更新问题
            }, 1000);
            this.intervalArr.push(interval);
          }
        }
      },
      //销毁定时任务
      destroyInterval() {
        this.intervalArr.forEach(item => {
          clearInterval(item)
        })
      },
      //全选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    }
  }
</script>

<style lang="scss">
  .ott_order_list {
    .el-icon-circle-close {
      color: #fff;
    }
    .order_status_operating {
      line-height: 30px;
      margin-top: 10px;
      span {
        padding: 6px 12px;
        border-radius: 5px;
        font-size: 12px;
        margin-right: 12px;
        border: 1px solid #E5E6E7;
        color: #333333;
        cursor: pointer;
        box-sizing: border-box;
      }
      .success_button {
        background: #F0F9EB;
        border-color: #D1ECC4;
        color: #57BB44;
      }
      .danger_button {
        background: #FEF0F0;
        border-color: #FFCBCB;
        color: #F85C5D;
      }
    }
  }
</style>
