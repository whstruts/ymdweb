<template>
  <div class="integral_list">
    <div class="select_year">
      <i class="iconfont icon-rili1"></i>
      <span class="current_year">{{selectYear}}年度</span>
      <el-popover
        placement="right-start"
        width="230"
        trigger="click" v-if="$utils.checkButton('integral:years')">
        <div style="line-height: 35px">
          <span v-for="(item,index) in yearData" :key="index" class="month_num "
                :class="{'month_num_active':item.rpYear==selectYear}"
                :style="{marginRight:(index+1)%4==0?'0px':'15px'}" @click="yearChange(item.rpYear)">
            {{item.rpYear}}
          </span>
        </div>
        <span class="switch_year" slot="reference">切换年度</span>
      </el-popover>

    </div>
    <div class="month_wrap flex-row">
      <div class="month_item" v-for="(item ,index) in monthList"
           :style="{cursor:item.rpMonth!=''?'pointer':'not-allowed'}" :key="index" @click="monthChange(item,false)">
        <p class="month_hint" :class="{'month_hint_active':item.month==selectMonth}">{{item.waitNum}}人未结算</p>
        <p class="month_content" :class="{'month_content_active':item.month==selectMonth}"><span
          class="num">{{item.month}}</span><span
          class="hint">月</span></p>
      </div>
      <el-popover
        placement="bottom-start"
        width="215"
        ref="dcPopover"
        trigger="click">
        <div style="line-height: 35px;">
          <span v-for="(item,index) in monthAll" :key="index" class="month_num "
                :class="{'month_num_active':item.month==selectMonth}"
                :style="{marginRight:(index+1)%4==0?'0px':'15px',cursor:item.rpMonth!=''?'pointer':'not-allowed'}"
                @click="monthChange(item,true)">
            {{item.month}}月
          </span>
        </div>
        <span class="more_month_button" slot="reference" v-if="$utils.checkButton('integral:month')">更多</span>
      </el-popover>
    </div>
    <div style="margin-top: 36px">
      <template v-if="!(selectYear==currentYear && selectMonth==currentMonth)">
        <el-button type="primary" size="small" :disabled="isAccount" v-if="$utils.checkButton('integral:account')"
                   @click="account" style="margin-right: 10px">
          积分结算
        </el-button>
        <span class="integral_hint" v-show="isAccount">次月15号后才可进行结算</span>
        <span style="margin-right: 10px">状态</span>
        <el-select v-model="filters.closeStatus" @change="handleSearch" size="mini">
          <el-option
            v-for="item in statusData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <span style="margin-left: 10px">账号</span>
      <el-input size="small" v-model="filters.partnerLike" clearable placeholder="登录账号/联系人/手机号"
                @keyup.enter.native="handleSearch" style="width: 220px;margin:0px 10px"></el-input>

      <el-button size="small" type="warning" @click="handleSearch"><i class="iconfont icon-chaxun"></i>查询</el-button>
    </div>
    <div class="wrap_main flex-item scrollbar">
      <el-table :data="table.data" border ref="tableData" class="my_table" height="100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45" align="center" :selectable="row=>{return row.closeStatus =='0'}">
        </el-table-column>
        <el-table-column label=" " type="index" width="45" align="center"></el-table-column>
        <el-table-column label="登录账户" prop="partnerLoginName" align="center"></el-table-column>
        <el-table-column label="合伙人" prop="partnerName" align="center"></el-table-column>
        <el-table-column label="联系方式" prop="partnerPhone" align="center" min-width="100"></el-table-column>
        <el-table-column label="当月累计积分" prop="accumulativeEarnings" align="center"></el-table-column>
        <el-table-column label="结算状态" prop="closeStatus" align="center"
                         v-if="!(selectYear==currentYear && selectMonth==currentMonth)" :key="Math.random()">
          <template slot-scope="scope">
            {{scope.row.closeStatus=='0'?'未结算':'已结算'}}
          </template>
        </el-table-column>
        <el-table-column label="订单数" prop="orderCount" align="center"></el-table-column>
        <el-table-column label="订单累计金额" prop="accumulativeOrderPrice" align="center"></el-table-column>
        <el-table-column label="下单客户数" prop="customerCount" align="center"></el-table-column>
        <el-table-column label="结算时间" prop="closeTime" width="160" align="center"
                         v-if="!(selectYear==currentYear && selectMonth==currentMonth)"
                         :key="Math.random()"></el-table-column>
        <el-table-column label="积分更新时间" prop="updateTime" width="160" align="center"></el-table-column>
      </el-table>
    </div>
    <!--<div class="setting_pagination" v-if="table.total>0 ">
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :page-sizes="[10, 50, 100, 150]"
                     small
                     :total="table.total" :current-page.sync="table.currentPage"
                     :page-size="table.pageSize"></el-pagination>
      <el-button type="primary" size="mini" plain>确 定</el-button>
    </div>-->
  </div>
</template>

<script>
  import API from "../../api/api_integral"

  export default {
    name: "integralList",
    data() {
      return {
        filters: {
          partnerLike: "",
          closeStatus: '0'
        },
        table: {
          data: [],
          /*  total: 0,
            pageSize: 10,
            currentPage: 1*/
        },
        statusData: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '未结算'
        }, {
          value: '2',
          label: '已结算',
        }],
        selectYear: "",//选择的年份
        currentYear: "",//当前年份
        yearData: [],
        selectMonth: "",//选择的月份
        currentMonth: "",//当前月份
        monthList: [],//值展示五个
        monthAll: [],//所有的月份
        dateNumber: "", //当前日期多少号
        multipleSelection: [],
        isAccount: false,//判断当前月份是否可以被结算 true不可以被结算
      }
    },
    watch: {
      selectMonth: 'settingMonthChange'
    },
    created() {
      let date = new Date();
      this.selectYear = date.getFullYear();
      this.currentYear = date.getFullYear();
      // this.selectMonth = date.getMonth() + 1;
      this.currentMonth = date.getMonth() + 1;
      this.dateNumber = date.getDate();
      this.listReportYear();
      this.nowTime();

    },
    // updated() {
    //   this.$nextTick(() => {
    //     this.$refs.tableData.doLayout()
    //   })
    // },

    methods: {
      //选择月份的改变
      settingMonthChange() {
        this.$nextTick(() => {
          this.$refs.tableData.doLayout();
        });
        this.filters = {
          partnerLike: "",
          closeStatus: '0'
        }
        this.listReportPartner();
        this.accountSetting();
      },
      //获取当前时间
      nowTime() {
        API.nowTime().then(res => {
          if (res.code == 0) {
            this.dateNumber = new Date(res.data).getDate();
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //获取可切换年度
      listReportYear() {
        API.listReportYear().then(res => {
          if (res.code == 0) {
            this.yearData = res.data;
            let arr = this.yearData.filter(item => item.curFlag == '1');
            this.selectYear = (arr == null || arr.length == 0) ? new Date().getFullYear() : arr[0].rpYear;
            this.currentYear = this.selectYear;
            this.listReportMonth();
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //获取可切换的月份
      listReportMonth() {
        API.listReportMonth({rpYear: this.selectYear}).then(res => {
          if (res.code == 0 && res.data) {
            this.monthAll = [];
            for (let i = 1; i <= 12; i++) {
              this.monthAll.push({urFlag: "", month: i + "", rpMonth: "", waitNum: 0 + ""})
            }
            let monthList = res.data;
            for (let i = 0; i < monthList.length; i++) {
              let item = monthList[i];
              if (item.curFlag == '1') { //代表是当前月
                this.selectMonth = parseInt(item.month);
                this.currentMonth = this.selectMonth;
              }
              for (let j = 1; j <= 12; j++) {
                if (item.month == j) {
                  this.monthAll.splice(j - 1, 1, item);
                  break;
                }
              }
            }

            //第一次加载界面的时候给selectMonth赋值
            if (this.selectMonth == "") {
              this.selectMonth = this.currentMonth
            }
            if (this.currentYear != this.selectYear) {
              // this.currentMonth = 0;
              this.selectMonth = 12;//如果切换的年度不是当前年度，月份从12月开始展示
            }
            this.getMonthList();
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleSearch() {
        this.listReportPartner();
      },
      //积分列表
      listReportPartner() {
        if (!this.monthAll) {
          return;
        }
        let arr = this.monthAll.filter(item => {
            return item.month == this.selectMonth
          }
        );
        if (!arr || arr.length == 0) {
          return;
        }
        API.listReportPartner({
          partnerLike: this.filters.partnerLike,
          rpMonth: arr[0].rpMonth,
          closeStatus: this.filters.closeStatus
        }).then(res => {
          if (res.code == 0) {
            this.table.data = res.data;
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      //选择年度
      yearChange(item) {
        this.selectYear = item;
        this.listReportMonth();
      },
      //选择月份
      monthChange(item, status) {
        if (item.rpMonth == null || item.rpMonth == "") {
          return;
        }
        this.selectMonth = parseInt(item.month);
        if (status) {
          this.$nextTick(() => {
            this.$refs.dcPopover.updatePopper()
          })
          this.getMonthList();
        }
      },
      /**
       *   判断积分结算是否可以被点击
       *   该操作，仅在次月15号后（包含15号当日）可操作且高亮显示；
       *   未到次月15号，则置灰显示，旁边予以提示“次月15号才可进行结算”
       * **/
      accountSetting() {

        if (this.currentYear == this.selectYear && (this.currentMonth == this.selectMonth || (this.currentMonth == this.selectMonth + 1 && this.dateNumber < 15))) {
          this.isAccount = true;
        } else if (this.currentYear != this.selectYear && this.currentMonth == 1 && this.selectMonth == 12 && this.dateNumber < 15) {
          this.isAccount = true;
        } else {
          this.isAccount = false;
        }
      },
      //拼接展示的月份列表 最多只能展示五个
      getMonthList() {
        this.monthList = [];
        for (let i = this.selectMonth; i > 0; i--) {
          this.monthList.push(this.monthAll[i - 1]);
          if (this.monthList.length == 5) {
            break;
          }
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      account() {
        if (!this.multipleSelection || this.multipleSelection.length == 0) {
          this.$message.error("请勾选积分结算用户")
          return
        }
        let reportIdList = [];
        this.multipleSelection.forEach(item => {
          reportIdList.push(item.reportId)
        });
        let dataLength = this.multipleSelection.length;
        API.account({reportIdList}).then(res => {
          if (res.code == 0) {
            this.$message.success(res.msg);
            this.monthAll.forEach(item => {
              //因为值引用的原因，所有this.monthList里面的值也会被改掉
              if (item.month == this.selectMonth) {
                let num = parseInt(item.waitNum) - dataLength;
                item.waitNum = num >= 0 ? num : 0;
              }
            })
            this.listReportPartner();
          } else {
            this.$message.error(res.msg)
          }
        })
      }
      //分页
      /*     handleCurrentChange(val) {
             this.table.currentPage = val;
           },
           handleSizeChange(val) {
             this.table.pageSize = val;
           },*/
    }
  }
</script>

<style lang="scss" scoped>
  .integral_list {

    .select_year {
      padding-top: 25px;
      line-height: 24px;
      i {
        font-size: 18px;
        vertical-align: middle;
      }
      .current_year {
        font-size: 14px;
        vertical-align: middle;
        margin-left: 10px;
        color: #333;
      }
      .switch_year {
        border: 1px solid #CCCCCC;
        padding: 3px 8px;
        color: #666666;
        border-radius: 13px;
        vertical-align: middle;
        margin-left: 24px;
        font-size: 12px;
        cursor: pointer;
      }
    }
    .month_wrap {
      margin-top: 25px;
      .month_item {
        width: 90px;
        height: 102px;
        border-radius: 8px;
        border: 1px solid #fff;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
        color: #78859D;
        margin-right: 23px;
        box-sizing: border-box;
        /*cursor: pointer;*/
        .month_hint {
          line-height: 30px;
          font-size: 12px;
          border-bottom: 1px solid #F3F3F3;
          text-align: center;
          box-sizing: border-box;
        }
        .month_hint_active {
          background: linear-gradient(90deg, #9BA4B5, #72798C);
          color: #fff;
          border-bottom-color: #72798C;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .month_content {
          line-height: 65px;
          height: 70px;
          text-align: center;

          span {
            font-weight: bold;
          }
          .num {
            font-size: 36px;
          }
          .hint {
            font-size: 20px;
          }
        }
        .month_content_active {
          background: #63697F;
          color: #FFFFFF;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
      .more_month_button {
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
        border: 1px solid #fff;
        text-align: center;
        color: #78859D;
        line-height: 50px;
        margin-left: 15px;
        cursor: pointer;
      }
      .more_month_button:hover, .month_item:hover {
        border-color: #78859D;
      }
    }

  }
</style>
<style lang="scss">
  .month_num {
    display: inline-block;
    width: 42px;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    color: #999999;
    text-align: center;
    cursor: pointer;
  }

  .month_num_active {
    background: #EDF8FF;
    color: #0680FD;
    border-radius: 3px;
  }

  .integral_hint {
    font-size: 12px;
    color: #999999;
    margin-right: 35px;
  }
</style>
