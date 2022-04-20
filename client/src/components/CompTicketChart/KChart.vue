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
import JSIndexScript from './umychart.index.data';
import * as umychartcomplier from './umychart.complier';
import { httpHelper, jwtHelper } from '@/common/utils';
export default {
  props: {
    code: { type: String, default: () => '600001.sz' },
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
      divKline.style.height = '360px';
      chart.OnSize();

      var option = {
        Type: '历史K线图',

        Windows: [
          // { Index: 'PBX', Modify: true, Change: true, Overlay: true },
          { Index: 'MA', Modify: true, Change: true, Overlay: true },
          // { Index: 'VOL', Modify: true, Change: true, Overlay: true },
          // { Index: 'RSI', Modify: true, Change: true, Overlay: true },
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
