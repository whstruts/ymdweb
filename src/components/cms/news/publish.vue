<template>
  <div class="release_wrap">
    <div class="btn">
      <div class="setting_button_tag button_add" v-if="$utils.checkButton('new:add')" @click="isShowFbDialog=true">
        <i class="iconfont icon-xinjian"></i>
        <span>添加</span>
      </div>
    </div>
    <div class="search_bg_wrap">
      <div class="search-box flex-row"  v-if="isDisplaySearch">
        <p>
          <span class="search_hint">标题</span>
          <el-input
            placeholder
            size="small"
            clearable
            v-model="filters.title"
            @keyup.enter.native="handlequery"
          ></el-input>
        </p>
        <p>
          <span class="search_hint">活动时间</span>
          <el-select v-model="filters.type" @change="handleSearch" size="mini">
            <el-option label="长期有效" value></el-option>
            <el-option
              v-for="item in platformData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </p>
        <p>
          <span class="search_hint">更新时间</span>
          <el-date-picker
            v-model="filters.updateTime"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :editable="false"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            style="width: 205px"
          ></el-date-picker>
          <!-- <el-date-picker
            v-model="filters.createTime"
            type="date"
            placeholder="选择日期时间"
            :editable="false"
            style="width: 50%"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker> -->
        </p>
        <el-button size="mini" type="warning" @click="handlequery">
          <i class="iconfont icon-chaxun"></i>查询
        </el-button>
      </div>
      <a href="javascript:;" v-if="isDisplaySearch" class="opr-search-btn" @click="isDisplaySearch = false">收起<i class="iconfont icon-shouqi2"></i></a>
      <a href="javascript:;" v-if="!isDisplaySearch" class="opr-search-btn search-btn" @click="isDisplaySearch = true">查询<i class="iconfont icon-zhankai1"></i></a>
    </div>
    <!-- 发布组件 -->
    <editfb-dialog
      :fbDialogVisible="isShowFbDialog"
      @closeEvent="handleCloseFb()"
      @determineEvent="determineCloseFb()"
      :fbItemInfo="fbItemInfo"
    ></editfb-dialog>

    <div class="wrap_main flex-item scrollbar">
      <el-table :data="table.data" height="100%" border class="my_table" style="width: 100%">
        <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <div class="table_setting_button">
              <el-button
                type="primary"
                plain
                size="mini"
                v-if="$utils.checkButton('new:edit')"
                @click="editTemplate(scope.$index)"
              >编辑</el-button>
              <el-button
                plain
                type="danger"
                size="mini"
                v-if="$utils.checkButton('new:del')"
                @click="deleteTemplate(scope.row.id)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="869px"></el-table-column>
        <!-- <el-table-column label="发布内容" :show-overflow-tooltip="true" >
           <template slot-scope="scope">
            <span v-html="scope.row.content"></span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column prop="type" label="活动时间" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.type == '0' ?'长期有效':'自定义'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" label="发布时间" width="300px"></el-table-column>
        <el-table-column prop="userName" label="发布人" width="300px"></el-table-column>
      </el-table>
    </div>
    <div class="setting_pagination" v-if="table.total>0">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 50, 100, 150]"
        small
        :total="table.total"
        :current-page.sync="table.currentPage"
        :page-size="table.pageSize"
      ></el-pagination>
      <el-button type="primary" size="mini" plain>确 定</el-button>
    </div>
  </div>
</template>

<script>
import API from '../../../api/api_drugnews'
import editfbDialog from './commons/editFbDialog'
export default {
  name: "new",
  components:{editfbDialog},
  data() {
    return {
      isDisplaySearch: true,
      isShowFbDialog: false,
      fbItemInfo:{},
      filters: {
        title:'',
        type: '',
        updateTime:'',
      },
      platformData:[
      ],
      table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
    }
  },
  created() {
    this.initData()
  },
  methods: {
     async initData() {
      let params = {
         limit: this.table.pageSize,
         page: this.table.currentPage,
         title: this.filters.title,
         type:this.filters.type,
      }
      if(this.filters.updateTime && this.filters.updateTime.length>0){
        params.beginDate = this.filters.updateTime[0]
        params.endDate = this.filters.updateTime[1]
      }
      const res = await API.newslist(params)
        if (res.code == 0) {
          this.table.data = res.page.rows;
          this.table.total = res.page.total;
        } else {
          this.$message.error(res.msg)
        }
    },
     //分页
      handleCurrentChange(val) {
        console.log(val);
        this.table.currentPage = val;
        this.initData();
      },
      handleSizeChange(val) {
        this.table.pageSize = val;
        this.initData();
      },
      handleSearch() {
        console.log(123);
        // this.initData();
      },
    //删除模板
    deleteTemplate(id) {
      this.$confirm('确定删除模板?', '提示', {
        type: 'warning'
      }).then(() => {
        API.newsdelete({id}).then(res => {
          if (res.code == 0) {
            this.$message.success(res.msg)
            this.initData();
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch({

      })
    },
    //编辑模块
    editTemplate(index) {
      this.isShowFbDialog=true;
      let obj =  this.table.data[index];
      obj.isModify = true;
      this.fbItemInfo = obj;
    },
    handlequery() {
      this.initData();
    },
    determineCloseFb() {
      this.isShowFbDialog = false;
      this.initData()
    },
    handleCloseFb() {
      this.isShowFbDialog = false;
      this.fbItemInfo = {};
    },
  }
}
</script>
<style lang="scss">
.release_wrap{
  .btn {
    width: 60px;
    margin-top :10px;
    padding: 0 10px;
    line-height: 29px;
    border-radius: 5px;
    background-color: #0680FD;
    cursor: pointer;
    color: #fff;
  }
  .btn i {
    font-size: 12px;
    margin-right: 8px;
  }
  .el-select .el-input .el-select__caret {
    vertical-align: bottom;
  }
/*  .el-tooltip {
    word-break: break-all;
    white-space: nowrap;
    overflow: hidden;
    height: 20px;
    display: block;
    text-overflow: ellipsis;
  }*/

}
/*.el-tooltip__popper {
    width: 50% !important;
    background-color: #5A5A5A !important;
  }*/
</style>
