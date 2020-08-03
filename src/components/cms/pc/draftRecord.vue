<template>
  <div class="release_wrap">
    <div class="search_bg_wrap flex-row">
      <el-input placeholder="主题名称" @keyup.enter.native="handleSearch" v-model="filters.name"
                size="small" clearable style="width: 240px;margin-right: 10px"></el-input>
      <el-button size="mini" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询
      </el-button>
    </div>
    <div class="wrap_main flex-item scrollbar">
      <el-table :data="table.data" border height="100%" class="my_table " style="width: 100%">
        <el-table-column type="index" label="序号" width="100px" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="280px">
          <template slot-scope="scope">
       <!--     <p class="setting_button" v-if="$utils.checkButton('draft:edit')">
              <span @click="editTemplate(scope.row)">编辑</span>
            </p>
            <p class="setting_button" v-if="$utils.checkButton('draft:preview')">

              <span @click="previewTemplate(scope.row.versionId)">预览</span>
            </p>
            <p class="setting_button" v-if="$utils.checkButton('draft:release')">
              <span @click="releaseTemplate(scope.row.versionId)"> 立即发布</span>
            </p>
            <p class="setting_button" v-if="$utils.checkButton('draft:delete')">
              <span @click="deleteTemplate(scope.row.versionId)">删除</span>
            </p>
-->
            <div class="table_setting_button">
              <el-button type="primary" plain size="mini" v-if="$utils.checkButton('draft:release')"
                         @click="releaseTemplate(scope.row.versionId)">立即发布
              </el-button>
              <el-button type="primary" plain size="mini" v-if="$utils.checkButton('draft:edit')"
                         @click="editTemplate(scope.row)">编辑
              </el-button>
              <el-button plain size="mini" v-if="$utils.checkButton('draft:preview')"
                         @click="previewTemplate(scope.row.versionId)">预览
              </el-button>
              <el-button plain type="danger" size="mini" v-if="$utils.checkButton('draft:delete')"
                         @click="deleteTemplate(scope.row.versionId)">删除
              </el-button>
            </div>

          </template>
        </el-table-column>
        <el-table-column prop="subject" label="主题名称" align="center"></el-table-column>
        <el-table-column prop="content" label="修改内容" align="center"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
        <el-table-column prop="createUserName" label="操作人" align="center"></el-table-column>
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
  import API from "../../../api/api_cms_record"
  import TEM from "../../../api/api_homeSetting"

  export default {
    name: "draftRecord",
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
          state: "0",
          keyword: this.filters.name
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
      handleSearch() {
        this.initData();
      },
      //编辑模板
      editTemplate(item) {
        this.$router.push({
          path: "/cms/homeSetting",
          query: {versionId: item.versionId, subject: item.subject, content: item.content}
        })
      },
      //删除模板
      deleteTemplate(versionId) {
        this.$confirm('确定删除模板?', '提示', {
          type: 'warning'
        }).then(() => {
          API.delTemplate({versionId}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg)
              this.initData();
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {

        });
      },
      //预览模板
      previewTemplate(versionId) {
        TEM.getTemplate({versionId}).then(res => {
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
      },
      //立即发布
      releaseTemplate(versionId) {
        this.$confirm('确定发布该模板?', '提示', {
          type: 'warning'
        }).then(() => {
          API.publishNowTemplate({versionId}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg)
              this.initData();
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
        });
      }
    }
  }
</script>

<style scoped>

</style>
