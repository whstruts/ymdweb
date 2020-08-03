<template>
  <div class="customer-manage">
    <div class="search_bg_wrap flex-row">
      <p>
        <span class="search_hint">审核状态</span>
        <el-select v-model="filters.auditFlowStatus" placeholder="请选择" size="mini" @change="handleSearch">
          <el-option label="全部" :key=" " value=""></el-option>
          <el-option  v-for="item in auditFlowStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </p>
      <p>
        <span class="search_hint">账号</span>
        <el-input v-model="filters.loginName" clearable placeholder="登录账号/联系人/手机号/编码" size="mini" @keyup.enter.native="handleSearch"> </el-input>
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
        <span class="search_hint">客户类型</span>
        <el-select class="customer-type-select" v-model="filters.customerTypeId" placeholder="请选择" size="mini" @change="handleSearch" >
          <el-option label="全部" :key=" " value=""></el-option>
          <el-option  v-for="item in customerTypes"
            :key="item.customerTypeId"
            :label="item.customerTypeName"
            :value="item.customerTypeId"></el-option>
        </el-select>
      </p>
      <p>
        <span class="search_hint">客户类型报价</span>
        <el-select v-model="filters.specifyQuotation" placeholder="请选择" size="mini" @change="handleSearch">
         <el-option label="全部" :key=" " value=""></el-option>
          <el-option  v-for="item in statusData"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </p>
       <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询
      </el-button>
    </div>
    <div class="wrap_main flex-item">
      <el-table
        :data="table.data"
        border
        ref="table"
        height="100%"
        v-loading="loadingTable">
        <el-table-column label=" " type="index" width="40" align="center"></el-table-column>
        <el-table-column label="操作" width="230px" ref="opr">
          <template slot-scope="scope">
            <div class="table_setting_button" >
              <el-button type="primary" plain size="mini"
                :disabled="scope.row.auditStatus !=1 && scope.row.auditStatus !=3"
                @click.stop="handleEdit(scope.row)">编辑/审核
              </el-button>
              <el-button :type="scope.row.status==0?'warning':'success'" plain size="mini"
                         v-if="$utils.checkButton('customerManage:edit:status')" @click.stop="editState(scope.row.customerId,scope.row.status)">
                {{scope.row.status==0?'禁用':scope.row.status==9?'启用':'-'}}
              </el-button>
              <el-button plain size="mini" v-if="$utils.checkButton('customerManage:reset:pwd')"
                         @click.stop="resetPwd(scope.row)">重置密码
              </el-button>
            </div>
          </template>
        </el-table-column>
        <!-- 0未认证，1已认证，2已驳回 3 认证中 -->
        <el-table-column prop="reviewStateStr" label="资质审核状态" width="100px" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus == 0 ">未认证</span>
            <span v-if="scope.row.auditStatus == 1 ">已认证</span>
            <span v-if="scope.row.auditStatus == 2 ">已驳回</span>
            <span v-if="scope.row.auditStatus == 3 ">待审核</span>
          </template>
        </el-table-column>
        <el-table-column prop="reviewStateStr" label="变更状态" width="120px" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.auditFlowStatus == 1 ">待审核</span>
            <span v-if="scope.row.auditFlowStatus == 2 ">已审核</span>
            <p style="padding: 5px 0;text-align:center;" v-if="scope.row.auditFlowStatus != 0"><el-button type="info" size="mini" plain @click="showChangeDialog(scope.row)">变更明细</el-button></p>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="买家信息" width="120px"></el-table-column>
        <el-table-column prop="companyName" label="可用余额" width="120px" align="center">
          <template slot-scope="scope">
            <span>50</span>
            <p style="padding: 5px 0;text-align:center;"><el-button type="info" size="mini" plain @click="showBalanceDialog(scope.row)">查看明细</el-button></p>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="登录账号" width="120px"></el-table-column>
        <el-table-column prop="linkName" label="联系人"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120px"></el-table-column>
        <el-table-column prop="customerTypeName" label="客户类型" width="160px"></el-table-column>
        <el-table-column prop="" label="客户类型报价" width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.specifyQuotation == 1 ">单体价</span>
            <span v-if="scope.row.specifyQuotation == 2 ">连锁价</span>
            <span v-if="scope.row.specifyQuotation == 3 ">商业价</span>
          </template>
        </el-table-column>
        <el-table-column prop="disableReason" label="禁用原因" ></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180px"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" width="180px"></el-table-column>
      </el-table>
    </div>
    <div class="setting_pagination" v-if="table.total>0">
      <el-pagination  @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="[10, 50, 100, 150]"
                    :total="table.total" :current-page.sync="table.currentPage"
                    :page-size="table.pageSize"></el-pagination>
      <el-button type="primary" size="mini" plain>确 定</el-button>
    </div>

    <!-- 编辑用户信息弹框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible edit_customer_dialog"
      :close-on-click-modal="false"
      :before-close="clearFormData">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="90px" class="edit-customer-form">
        <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
          <!--<div class="dialog_nav"><span class="nav_line"></span><span>账号信息</span></div>-->
          <legend>注册信息</legend>
          <el-row>
            <el-col :span="8">
              <el-form-item label="邀请码" class="flex-item" prop="invitedCode">
                <el-input v-model.trim="formData.invitedCode" clearable size="small" @blur="getPartner" maxlength="10"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户名称" class="flex-item" prop="customerName">
                <el-input v-model.trim="formData.customerName" clearable size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号" class="flex-item">
                <el-input v-model.trim="formData.phone" clearable size="small" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
            <el-form-item label="合伙人" autofocus class="flex-item">
              <el-input v-model.trim="formData.partnerName" clearable size="small" disabled></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="登录账号" class="flex-item" prop="loginName">
              <el-input v-model.trim="formData.loginName" clearable maxlength="11" size="small"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="单位地址" class="flex-item" prop="companyAddress">
              <el-input v-model="formData.companyAddress" size="small"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
          <legend>客户参数</legend>
          <el-row>
            <el-col :span="8">
              <el-form-item label="客户编号" autofocus class="flex-item" prop="customerCode">
                <el-input v-model.trim="formData.customerCode" clearable size="small" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户类型" class="flex-item" prop="customerTypeId">
                <el-select  v-model="formData.customerTypeId" placeholder="请选择" size="mini" @change="handleSearch" disabled>
                  <el-option  v-for="item in customerTypes"
                    :key="item.customerTypeId"
                    :label="item.customerTypeName"
                    :value="item.customerTypeId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在区域" class="flex-item" prop="phone">
                <el-cascader v-model="formData.areaArr" :options="areaList" :props="searchProps" size="small"></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="24">
              <el-form-item label="收货地址" class="flex-item" prop="phone">
                <el-input v-model.trim="formData.address" clearable maxlength="120" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="24">
              <el-form-item label="支付方式" class="flex-item" prop="payTypeArr">
                <el-checkbox-group v-model="formData.payTypeArr" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="(item,index) in payTypes" :label="item.value" :key="index">{{item.key}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
           </el-row>
        </fieldset>
        <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
          <legend>价 格</legend>
           <el-row>
            <el-col :span="8">
              <el-form-item label="客户报价类型" class="flex-item" prop="specifyQuotation">
                <el-select v-model="formData.specifyQuotation" placeholder="请选择" size="small">
                  <el-option  v-for="item in statusData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
           </el-row>
        </fieldset>
        <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
          <legend>资 质</legend>
          <div class="info-list">
            <div class="info-item" v-for="(item,index) in formData.certificatesList" >
              <div class="item-name"><span class="s-name">{{item.certificateName}}</span><span class="is-required">（必填项）</span> <span class="fr"><a href="javascript:;" @click="showBigImg(item)">查看大图</a></span></div>
              <div class="item-content flex-wrp">
                <div class="file-box">
                  <div class="img-box-padding">
                    <div class="img-box" :style="{backgroundImage: 'url('+ item.img +')'}"></div>
                  </div>
                </div>
                <div class="flex-item zj-txt">
                  <div class="zj-number">
                    <p>证照号码：</p>
                    <el-input v-model="item.certificateCode" clearable  maxlength="32" size="small"></el-input>
                  </div>
                  <div class="zj-date">
                    <p>证件有效期：</p>
                    <el-date-picker
                      v-model="item.date"
                      size="small"
                      type="daterange"
                      range-separator="至"
                      start-placeholder=""
                      end-placeholder="" value-format="yyyy/MM/dd" format="yyyy/MM/dd" @change="handleChangeDate(index, $event)">
                    </el-date-picker>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </el-form>
      <span slot="footer" class="dialog-footer">
           <el-button @click="clearFormData">取 消</el-button>
           <el-button @click="refuseDialogVisible = true">驳 回</el-button>
           <el-button type="primary" :loading="loading" @click="checkPass">审核通过</el-button>
      </span>
    </el-dialog>

    <!-- 查看大图弹框 -->
    <el-dialog
    class="cms_dialog_visible"
     title="提示"
    :visible.sync="bigImgDialogVisible"
    width="40%">
      <div class="big-img-box">
        <img :src="imgUrl"/>
      </div>
      <div slot="footer" class="dialog-footer" style="height: 26px"></div>
    </el-dialog>
    <el-dialog
      title="禁用原因"
      :visible.sync="jyDialogVisible"
      class="cms_dialog_visible setting_dialog"
      width="585px"
      :close-on-click-modal="false"
      :show-close="false"
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

    <!-- 驳回弹框 -->
    <el-dialog
      title="驳回原因"
      :visible.sync="refuseDialogVisible"
      class="cms_dialog_visible setting_dialog"
      width="585px"
      :close-on-click-modal="false"
      :show-close="false">
      <div class="dialog_body" style="background: #fff;padding-bottom: 0px">
        <el-input type="textarea" placeholder="请输入驳回原因" :rows="6" maxlength="100"
                  v-model="remark"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="handleClose">取 消</el-button>
           <el-button type="primary" @click="sureRefuse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 变更信息弹框 -->
    <el-dialog
      title="变更明细"
      :visible.sync="changeDialogVisible"
      class="cms_dialog_visible changelog_dialog"
      width="585px"
      :close-on-click-modal="false"
      :show-close="false">
      <div class="table-record">
        <div class="table-header flex-wrp">
          <span class="flex-item">证照类型</span>
          <span style="width: 30%">时间</span>
          <span style="width: 30%">状态</span>
        </div>
        <div class="table-body">
          <div class="tr flex-wrp" v-for="item in changeLog.data">
            <div class="td flex-item">
              <div class="img-box-padding">
                <div class="img-box"  :style="{backgroundImage: 'url('+ item.img +')'}"></div>
              </div>
              <span class="zj-name">{{item.certificateName}}</span>
            </div>
            <div class="td" style="width: 30%">{{item.createTime}}</div>
            <div class="td status status-check" style="width: 20%">
              <!-- 审核流程状态：0未认证，1已认证，2已驳回 3待审核 -->
              <template v-if="item.auditStatus == 0">未认证</template>
              <template v-if="item.auditStatus == 1" ><span style="color:#38BC37">已通过</span></template>
              <template v-if="item.auditStatus == 2" ><span style="color:#999">已驳回</span></template>
              <template v-if="item.auditStatus == 3" ><span style="color:#F3510A">待审核</span></template>
            </div>
          </div>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 余额明细弹框 -->
    <el-dialog
      title="余额明细"
      :visible.sync="balanceDialogVisible"
      class="cms_dialog_visible"
      width="964px"
      :close-on-click-modal="false"
      :show-close="false">
      <el-table
      :data="table2.data">
        <el-table-column label="日期" prop="date" width="160px"> </el-table-column>
        <el-table-column width="165px">
          <template slot="header" slot-scope="scope">
            <el-dropdown  trigger="click"  @command="handleCommand">
              <span class="el-dropdown-link">
                收入/支出（元）<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">收入</el-dropdown-item>
                <el-dropdown-item command="2">支出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
             <span :style="{color:scope.row.type==1?'#00AA5F':'#FF7428'}">{{scope.row.num}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px">
          <template slot="header" slot-scope="scope">
            <el-dropdown  trigger="click"  @command="handleCommand2">
              <span class="el-dropdown-link">
                类型<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  command="1">退货/退款</el-dropdown-item>
                <el-dropdown-item  command="2">订单抵扣</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
             <span>{{scope.row.type == 1?'退货/退款':'订单抵扣'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联订单" width="220px">
          <template slot-scope="scope">
            订单号：{{scope.row.orderId}}
          </template>
        </el-table-column>
        <el-table-column label="订单支付方式" width="220px">
          <template slot-scope="scope">
            {{scope.row.payType == 1? "在线支付-支付宝": scope.row.payType =="2"?"在线支付-微信":"线下电汇"}}
          </template>
        </el-table-column>
        <el-table-column label="余额" prop="balance" width="120px"></el-table-column>
      </el-table>
       <div class="setting_pagination" v-if="table2.total>0">
        <el-pagination @current-change="handleCurrentChange2"
                       @size-change="handleSizeChange2"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10, 50, 100, 150]"
                       small
                       :total="table2.total" :current-page.sync="table2.currentPage"
                       :page-size="table2.pageSize"></el-pagination>
        <el-button type="primary" size="mini" plain>确 定</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="balanceDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from "../../../api/api_customer_manage";

  export default {
    name: "customerManage",
    data() {
      return {
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
          auditFlowStatus: '',
          customerTypeId: '',
          specifyQuotation:''
        },
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        changeLog:{
          data:[],
          total: 0,
          pageSize: 10,
          currentPage:1
        },
        auditFlowStatusList:[
          {
            value: '1',
            label: '进行中'
          },
          {
            value: '2',
            label: '已结束'
          },
        ],
        statusData: [
        {
          value: '1',
          label: '单体价'
        }, {
          value: '2',
          label: '连锁价',
        },{
          value: '3',
          label: '商业价',
        }],
        customerTypes:[], // 用户类型
        payTypes:[
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
          customerName:"",
          partnerName:"",
          loginName:"",
          companyAddress:"",
          customerCode:"",
          customerTypeId:"",
          areaArr:[],
          address:"",
          phone: "",
          payTypeArr:[],
          specifyQuotation:'',
          certificatesList:[]

        },
        certificatType:[], // 证件类型
        rules: {
          invitedCode: [
            {required: true, message: "请输入邀请码", trigger: "blur"}
          ],
          customerName: [
            {required: true, message: "请输入客户名称", trigger: "blur"}
          ],
          loginName:[{required: true, message: "请输入登录账号", trigger: "blur"}],
          companyAddress: [{required: true, message: "请输入单位地址", trigger: "blur"}],
          customerCode: [{required: true, message:"请输入客户编号", trigger: "blur"}],
          customerTypeId: [{required: true, message: "请选择客户类型", trigger: "change"}],
          areaArr: [{required: true, message: "请选择所在区域", trigger: "change"}],
          address: [{required: true, message:"请输入收货地址", trigger: "blur"}],
          payTypeArr: [{type: 'array',required: true, message: "请选择支付方式", trigger: "change"}],
          specifyQuotation:[{required: true, message: "请选择客户报价类型", trigger: "change"}]
        },
        areaList:[], // 省市区
        searchProps: {
          label: "name",
          children: 'children',
          value: "areaId",
        },
        dialogVisible: false,//編輯用戶彈出框
        userLoading: false,//用户信息的提交
        isAddUser: true,//是否是新增用户，true是，false代表编辑
        table2: {
          data: [{
            date:'2019/01/20  12:11:09',
            type: 1,
            num:"56",
            orderId: 'dm-2018101915462',
            balance: 100,
            payType: 1,
          },
          {
            date:'2019/01/20  12:11:09',
            type: 2,
            num:"-40",
            orderId: 'dm-2018101915462',
            balance: 100,
            payType: 2,
          },
          {
            date:'2019/01/20  12:11:09',
            type: 2,
            num:"-40",
            orderId: 'dm-2018101915462',
            balance: 100,
            payType: 3,
          }],
          total: 2,
          pageSize: 10,
          currentPage: 1
        },
      }
    },
    created() {
      this.initData();
      this.getCustomerType();
    },
    destroyed() {
      this.$destroy();
    },
    methods: {
      // 获取用户类型
      getCustomerType(){
        API.getCustomerType().then(res => {
          if (res.code == 0) {
            this.customerTypes = res.data
          }
        })
      },
      // 获取省市区
      getAreaList(){
        API.getSysAreaTree().then( (res) => {
          if(res.code == 0) {
            this.areaList = this.$utils.getTreeData(res.data);
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      handleCheckedCitiesChange(val){
        console.log(val)
      },
      // 输入邀请码查询合伙人
      getPartner(){
        if(this.formData.invitedCode != "" && this.formData.invitedCode != null) {
          API.getPartner({page: 1,limit:1,invitationCode: this.formData.invitedCode}).then( (res) => {
            if(res.code == 0) {
              let rows = res.data.rows;
              if(rows.length <= 0) {
                this.$message.error("邀请码错误，合伙人不存在");
                this.formData.partnerName = "";
                this.formData.invitedCode = "";
                return;
              }
              this.formData.partnerName = res.data.rows[0].loginName;
            } else {
              this.$message.error(res.msg);
            }
          })
        }
      },
      editState(customerId, type) {
        console.log(type)
        let msg = type == "0" ?  "禁用" : "启用";
        if( type == "9") {
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
      handleClose(){
        this.disableReason = '';
        this.remark = '';
        this.jyDialogVisible = false;
         this.refuseDialogVisible =false;
      },
      // 禁用弹框 点击确认按钮
      submitData(){
        if(this.disableReason == '') {
          this.$message.error("请填写禁用原因");
          return;
        }
        API.userDisabled({customerId: this.customerId,disableReason: this.disableReason}).then(res => {
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
      // 驳回确认按钮
      sureRefuse(){
        if(this.remark == '') {
          this.$message.error("请填写驳回原因");
          return;
        }
        let params = {
          auditStatus: 2,
          customerId: this.formData.customerId,
          remark: this.remark
        }
        if(this.formData.auditFlowStatus == 1) {
          params.auditFlowStatus = 2;
        }
        API.verifyUser(params).then(res => {
          this.userLoading = false;
          if (res.code === 0) {
            this.dialogVisible = false;
            this.refuseDialogVisible = false;
            this.clearFormData();
            this.initData();
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      clearFormData() {
        this.dialogVisible =false;
        this.formData = {
          invitedCode: "",
          customerName:"",
          partnerName:"",
          loginName:"",
          companyAddress:"",
          customerCode:"",
          customerTypeId:"",
          areaArr:[],
          address:"",
          phone: "",
          payTypeArr:[],
          specifyQuotation:''
        }
        this.$refs['ruleForm'].resetFields();
      },
      initData() {
        let params = {
          page: this.table.currentPage,
          limit: this.table.pageSize,
          auditFlowStatus: this.filters.auditFlowStatus,
          loginName: this.filters.loginName,
          customerTypeId: this.filters.customerTypeId,
          specifyQuotation: this.filters.specifyQuotation
        }
        if(this.filters.createTime && this.filters.createTime.length > 0) {
          params.createTimeStart = this.filters.createTime[0];
          params.createTimeEnd = this.filters.createTime[1];
        }
        if(this.filters.lastLoginTime && this.filters.lastLoginTime.length > 0) {
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
      handleKeyUp(e){
        this.userForm.phone = e.target.value.replace(/[^\d]/g,'');
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
      //点击编辑用户弹出框
      async showEditUserDialog(item) {
        this.loadingTable = true;
        await this.getAreaList();
        API.getInfo({customerId: item.customerId}).then( (res) => {
          this.loadingTable = false;
          if(res.code == 0) {
            let form = res.data;
            let list = res.data.certificatesList;
            for(let i =0; i<list.length; i++) {
              list[i].date = [list[i].validityStart, list[i].validityEnd]
            }
            form.certificatesList = list;
            this.formData = form;
            console.log(this.formData)
            this.dialogVisible = true;
          } else {
            this.$message.error(res.msg);
          }
        })

      },
      //编辑用户
      editUserSubmit() {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            this.userLoading = true;
            let params = Object.assign({}, this.userForm);
            API.editSupplier(params).then(res => {
              this.userLoading = false;
              if (0 === res.code) {
                this.$message.success(res.msg);
                this.cancelDialog()
                this.initData();
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        })
      },
      handleEdit(item){
        this.$router.push({
          path:'/editCustomer?customerId=' + item.customerId
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
          }).catch(_ => {});
      },
      // 点击查看大图
      showBigImg (item) {
        this.imgUrl = item.img
        this.bigImgDialogVisible = true;
      },
      // 选择日期
      handleChangeDate(idx, val){
        console.log(val)
        if(val) {
          this.formData.certificatesList[idx].validityStart= val[0];
          this.formData.certificatesList[idx].validityEnd= val[1];
        } else {
          this.$nextTick( () => {
            this.formData.certificatesList[idx].date= '';
            this.formData.certificatesList[idx].validityStart= '';
            this.formData.certificatesList[idx].validityEnd= '';
          })

        }
      },
      // 点击审核通过
      checkPass(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            for(let i in this.formData.certificatesList) {
              let obj =  this.formData.certificatesList[i];
              if(obj.certificateCode == '' || obj.date == '') {
                this.$message.warning("请检查资质信息必填项!")
                return;
              }
            }
             this.formData.auditStatus = 1;
             if(this.formData.auditFlowStatus == 1) {
               this.formData.auditFlowStatus = 2;
             }
             API.verifyUser(this.formData).then(res => {
              this.userLoading = false;
              if (res.code === 0) {
                this.dialogVisible = false;
                this.clearFormData();
                this.initData();
                this.$message.success("操作成功");
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })

      },
      // 获取变更记录列表
      getCustomerTypeChangeLog(){
        this.loadingTable = true;
        let params = {
          customerId: this.changeLog.customerId,
          limit: this.changeLog.pageSize,
          page: this.changeLog.currentPage,
        };
        this.changeDialogVisible = true;
        API.getCustomerTypeChangeLog(params).then( (res) => {
          this.loadingTable = false;
          if(res.code == 0) {
            this.changeLog.data = res.data.rows;
            this.changeLog.total = res.data.total;
          }
        })
      },
      // 查看变更明细
      showChangeDialog(row){
        this.changeLog.customerId = row.customerId;
        this.getCustomerTypeChangeLog();
      },
      // 查看余额明细
      showBalanceDialog(row){
        this.balanceDialogVisible = true;
      },
      handleSizeChange2(val) {
        this.changeLog.pageSize = val;
        this.getCustomerTypeChangeLog();
      },
      handleCurrentChange2(){
        this.changeLog.currentPage = val;
        this.getCustomerTypeChangeLog();
      },
       handleCommand(command){
        console.log(command);
      },
      handleCommand2(command){
        console.log(command);
      }
    }
  }
</script>

<style lang="scss">
.customer-manage{
  .edit_customer_dialog,.changelog_dialog{
    .el-dialog{
      width: 964px !important;
    }
  }
  .table-record{
    max-height: 600px;
    overflow-y: auto;
  }
  .edit-customer-form{
    max-height: 659px;
    overflow-y: auto;
    .el-row{
      .el-form-item{
        margin: 0 21px 20px 21px;
        &:first-child{
          margin-left: 0;
        }
      }
    }
    .el-input__inner{
      padding: 0 5px;
    }
    .el-cascader--small,.el-select{
      width: 100%;
    }
  }

  .provider-form{
    padding: 20px;
  }
  .info-list{
    overflow: hidden;
  }
  .info-item{
    float: left;
    margin-right: 20px;
    margin-bottom: 16px;
    padding: 18px;
    width: 415px;
    height: 217px;
    border: 1px solid #F5F5F5;
    box-sizing: border-box;
    &:nth-child(2n){
      margin-right: 0;
    }
    .item-name{
      font-size:14px;
      color: #333333;
      .is-required{
        color: #FF0000;
      }
      .s-name{
        display: inline-block;
        max-width: 60%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
      a{
        color: #F3A707;
        text-decoration: underline;
      }
    }
  }
  .item-content{
    padding: 10px 0;
    align-items: flex-start;
  }
  .file-box{
    position: relative;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    background: #F5F5F5;
    .upload-input{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    .img-box-padding{
      position: relative;
      width: 100%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      &:hover{
        .black-mask{
          display: block;
        }
      }
      .black-mask{
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
        background: rgba(0,0,0,0.3);
      }
    }
    .img-box{
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
  .item-rules{
    font-size: 12px;
    color: #666;
    .rule-title{
      color: #333333;
    }
  }
  .zj-date{
    padding-top: 10px;
    width: 246px;
    .el-range-editor--small{
       width: 246px !important;
     }
    .el-icon-date{
      display: none;
    }
    .el-range-input {
      text-align: left;
    }
    .el-range-editor--small .el-range-separator{
      line-height: 28px;
    }
    .el-date-editor .el-range-separator {
      padding: 0 15px
    }
    .el-date-editor .el-range-input{
      width: 90%;
    }
  }
  .customer-type-select{
    .el-input{
      width: 180px !important;
    }
  }
  .table-record{
      width: 100%;
      // padding: 0 17px;
      .table-header{
        height: 33px;
        line-height: 33px;
        background-color: #F9F9F9;
        overflow: hidden;
        span{
          float: left;
          text-align: center;
        }
      }
      .table-body{
        padding: 0 18px;
        .tr{
          padding: 18px 0;
          border-bottom: 1px solid #F3F4F3;
          overflow: hidden;
          .td{
            font-size: 12px;
            color: #333333;
            text-align: center;
          }
          .flex-item{
            font-size: 14px;
            color: #333333;
            text-align: left;
          }
          .status-check{
            color: #F3510A
          }
          .status-pass{
            color: #38BC37
          }
        }
      }
      .img-box-padding{
        display: inline-block;
        padding: 10px;
        width: 95px;
        height: 94px;
        border: 1px solid #eeeeee;
        box-sizing: border-box;
        vertical-align: middle;
      }
      .img-box{
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
      .zj-name{
        padding-left: 36px;
        font-size: 14px;
        color: #333333;
      }
    }
    .big-img-box{
      text-align: center;
    }
}

</style>
