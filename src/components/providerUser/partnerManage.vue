<template>
  <div class="supplier_manage">
    <div class="setting_button_bg">
      <div class="setting_button_tag button_add"
           v-if="$utils.checkButton('supplier:add')" @click="openDialog">
        <i class="iconfont icon-xinjian"></i><span>新建用户</span>
      </div>
      <!--  <div class="setting_button_tag button_delete"
             v-if="$utils.checkButton('supplier:delete')" @click="deleteUser">
          <i class="iconfont icon-del"></i> <span>删除</span>
        </div>-->
    </div>

    <!-- 搜索模块 start -->
    <div class="search_bg_wrap">
      <div class="search-box flex-row" v-if="isDisplaySearch">
        <p>
          <span class="search_hint">状&nbsp;&nbsp;&nbsp;&nbsp;态</span>
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
          <span class="search_hint">销售范围</span>
          <el-cascader size="mini" v-model="filters.saleAreaAuthorityList " clearable :options="searchCityData"
                       :props="searchProps" @change="searchChange"
                       collapse-tags></el-cascader>
        </p>
        <p>
          <span class="search_hint">邀请码</span>
          <el-input size="mini" v-model="filters.invitationCode" clearable placeholder="合伙人邀请码"
                    @keyup.enter.native="handleSearch"></el-input>
        </p>
        <p>
          <span class="search_hint">账&nbsp;&nbsp;&nbsp;&nbsp;号</span>
          <el-input size="mini" v-model="filters.value" clearable placeholder="登录账号/联系人/手机号"
                    @keyup.enter.native="handleSearch"></el-input>
        </p>
        <p>
          <span class="search_hint">创建时间</span>
          <el-date-picker
            v-model="createTime"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" :editable="false" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"></el-date-picker>
        </p>
        <p>
          <span class="search_hint">最后登录时间</span>
          <el-date-picker
            v-model="lastLoginTime"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" :editable="false" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"></el-date-picker>
        </p>
        <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询</el-button>
      </div>
      <a href="javascript:;" v-if="isDisplaySearch" class="opr-search-btn" @click="isDisplaySearch = false">收起<i
        class="iconfont icon-shouqi2"></i></a>
      <a href="javascript:;" v-if="!isDisplaySearch" class="opr-search-btn search-btn" @click="isDisplaySearch = true">查询<i
        class="iconfont icon-zhankai1"></i></a>
    </div>

    <!-- 搜索模块 end -->
    <div class=" wrap_main  flex-item">
      <!--:row-class-name="tableRowClassName"-->
      <!--@row-click="handleRowClick"-->
      <!--@selection-change="selectionUser"-->
      <el-table
        :data="table.data"
        border
        ref="table"
        height="100%"
      >
        <el-table-column label=" " type="index" width="40" align="center"></el-table-column>
        <!--<el-table-column type="selection" width="45" align="center"></el-table-column>-->
        <el-table-column label="操作" min-width="264px">
          <template slot-scope="scope">
            <div class="table_setting_button">
              <el-button type="primary" plain size="mini" v-if="$utils.checkButton('supplier:edit:partner')"
                         @click.stop="uploadSupplierData(scope.row)" :disabled="scope.row.parentPartnerId!=0">编辑
              </el-button>
              <el-button type="primary" plain size="mini" v-if="$utils.checkButton('supplier:calculation')"
                         @click.stop="openIncreaseInPriceDialog(scope.row)" :disabled="scope.row.parentPartnerId!=0">加价
              </el-button>
              <el-button :type="scope.row.status==0?'warning':'success'" plain size="mini"
                         v-if="$utils.checkButton('supplier:edit:status')"
                         @click.stop="updateStatus(scope.row, $event)">
                {{scope.row.status==0?'禁用':scope.row.status==9?'启用':'-'}}
              </el-button>
              <el-button plain size="mini" v-if="$utils.checkButton('supplier:reset:pwd')"
                         @click.stop="resetPwd(scope.row)">重置密码
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="60px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status=='0'?'启用':scope.row.status=='9'?'禁用':'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="登录账号" prop="loginName" min-width="105px"></el-table-column>
        <el-table-column label="联系人" prop="linkman" min-width="105px"></el-table-column>
        <el-table-column label="邀请码" prop="invitationCode" min-width="105px"></el-table-column>
        <el-table-column label="累计积分" prop="totalEarnings" min-width="105px"></el-table-column>
        <el-table-column label="手机号" prop="phone" min-width="125px"></el-table-column>
        <el-table-column label="代理费" prop="agencyFee" min-width="86px"></el-table-column>
        <el-table-column label="是否可见全品种" prop="name" min-width="335px">
          <template slot-scope="scope">
            <div class="flex-row">
              <span>【{{scope.row.commodityCoverage=='0'?'全部商品':scope.row.commodityCoverage=='1'?'指定商品':'-'}}】</span>
              <template>
                <p style="" class="flex-item text_overflow">
                  <span v-if="scope.row.commodityCoverage=='1'">已选</span>
                  <span v-if="scope.row.commodityCoverage=='0'">黑名单:</span>
                  <span style="color: #0680FD">{{scope.row.commodityNum}}</span>种商品，共<span
                  style="color: #0680FD">{{scope.row.supplierNum}}</span>家供应商
                </p>
                <span class="look_info" @click="uploadSupplierData(scope.row)">查看</span>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="销售范围" prop="salesAreaMessage" min-width="268px">
          <template slot-scope="scope">
            <div class="flex-row">
              <p class="flex-item text_overflow">{{scope.row.salesAreaMessage}}</p>
              <span class="look_info" @click="uploadSupplierData(scope.row)" v-if="scope.row.salesAreaMessage">查看</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="加价方式" prop="manufacturer" width="290px">
          <template slot-scope="scope">
            <div class="flex-row" v-if="scope.row.bidType">
              <p class="flex-item text_overflow">按{{scope.row.bidType=='1'
                ?'【价格类型】':scope.row.bidType=='2'
                ?'【指定商品】':scope.row.bidType=='3'?'【价格类型】&【指定商品】':''}} 报价</p>
              <span class="look_info" @click="openIncreaseInPriceDialog(scope.row)">查看</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="founder" align="center" width="100px"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" width="160px"></el-table-column>
        <el-table-column label="最后登录时间" prop="lastLoginTime" align="center" width="160px"></el-table-column>

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
      :title="updataSupplier?'编辑用户':'新建用户'"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible add_user"
      width="650px"
      :close-on-click-modal="false"
      :before-close="clearAddUser"
    >
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="70px" class="add_supplier_form">
        <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
          <!--<div class="dialog_nav"><span class="nav_line"></span><span>账号信息</span></div>-->
          <legend>账号信息</legend>
          <div class="flex-row" v-if="!updataSupplier">
            <el-form-item label="登录账号" class="flex-item" prop="loginName">
              <el-input v-model.trim="formData.loginName" clearable size="small"
                        :readonly="parentPartnerId!=0" @keyup.native="handleKeyUp"></el-input>
            </el-form-item>
            <el-form-item label="联系人" class="flex-item" prop="linkman">
              <el-input v-model.trim="formData.linkman" clearable size="small"
                        :readonly="parentPartnerId!=0"></el-input>
            </el-form-item>
          </div>
          <div class="flex-row">
            <el-form-item label="身份证号" autofocus class="flex-item" prop="idCard">
              <el-input v-model.trim="formData.idCard" clearable size="small" :readonly="parentPartnerId!=0"></el-input>
            </el-form-item>
            <el-form-item label="手机号" class="flex-item" prop="phone">
              <el-input v-model.trim="formData.phone" clearable maxlength="11" :readonly="parentPartnerId!=0"
                        size="small"></el-input>
            </el-form-item>
          </div>
          <div class="flex-row">
            <el-form-item label="状态" class="flex-item">
              <el-select v-model="formData.status" placeholder="请选择" size="small">
                <el-option label="启用" value="0"></el-option>
                <el-option label="禁用" value="9"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="代理费" class="flex-item">
              <el-input v-model.trim="formData.agencyFee" :readonly="parentPartnerId!=0" clearable
                        size="small"></el-input>
            </el-form-item>
          </div>

        </fieldset>
        <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
          <!--<div class="dialog_nav"><span class="nav_line"></span><span>权限配置</span></div>-->
          <legend>权限配置</legend>
          <div class="flex-row">
            <el-form-item label="商品范围" class="flex-item">
              <el-select v-model="formData.commodityCoverage" placeholder="请选择" @change="commodityCoverageChange"
                         size="small">
                <el-option label="全部商品" value="0"></el-option>
                <!--2019/11/20注释掉指定商品的选项，目前只注释了html的选项，逻辑是正常，没有注释的-->
                <!--<el-option label="指定商品" value="1"></el-option>-->
              </el-select>
            </el-form-item>
            <div class="flex-item" style="margin-bottom: 16px">
              <span class="look_info" style="margin-left: 15px" @click="openSelectCommodityDialog">{{formData.commodityCoverage=='0'?'黑名单':'白名单'}}</span>
              已选<span style="color: #0680FD">{{formData.commodityCoverage=='0'?commodityNum:commodityNum2}}</span>种商品，
              共<span style="color:#0680FD">{{formData.commodityCoverage=='0'?supplierNum:supplierNum2}}</span>家供应商
            </div>
          </div>
          <el-form-item label="销售范围">
            <div class="sale_area_authority_arrays">
              <el-cascader v-model="formData.saleAreaAuthorityArrays" :options="cityData"
                           :props="props" style="width: 100%;" size="mini"
                           :key="isCascader"
                           @change="saleAreaAuthorityChage"
                           :disabled="parentPartnerId!=0 || cityData.length<=0"></el-cascader>
            </div>
          </el-form-item>
        </fieldset>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <template v-if="parentPartnerId==0">
           <el-button @click="clearAddUser">取 消</el-button>
           <el-button type="primary" @click="addUserDataSubmit" :loading="loading">确 定</el-button>
        </template>
      </span>
    </el-dialog>

    <el-dialog
      title="选择商品"
      :visible.sync="selectCommodityDialog"
      class="cms_dialog_visible"
      width="900px"
      :close-on-click-modal="false"
      :before-close="clearSelectCommodity">
      <div class="su_commodity_title_bg">
        <p class="span_bg" @click="openAddCommodityDialog"><i class="iconfont icon-hao"></i><span>添加商品</span></p>
        <p class="span_bg" @click="delCommodity"><i class="iconfont icon-del"></i><span>删除商品</span></p>
        <p class="span_bg"><i class="iconfont icon-daoru"></i> <span>Excel导入</span></p>
        <div class="search_bg_wrap" style="float: right;margin-bottom: 15px">
          <el-input v-model="searchCommodity" clearable placeholder="编码/商品名/厂家"
                    style="width: 250px;margin-right:15px" size="small"
          ></el-input>
          <el-button size="small" type="warning" @click="searchCommodityValue"><i class="iconfont icon-chaxun"></i>查询
          </el-button>
        </div>
      </div>
      <el-table
        :data="table2.data"
        border
        height="300"
        ref="selectCommodityTable"
        :row-class-name="tableRowClassName2"
        @selection-change="selectionCommodityChange"
        @sort-change="tableDataSortChange"
        @row-click="rowClickCommodity" :default-sort="{prop: 'drugSkuCode', order: 'descending'}">
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column label="商品编码" prop="drugSkuCode" min-width="100" sortable="custom"></el-table-column>
        <el-table-column label="商品通用名" prop="drugCommonName" min-width="140" sortable="custom"></el-table-column>
        <el-table-column label="规格/单位" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.specifications}}/{{scope.row.packageUnit}}</span>
          </template>
        </el-table-column>
        <el-table-column label="中/大包装" prop="loginName" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.mediumPackage}}/{{scope.row.largePackage}}</span>
          </template>
        </el-table-column>
        <el-table-column label="厂家" prop="manufacturer" min-width="170" sortable="custom"></el-table-column>
        <el-table-column label="所属供应商" prop="suppliersList" min-width="180">
          <template slot-scope="scope">
            <el-checkbox v-model="item.selectFlag" v-for="(item,index) in scope.row.suppliersList" :key="index"
                         @change="selectChange(item,scope.row.drugSkuId)">
              {{item.supplierName}}
            </el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <div class="setting_pagination" v-if="table2.total>0">
        <el-pagination @current-change="handleCurrentChange2" @size-change="handleSizeChange2"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10, 50, 100, 150]"
                       small
                       :total="table2.total" :current-page.sync="table2.currentPage"
                       :page-size="table2.pageSize" v-if="table2.total>0">
        </el-pagination>
        <el-button type="primary" size="mini" plain>确 定</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="clearSelectCommodity">取 消</el-button>
           <el-button type="primary" @click="selectCommoditySubmit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加商品"
      :visible.sync="addCommodityDialog"
      class="cms_dialog_visible"
      width="900px"
      :close-on-click-modal="false"
      :before-close="closeAddCommodityDiaolg">
      <div class="search_bg_wrap" style="margin-bottom: 15px">
        <el-input v-model="search.value" clearable placeholder="编码/商品名/通用名"
                  style="width: 260px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
        ></el-input>
        <el-input v-model="search.manufacturer" clearable placeholder="厂家"
                  style="width: 260px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
        ></el-input>
        <el-input v-model="search.supplierName" clearable placeholder="供应商"
                  style="width: 260px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
        ></el-input>
        <el-input v-model="search.specifications" clearable placeholder="规格"
                  style="width: 260px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
        ></el-input>
        <el-input v-model="search.approveNumber" clearable placeholder="批准文号"
                  style="width: 260px;margin-right:15px" size="small" @keyup.enter.native="addSearchCommodityList"
        ></el-input>
        <el-button size="small" type="warning" @click="addSearchCommodityList"><i class="iconfont icon-chaxun"></i>查询
        </el-button>
      </div>
      <el-table
        :data="table4.data"
        border
        height="300"
        ref="multipleTable"
        style="width: 100%;"
        @selection-change="handleSelectionChange4" :row-key="getRowKeys" :row-class-name="tableRowClassName4"
        @row-click="rowClick" @sort-change="tableDataSortChange4"
        :default-sort="{prop: 'drugSkuCode', order: 'descending'}">
        <el-table-column type="selection" width="45" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column label="商品编码" prop="drugSkuCode" min-width="110" sortable="custom"></el-table-column>
        <el-table-column label="商品通用名" prop="drugCommonName" min-width="160" sortable="custom"></el-table-column>
        <el-table-column label="规格/单位" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.specifications}}/{{scope.row.packageUnit}}</span>
          </template>
        </el-table-column>
        <el-table-column label="中/大包装" prop="loginName" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.mediumPackage}}/{{scope.row.largePackage}}</span>
          </template>
        </el-table-column>
        <el-table-column label="厂家" prop="manufacturer" min-width="220" sortable="custom"></el-table-column>
        <!--   <el-table-column label="所属供应商" prop="loginName">
             <template slot-scope="scope">
               {{scope.row.supplierName}}
             </template>
           </el-table-column>-->
      </el-table>
      <div class="setting_pagination" v-if="table4.total>0">
        <el-pagination @current-change="handleCurrentChange4"
                       @size-change="handleSizeChange4"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10, 50, 100, 150]"
                       small
                       :total="table4.total" :current-page.sync="table4.currentPage"
                       :page-size="table4.pageSize"></el-pagination>
        <el-button type="primary" size="mini" plain>确 定</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="closeAddCommodityDiaolg">取 消</el-button>
           <el-button type="primary" @click="addCommoditySubmit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="加价"
      class="cms_dialog_visible"
      :visible.sync="increaseInPriceDialog"
      width="1000px"
      top="8vh"
      :close-on-click-modal="false">
      <span class="price_subtitle price_hint">价格优先级：指定商品报价>按可客户类型报价</span>
      <fieldset class="cms_dialog_content">
        <legend>客户类型报价</legend>
        <el-row class="row_nav_title row_perice">
          <el-col :span="8">单体价</el-col>
          <el-col :span="8">连锁价</el-col>
          <el-col :span="8">商业价</el-col>
        </el-row>
        <el-row class="row_perice">
          <el-col :span="8">
            <el-input v-model="priceTypeData.unitBidIncrement"
                      onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" size="mini"
                      style="width: 88px" suffix-icon="iconfont icon-baifenbi "
                      :readonly="parentPartnerId!=0"></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="priceTypeData.chainBidIncrement"
                      onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" size="mini"
                      style="width: 88px" suffix-icon="iconfont icon-baifenbi "
                      :readonly="parentPartnerId!=0"></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="priceTypeData.commercialBidIncrement"
                      onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')"
                      size="mini" style="width: 88px" suffix-icon="iconfont icon-baifenbi "
                      :readonly="parentPartnerId!=0"></el-input>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset class="cms_dialog_content" style="margin-top: 35px;padding-bottom: 0px">
        <legend>指定商品报价</legend>
        <div class="su_commodity_title_bg">
          <p class="span_bg" @click="openAddCommodityDialog2"><i class="iconfont icon-hao"></i><span>添加商品</span></p>
          <p class="span_bg" @click="deleteCommodtiyList"><i class="iconfont icon-del"></i><span>删除商品</span></p>
          <p class="span_bg"><i class="iconfont icon-daoru"></i> <span>Excel导入</span></p>
          <div class="search_bg_wrap" style="float: right;margin-bottom: 15px">
            <el-input v-model="searcIncreaseInPriceCommodity" clearable placeholder="编码/商品名/厂家"
                      style="width: 250px;margin-right:15px" size="small" :readonly="parentPartnerId!=0"></el-input>
            <el-button size="small" type="warning" @click="queryCommodityPriceList"><i class="iconfont icon-chaxun"></i>查询
            </el-button>
          </div>
        </div>
        <div style="width: 920px">
          <el-table
            :data="table3.data"
            border
            height="300"
            ref="priceTable"
            class="my_table"
            style="width: 100%" :row-class-name="tableRowClassName3" @selection-change="selectionCommodityChange3"
            @row-click="rowClick3" @sort-change="tableDataSortChange3"
            :default-sort="{prop: 'drugSkuCode', order: 'descending'}">
            <el-table-column label=" " type="index" width="40" align="center"></el-table-column>
            <el-table-column type="selection" width="45" align="center"></el-table-column>
            <el-table-column label="单体价" width="120">
              <template slot-scope="scope">
                <!--onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"-->
                <el-input v-model="scope.row.unitBidIncrement"
                          onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')"
                          suffix-icon="iconfont icon-baifenbi "
                          size="mini"
                          @change="isPriceChange=true"
                          style="width: 80px;"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="连锁价" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.chainBidIncrement"
                          onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')"
                          suffix-icon="iconfont icon-baifenbi "
                          size="mini"
                          @change="isPriceChange=true"
                          style="width: 80px;"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="商业价" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.commercialBidIncrement"
                          onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')"
                          suffix-icon="iconfont icon-baifenbi "
                          size="mini"
                          @change="isPriceChange=true"
                          style="width: 80px;"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="商品编码" prop="drugSkuCode" min-width="100" sortable="custom"></el-table-column>
            <el-table-column label="商品通用名" prop="drugCommonName" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="specifications" label="规格" width="120px"></el-table-column>
            <el-table-column label="厂家" prop="manufacturer" min-width="200" sortable="custom"></el-table-column>
            <el-table-column label="批准文号" prop="approveNumber" min-width="150"></el-table-column>
            <el-table-column label="所属供应商" min-width="240">
              <template slot-scope="scope">
                <el-checkbox v-model="item.selectFlag" v-for="(item,index) in scope.row.suppliersList" :key="index"
                             @change="selectPriceChange(item,scope.row.drugSkuId)">
                  {{item.supplierName}}
                </el-checkbox>
              </template>
            </el-table-column>


          </el-table>
        </div>
        <div class="setting_pagination" v-if="table3.total>0 ">
          <el-pagination @current-change="handleCurrentChange3"
                         @size-change="handleSizeChange3"
                         layout="total, sizes, prev, pager, next, jumper"
                         :page-sizes="[10, 50, 100, 150]"
                         small
                         :total="table3.total" :current-page.sync="table3.currentPage"
                         :page-size="table3.pageSize"></el-pagination>
          <el-button type="primary" size="mini" plain>确 定</el-button>
        </div>
      </fieldset>
      <span slot="footer" class="dialog-footer">
        <template v-if="parentPartnerId==0">
          <el-button @click="closeIncreaseInPriceDialog">取 消</el-button>
           <el-button type="primary" @click="priceSubmit" :loading="loading">确 定</el-button>
        </template>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import API from '../../api/api_supplier_manage'

  export default {
    name: "partnerManage",
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
          // let reg = /(^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$)|(^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)/;
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      }
      return {
        isDisplaySearch: true,
        filters: {
          status: "",
          value: "",
          invitationCode: "",
          saleAreaAuthorityList: []
        },
        updataSupplier: false,
        createTime: null,
        lastLoginTime: null,
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        }, //合伙人列表
        table2: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1,
          sort: "drugSkuCode",//排序字段
          order: "descending",//排序方式
        }, //选择商品列表
        table3: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1,
          sort: "drugSkuCode",//排序字段
          order: "descending",//排序方式
        },//商品加价列表
        table4: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1,
          sort: "drugSkuCode",//排序字段
          order: "descending",//排序方式
        },//添加商品的列表
        statusData: [{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '启用'
        }, {
          value: '9',
          label: '禁用',
          disabled: true
        }],
        dialogVisible: false,
        selectCommodityDialog: false,
        increaseInPriceDialog: false,
        addCommodityDialog: false,
        formData: {
          loginName: "",
          linkman: "",
          idCard: "",
          phone: "",
          agencyFee: "",
          status: '0',
          commodityCoverage: '0',
          saleAreaAuthorityArrays: [],
        },
        rules: {
          loginName: [{required: true, message: "请输入登录账号", trigger: "blur"}],
          linkman: [{required: true, message: "请输入姓名", trigger: "blur"}],
          idCard: [
            {required: true, message: '请输入身份证号', trigger: 'blur'},
            {
              pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
              message: '你的身份证格式不正确'
            }
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '你的手机号格式不正确'
            }
          ],
          //  phone: [{required: true, validator: checkPhone, trigger: "blur"}],
          // saleAreaAuthorityArrays: [{required: true, message: "请选择销售范围", trigger: "change"}],
        },
        searchCommodity: "", //选择商品的搜索条件
        multipleSelectionCommodity: [],
        search: {
          value: "",
          manufacturer: "",
          supplierName: "",
          specifications: "",
          approveNumber: ""
        },
        priceStatus: '1',//选择加价的类型  1按价格类型报价  2指定商品报价
        priceTypeData: {
          unitBidIncrement: 0, //单体价
          chainBidIncrement: 0, //连锁价
          commercialBidIncrement: 0 //商业价
        },
        checkAllCommodity: false,
        checkedCommodity: [],
        searchCityData: [],
        cityData: [],
        props: {
          label: "name",
          children: 'children',
          value: "areaId",
          multiple: true,
        },
        searchProps: {
          label: "name",
          children: 'children',
          value: "areaId",
          multiple: true
        },

        commodityNum: 0,//选择的黑名单商品数量
        supplierNum: 0,//选择的黑名单供应商数量
        commodityNum2: 0,//选择的白名单商品数量
        supplierNum2: 0,//选择的白名单供应商数量
        multipleAddCommodity: [], //多选的添加商品
        multipleUserLis: [],
        partnerId: -1,//合伙人id
        tempCommodityId: "",//选择商品临时表id
        blacklistTempCommodityId: "",//黑名单商品临时表id
        whitelistTempCommodityId: "",//白名单商品临时表id
        searcIncreaseInPriceCommodity: "",//商品加价的搜索条件
        tempPriceId: "",//加价的价格临时表
        isPriceChange: false, //商品价格是否被改变  ture 是 fasle 否
        saleAreaAuthorityUp: false,//合伙人销售范围是否更改
        commodityAuthorityUp: false,//合伙人商品范围是否更改
        loading: false,
        parentPartnerId: 0,//是否可以对合伙人进行编辑、加价  此需求是如果不是登录人（超级管理员）新建的合伙人不允许被编辑
        isCascader: ""
      }
    },
    created() {
      this.initData();
      this.getSysArea();
    },
    methods: {
      initData() {
        let param = {
          status: this.filters.status,
          value: this.filters.value,
          invitationCode: this.filters.invitationCode
        };
        let data = [];
        this.filters.saleAreaAuthorityList.forEach(item => {
          data.push(item[item.length - 1])
        })
        param.areaId = data;
        if (this.createTime && this.createTime.length >= 2) {
          param.createTimeStart = this.createTime[0];
          param.createTimeEnd = this.createTime[1];
        }
        if (this.lastLoginTime && this.lastLoginTime.length >= 2) {
          param.lastLoginTimeStart = this.lastLoginTime[0];
          param.lastLoginTimeEnd = this.lastLoginTime[1];
        }
        param.limit = this.table.pageSize;
        param.page = this.table.currentPage;
        API.list(param).then(res => {
          if (res.code == 0) {
            this.table.data = res.data.rows;
            this.table.total = res.data.total;
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      clearAddUser() {
        this.loading = false;
        this.commodityAuthorityUp = false;
        this.saleAreaAuthorityUp = false;
        this.tempCommodityId = "";
        this.tempPriceId = "";
        this.commodityNum = 0;
        this.supplierNum = 0;
        this.commodityNum2 = 0;
        this.supplierNum2 = 0;
        this.dialogVisible = false;
        this.parentPartnerId = 0;
        this.formData = {
          loginName: "",
          linkman: "",
          idCard: "",
          phone: "",
          agencyFee: "",
          status: '0',
          commodityCoverage: '0',
          saleAreaAuthorityArrays: [],
        };
        this.isCascader = Math.random();
        this.cityData = [];
        this.$refs['ruleForm'].resetFields();
      },

      //重置密码
      resetPwd(val) {
        this.$confirm('确定重置密码？', '提示', {
          type: 'warning'
        }).then(() => {
          API.resetPassword({partnerId: val.partnerId}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
        });

      },
      //监控合伙人销售范围是否被改变
      saleAreaAuthorityChage(val) {
        if (this.updataSupplier) {
          this.saleAreaAuthorityUp = true;
        }

      },
      //新建用户数据提交
      addUserDataSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let param = Object.assign({}, this.formData);
            let network = null;
            param.tempCommodityId = this.tempCommodityId;
            if (this.updataSupplier) {
              param.saleAreaAuthorityUp = this.saleAreaAuthorityUp;
              param.commodityAuthorityUp = this.commodityAuthorityUp;
              network = API.editPartner(param);
            } else {

              network = API.add(param);
            }
            this.loading = true;
            network.then(res => {
              this.loading = false;
              if (res.code == 0) {
                this.$message.success(res.msg)
                this.tempCommodityId = "";
                this.clearAddUser();
                this.initData();
              } else {
                this.$message.error(res.msg);
              }
            }).catch(() => {
              this.loading = false;
            })
          }
        });


      },
      /*  //勾选的合伙人 2019 -9-25
      selectionUser(val) {
        this.multipleUserLis = val;
      },
      //点击行触发，选中或不选中复选框
      handleRowClick(row, column, event) {
        this.$refs.table.toggleRowSelection(row);
      },
      tableRowClassName({row, rowIndex}) {
        let arr = this.multipleUserLis;
        for (let i = 0; i < arr.length; i++) {
          if (row.partnerId === arr[i].partnerId) {
            return 'rowStyle'
          }
        }
      },
      //删除合伙人
    deleteUser() {
        if (!this.multipleUserLis || this.multipleUserLis.length <= 0) {
          this.$message.warning("请选择准备删除的合伙人");
          return;
        }
        this.$confirm('确认删除合伙人？', '提示', {
          type: 'warning'
        }).then(() => {
          let item = [];
          this.multipleUserLis.forEach(res => {
            item.push(res.partnerId)
          })
          API.deleteUser({partnerIds: item.toString()}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg)
              this.initData();
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
        });
      },*/
      //修改合伙人的状态 禁用/启用
      updateStatus(item, event) {
        this.$confirm(item.status == '0' ? '确定禁用合伙人？' : '确定启用合伙人？', '提示', {
          type: 'warning'
        }).then(() => {
          API.updateStatus({partnerId: item.partnerId, status: item.status == '0' ? '9' : '0'}).then(res => {
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
      //选择禁销范围的搜索条件
      searchChange() {
        this.table.currentPage = 1;
        this.initData();
      },
      //合伙人查询
      handleSearch() {
        this.table.currentPage = 1;
        this.initData();
      },
      getReviewData(status) {
        this.priceStatus = status;
      },


      //打开新建用户
      async openDialog() {
        await  this.getSysAreaTreeByPartnerId(0)
        this.updataSupplier = false;
        this.dialogVisible = true;
        this.partnerId = -1;
        this.tempCommodityId = "";
        this.tempPriceId = "";
        this.parentPartnerId = 0;
      },
      //编辑合伙人
      async uploadSupplierData(item) {
        this.parentPartnerId = item.parentPartnerId;
        this.commodityAuthorityUp = false;
        this.saleAreaAuthorityUp = false;
        this.updataSupplier = true;
        this.partnerId = item.partnerId;
        this.formData = Object.assign({}, item);
        this.formData.status = this.formData.status + "";
        this.formData.commodityCoverage = this.formData.commodityCoverage + "";
        if (item.commodityCoverage == '0') {
          this.commodityNum = item.commodityNum;
          this.supplierNum = item.supplierNum;
        } else {
          this.commodityNum2 = item.commodityNum;
          this.supplierNum2 = item.supplierNum;
        }
        /*      API.getCommodityAndParterNum({partnerId: item.partnerId}).then(res => {
                if (res.code == 0) {
                  if (item.commodityCoverage == '0') {
                    this.commodityNum = res.data.commodityNum;
                    this.supplierNum = res.data.supplierNum;
                  } else {
                    this.commodityNum2 = res.data.commodityNum;
                    this.supplierNum2 = res.data.supplierNum;
                  }
                }
              })*/
        await this.getSysAreaTreeByPartnerId(item.partnerId);
        this.dialogVisible = true;
      },
      getSysArea() {
        //获取搜索时禁销范围
        this.searchCityData = [];
        API.getSysArea().then(res => {
          if (res.code == 0) {
            this.searchCityData = this.$utils.getTreeData(res.data);
          }
        })
      },
      //获取禁销范围  新增用户和编辑用户
      getSysAreaTreeByPartnerId(id) {
        return new Promise((resolve, reject) => {
          let loadingInstance = this.$loading({
            lock: true,
            text: ' ',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
          })
          API.getSysAreaTreeByPartnerId({partnerId: id}).then(res => {
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close();
            });
            if (res.code == 0) {
              this.cityData = this.$utils.getTreeData2(res.data.treeSysAreaList);
              this.formData.saleAreaAuthorityArrays = res.data.sysAreaSelectByPartnerArrays;
              resolve();
            } else {
              reject();
            }
          }).catch(() => {
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close();
            });
          })
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
      //打开选择商品弹出框
      openSelectCommodityDialog() {
        if (this.parentPartnerId != 0) {
          this.$message.error("无权限编辑合伙人")
          return;
        }
        this.getCommodityTempData(1);

      },
      //点击选择商品行
      rowClickCommodity(row) {
        this.$refs.selectCommodityTable.toggleRowSelection(row)
      },
      //选择商品 多选
      selectionCommodityChange(val) {
        this.multipleSelectionCommodity = val;
      },
      //排序
      tableDataSortChange(column) {
        this.table2.sort = column.prop;
        this.table2.order = column.order;
        this.getCommodityTempData(0);
      },
      tableRowClassName2({row, rowIndex}) {
        let arr = this.multipleSelectionCommodity;
        for (let i = 0; i < arr.length; i++) {
          if (row.drugSkuCode === arr[i].drugSkuCode) {
            return 'rowStyle'
          }
        }
      },
      //新建/编辑用户时，选择黑、白名单商品列表
      getCommodityTempData(isOpenWindow) {
        let params = {
          sort: this.table2.sort,
          order: this.table2.order == 'descending' ? 'desc' : '',
          partnerId: this.partnerId,
          tempCommodityId: this.tempCommodityId,
          status: this.formData.commodityCoverage,
          value: this.searchCommodity,
          limit: this.table2.pageSize,
          page: this.table2.currentPage,
          isOpenWindow,//是否是点击黑白按钮  1 是 0否
        };
        API.getCommodityTempData(params).then(res => {
          if (res.code == 0) {
            if (isOpenWindow == 1) {
              this.selectCommodityDialog = true;
            }
            this.table2.data = res.data.pageUtils.rows;
            this.table2.total = res.data.pageUtils.total;
            if (this.formData.commodityCoverage == '0') {
              this.blacklistTempCommodityId = res.data.tempCommodityId;
              // console.log("黑名单的临时表id" + this.blacklistTempCommodityId)
            } else {
              this.whitelistTempCommodityId = res.data.tempCommodityId;
              // console.log("白名单的临时表id" + this.whitelistTempCommodityId)
            }
            this.tempCommodityId = res.data.tempCommodityId;
          } else {
            this.$message.error(res.msg)
          }

        })
      },
      //商品范围选择变化
      commodityCoverageChange(val) {
        if (val == '0') {
          this.tempCommodityId = this.blacklistTempCommodityId;
        } else {
          this.tempCommodityId = this.whitelistTempCommodityId;
        }
      },
      //选择商品查询
      searchCommodityValue() {
        /*  this.table2.data = this.table2.tempData.filter(data => !this.searchCommodity
            || data.commodityCode.toLowerCase().includes(this.searchCommodity.toLowerCase())
            || data.drugName.toLowerCase().includes(this.searchCommodity.toLowerCase())
            || data.manufacturer.toLowerCase().includes(this.searchCommodity.toLowerCase()));
          this.table2.currentPage = 1;
          this.table2.total = this.table2.data.length;*/

        this.table2.currentPage = 1;
        this.getCommodityTempData(0);

      },
      //选择商品分页
      handleCurrentChange2(val) {
        this.table2.currentPage = val;
        this.getCommodityTempData(0);
      },
      handleSizeChange2(val) {
        this.table2.pageSize = val;
        this.getCommodityTempData(0);
      },

      selectChange(item, drugSkuId) {
        let param = {
          tempCommodityId: this.tempCommodityId,
          drugSkuId: drugSkuId,
          supplierId: item.supplierId,
          selectFlag: item.selectFlag
        }
        API.upCommodityTempData(param).then(res => {
          if (res.code == 0) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //保存选择的商品
      selectCommoditySubmit() {
        //编辑合伙人的时候  修改了商品范围  新增合伙人的时候没commodityAuthorityUp约束
        if (this.updataSupplier) {
          this.commodityAuthorityUp = true;
        }
        this.loading = true;
        API.saveCommodityTempOperation({tempCommodityId: this.tempCommodityId}).then(res => {
          this.loading = false;
          if (res.code == 0) {
            if (this.formData.commodityCoverage == '0') {
              this.commodityNum = res.data.commodityNum;
              this.supplierNum = res.data.supplierNum;
            } else {
              this.commodityNum2 = res.data.commodityNum;
              this.supplierNum2 = res.data.supplierNum;
            }
            this.clearData();

            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      //关闭选择商品的弹出框
      clearSelectCommodity() {
        this.loading = true;
        API.cancelCommodityTempOperation({tempCommodityId: this.tempCommodityId}).then(res => {
          if (res.code == 0) {
            this.clearData();
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      clearData() {
        this.loading = false;
        this.selectCommodityDialog = false;
        this.searchCommodity = "";
        this.table2 = {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        };
      },
      //删除选择的商品
      delCommodity() {
        if (this.multipleSelectionCommodity && this.multipleSelectionCommodity.length > 0) {
          this.$confirm('确定删除商品', '提示', {
            type: 'warning'
          }).then(async () => {
            let data = []
            this.multipleSelectionCommodity.forEach(item => {
              data.push(item.drugSkuId)
            })
            this.delCommodityTempData(data)
          }).catch(() => {
          });

        } else {
          this.$message.error("请选择要删除的商品")
        }
      },
      //删除选择商品 联网
      delCommodityTempData(drugSkuIds) {
        let param = {
          tempCommodityId: this.tempCommodityId,
          drugSkuIds: drugSkuIds
        }
        API.delCommodityTempData(param).then(res => {
          if (res.code == 0) {
            this.$message.success(res.msg);
            this.getCommodityTempData(0);
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      //选择商品时查询全部商品列表
      queryCommodityList() {
        let param = {
          sort: this.table4.sort,
          order: this.table4.order == 'descending' ? 'desc' : '',
          value: this.search.value,
          manufacturer: this.search.manufacturer,
          supplierName: this.search.supplierName,
          specifications: this.search.specifications,
          approveNumber: this.search.approveNumber,
          limit: this.table4.pageSize,
          page: this.table4.currentPage,
          tempCommodityId: this.tempCommodityId,
          partnerId: this.partnerId
        }
        API.queryCommodityList(param).then(res => {
          if (res.code == 0) {
            this.table4.data = res.data.rows;
            this.table4.total = res.data.total;
          }

        })
      },
      //从选择商品中打开添加商品的dialog
      openAddCommodityDialog() {
        this.addCommodityDialog = true;
        this.tempPriceId = "";//表示从选择商品中点击添加商品过来的
        // this.queryCommodityList();
      },
      addSearchCommodityList() {
        if (!this.search.value && !this.search.manufacturer && !this.search.supplierName && !this.search.specifications && !this.search.approveNumber) {
          this.$message.error("请输入搜索条件")
          return;
        }
        this.table4.currentPage = 1;
        //this.tempPriceId=="",表示从新建合伙人中选择商品过来的，不为空表示从商品加价列表过来的
        if (!this.tempPriceId && this.tempCommodityId) {
          this.queryCommodityList();
        } else {
          this.queryPartnerCommodityList();
        }
      },
      //添加商品分页
      handleCurrentChange4(val) {
        this.table4.currentPage = val;
        //this.tempPriceId=="",表示从新建合伙人中选择商品过来的，不为空表示从商品加价列表过来的
        if (!this.tempPriceId && this.tempCommodityId) {
          this.queryCommodityList();
        } else {
          this.queryPartnerCommodityList();
        }
      },
      handleSizeChange4(val) {
        this.table4.pageSize = val;
        if (!this.tempPriceId && this.tempCommodityId) {
          this.queryCommodityList();
        } else {
          this.queryPartnerCommodityList();
        }
      },
      //点击添加商品行
      rowClick(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      getRowKeys(row) {//记录每行的key值
        let item = row.drugSkuCode + row.drugId;
        return item;
      },
      handleSelectionChange4(val) {
        this.multipleAddCommodity = val;
      },
      //排序
      tableDataSortChange4(column) {
        this.table4.sort = column.prop;
        this.table4.order = column.order;
        if (!this.tempPriceId && this.tempCommodityId) {
          this.queryCommodityList();
        } else {
          this.queryPartnerCommodityList();
        }
      },
      tableRowClassName4({row, rowIndex}) {
        let arr = this.multipleAddCommodity;
        for (let i = 0; i < arr.length; i++) {
          if (row.drugSkuCode === arr[i].drugSkuCode) {
            return 'rowStyle'
          }
        }
      },
      //关闭添加商品弹出框
      closeAddCommodityDiaolg() {
        this.loading = false;
        this.addCommodityDialog = false;
        this.multipleAddCommodity = [];
        this.$refs.multipleTable.clearSelection();
        this.table4 = {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        };
        this.search = {
          value: "",
          manufacturer: "",
          supplierName: "",
          specifications: "",
          approveNumber: ""
        }
      },
      //确认勾选添加商品
      addCommoditySubmit() {
        if (!this.multipleAddCommodity || this.multipleAddCommodity.length <= 0) {
          this.$message.error("请勾选添加的商品！")
          return;
        }
        this.loading = true;
        //this.tempPriceId=="",表示从新建合伙人中选择商品过来的，不为空表示从商品加价列表过来的
        if (this.tempPriceId && !this.tempCommodityId) { //商品加价商品添加
          let data = []
          this.multipleAddCommodity.forEach(item => {
            data.push(item.drugSkuId)
          })
          let param = {
            drugSkuIds: data,
            tempPriceId: this.tempPriceId,
            partnerId: this.partnerId,
            commodityCoverage: 0,//不知道是什么，后台要求传的
          }
          API.chooseCommodity(param).then(res => {
            this.loading = false;
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.closeAddCommodityDiaolg(); //关闭弹框
              //查询合伙人商品加价列表
              this.queryCommodityPriceList();
            } else {
              this.$message.error(res.msg)
            }
          }).catch(() => {
            this.loading = false;
          })
          this.closeAddCommodityDiaolg();
        } else if (!this.tempPriceId && this.tempCommodityId) {
          let data = []
          this.multipleAddCommodity.forEach(item => {
            data.push(item.drugSkuId)
          })
          let param = {
            tempCommodityId: this.tempCommodityId,
            drugSkuIds: data
          }
          API.addCommodityTempData(param).then(res => {
            this.loading = false;
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.closeAddCommodityDiaolg(); //关闭弹框
              this.getCommodityTempData(0); //重新获取黑、白名单数据
            } else {
              this.$message.error(res.msg)
            }
          }).catch(() => {
            this.loading = false;
          })
        }
      },
      //打开加价弹出框
      openIncreaseInPriceDialog(item) {
        // this.increaseInPriceDialog = true;
        this.parentPartnerId = item.parentPartnerId;
        this.partnerId = item.partnerId;
        this.tempCommodityId = "";
        this.priceStatus = '1';
        this.isPriceChange = false;
        this.getPrice();

      },
      //加价点击行
      rowClick3(row, column, event) {
        // this.$refs.priceTable.toggleRowSelection(row);
      },
      //选择商品 加价多选
      selectionCommodityChange3(val) {
        this.checkedCommodity = val;
      },
      //排序
      tableDataSortChange3(column) {
        this.table3.sort = column.prop;
        this.table3.order = column.order;
        if (this.isPriceChange) {
          this.$confirm('检测有修改商品价格，是否保存？', '提示', {
            type: 'warning'
          }).then(async () => {
            await this.beforehand();
            this.isPriceChange = false;
            this.checkedCommodity = [];//全选的数据清空
            this.checkAllCommodity = false;
            this.queryCommodityPriceList();
          }).catch(() => {
            // this.table3.currentPage = this.table3.currentPage - 1;
          });
        } else {
          this.checkedCommodity = [];//全选的数据清空
          this.checkAllCommodity = false;
          this.queryCommodityPriceList();
        }
      },
      tableRowClassName3({row, rowIndex}) {
        let arr = this.checkedCommodity;
        for (let i = 0; i < arr.length; i++) {
          if (row.commodityId === arr[i].commodityId) {
            return 'rowStyle'
          }
        }
      },
      //获取合伙人根据类型加价
      getPrice() {
        API.getPrice({partnerId: this.partnerId}).then(res => {
          if (res.code == 0) {
            this.increaseInPriceDialog = true;
            //价格类型加价
            this.priceTypeData = {
              unitBidIncrement: res.data.unitBidIncrement,
              chainBidIncrement: res.data.chainBidIncrement,
              commercialBidIncrement: res.data.commercialBidIncrement,
            };
            this.tempPriceId = res.data.tempPriceId;
            //查询合伙人商品加价列表
            this.queryCommodityPriceList();
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //根据商品加价的列表查询
      increaseInPriceSearch() {
        this.table3.currentPage = 1;
        this.queryPartnerCommodityList();
      },
      //商品列表加价的分页
      handleCurrentChange3(val) {
        this.table3.currentPage = this.table3.currentPage - 1; //因为在等待弹框的时候。 this.table3.currentPage会自动加1
        if (this.isPriceChange) {
          this.$confirm('检测有修改商品价格，是否保存？', '提示', {
            type: 'warning'
          }).then(async () => {
            await this.beforehand();
            this.isPriceChange = false;
            this.table3.currentPage = val;
            this.checkedCommodity = [];//全选的数据清空
            this.checkAllCommodity = false;
            this.queryCommodityPriceList();
          }).catch(() => {
            // this.table3.currentPage = this.table3.currentPage - 1;
          });
        } else {
          this.table3.currentPage = val;
          this.checkedCommodity = [];//全选的数据清空
          this.checkAllCommodity = false;
          this.queryCommodityPriceList();
        }

      },
      selectPriceChange(item, drugSkuId) {
        let param = {
          drugSkuId: drugSkuId,
          supplierId: item.supplierId,
          selectFlag: item.selectFlag,
          tempPriceId: this.tempPriceId
        }
        API.upPriceTempData(param).then(res => {
          if (res.code == 0) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleSizeChange3(val) {

        if (this.isPriceChange) {
          this.$confirm('检测有修改商品价格，是否保存？', '提示', {
            type: 'warning'
          }).then(async () => {
            await this.beforehand();
            this.isPriceChange = false;
            this.table3.pageSize = val;
            this.checkedCommodity = [];//全选的数据清空
            this.checkAllCommodity = false;
            this.queryCommodityPriceList();
          }).catch(() => {
            // this.table3.currentPage = this.table3.currentPage - 1;
          });
        } else {
          this.table3.pageSize = val;
          this.checkedCommodity = [];//全选的数据清空
          this.checkAllCommodity = false;
          this.queryCommodityPriceList();
        }
      },
      //预保存商品加价信息
      beforehand() {
        return new Promise((resolve, reject) => {
          for (let i = 0; i < this.table3.data.length; i++) {
            let item = this.table3.data[i];
            if (!item.unitBidIncrement || !item.chainBidIncrement || !item.commercialBidIncrement
              || item.unitBidIncrement <= 0 || item.chainBidIncrement <= 0 || item.commercialBidIncrement <= 0) {
              let data = "商品价格不允许为空！";
              this.$message.error(data);
              return reject(data);
            }
          }
          let param = {
            list: this.table3.data,
            tempPriceId: this.tempPriceId
          }
          API.beforehand(param).then(res => {
            if (res.code == 0) {
              return resolve();
            } else {
              this.$message.error(res.msg);
              return reject(res.msg)
            }
          })
        })
      },
      //查询合伙人商品加价列表
      queryCommodityPriceList() {
        if (this.parentPartnerId != 0) {
          return;
        }
        let param = {
          sort: this.table3.sort,
          order: this.table3.order == 'descending' ? 'desc' : '',
          tempPriceId: this.tempPriceId,
          limit: this.table3.pageSize,
          page: this.table3.currentPage,
          value: this.searcIncreaseInPriceCommodity,
          partnerId: this.partnerId
        }
        API.commodityList(param).then(res => {
          if (res.code == 0) {
            this.table3.data = res.data.rows;
            this.table3.total = res.data.total;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //从商品加价中打开添加商品的dialog
      openAddCommodityDialog2() {
        if (this.parentPartnerId != 0) {
          return;
        }
        if (this.isPriceChange) {
          this.$confirm('检测有修改商品价格，是否保存？', '提示', {
            type: 'warning'
          }).then(async () => {
            await this.beforehand();
            this.isPriceChange = false;
            this.addCommodityDialog = true;
            this.queryPartnerCommodityList();
          }).catch(() => {
          });
        } else {
          this.addCommodityDialog = true;
          this.queryPartnerCommodityList();
        }
      },
      //添加商品时查询合伙人可见商品列表
      queryPartnerCommodityList() {
        let param = {
          sort: this.table4.sort,
          order: this.table4.order == 'descending' ? 'desc' : '',
          value: this.search.value,
          manufacturer: this.search.manufacturer,
          supplierName: this.search.supplierName,
          specifications: this.search.specifications,
          approveNumber: this.search.approveNumber,
          limit: this.table4.pageSize,
          page: this.table4.currentPage,
          tempPriceId: this.tempPriceId,
          partnerId: this.partnerId
        }
        API.queryPartnerCommodityList(param).then(res => {
          if (res.code == 0) {
            this.table4.data = res.data.rows;
            this.table4.total = res.data.total;
          }
        })
      },
      //删除商品加价中的商品
      deleteCommodtiyList() {
        if (this.parentPartnerId != 0) {
          return;
        }
        if (this.checkedCommodity && this.checkedCommodity.length > 0) {
          this.$confirm('确定删除商品', '提示', {
            type: 'warning'
          }).then(async () => {
            let data = []
            this.checkedCommodity.forEach(item => {
              data.push(item.drugSkuId)
            })
            this.deleteCommodity(data)
          }).catch(() => {
          });
        } else {
          this.$message.error("请选择要删除的商品")
        }
      },
      //删除加价商品 联网
      deleteCommodity(drugSkuIds) {
        let param = {
          tempPriceId: this.tempPriceId,
          drugSkuIds: drugSkuIds
        }
        API.deleteCommodity(param).then(res => {
          if (res.code == 0) {
            this.$message.success(res.msg);
            this.queryCommodityPriceList();
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      //关闭加价弹出框
      closeIncreaseInPriceDialog() {
        this.loading = false;
        this.increaseInPriceDialog = false;
        this.parentPartnerId = 0;
        this.searcIncreaseInPriceCommodity = "";
        this.tempPriceId = "";
        this.priceStatus = '1';
        this.table3 = {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        }
      },
      //加价的数据提交
      priceSubmit() {
        let unitBidIncrement = parseInt(this.priceTypeData.unitBidIncrement);
        let chainBidIncrement = parseInt(this.priceTypeData.chainBidIncrement);
        let commercialBidIncrement = parseInt(this.priceTypeData.commercialBidIncrement);
        if (unitBidIncrement <= 0) {
          this.$message.error("请填写价格类型中的单体价");
          return;
        }
        if (chainBidIncrement <= 0) {
          this.$message.error("请填写价格类型中的连锁价");
          return;
        }
        if (commercialBidIncrement <= 0) {
          this.$message.error("请填写价格类型中的商业价");
          return;
        }
        let msg = "";
        if (commercialBidIncrement > chainBidIncrement) {
          msg = "当前设置的<商业价>高于<连锁价>，是否继续保存？";
        } else if (commercialBidIncrement > unitBidIncrement) {
          msg = "当前设置的<商业价>高于<单体价>，是否继续保存？";
        } else if (chainBidIncrement > unitBidIncrement) {
          msg = "当前设置的<连锁价>高于<单体价>，是否继续保存？";
        }

        if (!msg) {
          this.priceDataSubmit();
        } else {
          this.$confirm(msg, '提示', {
            type: 'warning',
            confirmButtonText: '继续保存',
            cancelButtonText: '重新设置 '
          }).then(async () => {
            this.priceDataSubmit();
          }).catch(() => {
          });
        }

      },
      async priceDataSubmit() {
        // if (this.isPriceChange) {
        await this.beforehand();
        this.isPriceChange = false;
        // }
        this.loading = true;
        let param = Object.assign({}, this.priceTypeData);
        param.partnerId = this.partnerId;
        param.tempPriceId = this.tempPriceId;
        API.saveCommodity(param).then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.closeIncreaseInPriceDialog();
            this.initData();
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      // 登录账号正则验证
      handleKeyUp(evt) {
        this.$nextTick(() => {
          this.formData.loginName = this.$utils.regSpecialChar(evt)
        })
      },
    }
    ,
  }
</script>

<style lang="scss">
  .supplier_manage {

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #333;

    }
    .el-checkbox__label, .el-checkbox {
      font-size: 12px;
    }
    .sale_area_authority_arrays {
      /*max-height: 200px;*/
      overflow-y: auto;
      overflow-x: hidden;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      box-sizing: border-box;
      .el-input {
        width: 100% !important;
      }
      .el-input__inner {
        border: 0;

      }
    }
    .el-input__icon.icon-baifenbi {
      color: #333;
      font-size: 12px;
    }
    .table_data_header {
      line-height: initial;
      height: initial;
      font-size: 0px;
      padding-left: 0px;
      .title_span {
        display: inline-block;
        width: 110px;
        font-size: 12px;
      }
    }
    .add_supplier_form {
      .el-input {
        width: 214px;
      }
    }
    .row_nav_title {
      background: #F5F7FA;
    }
    .row_perice {
      text-align: center;
      font-size: 12px;
      color: #333;

      border-left: 1px solid #ECEFF6;
      border-bottom: 1px solid #ECEFF6;
      box-sizing: border-box;
      display: flex;
      display: -webkit-flex;
      align-items: stretch;
      .el-checkbox__label {
        display: none;
      }
      .el-col {
        height: inherit;
        padding: 4px 6px;
        line-height: 28px;
        border-right: 1px solid #ECEFF6;
      }
      .clear_border_right {
        border-right: 0px;
        i {
          font-size: 14px;
          color: #999999;
        }
      }
      .clear_padding_left_right {
        padding: 0px;
        .el-col {
          padding: 0px;
        }
      }
    }
    .el-row:last-child {
      border-bottom: 1px solid #ECEFF6;
    }

    /*    .increase_in_price_nav {
          margin-bottom: 15px;
          height: 30px;
          position: relative;
          .float_line {
            position: absolute;
            bottom: 0px;
            display: inline-block;
            width: 20px;
            height: 1px;
            background: #E5E6E7;
          }
          .review_tab {
            text-align: center;
            background: #F5F7FA;
            padding: 3px 16px;
            box-sizing: border-box;
            float: left;
            color: #999;
            cursor: pointer;

          }
          .review_tab:first-child {
            border-right: 1px solid #E5E6E7;
            border-bottom: 1px solid #E5E6E7;
          }
          .review_tab:nth-child(2) {
            border-left: 1px solid #E5E6E7;
            border-bottom: 1px solid #E5E6E7;
          }
          .review_tab:first-child.tab_active {
            border-right: inherit;
            border-bottom: inherit;
            border-left: 1px solid #E5E6E7;
            border-top: 1px solid #E5E6E7;
          }
          .review_tab:nth-child(2).tab_active {
            border-left: inherit;
            border-bottom: inherit;
            border-right: 1px solid #E5E6E7;
            border-top: 1px solid #E5E6E7;
          }
          .tab_active {
            background: #fff;
            color: #333333;
          }
          .price_hint {
            color: #E57C27;
            padding-left: 25px;
            height: 30px;
            line-height: 30px;
            border-bottom: 1px solid #E5E6E7;
            box-sizing: border-box;
          }
        }*/

    .el-dialog__header {
      position: relative;
    }
    .price_subtitle {
      position: absolute;
      top: 8px;
      left: 55px;
    }
    .price_hint {
      color: #E57C27;
    }
    .cms_dialog_content {
      .el-select {
        .el-input__inner {
          padding-right: 15px;
        }
      }
      .el-cascader {

        .el-input__inner {
          height: 32px;
        }
      }

    }

    .su_commodity_title_bg {
      margin-bottom: 25px;
      .span_bg {
        padding: 0px 10px;
        border: 1px solid #E5E6E7;
        border-radius: 5px;
        box-sizing: border-box;
        cursor: pointer;
        color: #333;
        display: inline-block;
        margin-right: 5px;
        i {
          font-size: 14px;
          margin-right: 5px;
          color: #000000;
          font-weight: 600;
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
        }
      }
    }
  }


</style>
