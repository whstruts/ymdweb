<template>
  <div class="release_wrap">
    <div class="search_bg_wrap">
      <div class="search-box flex-row"  v-if="isDisplaySearch">
        <p>
          <span class="search_hint">应用平台</span>
          <el-select v-model="filters.type" @change="handleSearch" size="mini">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in platformData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </p>
        <P>
          <el-input placeholder="主题名称/版本号" @keyup.enter.native="handleSearch" v-model="filters.name"
                  size="small" clearable style="width: 240px;margin-right: 10px"></el-input>
        </P>
        <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询
        </el-button>
      </div>
      <a href="javascript:;" v-if="isDisplaySearch" class="opr-search-btn" @click="isDisplaySearch = false">收起<i class="iconfont icon-shouqi2"></i></a>
      <a href="javascript:;" v-if="!isDisplaySearch" class="opr-search-btn search-btn" @click="isDisplaySearch = true">查询<i class="iconfont icon-zhankai1"></i></a>
    </div>
    <div class="wrap_main flex-item scrollbar">
      <el-table :data="table.data" height="100%" border class="my_table" style="width: 100%">
        <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <!-- <p class="setting_button"
                v-if="$utils.checkButton('release:edit')">
               <span @click="editTemplate(scope.row)">编辑</span>
             </p>
             <p class="setting_button"
                v-if="$utils.checkButton('release:preview')">
               <span @click="previewTemplate(scope.row.versionId)">预览</span>
             </p>-->
            <div class="table_setting_button">
              <el-button type="primary" plain size="mini" v-if="$utils.checkButton('release:edit')"
                         @click="editTemplate(scope.row)">编辑
              </el-button>
              <el-button plain size="mini" v-if="$utils.checkButton('release:preview')"
                         @click.stop="previewTemplate(scope.row)">预览
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="应用平台">
          <template slot-scope="scope">
            <span>{{scope.row.type == '1' ?'APP':'PC'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="subject" label="主题名称"></el-table-column>
        <el-table-column prop="content" label="发布内容"></el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="200px"></el-table-column>
        <el-table-column prop="publishUserName" label="发布人"></el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.state=='1'?'#00b78d':'#CECECE'}">{{scope.row.state=='1'?'当前版本':'历史版本'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="versionNo" label="版本号"></el-table-column>
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
  </div>
</template>

<script>
  import API from "../../api/api_cms_record"
  import TEM from "../../api/api_homeSetting"

  export default {
    name: "releaseRecord",
    data() {
      return {
        isDisplaySearch: true,
        filters: {
          type: "",
          name:""
        },
        platformData:[
          {
            label: "APP",
            value:'1'
          },
          {
            label: "PC",
            value:'2'
          }
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
      this.initData();
    },
    methods: {
      initData() {
        let param = {
          limit: this.table.pageSize,
          page: this.table.currentPage,
          state: "",
          keyword: this.filters.name,
          type: this.filters.type
        }
        API.getPublishVersionList(param).then(res => {
          if (res.code == 0) {
            this.table.data = res.page.rows;
            this.table.total = res.page.total;
          } else {
            this.$message.error(res.msg)
          }
        })
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
      //编辑模板
      editTemplate(item) {
        let query = {versionId: item.versionId, subject: item.subject, content: item.content}
        if(item.type == 1) {
          this.$router.push({
          path: "/cms/app/homeSetting",
          query: query
        })
        } else {
          this.$router.push({
            path: "/cms/homeSetting",
            query: query
          })
        }

      },
      //预览模板
      previewTemplate(item) {
        if(item.type == 1) {  // APP
          TEM.getAppTemplate({versionId: item.versionId}).then(res => {
            if (res.code == 0) {
              let data = {
                bannerData: res.template.bannerData,
                iconData: res.template.iconData,
                settingDataList: res.template.settingDataList
              };
              let routeData = this.$router.resolve({path: '/appPreview', query: {data: JSON.stringify(data)}});
              window.open(routeData.href, '_blank');
            } else {
              this.$message.error(res.msg)
            }
          })
        } else { // PC
          TEM.getTemplate({versionId: item.versionId}).then(res => {
            if (res.code == 0) {
              let data = {
                navigationBar: res.template.navigationBar,
                bannerData: res.template.bannerData,
                settingDataList: res.template.settingDataList
              };
              let routeData = this.$router.resolve({path: '/preview', query: {data: JSON.stringify(data)}});
              window.open(routeData.href, '_blank');
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      }
      ,
      handleSearch() {
        this.initData();
      }
      ,
    }
  }
</script>

<style scoped>

</style>
