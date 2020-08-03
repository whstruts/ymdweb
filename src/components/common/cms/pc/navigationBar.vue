<template>
  <div class="navigation_bar">
    <div class="bar_warp" :style="{background:barDataList.length>1?'':'#EFEFEF'}">
      <span class="bar_title" v-for="(item ,index) in barDataList"
            @click="selectEditBar(item,index)"
            :key="index"
            :style="{color:selectItemIndex==index && item.columnName?'#00b78d':barDataList.length>1 && item.columnName?'#333':'#999'}">{{item.columnName || "栏目"+(index+1) }}</span>
    </div>
    <div class="navigation_bar_setting" @click="selectEditBar('',-1)">批量设置</div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      class="cms_dialog_visible"
      width="785px"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div style="max-height: 600px">
        <div class="cms_dialog_add_button" v-if=" selectItemIndex=='-1'" @click="addNavigationBar">
          <i class="iconfont icon-add-fill"></i>
          <span>新增栏目</span>
        </div>
        <div class="cms_dialog_content" v-for="(item,index) in editBarData" :key="index">
          <img src="../../../../assets/img/cms/del_icon.png" class="cms_del_icon"
               v-if="editBarData && editBarData.length>1  && selectItemIndex=='-1'" @click="delItem(index)"/>
          <div>
            <span class="setting_item_title">活动日期</span>
            <el-date-picker
              v-model="item.eventDate"
              type="date" size="small" style="width: 270px" :editable="false" :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd">
            </el-date-picker>
            <span class="setting_item_hint">不填则表示长期有效</span>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title"><!--<span class="required_field">*</span>-->栏目</span>
            <el-input v-model="item.columnName" maxlength="6" show-word-limit style="width: 150px"
                      size="small"></el-input>
            <span class="setting_item_title2">
              <!--<span class="required_field">*</span>-->
              排序</span>
            <el-input v-model="item.sort" onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')"
                      style="width: 70px"
                      size="small"></el-input>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title">跳转页面</span>
            <el-radio-group v-model="item.jumpPage">
              <el-radio :label="item.id" v-for="(item,index) in jumpData" :key="index">{{item.val}}</el-radio>
            </el-radio-group>
          </div>
          <div class="setting_input_wrap">
            <span class="setting_item_title"></span>
            <template v-if="item.jumpPage=='0'">
              <el-select v-model="item.linkAddress0" placeholder="请选择" style="width: 120px" size="small">
                <el-option
                  v-for="item in jumpPages"
                  :key="item.id"
                  :label="item.val"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="item.keyword" size="small" placeholder="请输入搜索关键字"
                        style="width: 220px;margin-left: 15px" v-if="item.linkAddress0=='0'"></el-input>
            </template>
            <el-input v-model="item.linkAddress1" size="small" style="width: 355px"
                      v-if="item.jumpPage=='1'"></el-input>
            <el-input v-model="item.linkAddress2" size="small" style="width: 355px"
                      v-if="item.jumpPage=='2'" :readonly="true"></el-input>
            <el-input v-model="item.linkAddress3" size="small" style="width: 355px"
                      v-if="item.jumpPage=='3'"></el-input>
            <div class="query_button" v-if="item.jumpPage=='2'" @click="queryCommodity(item.linkAddress,index)"><i
              class="iconfont icon-chaxun"></i>选择商品
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
           <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitBarData" v-if="editBarData && editBarData.length>0 ">保存</el-button>
        </span>
    </el-dialog>
    <commodity-dialog :addCommodityDialog='addCommodityDialog' @closeCommodityDialog="closeCommodityDialog"
                      @commoditySubmit="commoditySubmit"  :checkboxCommodity="true"  :commodityIds="commodityIds"></commodity-dialog>
  </div>
</template>

<script>
  import commodityDialog from "../../commodityDialog"

  export default {
    name: "navigationBar",
    components: {commodityDialog},
    props: {
      navigationBarData: {
        type: Array,
        default() {
          return []
        }
      },
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
      compare: {
        type: Function,
        default: null
      },//父级的排序方法
    },
    watch: {
      navigationBarData: {
        handler(val) {
          // console.log("监控navigationBarData", val);
          this.initData(val);
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        dialogVisible: false,
        dialogTitle: "批量设置",
        editBarData: [], //
        selectItemIndex: -1,
        barDataList: [],//所有的数据
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
          }
        },

        addCommodityDialog: false,
        selectIndex: "",//选择查询商品的数据下标
        commodityIds: [],//选中的商品id
      }
    },
    created() {
      // this.barDataList = this.navigationBarData;
    },
    methods: {
      initData(val) {
        this.barDataList = val;
      },
      //删除
      delItem(index) {
        this.$confirm('确认删除?', '提示', {
          type: 'warning'
        }).then(() => {
          this.editBarData.splice(index, 1);
        }).catch(() => {
        });
      },
      //查询商品
      queryCommodity(item, index) {
        this.addCommodityDialog = true;
        this.selectIndex = index;
        this.commodityIds = [];
        if (item && item.commodityId) {
          this.commodityIds.push(item.commodityId)
        }
      },
      //关闭查询商品窗口
      closeCommodityDialog() {
        this.addCommodityDialog = false;
      },
      //选择商品后
      commoditySubmit(data) {
        let item = this.editBarData[this.selectIndex];
        item.linkAddress = data[0];
        item.linkAddress2 = data[0].drugCommonName;
      },
      //添加
      addNavigationBar() {
        // let item = {}
        if (this.editBarData.length >= 7) {
          this.$message.error("最多只有七个栏目")
          return;
        }
        this.editBarData.unshift({columnName: "", sort: "", eventDate: "", jumpPage: 0, linkAddress0: "0"});
      },

      selectEditBar(item, index) {
        this.dialogVisible = true;
        this.editBarData = [];
        this.selectItemIndex = index;
        if (item && index >= 0) {
          let temporaryData = Object.assign({}, item)//深copy，防止改动数据时影响到原数据
          this.editBarData.push(temporaryData);
          this.dialogTitle = "编辑栏目"
        } else if (!item && index == '-1') {
          this.dialogTitle = "批量设置"
          this.editBarData = JSON.parse(JSON.stringify(this.barDataList));//深copy数组，为了防止改动的值影响merchantDataList里的值
        }
      },
      submitBarData() {
        let itemLenght = this.editBarData.length;
        for (let i = 0; i < itemLenght; i++) {
          let item = this.editBarData[i];

          let status = this.$utils.jumpPageSetting(item);
          if (!status) {
            this.$message.error("请输入搜索关键字")
            return;
          }
          if (!item.columnName) {
            this.$message.error("请填写栏目！")
            return;
          }
          if (!item.sort) {
            this.$message.error("请填写排序顺序！")
            return;
          } else if (item.sort == '0') {
            this.$message.error("排序顺序不能为0！")
            return;
          }
          if (item.jumpPage != '4' && !item.linkAddress) {
            this.$message.error("请填写跳转页面！")
            return;
          }
        }
        if (this.selectItemIndex >= 0) {
          this.barDataList[this.selectItemIndex] = Object.assign({}, this.editBarData[0])
        } else if (this.selectItemIndex == '-1') {
          this.barDataList = JSON.parse(JSON.stringify(this.editBarData));
        }
        if (this.isRepeat(this.barDataList)) {
          this.$message.error("栏目不能重复！")
          return;
        }
        this.barDataList.sort(this.compare('sort'));//把集合根据sort进行排序
        this.dialogVisible = false;
        this.$emit("submitBarData", this.barDataList)
      },
      isRepeat(arr) {
        var hash = {};
        for (var i in arr) {
          if (hash[arr[i].columnName]) {
            return true;
          }
          // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
          hash[arr[i].columnName] = true;
        }
        return false;
      },
      handleClose() {
        /*    this.$confirm('确认关闭?', '提示', {
              type: 'warning'
            }).then(() => {
              done();
            }).catch(() => {
            });*/
        this.dialogVisible = false
      },
    }
  }
</script>

<style lang="scss">
  .navigation_bar {
    .bar_warp {
      text-align: left;
      min-width: 800px;
      width: auto;
      display: inline-block;
      height: 32px;
      line-height: 32px;

      padding: 0px 24px;
      .bar_title {
        margin-right: 40px;
        font-size: 12px;
        box-sizing: border-box;
        cursor: pointer;
      }
    }
    .navigation_bar_setting {
      color: #6CA3F0;
      margin-left: 20px;
      vertical-align: top;
      display: inline-block;
      height: 32px;
      line-height: 12px;
      cursor: pointer;
    }

  }
</style>
