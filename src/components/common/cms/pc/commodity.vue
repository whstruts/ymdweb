<template>
  <!--商品推荐-->
  <div class="commodity_wrap">
    <div class="commodity_setting">
      <div class="commodity_nav">
        <span class="commodity_title_default" :class="{commodity_title:navBar.title}" @click="selectEditBar('',-2)">{{navBar.title || '标题'}} </span>
        <span class="commodity_min_title_default"
              :class="{commodity_min_title:navBar.subtitle}"
              @click="selectEditBar('',-2)">{{navBar.subtitle || '副标题'}}</span>
        <span class="commodity_more">更多> </span>
      </div>
      <div class="commodity_content_setting flex-row">
        <div class="commodity_max_img " @click="selectEditBar('',-3)"
             :style="{border:selectItemIndex==-3?'1px solid #00b78d':''}">
          <img :src="mainPicture.imgUrl" v-if="mainPicture.imgUrl"/>
          <div class="commodity_max_default" v-else>
            <i class="iconfont icon-tupian-copy-copy"></i>
          </div>
        </div>
        <div class="commodity_min_img " v-for="(item,index) in commodityDataList" :key="index"
             :class="selectItemIndex==index?'commodity_min_img_hint':'commodity_min_img_default'"
             @click="selectEditBar(item,index)">
          <div class="commodity_min_img_setting">
            <img :src="item.drugImg" v-if="item.drugImg"/>
            <div class="commodity_max_default" v-else>
              <i class="iconfont icon-tupian-copy-copy"></i>
            </div>
          </div>
          <div class="commodity_info">
            <p :style="{ color: item.drugCommonName?'#FF2424':''}">价格登录可见</p>
            <p class="text_overflow" :style="{ color: item.drugCommonName?'#333':''}" :title="item.drugCommonName">
              {{item.drugName || '商品名'}}&nbsp;&nbsp;
              {{item.drugCommonName}}</p>
            <p class="text_overflow" :title="item.manufacturer ">{{item.specifications || '规格'}} {{item.manufacturer ||
              '厂家'}}</p>
            <p class="text_overflow" :title="item.supplierName ">{{item.supplierName || '供应商'}}</p>
          </div>
        </div>

      </div>
    </div>
    <div class="commodity_batch_setting">
      <span @click="selectEditBar('',-1)">
        批量设置
      </span>
      <img src="../../../../assets/img/cms/del_icon.png" @click="delSetting"/></div>
    <div class="my-handle">
      <img src="../../../../assets/img/cms/drag_icon.png"/>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible"
      width="1000px"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="dialog_body" style="max-height: 600px">
        <p class="floor_setting" v-if="selectItemIndex==-1 || selectItemIndex==-2">楼层信息</p>
        <div class="cms_dialog_content" v-if="selectItemIndex==-1 || selectItemIndex==-2">
          <div class="setting_input_wrap">
            <span class="setting_item_title"><span class="required_field">*</span>标题</span>
            <el-input v-model="editNavBar.title" maxlength="5" show-word-limit style="width: 150px"
                      size="small"></el-input>
            <span class="setting_item_title2">副标题</span>
            <el-input v-model="editNavBar.subtitle" maxlength="8" show-word-limit style="width: 150px"
                      size="small"></el-input>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title" style="width: 160px">是否有【更多按钮】</span>
            <el-radio-group v-model="editNavBar.moreButton">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </div>
          <div class="setting_input_wrap" v-if="editNavBar.moreButton=='0'">
            <span class="setting_item_title">跳转页面</span>
            <el-radio-group v-model="editNavBar.jumpPage">
              <el-radio :label="item.id" v-for="(item,index) in jumpData" :key="index">{{item.val}}</el-radio>
            </el-radio-group>
          </div>
          <div class="setting_input_wrap" v-if="editNavBar.moreButton=='0'">
            <span class="setting_item_title"></span>
            <template v-if="editNavBar.jumpPage=='0'">
              <el-select v-model="editNavBar.linkAddress0" placeholder="请选择" style="width: 120px" size="small">
                <el-option
                  v-for="item in jumpPages"
                  :key="item.id"
                  :label="item.val"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="editNavBar.keyword" size="small" placeholder="请输入搜索关键字"
                        style="width: 220px;margin-left: 15px" v-if="editNavBar.linkAddress0=='0'"></el-input>
            </template>
            <el-input v-model="editNavBar.linkAddress1" size="small" style="width: 355px"
                      v-if="editNavBar.jumpPage=='1'"></el-input>
            <el-input v-model="editNavBar.linkAddress2" size="small" style="width: 355px"
                      v-if="editNavBar.jumpPage=='2'" :readonly="true"></el-input>
            <el-input v-model="editNavBar.linkAddress3" size="small" style="width: 355px"
                      v-if="editNavBar.jumpPage=='3'"></el-input>
            <div class="query_button" v-if="editNavBar.jumpPage=='2'" @click="queryCommodity(editNavBar.linkAddress,0)">
              <i class="iconfont icon-chaxun"></i>选择商品
            </div>
          </div>
        </div>
        <div class="cms_dialog_content" v-if="selectItemIndex==-1 || selectItemIndex==-3">
          <div>
            <span class="setting_item_title">活动日期</span>
            <el-date-picker
              v-model="editMainPicture.eventDate"
              :picker-options="pickerOptions"
              type="date" size="small" :editable="false"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd" style="width: 270px">
            </el-date-picker>
            <span class="setting_item_hint">不填则表示长期有效</span>
          </div>
          <div class="setting_input_wrap" style="margin-top: 25px">
            <span class="setting_item_title"><span class="required_field">*</span>商家logo</span>
            <div class="commodity_img_wrap">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="(res,file)=>{return handleAvatarSuccess(res,file)}"
                :headers="uploadHeaders"
                :data="{size:200}"
                :before-upload="beforeAvatarUpload">
                <img v-if="editMainPicture.imgUrl" :src="editMainPicture.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span>图片尺寸：480px*332px    图片大小：200kb以内</span>
            </div>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title">跳转页面</span>
            <el-radio-group v-model="editMainPicture.jumpPage">
              <el-radio :label="item.id" v-for="(item,index) in jumpData" :key="index">{{item.val}}</el-radio>
            </el-radio-group>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title"></span>
            <template v-if="editMainPicture.jumpPage=='0'">
              <el-select v-model="editMainPicture.linkAddress0" placeholder="请选择" style="width: 120px" size="small">
                <el-option
                  v-for="item in jumpPages"
                  :key="item.id"
                  :label="item.val"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="editMainPicture.keyword" size="small" placeholder="请输入搜索关键字"
                        style="width: 220px;margin-left: 15px" v-if="editMainPicture.linkAddress0=='0'"></el-input>
            </template>
            <el-input v-model="editMainPicture.linkAddress1" size="small" style="width: 355px"
                      v-if="editMainPicture.jumpPage=='1'"></el-input>
            <el-input v-model="editMainPicture.linkAddress2" size="small" style="width: 355px"
                      v-if="editMainPicture.jumpPage=='2'" :readonly="true"></el-input>
            <el-input v-model="editMainPicture.linkAddress3" size="small" style="width: 355px"
                      v-if="editMainPicture.jumpPage=='3'"></el-input>
            <div class="query_button" v-if="editMainPicture.jumpPage=='2'"
                 @click="queryCommodity(editMainPicture.linkAddress,1)"><i class="iconfont icon-chaxun"></i>选择商品
            </div>
          </div>
        </div>
        <div class="commodity_data_setting" v-if="selectItemIndex==-1 || selectItemIndex>=0">
          <div class="add_commodity_button" @click="openAddCommodityDialog">新增商品</div>
          <div class="del_commodity_button" @click="deleteCommodity">删除</div>
        </div>
        <el-table
          :data="editCommodityData" style="width: 100%" border stripe @selection-change="handleSelectionChange"
          v-if="selectItemIndex==-1 || selectItemIndex>=0" :default-sort="{prop: 'commodityCode', order:
          'descending'}">
          <el-table-column type="index" width="45" label=" " align="center"></el-table-column>
          <el-table-column type="selection" width="47" align="center"></el-table-column>
          <el-table-column label="商品状态" prop="status">
            <template slot-scope="scope">
              <!-- 1上架   0和2下架 -->
              {{scope.row.status ==1?'已上架':'已下架'}}
            </template>
          </el-table-column>
          <el-table-column label="商品编码" prop="drugSkuCode" sortable min-width="110px">
          </el-table-column>
          <el-table-column label="商品通用名" prop="drugCommonName" sortable min-width="110px">
            <template slot-scope="scope">
              {{scope.row.drugName?scope.row.drugName+'&nbsp;&nbsp;':''}}
              {{scope.row.drugCommonName}}
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="specifications" sortable>
          </el-table-column>
          <el-table-column label="厂家" prop="manufacturer" sortable min-width="130px">
          </el-table-column>
          <el-table-column label="批准文号" prop="approveNumber"></el-table-column>
          <el-table-column label="供应商" prop="supplierName" sortable>
          </el-table-column>
          <el-table-column label="活动时间" prop="eventDate" align="center" width="160px">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.eventDate" type="date" size="mini" style="width:130px" :editable="false"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd">
              </el-date-picker>
              <span style="color: #999;font-size: 12px;margin-top: 5px">不填则默认长期有效</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitCommodityData">保存</el-button>
        </span>
    </el-dialog>
    <commodity-dialog :addCommodityDialog='addCommodityDialog' @closeCommodityDialog="closeCommodityDialog"
                      :checkboxCommodity="checkboxCommodity" @commoditySubmit="commoditySubmit"
                      :commodityIds="commodityIds"></commodity-dialog>
  </div>
</template>

<script>
  import commodity_api from "../../../../api/api_homeSetting"
  import commodityDialog from "../../commodityDialog"

  export default {
    name: "commodity",
    components: {commodityDialog},
    props: {
      commodityData: {
        type: Object,
        default() {
          return []
        }
      }, //数据
      fIndex: Number, //组件在集合中的下标
      compare: {
        type: Function,
        default: null
      },//父级的排序方法
      jumpPages: {
        type: Array,
        default() {
          return []
        }
      },
      jumpData: {
        type: Array,
        default() {
          return []
        }
      },
    },
    watch: {
      //每次数据发送改变就重新赋值
      commodityData: {
        handler(newVal) {
          // console.log("深度监控commodityData", newVal)
          this.initData(newVal);
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        navBar: {title: "", subtitle: "", moreButton: 0, jumpPage: 3, linkAddress: ""}, //用于展示标题
        editNavBar: {title: "", subtitle: "", moreButton: 0, jumpPage: 3, linkAddress: ""},//修改标题
        mainPicture: {eventDate: "", imgUrl: "", jumpPage: 2, linkAddress: ""},//展示主图
        editMainPicture: {eventDate: "", imgUrl: "", jumpPage: 2, linkAddress: ""},//修改主图
        commodityDataList: [],//商品集合
        dialogVisible: false,
        dialogTitle: "批量设置",
        editCommodityData: [], //编辑商品集合
        selectionCommodity: [],//被选中的商品
        selectItemIndex: -1, //大于0代表点击的是单个商品  -1代表点击批量设置  -2代表点击了楼层设置  -3代表点击了主图设置
        uploadUrl: "",
        uploadHeaders: {Authorization: ''},//token
        loading: null,
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
          }
        },
        addCommodityDialog: false,
        // multipleAddCommodity: [], //多选的添加商品
        // searchCommodityname: "",//选择添加商品的搜索条件
        // manufacturer: "",
        // supplierName: "",
        // approveNumber: "",
        // specifications: "",
        // submitLoading: false,
        goodIds: [],//已经选择的商品id集合
        jumpPageType: 0,//是栏目的跳转链接查询商品，还是大图的跳转链接查询商品  0栏目 1广告图
        checkboxCommodity: true,//商品支持多选还是单选  true单选，false多选
        commodityIds: [],//选中的商品id
      }
    },
    created() {
      this.uploadUrl = commodity_api.upload();
    },
    methods: {
      initData(data) {
        this.commodityDataList = data.data;
        this.navBar = data.navBar;
        this.editNavBar = Object.assign({}, this.navBar);
        this.mainPicture = data.mainPicture
        this.editMainPicture = Object.assign({}, this.mainPicture);
      },
      selectEditBar(item, index) {
        this.selectItemIndex = index;
        this.dialogVisible = true;
        this.editNavBar = Object.assign({}, this.navBar); //重新复制，防止之前数据被改动过
        this.editMainPicture = Object.assign({}, this.mainPicture);
        this.editCommodityData = [];
        this.goodIds = []
        //判断是不是刚初始化出来的商品数据集合
        let itemLength = this.commodityDataList.length;
        let num = 0;
        for (let i = 0; i < itemLength; i++) {
          let item = this.commodityDataList[i];
          if (!item.commodityCode && !item.commodityId) {
            num++;
          } else {
            //已经选择了的商品id集合，需要传给后台，过滤掉这些数据
            this.goodIds.push(item.commodityId);
          }
        }
        if (item && index >= 0) { //点击单个设置
          this.dialogTitle = "编辑商品";
          let sData = this.commodityDataList.filter(data => {
            if (!data.minMaxPrice && !data.drugImg) {
              return false;
            } else {
              return data.commodityId == item.commodityId;
            }
          });
          this.getCommodityStatus(sData);
        } else if (!item && index == -1) {
          this.dialogTitle = "批量设置";
          //如果相等。商品集合是刚初始化出来的，在批量设置的时候就需要重新选择商品
          if (num == itemLength) {
            this.editCommodityData = [];
          } else {
            let commodityData = JSON.parse(JSON.stringify(this.commodityDataList));
            this.getCommodityStatus(commodityData);
          }
        }
        else if (!item && index == -2) {
          this.dialogTitle = "编辑楼层信息"
        }
        else if (!item && index == -3) {
          this.dialogTitle = "编辑广告位"
        }
      },
      // 获取商品状态
      getCommodityStatus(commodityData) {
        let dataList = commodityData;
        let commodityIds = ''
        for (let i = 0; i < dataList.length; i++) {
          commodityIds += dataList[i].commodityId + ",";
        }
        if (commodityIds == "") {
          return;
        }
        commodity_api.getCommodityStatus({commodityIds: commodityIds}).then(res => {
          if (res.code == 0) {
            if (res.data) {
              let status = res.data;
              for (let i in status) {
                commodityData[i].status = status[i] + '';
              }
              this.editCommodityData = commodityData;
            }
          } else {
            this.$message.error(res.msg);
          }
        })

      },
      //跳转链接的查询商品
      queryCommodity(item, index) {
        this.addCommodityDialog = true;
        this.jumpPageType = index;
        this.checkboxCommodity = true;
        if (item && item.commodityId) {
          this.commodityIds = [];
          this.commodityIds.push(item.commodityId)
        }
      },
      //关闭跳转链接的查询商品窗口
      closeCommodityDialog() {
        this.addCommodityDialog = false;
      },
      //选择跳转链接的商品后
      commoditySubmit(data) {
        if (!this.checkboxCommodity || (this.checkboxCommodity && this.selectItemIndex >= 0)) {
          // this.multipleAddCommodity = data;
          this.addCommoditySubmit(data);
        } else {
          let item = data[0]
          if (this.jumpPageType == 0) {
            this.editNavBar.linkAddress = item;
            this.editNavBar.linkAddress2 = item.drugCommonName;
          } else if (this.jumpPageType == 1) {
            this.editMainPicture.linkAddress = item;
            this.editMainPicture.linkAddress2 = item.drugCommonName;
          }
        }
      },
      handleSelectionChange(val) {
        this.selectionCommodity = val;
      },
      submitCommodityData() {
        if (this.selectItemIndex == -2 || this.selectItemIndex == -1) {
          if (!this.editNavBar.title) {
            this.$message.error("请填写楼层标题！")
            return;
          }
          let status = this.$utils.jumpPageSetting(this.editNavBar, this)
          if (!status) {
            return;
          }
          if (this.editNavBar.moreButton == '0' && this.editNavBar.jumpPage != '4' && !this.editNavBar.linkAddress) {
            this.$message.error("请填写跳转页面！")
            return;
          }
        }
        if (this.selectItemIndex == -3 || this.selectItemIndex == -1) {
          if (!this.editMainPicture.imgUrl) {
            this.$message.error("请上传图片！")
            return;
          }
          let status = this.$utils.jumpPageSetting(this.editMainPicture, this);
          if (!status) {
            return;
          }
          if (this.editMainPicture.jumpPage != '4' && !this.editMainPicture.linkAddress) {
            this.$message.error("请填写跳转页面！")
            return;
          }
        }
        let commodityData = {
          navBar: this.editNavBar,
          mainPicture: this.editMainPicture,
          data: []
        };
        let editDataLength = this.editCommodityData.length;
        if ((this.selectItemIndex >= 0 || this.selectItemIndex == -1) && editDataLength <= 0) {
          this.$message.error("请选择商品");
          return;
        }
        if (this.selectItemIndex >= 0) { //单个设置
          if (editDataLength != 1) {
            this.$message.error("当前只能替换一个商品");
            return;
          }
          this.commodityDataList.splice(this.selectItemIndex, 1, this.editCommodityData[0]);
        } else if (this.selectItemIndex == -1) { //批量设置
          if (editDataLength != 8) {
            this.$message.error("该楼层需要展示8个商品");
            return;
          }
          this.commodityDataList = JSON.parse(JSON.stringify(this.editCommodityData));
        }
        commodityData.data = JSON.parse(JSON.stringify(this.commodityDataList));
        this.dialogVisible = false;
        this.$emit("commoditySubmitData", commodityData, this.fIndex);
      },
      //删除父组件中的自己
      delSetting() {
        this.$confirm('确认删除?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$emit("delSetting", this.fIndex);
        }).catch(() => {
        });
      },
      handleClose() {
        /*this.$confirm('确认关闭?', '提示', {
          type: 'warning'
        }).then(() => {
          done();
        }).catch(() => {

        });*/
        this.dialogVisible = false
      },
      handleAvatarSuccess(res, file) {
        if (this.loading) {
          this.loading.close();
        }
        if (res.code == 0) {
          this.editMainPicture.imgUrl = res.resPath;
          this.editMainPicture = Object.assign({}, this.editMainPicture);
        } else {
          this.$message.error(res.msg)
        }
      },
      beforeAvatarUpload(file) {
        this.uploadHeaders.Authorization = localStorage.getItem('access-token');
        if (!this.uploadHeaders.Authorization) {
          return false;
        }
        let arr = file.type.split("/");
        if (arr.indexOf("image") == -1) {
          this.$message.error('仅支持图片上传');
          return false;
        }
        const imgSize = file.size / 1024 / 1024 < 0.2;
        if (!imgSize) {
          this.$message.error('上传图片的大小不能超过 200KB!');
          return false;
        }
        const isSize = new Promise(function (resolve, reject) {
          let width = 480;
          let height = 332;
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.onload = function () {
            let valid = img.width == width && img.height == height;
            valid ? resolve() : reject();
          }
          img.src = _URL.createObjectURL(file);
        }).then(() => {
          return file;
        }, () => {
          this.$message.error("图片尺寸必须是480px*332px")
          return Promise.reject();
        });
        return isSize;
      },
      //删除商品
      deleteCommodity() {
        let dataLength = this.selectionCommodity.length;
        if (this.selectionCommodity.length <= 0) {
          this.$message.error("请勾选要删除的商品");
          return;
        }
        this.$confirm('确认删除商品?', '提示', {
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < dataLength; i++) {
            let data = this.selectionCommodity[i];
            let itemLenght = this.editCommodityData.length;
            for (let j = 0; j < itemLenght; j++) {
              let item = this.editCommodityData[j];
              if (data.commodityId == item.commodityId) {
                this.editCommodityData.splice(j, 1);
                //删除时删掉goodIds里的数据，为了保证后台搜索商品时的正确性
                let goodIndex = this.goodIds.indexOf(item.commodityId);
                if (goodIndex != -1) {
                  this.goodIds.splice(goodIndex, 1);
                }
                break;
              }
            }
          }
          done();
        }).catch(() => {

        });

      },
      //打开添加商品弹出框
      openAddCommodityDialog() {
        this.addCommodityDialog = true;
        if (this.selectItemIndex >= 0) {
          this.checkboxCommodity = true;
        } else if (this.selectItemIndex === -1) {
          this.checkboxCommodity = false;
        }
        //批量或者单个设置商品，都需要把被修改的商品id传给后台
        let editItemLength = this.editCommodityData.length;
        for (let i = 0; i < editItemLength; i++) {
          let item = this.editCommodityData[i];
          if (item.commodityCode && item.commodityId) {
            //已经选择了的商品id集合，需要传给后台，过滤掉这些数据
            if (this.goodIds.indexOf(item.commodityId) == -1) {  //单个设置商品时的判断
              this.goodIds.push(item.commodityId);
            }
          }
        }
        this.commodityIds = this.goodIds;
      },

      //确定添加商品
      addCommoditySubmit(data) {
        let multipleLength = data.length;
        if (multipleLength <= 0) {
          this.$message.error("请勾选要添加的商品");
          return;
        }
        //单个设置商品
        if (this.selectItemIndex >= 0) {
          if (multipleLength > 1) {
            this.$message.error("当前只能替换一个商品");
            return
          }
          this.editCommodityData = JSON.parse(JSON.stringify(data));
        } else if (this.selectItemIndex == -1) {
          if (multipleLength > 8) {
            this.$message.error("该楼层仅支持展示8个商品");
            return;
          }
          let tempDataLength = multipleLength + this.editCommodityData.length;
          if (tempDataLength > 8) {
            this.$message.error("该楼层仅支持展示8个商品");
            return;
          }
          for (let i = 0; i < multipleLength; i++) {
            this.editCommodityData.push(data[i]);
          }
        }
      },
    }
    ,
  }
</script>

<style lang="scss">
  .commodity_wrap {
    position: relative;
    width: 1020px;

    .commodity_setting {
      width: 900px;
      .commodity_nav {
        color: #999;
        font-size: 12px;
        .commodity_title_default {
          display: inline-block;
          background: #EFEFEF;
          padding: 8px 36px;
          vertical-align: bottom;
          cursor: pointer;
        }
        .commodity_title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          background: initial;
          padding: initial;
          line-height: 25px;
        }
        .commodity_min_title_default {
          display: inline-block;
          background: #EFEFEF;
          padding: 3px 30px;
          vertical-align: bottom;
          cursor: pointer;
        }
        .commodity_min_title {
          margin-left: 10px;
          color: #666666;
          background: initial;
          padding: initial;
        }
        .commodity_more {
          float: right;
        }
      }
      .commodity_content_setting {
        width: 100%;
        border-top: 1px solid #E2E2E2;
        border-left: 1px solid #E2E2E2;
        margin-top: 5px;
        .commodity_max_img {
          width: 360px;
          height: 250px;
          line-height: 250px;
          box-sizing: border-box;
          border-bottom: 1px solid #E2E2E2;
          border-right: 1px solid #E2E2E2;
          img {
            width: 100%;
            height: 100%;
          }
          i {
            font-size: 45px;
          }
        }
        .commodity_min_img_default {
          border-bottom: 1px solid #E2E2E2;
          border-right: 1px solid #E2E2E2;
        }
        .commodity_min_img_hint {
          border: 1px solid #00b78d;
        }
        .commodity_min_img {
          width: 180px;
          height: 250px;
          padding: 5px;
          box-sizing: border-box;
          .commodity_min_img_setting {
            width: 167px;
            height: 133px;
            line-height: 133px;
            img {
              width: 100%;
              height: 100%;
            }
            i {
              font-size: 35px;
            }
          }
          .commodity_info {
            padding: 0px 5px;
            box-sizing: border-box;
            p:first-child {
              font-size: 14px;
            }
            p {
              color: #999999;
              font-size: 12px;
            }
          }
        }
        .commodity_max_default {
          width: 100%;
          height: 100%;
          text-align: center;
          background: #EFEFEF;
          color: #CECECE;
        }
      }
    }

    .commodity_batch_setting {
      color: #6CA3F0;
      position: absolute;
      left: 920px;
      top: -5px;
      span {
        cursor: pointer;
        vertical-align: middle;
      }
      img {
        font-size: 20px;
        margin-left: 5px;
        vertical-align: middle;
        cursor: pointer;
      }
    }

    .dialog_body {
      .commodity_img_wrap {
        display: inline-block;
        vertical-align: middle;
        .avatar-uploader .el-upload {
          border: 1px dashed #DEDEDE;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #00b78d;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #DEDEDE;
          width: 129px;
          height: 89px;
          line-height: 89px;
          text-align: center;
        }
        .avatar {
          width: 129px;
          height: 89px;
          display: block;
        }
        span {
          color: #FF270A;
          font-size: 12px;
        }
      }
      .commodity_data_setting {
        margin: 20px 0px;
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
    }

    /*  .el-table__header {
        thead {
          color: #333;
          tr {
            th {
              padding: 6px 0px;
              background: #F0F0F0;
            }
          }
        }
      }
      .el-table td, .el-table th.is-leaf {
        border-bottom: 1px solid #DEDEDE;
      }
      .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
        border-right: 1px solid #DEDEDE;
      }
      .el-table--border::after, .el-table--group::after, .el-table::before {
        background-color: #DEDEDE
      }
      .el-table--border, .el-table--group {
        border: 1px solid #DEDEDE;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #00B78D;
        border-color: #00B78D;
      }
      .el-checkbox__inner:hover {
        border-color: #00B78D;
      }*/
  }
</style>
