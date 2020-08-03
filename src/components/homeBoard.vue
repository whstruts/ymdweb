<template>
  <div class="home-board">
    <div class="xz-info-box">
      <div class="xz-info">
        <div class="news"><i class="iconfont icon-gonggao"></i>
          <MarqueeRollUp
            :marqueeList="newslist"
            speed="300"
            autoPlay="2000"
            color="#666"
            width="300"
            bg="transparent"
            fontSize="14">
          </MarqueeRollUp>
        </div>
        <div class="flex-wrp">
          <div class="ul-box order-statis" style="width: 321px;">
            <div class="item-header">
              <h2>今日销售</h2>
            </div>
            <div class="l-ul">
              <div class="item-box">
                <ul class="">
                  <li>
                    <p><span class="price">{{indexData.todaySales || 0}}</span>/元</p>
                    <p class="p-title">已付款</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="ul-box order-statis" style="width: 321px;">
            <div class="item-header">
              <h2>今日新订单</h2>
            </div>
            <div class="l-ul">
              <div class="item-box">
                <ul class="flex-wrp">
                  <li class="flex-item">
                    <p><span>{{indexData.todayOrderWaitPayNum || 0}}</span></p>
                    <p class="p-title">待付款</p>
                  </li>
                  <li class="flex-item">
                    <p><span>{{indexData.todayOrderAccountPaidNum || 0}}</span></p>
                    <p class="p-title">已付款</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="ul-box order-statis flex-item">
            <div class="item-header">
              <h2>今日新用户</h2>
            </div>
            <div class="flex-wrp">
              <div class="l-ul flex-item" style="flex:2">
                <div class="item-box">
                  <ul class="flex-wrp">
                    <li class="flex-item">
                      <p style="margin-top:17px;"><img src="../assets/img/board/icon_store.png"/></p>
                      <p class="p-title">客户</p>
                    </li>
                    <li class="flex-item">
                      <p><span>{{indexData.todayCustomerWaitAuditNum || 0}}</span></p>
                      <p class="p-title">待审核</p>
                    </li>
                    <li class="flex-item">
                      <p><span>{{indexData.todayCustomerWaitSubmitNum || 0}}</span></p>
                      <p class="p-title">待认证</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="l-ul flex-item" style="flex:1">
                <div class="item-box">
                  <ul class="flex-wrp">
                    <li class="flex-item">
                      <p style="margin-top:17px;"><img src="../assets/img/board/icon_member.png"/></p>
                      <p class="p-title">分销</p>
                    </li>
                    <li class="flex-item">
                      <p><span>{{indexData.todayPartnerWaitBidPriceNum || 0}}</span></p>
                      <p class="p-title">待加价处理</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 重要提醒 -->
        <div class="information">
          <div class="ul-box order-statis flex-item">
            <div class="item-header">
              <h2>重要提醒</h2>
            </div>
            <div class="flex-wrp">
              <div class="l-ul flex-item">
                <div class="item-box">
                  <ul class="flex-wrp">
                    <li class="flex-item">
                      <p><img src="../assets/img/board/icon_order.png"/></p>
                      <p class="p-title" style="margin-top: -7px">订单提醒</p>
                    </li>
                    <li class="flex-item">
                      <p><span>{{indexData.orderWaitPayNum || 0}}</span></p>
                      <p class="p-title">待付款</p>
                    </li>
                    <li class="flex-item">
                      <p><span>{{indexData.orderAccountPaidNum  || 0}}</span></p>
                      <p class="p-title">待发货</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="l-ul flex-item">
                <div class="item-box">
                  <ul class="flex-wrp">
                    <li class="flex-item">
                      <p><img src="../assets/img/board/icon_commondy.png"/></p>
                      <p class="p-title" style="margin-top: -7px">商品提醒</p>
                    </li>
                    <li class="flex-item">
                      <p><span>{{indexData.commodityStockoutNum || 0}}</span></p>
                      <p class="p-title">缺货商品</p>
                    </li>
                    <li class="flex-item">
                      <p><span>{{indexData.commoditySellOutNum || 0}}</span></p>
                      <p class="p-title">售罄商品</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="l-ul flex-item">
                <div class="item-box">
                  <ul class="flex-wrp">
                    <li class="flex-item">
                      <p><img src="../assets/img/board/icon_zz.png"/></p>
                      <p class="p-title" style="margin-top: -7px">客户资质提醒</p>
                    </li>
                    <li class="flex-item">
                      <p><span>{{indexData.customerBeAboutToExpireNum || 0}}</span></p>
                      <p class="p-title">即将过期</p>
                    </li>
                    <li class="flex-item">
                      <p><span>{{indexData.customerHaveExpiredNum || 0}}</span></p>
                      <p class="p-title">已过期</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 总采购额 -->
        <div class="ul-box">
          <div class="item-header">
            <h2>总采购额 <i>(元)</i></h2>
            <span>近30日订单（{{beginDate}}/{{endDate}})</span>
          </div>
          <div class="chart-box">
            <chart id="lineChart2" ref="lineChart" :options="orgOptionLine" :auto-resize="true"
                   style="wdith: 100%"></chart>
          </div>
        </div>


        <div class="china-map-wrapper" v-loading="loadingMap">
          <div class="ul-box">
            <div class="item-header">
              <h2>地域分布</h2>
              <span>
                <el-radio-group v-model="customerType" @change="changeCustomerType">
                  <el-radio label="1">客户</el-radio>
                  <el-radio label="2">分销</el-radio>
                </el-radio-group>
              </span>
            </div>
            <div class="col-2 flex-wrp">
              <div class="chart-box" style="width: 860px">
                <chart id="chinaMap" ref="chinaMap" :options="orgOptionsMap" :auto-resize="true"
                       style="width:100%"></chart>
              </div>
              <div class="flex-item">
                <div class="chartbar">
                  <h2><a @click="changeTop10(1)">省份</a>&nbsp;&nbsp;&nbsp;&nbsp;<a @click="changeTop10(2)">区域</a>&nbsp;&nbsp;&nbsp;&nbsp;<a @click="changeTop10(3)">城市</a></h2>
                  <div class="area-list">
                    <div class="area-item flex-wrp" v-for="(item,index) in dataTop10">
                      <span>{{index+1}}.{{item.name}}</span>
                      <div class="bar">
                        <p class="present" :style="{width: item.percentage}"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 网站概况 -->,;
        <!-- <div class="ul-box">
          <div class="item-header">
            <h2>网站概况</h2>
            <span>数据来源< 友盟 <a href="http://www.umeng.com" target="_blank">http://www.umeng.com</a>></span>
          </div>
          <div class="flex-wrp">
            <div class="l-ul flex-item fl">
              <div class="item-box flex-wrp">
                <div class="icon-today">今日</div>
                <ul class="flex-item">
                  <li>
                    <p class="p-title">浏览次数(PV)</p>
                    <span>8</span>
                  </li>
                  <li>
                    <p class="p-title">独立访客(UV)</p>
                    <span>8</span>
                  </li>
                  <li>
                    <p class="p-title">新独立访客</p>
                    <span>150</span>
                  </li>
                  <li>
                    <p class="p-title">访问次数</p>
                    <span>8</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="l-ul flex-item fr">
              <div class="item-box flex-wrp">
                <div class="icon-yestoday">昨日</div>
                <ul class="flex-item">
                  <li>
                    <p class="p-title">浏览次数(PV)</p>
                    <span>8</span>
                  </li>
                  <li>
                    <p class="p-title">独立访客(UV)</p>
                    <span>8</span>
                  </li>
                  <li>
                    <p class="p-title">新独立访客</p>
                    <span>150</span>
                  </li>
                  <li>
                    <p class="p-title">访问次数</p>
                    <span>8</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> -->
        <!-- APP启动次数 -->
        <!-- <div class="ul-box">
          <div class="item-header">
            <h2>APP启动次数</h2>
            <span>
              <el-radio-group v-model="appType">
                <el-radio label="1">药满多-电商APP</el-radio>
                <el-radio label="2">药满多-业务APP</el-radio>
              </el-radio-group>
            </span>
          </div>
          <div class="search_bg_wrap flex-row" style="padding:20px 30px">
            <p>
              <span class="search_hint">选择时间</span>
              <el-date-picker
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-model="filters.createTime"
                size="mini" style="width: 240px" :editable="false" value-format="yyyy-MM-dd"
                format="yyyy-MM-dd">
              </el-date-picker>
            </p>
            <p>
              <span class="search_hint" style="padding-left:30px">渠&nbsp;&nbsp;&nbsp;&nbsp;道</span>
              <el-select v-model="filters.status" placeholder="请选择" size="mini" @change="handleSearch">
                <el-option v-for="item in statusData"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </p>
            <p>
              <span class="search_hint" style="padding-left:30px">版&nbsp;&nbsp;&nbsp;&nbsp;本</span>
              <el-select v-model="filters.status"news placeholder="请选择" size="mini" @change="handleSearch">
                <el-option v-for="item in statusData"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </p>
            <div class="flex-item" style="text-align:right">
              <el-radio-group v-model="filters.tt" size="mini">
                <el-radio-button label="小时"></el-radio-button>
                <el-radio-button label="天"></el-radio-button>
                <el-radio-button label="周"></el-radio-button>
                <el-radio-button label="月"></el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-box">
            <chart id="lineChart" ref="lineChart" :options="orgOptionLine" :auto-resize="true"
                   style="wdith: 100%"></chart>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
  import MarqueeRollUp from 'marquee-roll-up'
  import API from "../api/api_dashboard"
  export default {
    name: "homeBoard",
    data() {
      return {
        loading: false,
        loadingMap: false,
        indexData: {},
        newslist: [],
        beginDate:'',
        endDate:'',
        dataTop10: [],
        topType:1,
        orgOptionLine: {},
        orgOptionsMap: {},
        customerType: "1",
        appType: "1",
        filters: {
          createTime: "",

        },
        statusData: []
      }
    },
    components: {MarqueeRollUp},
    mounted() {
      window.onresize = lineChart2.resize;
      window.onresize = chinaMap.resize;
      this.getBoard();
    },
    methods: {
      handleSearch() {

      },
      getBoard(){
        API.dashboard().then( res=> {
          if(res.code == 0) {
            let orderDateX = res.data.orderDateX;
            let data = res.data;
            for(let i in data.customerMapTotal){  // 处理一下地图value值，只能接受number
              data.customerMapTotal[i].value = Number(data.customerMapTotal[i].value)
            }
            for(let i in data.partnerMapTotal){  // 处理一下地图value值，只能接受number
              data.partnerMapTotal[i].value = Number(data.partnerMapTotal[i].value)
            }
            this.indexData = data;
            this.beginDate = orderDateX[0];
            this.endDate = orderDateX[orderDateX.length-1];
            this.newslist = res.data.rollMessage;
            this.lineChart(res.data.orderDateX,res.data.orderPriceY,res.data.orderCountY,res.data.customerCountY);
            this.mapChart();
            this.getTop10();

          }
        })
      },
      // 切换客户和分销
      changeCustomerType(){
        this.loadingMap = true;
        this.topType = 1;
        this.mapChart();
        this.getTop10();
      },
      changeTop10(num) {
        this.topType = num;
        this.getTop10();
      },
      // 获取top10
      getTop10(){
        console.log(this.indexData.partnerCityTop10)
        let data = [];
        if(this.customerType == 1) {
          if(this.topType == 1) {
            data = this.indexData.customerProvinceTop10;
          } else if( this.topType == 2) {
            data = this.indexData.customerRegionTop10;
          } else {
            data = this.indexData.customerCityTop10;
          }
          for(let i in data) {
            data[i].percentage = data[i].value/this.indexData.customerCount *100 +"%";
          }
        } else {
          if(this.topType == 1) {
            data = this.indexData.partnerProvinceTop10;
          } else if( this.topType == 2) {
            data = this.indexData.partnerRegionTop10;
          } else {
            data = this.indexData.partnerCityTop10;
          }
           for(let i in data) {
            data[i].percentage = data[i].value/this.indexData.partnerCount *100 +"%";
          }
        }
        this.dataTop10 = data;
      },
      lineChart(xData,orderPriceY,orderCountY,customerCountY){
        this.orgOptionLine = {
          title: {
            text: '',
            subtext: ''
          },
          tooltip: {
            trigger: 'axis',
            type: 'cross',
            formatter: function (params) {
              let res = ''
              for(let x in params) {
                res = '订单总额：' + params[0].data + '元<br>' +
                '订单数：' + params[1].data + '个<br>' +
                '下单客户数：' + params[2].data + '位<br>'
              }
              return res;
            },
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {readOnly: false},
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          grid: {
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#F2F4F3'
              }
            },
            //坐标轴内线的样式
            splitLine: {
              lineStyle: {
                color: '#F2F4F3',
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#9A9A9A'
              }
            },
            data: xData
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            },
            //y轴颜色
            axisLine: {
              lineStyle: {
                color: '#F2F4F3'
              }
            },
            //坐标轴内线的样式
            splitLine: {
              lineStyle: {
                color: '#F2F4F3',
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#9A9A9A'
              }
            },
          },
          series: [
            {
              name: '订单总额',
              type: 'line',
              data: orderPriceY,
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                ]
              },
              lineStyle: {
                color: '#0090FF',
                width: 1.5
              },
              color: "#0090FF", // 折线点的颜色
              symbolSize: 10,   //折线点的大小
            },
            {
              name: '订单数',
              type: 'line',
              data: orderCountY,
              show: false,
              itemStyle:{opacity: 0}, // 隐藏节点
              lineStyle:{opacity:0}   // 隐藏折线
            },
            {
              name: '下单客户数',
              type: 'line',
              data:  customerCountY,
              show: false,
              itemStyle:{opacity: 0},
              lineStyle:{opacity:0}
            }
          ]
        }
      },
      mapChart(){
        let data = this.customerType == 1? this.indexData.customerMapTotal: this.indexData.partnerMapTotal;
        let arr = [];
        for(let i in data) {
          arr.push(data[i].value)
        }
        arr.sort(function(a,b){return a-b;});
        let maxN = arr[arr.length-1];  // 取最大值
        this.orgOptionsMap = {
          tooltip: {},
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['']
          },
          visualMap: {
            type: 'piecewise',
            left: '10%',
            right: '2%',
            bottom: '5%',
            text: ['高', '低'],
            min: 0,
            max: maxN,
            calculable: true,
            orient: 'horizontal',
            color: ['#5AD2F9', '#51D0F9', '#86DEFB', '#B1EAFC', '#DAF4FE']
          },
          selectedMode: 'single',
          series: [
            {
              name: '',
              type: 'map',
              mapType: 'china',
              zoom: 1.2,
              itemStyle: {
                normal: {
                  borderColor: 'rgba(0, 0, 0, 0.2)'
                },
                emphasis: {
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowBlur: 20,
                  borderWidth: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              showLegendSymbol: true,
              label: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: true
                }
              },
              data: data
            }
          ]
        }
        setTimeout( () => {
          this.loadingMap = false;
        },500)

      }
    }
  }
</script>

<style scoped lang='scss'>
  .home-board {
    background: #F7F7F7;
    .xz-info-box {
      width: 100%;
      height: 100%;
      overflow-x: auto;
      box-sizing: border-box;
    }
    .xz-info {
      margin: 0 auto;
      min-width: 1280px;
      .news {
        position: relative;
        padding-left: 14px;
        font-size: 14px;
        height: 38px;
        line-height: 38px;
        color: #666666;
      }
      .icon-gonggao {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 15px;
        color: #46A1FF;
      }
      height: 100%;
      .icon-today, .icon-yestoday {
        width: 53px;
        height: 53px;
        line-height: 53px;
        text-align: center;
        font-size: 16px;
        color: #fff;
        border-radius: 50%;
      }
      .icon-today {
        background: linear-gradient(-18deg, rgba(52, 170, 242, 1), rgba(6, 128, 253, 1));
      }
      .icon-yestoday {
        background: linear-gradient(-18deg, rgba(161, 207, 88, 1), rgba(99, 195, 34, 1));
      }
      .ul-box {
        margin-bottom: 28px;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        .item-header {
          position: relative;
          padding: 5px 10px 5px 34px;
          border-bottom: 1px solid #ECECEC;
          &:before {
            position: absolute;
            content: "";
            width: 2px;
            height: 12px;
            top: 50%;
            left: 22px;
            margin-top: -6px;
            background: #0680FD;
          }
          h2 {
            display: inline-block;
            font-size: 14px;
            color: #404040;
            i {
              font-style: normal;
              color: #666;
            }
          }
          span {
            padding-left: 54px;
            font-size: 12px;
            color: #666;
          }
        }
      }
      .l-ul {
        position: relative;
        padding: 12px 30px;
        overflow: hidden;
        &:first-child {
          padding-right: 60px;
          &:after {
            position: absolute;
            content: "";
            top: 50%;
            margin-top: -32px;
            right: 30px;
            height: 65px;
            width: 1px;
            background: #E6E6E6;
          }
        }
        li {
          float: left;
          width: 25%;
          text-align: center;
          p {
            font-size: 14px;
            color: #333;
            text-align: center;
          }
          span {
            font-size: 30px;
            font-weight: 400;
            line-height: 1.9;
            &.price {
              color: #3399FF;
            }
          }
        }
      }
      .r-ul {
        width: 300px;
        li {
          float: left;
          width: 50%;
          span {
            padding: 3px 10px;
            border: 1px solid #ccc;
            border-radius: 10px;
          }
          p {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
          }
        }
      }
    }
    .chart-wrapper {
      display: -webkit-box;
      width: 100%;
      margin-bottom: 28px;
      overflow: hidden;
    }
    .table-box {
      padding: 17px 23px 53px;
      box-sizing: border-box;
    }
    .order-statis {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
      .l-ul {
        box-sizing: border-box;
        li {
          width: 100%;
        }
        .p-title {
          color: #666 !important;
        }
      }
    }
    .chart-box {
      padding: 10px 20px 20px;
    }
    #lineChart, #lineChart2 {
      width: 100%;
    }
    .china-map-wrapper {
      .col-2 {
        &.flex-wrp {
          align-items: flex-start
        }
      }
      .chartbar {
        h2 {
          padding: 15px 0;
          font-size: 12px;
          font-weight: bold;
          color: #666;
          border-bottom: 1px solid #ECECEC;
          a{
            cursor: pointer;
          }
        }
        .area-item {
          padding: 6px 0;
        }
        span {
          width: 200px;
          font-weight: bold;
          text-align: left;
          color: #666;
        }
        .bar {
          position: relative;
          width: 240px;
          height: 5px;
          background: #f0f0f0;
        }
        .present {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #1DC2F6;
        }
      }
    }
  }
</style>
