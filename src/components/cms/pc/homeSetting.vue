<template>
  <div class="home_setting">
    <div class="setting_button_bg">
  <!--    <div class=" setting_button_tag button_add" @click="addSettingItem('merchant')">
        <i class="iconfont icon-xinjian"></i><span>商家推荐</span>
      </div>-->
      <div class=" setting_button_tag button_add" @click="addSettingItem('commodity')">
        <i class="iconfont icon-xinjian"></i><span>商品推荐</span>
      </div>
      <div class=" setting_button_tag button_add" @click="addSettingItem('ad')">
        <i class="iconfont icon-xinjian"></i><span>中缝广告</span>
      </div>
    </div>
    <div class="setting_title">
      <span class="title_max">编辑区</span>
      <span class="title_min">导航栏菜单、baner图模块不可删除</span>
      <div class="setting_operating flex-row">
        <div class="operation_button" @click="saveSettingData(false)" v-if="$utils.checkButton('template:save')">保存为草稿
        </div>
        <div class="operation_button" @click="saveSettingData(true)" v-if="$utils.checkButton('template:save')">立即发布
        </div>
        <div class="operation_button2" @click="previewTemplate">预览</div>
      </div>
    </div>
    <div class="setting_edit_area flex-column">
      <navigation-bar class="setting_bar" :navigationBarData="navigationBar" :jumpData="jumpData" :jumpPages="jumpPages"
                      :compare="compare"
                      @submitBarData="submitBarData"></navigation-bar>
      <banner-img class="setting_banner" :bannerData="bannerData" :compare="compare"
                  @submitBannerData="submitBannerData" :jumpData="jumpData" :jumpPages="jumpPages"></banner-img>

      <draggable
        :options="draggableOptions" v-model="settingDataList" @end="end">
        <div v-for="(item,index) in settingDataList" :key="index">
          <merchant class="setting_merchant" v-if="item.identifier=='merchant'"
                    :merchantData="item"
                    :fIndex="index"
                    :compare="compare"
                    @merchantSubmitData="merchantSubmitData" @delSetting="delSetting"></merchant>
          <commodity class="setting_commodity" v-if="item.identifier=='commodity'" :commodityData="item"
                     :fIndex="index" @commoditySubmitData="commoditySubmitData" @delSetting="delSetting"
                     :jumpData="jumpData" :jumpPages="jumpPages"></commodity>

          <ad class="setting_ad" v-if="item.identifier=='ad'" :adData="item"
              :fIndex="index" @adSubmitData="adSubmitData" @delSetting="delSetting" :jumpData="jumpData"
              :jumpPages="jumpPages"></ad>
        </div>

      </draggable>
    </div>
    <el-dialog
      :title="dialogSettingTitle"
      :visible.sync="dialogSettingVisible"
      class="cms_dialog_visible setting_dialog"
      width="585px"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="dialog_body" style="background: #fff;padding-bottom: 0px;padding-top: 22px">
        <el-form :model="formData" :rules="rules" ref="formData" label-width="0px" class="demo-ruleForm">
          <el-form-item label="" prop="name">
            <el-input v-model="formData.name" placeholder="主题名称" maxlength="10" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="" prop="desc">
            <el-input type="textarea" placeholder="请描述下修改了哪些内容..." :rows="6" maxlength="500" show-word-limit
                      v-model="formData.desc"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button @click="handleClose">&nbsp;&nbsp;&nbsp;取&nbsp;消&nbsp;&nbsp;&nbsp;</el-button>
            <el-button type="primary" @click="submitSettingFormData('formData')">立即创建
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import navigationBar from "../../common/cms/pc/navigationBar"
  import bannerImg from "../../common/cms/pc/bannerImg"
  import commodity from "../../common/cms/pc/commodity"
  import ad from "../../common/cms/pc/ad"
  import merchant from "../../common/cms/pc/merchant"
  import draggable from 'vuedraggable'
  import API from "../../../api/api_homeSetting"

  export default {
    name: "homeSetting",
    components: {navigationBar, bannerImg, commodity, ad, merchant, draggable},
    data() {
      return {
        draggableOptions: {
          group: 'setting',//名字
          sort: true, //内部排序
          animation: 150, // ms, 动画速度运动项目排序时
          ghostClass: 'sortable-ghost', // 设置拖动元素的class的占位符的类名。
          chosenClass: 'chosenClass',// 设置被选中的元素的class
          scroll: true,
          handle: '.my-handle',
        },
        jumpPages: [
          {id: '0', val: '搜索列表'},
          {id: '1', val: '历史采购'},
          {id: '2', val: '我的关注'},
          {id: '3', val: '我的缺货篮'},
        ],
        jumpData: [
          {id: 0, val: '跳转到页面'},
          {id: 1, val: '活动'},
          {id: 2, val: '商品'},
          {id: 3, val: '外部链接'},
          {id: 4, val: '无'},
        ],
        navigationBar: [{columnName: "", sort: "", eventDate: "", jumpPage: 0, linkAddress: "", keyword: ""}],
        bannerData: [{eventDate: "", imgUrl: "", sort: "", jumpPage: 0, linkAddress: "", keyword: ""}],
        settingDataList: [],
        dialogSettingTitle: "保存为草稿",
        dialogSettingVisible: false,
        formData: {
          name: "",
          desc: ""
        },
        rules: {
          name: [
            {required: true, message: '请输入主题名称', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请输入备注', trigger: 'blur'}
          ],
        },
        templateStatus: false, //是否保存为草稿  true是立即发布，false草稿
        versionId: "",
        templateComplete: 0,//表示模板是否完整 0 不完整 1完整，用于在草稿的发布记录中点击立即发布时验证

      }
    },
    created() {

      this.versionId = this.$route.query.versionId;

      this.getCurTemplate();
    },
    destroyed() {
      this.$destroy();
    },
    methods: {
      /**
       * 获取当前模板详情
       */
      getCurTemplate() {
        let fun = null;
        if (this.versionId) {
          fun = API.getTemplate({versionId: this.versionId});
          //获取当前最新模板信息
        } else {
          //根据版本号获取草稿箱或者已发布的模板信息
          fun = API.getCurTemplate();
        }
        fun.then(res => {
          if (res.code == 0) {
            if (!res.template){
              this.addSettingItem('commodity');
              this.addSettingItem('ad');
              return;
            }
            this.navigationBar = res.template.navigationBar;
            this.bannerData = res.template.bannerData;
            this.settingDataList = res.template.settingDataList;
          } else if (res.code == 500) { //res.code==500 未找到模板数据
            //手动添加默认数据
            this.addSettingItem('merchant');
            this.addSettingItem('commodity');
            this.addSettingItem('ad');
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleClose() {
        /* this.$confirm('确认关闭?', '提示', {
           type: 'warning'
         }).then(() => {
           this.formData = {
             name: "",
             desc: ""
           };
           this.$refs["formData"].resetFields();
           done();
         }).catch(() => {

         });*/
        this.formData = {
          name: "",
          desc: ""
        };
        this.$refs["formData"].resetFields();
        this.dialogSettingVisible = false
      },
      saveSettingData(status) {
        if (status) {
          this.dialogSettingTitle = "立即发布"
          let mark = this.checkData(status);
          if (!mark) {
            return
          }
        } else {
          let mark = this.checkData(status);
          if (mark) {
            //代表模板完整
            this.templateComplete = 1;
          } else {
            //代表模板不完整
            this.templateComplete = 0;
          }
          this.dialogSettingTitle = "保存为草稿"
        }
        if (this.versionId) {
          this.formData.name = this.$route.query.subject;
          this.formData.desc = this.$route.query.content;
        }
        this.dialogSettingVisible = true;
        this.templateStatus = status;
      },
      checkData(status) {
        //第0个表示是默认的栏目。要修改。。如果添加的栏目会在添加栏目里面有拦截
        if (this.navigationBar && (this.navigationBar.length <= 0 || !this.navigationBar[0].columnName)) {
          if (status) {
            this.$message.error("请完善模板栏目信息!");
          }
          return false;
        }
        //第0个表示是默认的banner图。要修改。。如果添加的banner图会在添加banner图里面有拦截
        if (!this.bannerData[0].imgUrl) {
          if (status) {
            this.$message.error("请完善Banner图片信息!");
          }
          return false;
        }
        let dataLength = this.settingDataList.length;
        let mark = true;
        for (let i = 0; i < dataLength; i++) {
          let data = this.settingDataList[i];
          let msg = this.dataVerification(data);
          if (msg != null) {
            mark = false;
            if (status){
              this.$message.error(msg);
            }
            break;
          }
        }
        return mark;
      },
      dataVerification(rows) {
        let data = rows.data;
        let identifier = rows.identifier;
        let navBar = rows.navBar;
        if (identifier != "ad" && (!navBar.title || navBar.title == "")) {
          return "请完善模板导航栏信息!";
        }
        if (identifier == 'commodity') {
          let status = false;
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
          /*  console.log(item.drugSkuCode, item.commodityId,item)
            if (!item.drugSkuCode || !item.commodityId) {
              status = true;
              break;
            }*/
            if ( !item.commodityId) {
              status = true;
              break;
            }
          }
          if (status) {
            return "请完善模板商品信息!";
          }
        } else {
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (!item.imgUrl || item.imgUrl == "") {
              return "请完善模板图片信息!";
            }
          }
        }
        return null;
      },
      submitSettingFormData() {
        this.$refs["formData"].validate((valid) => {
          if (valid) {
            let data = {
              navigationBar: this.navigationBar,
              bannerData: this.bannerData,
              settingDataList: this.settingDataList
            };
            let param = {
              content: this.formData.desc,
              subject: this.formData.name,
              template: JSON.stringify(data),
              state: this.templateStatus ? "1" : "0",
              versionId: ""
            }
            if (!this.templateStatus) {
              param.templateComplete = this.templateComplete;
            }
            if (this.versionId) {
              //如果点击的是立即发布 版本号为0
              param.versionId = this.templateStatus ? "" : this.versionId;
            }
            API.saveTemplate(param).then(res => {
              if (res.code == 0) {
                this.$message.success(res.msg)
                this.dialogSettingVisible = false;
                this.$refs["formData"].resetFields();
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            return false;
          }
        });
      },
      //预览
      previewTemplate() {
        let data = {
          navigationBar: this.navigationBar,
          bannerData: this.bannerData,
          settingDataList: this.settingDataList
        };
        let routeData = this.$router.resolve({path: '/preview', query: {data: JSON.stringify(data)}});
        window.open(routeData.href, '_blank');
      },
      //添加设置模块
      addSettingItem(identifier) {
        let item = {
          identifier: identifier,
          data: [],
        };
        if (identifier == 'merchant') {
          item.navBar = {title: "", subtitle: "", moreButton: 0, jumpPage: 0, linkAddress0: "0", keyword: ""};
          for (let i = 0; i < 4; i++) {
            item.data.push({eventDate: "", imgUrl: "", sort: "", jumpPage: 0, linkAddress0: "0", keyword: ""})
          }
        } else if (identifier == 'commodity') {
          item.navBar = {title: "", subtitle: "", moreButton: 0, jumpPage: 0, linkAddress0: "0", keyword: ""};
          item.mainPicture = {eventDate: "", imgUrl: "", jumpPage: 0, linkAddress0: "0", keyword: ""};
          for (let i = 0; i < 8; i++) {
            item.data.push({})
          }
        } else if (identifier == 'ad') {
          item.data = [{eventDate: "", imgUrl: "", jumpPage: 0, linkAddress0: "0", keyword: ""}];
        }
        this.settingDataList.push(item)
      }
      ,
      //商家推荐子组件修改自己的数据
      merchantSubmitData(data, index) {
        // this.settingDataList[index] = Object.assign({}, data);
        this.settingDataList[index].navBar = data.navBar;
        this.settingDataList[index].data = data.data;
      },
      //navigationBar的修改
      submitBarData(data) {
        this.navigationBar = data;
      },
      //banner的修改
      submitBannerData(data) {
        this.bannerData = data;
      },
      //中缝广告的修改
      adSubmitData(data, index) {
        this.settingDataList[index].data = data;
      },
      //商品信息的修改
      commoditySubmitData(data, index) {
        this.settingDataList[index].navBar = data.navBar;
        this.settingDataList[index].mainPicture = data.mainPicture;
        this.settingDataList[index].data = data.data
      },
      //子组件删除自身
      delSetting(index) {
        this.settingDataList.splice(index, 1)

      },
      //数组中根据sort来进行排序
      compare(property) {
        return function (a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
        }
      }
      ,
      end(evt) {
        // console.log(this.settingDataList)
        evt.item //可以知道拖动的本身
        evt.to    // 可以知道拖动的目标列表
        evt.from  // 可以知道之前的列表
        evt.oldIndex  // 可以知道拖动前的位置
        evt.newIndex  // 可以知道拖动后的位置
      }
      ,
    }
  }
</script>

<style lang="scss">
  .home_setting {
    height: 100%;
    min-width: 1200px;
    .setting_button_tag {
      margin-right: 10px;
    }
    /*    .setting_top {

        }*/
    .setting_title {
      margin-top: 20px;
      .title_max {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      .title_min {
        color: #F67A16;
        margin-left: 13px;
      }
      .setting_operating {
        float: right;
        text-align: center;
        line-height: 39px;
        div {
          width: 80px;
          height: 30px;
          line-height: 30px;
          border-radius: 5px;
          cursor: pointer;
        }
        .operation_button {
          border: 1px solid #DEDEDE;
          color: #333;
          margin-right: 10px;
        }
        .operation_button2 {
          background: #0680FD;
          color: #fff;
        }
      }
    }
    .setting_edit_area {
      border: 1px solid rgba(222, 222, 222, 1);
      margin-top: 25px;
      align-items: center;
      padding: 0px 45px 80px;
      box-sizing: border-box;
      min-width: 1100px;
      /*height: auto;*/
      flex: 1;
      overflow-y: auto;
      .setting_bar {
        margin-top: 64px;
      }
      .setting_banner, .setting_commodity, .setting_merchant, .setting_ad {
        margin-top: 55px;
      }
    }
    /*拖拽*/
    .my-handle {
      position: absolute;
      left: 940px;
      top: 50%;
      cursor: move;
    }

  }
</style>
