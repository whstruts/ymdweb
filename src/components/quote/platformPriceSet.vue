<template>
  <div class="platform-price-set">
    <div class="page-container">
      <div class="page-box">
        <p class="page-title">价格优先级：指定商品报价>按客户类型报价</p>
        <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
          <legend>客户类型报价</legend>
          <div class="flex-wrp">
            <div class="quote_setting_box">
              <div class="quote_setting_content">
                <span class="quote_setting_title">单体价</span>
                <span>整体提升</span>
                <el-input size="mini" v-model="param.baseUnitPriceRatio" clearable
                          onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" maxlength="2"
                          style="width: 80px;margin: 0px 12px" :disabled="!canEdit"></el-input>
                <span>%</span>
              </div>
              <div class="quote_setting_content">
                <span class="quote_setting_title">连锁价</span>
                <span>整体提升</span>
                <el-input size="mini" v-model="param.baseChainPriceRatio" clearable
                          onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" maxlength="2"
                          style="width: 80px;margin: 0px 12px" :disabled="!canEdit"></el-input>
                <span>%</span>
              </div>
              <div class="quote_setting_content">
                <span class="quote_setting_title">商业价</span>
                <span>整体提升</span>
                <el-input size="mini" v-model="param.baseCommercialPriceRatio" clearable
                          onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" maxlength="2"
                          style="width: 80px;margin: 0px 12px" :disabled="!canEdit"></el-input>
                <span>%</span>
              </div>
            </div>
            <!-- <div class="quote_setting_box">
              <div class="quote_setting_content">
                <span class="quote_setting_title" style="margin-right:10px">最高报价</span>
                <span>用于控制合伙人乱加价现象</span>
              </div>
              <div class="quote_setting_content">
                <span>不可高于</span>
                <el-input size="mini" v-model="param.maxPriceRatio" clearable
                          onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" maxlength="2"
                          style="width: 80px;margin: 0px 12px" :disabled="!canEdit"></el-input>
                <span>% 的报价</span>
              </div>
            </div> -->
          </div>
          <div class="footer-btn" v-if="$utils.checkButton('platformPrice:edit:price')">
            <el-button class="" type="" size="mini" v-if="canEdit" @click="handleCancel">取消</el-button>
            <el-button class="" type="primary" size="mini" v-if="canEdit" @click="submitData">保存</el-button>
            <el-button class="" type="primary" size="mini" v-if="!canEdit" @click="handleEdit">修改</el-button>
          </div>
        </fieldset>
        <fieldset class="cms_dialog_content" style="padding:8px 20px 0px">
          <legend>指定商品报价</legend>
          <div class="su_commodity_title_bg">
            <p class="span_bg add-btn" v-if="$utils.checkButton('platformPrice:add:commodity')" @click="openAddCommodityDialog"><i class="iconfont icon-hao"></i><span>添加商品</span></p>
            <p class="span_bg del-btn" v-if="$utils.checkButton('platformPrice:del:commodity')" @click="deleteCommodtiyList"><i class="iconfont icon-del"></i><span>删除商品</span></p>
            <p class="span_bg"><i class="iconfont icon-daoru"></i> <span>Excel导入</span></p>
            <div class="search_bg_wrap" style="float:left;padding-left:20px">
              <el-input v-model="likeValue" clearable placeholder="编码/商品名/厂家"
                        style="width: 250px;margin-right:15px" size="small"
              @keyup.enter.native="queryCommodityPriceList"></el-input>
              <el-button size="small" type="warning" @click="queryCommodityPriceList"><i class="iconfont icon-chaxun"></i>查询
              </el-button>
            </div>
          </div>
          <div class="wrap_main flex-item">
            <el-table
              :data="table.data"
              border
              ref="priceTable"
              style="width: 100%" :row-class-name="tableRowClassName" @selection-change="selectionCommodityChange"
              @row-click="rowClick">
              <el-table-column label=" " type="index" width="40" align="center"></el-table-column>
              <el-table-column type="selection" width="45" align="center"></el-table-column>
              <el-table-column label="操作" width="130px" align="center" ref="opr">
                <template slot-scope="scope">
                  <div class="table_setting_button" >
                    <el-button type="primary" plain size="mini" v-if="$utils.checkButton('platformPrice:edit:commodity') && !scope.row.isEdit" @click="handleRowEdit(scope.row, scope.$index)">编辑</el-button>
                    <el-button  plain size="mini" v-if="$utils.checkButton('platformPrice:edit:commodity') && scope.row.isEdit" @click="handleRowCancel(scope.row, scope.$index)">取消</el-button>
                    <el-button  type="primary" plain size="mini" v-if="$utils.checkButton('platformPrice:edit:commodity') && scope.row.isEdit" @click="handleRowSave(scope.row, scope.$index)">保存</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单体价" width="120">
                <template slot-scope="scope">
                  <!--onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"-->
                  <el-input v-model="scope.row.unitBidIncrement"
                            onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')"
                            suffix-icon="iconfont icon-baifenbi "
                            size="mini"
                            maxlength="3"
                            :disabled="!scope.row.isEdit"
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
                            maxlength="3"
                            :disabled="!scope.row.isEdit"
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
                            maxlength="3"
                            :disabled="!scope.row.isEdit"
                            @change="isPriceChange=true"
                            style="width: 80px;"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="商品编码" prop="drugSkuCode" min-width="120"></el-table-column>
              <el-table-column label="商品通用名" prop="drugCommonName" min-width="150"></el-table-column>
              <el-table-column prop="specifications" label="规格" width="120px"></el-table-column>
              <el-table-column label="厂家" prop="manufacturer" min-width="200"></el-table-column>
              <el-table-column label="批准文号" prop="approveNumber" min-width="150"></el-table-column>
              <el-table-column label="所属供应商" min-width="240">
                <template slot-scope="scope">
                  <el-checkbox v-model="item.selectFlag"
                  v-for="(item,index) in scope.row.supplierList"
                  :key="index"
                  :disabled="!scope.row.isEdit">
                    {{item.supplierName}}
                  </el-checkbox>
                </template>
              </el-table-column>
            </el-table>
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
        </fieldset>
      </div>
    </div>
    <commodity-dialog :addCommodityDialog='addCommodityDialog' :commodityIds="commodityIds" :isShowAll="false" @closeCommodityDialog="closeCommodityDialog"
                      @commoditySubmit="commoditySubmit"></commodity-dialog>
  </div>
</template>

<script>
  import API from "../../api/api_quote"
  import commodityDialog from '../../components/common/commodityDialog'
  export default {
    name: "quoteSetting",
    data() {
      return {
        param: {
          baseUnitPriceRatio: 0,
          baseChainPriceRatio: 0,
          baseCommercialPriceRatio: 0,
          maxPriceRatio: 0
        },
        tempData: {},
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        canEdit: false,
        checkedCommodity:[],
        addCommodityDialog: false,
        commodityIds: [],
        likeValue:'',
        editData:[]
      }
    },
    components:{
      commodityDialog
    },
    created() {
      this.initData();
      this.queryCommodityPriceList();
    },
    methods: {
      initData() {
        API.getplatformPrice().then(res => {
          if (res.code == 0) {
            this.param.baseUnitPriceRatio = res.data.baseUnitPriceRatio;
            this.param.baseChainPriceRatio = res.data.baseChainPriceRatio;
            this.param.baseCommercialPriceRatio = res.data.baseCommercialPriceRatio;
            this.param.maxPriceRatio = res.data.maxPriceRatio;
            this.tempData = res.data;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 点击修改
      handleEdit() {
        this.canEdit = true;
      },
      // 点击取消
      handleCancel() {
        console.log(this.tempData)
        this.param.baseUnitPriceRatio = this.tempData.baseUnitPriceRatio;
        this.param.baseChainPriceRatio = this.tempData.baseChainPriceRatio;
        this.param.baseCommercialPriceRatio = this.tempData.baseCommercialPriceRatio;
        this.param.maxPriceRatio = this.tempData.maxPriceRatio;
        this.canEdit = false;
      },
      submitData() {
        let unitBidIncrement = parseInt(this.param.baseUnitPriceRatio);
        let chainBidIncrement = parseInt(this.param.baseChainPriceRatio);
        let commercialBidIncrement = parseInt(this.param.baseCommercialPriceRatio)
        let maxPriceRatio = parseInt(this.param.maxPriceRatio);
        if (unitBidIncrement <= 0) {
          this.$message.error("请输入单体价，且单体价不能为0")
          return;
        }
        if (chainBidIncrement <= 0) {
          this.$message.error("请输入连锁价，且连锁价不能为0")
          return;
        }
        if (commercialBidIncrement <= 0) {
          this.$message.error("请输入商业价，且商业价不能为0")
          return;
        }
        // if (maxPriceRatio <= 0) {
        //   this.$message.error("请输入最高报价，且最高报价不能为0")
        //   return;
        // }
        // if (maxPriceRatio <= unitBidIncrement) {
        //   this.$message.error("最高报价必须大于单体价")
        //   return;
        // }

        let msg = "";
        if (commercialBidIncrement > chainBidIncrement) {
          msg = "当前设置的<商业价>高于<连锁价>，是否继续保存？";
        } else if (commercialBidIncrement > unitBidIncrement) {
          msg = "当前设置的<商业价>高于<单体价>，是否继续保存？";
        } else if (chainBidIncrement > unitBidIncrement) {
          msg = "当前设置的<连锁价>高于<单体价>，是否继续保存？";
        }
        if (!msg) {
          this.settingData();
        } else {
          this.$confirm(msg, '提示', {
            type: 'warning',
            confirmButtonText: '继续保存',
            cancelButtonText: '重新设置 '
          }).then(async () => {
            this.settingData();
          }).catch(() => {
          });
        }
      },
      settingData() {
        API.setValue(this.param).then(res => {
          if (res.code == 0) {
            this.$message.success(res.msg);
            this.canEdit =false;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 添加商品
      openAddCommodityDialog(){
        this.addCommodityDialog = true;
      },
      // 删除商品
      deleteCommodtiyList(){
        if(this.checkedCommodity.length <=0) {
          this.$message.error("请勾选商品");
          return;
        }
        this.$confirm('确认删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          let drugSkuIds = [];
          for(let i in this.checkedCommodity) {
            drugSkuIds.push(this.checkedCommodity[i].drugSkuId)
          }
          API.delCommodityPrice({drugSkuIds: drugSkuIds}).then(res => {
            if(res.code == 0) {
              this.$message.success("操作成功");
              this.table.currentPage = 1;
              this.queryCommodityPriceList();
            } else {
              this.$message.error(res.msg);
            }
          })
        }).catch(() => {

        });
      },
      // 商品列表
      queryCommodityPriceList(){
        let params  = {
          page: this.table.currentPage,
          limit: this.table.pageSize,
          likeValue: this.likeValue
        }
        API.getConfigList(params).then( (res) => {
          if(res.code == 0) {
            let data = res.data.rows;
            for(let i in data) {
              data[i].isEdit = false;
            }
            this.table.data = data;
            this.table.total = res.data.total;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      tableRowClassName({row, rowIndex}) {
        let arr = this.checkedCommodity;
        for (let i = 0; i < arr.length; i++) {
          if (row.drugSkuId === arr[i].drugSkuId) {
            return 'rowStyle'
          }
        }
      },
      rowClick(){

      },
      //选择商品 加价多选
      selectionCommodityChange(val) {
        this.checkedCommodity = val;
      },
      // 关闭添加商品弹框
      closeCommodityDialog(){
        this.addCommodityDialog = false;
      },
      //选择商品后
      commoditySubmit(data) {
        console.log(data);
        let arr = [];
        data.forEach(item => {
          arr.push(item.drugSkuId);
        });
        API.addCommodity({drugSkuIds: arr}).then( (res) => {
          if(res.code == 0) {
            this.table.currentPage = 1;
            this.editData = data;
            this.queryCommodityPriceList();
            this.addCommodityDialog = false;
          } else {
            this.$message.error(res.msg)
          }
        })

      },
      //分页
      handleCurrentChange(val) {
        this.table.currentPage = val;
        this.queryCommodityPriceList();
      },
      handleSizeChange(val) {
        this.table.pageSize = val;
        this.queryCommodityPriceList();
      },
      // 点击编辑
      handleRowEdit(item,index){
        this.table.data[index].isEdit = true;
      },
      // 点击取消
      handleRowCancel(item,index){
        this.table.data[index].isEdit = false;
      },
      // 点击保存
      handleRowSave(item,index) {
        if(item.unitBidIncrement == "" ||  item.unitBidIncrement == 0) {
          this.$message.error("请填写单体价");
          return
        }
        if(item.chainBidIncrement == "" ||  item.chainBidIncrement == 0) {
          this.$message.error("请填写连锁价");
          return
        }
        if(item.commercialBidIncrement == "" ||  item.commercialBidIncrement == 0) {
          this.$message.error("请填写商业价");
          return
        }
        let supplierIds = []; // 选中的供应商id;
        for(let i in item.supplierList) {
          if(item.supplierList[i].selectFlag) {
            supplierIds.push(item.supplierList[i].supplierId);
          }
        }
        if(supplierIds.length <= 0) {
          this.$message.error("请选择所属供应商");
          return
        }
        let postData = {
          "chainBidIncrement": item.chainBidIncrement,
          "commercialBidIncrement": item.commercialBidIncrement,
          "drugSkuId": item.drugSkuId,
          "supplierIds":supplierIds,
          "unitBidIncrement": item.unitBidIncrement
        }
        API.updateCommodityPrice(postData).then( (res) => {
          if(res.code == 0) {
            this.$message.success("操作成功");
            this.table.currentPage = 1;
            this.queryCommodityPriceList();
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .platform-price-set {
    .page-container {
      width: 100%;
      height: 100%;
      overflow: auto;
      .page-box {
        min-width: 960px;
        .page-title{
          padding: 22px 0 12px;
          font-size: 14px;
          color: #333333;
        }
        .cms_dialog_content{
          border-radius: 10px;
          border: 1px solid #ECEFF6;
          padding: 10px 20px 20px;
          margin-bottom: 20px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          position: relative;
        }
      }
    }
    .flex-wrp {
      align-items: flex-start;
    }
    .quote_setting_box{
      padding: 0 0 10px;
    }
    .quote_setting_content {
      padding: 10px 100px 10px 25px;
      font-size: 14px;
      color: #333333;
    }
    .quote_setting_title {
      font-weight: bold;
      margin-right: 55px;
    }
    .quote_setting_button {
      margin: 50px 0px 0px 350px;
      background: #2F9FFE;
      color: #fff;
      display: inline-block;
      width: 68px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 5px;
      cursor: pointer;
    }
    .footer-btn {
      padding: 10px 0 20px 124px;
      text-align: left;
      .el-button + .el-button {
        margin-left: 40px;
      }
    }
    .el-input--mini .el-input__inner {
      width: 80px;
    }
    .su_commodity_title_bg {
      margin-bottom: 25px;
      padding-left: 22px;
      overflow: hidden;
      .span_bg {
        float: left;
        padding: 0px 10px;
        border: 1px solid #E5E6E7;
        border-radius: 5px;
        box-sizing: border-box;
        cursor: pointer;
        color: #333;
        margin-right: 5px;
        &.add-btn{
          color: #fff;
          background: #0680FD;
          border: 1px solid #0680FD;
          i{
            color: #fff;
          }
        }
         &.del-btn{
          color: #fff;
          background: #FF5253;
          border: 1px solid #FF5253;
          i{
            color: #fff;
          }
        }
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
