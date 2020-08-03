<template>
  <div class="order_list">
    <!-- 搜索模块 start -->
    <div class="search_bg_wrap">
      <div class="search-box flex-row" v-if="isDisplaySearch">
        <p>
          <span class="search_hint">合伙人</span>
          <el-input size="mini" v-model="filters.partnerOrPhone" clearable placeholder="合伙人/手机号"
                    @keyup.enter.native="handleSearch"></el-input>
        </p>
        <p>
          <span class="search_hint">买家信息</span>
          <el-input size="mini" v-model="filters.customerOrCode" clearable placeholder="客户名称/客户编码"
                    @keyup.enter.native="handleSearch"></el-input>
        </p>
        <p>
          <span class="search_hint">订单信息</span>
          <el-input size="mini" v-model="filters.orderCode" clearable placeholder="订单号/订单ID"
                    @keyup.enter.native="handleSearch"></el-input>
        </p>
        <p>
          <span class="search_hint">下单时间</span>
          <el-date-picker
            v-model="orderTime"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" :editable="false" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"></el-date-picker>
        </p>
        <p>
          <span class="search_hint">支付方式</span>
          <el-select v-model="filters.payType" @change="handleSearch" size="mini">
            <el-option
              v-for="item in payTypeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
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

    <div class="order_status_tab">
      <p>
        <span v-for="(item,index) in orderStatusData" :key="index" :class="{'span_active':orderStatusId==item.id}"
              @click="changeOrderStatus(item.id)">{{item.val}}({{item.num}})</span>
      </p>
    </div>
    <div class="order_status_operating">
      <span class="primary_button" v-if="orderStatusId==1 && $utils.checkButton('order:remindPayment')"
            @click="remindPayment">提醒客户支付</span>
      <span class="primary_button" v-if="orderStatusId==2 && $utils.checkButton('order:billing')"
            @click="billing">去开单</span>
      <span class="primary_button" v-if="orderStatusId>=2 && orderStatusId<=6 && $utils.checkButton('order:print') "
            @click="print">打印订单</span>
      <span class="primary_button" v-if="orderStatusId==3 && $utils.checkButton('order:billingOK')" @click="billingOK">开单完成</span>
      <span class="primary_button" v-if="orderStatusId==4 && $utils.checkButton('order:pick')" @click="pick">备货完成</span>
      <span class="primary_button" v-if="orderStatusId==5 && $utils.checkButton('order:uploadLogisticsOpen')"
            @click="uploadLogisticsOpen(1)">上传物流单号</span>
      <span class="primary_button" v-if="orderStatusId==6 && $utils.checkButton('order:delivery')" @click="delivery">配送完成</span>
      <el-upload class="uploadfile" action="" accept=".pdf" :http-request='uploadFileMethod' :show-file-list="false"
                 multiple
                 v-if="(orderStatusId==6 || orderStatusId==7 )&& $utils.checkButton('order:uploadFileMethod') ">
        <span class="primary_button">上传电子发票</span>
      </el-upload>
      <span class="warning_button"
            v-if="orderStatusId>=2 && orderStatusId<=7 && $utils.checkButton('order:openRemarkDialog')"
            @click="openRemarkDialog">追加备注</span>
      <span class="danger_button" v-if="orderStatusId==1 && $utils.checkButton('order:openCancelOrderDialog')"
            @click="openCancelOrderDialog">取消订单</span>
      <span v-if="orderStatusId>=2 && orderStatusId<=7 && $utils.checkButton('order:openRefundsDialog')"
            @click="openRefundsDialog">退货/退款</span>
    </div>
    <div class=" wrap_main  flex-item">
      <el-table :data="table.data" border ref="orderTable" height="100%" width="auto"
                @selection-change="handleSelectionChange"
                class="my_table" v-loading="tableLoading">
        <el-table-column type="index" width="45" label=" " align="center"></el-table-column>
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="合伙人" min-width="180">
          <template slot-scope="scope">
            <p class="primary_color">{{scope.row.linkman}}&nbsp;<span class="hint_color">{{scope.row.phone}}</span></p>
            <span class="point_display"
                  v-if="(orderStatusId==7 || orderStatusId==9)&&scope.row.totalEarnings">合计积分：<span
              class="red_color">{{scope.row.totalEarnings || 0}}</span></span>
          </template>
        </el-table-column>
        <el-table-column label="买家信息" min-width="200">
          <template slot-scope="scope">
            <p class="primary_color">{{scope.row.companyName }}（{{scope.row.customerCode }}）</p>
            <p class="primary_color">{{scope.row.linkName}} {{scope.row.customerPhone}}</p>
            <p class="primary_color">{{scope.row.consigneeAddress }}</p>
            <el-tooltip placement="top" v-if="scope.row.customerInvoice">
              <div slot="content" class="tooltip_setting">
                <!--发票类型：1普票，2专票-->
                <p class="tooltip_setting_content">发票类型：{{scope.row.customerInvoice.invoiceType==1?'普票':'专票'}}</p>
                <p class="tooltip_setting_content">税&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：{{scope.row.customerInvoice.dutyNumber
                  }}
                  <span @click="copyOrderCode(scope.row.customerInvoice.dutyNumber)">复制</span></p>
                <p class="tooltip_setting_content">开户银行：{{scope.row.customerInvoice.depositBank || '暂未登记' }}</p>
                <p class="tooltip_setting_content">开户账号：{{scope.row.customerInvoice.bankAccount || '暂未登记'}}</p>
                <p class="tooltip_setting_content">公司名称：{{scope.row.customerInvoice.company}}
                  <span @click="copyOrderCode(scope.row.customerInvoice.company)">复制</span></p>
                <div class="tooltip_setting_content flex-row " style="width: 400px;align-items: start">
                  公司地址： <p style="padding-right:10px" class="flex-item">{{scope.row.customerInvoice.address}}</p>
                  <span @click="copyOrderCode(scope.row.customerInvoice.address)">复制</span>
                </div>
              </div>
              <span class="invoice_color" v-if="scope.row.customerInvoice" style="cursor: pointer">
                【{{scope.row.customerInvoice.invoiceType==1?'普票':'专票'}}】查看开票信息</span>
            </el-tooltip>
            <br/>
            <!--  <el-popover
                placement="right"
                trigger="hover" v-if="scope.row.customerInvoice && scope.row.customerInvoice.invoiceInfo">
                <img :src="scope.row.customerInvoice.invoiceInfo"
                     style="max-width:500px;"/>
                <span class="invoice_color" slot="reference" style="cursor: pointer">
                  【发票】查看图片</span>
              </el-popover>-->
            <p v-if="scope.row.customerInvoice && scope.row.customerInvoice.invoiceInfo" style="position: relative">
               <span class="invoice_color"
                     style="cursor: pointer">
                【发票】查看图片</span>
              <el-image
                class="opacity_img"
                style="width: 100px;height: 20px;left: 0px;"
                :src="scope.row.customerInvoice.invoiceInfo"
                :preview-src-list="[scope.row.customerInvoice.invoiceInfo]"></el-image>
            </p>


          </template>
        </el-table-column>
        <el-table-column label="订单信息" min-width="310">
          <template slot-scope="scope">
            <p class="primary_color">{{scope.row.commodityKindNumber}}种商品，共{{scope.row.commodityNumber}}件</p>
            <p class="primary_color">
              <span class="hint_color">订&nbsp;&nbsp;单&nbsp;号：</span>{{scope.row.orderCode}}
              <span class="table_row_button" style="margin-left: 8px; color: #666666;"
                    @click="copyOrderCode(scope.row.orderCode)">复制</span></p>
            <p class="primary_color">
              <span class="hint_color">订&nbsp;&nbsp;单&nbsp;ID：</span>{{scope.row.orderId}}</p>
            <p class="primary_color"><span class="hint_color">下单时间：</span>{{scope.row.orderTime }}</p>
            <p class="primary_color text_overflow"><span class="hint_color">买家留言：</span>
              <!--   <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top">
                   <span style="width: 100%"> {{scope.row.remark}}</span>
                 </el-tooltip>-->
              <el-popover placement="bottom-start" title="买家留言" width="300" trigger="hover" :content="scope.row.remark">
                <span
                  slot="reference"> {{scope.row.remark.length>20?scope.row.remark.substring(0,20)+'...':scope.row.remark}}</span>
              </el-popover>
            </p>
            <p class="primary_color">
              <span class="hint_color">支付方式：</span>
              <span>{{scope.row.payType==1?'在线支付':scope.row.payType==2?'线下电汇':'无' }}  </span>
              <span v-if="scope.row.payType==1 && scope.row.payChannel"> -&nbsp;{{scope.row.payChannel}}</span>
              <!-- <el-popover
                 placement="right"
                 trigger="hover" v-if="scope.row.payType==2 && scope.row.webPath">
                 <img :src="scope.row.webPath " style="max-width: 600px"/>
                 <span class="web_path" slot="reference">查看电汇凭证</span>
               </el-popover>-->
              <template v-if="scope.row.payType==2 && scope.row.webPath">
                <span class="web_path">查看电汇凭证</span>
                <el-image
                  class="opacity_img"
                  style="width: 90px;height: 25px;left: 120px;"
                  :src="scope.row.webPath"
                  :preview-src-list="[scope.row.webPath]"></el-image>
              </template>

            </p>
            <div class="primary_color ">
              <span class="hint_color">电子发票：</span>
              <span v-if="scope.row.invoiceInfoList.length<=0">未上传</span>

              <el-popover
                placement="right"
                trigger="hover" v-if="scope.row.invoiceInfoList.length>0">
                <div style="width: 200px">
                  <p v-for="(item ,index) in scope.row.invoiceInfoList" :key="index" class="order_invoiceInfo_list ">
                        <span class="invoiceInfo_file text_overflow"
                              @click="lookInvoice(item.fileWebPath)">{{item.fileName}}</span>
                    <span v-if="$utils.checkButton('order:deleteInvoice')" @click="deleteInvoice(item.orderInvoiceId)">删除</span>
                  </p>
                </div>
                <span slot="reference" style="color: #0680FD">已上传</span>
              </el-popover>

              <!--<el-popover
                placement="right"
                trigger="hover" v-if="scope.row.invoiceInfoList.length>0">
                <div style="width: 200px">
                  <p v-for="(item ,index) in scope.row.invoiceInfoList" :key="index" class="order_invoiceInfo_list ">
                        <span class="invoiceInfo_file text_overflow"
                              @click="lookInvoice(item.fileWebPath)">{{item.fileName}}</span><span
                    @click="deleteInvoice(item.orderInvoiceId)">删除</span>
                  </p>
                </div>
                <span class="web_path" slot="reference">查看电子发票</span>
              </el-popover>-->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品金额" min-width="180">
          <template slot-scope="scope">
            <p class="primary_color">
              <span class="red_color">{{scope.row.totalPrice  }}</span>
              <span class="hint_color">（含运费{{scope.row.carriagePrice }}元）</span>
            </p>
            <div class="promotions_wrap" style="display: none">
              <p>优惠券：￥{{scope.row.discountsPrice }}</p>
              <p>满&nbsp;&nbsp;&nbsp;减：￥5.00</p>
            </div>
            <p><span class="table_row_button" @click="openDialog(scope.row.orderId)">购买明细</span></p>
            <p class="red_color" v-if="parseFloat(scope.row.backPrice)>=0">
              {{scope.row.isAllBack==1?'部分退款':scope.row.isAllBack==2?'整单退款':''}}：{{scope.row.backPrice}}元</p>
            <p class="primary_color" v-if="scope.row.backRemarks">
              退款说明：<br/>
              <span class="hint_color" v-html="scope.row.backRemarks"></span>
            </p>
          </template>
        </el-table-column>

        <!--        <el-table-column label="电子发票" min-width="150" v-if="orderStatusId==6 || orderStatusId==7"
                                 :key="Math.random()">
                  <template slot-scope="scope">
                    <p v-for="(item ,index) in scope.row.invoiceInfoList" :key="index" class="invoiceInfo_list">
                      <span class="invoiceInfo_file text_overflow"
                            @click="lookInvoice(item.fileWebPath)">{{item.fileName}}</span><span
                      @click="deleteInvoice(item.orderInvoiceId)">删除</span>
                    </p>
                  </template>
                </el-table-column>-->
        <el-table-column label="锁库存状态" min-width="100">
          <template slot-scope="scope">
            {{scope.row.hyLockStatus=='0'?'未确认':scope.row.hyLockStatus=='1'?'部分确认':scope.row.hyLockStatus=='2'?'全部确认':''}}
          </template>
        </el-table-column>
        <el-table-column label="是否发货" min-width="90" v-if="orderStatusId==5 ||orderStatusId==6 || orderStatusId==7">
          <template slot-scope="scope">
            {{scope.row.deliveryStatus==0?'未发货':scope.row.deliveryStatus==1?'部分发货':scope.row.deliveryStatus==2?'全部发货':scope.row.deliveryStatus==3?'已送达':''}}
          </template>
        </el-table-column>

        <el-table-column label="订单状态" min-width="240">
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
            <p class="hint_color" @click="openRecordingDialog(scope.row.orderId)" style="cursor: pointer"
               v-if="orderStatusId<=7">
              <i class="iconfont icon-chakan"></i>订单流转记录
            </p>
            <p class="primary_color" v-if="scope.row.additionalRemarks ">
              追加备注：<br/>
              <span class="hint_color" v-html="scope.row.additionalRemarks"></span>
            </p>
            <template v-if="orderStatusId==8">
              <p class="hint_color">{{scope.row.failMsg}}</p>
              <p v-if="scope.row.backEndTime>0 && $utils.checkButton('order:recoveryOrder')"><span
                class="recovery_order" @click="recoveryOrder(scope.row.orderId)">恢复订单</span>&nbsp;&nbsp;剩余恢复时间：{{scope.row.time}}
              </p>
            </template>

          </template>
        </el-table-column>
        <el-table-column label="快递公司" min-width="250" prop="commodityCode" v-if="orderStatusId==6 || orderStatusId==7"
        >
          <template slot-scope="scope">
            <div v-for="(item ,position) in scope.row.expressInfoList" :key="position"
                 class="expressCompany"
                 :style="{color:(position==0&&!scope.row.expressNo)  || scope.row.expressNo ==item.expressNo ?'#FE950D':''}">
              <label @click="tabExpressCompany(item.expressNo,scope.$index)" style="cursor: pointer">
                <span v-if="item.expressCompany">{{item.expressCompany}}-&nbsp;</span>
                <span>{{item.expressNo}}</span>
              </label>
              <span style="float: right;cursor: pointer" @click="editExpressNo(item.expressNo)"
                    v-if="$utils.checkButton('ottOrder:editExpressNo')"><i
                class="iconfont icon-bianji"> </i></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="物流动态" min-width="420" prop="commodityCode" v-if="orderStatusId==6 || orderStatusId==7"
        >
          <template slot-scope="scope">
            <div style="min-height: 150px;max-height: 240px; overflow-y: auto;padding-left: 1px;">
              <el-timeline v-if="scope.row.expressMessage && scope.row.expressMessage.length>0">
                <el-timeline-item :timestamp="item.time" placement="top" :hide-timestamp="true"
                                  v-for="(item,index) in scope.row.expressMessage" :key="index">
                  <p style="font-size: 12px;line-height: 20px;padding-right: 10px"
                     :style="{color:index==0?'#FE950D':'#666666'}">
                    {{item.time}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.context}}</p>
                </el-timeline-item>

              </el-timeline>
              <p style="text-align: center;color: #666666" v-else>暂无物流信息</p>
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

    <el-dialog title="购买明细" :visible.sync="dialogVisible" class="cms_dialog_visible" width="1100px"
               :close-on-click-modal="false" :before-close="clearDialog">
      <p class="dialof_primary_button"
         v-if="(orderStatusId==5 || orderStatusId==6) && $utils.checkButton('order:uploadLogisticsOpen')"><span
        @click="uploadLogisticsOpen(2)">上传物流单号</span></p>
      <el-table :data="commodityList" style="width: 100%;" max-height="500" border
                @selection-change="selectionCommodityChange" ref="commodityTable">
        <el-table-column type="index" align="center" width="40" label=" " v-if="orderStatusId!=5 && orderStatusId!=6"
                         :key="Math.random()"></el-table-column>
        <el-table-column type="selection" width="50" align="center" :selectable="isSelectable"
                         v-if="orderStatusId==5 || orderStatusId==6" :key="Math.random()"></el-table-column>
        <!-- v-if="orderStatusId==5 ||orderStatusId==6 || orderStatusId==7 || orderStatusId==9"
         :key="Math.random()"-->
        <el-table-column prop="status" label="发货状态" min-width="95px">
          <template slot-scope="scope">
            {{scope.row.status==0?'未发货':scope.row.status==1?'部分发货':scope.row.status==2?'全部发货':''}}
          </template>
        </el-table-column>
        <!--<el-table-column prop="commodityCode" label="快递公司" min-width="120px"></el-table-column>-->
        <el-table-column prop="drugName" label="商品信息" min-width="180px">
          <template slot-scope="scope">
            <p>{{scope.row.drugName}}&nbsp;&nbsp;{{scope.row.drugCommonName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="规格/厂家" min-width="200">
          <template slot-scope="scope">
            <p> {{scope.row.specifications}}/{{scope.row.manufacturer}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="commodityNumber" label="批号/效期" min-width="150">
          <template slot-scope="scope">
            <p>{{scope.row.productionBatch}}/{{scope.row.dateExpiration }} </p>
          </template>
        </el-table-column>
        <el-table-column label="锁库存状态" min-width="120">
          <template slot-scope="scope">
            {{scope.row.hyLockStatus=='0'?'未查询':scope.row.hyLockStatus=='1'?'锁成功':scope.row.hyLockStatus=='2'?'锁失败':''}}
            <span v-if="scope.row.hyLockStatus=='2'">({{scope.row.hyLockBzh}})</span>
          </template>
        </el-table-column>
        <el-table-column prop="commodityNumber" label="购买数量" min-width="80"></el-table-column>
        <el-table-column prop="backNumber" label="退货数量" min-width="80"></el-table-column>
        <el-table-column prop="actualPrice" label="单价" width="120">
          <template slot-scope="scope">
            <p class="text_overflow">{{scope.row.actualPrice}}<span class="invalid" style="display: none">{{scope.row.commodityPrice}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="小计金额" width="160">
          <template slot-scope="scope">
            <p class="text_overflow">{{scope.row.actualTotalPrice}}<span class="invalid" style="display: none">{{scope.row.totalPrice}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="backPrice" label="退款金额" min-width="80"></el-table-column>
        <el-table-column prop="supplierName" label="所属供应商" min-width="130">
          <template slot-scope="scope">
            <p class="text_overflow"> {{scope.row.supplierName}}</p>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
         &nbsp;
      </span>
    </el-dialog>
    <el-dialog
      title="追加备注"
      :visible.sync="remarkDialogVisible"
      class="cms_dialog_visible"
      width="585px"
      :close-on-click-modal="false"
      :before-close="handleCloseRemark">
      <el-input type="textarea" placeholder="请输入备注..." :rows="6" maxlength="200" show-word-limit
                v-model="remark"></el-input>
      <span slot="footer" class="dialog-footer">
           <el-button @click="handleCloseRemark">取 消</el-button>
           <el-button type="primary" @click="remarkDataSubmit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="取消订单"
      :visible.sync="cancelOrderVisible"
      class="cms_dialog_visible"
      width="585px"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-input type="textarea" placeholder="请输入取消订单理由..." :rows="6" maxlength="200" show-word-limit
                v-model="reason"></el-input>
      <span slot="footer" class="dialog-footer">
           <el-button @click="handleClose">取 消</el-button>
           <el-button type="primary" @click="cancleOrderSubmit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="oldExpressNo?'编辑物流单号':'上传物流单号'"
      :visible.sync="uploadLogisticsVisible"
      class="cms_dialog_visible"
      width="500px"
      :close-on-click-modal="false"
      :before-close="uploadLogisticsClose">
      <div style="padding-bottom: 10px;width: 300px;margin: auto;">
        <el-autocomplete v-model="trackingNumber" :fetch-suggestions="querySearchAsync" placeholder="请输入内容"
                         @select="handleSelect" clearable :trigger-on-focus="false"
                         style="width: 100%;"></el-autocomplete>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="uploadLogisticsClose">取 消</el-button>
           <el-button type="primary" @click="uploadLogisticsSubmit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="订单流转记录" :visible.sync="recordingDialogVisible" class="cms_dialog_visible" width="700px"
               :close-on-click-modal="false" :before-close="clearRecordingDialog">
      <el-table :data="historyData" style="width: 100%;" border :key="Math.random()">
        <el-table-column prop="createTime" label="时间" align="center" width="160"></el-table-column>
        <el-table-column prop="message" label="处理情况" align="center"></el-table-column>
        <el-table-column prop="userName" label="操作员" width="100" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        &nbsp;
      </span>
    </el-dialog>
    <el-dialog title="退货/退款" :visible.sync="refundsDialogVisible" class="cms_dialog_visible" width="1000px"
               :close-on-click-modal="false" :before-close="closeRefundsDialog">
      <div class="refunds_type_bg">
        <span class="refunds_type">类型</span>
        <el-radio v-model="refunds.isAllBack" label='1' @change="refundsChange(1)">部分退货</el-radio>
        <el-radio v-model="refunds.isAllBack" label='2' @change="refundsChange(2)" :disabled="refundsData.isAllBack==1">
          整单退货
        </el-radio>
      </div>
      <p class="refunds_hint">请选择退货商品，以及填写退货数量</p>
      <el-table :data="refundsData.data" style="width: 100%;" max-height="500" border>
        <el-table-column type="index" align="center" width="40" label=" "></el-table-column>
        <el-table-column prop="drugName" label="商品信息" min-width="160px">
          <template slot-scope="scope">
            <p>{{scope.row.drugName}} &nbsp;&nbsp;{{scope.row.drugCommonName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="规格/厂家" min-width="180">
          <template slot-scope="scope">
            <p> {{scope.row.specifications}}/{{scope.row.manufacturer}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="commodityNumber" label="批号/效期" min-width="150">
          <template slot-scope="scope">
            <p>{{scope.row.productionBatch}}/{{scope.row.dateExpiration }} </p>
          </template>
        </el-table-column>
        <el-table-column prop="canBackNumber" label="可退数量" min-width="80"></el-table-column>
        <el-table-column prop="sendNumber" label="退款数量" min-width="130">
          <template slot-scope="scope">
            <!--  <el-input v-model="scope.row.backNumber"
                        onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')"
                        @change="backNumberChange(scope.row,scope.$index)"
                        size="mini" style="width: 88px"></el-input>-->
            <el-input-number size="mini" style="width: 100px" v-model="scope.row.backNumber"
                             :min="0"
                             :disabled="refunds.isAllBack==2"
                             :max="scope.row.canBackNumber"
                             :step="scope.row.isRetail==0?scope.row.largePackage:scope.row.isRetail==1?scope.row.mediumPackage:1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" min-width="80">
          <template slot-scope="scope">
            {{(scope.row.backNumber * scope.row.actualPrice).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="所属供应商" min-width="130">
          <template slot-scope="scope">
            <p class="text_overflow"> {{scope.row.supplierName}}</p>
          </template>
        </el-table-column>
      </el-table>
      <div class="refunds_remark">
        <span>备注</span>
        <el-input type="textarea" placeholder="请详细说明退货原因..." :rows="2" maxlength="200" show-word-limit
                  v-model="refunds.remark"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
         <el-button @click="closeRefundsDialog">取 消</el-button>
           <el-button type="primary" @click="refundsDataSubmit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="打印销售单" :visible.sync="printDialogVisible" class="cms_dialog_visible print_dialog_visible"
               width="700px"
               :close-on-click-modal="false" :before-close="closePrintDialog">
      <div id="pdfDom" class="pdf_dom">
        <p class="print_data">打印日期：{{printData.time}}</p>
        <p class="new_customer" v-if="isFirst===1">新客户</p>
        <p class="print_title">药满多APP销售单</p>
        <p class="order_hint_title">订单信息</p>
        <div class="order_list_row flex-row">
          <div class="order_content  flex-row">
            <p class="content_title">收货单位：</p>
            <p class="content_info flex-item">{{printData.info.companyName}}</p>
          </div>
          <div class="order_content flex-row">
            <p class="content_title2 flex-item">
              {{printData.info.commodityKindNumber}}种商品，共{{printData.info.commodityNumber }}件，商品总金额：</p>
            <p class="content_info2">￥{{printData.info.commodityPrice}}</p>
          </div>
        </div>
        <div class="order_list_row flex-row">
          <div class="order_content  flex-row">
            <p class="content_title">收 货 人 ：</p>
            <p class="content_info flex-item">
              {{printData.info.linkName}}&nbsp;&nbsp;{{printData.info.customerPhone}}</p>
          </div>
          <div class="order_content flex-row">
            <p class="content_title2 flex-item">运费：</p>
            <p class="content_info2">￥{{printData.info.carriagePrice || '0.00'}}</p>
          </div>
        </div>
        <div class="order_list_row flex-row">
          <div class="order_content  flex-row">
            <p class="content_title">订 单 号 ：</p>
            <p class="content_info flex-item">{{printData.info.orderCode }}</p>
          </div>
          <div class="order_content flex-row">
            <p class="content_title2 flex-item">余额抵扣：</p>
            <p class="content_info2">￥{{printData.info.balancePay || '0.00'}}</p>
          </div>
        </div>
        <div class="order_list_row flex-row">
          <div class="order_content  flex-row">

            <p class="content_title">支付方式：</p>
            <p class="content_info flex-item">
              {{printData.info.payType==1?'在线支付':printData.info.payType==2?'线下电汇':'无' }}
              <span
                v-if="printData.info.payType==1 && printData.info.payChannel"> -&nbsp;{{printData.info.payChannel}}</span>
            </p>
          </div>
          <div class="order_content flex-row">
            <p class="content_title2 flex-item">实付金额（含运费￥{{printData.info.carriagePrice || '0.00'}}）：</p>
            <p class="content_info2">￥{{printData.info.payPrice }}</p>
          </div>
        </div>
        <div class="order_list_row flex-row">
          <div class="order_content  flex-row">
            <p class="content_title">下单时间：</p>
            <p class="content_info flex-item">{{printData.info.orderTime }}</p>
          </div>
          <div class="order_content flex-row" v-if="printData.info.backPrice && printData.info.isAllBack!=0">
            <p class="content_title2 flex-item">
              {{printData.info.isAllBack==1?'部分退款':printData.info.isAllBack==2?'整单退款':''}}：</p>
            <p class="content_info2">
              ￥{{printData.info.backPrice}}
            </p>
          </div>
        </div>
        <div class="order_list_row flex-row">
          <p class="content_title">收货地址：</p>
          <p class="content_info flex-item">{{printData.info.consigneeAddress}}</p>
        </div>
        <div class="order_list_row flex-row">
          <p class="content_title">客户留言：</p>
          <p class="content_info flex-item">{{printData.info.remark}}</p>
        </div>
        <div class="order_list_row flex-row">
          <p class="content_title">药满多备注：</p>
          <p class="content_info flex-item" v-html="printData.info.additionalRemarks"></p>
        </div>
        <el-table
          :data="printData.list" border class="print_table my_table" style="width: 100%">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="date" label="商品信息" align="center">
            <template slot-scope="scope">
              {{scope.row.drugName?scope.row.drugName+' &nbsp;&nbsp;':''}}{{scope.row.drugCommonName}}
            </template>
          </el-table-column>
          <el-table-column prop="specifications" label="规格" width="70" align="center"></el-table-column>
          <el-table-column prop="manufacturer" label="厂家" width="100" align="center"></el-table-column>
          <el-table-column prop="packageUnit" label="单位" width="50" align="center"></el-table-column>
          <el-table-column prop="sendNumber" label="数量" width="50" align="center"></el-table-column>
          <el-table-column prop="actualPrice" label="单价" width="70" align="center">
            <template slot-scope="scope">
              ￥{{scope.row.actualPrice}}
            </template>
          </el-table-column>
          <el-table-column prop="realtotalPrice" label="金额" width="80" align="center">
            <template slot-scope="scope">
              ￥{{scope.row.realtotalPrice}}
            </template>
          </el-table-column>
          <el-table-column label="批号/效期" width="80" align="center">
            <template slot-scope="scope">
              {{scope.row.productionBatch}}/{{scope.row.dateExpiration }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
     <el-button @click="closePrintDialog">取 消</el-button>
           <el-button type="primary" @click="printDataSubmit(printData.info.companyName,printData.info.orderCode)"
                      :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
   <!-- <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="imgUrlList"/>-->
  </div>
</template>

<script>
  import API from "../../api/api_order_list"
  import {bus} from "../../bus"
  // 导入组件
  // import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

  export default {
    name: "orderList",
    // components: {ElImageViewer},
    data() {
      return {
        isDisplaySearch: true,
        filters: {
          partnerOrPhone: "",
          customerOrCode: "",
          orderCode: "",
          payType: "0",
        },
        orderTime: [],
        payTypeData: [
          {label: '全部', value: "0"},
          {label: '在线支付', value: "1"},
          {label: '线下电汇', value: "2"}
        ],
        orderStatusData: [
          {id: 1, val: "待付款"},
          {id: 2, val: "已付款"},
          {id: 3, val: "开单中"},
          {id: 4, val: "拣货中"},
          {id: 5, val: "待配送"},
          {id: 6, val: "配送中"},
          {id: 7, val: "已完成"},
          {id: 8, val: "已取消"},
          {id: 9, val: "退货/退款"},
        ],
        orderStatusId: 1,//当前订单状态的orderStatusData的id
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        multipleSelection: [],
        dialogVisible: false,
        commodityList: [],
        reason: "",//取消订单的理由
        cancelOrderVisible: false,
        loading: false,
        uploadLogisticsVisible: false,//上传物流单号的dialog
        trackingNumber: "",//输入的快递单号
        oldExpressNo: "",//被编辑之前的物流单号，修改物流单号的时候用到
        express: {
          expressCode: "", //快递code
          expressCompany: "",//快递公司
          expressNo: "",//快递号
          level: -1, //是整体发货 还是分包发货  1整体 2分包
          orderCommodityIds: [], //分包发货的商品id
          orderIds: [] //订单id
        },
        commoditySelection: [],
        orderId: "",
        recordingDialogVisible: false,//订单流转记录
        historyData: [],//订单流转记录数据
        remarkDialogVisible: false,//备注dialog
        remark: '',//追加备注
        refundsDialogVisible: false,//退货/退款
        refunds: {
          isAllBack: '1',//是否部分退款  1是  2否
          list: [],
          orderId: "",
          remark: "",//退货留言
        },
        refundsData: {
          data: [],
          isAllBack: 0,
        },//退货数据
        intervalArr: [],//倒计时集合
        queryClickStatus: false,//鼠标点击查询次数，限制一秒钟只能点击一次
        tableLoading: false,
        printDialogVisible: false,//打印销售单dialog
        htmlTitle: '',
        pageData: "",
        printData: {
          info: {},
          list: [],
          time: "",//打印日期
        },
        isFirst: 2,//打印订单时是否是新客户  1是  2不是
        /*showViewer: false,//启用图片查看器
        imgUrlList: [],//图片集合*/
      }
    },
    created() {
      let orderCode = this.$route.params.orderCode;
      let queryStatus = this.$route.params.queryStatus;
      if (orderCode) {
        this.filters.orderCode = orderCode;
        this.orderStatusId = queryStatus;
      }
      this.initData();

      bus.$on("refreshOrder", (orderCode, queryStatus) => {
        this.filters = {
          partnerOrPhone: "",
          customerOrCode: "",
          payType: "0",
        },
          this.orderTime = [];
        this.filters.orderCode = orderCode;
        this.orderStatusId = queryStatus;
        this.initData();
      });
    },

    destroyed() {
      this.destroyInterval();
    },
    methods: {
      // 点击查看大图
      /*  showBigImg(img) {
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
      initTotal(param) {
        API.getOrderTotal(param).then(res => {
          if (res.code == 0) {
            this.orderStatusData = res.data;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleSearch() {
        if (!this.queryClickStatus) {
          this.table.currentPage = 1;
          this.initData();
          this.queryClickStatus = true;
          setTimeout(() => {
            this.queryClickStatus = false;
          }, 2000)
        }
      },
      initData() {
        this.destroyInterval();
        let param = Object.assign(this.filters, {});
        if (this.orderTime && this.orderTime.length >= 2) {
          param.orderTimeStart = this.orderTime[0];
          param.orderTimeEnd = this.orderTime[1];
        } else {
          param.orderTimeStart = '';
          param.orderTimeEnd = '';
        }
        param.status = this.orderStatusId;
        this.initTotal(param);
        param.limit = this.table.pageSize;
        param.page = this.table.currentPage;
        API.list(param).then(res => {
          if (res.code == 0) {
            this.table.data = res.data.rows;
            this.table.total = res.data.total;
            if (this.orderStatusId == 8) {
              this.countdown();
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //恢复订单
      recoveryOrder(orderId) {
        this.$confirm('确定恢复订单？', '提示', {
          type: 'warning'
        }).then(() => {
          API.timeOutOrderAgainPay({orderId}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.initData();
            } else {
              this.$message.error(res.msg);
            }
          })
        }).catch(() => {
        });

      },
      //确认退货退款
      refundsDataSubmit() {
        let num = 0;
        this.refunds.list = [];
        this.refundsData.data.forEach(item => {
          if (item.backNumber == 0 || item.backNumber == "") {
            num++
          }
          this.refunds.list.push({orderCommodityId: item.orderCommodityId, backNumber: item.backNumber})
        });
        if (num == this.refundsData.data.length) {
          this.$message.error("请填写需要退款的商品数量");
          return;
        }
        this.loading = true;
        API.orderReturnsAndRefunds(this.refunds).then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.$message.success(res.msg)
            this.closeRefundsDialog();
            this.initData();
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //填入的退款数量的值改变
      /*   backNumberChange(item,index) {
           if (item.backNumber > item.canBackNumber) {
             item.backNumber = item.canBackNumber;
             this.$message.error("退款数量不能超过可退款数量");
           }
           item.backPrice = (item.backNumber * item.actualPrice).toFixed(2);
           this.$set(this.refundsData,index,item)
         },*/
      //选择部分退款或者整单退款
      refundsChange(type) {
        let dataLength = this.refundsData.data.length;
        for (let i = 0; i < dataLength; i++) {
          let item = this.refundsData.data[i];
          if (type == 1) {
            item.backNumber = 0;
          } else if (type == 2) {
            item.backNumber = item.canBackNumber;
          }
        }
      },
      openRefundsDialog() {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$message.error("请选择退货/退款的订单")
          return;
        }
        if (this.multipleSelection && this.multipleSelection.length != 1) {
          this.$message.error("只能单个订单退货/退款")
          return;
        }
        this.refunds.orderId = this.multipleSelection[0].orderId;
        API.orderReturn({orderId: this.refunds.orderId}).then(res => {
          if (res.code == 0) {
            this.refundsData.data = res.data.list;
            this.refundsData.isAllBack = res.data.isAllBack;
          } else {
            this.$message.error(res.msg)
          }
        })
        this.refundsDialogVisible = true;
      },
      //关闭退货/退款dialog
      closeRefundsDialog() {
        this.refundsDialogVisible = false;
        this.refunds = {
          isAllBack: '1',//是否部分退款  1是  2否
          list: [],
          orderId: "",
          remark: "",//退货留言
        }
      },
      //追加备注
      openRemarkDialog() {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$message.error("请选择追加备注的订单")
          return;
        }
        if (this.multipleSelection && this.multipleSelection.length != 1) {
          this.$message.error("只能单个订单追加备注")
          return;
        }
        this.remarkDialogVisible = true;
      },
      //关闭备注弹出框
      handleCloseRemark() {
        this.remarkDialogVisible = false;
        this.remark = "";
      },
      //追加备注数据提交
      remarkDataSubmit() {
        if (!this.remark) {
          this.$message.error("请填写追加的备注");
          return;
        }
        this.loading = true;
        let param = {
          orderId: this.multipleSelection[0].orderId,
          remark: this.remark
        }
        API.additionalRemarks(param).then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.$message.success(res.msg);
            this.handleCloseRemark();
            this.initData();
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      //查看电子发票/或者普票
      lookInvoice(fileWebPath) {
        window.open(fileWebPath);
      },
      //删除电子发票
      deleteInvoice(orderInvoiceId) {
        this.$confirm('确定删除电子发票？', '提示', {
          type: 'warning'
        }).then(() => {
          API.deleteInvoice({orderInvoiceId}).then(res => {
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
      //上传电子发票
      uploadFileMethod(param) {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$message.error("请选择上传电子发票的订单")
          return;
        }
        let orderIdList = [];
        // let status = false;
        this.multipleSelection.forEach(item => {
          // if (item.invoiceStatus == 1) {
          //   status = true;
          // }
          orderIdList.push(item.orderId)
        });
        // if (status) {
        //   this.$message.error("选择上传电子发票的订单中存在有已上传过电子发票的订单");
        //   return;
        // }
        let fileObject = param.file;
        let fileType = fileObject.type;
        let isPdf = fileType.indexOf("pdf") != -1;
        if (!isPdf) {
          this.$message.error("只能上传pdf的文件");
          return;
        }
        /*  let isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            this.$message.error("只能上传pdf的文件大小小于2M");
            return;
          }*/
        let formData = new FormData();
        formData.append("file", fileObject);
        API.uploadInvoiceFile(formData).then(res => {
          if (res.code == 0) {
            let fileUrl = res.data;

            API.saveOrderInvoice({orderIdList, file: fileUrl}).then(res => {
              if (res.code == 0) {
                this.$message.success(res.msg)
                this.initData();
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //关闭订单 流转记录 dialog
      clearRecordingDialog() {
        this.recordingDialogVisible = false;
      },
      //打开流转 记录dialof
      openRecordingDialog(orderId) {
        this.recordingDialogVisible = true
        API.history({orderId}).then(res => {
          if (res.code == 0) {
            this.historyData = res.data;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //切换不同快递公司的物流
      tabExpressCompany(expressNo, index) {
        API.expInfo({expressNo}).then(res => {
          if (res.code == 0) {
            let item = this.table.data[index];
            item.expressMessage = res.data;
            item.expressNo = expressNo;  //选中的快递公司变色用的
            this.$set(this.table.data, index, item);//解决数据更新，界面视图无更新问题
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //修改物流单号
      editExpressNo(expressNo) {
        this.$nextTick(() => {
          this.$refs.orderTable.doLayout()
        })
        this.trackingNumber = expressNo;
        this.oldExpressNo = expressNo;
        this.uploadLogisticsVisible = true;
      },
      //关闭上传物流单号的dialog
      uploadLogisticsClose() {
        this.uploadLogisticsVisible = false;
        this.express = {
          expressCode: "", //快递code
          expressCompany: "",//快递公司
          expressNo: "",//快递号
          level: -1, //是整体发货 还是分包发货  1整体  2分包
          orderCommodityIds: [], //分包发货的商品id
          orderIds: [] //订单id
        }
        this.trackingNumber = "";
        this.oldExpressNo = "";
      },
      //打开上传物流单号的dialog
      uploadLogisticsOpen(level) {
        if (level == 1) {
          if (!this.multipleSelection || this.multipleSelection.length <= 0) {
            this.$message.error("请选择上传物流的订单")
            return;
          }
        } else if (level == 2) {
          if (!this.commoditySelection || this.commoditySelection.length <= 0) {
            this.$message.error("请选择上传物流的商品")
            return;
          }
        }
        this.express.level = level;
        this.uploadLogisticsVisible = true;
        this.oldExpressNo = "";
      },
      //商品明细中的多选
      selectionCommodityChange(val) {
        this.commoditySelection = val;
      },
      //根据快递单号搜索快递公司
      querySearchAsync(queryString, cb) {
        API.autonumber({expressNo: queryString}).then(res => {
          var results = [];
          this.express.expressNo = this.trackingNumber;
          this.express.expressCode = "";
          this.express.expressCompany = "";
          if (res.code == 0) {
            // results = queryString ? res.data.filter(this.createStateFilter(queryString)) : res.data;
            let data = res.data.filter(this.createStateFilter(queryString));
            results = data && data.length > 0 ? data : res.data;
            results.forEach(item => {
              item.value = this.trackingNumber + "  " + item.expressName;
            })
          } else {
            this.$message.error(res.msg)
          }
          cb(results);
        })
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.noPre.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.express.expressCode = item.comCode;
        this.express.expressCompany = item.expressName;
      },
      uploadLogisticsSubmit() {
        if (!this.trackingNumber) {
          this.$message.error("请填写快递单号");
          return;
        }
        if (!this.express.expressCode || !this.express.expressCompany) {
          this.$message.error("请输入正确的快递单号");
          return;
        }
        //oldExpressNo有值,编辑物流单号
        if (this.oldExpressNo) {
          let param = {
            expressCode: this.express.expressCode,
            newExpressNo: this.express.expressNo,
            expressCompany: this.express.expressCompany,
            oldExpressNo: this.oldExpressNo
          }
          API.updateExpNo(param).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.initData();
              this.uploadLogisticsClose();
            } else {
              this.$message.error(res.msg)
            }
          })
        } else { //上传物流单号
          if (this.express.level == 1) {
            this.express.orderIds = [];
            this.express.orderCommodityIds = [];
            this.multipleSelection.forEach(item => {
              this.express.orderIds.push(item.orderId)
            })
          } else if (this.express.level == 2) {
            this.express.orderCommodityIds = [];
            this.express.orderIds = [];
            this.express.orderIds.push(this.orderId);
            this.commoditySelection.forEach(item => {
              this.express.orderCommodityIds.push(item.orderCommodityId)
            })
          }
          API.uploadExp(this.express).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.initData()
              this.uploadLogisticsClose();
              this.clearDialog();
            } else {
              this.$message.error(res.msg)
            }
          })
        }

      },


      //打开购买详情dialog
      openDialog(orderId) {
        this.dialogVisible = true;
        this.orderId = orderId;
        API.commodityList({orderId}).then(res => {
          if (res.code == 0) {
            this.commodityList = res.data;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      clearDialog() {
        this.dialogVisible = false;
        this.commodityList = [];
        this.commoditySelection = [];
        if (this.$refs.commodityTable) {
          this.$refs.commodityTable.clearSelection();
        }
      },
      //是否允许勾选商品信息
      isSelectable(row, index) {
        if (row.status == 2) {
          return false
        }
        if (row.commodityNumber == row.backNumber) {
          return false
        }
        return true;
      },
      openCancelOrderDialog() {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$message.error("请选择取消的订单")
          return;
        }
        if (this.multipleSelection && this.multipleSelection.length != 1) {
          this.$message.error("订单只能单个取消")
          return;
        }
        this.cancelOrderVisible = true;
      },
      handleClose() {
        this.cancelOrderVisible = false;
        this.reason = "";
      },

      //打印订单
      print() {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$message.error("请选择打印的订单")
          return;
        }
        if (this.multipleSelection && this.multipleSelection.length != 1) {
          this.$message.error("订单只能单个打印")
          return;
        }
        API.print({orderId: this.multipleSelection[0].orderId}).then(res => {
          if (res.code == 0) {
            this.printData.info = res.data.orderSimpleVO;
            this.printData.list = res.data.orderCommodityList;
            this.printData.time = res.data.printDate
            this.printDialogVisible = true;
            this.isFirst = res.data.isFirst;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 取消订单
      cancleOrderSubmit() {
        if (!this.reason) {
          this.$message.error("请填写取消订单的理由");
          return;
        }
        this.loading = true;
        let param = {
          orderId: this.multipleSelection[0].orderId,
          failMsg: this.reason
        }
        API.cancel(param).then(res => {
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
      //提醒客户支付
      remindPayment() {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$message.error("请选择提醒客户支付的订单")
          return;
        }
        this.$confirm('确定提醒客户支付吗？', '提示', {
          type: 'warning'
        }).then(() => {
          let orderId = "";
          this.multipleSelection.forEach(item => {
            orderId += item.orderId + ",";
          })
          API.remindPay({orderId: orderId}).then(res => {
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
      //开单
      billing() {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$message.error("请选择开单的订单")
          return;
        }
        this.$confirm('确定开单？', '提示', {
          type: 'warning'
        }).then(() => {
          let orderIdList = [];
          this.multipleSelection.forEach(item => {
            orderIdList.push(item.orderId)
          })
          API.billing({orderIdList}).then(res => {
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
      //确认开单
      billingOK() {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$message.error("请选择开单完成的订单")
          return;
        }
        this.$confirm('确定开单完成？', '提示', {
          type: 'warning'
        }).then(() => {
          let orderIdList = [];
          this.multipleSelection.forEach(item => {
            orderIdList.push(item.orderId)
          })
          API.billingOK({orderIdList}).then(res => {
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
      //备货完成
      pick() {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$message.error("请选择备货完成的订单")
          return;
        }
        this.$confirm('确定备货完成？', '提示', {
          type: 'warning'
        }).then(() => {
          let orderIdList = [];
          this.multipleSelection.forEach(item => {
            orderIdList.push(item.orderId)
          })
          API.pick({orderIdList}).then(res => {
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
      //配送完成
      delivery() {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) {
          this.$message.error("请选择配送完成的订单")
          return;
        }
        this.$confirm('确定配送完成？', '提示', {
          type: 'warning'
        }).then(() => {
          let orderIdList = [];
          let status = false
          this.multipleSelection.forEach(item => {
            if (item.deliveryStatus == 1) {
              status = true;
            }
            orderIdList.push(item.orderId)
          })
          if (status) {
            this.$message.error("选择配送完成的订单中有部分发货的订单");
            return;
          }
          API.delivery({orderIdList}).then(res => {
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
      //复制订单号
      copyOrderCode(data) {
        let oInput = document.createElement('input');
        oInput.value = data;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象;
        // console.log(oInput.value)
        document.execCommand("Copy"); // 执行浏览器复制命令
        this.$message.success("已成功复制到剪切板")
        oInput.remove()
      },
      //全选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //切换订单状态
      changeOrderStatus(id) {
        this.orderStatusId = id;
        this.table.currentPage = 1;
        this.$nextTick(() => {
          this.$refs.orderTable.doLayout()
        });
        if (this.intervalArr && this.intervalArr.length > 0) { //如果定时任务有数据的话，给一秒钟的时间关闭
          this.tableLoading = true;
          this.destroyInterval();
          setTimeout(() => {
            this.tableLoading = false;
            this.initData();
          }, 1000)
        } else {
          this.destroyInterval();
          this.initData();
        }

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
      //关闭打印销售单
      closePrintDialog() {
        this.printDialogVisible = false;
      },
      //确认打印销售单
      printDataSubmit(name, order) {
        this.htmlTitle = name + "-" + order;
        this.getPdf();
        this.closePrintDialog();
      },
      countdown() {
        this.intervalArr = []
        let dataLength = this.table.data.length;
        for (let i = 0; i < dataLength; i++) {
          let item = this.table.data[i];
          if (item.backEndTime > 0) { //待支付时显示支付倒计时
            let endTime = item.backEndTime;
            let interval = setInterval(() => {
              if (this.orderStatusId != 8) {
                this.destroyInterval();
                this.initData();
              }
              endTime -= 1000;
              if (endTime <= 0) {
                this.destroyInterval();
                this.initData();
                return;
              }
              var days = parseInt(endTime / (1000 * 60 * 60 * 24));
              var hours = parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) < 10 ? '0' + parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              var minutes = parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60)) < 10 ? '0' + parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60)) : parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60));
              var seconds = parseInt((endTime % (1000 * 60)) / 1000) < 10 ? '0' + parseInt((endTime % (1000 * 60)) / 1000) : parseInt((endTime % (1000 * 60)) / 1000);
              item.time = hours + "时" + minutes + "分" + seconds;
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
        this.intervalArr = [];
      },
    }
  }
</script>

<style lang="scss">
  .order_list {

    .el-icon-circle-close {
      color: #fff;
    }
    .order_status_tab {
      border-bottom: 1px solid #ECEFF6;
      height: 40px;
      line-height: 40px;
      min-width: 1300px;
      p {
        overflow-x: auto;
        overflow-y: hidden;
      }
      span {
        display: inline-block;
        height: 100%;
        padding: 0px 4px;
        margin-right: 35px;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
      }
      .span_active {
        border-bottom: 2px solid #2F9FFE;
        color: #2F9FFE;
      }
    }
    .order_status_operating {
      padding-top: 20px;
      span {
        padding: 6px 12px;
        border-radius: 5px;
        font-size: 12px;
        margin-right: 12px;
        border: 1px solid #E5E6E7;
        color: #333333;
        cursor: pointer;
      }
      .primary_button {
        background: #EDF8FF;
        border-color: #A5D1FF;
        color: #0680FD;
      }
      .danger_button {
        background: #FEF0F0;
        border-color: #FFCBCB;
        color: #F85C5D;
      }
      .warning_button {
        background: #FDF6EC;
        border-color: #F7E2C3;
        color: #EAA857;
      }
    }
    .wrap_main {
      margin-top: 15px;
      .primary_color {
        color: #333;
        position: relative;
      }
      .hint_color {
        color: #666666;
      }
      .order_color {
        color: #0680FD;
      }
      .invoice_color {
        color: #FE950D;

      }
      .icon-chakan {
        color: #FE950D;
        font-size: 12px;
        margin-right: 5px;
      }
      .red_color {
        color: #FF4647;
      }
      .point_display {
        display: inline-block;
        color: #666666;
        border: 1px solid #DEDEDE;
        border-radius: 11px;
        padding: 2px 12px;
        line-height: 16px;
        font-size: 12px;
        margin-top: 5px;
      }
      .table_row_button {
        background: #F4F4F5;
        border: 1px solid #E5E6E7;
        padding: 2px 6px;
        border-radius: 5px;
        cursor: pointer;
      }
      .web_path {
        display: inline-block;
        border: 1px solid #DFDFDF;
        padding: 0px 6px;
        cursor: pointer;
        margin-left: 5px;
        color: #666666;
      }
      .recovery_order {
        display: inline-block;
        border: 1px solid #A5D1FF;
        color: #0680FD;
        padding: 0px 6px;
        cursor: pointer;
        background: #EDF8FF;
        border-radius: 5px;
      }
      .promotions_wrap {
        background: #FFF6F3;
        padding: 5px 11px;
        display: inline-block;
        color: #999999;
        margin: 5px 0px 10px;
        p {
          line-height: 20px;
        }
      }
    }

    .invalid {
      position: relative;
      color: #999999;
      margin-left: 10px;
      display: inline-block;
      width: 35px;
      height: 9px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      text-decoration: line-through;
      color: rgba(153, 153, 153, 1);
      line-height: 20px;
    }
    .dialof_primary_button {
      margin-bottom: 10px;
      span {
        padding: 6px 12px;
        border-radius: 5px;
        font-size: 12px;
        margin-right: 12px;
        border: 1px solid #A5D1FF;
        color: #0680FD;
        cursor: pointer;
        background: #EDF8FF;
      }

    }
    .expressCompany {
      cursor: pointer;
      line-height: 12px;
      margin-bottom: 10px;
    }
    .el-timeline-item {
      padding-bottom: 10px;
    }
    .uploadfile {
      display: inline-block;
    }

    .refunds_type_bg {
      margin-bottom: 10px;
      .refunds_type {
        color: #333;
        font-weight: bold;
        margin-right: 20px;
      }
      .el-radio__inner {
        width: 12px;
        height: 12px;
      }
      .el-radio__label {
        font-size: 12px;
        padding-left: 5px;
      }
      .el-radio, .el-radio__input {
        line-height: -2px;
      }
    }
    .refunds_remark {
      margin: 20px 0px;
      span {
        color: #333;
        font-weight: bold;
        margin-bottom: 8px;
        display: inline-block;
      }
    }
    .refunds_hint {
      line-height: 14px;
      font-size: 12px;
      margin-bottom: 12px;
    }
    .el-input-number__decrease, .el-input-number__increase {
      background: #fff;
    }
  }

  .order_invoiceInfo_list {
    line-height: 12px;
    margin-bottom: 10px;
    span {
      vertical-align: middle;
      cursor: pointer;
      color: #666;
    }
    .invoiceInfo_file {
      display: inline-block;
      line-height: 12px;
      width: 75%;
      color: #0680FD;
      margin-right: 5px;
    }
  }

  .print_dialog_visible .el-dialog {
    .el-dialog__body {
      padding: 0px;
    }
    max-height: initial !important;
    .el-dialog__header {
      display: none !important;
    }
    .pdf_dom {
      padding: 20px;
      position: relative;
      .print_data {
        position: absolute;
        left: 20px;
        top: 0px;
      }
      .new_customer {
        position: absolute;
        right: 20px;
        top: 5px;
        font-size: 16px;
        font-weight: 600;
      }
      .print_title {
        text-align: center;
        font-size: 16px;
        color: #333;
        font-weight: bold;
      }
      .order_hint_title {
        font-size: 14px;
        color: #333;
        font-weight: bold;
      }
      .order_list_row {
        width: 100%;
        color: #333333;
        font-size: 12px;
        align-items: start;
        .order_content {
          width: 50%;
          align-items: start;
        }
        .content_title {
          min-width: 72px;
          text-align: right;
        }
        .content_title2 {
          text-align: right;
        }
        .content_info2 {
          min-width: 70px;
          text-align: right;
        }
      }
    }
    .print_table {
      margin-top: 20px;
      .el-table__header thead tr th {
        color: #333;
        font-size: 12px;
        font-weight: bold;
      }
    }
  }
</style>
