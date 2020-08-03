<template>
  <div class="customer-manage">
    <!-- 搜索模块 start -->
    <div class="search_bg_wrap">
      <div class="search-box flex-row" v-if="isDisplaySearch">
        <p>
          <span class="search_hint">审核状态</span>
          <el-select v-model="filters.auditStatus" placeholder="请选择" size="mini" @change="handleSearch">
            <el-option label="全部" :key=" " value=""></el-option>
            <el-option v-for="item in auditStatusList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </p>
        <p>
          <span class="search_hint">账号</span>
          <el-input class="name-input" v-model="filters.loginName" clearable placeholder="登录账号/联系人/手机号/编码/合伙人"
                    size="mini" @keyup.enter.native="handleSearch"></el-input>
        </p>
        <p>
          <span class="search_hint">创建时间</span>
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
        <p>
          <span class="search_hint">最后登录时间</span>
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="filters.lastLoginTime"
            size="mini" style="width: 240px" :editable="false" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd">
          </el-date-picker>
        </p>
        <p>
          <span class="search_hint">单位类型</span>
          <el-select class="customer-type-select" v-model="filters.customerTypeId" placeholder="请选择" size="mini"
                     @change="handleSearch">
            <el-option label="全部" :key=" " value=""></el-option>
            <el-option v-for="item in customerTypes"
                       :key="item.customerTypeId"
                       :label="item.customerTypeName"
                       :value="item.customerTypeId"></el-option>
          </el-select>
        </p>
        <p>
          <span class="search_hint">客户报价类型</span>
          <el-select v-model="filters.specifyQuotation" placeholder="请选择" size="mini" @change="handleSearch">
            <el-option label="全部" :key=" " value=""></el-option>
            <el-option v-for="item in statusData"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </p>
        <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询</el-button>
      </div>
      <a href="javascript:;" v-if="isDisplaySearch" class="opr-search-btn" @click="isDisplaySearch = false">收起<i
        class="iconfont icon-shouqi2"></i></a>
      <a href="javascript:;" v-if="!isDisplaySearch" class="opr-search-btn search-btn" @click="isDisplaySearch = true">查询<i
        class="iconfont icon-zhankai1"></i></a>
    </div>
    <!-- 搜索模块 end -->

    <div class="wrap_main flex-item">
      <el-table
        :data="table.data"
        border
        ref="table"
        height="100%"
        v-loading="loadingTable">
        <el-table-column label=" " type="index" width="40" align="center"></el-table-column>
        <el-table-column label="操作" width="370px" ref="opr">
          <template slot-scope="scope">
            <div class="table_setting_button">
              <el-button type="primary" plain size="mini"
                         @click.stop="handleEdit(scope.row,1)">基本信息
              </el-button>
              <el-button type="success" plain size="mini"
                         :disabled="scope.row.auditStatus ==0"
                         @click.stop="handleEdit(scope.row,2)">认证信息
              </el-button>
              <el-button :type="scope.row.status==0?'warning':'success'" plain size="mini"
                         v-if="$utils.checkButton('customerManage:edit:status')"
                         @click.stop="editState(scope.row.customerId,scope.row.status)">
                {{scope.row.status==0?'禁用':scope.row.status==9?'启用':'-'}}
              </el-button>
              <el-button plain size="mini" v-if="$utils.checkButton('customerManage:reset:pwd')"
                         type="info" @click.stop="resetPwd(scope.row)">重置密码
              </el-button>
              <el-button plain size="mini" @click.stop="bookkeeping(scope.row)" :disabled="scope.row.auditStatus !=1 ">
                记账
              </el-button>
            </div>
          </template>
        </el-table-column>
        <!-- 0未认证，1已认证，2已驳回 3 认证中 -->
        <el-table-column prop="reviewStateStr" label="资质状态" width="100px" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus == 0 ">未认证</span>
            <span v-if="scope.row.auditStatus == 1 ">已认证</span>
            <span v-if="scope.row.auditStatus == 2 ">已驳回</span>
            <span v-if="scope.row.auditStatus == 3 ">待审核</span>
            <p style="padding: 5px 0;text-align:center;" v-if="scope.row.auditFlowStatus != 0">
              <el-button type="info" size="mini" plain @click="showChangeDialog(scope.row)">变更明细</el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="单位名称" min-width="160px"></el-table-column>
        <el-table-column prop="companyName" label="可用余额" width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.balance}}</span>
            <p style="padding: 5px 0;text-align:center;" v-if="scope.row.isHasBalance == 1">
              <el-button type="info" size="mini" plain @click="showBalanceDialog(scope.row)">查看明细</el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="loginName" label="登录账号" width="120px"></el-table-column>
        <el-table-column prop="erpCode" label="客户编码" width="120px"></el-table-column>
        <el-table-column prop="linkName" label="联系人"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120px"></el-table-column>
        <el-table-column prop="customerTypeName" label="单位类型" width="160px"></el-table-column>
        <el-table-column prop="" label="客户报价类型" width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.specifyQuotation == 1 ">单体价</span>
            <span v-if="scope.row.specifyQuotation == 2 ">连锁价</span>
            <span v-if="scope.row.specifyQuotation == 3 ">商业价</span>
          </template>
        </el-table-column>
        <el-table-column prop="partnerName" label="所属合伙人" min-width="140px">
          <template slot-scope="scope">
            <span v-if="scope.row.partnerName">{{scope.row.partnerName}}&nbsp;{{scope.row.invitedCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="disableReason" label="禁用原因"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180px"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" width="180px"></el-table-column>
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

    <el-dialog
      title="禁用原因"
      :visible.sync="jyDialogVisible"
      class="cms_dialog_visible setting_dialog"
      width="585px"
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="handleClose"
    >
      <div class="dialog_body" style="background: #fff;padding-bottom: 0px">
        <el-input type="textarea" placeholder="请输入禁用原因" :rows="6" maxlength="100"
                  v-model="disableReason"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="handleClose">取 消</el-button>
           <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 变更信息弹框 -->
    <el-dialog
      title="变更明细"
      :visible.sync="changeDialogVisible"
      class="cms_dialog_visible changelog_dialog"
      width="585px"
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="closeChangeDialog">
      <div class="table-record" style="height: 500px">
        <div class="table-header flex-wrp">
          <span style="width:40%">证照类型</span>
          <span style="width: 30%">时间</span>
          <span style="width: 30%">状态</span>
        </div>
        <div class="table-body">
          <div class="tr flex-wrp" v-for="item in changeLog.data">
            <div class="td" style="width: 40%;text-align:left">
              <div class="img-box-padding">
                <div class="img-box" :style="{backgroundImage: 'url('+ item.img +')'}"></div>
              </div>
              <span class="zj-name">{{item.certificateName}}</span>
            </div>
            <div class="td" style="width: 30%">{{item.createTime}}</div>
            <div class="td status status-check" style="width: 30%">
              <!-- 审核流程状态：0未认证，1已认证，2已驳回 3待审核 -->
              <template v-if="item.auditStatus == 0">未认证</template>
              <template v-if="item.auditStatus == 1"><span style="color:#38BC37">已通过</span></template>
              <template v-if="item.auditStatus == 2"><span style="color:#999">已驳回</span></template>
              <template v-if="item.auditStatus == 3"><span style="color:#F3510A">待审核</span></template>
            </div>
          </div>
        </div>
        <div class="el-table__empty-block" v-if="changeLog.total <= 0"><span class="el-table__empty-text">暂无数据</span>
        </div>
      </div>
      <div class="setting_pagination" v-if="changeLog.total>0">
        <el-pagination @current-change="handleCurrentChange2" @size-change="handleSizeChange2"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10, 50, 100, 150]"
                       small
                       :total="changeLog.total" :current-page.sync="changeLog.currentPage"
                       :page-size="changeLog.pageSize" v-if="changeLog.total>0">
        </el-pagination>
        <el-button type="primary" size="mini" plain>确 定</el-button>
      </div>
      <span slot="footer" class="dialog-footer" style="display:block;padding: 13px 0;">
      </span>
    </el-dialog>

    <!-- 余额明细弹框 -->
    <el-dialog
      title="余额明细"
      :visible.sync="balanceDialogVisible"
      class="cms_dialog_visible"
      width="964px"
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="closeBalanceDialog">
      <el-table
        :data="table3.data" height="500px">
        <el-table-column label="日期" prop="createTime" width="160px"></el-table-column>
        <el-table-column width="115px" label="收入/支出（元）">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.incomeExpenses==1 || scope.row.incomeExpenses==3)?'#00AA5F':'#FF7428'}">{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.incomeExpenses == 1?'退货/退款':scope.row.incomeExpenses == 2?'订单抵扣':scope.row.incomeExpenses == 3?'记账收入':scope.row.incomeExpenses == 4?'记账支出':'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联订单" width="220px">
          <template slot-scope="scope">
            <span v-if="scope.row.orderCode">订单号：<a href="javascript:;"
                                                    @click="linkOrderList(scope.row.orderCode,scope.row.orderStatus)"> {{scope.row.orderCode}}</a></span>
          </template>
        </el-table-column>
        <el-table-column label="订单支付方式" prop="typemsg" width="100px">
        </el-table-column>
        <el-table-column label="可用余额" prop="balance" width="100px"></el-table-column>
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
      </el-table>
      <div class="setting_pagination" v-if="table3.total>0">
        <el-pagination @current-change="handleCurrentChange3"
                       @size-change="handleSizeChange3"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10, 50, 100, 150]"
                       small
                       :total="table3.total" :current-page.sync="table3.currentPage"
                       :page-size="table3.pageSize"></el-pagination>
        <el-button type="primary" size="mini" plain>确 定</el-button>
      </div>
      <span slot="footer" class="dialog-footer" style="display:block;padding: 13px 0;">
      </span>
    </el-dialog>
    <el-dialog
      title="记账"
      :visible.sync="bookkeepingDialog"
      class="cms_dialog_visible"
      width="470px"
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="closeBookkeepingDialog">
      <p>
        <el-radio v-model="bookkeepingData.type" label="1">正（加）</el-radio>
        <el-radio v-model="bookkeepingData.type" label="2">负（减）</el-radio>
      </p>
      <el-input v-model="bookkeepingData.amount" :onkeyup="amountChange()"
                placeholder="请输入记账金额" size="small" style="margin-top: 16px"></el-input>
      <p style="margin: 16px 0px">
        <el-input v-model="bookkeepingData.orderCode" readonly placeholder="关联客户订单" size="small"
                  style="width: 325px"></el-input>
        <span class="select_order_button" @click="openSelectOrderDialog">选择订单</span>
      </p>
      <el-input type="textarea" placeholder="备注" :rows="6" maxlength="200" show-word-limit
                v-model="bookkeepingData.remake" style="margin-bottom: 30px"></el-input>
      <span slot="footer" class="dialog-footer">
           <el-button @click="closeBookkeepingDialog">取 消</el-button>
           <el-button type="primary" @click="submitBookkeepingData">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择订单"
      :visible.sync="orderDialog"
      class="cms_dialog_visible"
      width="964px"
      :close-on-click-modal="false"
      :show-close="true"
      :before-close="closeOrderDialog">
      <div class="search_bg_wrap flex-row" style="margin-bottom: 15px">
        <p>
          <span class="search_hint">订单信息：</span>
          <el-input v-model="orderTable.searchData" clearable placeholder="订单号"
                    style="width: 220px;margin-right:15px" size="small" @keyup.enter.native="searchOrderList"
          ></el-input>
        </p>
        <p>
          <span class="search_hint">下单时间：</span>
          <el-date-picker
            v-model="orderTable.searchTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd" size="small" style="margin-right: 15px;width:260px">
          </el-date-picker>
        </p>
        <el-button size="small" type="warning" @click="searchOrderList"><i class="iconfont icon-chaxun"></i>查询
        </el-button>
      </div>
      <el-table :data="orderTable.data" height="500px" ref="orderTable" @selection-change="handleselectChange"
                :row-class-name="tableRowClassName" @row-click="orderRowClick">
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column label="客户编码" prop="customerCode" width="120"></el-table-column>
        <el-table-column label="客户名称" prop="companyName"></el-table-column>
        <el-table-column label="订单号" prop="orderCode"></el-table-column>
        <el-table-column label="订单金额" prop="totalPrice" width="120"></el-table-column>
        <el-table-column label="订单状态" prop="orderStatus" width="120">
          <template slot-scope="scope">
            <p class="order_color" v-if="scope.row.orderStatus != 13">
              {{scope.row.orderStatus == 2?'待付款':scope.row.orderStatus == 3?'已付款':scope.row.orderStatus == 4?'开单中':
              scope.row.orderStatus ==5?'拣货中':scope.row.orderStatus == 6?'待配送':scope.row.orderStatus == 7?'商品已出库':
              scope.row.orderStatus == 8?'配送完成':scope.row.orderStatus == 9?'已完成':scope.row.orderStatus == 10?'已取消':
              scope.row.orderStatus == 11?'已取消': scope.row.orderStatus == 12?'提交失败':'验证中'}}
            </p>
            <p class="order_color" v-if="scope.row.orderStatus == 13">
              {{scope.row.isAllBack==1?'部分退款':scope.row.isAllBack==2?'整单退款':''}}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="orderTime"></el-table-column>
      </el-table>
      <div class="setting_pagination" v-if="orderTable.total>0">
        <el-pagination @current-change="handleCurrentChange3"
                       @size-change="handleSizeChange3"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10, 50, 100, 150]"
                       small
                       :total="orderTable.total" :current-page.sync="orderTable.currentPage"
                       :page-size="orderTable.pageSize"></el-pagination>
        <el-button type="primary" size="mini" plain>确 定</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="closeOrderDialog">取 消</el-button>
           <el-button type="primary" @click="selectOrderData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {bus} from "../../../bus.js";
  import API from "../../../api/api_customer_manage";

  export default {
    name: "customerManage",
    data() {
      return {
        isDisplaySearch: true,
        loadingTable: false,
        loading: false,
        bigImgDialogVisible: false,
        jyDialogVisible: false,
        refuseDialogVisible: false,
        changeDialogVisible: false,
        balanceDialogVisible: false, // 余额明细弹框
        disableReason: '', // 禁用原因
        remark: '',   // 驳回原因
        imgUrl: null,
        customerId: null,
        filters: {
          auditStatus: '',
          customerTypeId: '',
          specifyQuotation: ''
        },
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        changeLog: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        auditStatusList: [
          {
            value: '0',
            label: '未认证'
          },
          {
            value: '1',
            label: '已认证'
          },
          {
            value: '2',
            label: '已驳回'
          },
          {
            value: '3',
            label: '待审核'
          },
        ],
        statusData: [
          {
            value: '1',
            label: '单体价'
          }, {
            value: '2',
            label: '连锁价',
          }, {
            value: '3',
            label: '商业价',
          }],
        customerTypes: [], // 用户类型
        payTypes: [
          {
            value: "1",
            key: '在线支付'
          },
          {
            value: "2",
            key: '线下结算（电汇）'
          }
        ],
        formData: {
          invitedCode: "",
          customerName: "",
          partnerName: "",
          loginName: "",
          companyAddress: "",
          customerCode: "",
          customerTypeId: "",
          areaArr: [],
          address: "",
          phone: "",
          payTypeArr: [],
          specifyQuotation: '',
          certificatesList: []
        },
        certificatType: [], // 证件类型
        areaList: [], // 省市区
        searchProps: {
          label: "name",
          children: 'children',
          value: "areaId",
        },
        dialogVisible: false,//編輯用戶彈出框
        userLoading: false,//用户信息的提交
        isAddUser: true,//是否是新增用户，true是，false代表编辑
        table3: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1,
          incomeExpenses: '', // 收入/支出
          typemsg: '',       // 订单支付类型
        },
        customerId: '',
        bookkeepingDialog: false,
        bookkeepingData: {
          amount: "",
          customerId: "",
          orderCode: "",
          orderId: "",
          remake: "",
          type: "1"
        },
        orderDialog: false,
        orderTable: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1,
          searchData: "",
          searchTime: []
        },
        multipleOrder: [],//选中的订单
      }
    },
    created() {
      this.initData();
      this.getCustomerType();
      bus.$on("updateCustomer", () => {
        this.initData();
      })
    },
    destroyed() {
      this.$destroy();
    },
    methods: {

      //记账
      bookkeeping(item) {
        this.bookkeepingDialog = true;
        this.bookkeepingData.customerId = item.customerId;
      },
      //关闭记账dialog
      closeBookkeepingDialog() {
        this.bookkeepingDialog = false;
        this.bookkeepingData = {
          amount: "",
          customerId: "",
          orderCode: "",
          orderId: "",
          remake: "",
          type: "1"
        };
      },
      amountChange() {
        this.bookkeepingData.amount = this.bookkeepingData.amount.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      },
      submitBookkeepingData() {
        if (this.bookkeepingData.amount <= 0) {
          this.$message.error("金额不允许为0");
          return;
        }
        if (!this.bookkeepingData.remake) {
          this.$message.error("备注不允许为空");
          return;
        }
        API.upUserBlance(this.bookkeepingData).then(res => {
          if (res.code == 0) {
            this.$message.success(res.msg);
            this.closeBookkeepingDialog();
            this.initData();
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //打开选择订单列表
      openSelectOrderDialog() {
        this.orderDialog = true;
        this.orderList();
      },
      //关闭选择订单dialog
      closeOrderDialog() {
        this.orderDialog = false;
        this.orderTable = {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1,
          searchData: "",
          searchTime: []
        };
      },
      selectOrderData() {
        let item = this.multipleOrder;
        if (!item || item.length <= 0) {
          this.$message.error("请选择订单");
          return;
        }
        this.bookkeepingData.orderId = item[0].orderId;
        this.bookkeepingData.orderCode = item[0].orderCode;
        this.closeOrderDialog();
      },
      //订单列表搜索
      searchOrderList() {
        this.orderTable.currentPage = 1;
        this.orderList();
      },
      orderList() {
        let params = {
          customerId: this.bookkeepingData.customerId,
          searchData: this.orderTable.searchData
        }
        let time = this.orderTable.searchTime;
        if (time && time.length >= 2) {
          params.orderTimeStart = time[0];
          params.orderTimeEnd = time[1]
        }
        API.balanceOrderList(params).then(res => {
          if (res.code == 0) {
            this.orderTable.data = res.data.rows;
            this.orderTable.total = res.data.total;
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      //订单单选
      handleselectChange(val) {
        if (val.length > 1) {
          this.$refs.orderTable.clearSelection()
          this.$refs.orderTable.toggleRowSelection(val.pop());
        } else {
          this.multipleOrder = val;
        }
      },
      //点击添加订单行
      orderRowClick(row) {
        this.$refs.orderTable.toggleRowSelection(row)
      },
      tableRowClassName({row, rowIndex}) {
        let arr = this.multipleOrder;
        for (let i = 0; i < arr.length; i++) {
          if (row.orderId === arr[i].orderId) {
            return 'rowStyle'
          }
        }
      },
      // 获取用户类型
      getCustomerType() {
        API.getCustomerType().then(res => {
          if (res.code == 0) {
            this.customerTypes = res.data
          }
        })
      },
      editState(customerId, type) {
        console.log(type)
        let msg = type == "0" ? "禁用" : "启用";
        if (type == "9") {
          this.$confirm("确认" + msg + "该用户账号吗?", "提示!", {
            type: "warning"
          }).then(() => {
            let params = {
              customerId: customerId
            }
            API.userEnabled(params).then(res => {
              if (res.code == 0) {
                this.$message.success("操作成功");
                this.initData();
              } else {
                this.$message.error(res.msg);
              }
            })
          }).catch(() => {
          });
        } else {
          this.customerId = customerId;
          this.jyDialogVisible = true;
        }
      },
      // 关闭禁用弹框
      handleClose() {
        this.disableReason = '';
        this.remark = '';
        this.jyDialogVisible = false;
        this.refuseDialogVisible = false;
      },
      // 禁用弹框 点击确认按钮
      submitData() {
        if (this.disableReason == '') {
          this.$message.error("请填写禁用原因");
          return;
        }
        API.userDisabled({customerId: this.customerId, disableReason: this.disableReason}).then(res => {
          if (res.code == 0) {
            this.disableReason = '';
            this.jyDialogVisible = false;
            this.$message.success("操作成功");
            this.initData();
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      initData() {
        let params = {
          page: this.table.currentPage,
          limit: this.table.pageSize,
          auditStatus: this.filters.auditStatus,
          loginName: this.filters.loginName,
          customerTypeId: this.filters.customerTypeId,
          specifyQuotation: this.filters.specifyQuotation
        }
        if (this.filters.createTime && this.filters.createTime.length > 0) {
          params.createTimeStart = this.filters.createTime[0];
          params.createTimeEnd = this.filters.createTime[1];
        }
        if (this.filters.lastLoginTime && this.filters.lastLoginTime.length > 0) {
          params.lastLoginTimeStart = this.filters.lastLoginTime[0];
          params.lastLoginTimeEnd = this.filters.lastLoginTime[1];
        }
        API.getList(params).then(res => {
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
      // 输入手机号检测是否是数字
      handleKeyUp(e) {
        this.userForm.phone = e.target.value.replace(/[^\d]/g, '');
      },
      //关闭时清除user的dialog里的内容
      cancelDialog() {
        this.userDialogVisible = false;
        this.userLoading = false;
        this.$refs['userForm'].resetFields();
        this.clearData();
      },
      clearData() {
        this.userForm = {
          password: "",
          phone: ""
        }
      },
      handleEdit(item, type) {
        this.$router.push({
          path: '/editCustomer?customerId=' + item.customerId + "&type=" + type
        })
      },
      // 重置密码
      resetPwd(row) {
        this.$confirm("确认重置密码吗?", "提示", {type: "warning"})
          .then(() => {
            API.resetPwd({customerId: row.customerId})
              .then((res) => {
                  if (res.code == 0) {
                    this.$message.success(res.msg);
                  } else {
                    this.$message.error(res.msg);
                  }
                }
              )
          }).catch(_ => {
        });
      },
      // 选择日期
      handleChangeDate(idx, val) {
        console.log(val)
        if (val) {
          this.formData.certificatesList[idx].validityStart = val[0];
          this.formData.certificatesList[idx].validityEnd = val[1];
        } else {
          this.$nextTick(() => {
            this.formData.certificatesList[idx].date = '';
            this.formData.certificatesList[idx].validityStart = '';
            this.formData.certificatesList[idx].validityEnd = '';
          })

        }
      },
      // 获取变更记录列表
      getCustomerTypeChangeLog() {
        this.loadingTable = true;
        let params = {
          customerId: this.changeLog.customerId,
          limit: this.changeLog.pageSize,
          page: this.changeLog.currentPage,
        };
        this.changeDialogVisible = true;
        API.getCustomerTypeChangeLog(params).then((res) => {
          this.loadingTable = false;
          if (res.code == 0) {
            this.changeLog.data = res.data.rows;
            this.changeLog.total = res.data.total;
          }
        })
      },
      // 查看变更明细
      showChangeDialog(row) {
        this.changeLog.customerId = row.customerId;
        this.getCustomerTypeChangeLog();
      },
      getBalanceList() {
        // 获取余额明细
        let params = {
          limit: this.table3.pageSize,
          page: this.table3.currentPage,
          customerId: this.customerId
        }
        API.balanceList(params).then((res) => {
          this.loadingTable = false;
          if (res.code == 0) {
            this.table3.data = res.data.rows;
            this.table3.total = res.data.total;
          } else {
            this.$message.error(res.msg)
          }

        }).catch(() => {
          this.loadingTable = false;
        })
      },
      // 查看余额明细
      showBalanceDialog(row) {
        this.customerId = row.customerId;
        this.balanceDialogVisible = true;
        this.getBalanceList();
      },
      // 关闭变更明细弹框
      closeChangeDialog() {
        this.changeLog.data = [];
        this.changeLog.total = 0;
        this.changeDialogVisible = false;
      },
      // 关闭余额明细弹框
      closeBalanceDialog() {
        this.table3.data = [];
        this.table3.total = 0;
        this.table3.currentPage = 1;
        this.balanceDialogVisible = false;
      },
      handleSizeChange2(val) {
        this.changeLog.pageSize = val;
        this.getCustomerTypeChangeLog();
      },
      handleCurrentChange2(val) {
        this.changeLog.currentPage = val;
        this.getCustomerTypeChangeLog();
      },
      handleSizeChange3(val) {
        this.table3.pageSize = val;
        this.getBalanceList();
      },
      handleCurrentChange3(val) {
        this.table3.currentPage = val;
        this.getBalanceList();
      },
      // 链接到订单列表
      linkOrderList(orderCode, queryStatus) {
        this.closeBalanceDialog();
        bus.$emit("refreshOrder", orderCode, queryStatus)
        this.$router.push({name: 'orderList', params: {orderCode, queryStatus}})
      }
    }
  }
</script>

<style lang="scss">
  .customer-manage {
    .edit_customer_dialog, .changelog_dialog {
      .el-dialog {
        width: 964px !important;
      }
    }
    .table-record {
      max-height: 600px;
      overflow-y: auto;
    }
    .edit-customer-form {
      max-height: 659px;
      overflow-y: auto;
      .el-row {
        .el-form-item {
          margin: 0 21px 20px 21px;
          &:first-child {
            margin-left: 0;
          }
        }
      }
      .el-input__inner {
        padding: 0 5px;
      }
      .el-cascader--small, .el-select {
        width: 100%;
      }
    }

    .provider-form {
      padding: 20px;
    }
    .info-list {
      overflow: hidden;
    }
    .info-item {
      float: left;
      margin-right: 20px;
      margin-bottom: 16px;
      padding: 18px;
      width: 415px;
      height: 217px;
      border: 1px solid #F5F5F5;
      box-sizing: border-box;
      &:nth-child(2n) {
        margin-right: 0;
      }
      .item-name {
        font-size: 14px;
        color: #333333;
        .is-required {
          color: #FF0000;
        }
        .s-name {
          display: inline-block;
          max-width: 60%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        a {
          color: #F3A707;
          text-decoration: underline;
        }
      }
    }
    .item-content {
      padding: 10px 0;
      align-items: flex-start;
    }
    .file-box {
      position: relative;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
      background: #F5F5F5;
      .upload-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
      .img-box-padding {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        &:hover {
          .black-mask {
            display: block;
          }
        }
        .black-mask {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          line-height: 150px;
          text-align: center;
          color: #fff;
          font-size: 16px;
          background: rgba(0, 0, 0, 0.3);
        }
      }
      .img-box {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
    }
    .zj-txt {
      padding-left: 10px;
    }
    .item-rules {
      font-size: 12px;
      color: #666;
      .rule-title {
        color: #333333;
      }
    }
    .zj-date {
      padding-top: 10px;
      width: 246px;
      .el-range-editor--small {
        width: 246px !important;
      }
      .el-icon-date {
        display: none;
      }
      .el-range-input {
        text-align: left;
      }
      .el-range-editor--small .el-range-separator {
        line-height: 28px;
      }
      .el-date-editor .el-range-separator {
        padding: 0 15px
      }
      .el-date-editor .el-range-input {
        width: 90%;
      }
    }
    .table-record {
      width: 100%;
      // padding: 0 17px;
      .table-header {
        height: 33px;
        line-height: 33px;
        background-color: #F9F9F9;
        overflow: hidden;
        span {
          float: left;
          text-align: center;
        }
      }
      .table-body {
        padding: 0 18px;
        .tr {
          padding: 18px 0;
          border-bottom: 1px solid #F3F4F3;
          overflow: hidden;
          .td {
            font-size: 12px;
            color: #333333;
            text-align: center;
          }
          .flex-item {
            font-size: 14px;
            color: #333333;
            text-align: left;
          }
          .status-check {
            color: #F3510A
          }
          .status-pass {
            color: #38BC37
          }
        }
      }
      .img-box-padding {
        display: inline-block;
        padding: 10px;
        width: 95px;
        height: 94px;
        border: 1px solid #eeeeee;
        box-sizing: border-box;
        vertical-align: middle;
      }
      .img-box {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
      .zj-name {
        padding-left: 36px;
        font-size: 14px;
        color: #333333;
      }
    }
    .big-img-box {
      text-align: center;
    }
    .name-input {
      width: 245px !important;
    }

    .select_order_button {
      cursor: pointer;
      padding: 6px 15px;
      background: #F4F4F5;
      color: #333;
      font-size: 12px;
      margin-left: 20px;
      border: 1px solid #E5E6E7;
      border-radius: 5px;
    }
    .el-radio__label {
      font-size: 12px;
    }
  }

</style>
