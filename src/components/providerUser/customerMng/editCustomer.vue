<template>
  <div class="edit-customer" v-loading="loadingTable">
    <h2 class="page-title">{{type == 1? '基本信息': '认证信息'}}<el-button type="primary" icon="iconfont icon-fanhui" size="mini" @click="goBack">返回</el-button></h2>
    <div class="edit-container" :class="isHadShadow?'hadShadow':''" ref="editContainer">
      <!-- 基本信息 -->
      <template v-if="type == 1">
        <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="90px" class="edit-customer-form">
          <div class="info-box">
            <div class="dialog_nav"><span class="nav_line" id="baseinfo"></span><span>账号信息</span></div>
            <el-row class="info-row">
              <!-- <el-col :span="8" v-if="!canEdit">
                <el-button class="change-phone-btn" size="mini" @click="changePhone">更换手机号</el-button>
              </el-col> -->
            </el-row>
            <el-row class="info-row">
              <el-col :span="8">
                <el-form-item label="登录账号" class="" prop="loginName">
                  <el-input v-model.trim="formData.loginName" clearable maxlength="11" size="small" :disabled="!canEdit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单位名称" class="" prop="companyName">
                  <el-input v-model.trim="formData.companyName" clearable size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所在区域" class="flex-item" prop="phone" >
                  <el-cascader v-model="formData.areaArr" :options="areaList" :props="searchProps" size="small" separator='' @change="changeArea"></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="info-row">
              <el-col :span="8">
                <el-form-item label="单位类型" class="flex-item" prop="customerTypeId">
                  <el-select  v-model="formData.customerTypeId" placeholder="" size="mini" @change="handleSearch" disabled>
                    <el-option  v-for="item in customerTypes"
                      :key="item.customerTypeId"
                      :label="item.customerTypeName"
                      :value="item.customerTypeId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人" class="" prop="linkName">
                  <el-input v-model.trim="formData.linkName" clearable size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式" class="">
                  <el-input v-model.trim="formData.companyLandline" clearable size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="info-row">
              <el-col :span="24">
                <el-form-item label="单位地址" class="" prop="companyAddress">
                  <el-input type="textarea" v-model="formData.companyAddress" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="info-row">
              <el-col :span="24">
                <el-form-item label="收货地址" class="flex-item" prop="address">
                  <el-input type="textarea" v-model.trim="formData.address" clearable maxlength="120" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="info-box">
            <div class="dialog_nav" id="khinfo"><span class="nav_line"></span><span>关联合伙人</span></div>
            <el-row class="info-row">
              <el-col :span="8">
                <el-form-item label="按区域分配" autofocus class="flex-item">
                  <el-cascader v-model="formData.areaArr" :options="areaList" :props="searchProps" size="small" separator='' disabled></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  class="info-row">
              <el-col :span="8">
                <el-form-item label="合伙人" autofocus class="">
                  <!-- <el-input v-model.trim="formData.partnerName" clearable size="small" disabled></el-input> -->
                  <el-select
                    v-model="formData.partnerName"
                    filterable
                    placeholder=""
                    :loading="loading" size="mini"
                    @change="changePartner">
                    <el-option
                      v-for="item in partnerList"
                      :key="item.partnerId"
                      :label="item.linkman"
                      :value="item.loginName">
                      <span>{{ item.linkman}}/{{item.phone}}/{{item.loginName}}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="邀请码" class="" prop="invitedCode">
                  <el-input v-model.trim="formData.invitedCode" clearable size="small" @blur="getPartner" maxlength="10"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="info-footer">
            <el-button @click="goBack">取 消</el-button>
            <el-button type="primary" @click="saveInfo">保存</el-button>
          </div>
        </el-form>
      </template>
      <template v-if="type == 2">
        <el-form :model="formData2" :rules="rules2" ref="ruleForm2" label-width="90px" class="edit-customer-form">
          <div class="info-box">
            <div class="dialog_nav" id="khinfo"><span class="nav_line"></span><span>客户参数</span></div>
            <el-row class="info-row">
              <el-col :span="8">
                <el-form-item label="客户类型" class="flex-item" prop="customerTypeId">
                  <el-select  v-model="formData2.customerTypeId" placeholder="请选择" size="mini" @change="handleSearch" disabled>
                    <el-option  v-for="item in customerTypes"
                      :key="item.customerTypeId"
                      :label="item.customerTypeName"
                      :value="item.customerTypeId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  class="info-row">
              <el-col :span="8">
                <el-form-item label="客户报价类型" class="flex-item" prop="specifyQuotation">
                  <el-select v-model="formData2.specifyQuotation" placeholder="请选择" size="small">
                    <el-option  v-for="item in statusData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="支付方式" class="flex-item" prop="payTypeArr">
                  <el-checkbox-group v-model="formData2.payTypeArr">
                    <el-checkbox v-for="(item,index) in payTypes" :label="item.value" :key="index">{{item.key}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="info-row">
              <el-col :span="8">
                <el-form-item label="客户编码" class="">
                  <el-input v-model="formData2.erpCode" disabled size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" size="mini" @click="check">检索</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="info-box">
            <div class="dialog_nav" id="picinfo"><span class="nav_line"></span><span>证照</span></div>
            <div class="info-list">
              <div class="info-item" v-for="(item,index) in formData2.certificatesList" >
                <div class="item-name" style="position: relative">
                  <span class="s-name">{{item.certificateName}}</span>
                  <span class="is-required">（必填项）</span>
                  <span class="fr"><a href="javascript:;">查看大图</a></span>
                  <el-image
                    class="opacity_img"
                    style="width: 60px;height: 28px;right: 0px"
                    :src="item.img"
                    :preview-src-list="[item.img]"></el-image>
                </div>
                <div class="item-content flex-wrp">
                  <div class="file-box">
                    <div class="img-box-padding">
                      <div class="img-box" :style="{backgroundImage: 'url('+ item.img +')'}"></div>
                    </div>
                    <div v-if="item.validity == 0">
                      <span class="zj-status status-normal">正常情况</span>
                    </div>
                    <div v-if="item.validity == 1">
                      <span class="zj-status status-normal" v-if="item.laveDay > 30">正常情况</span>
                      <span class="zj-status status-outdate"  v-if="item.laveDay <= 0">已过期</span>
                      <span class="zj-status status-outdate-soon"  v-if="item.laveDay > 0 && item.laveDay <= 30">{{item.laveDay}}天后过期</span>
                    </div>
                    <div v-if="item.validity == 2">
                      <template v-if="item.validityStart == ''">
                        <span class="zj-status status-normal">正常情况</span>
                      </template>
                      <template v-else>
                        <span class="zj-status status-normal" v-if="item.laveDay > 30">正常情况</span>
                        <span class="zj-status status-outdate"  v-if="item.laveDay <= 0">已过期</span>
                        <span class="zj-status status-outdate-soon"  v-if="item.laveDay > 0 && item.laveDay <= 30">{{item.laveDay}}天后过期</span>
                      </template>
                    </div>
                  </div>
                  <div class="flex-item zj-txt">
                    <div class="zj-number">
                      <p>证照号码：<span class="copy-btn" @click="copy(item.certificateCode)" v-if="item.certificateCode">复制</span></p>
                      <el-input v-model="item.certificateCode" clearable  maxlength="32" size="small" disabled></el-input>
                    </div>
                    <div class="zj-date">
                      <p>证件有效期：</p>
                      <el-date-picker
                        v-model="item.date"
                        size="small"
                        type="daterange"
                        range-separator="至"
                        start-placeholder=""
                        end-placeholder="" value-format="yyyy/MM/dd" format="yyyy/MM/dd" disabled   @change="handleChangeDate(index, $event)">
                      </el-date-picker>
                    </div>
                    <el-radio-group v-model="item.validityType" >
                      <el-radio class="radio-reset" :label="2" disabled>长期有效</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="info-box">
            <div class="dialog_nav" id="jyinfo"><span class="nav_line"></span><span>经营范围</span></div>
            <el-form-item label="一级分类" class="flex-item" prop="typeCodes">
              <el-checkbox-group  v-model="formData2.typeCodes">
                <el-checkbox v-for="(item,index) in formData2.drugTypeList" :label="item.typeCode" :key="index">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div class="info-footer">
            <el-button @click="goBack">取 消</el-button>
            <el-button @click="refuseDialogVisible = true">驳 回</el-button>
            <el-button type="primary" :loading="loading" @click="checkPass">审核通过</el-button>
          </div>
        </el-form>
      </template>
    </div>

    <!-- 查看大图弹框 -->
    <el-dialog
    class="cms_dialog_visible add_user"
     title="提示"
    :visible.sync="bigImgDialogVisible"
    width="40%">
      <div class="big-img-box">
        <img :src="imgUrl"/>
      </div>
      <div slot="footer" class="dialog-footer" style="height: 26px"></div>
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
  <!--  <el-image-viewer
           v-if="showViewer"
           :on-close="closeViewer"
           :url-list="[url]" />-->
  </div>
</template>
<script>
import {bus} from "../../../bus.js";
import API from "../../../api/api_customer_manage";
// 导入组件
// import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name:"editCustomer",
  data(){
    return{
      type: '', // 1基本信息 2 认证信息
      customerId:'',
      options: [],
      canEdit: false,
      activeNum: 1,
      isHadShadow: false,
      loadingTable:false,
      bigImgDialogVisible: false,
      jyDialogVisible: false,
      refuseDialogVisible: false,
      changeDialogVisible: false,
      remark: '',   // 驳回原因
      imgUrl: null,
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
      partnerList:[],
      formData: {
        partnerId:"",
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

      },
      formData2:{
        payTypeArr:[],
        specifyQuotation:'',
        certificatesList:[],
        typeCodes:[]
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
        linkName:[{required: true, message: "请输入联系人", trigger: "blur"}],
        companyAddress: [{required: true, message: "请输入单位地址", trigger: "blur"}],
        customerCode: [{required: true, message:"请输入客户编号", trigger: "blur"}],

        areaArr: [{required: true, message: "请选择所在区域", trigger: "change"}],
        address: [{required: true, message:"请输入收货地址", trigger: "blur"}],
        companyName:[{required: true, message:"请输入单位名称", trigger: "blur"}],
      },
      rules2:{
        customerTypeId: [{required: true, message: "请选择客户类型", trigger: "change"}],
        payTypeArr: [{type: 'array',required: true, message: "请选择支付方式", trigger: "change"}],
        specifyQuotation:[{required: true, message: "请选择客户报价类型", trigger: "change"}],
        typeCodes:[{required: true, message: "请选择经营范围", trigger: "change"}],
        erpCode:[{required: true, message: "请检测客户编码", trigger: ['blur', 'change']}]
      },
      areaList:[], // 省市区
      searchProps: {
        label: "name",
        children: 'children',
        value: "areaId",
      },
      loading: false,
   /*   url:'',
      showViewer: false*/
    }
  },
  // components: { ElImageViewer },
  created() {
    let customerId = this.$route.query.customerId;
    let type = this.$route.query.type;
    this.customerId = customerId;
    if(customerId && type == 1) {
      this.getInfo(customerId);
    } else if(type == 2) {
      this.getQualificationInfo(customerId)
    }
    if(type) {
      this.type = type;
    }
  },
  destroyed() {
    bus.$off("updateCustomer");
  },
  methods:{
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
    // 选择区域
    changeArea(val){
      console.log(val)
      if(val) {
        this.getPartnerList(val[2])
      }
    },
    // 获取指定区域合伙人列表
    getPartnerList(areaCode	){
      API.partnerlistByArea({areaCode: areaCode}).then( (res) => {
        if(res.code == 0) {
          this.partnerList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // 选择合伙人
    changePartner(val){
      if(val) {
        this.partnerList.forEach((item,index) => {
          if(val == item.loginName) {
            this.formData.invitedCode = item.invitationCode;
            this.formData.partnerId = item.partnerId;
          }
        })
      }
    },
    handleCheckedCitiesChange(val){
      // console.log(val)
    },
    async getInfo(customerId){
      await this.getCustomerType();
      await this.getAreaList();
      API.getInfo({customerId: customerId}).then( (res) => {
        this.loadingTable = false;
        if(res.code == 0) {
          let form = res.data;
           if(form.customerTypeId == null || form.customerTypeId == '') {
             form.customerTypeId = ""
           }
          this.formData = form;
          this.$refs['ruleForm'].resetFields();
          let areaArr = res.data.areaArr;
          this.getPartnerList(areaArr[2])
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // 获取证件信息
    async getQualificationInfo(customerId){
      await this.getCustomerType();
      API.getQualificationInfo({customerId: customerId}).then( (res) => {
        this.loadingTable = false;
        if(res.code == 0) {
          let form = res.data;
          let typeCodes = [];
          let payTypes = res.data.payType;
          let list = res.data.certificatesList;
          let drugTypeList = res.data.drugTypeList;
          if(form.customerTypeId == null || form.customerTypeId == '' || form.customerTypeId == 0) {
            form.customerTypeId = 1
          }
          for(let i =0; i<list.length; i++) {
            list[i].date = [list[i].validityStart, list[i].validityEnd]
          }
          for(let j =0; j< drugTypeList.length; j++) {
            if(drugTypeList[j].isExist !=0 ) {
              typeCodes.push(drugTypeList[j].typeCode);
            }
          }
          if(payTypes) {
            form.payTypeArr = payTypes.split(",");
          }
          form.certificatesList = list;
          form.drugTypeList = drugTypeList;
          form.typeCodes = typeCodes;
          this.formData2 = form;
          console.log(this.formData2)
          this.$refs['ruleForm2'].resetFields();
        }
      })
    },
    // 输入邀请码查询合伙人
    getPartner(){
      if(this.formData.invitedCode != "" && this.formData.invitedCode != null) {
        API.getPartner({page:1,limit:100,invitationCode: this.formData.invitedCode}).then( (res) => {
          if(res.code == 0) {
            let data = res.data;
            if(data.length <= 0) {
              this.$message.error("邀请码错误，合伙人不存在");
              this.formData.partnerName = "";
              this.formData.invitedCode = "";
              return;
            }
            this.formData.partnerName = res.data[0].linkman;
            this.formData.partnerId = res.data[0].partnerId;
          } else {
            this.$message.error(res.msg);
          }
        })
      }
    },
    // 更改手机号
    changePhone(){
      this.canEdit = true;
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
    // 点击返回
    goBack(){
      this.closeSelectedTag();
      setTimeout(() =>{
        this.$router.push({
          path: '/customerManage'
        });
      })
    },
    // 驳回确认按钮
      sureRefuse(){
        if(this.remark == '') {
          this.$message.error("请填写驳回原因");
          return;
        }
        let params = this.formData2;
        // 将用户认证状态改为认证失败
        params.auditStatus = 2;
        params.remark = this.remark;
         if(params.areaArr) {
          params.area = params.areaArr[2];
        }
        API.verifyUser(params).then(res => {
          this.userLoading = false;
          if (res.code === 0) {
            this.refuseDialogVisible = false;
            this.$message.success("操作成功");
            bus.$emit("updateCustomer")
            this.closeSelectedTag();
            setTimeout(()=>{
              this.$router.push({
                path: '/customerManage'
              });
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      },
   /*   // 点击查看大图
      showBigImg (item) {
        // this.imgUrl = item.img
        // this.bigImgDialogVisible = true;
        if(item.img) {
          this.url = item.img;
          this.showViewer = true;
        }
      },
      // 关闭查看器
      closeViewer() {
        this.showViewer = false
      },*/
       // 关闭禁用弹框
      handleClose(){
        this.disableReason = '';
        this.remark = '';
        this.jyDialogVisible = false;
         this.refuseDialogVisible =false;
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
      // 关闭标签页
      closeSelectedTag(){
        let currentRoute = this.$route;
        bus.$emit('closeTag', currentRoute);
        bus.$emit('closeSelectedTag',currentRoute)
      },
      // 点击保存
      saveInfo(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if(this.formData.areaArr) {
              this.formData.area = this.formData.areaArr[2];
            }
            API.basicInfoUpdate(this.formData).then(res => {
              if (res.code === 0) {
                this.$message.success("操作成功");
                bus.$emit("updateCustomer");
                this.closeSelectedTag();
                setTimeout( ()=>{
                  this.$router.push({
                    path: '/customerManage'
                  });
                })
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      },
      // 点击审核通过
      checkPass(){
        this.$refs['ruleForm2'].validate((valid) => {
        if (valid) {
          if(this.formData2.erpCode == "" || this.formData2.erpCode == undefined){
            this.$message.warning("请检索客户编码!")
            return;
          }
          for(let i in this.formData2.certificatesList) {
            let obj =  this.formData2.certificatesList[i];
            if(obj.certificateCode == '' || obj.date == '') {
              this.$message.warning("请检查资质信息必填项!")
              return;
            }
          }
          //  0未认证，1已认证，2认证失败 3 认证中  将用户认证状态改为已认证
          this.formData2.auditStatus = 1;

          if(this.formData2.auditFlowStatus == 1) {
            this.formData2.auditFlowStatus = 2;
          }
          if(this.formData2.areaArr) {
            this.formData2.area = this.formData2.areaArr[2];
          }
          if(this.formData2.payTypeArr.length > 0) {
            this.formData2.payType = this.formData2.payTypeArr.join(",");
          }
          API.verifyUser(this.formData2).then(res => {
            this.userLoading = false;
            if (res.code === 0) {
              this.$message.success("操作成功");
              bus.$emit("updateCustomer");
              this.closeSelectedTag();
              setTimeout( ()=>{
                this.$router.push({
                  path: '/customerManage'
                });
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    goAnchor(selector,num) {
      var anchor = this.$el.querySelector(selector)
      document.documentElement.scrollTop = anchor.offsetTop;
      anchor.scrollIntoView(true);
      this.activeNum = num;
    },
    paperScroll(){
      var baseinfoTop = this.$el.querySelector("#baseinfo").offsetTop;
      var khinfoTop = this.$el.querySelector("#khinfo").offsetTop;
      var picinfoTop = this.$el.querySelector("#picinfo").offsetTop;
      var jyinfoTop = this.$el.querySelector("#jyinfo").offsetTop;
      let scrollTop = this.$refs.editContainer.scrollTop
      if(scrollTop > 0) {
        this.isHadShadow = true;
      } else {
        this.isHadShadow = false;
      }
      if(scrollTop <= baseinfoTop) {
        this.activeNum = 1;
      } else if(scrollTop > baseinfoTop && scrollTop < khinfoTop) {
        this.activeNum = 2;
      } else if(scrollTop >= khinfoTop && scrollTop < jyinfoTop) {
        this.activeNum = 3;
      } else {
        this.activeNum = 4;
      }

    },
    // 点击检索
    check(){
      this.loadingTable = true;
      API.checkTaxNumber({customerId: this.customerId}).then(res => {
        this.loadingTable = false;
        if(res.code == 0) {
          if(res.data) {
            this.$nextTick( () =>{
              this.formData2.erpCode = res.data.erpCode;
              this.$forceUpdate();
            })
          }
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // 点击复制按钮
    copy(data){
      let oInput = document.createElement('input');
      oInput.value = data;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      // console.log(oInput.value)
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message.success("已成功复制到剪切板")
      oInput.remove()
    },
  }
}
</script>
<style lang="scss">
.edit-customer{
  .page-title{
    padding: 15px 0;
    padding-right: 182px;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    .el-button{
      float: right;
      padding: 0;
      width: 68px;
      height: 30px;
      line-height: 30px;
      vertical-align: middle;
      .icon-fanhui{
        padding-right: 5px;
        font-size: 18px;
        vertical-align: middle;
      }
    }
  }
  .edit-container{
    height: 100%;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    transition: all 0.3s ease-in;
    &.hadShadow{
      box-shadow: 0 0 5px rgba(0,0,0,0.1) inset;
    }
    .info-box{
      margin-bottom: 20px;
      padding: 13px;
      border: 1px solid #ECEFF6;
      border-radius: 8px;
    }
    .el-form{
      width: 1680px;
      .el-form-item{
        margin-bottom: 20px;
      }
      .info-row{
        width: 900px;
      }
      .el-col{
        padding-right: 28px;
      }
      .el-input,.el-cascader--small{
        width: 100%;
      }
    }
    .info-list{
      overflow: hidden;
    }
    .info-item{
      float: left;
      margin-right: 20px;
      margin-bottom: 20px;
      padding: 18px;
      width: 415px;
      height: 225px;
      border: 1px solid #F5F5F5;
      box-sizing: border-box;
    &:nth-child(3n){
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
    .copy-btn{
      color:#2F9FFE;
      cursor: pointer;
      &:hover{
        text-decoration: underline;
      }
    }
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
  }
  .zj-status{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: block;
    margin-top: 10px;
    width: 100%;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 12px;
    &.status-normal{
      color: #67C23A;
      background: #ECF9E5;
    }
    &.status-outdate{
      color: #FFFFFF;
      background: #ACACAC;
    }
    &.status-outdate-soon{
      color: #FF6868;
      background: #FFF0F0;
    }
  }
  .customer-type-select{
    .el-input{
      width: 180px !important;
    }
  }
  .info-footer{
    padding-bottom: 20px;
    text-align: center;
    .el-button{
      padding: 0;
      width: 100px;
      height: 38px;
    }
    .el-button+.el-button{
      margin-left: 36px;
    }
  }
  .radio-reset{
    margin-top:10px;
    .el-radio__inner{
      width: 18px;
      height:18px;
    }
    .el-radio__input{
      &.is-checked{
        .el-radio__inner{
          background-color: #fff;
          &:after{
            width: 10px;
            height: 10px;
            background-color: #00AAEF;
          }
        }
      }
    }
  }
}
.float-menu{
  position: fixed;
  right: 90px;
  top: 50%;
  padding: 0 15px;
  width: 60px;
  background: #F5F7FA;
  transform: translateY(-50%);
  z-index: 100px;
  box-sizing: border-box;
  a{
    display: block;
    padding: 11px 0;
    line-height: 1.5;
    font-size:14px;
    color: #666666;
    text-align: center;
    text-decoration: none;
    &:hover,&.active{
      color: #2F9FFE;
    }
  }
}
  .big-img-box{
    text-align: center;
  }
  .change-phone-btn{
    border-radius: 13px;
  }
  .el-image-viewer__close{
    color:#fff;
  }
}
</style>
