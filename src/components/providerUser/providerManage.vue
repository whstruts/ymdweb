<template>
  <div class="provider-manage">
    <div class="setting_button_bg">
      <div class=" setting_button_tag button_add"  @click="showAddUserDialog('addProduct','')"
    v-if="$utils.checkButton('providerManage:add:user')">
        <i class="iconfont icon-xinjian"></i><span>新建用户</span>
      </div>
      <!-- <div class="setting_button_tag button_delete"
        @click="delProvider()" v-if="$utils.checkButton('providerManage:del:user')">
        <i class="iconfont icon-del"></i> <span>删除</span>
      </div> -->
    </div>
    <div class="search_bg_wrap">
      <div class="search-box flex-row"  v-if="isDisplaySearch">
        <p>
          <span class="search_hint">状&nbsp;&nbsp;&nbsp;&nbsp;态</span>
          <el-select v-model="filters.status" placeholder="请选择" size="mini" @change="handleSearch">
            <el-option  v-for="item in statusData"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </p>
        <p>
          <span class="search_hint">用户</span>
          <el-input v-model="filters.nameLike" clearable placeholder="用户/联系人/手机号" size="mini" @keyup.enter.native="handleSearch"> </el-input>
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
        <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询</el-button>
      </div>
      <a href="javascript:;" v-if="isDisplaySearch" class="opr-search-btn" @click="isDisplaySearch = false">收起<i class="iconfont icon-shouqi2"></i></a>
      <a href="javascript:;" v-if="!isDisplaySearch" class="opr-search-btn search-btn" @click="isDisplaySearch = true">查询<i class="iconfont icon-zhankai1"></i></a>
    </div>
    <div class="wrap_main flex-item">
      <!--  :row-class-name="tableRowClassName"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange" -->
      <el-table
        :data="table.data"
        border
        ref="table"
        height="100%"
       >
        <el-table-column label=" " type="index" width="40" align="center"></el-table-column>
        <!-- <el-table-column
          type="selection"
          width="45"  align="center">
        </el-table-column> -->
        <el-table-column label="操作" width="210px" ref="opr">
          <template slot-scope="scope">
            <div class="table_setting_button" >
              <el-button type="primary" plain size="mini" v-if="$utils.checkButton('providerManage:edit:user')"
                        @click.stop="showEditUserDialog(scope.row)">编辑
              </el-button>
              <el-button :type="scope.row.status==0?'warning':'success'" plain size="mini"
                         v-if="$utils.checkButton('providerManage:edit:status')" @click.stop="editState(scope.row.supplierId,scope.row.status)">
                {{scope.row.status==0?'禁用':scope.row.status==9?'启用':'-'}}
              </el-button>
              <el-button plain size="mini"
                         @click.stop="resetPwd(scope.row)">重置密码
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="reviewStateStr" label="状态" width="60px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status==0?'启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" width="120px"></el-table-column>
        <el-table-column prop="loginName" label="登录账号"></el-table-column>
        <el-table-column prop="linkman" label="联系人"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120px"></el-table-column>
        <el-table-column prop="remark" label="备注" ></el-table-column>
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
    <el-dialog
      :title="isAddUser?'新增用户':'编辑用户'"
      :visible.sync="userDialogVisible"
      class="cms_dialog_visible"
      width="608px"
      :close-on-click-modal="false"
      :before-close="cancelDialog">
      <el-form class="provider-form" :model="userForm" :rules="userRules" ref="userForm" label-width="80px">
        <div class="flex-wrp">
          <div class="flex-item">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model.trim="userForm.supplierName" :disabled="!isAddUser" maxlength="30" clearable size="mini"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
              <el-input type="text" v-model="userForm.linkman" maxlength="8" clearable size="mini"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="">
              <el-select v-model="userForm.status" placeholder="请选择" size="mini">
                <el-option value="0" label="启用"></el-option>
                <el-option value="9" label="禁用"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-item">
            <el-form-item label="登录账号" prop="loginName">
              <el-input v-model.trim="userForm.loginName" :disabled="!isAddUser" maxlength="20" clearable size="mini" @keyup.native="handleKeyUp"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input type="text" v-model.trim="userForm.phone" maxlength="11" clearable size="mini" @keyup.native="handleKeyUp"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model.trim="userForm.remark" maxlength="32" clearable size="mini"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" v-if="isAddUser" @click="addUserSubmit" :loading="userLoading">保存</el-button>
        <el-button type="primary" v-else @click="editUserSubmit" :loading="userLoading">保存</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from "../../api/api_providerManage";
  import ROLE_API from "../../api/api_role";

  export default {
    name: "providerManage",
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          // const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
          let reg = /(^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$)|(^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)/;
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('手机号格式不正确'));
          }
        }
      }
      return {
        isDisplaySearch: true,
        multipleSelection:[],
        filters: {
           status: "",
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
          value: '0',
          label: '启用'
        }, {
          value: '9',
          label: '禁用',
          disabled: true
        }],
        roles: [],//权限列表
        userForm: {
          supplierName: '',
          loginName: "",
          password: "",
          phone: "",
        },
        userRules: {
          supplierName: [
            {required: true, message: "请输入供应商名称", trigger: "blur"}
          ],
          loginName: [
            {required: true, message: "请输入真实姓名", trigger: "blur"}
          ],
          linkman:[{required: true, message: "请输入联系人", trigger: "blur"}],
          password: [{required: true, message: "请输入密码", trigger: "blur"}],
          phone: [{required: true, validator: checkPhone, trigger: "blur"}],
          status: [{required: true, message: "请选择状态", trigger: "change"}],
        },
        userDialogVisible: false,//新增或編輯用戶彈出框
        userLoading: false,//用户信息的提交
        isAddUser: true,//是否是新增用户，true是，false代表编辑
      }
    },
    created() {
      this.initData();
    },
    destroyed() {
      this.$destroy();
    },
    methods: {
      tableRowClassName({row, rowIndex}){
        let arr =  this.multipleSelection;
        for(let i = 0; i < arr.length; i++){
          if(row.supplierId === arr[i].supplierId){
            return 'rowStyle'
          }
        }
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      //点击行触发，选中或不选中复选框
      handleRowClick(row, column, event) {
        this.$refs.table.toggleRowSelection(row);
      },
      editState(supplierId, type) {
        // console.log(type)
        let msg = type == "0" ?  "禁用" : "启用";
        this.$confirm("确认" + msg + "该用户账号吗?", "提示!", {
          type: "warning"
          }).then(() => {
            let params = {
              supplierId: supplierId,
              status: type == "0" ? '9' : '0'
            }
            if(type == 0) {
              API.forbiddenSupplier(params).then(res => {
                if (res.code == 0) {
                  this.$message.success("操作成功");
                  this.initData();
                } else {
                  this.$message.error(res.msg);
                }
              })
            } else{
              API.startSupplier(params).then(res => {
                if (res.code == 0) {
                  this.$message.success("操作成功");
                  this.initData();
                } else {
                  this.$message.error(res.msg);
                }
              })
            }
          }).catch(() => {
        });

      },
      initData() {
        let params = {
          page: this.table.currentPage,
          limit: this.table.pageSize,
          nameLike: this.filters.nameLike,
          status: this.filters.status
        }
        if(this.filters.createTime && this.filters.createTime.length > 0) {
          params.createTimeStart = this.filters.createTime[0];
          params.createTimeEnd = this.filters.createTime[1];
        }
        if(this.filters.lastLoginTime && this.filters.lastLoginTime.length > 0) {
          params.lastLoginTimeStart = this.filters.lastLoginTime[0];
          params.lastLoginTimeEnd = this.filters.lastLoginTime[1];
        }
        API.supplierList(params).then(res => {
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
      //点击新增用户弹出框
      showAddUserDialog() {
        this.isAddUser = true;
        this.userDialogVisible = true;
        ROLE_API.findList('').then((result) => {
          this.roles = result.data.rows;
        })
      },
      //新增用户
      addUserSubmit() {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            this.userLoading = true;
            let params = Object.assign({}, this.userForm);
            API.addSupplier(params).then(res => {
              this.userLoading = false;
              if (res.code == 0) {
                this.$message.success(res.msg);
                this.cancelDialog()
                this.filters.name = "";
                this.table.currentPage = 1;
                this.initData();
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        })
      },
      // 删除供应商
      delProvider(){
        // console.log(this.multipleSelection);
        if(this.multipleSelection.length <= 0) {
          this.$message.warning("请先勾选要删除的供应商！")
          return
        };
        let supplierIds = '';
        for (let i=0; i< this.multipleSelection.length; i++) {
          supplierIds += this.multipleSelection[i].supplierId + ","
        }
        if (supplierIds.length > 0) {
          supplierIds = supplierIds.substr(0, supplierIds.length - 1);
        }
        this.$confirm('确定删除供应商吗', '提示', {
            type: 'warning'
          }).then(_ => {
            API.deleteSupplier({supplierIds: supplierIds})
            .then((res) => {
                if (res.code == 0) {
                  this.initData();
                  this.$message.success("删除成功");
                } else {
                  this.$message.error(res.msg);
                }
              }
            )
          })
          .catch(_ => {});

      },
      //点击编辑用户弹出框
      showEditUserDialog(item) {
        this.isAddUser = false;
        this.userForm = Object.assign({}, item);
        this.userForm.status = item.status;
        this.userDialogVisible = true;
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
      // 登录账号正则验证
      handleKeyUp(evt){
        this.$nextTick(()=>{
          this.userForm.loginName =  this.$utils.regSpecialChar(evt)
        })
      },
      resetPwd(row) {
        this.$confirm("确认重置密码吗?", "提示", {type: "warning"})
          .then(() => {
            API.resetPwd({supplierId: row.supplierId})
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
      removeUser(row) {
        this.$confirm("确认删除该记录吗?", "提示", {type: "warning"})
          .then(() => {
            API.removeUser({id: row.userId})
              .then((res) => {
                  if (res.code == 0) {
                    this.$message.success(res.msg);
                    this.initData();
                  } else {
                    this.$message.error(res.msg);
                  }
                }
              )
          })
      },
    },
  }
</script>

<style lang="scss">
.provider-manage {
  .el-dialog{
    width: 570px !important;
  }
  .provider-form{
    padding: 20px;
  }
}

</style>
