<template>
  <div class="home_setting">
    <div class="setting_button_bg">
      <div class=" setting_button_tag button_add" @click="addSettingItem('floor',true)">
        <i class="iconfont icon-xinjian"></i><span>楼层</span>
      </div>
      <div class=" setting_button_tag button_add" @click="addSettingItem('ad', true)">
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
    <div class="active-time">
      <el-form inline>
        <el-form-item label="活动时间">
          <el-radio-group v-model="qxType">
            <el-radio label="1">长期有效</el-radio>
            <!-- <el-radio label="2">临时版本(自定义时间)</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.type == 2">
          <el-date-picker
          v-model="formData.time"
            type="datetimerange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd" style="width:320px"></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="setting_edit_area">
      <div class="phone-area">
        <img class="phone-top" src="../../../assets/img/cms/phone_top.png"/>
          <banner-img  :bannerData = 'bannerData' @editBanner="handleEditBanner"></banner-img>
          <icon-img></icon-img>
          <draggable :options="draggableOptions" v-model="settingDataList">
            <div v-for="(item, index) in settingDataList" :key="index">
              <ad v-if="item.identifier == 'ad'" :adData='item':fIndex="index"  @delAd="handleDel('ad',index)"></ad>
              <floor-img  v-if="item.identifier == 'floor'" :floorData='item' :fIndex="index" @delFloor="handleDel('floor',index)"></floor-img>
            </div>
        </draggable>
      </div>
      <div class="add-area">
        <add-banner :bannerData = 'bannerData' @submitBannerData="submitBannerData"></add-banner>
        <add-icon :iconData = 'iconData' @submitIconData="submitIconData"></add-icon>
        <add-ads  @submitAdData="submitAdData"></add-ads>
        <add-floor @submitFloorData="submitFloorData"></add-floor>
      </div>
    </div>
    <!-- 保存草稿和立即发布的弹框 -->
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

            <el-button type="primary" @click="submitSettingFormData('formData')"
            >立即创建
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import bannerImg from "../../common/cms/app/bannerImg"
  import addBanner from "../../common/cms/app/addBanner"
  import iconImg from "../../common/cms/app/iconImg"
  import addIcon from "../../common/cms/app/addIcon"
  import ad from "../../common/cms/app/ad"
  import addAds from "../../common/cms/app/addAds"
  import floorImg from "../../common/cms/app/floorImg"
  import addFloor from "../../common/cms/app/addFloor"
  import API from "../../../api/api_homeSetting"
  export default {
    name: "appHomeSetting",
    components: {draggable,bannerImg,iconImg,ad,floorImg,addBanner,addIcon,addAds,addFloor},
    data() {
      return {
        qxType: "1", // 效期类型
        draggableOptions: {
          group: 'setting',//名字
          sort: true, //内部排序
          animation: 150, // ms, 动画速度运动项目排序时
          ghostClass: 'sortable-ghost', // 设置拖动元素的class的占位符的类名。
          chosenClass: 'chosenClass',// 设置被选中的元素的class
          scroll: true,
        },
        bannerData:[],
        iconData:[],
        floorData: [],
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
        templateStatus: false,
        templateComplete: 0,  // 模板是否完整  0 不完整 1 完整
        versionId: "",
      }
    },
    created() {
      this.versionId = this.$route.query.versionId;
      console.log(this.versionId)
      this.getAppCurTemplate();
    },
    methods: {
      /**
       * 获取当前模板详情
       */
      getAppCurTemplate() {
        let fun = null;
        if (this.versionId) {
          fun = API.getAppTemplate({versionId: this.versionId,userId: ''});
          //获取当前最新模板信息
        } else {
          //根据版本号获取草稿箱或者已发布的模板信息
          fun = API.getAppCurTemplate({userId: ''});
        }
        fun.then(res => {
          if (res.code == 0) {
            if(res.template != null) {
              this.bannerData = res.template.bannerData;
              this.iconData = res.template.iconData;
              this.settingDataList = res.template.settingDataList;
            } else {
              //手动添加默认数据
              this.bannerData =[];
              this.iconData= [];
              this.addSettingItem('ad');
              this.addSettingItem('floor');

            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 添加楼层
      addSettingItem(identifier,bool){
        let item = {
          identifier: identifier
        };
        if (identifier == 'ad') {
          item.adInfo = {imgUrl: "", jumpPage: "", linkAddress: "",txt: ""};
        } else if( identifier == 'floor') {
          item.floorTitle = {imgUrl: "", jumpPage: "", linkAddress: "",txt: ""};
        }
        this.settingDataList.push(item);
        if(bool) {
          this.$message.success("添加成功，请完善信息！")
        }

      },
      // 删除中缝广告和楼层
      handleDel(identifier, index){
        console.log(identifier)
        let title =  '';
        if(identifier == 'ad') {
          title = '确认要删除该条中缝广告吗？'
        } else {
          title = '确认要删除该楼层吗？'
        }
         this.$confirm(title)
          .then(_ => {
            this.settingDataList.splice(index,1);
          })
          .catch(_ => {});

      },
      // banner修改
      submitBannerData(val){
        this.bannerData = val;
      },
      // icon修改
      submitIconData(val){
        this.iconData = val;
      },
      // ad修改
      submitAdData(val,index) {
        console.log(val)
        console.log(index);
        this.$set(this.settingDataList,index,val)
      },
      // floor修改
      submitFloorData(val,index){
        this.$set(this.settingDataList,index,val)
      },
      handleClose(done) {
        this.$confirm('确认关闭?', '提示', {
          type: 'warning'
        }).then(() => {
          this.formData = {
            name: "",
            desc: ""
          };
          this.$refs["formData"].resetFields();
          done();
        }).catch(() => {

        });
      },
      // 点击保存草稿和立即发布
      saveSettingData(status) {
        if (status) {
          // 判断banner图信息
          if (this.bannerData.length <= 0) {
            this.$message.error("请完善Banner图片信息!");
            return;
          }
          if (this.iconData.length <= 0) {
            this.$message.error("请完善icon信息!");
            return;
          }
          let dataLength = this.settingDataList.length;
          for (let i = 0; i < dataLength; i++) {
            let data = this.settingDataList[i];
            if(data.identifier == 'ad') {
              if(data.adInfo.imgUrl == "") {
                this.$message.error("请完善中缝广告信息!");
                return;
              }

            }
            if(data.identifier == 'floor'){
              if(data.floorTitle.imgUrl == "" ) {
                this.$message.error("请完善楼层信息!");
                return;
              }
            }

          }
          this.templateComplete = 1;
          this.dialogSettingTitle = "立即发布"

        } else {
          this.templateComplete = this.judgeTemplate();
          this.dialogSettingTitle = "保存为草稿"
        }
        if (this.versionId) {
          this.formData.name = this.$route.query.subject;
          this.formData.desc = this.$route.query.content;
        }
        this.dialogSettingVisible = true;
        this.templateStatus = status;
      },
      // 判断模板是否完整
      judgeTemplate() {
         // 判断banner图信息
          if (this.bannerData.length <= 0) {
            return 0;
          }
          if (this.iconData.length <= 0) {
            return 0;
          }
          let dataLength = this.settingDataList.length;
          for (let i = 0; i < dataLength; i++) {
            let data = this.settingDataList[i];
            if(data.identifier == 'ad') {
              if(data.adInfo.imgUrl == "") {
                return 0;
              }

            }
            if(data.identifier == 'floor'){
              if(data.floorTitle.imgUrl == "" ) {
                return 0;
              }
            }
          }
          return 1;

      },
      submitSettingFormData() {
        this.$refs["formData"].validate((valid) => {
          if (valid) {
            let data = {
              bannerData: this.bannerData,
              iconData: this.iconData,
              settingDataList: this.settingDataList
            };
            console.log(data)
            let param = {
              content: this.formData.desc,
              subject: this.formData.name,
              template: JSON.stringify(data),
              state: this.templateStatus ? "1" : "0",
              templateComplete: this.templateComplete,
              versionId: ""
            }
            console.log(param)
            if (this.versionId) {
              //如果点击的是立即发布 版本号为0
              param.versionId = this.templateStatus ? "" : this.versionId;
            }

            API.saveAppTemplate(param).then(res => {
              if (res.code == 0) {
                this.$message.success(res.msg)
                this.dialogSettingVisible = false;
                this.templateStatus = false;
                this.templateComplete = 0;
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
          bannerData: this.bannerData,
          iconData: this.iconData,
          settingDataList: this.settingDataList
        };
        let routeData = this.$router.resolve({path: '/appPreview', query: {data: JSON.stringify(data)}});
        window.open(routeData.href, '_blank');
      },
      handleEditBanner(){

      }
    }
  }
</script>

<style lang="scss">
  .home_setting {
    height: 100%;
    .setting_button_tag {
      margin-right: 10px;
    }
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
    .active-time{
      margin-top: 13px;
      padding: 6px 14px;
      background-color: #F8F8F8;
      .el-form-item{
        margin-bottom: 0;
      }
    }
    .setting_edit_area {
      position: relative;
      border: 1px solid rgba(222, 222, 222, 1);
      margin-top: 25px;
      align-items: center;
      padding: 0px 62px 80px;
      box-sizing: border-box;
      min-width: 1100px;
      /*height: auto;*/
      flex: 1;
      overflow-y: auto;
      .phone-area{
        float: left;
        margin-top: 56px;
        padding: 0 14px 10px;
        width: 405px;
        height: 720px;
        border: 1px solid #DEDEDE;
        overflow-y: auto;
        overflow-x: hidden;
        box-sizing: border-box;
        .phone-top{
          padding: 10px 0;
          width: 100%;
        }
      }
      .add-area{
        .app-add-container{
          float: left;
          position: relative;
          margin:  100px 0 0 48px;
          box-sizing: border-box;
          width: 412px;
          height: 709px;
          overflow: height;
          background: #f8f8f8;
          border-radius: 3px;
          box-shadow: 0 0 5px rgba(222,222,222,1);
          box-sizing: border-box;
          &:before{
            position: absolute;
            content: "";
            left: -13px;
            top: 45px;
            width: 0;
            height: 0;
            border-left: 0;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-right: 13px solid #f8f8f8;
          }
          &:after{
            position: absolute;
            content: "";
            left: -12px;
            top: 45px;
            width: 0;
            height: 0;
            border-left: 0;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-right: 13px solid #F8F8F8;
          }
        }
        .scroll-wrap{
          height: 100%;
          padding: 0 14px 77px 14px;
          overflow-y: auto;
          box-sizing: border-box;
        }
      }
      .title{
        padding-top: 10px;
        font-size: 15px;
        font-weight: bold;
        color: #333333;
      }
      .advice{
        font-size: 14px;
        color: #666666;
      }
      .add-item{
        position: relative;
        margin-top: 22px;
        padding: 21px 13px 18px;
        background: #ffffff;
        cursor: move;
        .icon-del{
          position: absolute;
          top: -11px;
          right: -5px;
          cursor: pointer;
        }
        .upload-box{
          width: 126px;
          height: 74px;
          line-height: 47px;
          text-align: center;
          background-color: #F8F8F8;
        }
        .el-upload{
          width: 100%;
          height: 74px;
          line-height: 74px;
        }
        .banner-upload-box{
          &.upload-box{
            height: 47px;
          }
          .el-upload{
            height: 47px;
            line-height: 47px;
          }
        }
        .avatar-uploader-icon{
          font-size: 18px;
          color: #DEDEDE;
        }
        .add-content{
          padding-left: 10px;
          overflow: hidden;
          .add-link{
            font-size: 14px;
            color: #333333;
            a{
              font-size: 14px;
              color: #3C7AC1;
            }
          }
          .input-box{
            padding-top: 10px;
            font-size:14px;
            .el-input__inner{
              height: 35px;
              line-height: 35px;
            }
          }

        }
      }
      .fixed-footer{
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0 13px;
        width: 100%;
        height: 55px;
        line-height: 55px;
        background: #fff;
        text-align: right;
        box-sizing: border-box;
        .el-button{
          padding: 9px 33px;
        }
      }
    }
    /*拖拽*/
    .my-handle {
      position: absolute;
      left: 940px;
      top: 50%;
      cursor: move;
    }
    .had-link{
      position: relative;
      padding-right: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .icon-edit{
        position: absolute;
        right: 0;
        top: 0;
        padding: 0 10px;
        font-size: 14px;
        color: #999;
        cursor: pointer;
      }
    }
  }
</style>
