<template>
  <div class="distribution-set" v-loading="loading">
    <div class="page-conatiner">
      <div class="page-box">
      <div class="set-item flex-wrp">
        <span class="label">起送门槛</span>
        <div class="flex-item">
          <el-radio v-model="type" label="1" :disabled="!canEdit">0元配送</el-radio>
          <br/>
          <el-radio v-model="type" label="2" :disabled="!canEdit">
            满<el-input size="mini" style="margin: 0 10px; width:102px" v-model="price" maxlength="7" :disabled="!canEdit" onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" clearable></el-input>元起送
          </el-radio>
        </div>
      </div>
      <div class="set-item flex-wrp">
        <span class="label">配送设置</span>
        <div class="flex-item">
          <el-button round size="mini" @click="showDialog" :disabled="!canEdit">添加地区</el-button>
        </div>
      </div>
      <div class="table-box" style="width: 942px">
        <el-table :data="distributionInfo.data" border>
          <el-table-column label="序号" type="index" width="45px" align="center"></el-table-column>
          <el-table-column label="操作"  width="80px">
            <template slot-scope="scope">
              <el-button type="danger" plain size="mini" @click="del(scope.$index)" :disabled="!canEdit">删除
            </el-button>
            </template>
          </el-table-column>
          <el-table-column label="地区" prop="areaName" width="140px">
          </el-table-column>
          <el-table-column label="配送条件" >
            <template slot-scope="scope">
              满<el-input size="mini" style="margin: 0 10px; width:102px" v-model="scope.row.exemptionPostagePrice" maxlength="7" :disabled="!scope.row.canEdit" onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" clearable></el-input>元包邮，未满额外加收运费<el-input size="mini" style="margin: 0 10px; width:102px" v-model="scope.row.freight" maxlength="7" :disabled="!scope.row.canEdit"></el-input>元
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer-btn">
        <el-button class="" type="" size="mini" v-if="canEdit" @click="handleCancel">取消</el-button>
        <el-button class="" type="primary" size="mini" v-if="canEdit" @click="handleSave">保存</el-button>
        <el-button class="" type="primary" size="mini" v-if="!canEdit" @click="handleEdit">修改</el-button>
      </div>
      </div>
    </div>
    <el-dialog
      title="添加地区"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible edit_customer_dialog"
      :close-on-click-modal="false"
      :before-close="cancel">
      <el-form>
        <el-form-item label="地区" class="flex-item" prop="areaArr">
          <el-select v-model="formData.area" placeholder="请选择" size="mini" @change="handleChnage">
            <el-option  v-for="item in areaList"
              :key="item.areaCode"
              :label="item.name"
              :value="item.areaCode"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="handleSure">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from "../../api/api_user"

  export default {
    name: "distributionSet",
    data() {
      return {
        type:'2',
        price: '',
        distributionInfo:{
          data:[]
        },
        formData:{
          area: ''
        },
        loading: false,
        dialogVisible: false,
        canEdit: false,
        areaList:[], // 城市列表
        obj: {}, // 零时对象
      }

    },
    created(){
      this.getSysDistributionConf();
    },
    methods:{
      // 获取省市区
      getAreaList(){
        this.loading= true;
        API.getOneLayerSysArea().then( (res) => {
          this.loading= false;
          if(res.code == 0) {
            this.areaList = res.data;
            this.dialogVisible =true;
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      // 点击添加地区
      showDialog(){
        this.getAreaList();
      },
      // 地区change事件
      handleChnage(item){
        let obj = {
          areaId: item,
          exemptionPostagePrice: "",
          freight: "",
          canEdit: true
        };
        for(let i in this.areaList) {
          if(item == this.areaList[i].areaCode) {
            obj.areaName = this.areaList[i].name;
          }
        }
        this.obj = obj;
      },
      // 点击弹框确认
      handleSure(){
        if(this.formData.area) {
          let arr = this.distributionInfo.data;
          arr.push(this.obj);
          this.distributionInfo.data = arr;
          this.dialogVisible = false;
        } else {
          this.$message.error("请选择地区")
        }


      },
      getSysDistributionConf(){
        API.getSysDistributionConf().then( (res) => {
          if(res.code == 0) {
            let rows = res.data.pageUtils.rows
            this.distributionInfo = res.data;
            for(let i in rows) {
              rows[i].canEdit = false;
            }
            this.distributionInfo.data = rows;
            if(res.data.deliveryPrice == 0) {
              this.price = "";
              this.type = "1";
            } else {
              this.type = "2";
              this.price = res.data.deliveryPrice;
            }
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      // 删除
      del(index){
        this.$confirm('确认要删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.distributionInfo.data.splice(index,1);
        }).catch({

        })

      },
      // 点击弹框取消
      cancel(){
        this.formData= {
          area: ""
        }
        this.obj = {};
        this.dialogVisible = false;
      },
      // 点击修改
      handleEdit(){
        let data = this.distributionInfo.data;
        for(let i in data) {
          data[i].canEdit = true;
          this.$set(this.distributionInfo.data, i, data[i])
        }
        this.canEdit = true;
      },
      // 点击取消修改按钮
      handleCancel(){
        this.canEdit = false;
        this.getSysDistributionConf();
      },
      // 点击保存
      handleSave(){
        // 1.判断起送门槛是否设置
        if(this.type == 2) {
          if(this.price == "") {
            this.$message.error("请输入起送金额");
            return;
          };
        }
        let arr = this.distributionInfo.data;
        for(let i in arr) {
          if(arr[i].exemptionPostagePrice == "" || arr[i].freight == "") {
            this.$message.error("请完善配送条件");
            return;
          }
        }
        let params = {
          list: this.distributionInfo.data
        }
        if(this.type == 1) {
          params.deliveryPrice = 0;
        } else {
          params.deliveryPrice = this.price;
        }
        API.setSysDistributionConf(params).then( (res) => {
          if(res.code == 0) {
            this.$message.success("操作成功");
            this.canEdit = false;
            this.getSysDistributionConf();
          } else {
            this.$message.error(res.msg);
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .distribution-set{
    .page-conatiner{
      width: 100%;
      height: 100%;
      overflow:auto;
      .page-box{
        width: 942px;
        height: 100%;
      }
    }
    .flex-wrp{
      align-items: flex-start;
    }
    .set-item{
      margin-top: 20px;
      .label{
        padding-right: 20px;
        font-size: 14px;
        color: #333333;
        font-weight: bold;
      }
      .el-radio{
        margin-bottom: 20px;
      }
    }
    .table-box{
      margin-top: 20px;
    }
    .footer-btn{
      padding: 53px 0;
      text-align: center;
      .el-button+.el-button{
        margin-left: 40px;
      }
    }
  }
</style>
