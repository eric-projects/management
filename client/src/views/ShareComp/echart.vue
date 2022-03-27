<template>
  <div ref="echart" :style="'height: ' + height"></div>
</template>

<script>
let ecahrts = require('echarts/lib/echarts');
require('echarts/lib/chart/pie');
require('echarts/lib/chart/bar');

require('echarts/lib/chart/effectScatter'); // 拐点出闪烁，高亮
require('echarts/lib/component/tooltip'); // 提示组件
require('echarts/lib/component/legend'); // 图例组件
require('echarts/lib/component/markPoint'); // 标注点组件
require('echarts/lib/component/markLine'); // 标注线组件
require('echarts/lib/component/graphic'); // 图形组件
require('echarts/lib/component/grid'); // 网格组件
require('echarts/lib/component/dataZoom'); // 底下滑动框组件
require('echarts/lib/component/title');
export default {
  props: {
    height: {
      type: String,
      default: '350px',
    },
    option: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  watch: {
    option: 'initChart',
  },
  mounted() {
    if (this.option) {
      this.initChart(this.option);
    }
  },
  methods: {
    initChart(option) {
      var myChart = ecahrts.init(this.$refs.echart);
      myChart.setOption(option);
    },
  },
};
</script>

<style></style>
