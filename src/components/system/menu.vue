<template>
  <div class="menu">
    <div style="padding-bottom: 14px;">
      <el-button style="float: right" size="mini" type="success" @click="showAddDialog(0,-1)"><i class="iconfont icon-hao" style="font-size: 12px;margin-right: 5px"></i>新增</el-button>
      <!--<el-button type="success" size="mini" @click="showAddRoleDialog">  <i class="iconfont icon-hao" style="font-size: 12px"></i>新增-->
      <!--</el-button>-->
    </div>
    <div class="wrap_main flex-item scrollbar">
      <el-table
        :data="table.data"
        height="100%"
        style="width: 100%;"
        row-key="id"
        border
        :tree-props="{children: 'children',hasChildren: 'hasChildren'}">
        <el-table-column label="名称" prop="object.name" width="160px"></el-table-column>
        <el-table-column label="类型" prop="object.type" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.object.type === null"></span>
            <span v-if="scope.row.object.type === 0" style="color: #00B78D">目录</span>
            <span v-if="scope.row.object.type === 1" style="color: #1b86eb">菜单</span>
            <span v-if="scope.row.object.type === 2" style="color: red ">操作</span>
          </template>
        </el-table-column>
        <el-table-column label="路径" prop="object.url" align="center"></el-table-column>
        <el-table-column label="标识符" prop="object.perms" align="center"></el-table-column>
        <el-table-column label="排序" prop="object.orderNum" align="center"></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope" class="table_setting">
         <!--   <span class="add" :style="{cursor:scope.row.object.type == 2?'not-allowed':''}"
                  @click="showAddDialog(scope.row.id,scope.row.object.type)">新增</span>
            <span class="edit" @click="showEditDialog(scope.row.object)">编辑</span>
            <span class="delete"
                  @click="remove(scope.row)">删除</span>
-->
            <div class="table_setting_button">
              <el-button type="primary" plain size="mini"
                         :disabled="scope.row.object.type == 2"
                         @click.stop="showAddDialog(scope.row.id,scope.row.object.type)">新增
              </el-button>
              <el-button type="primary" plain size="mini"
                         @click.stop="showEditDialog(scope.row.object)">编辑
              </el-button>
              <el-button plain size="mini"  type="danger"  @click.stop="remove(scope.row)">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <el-dialog
      :title="isAdd?'添加':'编辑'"
      :visible.sync="dialogVisible"
      width="500px"
      :show-close="false"
      :close-on-click-modal="false"
      class="cms_dialog_visible"
      >
      <el-form :model="formData" :rules="fromRules" ref="formData" label-width="80px" style="width:422px;margin:auto">
        <el-form-item label="类型">
          <!--:disabled="!typeLever"-->
          <el-radio-group v-model="formData.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">操作</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="formData.name" size="small" auto-complete="off" maxLength="20" clearable></el-input>
        </el-form-item>
        <!--如果类型是操作，那么就填权限-->
        <el-form-item label="路径">
          <el-input v-model="formData.url" size="small" auto-complete="off" maxLength="60" clearable></el-input>
        </el-form-item>
        <el-form-item label="请求方法" v-if="formData.type==2">
          <!--<el-input v-model="formData.method" auto-complete="off" maxLength="8" clearable></el-input>-->
          <el-select v-model="formData.method" style="width: 100%" size="small">
            <el-option label="无" value=""></el-option>
            <el-option label="post" value="post"></el-option>
            <el-option label="get" value="get"></el-option>
            <el-option label="put" value="put"></el-option>
            <el-option label="delete" value="delete"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" v-if="formData.type!=2">
          <el-input v-model="formData.icon" auto-complete="off" size="small" maxLength="60" clearable></el-input>
        </el-form-item>
        <el-form-item label="标识符" v-if="formData.type==2">
          <el-input v-model="formData.perms" auto-complete="off" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" v-if="formData.type!=2">
          <el-input v-model="formData.orderNum" auto-complete="off" size="small" maxLength="2" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary"  v-if="isAdd" @click="addSubmit" :loading="dialogLoading">确 定</el-button>
           <el-button type="primary" v-else @click="editSubmit" :loading="dialogLoading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from '../../api/api_menu'

  export default {
    name: "menus",
    data() {
      return {
        table: {
          data: []

        },


        isAdd: false, //是否为新增菜单，，true新增 ，false编辑
        dialogLoading: false,
        dialogVisible: false,
        formData: {
          type: "",
          name: "",
          url: "",
          method: "",//请求方法。。只有type为2的时候才显示
          icon: "",
          orderNum: "",
          parentId: "",//上级id
          perms: ""
        },
        // typeLever: true,//类型是否为目录 true 代表类型为目录
        fromRules: {
          name: [
            {required: true, message: "请输入名称", trigger: "blur"}
          ],
        },
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
        API.menus().then(result => {
            this.table.data = result;
          }
        )
      },
      //关闭时清除user的dialog里的内容
      cancelDialog() {
        this.dialogVisible = false;
        this.dialogLoading = false;
        this.$refs['formData'].resetFields();
        this.clearData();
      },
      clearData() {
        this.formData = {
          type: "",
          name: "",
          url: "",
          icon: "",
          method: "",//请求方法。。只有type为2的时候才显示
          orderNum: "",
          parentId: "",//上级id
          perms: ""
        }
      },
      //点击新增菜单弹出框
      showAddDialog(parentId, parentType) {
        if (parentType == 2) {
          return;
        }
        this.formData.type = parentType + 1;
        /* if (parentId == 0) {
           this.typeLever = true;
         } else {
           this.typeLever = false;
         }*/
        this.formData.parentId = parentId;
        this.isAdd = true;
        this.dialogVisible = true;
      },
      addSubmit() {
        this.$refs.formData.validate((valid) => {
          if (valid) {
            this.dialogLoading = true;
            let params = Object.assign({}, this.formData);
            API.add(params).then(res => {
              this.dialogLoading = false;
              if (res && parseInt(res.code) === 0) {
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
      //点击编辑用户弹出框
      showEditDialog(item) {
        // this.typeLever = false;
        this.isAdd = false;
        this.dialogVisible = true;
        this.formData = Object.assign({}, item);
      },
      editSubmit: function () {
        this.$refs.formData.validate((valid) => {
          if (valid) {
            this.dialogLoading = true;
            let params = Object.assign({}, this.formData);
            API.editMenu(params).then(res => {
              this.dialogLoading = false;
              if (res && parseInt(res.code) === 0) {
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
      remove(row) {
        this.$confirm("确认删除该记录吗?", "提示", {type: "warning"})
          .then(() => {
            API.remove({id: row.id})
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
  .menu {
    width: 100%;
    background: #fff;
    display: flex;
    /*min-height: 100%;*/
    flex-direction: column;

  }
</style>
<style lang="scss">
  /*.menu {*/
  /*.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {*/
  /*border-right: 0px !important;*/
  /*}*/
  /*.el-table--border::after, .el-table--group::after{*/
  /*height: 0px;*/
  /*}*/
  /*}*/
</style>
