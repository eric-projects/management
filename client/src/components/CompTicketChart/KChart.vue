<template>
  <div id="kline" style="position: relative; top: 0px; left: 0px">
    <div
      class="jschart-tooltip"
      id="guid641172d7-85dc-11c4-e01b-ad3a36aba2ed"
      style="
          background: rgb(255, 255, 255);
          opacity: 0.92;
          pointer-events: none;
          display: none;
          width: 157px;
          height: 225px;
          position: absolute;
          left: 910px;
          top: 329px;
        "
    >
      <span class="tooltip-title">2022-04-14&nbsp;&nbsp;四</span><span class="tooltip-con">开盘:</span
      ><span class="tooltip-num" style="color: rgb(238, 21, 21)">16.00</span><br /><span class="tooltip-con">最高:</span
      ><span class="tooltip-num" style="color: rgb(238, 21, 21)">16.25</span><br /><span class="tooltip-con">最低:</span
      ><span class="tooltip-num" style="color: rgb(238, 21, 21)">15.92</span><br /><span class="tooltip-con">收盘:</span
      ><span class="tooltip-num" style="color: rgb(238, 21, 21)">16.04</span><br /><span class="tooltip-con">数量:</span
      ><span class="tooltip-num" style="color: rgb(43, 54, 69)">92.96万</span><br /><span class="tooltip-con">金额:</span
      ><span class="tooltip-num" style="color: rgb(43, 54, 69)">14.93亿</span><br /><span class="tooltip-con">涨幅:</span
      ><span class="tooltip-num" style="color: rgb(238, 21, 21)">1.52%</span><br /><span class="tooltip-con">换手:</span
      ><span class="tooltip-num" style="color: rgb(43, 54, 69)">0.48%</span><br />
    </div>
    <div
      class="jschart-selectrect"
      id="guid0ddad5e3-21d6-6825-1f26-347a036baf35"
      style="background: rgba(1, 130, 212, 0.06); pointer-events: none; display: none"
    ></div>
  </div>
</template>

<script>
import $ from 'jquery';
import JSChart from './umychart';
import khelp from './calculate';
import JSIndexScript from './umychart.index.data';
import * as umychartcomplier from './umychart.complier';
import { httpHelper, jwtHelper } from '@/common/utils';
export default {
  props: {
    code: { type: String, default: () => '600001.sz' },
    zbs: { type: Array },
    width: { type: Number },
  },
  data() {
    return { chartObj: undefined };
  },
  mounted() {
    function JSNetwork() {}

    JSNetwork.HttpRequest = obj => {
      var url = obj.url;
      var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
      if (obj.type == 'post') {
        httpHelper.post(`/node-api/${jm}`, { ...obj.data }).subscribe(res => {
          console.log('node-api', res.value);
          obj.success(res.value);
        });
      } else {
        httpHelper.get(`/node-api/${jm}`, { params: { ...obj.data } }).subscribe(res => {});
      }

      // $.ajax({
      //   url: obj.url,
      //   data: obj.data,
      //   type: obj.type,
      //   dataType: obj.dataType,
      //   async: obj.async,
      //   success: obj.success,
      //   error: obj.error,
      // });
    };

    window.JSNetwork = JSNetwork;
    this.initChart();
    var testA = [
      [20220315, 5.15, 5.11, 5.14, 4.75, 4.75, 504265110, 2474659361],
      [20220316, 4.75, 4.81, 4.87, 4.67, 4.87, 374512254, 1787068031],
      [20220317, 4.87, 4.93, 5.0, 4.89, 4.93, 279440627, 1383547700],
      [20220318, 4.93, 4.9, 5.07, 4.89, 4.98, 392579123, 1958872316],
      [20220321, 4.98, 5.03, 5.03, 4.9, 4.93, 229664348, 1136998722],
      [20220322, 4.93, 4.94, 5.09, 4.9, 5.06, 284024701, 1425185838],
      [20220323, 5.06, 5.1, 5.34, 5.06, 5.26, 476802976, 2476082975],
      [20220324, 5.26, 5.21, 5.38, 5.2, 5.27, 265663485, 1406959262],
      [20220325, 5.27, 5.25, 5.32, 5.16, 5.26, 285302207, 1499110826],
      [20220328, 5.26, 5.22, 5.39, 5.2, 5.34, 300644650, 1599489173],
      [20220329, 5.34, 5.34, 5.35, 5.24, 5.3, 215127728, 1138826985],
      [20220330, 5.3, 5.32, 5.48, 5.27, 5.44, 360919536, 1947123801],
      [20220331, 5.44, 5.45, 5.55, 5.42, 5.44, 342267704, 1875079076],
      [20220401, 5.44, 5.4, 5.54, 5.39, 5.51, 339023761, 1852440261],
      [20220406, 5.51, 5.56, 6.03, 5.54, 5.97, 945506689, 5474500598],
      [20220407, 5.97, 5.96, 6.05, 5.83, 5.9, 548849358, 3264829144],
      [20220408, 5.9, 5.98, 6.22, 5.91, 6.12, 732791031, 4440785790],
      [20220411, 6.12, 6.11, 6.23, 6.0, 6.07, 555509777, 3384438971],
      [20220412, 6.07, 6.01, 6.11, 5.91, 5.93, 437022198, 2621162427],
      [20220413, 5.93, 5.93, 6.08, 5.84, 5.93, 343943540, 2050083728],
      [20220414, 5.93, 5.95, 6.1, 5.85, 6.01, 324171635, 1935550729],
      [20220415, 6.01, 6.01, 6.24, 5.98, 6.04, 383325019, 2334926747],
      [20220418, 6.04, 6.05, 6.23, 5.9, 5.94, 414107184, 2506492437],
      [20220419, 5.94, 5.93, 6.1, 5.87, 6.09, 333847179, 2004471249],
      [20220420, 6.09, 6.11, 6.11, 5.8, 5.86, 415845134, 2452502561],
      [20220421, 5.86, 5.8, 5.92, 5.74, 5.78, 254595781, 1481344384],
    ];
    // 开盘5.8 ，最高5.92，最低5.74，收盘5.78
    var objA = testA.map(m => {
      return { OPEN: m[2], CLOSE: m[5], HIGH: m[3], LOW: m[4] };
    });
    // console.log('chengguoqiang', khelp.ASI(objA));
    // console.log('chengguoqiang', khelp.PBX(testD, 5));
    // console.log('eric1111111111', khelp.MA(testD, 144));
    // console.log('eric1111111111', khelp.MA(testD, 233));
  },
  watch: {
    code: 'onChangeSymbol',
  },
  methods: {
    initChart() {
      var symbol = this.code;
      // 创建股票K线图
      var chart = JSChart.Init(document.getElementById('kline'));
      this.chartObj = chart;
      var height = $(window).height();
      var width = $(window).width();
      var divKline = document.getElementById('kline');
      divKline.style.width = (this.width || width) + 'px';
      divKline.style.height = 150 * (this.zbs || []).length + 360 + 'px';
      debugger;
      chart.OnSize();

      var option = {
        Type: '历史K线图',

        Windows: [
          // { Index: 'PBX', Modify: true, Change: true, Overlay: true },
          { Index: 'MA', Modify: true, Change: true, Overlay: true },
          // { Index: 'VOL', Modify: true, Change: true, Overlay: true },
          // { Index: 'RSI', Modify: true, Change: true, Overlay: true },
          // { Index: 'ASI', Modify: true, Change: true, Overlay: true },
        ], // 窗口指标

        OverlayIndex: [
          // { Index: 'RSI', Windows: 0 },
          // { Index: 'MACD', Windows: 0 },
          // { Index: 'MA', Windows: 1 },
          { Index: 'PBX', Windows: 0, IsShareY: true },
        ], // 叠加指标

        //   OverlayIndexFrameWidth: 50,

        Symbol: symbol,
        IsAutoUpdate: false, // 是自动更新数据
        // TradeIndex: {Index:'交易系统-BIAS'},    // 交易系统

        IsShowRightMenu: true, // 右键菜单
        IsShowCorssCursorInfo: true, // 是否显示十字光标的刻度信息

        KLine: {
          DragMode: 1, // 拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
          Right: 1, // 复权 0 不复权 1 前复权 2 后复权
          Period: 0, // 周期 0 日线 1 周线 2 月线 3 年线
          MaxReqeustDataCount: 1000, // 数据个数
          PageSize: 20, // 一屏显示多少数据
          IndexTreeApiUrl: 'https://opensourcecache.zealink.com/cache/hqh5/index/commonindextree.json', // 指标树下载地址
          // Info: ['互动易', '大宗交易', '龙虎榜', '调研', '业绩预告', '公告'], // 信息地雷
          // Info:["公告","互动易","调研"],          // 信息地雷
          KLineDoubleClick: true, // 双击分钟走势图
          IsShowTooltip: true, // 是否显示K线提示信息
          // FirstShowDate:20180401,             // 首屏显示的起始日期
        },

        // 标题设置
        KLineTitle: {
          IsShowName: true, // 不显示股票名称
          IsShowSettingInfo: true, // 不显示周期/复权
        },

        // 边框
        Border: {
          Left: 10, // 左边间距
          Right: 100, // 右边间距
          Bottom: 25,
          Top: 25,
        },

        // 扩展图形
        ExtendChart: [
          // {Name:'画图工具',Top:25,IsAutoIndent:1 }
        ],

        // 子框架设置 (Height 窗口高度比例值)
        Frame: [
          { SplitCount: 8, StringFormat: 0, IsShowLeftText: false },
          // { SplitCount: 2, StringFormat: 0, IsShowLeftText: false },
          // { SplitCount: 2, StringFormat: 0, IsShowLeftText: false },
        ],
      };

      if (this.zbs) {
        this.zbs.forEach(zb => {
          option.Windows.push({ Index: zb, Modify: true, Change: true, Overlay: true });
        });
      }

      var windowHeight = $(window).height();
      var windowWidth = $(window).width();
      if (windowWidth <= 420) {
        // 手机小屏左右不显示坐标
        option.Border.Left = 1;
        option.Border.Right = 1;
        option.KLine.IsShowTooltip = false; // 关闭pc端tooltip
        option.KLine.Info = null;
        option.KLine.PageSize = 50;
        option.ExtendChart = [{ Name: 'KLineTooltip' }]; // 开启手机端tooltip
        option.ExtendChart = null;
        option.IsCorssOnlyDrawKLine = true;
        option.CorssCursorTouchEnd = true;
        option.Windows.forEach(i => {
          option.Windows[i].Modify = false;
          option.Windows[i].Change = false;
        });
        // for (var i in option.Windows) {
        //   option.Windows[i].Modify = false;
        //   option.Windows[i].Change = false;
        // }
      }

      chart.SetOption(option);
      // this.resizeCanvas();
    },
    resizeCanvas() {
      var height = $(window).height();
      var width = $(window).width();
      var divKline = document.getElementById('kline');
      divKline.style.top = 0 + 'px';
      divKline.style.left = 0 + 'px';
      divKline.style.width = width + 'px';
      divKline.style.height = height + 'px';
      divKline.JSChart.OnSize();
    },
    onChangeSymbol(code) {
      this.chartObj.ChangeSymbol(code);
    },
    refreshData(code) {
      if (code) {
        this.chartObj.ChangeSymbol(code);
      }
    },
  },
};
</script>

<style></style>
