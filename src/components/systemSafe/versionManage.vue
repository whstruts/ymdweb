<template>
  <div class="version-manage">
    <div class="setting_button_bg">
      <div class=" setting_button_tag button_add" @click="showDialog()"
           v-if="$utils.checkButton('providerManage:add:user')">
        <i class="iconfont icon-xinjian"></i><span>上传APP</span>
      </div>
      <!-- <div class="setting_button_tag button_delete"
        @click="delProvider()" v-if="$utils.checkButton('providerManage:del:user')">
        <i class="iconfont icon-del"></i> <span>删除</span>
      </div> -->
    </div>
    <div class="search_bg_wrap ">
      <div class="search-box flex-row" v-if="isDisplaySearch">
        <p>
          <span class="search_hint">APP类型</span>
          <el-select v-model="filters.projectCode" placeholder="请选择" size="mini" @change="handleSearch">
            <el-option value="" label="全部"></el-option>
            <el-option v-for="item in appTypeList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </p>
        <!-- <p>
          <span class="search_hint">版本号</span>
          <el-input v-model="filters.versionCode" clearable placeholder="版本号" size="mini" @keyup.enter.native="handleSearch"> </el-input>
        </p> -->
        <!-- <p>
          <span class="search_hint">上传时间</span>
          <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
            v-model="filters.createTime"
           size="mini" style="width: 240px" :editable="false" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd">
          </el-date-picker>
        </p> -->
        <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询
        </el-button>
      </div>
      <a href="javascript:;" v-if="isDisplaySearch" class="opr-search-btn" @click="isDisplaySearch = false">收起<i
        class="iconfont icon-shouqi2"></i></a>
      <a href="javascript:;" v-if="!isDisplaySearch" class="opr-search-btn search-btn" @click="isDisplaySearch = true">查询<i
        class="iconfont icon-zhankai1"></i></a>
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
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="projectCode" label="APP类型"></el-table-column>
        <el-table-column prop="versionCode" label="版本编码"></el-table-column>
        <el-table-column prop="versionNum" label="版本号"></el-table-column>
        <el-table-column prop="systemType" label="系统类型"></el-table-column>
        <el-table-column prop="loginName" label="是否强制更新">
          <template slot-scope="scope">
            <span>{{scope.row.isCompel == 0?"否":"是"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" width="180px"></el-table-column>
      </el-table>
    </div>
    <div class="setting_pagination" v-if="table.total>0">
      <el-pagination @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :page-sizes="[10, 50, 100, 150]"
                     :total="table.total" :current-page.sync="table.currentPage"
                     :page-size="table.pageSize"></el-pagination>
      <el-button type="primary" size="mini" plain>确 定</el-button>
    </div>
    <el-dialog
      :title="isAddUser?'上传':'编辑'"
      :visible.sync="userDialogVisible"
      class="cms_dialog_visible"
      width="608px"
      :close-on-click-modal="false"
      :before-close="cancelDialog">
      <el-form class="provider-form" :model="form" :rules="rules" ref="form" label-width="100px">
        <div class="flex-wrp">
          <div class="flex-item">
            <el-form-item label="上传APP">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :on-success="(res,file)=>{return handleAvatarSuccess(res,file)}"
                :file-list="fileList"
                :headers="uploadHeaders"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :before-remove="beforeRemove">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="APP类型" prop="appType">
              <el-radio-group v-model="form.appType">
                <el-radio label="1">b2bapp</el-radio>
                <el-radio label="2">partner app</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="版本编码" prop="versionCode">
              <el-input v-model.trim="form.versionCode" maxlength="10" clearable size="mini"></el-input>
              <div class="tips">示例：1.0.0</div>
            </el-form-item>
            <el-form-item label="版本号" prop="versionNum">
              <el-input v-model.trim="form.versionNum" maxlength="10" clearable size="mini"></el-input>
            </el-form-item>
            <el-form-item label="是否强制更新" prop="isCompel">
              <el-radio-group v-model="form.isCompel">
                <el-radio label="1">是</el-radio>
                <el-radio label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model.trim="form.remark" maxlength="100" clearable size="mini"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit" :loading="userLoading">确定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from "../../api/api_user";
  import ROLE_API from "../../api/api_role";

  export default {
    name: "versionManage",
    data() {
      return {
        isDisplaySearch: true,
        filters: {
          appType: "",
          versionCode: "",
          createTime: []
        },
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        systemTypeList: [{
          value: 'ios',
          label: 'ios'
        }, {
          value: 'android',
          label: 'android'
        }],
        appTypeList: [{
          value: 'b2bapp',
          label: 'b2bapp'
        }, {
          value: 'partner',
          label: 'partner'
        }],
        roles: [],//权限列表
        form: {
          fileName: '',
          appType: '',
          versionCode: '',
          isCompel: '',
          remark: ''
        },
        rules: {
          appType: [
            {required: true, message: "请选择APP类型", trigger: "change"}
          ],
          versionCode: [
            {required: true, message: "请输入版本编号", trigger: "blur"}
          ],
          versionNum: [
            {required: true, message: "请输入版本号", trigger: "blur"}
          ],
          systemType: [
            {required: true, message: "请选择系统类型", trigger: "change"}
          ],
          isCompel: [
            {required: true, message: "请选择是否强制更新", trigger: "change"}
          ],
          remark: [{required: true, message: "请输入备注", trigger: "blur"}],
        },
        userDialogVisible: false,//新增或編輯用戶彈出框
        userLoading: false,//用户信息的提交
        isAddUser: true,//是否是新增用户，true是，false代表编辑
        uploadUrl: "",
        uploadHeaders: {Authorization: ''},//token
        fileList: []
      }
    },
    created() {
      this.initData();
      this.uploadUrl = API.uploadApp();
    },
    methods: {
      initData() {
        let params = {
          page: this.table.currentPage,
          limit: this.table.pageSize,
          projectCode: this.filters.projectCode,
          versionCode: this.filters.versionCode
        }
        if (this.filters.createTime && this.filters.createTime.length > 0) {
          params.startTime = this.filters.createTime[0];
          params.endTime = this.filters.createTime[1];
        }
        API.appVersionList(params).then(res => {
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
      //关闭时清除user的dialog里的内容
      cancelDialog() {
        this.userDialogVisible = false;
        this.userLoading = false;
        this.$refs['form'].resetFields();
        this.clearData();
      },
      clearData() {
        this.form = {
          fileName: '',
          version: "",
          isRequire: "",
          remark: ""
        };
        this.fileList = [];
      },
      //点击上传弹出框
      showDialog() {
        this.userDialogVisible = true;
      },
      //确认上传
      addUserSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.fileList.length <= 0) {
              this.$message.error("请上传app安装包");
              return;
            }
            this.userLoading = true;
            let params = Object.assign({}, this.form);
            API.addVersion(params).then(res => {
              this.userLoading = false;
              if (res.code == 0) {
                this.$message.success(res.msg);
                this.cancelDialog()
                this.table.currentPage = 1;
                this.initData();
              } else {
                this.$message.error(res.msg);
              }
            }).catch(() => {
              this.userLoading = false;
            })
          }
        })
      },
      // 上传成功
      handleAvatarSuccess(res, file) {
        if (file.response.code == 0) {
          let arr = [];
          arr.push(file)
          this.fileList = arr;
          this.form.fileName = file.response.data;
        } else {
          this.fileList = [];
          this.$message.error(file.response.msg);
        }
      },
      beforeAvatarUpload(file) {
        this.uploadHeaders.Authorization = localStorage.getItem('access-token');
        if (!this.uploadHeaders.Authorization) {
          return false;
        }
        const isApk = file.name.indexOf('apk') != -1;
        if (!isApk) {
          this.$message.error("请上传安装包!");
        }
        return isApk;
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleRemove(file, fileList) {
        this.fileList = [];
        this.form.fileName = "";
      },
    },
  }
</script>

<style lang="scss">
  .version-manage {
    .el-dialog {
      width: 570px !important;
    }
    .provider-form {
      padding: 20px;
    }
  }

</style>
