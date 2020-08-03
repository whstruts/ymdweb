<template>
  <div class="user">
    <div class="search_bg_wrap flex-row" style="margin-top:15px">
      <span class="hint">用户名</span>
      <el-input placeholder="请输入用户名" @keyup.enter.native="handleSearch" v-model="filters.name" size="small"
                style="width: 200px;margin:0 10px" clearable></el-input>
      <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询
      </el-button>
      <el-button type="success" @click="showAddUserDialog" size="small"><i class="iconfont icon-hao"
                                                                           style="font-size: 12px"></i>新增
      </el-button>
    </div>
    <div class="wrap_main flex-item scrollbar">
      <el-table :data="table.data" border style="width: 100%" height="100%">
        <el-table-column type="index" label="序号" width="100px" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="210px">
          <template slot-scope="scope">
            <!--  <el-button size="mini" type="primary" @click="showEditUserDialog(scope.row)" plain>编辑
              </el-button>
              <el-button type="danger" size="mini" v-if="scope.row.state=='1'"
                         @click="editState(scope.row.userId,scope.row.state)" plain>禁用
              </el-button>
              <el-button type="success" size="mini" v-else @click="editState(scope.row.userId,scope.row.state)" plain>启用
              </el-button>
              <el-button type="info" size="mini" @click="resetPwd(scope.row)" plain>重置密码</el-button>
              <el-button size="mini" @click="removeUser(scope.row)" plain>删除</el-button>-->
            <!--<span class="edit" @click="showEditUserDialog(scope.row)">编辑</span>-->
            <!--<span class="edit" v-if="scope.row.status==1"
                  @click="editState(scope.row.userId,scope.row.state)">禁用</span>
            <span class="edit" v-else @click="editState(scope.row.userId,scope.row.state)">启用</span>-->
            <!--<span class="edit" @click="resetPwd(scope.row)">重置密码</span>-->
            <!--<span class="edit" @click="removeUser(scope.row)">删除</span>-->

            <div class="table_setting_button">
              <el-button type="primary" plain size="mini"
                         @click.stop="showEditUserDialog(scope.row)">编辑
              </el-button>
              <el-button plain size="mini" @click.stop="resetPwd(scope.row)">重置密码
              </el-button>
              <el-button plain size="mini" type="danger" @click.stop="removeUser(scope.row)">删除
              </el-button>
            </div>

          </template>
        </el-table-column>
        <el-table-column prop="userName" label="登录名" align="center"></el-table-column>
        <el-table-column prop="mobile" label="联系方式" align="center"></el-table-column>
        <el-table-column prop="name" label="真实姓名" align="center"></el-table-column>
        <el-table-column prop="reviewStateStr" label="账号状态" align="center">
          <template slot-scope="scope">
            <span :style="{color:scope.row.status=='1'?'#67C23A':'#F56C6C'}">{{scope.row.status==1?'启用':'禁用'}}</span>
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
    <el-dialog
      :title="isAddUser?'新增子账户':'编辑子账户'"
      :visible.sync="userDialogVisible"
      width="500px"
      :show-close="false"
      :close-on-click-modal="false"
      class="cms_dialog_visible"
    >
      <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="80px" style="width:422px;margin:auto">
        <el-form-item label="登录名" v-if="!isAddUser">
          <el-input v-model.trim="userForm.userName" size="small" :disabled="!isAddUser" maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name" style="padding-top: 25px">
          <el-input v-model.trim="userForm.name" maxlength="20" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="isAddUser">
          <el-input type="password" v-model.trim="userForm.password" size="small" maxlength="16" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model.trim="userForm.mobile" maxlength="11" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleIds">
            <el-checkbox v-for="role in roles" :label="role.roleId" :key="role.roleId">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>

        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="cancelDialog">取 消</el-button>
           <el-button type="primary" v-if="isAddUser" @click="addUserSubmit" :loading="userLoading">确 定</el-button>
           <el-button type="primary" v-else @click="editUserSubmit" :loading="userLoading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from "../../api/api_user";
  import ROLE_API from "../../api/api_role";

  export default {
    name: "user",
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('联系方式不能为空'));
        } else {
          const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
          // let reg = /(^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$)|(^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)/;
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的联系方式'));
          }
        }
      }
      return {
        filters: {
          name: ""
        },
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        roles: {},//权限列表
        userForm: {
          userName: "",
          name: "",
          password: "",
          mobile: "",
        },
        roleIds: [],
        userRules: {
          name: [
            {required: true, message: "请输入真实姓名", trigger: "blur"}
          ],
          password: [{required: true, message: "请输入密码", trigger: "blur"}],
          mobile: [{required: true, validator: checkPhone, trigger: "blur"}],
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
      editState(userId, type) {
        let msg = type == "0" ? "启用" : "禁用"
        this.$confirm("确认" + msg + "该用户账号吗?", "提示!", {type: "warning"}).then(() => {
          let params = {
            userId,
            type: type == "0" ? '1' : '0'
          }
          API.updateUserState(params).then(res => {
            if (res.code == 0) {
              this.initData();
            } else {
              this.$message.error(res.msg);
            }
          })
        })

      },
      initData() {
        let params = {
          page: this.table.currentPage,
          limit: this.table.pageSize,
          nameLike: this.filters.name
        };
        API.getUserList(params).then(res => {
          if (res.code == 0) {
            if (this.table.currentPage > 1 && res.data.rows.length <= 0) {
              this.table.currentPage--;
              this.initData();
              return
            }
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
      //关闭时清除user的dialog里的内容
      cancelDialog() {
        this.userDialogVisible = false;
        if (this.$refs['userForm']) {
          this.$refs['userForm'].resetFields();
        }
        this.userLoading = false;
        this.clearData();
      },
      clearData() {
        this.userForm = {
          userName: "",
          password: "",
          mobile: "",
        }
        this.roleIds = [];
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
            if (this.roleIds.length <= 0) {
              this.$message.error("请选择用户角色");
              return;
            }
            this.userLoading = true;
            let params = Object.assign({}, this.userForm);
            params.roleIds = this.roleIds;
            API.addUser(params).then(res => {
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
      //点击编辑用户弹出框
      showEditUserDialog(item) {
        this.isAddUser = false;
        this.userForm = Object.assign({}, item);

        ROLE_API.findList('').then((result) => {
          this.roles = result.data.rows;
          ROLE_API.findById({userId: item.userId}).then((result) => {
            this.userDialogVisible = true;
            this.roleIds = result.data;
          })
        })
      },
      //编辑用户
      editUserSubmit() {

        this.$refs.userForm.validate(valid => {
          if (valid) {
            if (this.roleIds.length <= 0) {
              this.$message.error("请选择用户角色");
              return;
            }
            this.userLoading = true;
            let params = Object.assign({}, this.userForm);
            params.roleIds = this.roleIds;
            API.editUser(params).then(res => {
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
      resetPwd(row) {
        this.$confirm("确认重置密码吗?", "提示", {type: "warning"})
          .then(() => {
            API.resetPwd({userId: row.userId})
              .then((res) => {
                  if (res.code == 0) {
                    this.$message.success(res.msg);
                  } else {
                    this.$message.error(res.msg);
                  }
                }
              )
              .catch(function () {
                this.$message.error("请求出现异常");
              });
          })
      },
      removeUser(row) {
        this.$confirm("确认删除该记录吗?", "提示", {type: "warning"})
          .then(() => {
            API.removeUser({userId: row.userId})
              .then((res) => {
                  if (res.code == 0) {
                    this.$message.success(res.msg);
                    this.initData();
                  } else {
                    this.$message.error(res.msg);
                  }
                }
              )
              .catch(function () {
                this.$message.error("请求出现异常");
              });
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
</style>
