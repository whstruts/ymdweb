<template>
  <div class="topic-manage">
    <div class="setting_button_bg">
      <div class=" setting_button_tag button_add"  @click="showAddTopicDialog()" v-if="$utils.checkButton('topicManage:add')">
        <i class="iconfont icon-xinjian"></i><span>添加</span>
      </div>
      <div class="setting_button_tag button_delete"
        v-if="$utils.checkButton('topicManage:del')"
        @click="handleDel">
        <i class="iconfont icon-del"></i> <span>删除</span>
      </div>
    </div>
    <div class="search_bg_wrap">
      <div class="search-box flex-row"  v-if="isDisplaySearch">
        <p>
          <span class="search_hint">状态</span>
          <el-select v-model="filters.activityStatus" placeholder="请选择" size="mini" @change="handleSearch">
            <el-option label="全部" :key=" " value=""></el-option>
            <el-option  v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </p>
        <p>
          <span class="search_hint">专题名称</span>
          <el-input v-model="filters.activityName" clearable placeholder="" size="mini" @keyup.enter.native="handleSearch"> </el-input>
        </p>
        <p>
          <span class="search_hint">活动时间</span>
          <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
            v-model="filters.activityTime"
          size="mini" style="width: 240px" :editable="false" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd">
          </el-date-picker>
        </p>
        <p>
          <span class="search_hint">更新时间</span>
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="filters.updateTime"
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
      <el-table
        :data="table.data"
        border
        ref="multipleTable"
        height="100%"
        :row-class-name="tableRowClassName"
        @selection-change="handleselectChange"
        @row-click="rowClick"
        v-loading="loadingTable">
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column label=" " type="index" width="40" align="center"></el-table-column>
        <el-table-column label="操作" width="260px" ref="opr">
          <template slot-scope="scope">
            <div class="table_setting_button" >
              <el-button type="primary" plain size="mini" v-if="$utils.checkButton('topicManage:edit:topic')" @click.stop="showAddTopicDialog(scope.row)">编辑
              </el-button>
              <el-button :type="scope.row.disableStatus==1?'warning':'success'" plain size="mini"
                        v-if="$utils.checkButton('topicManage:edit:status')"
                        @click.stop="editState(scope.row.activityId,scope.row.disableStatus)">
                {{scope.row.disableStatus==1?'禁用':scope.row.disableStatus==2?'启用':'-'}}
              </el-button>
              <el-button type="primary" plain size="mini"
              v-if="$utils.checkButton('topicManage:edit:topic')"
               @click.stop="handleViewCommodity(scope.row)">查看商品
              </el-button>
               <el-button plain size="mini"
               v-if="$utils.checkButton('topicManage:edit:preview')"
                         @click="previewTemplate(scope.row)">预览
              </el-button>

            </div>
          </template>
        </el-table-column>
        <!-- 0未认证，1已认证，2已驳回 3 认证中 -->
        <el-table-column prop="reviewStateStr" label="活动状态" width="100px" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.activityStatus == 1 ">未开始</span>
            <span v-if="scope.row.activityStatus == 2 ">进行中</span>
            <span v-if="scope.row.activityStatus == 3 ">已结束</span>
          </template>
        </el-table-column>
        <el-table-column prop="activityName" label="专题名称"></el-table-column>
        <el-table-column prop="" label="头部设置" width="180px">
          <template slot-scope="scope">
            <div  v-if="scope.row.headImg">
              <span style="display:inline-block;width: 40px;">PC：</span>　
              <el-popover
                placement="right"
                trigger="hover">
                <img :src="scope.row.headImg" style="max-width:800px"/>
                <img :src="scope.row.headImg" style="display:inline-block;width:100px"　slot="reference"/>
              </el-popover>

            </div>
            <div  v-if="scope.row.appHeadImg">
              <span style="display:inline-block;width: 40px;">APP：</span>
              <el-popover
                placement="right"
                trigger="hover">
                <img :src="scope.row.appHeadImg" style="max-width:800px"/>
                <img :src="scope.row.appHeadImg" style="display:inline-block;width:100px"　slot="reference"/>
              </el-popover>　
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="链接地址" width="550px">
          <template slot-scope="scope">
            <div v-if="scope.row.pcAddress">PC：{{scope.row.pcAddress}}<span class="btn-copy" @click.stop="copy(scope.row.pcAddress)">复制</span></div>
            <div v-if="scope.row.appAddress">APP：{{scope.row.appAddress}} <span class="btn-copy" @click.stop="copy(scope.row.appAddress)">复制</span></div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="活动时间"  width="280px">
          <template slot-scope="scope">
            {{scope.row.activityStartTime}}/{{scope.row.activityStartTime}}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160px"></el-table-column>
        <el-table-column prop="updateMan" label="更新人" ></el-table-column>
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
    <topic-add  ref='addTopic' :dialogVisible = 'dialogVisible' :activityId = 'activityId' @closeDialog=closeDialog ></topic-add>
    <view-commodity ref='viewCommodity'  :viewDialogVisible = 'viewDialogVisible' :activityId = 'activityId' @closeViewDialog=closeViewDialog></view-commodity>
 </div>
</template>

<script>
  import API from "../../../api/api_topic";
  import topicAdd from "./addTopic"
  import viewCommodity from "./viewCommodity"
  export default {
    name: "customerManage",
    data() {
      return {
        isDisplaySearch: true,
        loadingTable: false,
        loading: false,
        dialogVisible: false,
        viewDialogVisible: false,
        filters: {
          activityStatus: '',
          activityName: '',
          activityTime:'',
          updateTime:''
        },
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        statusList:[
          {
            value: '1',
            label: '未开始'
          },
          {
            value: '2',
            label: '进行中'
          },
          {
            value: '3',
            label: '已结束'
          },
        ],
        multipleSelection:[],
        activityId: ""  // 点击获取的专题页id
      }
    },
    components:{
      topicAdd,
      viewCommodity
    },
    created() {
      this.initData();
    },
    methods: {
      // 添加专题页
      showAddTopicDialog(row){
        if(row) {
          this.activityId = row.activityId +'';
          this.$refs.addTopic.getActivity(row.activityId);
        }
        this.dialogVisible = true;
      },
      // 删除专题页
      handleDel(){
        if(this.multipleSelection.length <= 0) {
          this.$message.warning("请先勾选要删除的选项！")
          return
        };
        let activityArr = [], activityIds = "";
        for (let i=0; i< this.multipleSelection.length; i++) {
          activityArr.push(this.multipleSelection[i].activityId)
        }
        activityIds = activityArr.join(",");
        this.$confirm('确定要删除吗?', '提示', {
            type: 'warning'
          }).then(_ => {
            API.deleteActivity({activityIds: activityIds})
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
      // 关闭专题页弹框
      closeDialog(val){
        if(val) {
          this.initData();
        }
        this.activityId = "";
        this.dialogVisible = false;
      },
      // 显示查看商品弹框
      handleViewCommodity(row){
        if(row) {
          this.activityId = row.activityId +'';
          this.$refs.viewCommodity.getActivity(row.activityId);
        }
        this.viewDialogVisible = true;
      },
      // 关闭查看商品弹框
      closeViewDialog(){
        this.activityId = "";
        this.viewDialogVisible = false;
      },
      initData() {
        let params = {
          page: this.table.currentPage,
          limit: this.table.pageSize,
          activityStatus: this.filters.activityStatus,
          activityName: this.filters.activityName,
        }
        if(this.filters.activityTime && this.filters.activityTime.length > 0) {
          params.activityStartTime = this.filters.activityTime[0];
          params.activityEndTime = this.filters.activityTime[1];
        }
        if(this.filters.updateTime && this.filters.updateTime.length > 0) {
          params.updateStartTime = this.filters.updateTime[0];
          params.updateEndTime = this.filters.updateTime[1];
        }
        API.getActivityList(params).then(res => {
          if (res.code == 0) {
            let base = process.env.API_ROOT
            console.log(base)
            let data = res.data.rows;
            for(let i in data) {
              let typeArr = res.data.rows[i].activityType.split(",");
              for (let j in typeArr) {
                if(typeArr[j] == 'PC') {
                  data[i].pcAddress = 'https://app.ymdb2b.com/#/homePage/topic?activityId=' + data[i].activityId
                } else if (typeArr[j] == 'APP') {
                  data[i].appAddress = 'https://app.ymdb2b.com/commonStatic/topic/index.html#/?activityId=' + data[i].activityId
                }
              }
            }
            this.table.total = res.data.total;
            this.table.data = data;
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
      //商品选择
      handleselectChange(val) {
        this.multipleSelection = val;
      },
      //点击添加商品行
      rowClick(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      tableRowClassName({row, rowIndex}) {
        let arr =  this.multipleSelection;
        for(let i = 0; i < arr.length; i++){
          if(row.activityId === arr[i].activityId){
            return 'rowStyle'
          }
        }
      },
      //关闭时清除user的dialog里的内容
      cancelDialog() {
        this.userDialogVisible = false;
        this.userLoading = false;
        this.$refs['userForm'].resetFields();
        this.clearData();
      },
       editState(activityId, type) {
        console.log(type)
        let msg = type == "1" ?  "禁用" : "启用";
        let disableStatus = type == "1"? "2": "1";
        this.$confirm("确认" + msg + "当前活动吗?", "提示!", {
          type: "warning"
          }).then(() => {
            let params = {
              activityId: activityId,
              disableStatus: disableStatus
            }
            API.updateDisableStatus(params).then(res => {
              if (res.code == 0) {
                this.$message.success("操作成功");
                this.initData();
              } else {
                this.$message.error(res.msg);
              }
            })
          }).catch(() => {
        });
      },
      previewTemplate(row) {
        let routeData = this.$router.resolve({path: '/topicView', query: {activityId: row.activityId}});
        window.open(routeData.href, '_blank');
      },
      copy(address){
        let oInput = document.createElement('input');
        oInput.value = address;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象;
        // console.log(oInput.value)
        document.execCommand("Copy"); // 执行浏览器复制命令
        this.$message.success("已成功复制到剪切板")
        oInput.remove()
      }
    }
  }
</script>

<style lang="scss">
.topic-manage{
  .edit_customer_dialog,.changelog_dialog{
    .el-dialog{
      width: 964px !important;
    }
  }
  .table-record{
    max-height: 600px;
    overflow-y: auto;
  }
  .edit-customer-form{
    max-height: 659px;
    overflow-y: auto;
    .el-row{
      .el-form-item{
        margin: 0 21px 20px 21px;
        &:first-child{
          margin-left: 0;
        }
      }
    }
    .el-input__inner{
      padding: 0 5px;
      width: 100% !important;
    }
    .el-cascader--small,.el-select{
      width: 100%;
    }
  }
  .el-range-editor--mini .el-range-separator {
    line-height: 25px;
  }

  .tips{
    padding-left: 15px;
    font-size: 12px;
    &.red{
      color:#FF270A;
    }
  }
  .m-colorPicker {
    .colorBtn{
      display: inline-block;
      width: 22px;
      height: 22px;
      border: 1px solid #dedede;
    }
    .box{
      z-index: 100;
    }
  }
  .color-item{
    .el-input{
      width: 226px;
      vertical-align: text-bottom;
    }
  }
  .commodity_data_setting {
    margin: 0px 0px 20px;
    line-height: 30px;
    .add_commodity_button {
      cursor: pointer;
      width: 76px;
      height: 30px;
      background: #0680FD;
      border-radius: 5px;
      display: inline-block;
      text-align: center;
      color: #fff;
    }
    .del_commodity_button {
      cursor: pointer;
      width: 76px;
      height: 30px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(222, 222, 222, 1);
      border-radius: 5px;
      display: inline-block;
      text-align: center;
      color: #666666;
    }
  }
  .btn-copy{
    margin-left: 15px;
    background: #F4F4F5;
    border: 1px solid #E5E6E7;
    padding: 2px 6px;
    border-radius: 5px;
    cursor: pointer;
  }
  // .search_bg_wrap{
  //   margin: 20px 0px;
  //   line-height: 30px;
  // }
}

</style>
