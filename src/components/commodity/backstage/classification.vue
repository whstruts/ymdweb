<template>
  <div class="classification flex-column">
    <div class="setting_button_bg ">
      <div class=" cms_dialog_add_button" @click="addClassification('0')"
           v-if="this.$utils.checkButton('classification:add:0')" style="margin-right: 10px">
        <i class="iconfont icon-add-fill" style="margin-right: 6px"></i><span>新增一级分类</span>
      </div>
      <div class="cms_dialog_add_button" @click="addClassification('2')"
           :class="{'prohibit_setting_button_tag':!selectId || selectId.length>=9}"
           v-if="this.$utils.checkButton('classification:add:2')" style="margin-right: 10px">
        <i class="iconfont icon-add-fill" style="margin-right: 6px"></i><span>新增二/三级分类</span>
      </div>
      <div class=" setting_button_tag button_delete" @click="editClassification"
           :class="{'prohibit_setting_button_tag':!selectId}"
           v-if="this.$utils.checkButton('classification:edit')" style="margin-right: 10px">
        <i class="iconfont icon-xiugai"></i><span>编辑</span>
      </div>
      <div class=" setting_button_tag button_edit" @click="deleteClassification"
           :class="{'prohibit_setting_button_tag':!selectId}"
           v-if="this.$utils.checkButton('classification:delete')" style="margin-right: 10px">
        <i class="iconfont icon-del"></i> <span>删除</span>
      </div>
      <div class="search_bg_wrap" style="float: right">
        <span style="margin-right: 10px">分类</span>
        <el-input placeholder="一级/二级/三级" @keyup.enter.native="handleSearch" v-model="filterText"
                  size="small" clearable style="width: 225px;vertical-align: middle"></el-input>
        <el-button size="mini" type="warning" style="margin-left: 10px;"><i class="iconfont icon-chaxun"></i>查询
        </el-button>
      </div>
    </div>
    <div class="classification_info scrollbar">
      <el-tree :data="data" highlight-current :check-on-click-node="true"
               @node-click="getCurrentNodes"
               draggable
               :props="defaultProps" node-key="id" :default-expand-all="defaultExpand"
               :allow-drop="allowDrop"
               @node-drop="handleDrop"
               class="filter-tree" :filter-node-method="filterNode" ref="tree"></el-tree>
      <span class="expand_row" @click="setCheckedTree">全部{{defaultExpand?'收起':'展开'}}</span>
    </div>
    <el-dialog
      :title="dialogSettingTitle?'新增分类':'编辑分类'"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible setting_dialog2"
      width="500px"
      :close-on-click-modal="false">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px" class="add_classification_form">
        <el-form-item label="分类名称" prop="text">
          <el-input v-model.trim="formData.text" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
           <el-button @click="resetForm">取 消</el-button>
           <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from "../../../api/api_classification"

  export default {
    name: "classification",
    data() {
      return {
        filterText: "",
        defaultExpand: false,
        data: [],
        defaultProps: {
          children: 'children',
          label:
            'text',
          id: 'id',
        },
        selectId: "",//选中的分类id
        selectText: "",//选中的分类名
        addLevel: "0", //代表一级  2代表二级和三级
        dialogVisible: false,
        dialogSettingTitle: false,
        formData: {
          text: ""
        },
        rules: {
          text: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.initData();
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {

      handleDrop(draggingNode, dropNode, dropType, ev) {
        // console.log('tree drop: ', dropNode, dropType, draggingNode);
        let parentId = draggingNode.data.parentId;
        let data = this.filterData(parentId, this.data, []);
        API.upDrugTypeSort({sortList: data}).then(res => {
          if (res.code == 0) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      filterData(parentId, data, arr) {
        let dataLength = data.length;
        for (let i = 0; i < dataLength; i++) {
          let item = data[i]
          if (parentId == item.parentId) {
            arr.push({name: item.text, parentCode: item.parentId, sortNum: i, typeCode: item.id})
          } else {
            this.filterData(parentId, item.children ? item.children : [], arr);
          }
        }
        return arr;
      }
      ,

      allowDrop(draggingNode, dropNode, type) {
        if (draggingNode.level === dropNode.level) {
          if (draggingNode.parent.id === dropNode.parent.id) {
            return type === 'prev' || type === 'next';
          }
        } else {
          // 不同级进行处理
        }
      }
      ,
      initData() {
        this.selectId = "";
        this.selectText = "";
        API.listAll().then(res => {
          if (res.code == 0) {
            this.data = res.data;
          } else {
            this.$message.error(res.msg)
          }
        })
      }
      ,
      filterNode(value, data) {
        if (!value) return true;
        return data.text.indexOf(value) !== -1;
      }
      ,

      getCurrentNodes(data) {
        this.selectId = data.id;
        this.selectText = data.text;
      }
      ,
      addClassification(status) {
        this.dialogSettingTitle = true;
        this.addLevel = status;
        if (status != '0') {
          //三级类别下不允许再添加
          if (!this.selectId || this.selectId.length >= 9) {
            return;
          }
        }
        this.dialogVisible = true;
      }
      ,
      editClassification() {
        if (!this.selectId) {
          return;
        }
        this.dialogSettingTitle = false;
        this.formData.text = this.selectText;
        this.dialogVisible = true;
      }
      ,
      deleteClassification() {
        if (!this.selectId) {
          return;
        }
        this.$confirm('确认删除' + this.selectText + '?', '提示', {
          type: 'warning'
        }).then(() => {
          API.delete({typeCode: this.selectId}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.initData();
            } else {
              this.$message.error(res.msg)
            }
          })
          done();
        }).catch(() => {

        });
      }
      ,
      submitData() {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            let network = this.dialogSettingTitle ? API.add({
              name: this.formData.text,
              parentCode: this.addLevel == '0' ? '' : this.selectId
            }) : API.edit({
              name: this.formData.text, typeCode: this.selectId
            })
            network.then(res => {
              if (res.code == 0) {
                this.$message.success(res.msg);
                this.initData();
                this.resetForm();
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      }
      ,
      resetForm() {
        this.$refs["ruleForm"].resetFields();
        this.dialogVisible = false;
        this.formData.text = '';
      }
      ,
      setCheckedTree() {
        this.defaultExpand = !this.defaultExpand;
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.defaultExpand;
        }
      }
      ,
    }
    ,
  }
</script>

<style lang="scss">
  .classification {
    width: 980px;
    .classification_info {
      width: 100%;
      flex: 1;
      min-height: 570px;
      padding: 40px 60px;
      border: 1px solid rgba(222, 222, 222, 1);
      box-sizing: border-box;
      border-radius: 8px;
      position: relative;
      overflow-y: auto;
      .expand_row {
        position: absolute;
        right: 56px;
        top: 40px;
        color: #6AA2F0;
        display: inline-block;
        border-bottom: 1px solid #6AA2F0;
        line-height: 18px;
        cursor: pointer;
      }
      .el-tree {
        width: 80%;
        color: #333333;
      }
      .el-tree-node__expand-icon:not(.is-leaf) {
        color: #333333;
      }

      .el-tree-node__label {
        font-size: 12px;
      }
    }
    .add_classification_form {
      width: 430px;
      margin: 30px auto;
    }
  }
</style>
