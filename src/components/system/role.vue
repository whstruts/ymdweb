<template>
  <div class="role">
    <div class="search_bg_wrap flex-row" style="margin-top:15px">
      <span class="hint">角色名</span>
      <el-input placeholder="请输入角色名" @keyup.enter.native="handleSearch" v-model="filters.name"
                size="small" clearable style="width: 200px;margin:0 10px"></el-input>
      <!--<div class="button_wrap">
        <el-button size="small" type="primary" @click="handleSearch">查询
        </el-button>
        <el-button size="small" type="success" @click="showAddRoleDialog">新增
        </el-button>
      </div>-->
      <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询
      </el-button>
      <el-button type="success" size="mini" @click="showAddRoleDialog">  <i class="iconfont icon-hao" style="font-size: 12px"></i>新增
      </el-button>
    </div>
    <div class="wrap_main flex-item scrollbar">
      <el-table :data="table.data" height="100%" border style="width: 100%">
        <el-table-column type="index" label="序号" width="100px" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <!--<span class="edit" @click="showEditRoleDialog(scope.row)">编辑</span>-->
            <!--<span class="delete" @click="removeRole(scope.row)">删除</span>-->
            <div class="table_setting_button">
              <el-button type="primary" plain size="mini"
                         @click.stop="showEditRoleDialog(scope.row)">编辑
              </el-button>
              <el-button plain size="mini"  type="danger"  @click.stop="removeRole(scope.row)">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>

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
      :title="isAddRole?'新增角色':'编辑角色'"
      :visible.sync="roleDialogVisible"
      width="500px"
      :show-close="false"
      :close-on-click-modal="false"
      class="cms_dialog_visible edit_role"
      >
      <el-form :model="roleForm" :rules="roleRules" ref="roleForm" label-width="70px" style="width:422px;margin:auto">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model.trim="roleForm.roleName" maxLength="20" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" v-if="isAddRole">
          <el-input type="textarea" v-model.trim="roleForm.remark" :rows="2" maxLength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            :data="menus"
            show-checkbox
            node-key="id"
            :props="treeProps"
            ref="menuAddTree"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="cancelDialog">取 消</el-button>
         <el-button type="primary" v-if="isAddRole" @click="addRoleSubmit" :loading="roleLoading">确 定</el-button>
           <el-button type="primary" v-else @click="editRoleSubmit" :loading="roleLoading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from '../../api/api_role';
  import MENU_API from '../../api/api_menu';

  export default {
    name: "role",
    data() {
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
        menus: [],
        treeProps: {
          children: 'children',
          label: 'text'
        },
        roleForm: {
          roleName: "",
          remark: "",
        },
        roleRules: {
          roleName: [
            {required: true, message: "请输入角色名", trigger: "blur"}
          ],
        },
        loading: false,
        roleDialogVisible: false,//新增或編輯权限彈出框
        roleLoading: false,//权限信息的提交
        isAddRole: true,//是否是新增权限，true是，false代表编辑
      }
    },
    created() {
      this.initData();
    },
    destroyed() {
      this.$destroy();
    },
    methods: {
      initData() {
        let params = {
          page: this.table.currentPage,
          limit: this.table.pageSize,
          roleNameLike: this.filters.name
        };
        API.findList(params).then(res => {
          if (res && res.data.rows) {
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
      //关闭时清除角色的dialog里的内容
      cancelDialog() {
        this.roleDialogVisible = false;
        this.roleLoading = false;
        this.$refs['roleForm'].resetFields();
        this.clearData();
      },
      clearData() {
        this.roleForm = {
          roleName: "",
          remark: "",
        }
        this.setMenuIds([])
      },
      //点击新增角色弹出框
      showAddRoleDialog() {
        this.isAddRole = true;
        this.roleDialogVisible = true;

        MENU_API.menus('').then((result) => {
          this.menus = result
        })
      },
      //新增角色
      addRoleSubmit() {
        this.$refs.roleForm.validate(valid => {
          if (valid) {
            this.roleLoading = true;
            let params = Object.assign({}, this.roleForm);
            params.menuIds = this.getMenuIds()
            API.add(params).then(res => {
              this.roleLoading = false;
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
      showEditRoleDialog(item) {
        this.isAddRole = false;
        this.roleDialogVisible = true;
        this.roleForm = Object.assign({}, item);
        MENU_API.menuIdsByRoleId({roleId: item.roleId}).then((res) => {
          this.setMenuIds(res)
          this.$nextTick(() => {
            MENU_API.menus('').then((result) => {
              this.menus = result
            })
          })
        })
      },
      //编辑角色
      editRoleSubmit() {
        this.$refs.roleForm.validate(valid => {
          if (valid) {
            this.roleLoading = true;
            let params = Object.assign({}, this.roleForm);
            params.menuIds = this.getMenuIds()
            API.update(params).then(res => {
              this.roleLoading = false;
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
      removeRole(row) {
        this.$confirm("确认删除该记录吗?", "提示", {type: "warning"})
          .then(() => {
            API.remove({roleId: row.roleId})
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
      //获取选中、半选中节点
      getMenuIds: function () {
        return this.$refs.menuAddTree.getCheckedKeys().concat(this.$refs.menuAddTree.getHalfCheckedKeys())
      },
      /**
       * (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 true 则仅设置叶子节点的选中状态，默认值为 false
       */
      setMenuIds: function (keys) {
        this.$refs.menuAddTree.setCheckedKeys(keys, true)
      }
    },
  }
</script>

<style lang="scss" >
  .edit_role .el-dialog {
    max-height: initial !important;
  }
</style>
