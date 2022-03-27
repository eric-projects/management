<template>
  <div>
    <a-row :gutter="8" class="pt-2 pl-2 pr-2">
      <a-col :span="6">
        <a-row type="flex" justify="start">
          <a-col flex="100px">统计量：</a-col>
          <a-col flex="auto"><a-slider style="width:100px" v-model="tCount" :tooltip-visible="true"/></a-col> </a-row
      ></a-col>
      <a-col :span="18"
        ><a-row type="flex" justify="end" :gutter="8">
          <a-col flex="100px">日期：</a-col>
          <a-col flex="auto">
            <a-range-picker format="YYYY-MM-DD" :disabled-date="disabledDate" @change="onChange"> </a-range-picker>
          </a-col>
          <a-col flex="200px">
            <a-button type="primary" @click="lookRangeDate">查看</a-button>
            <a-button class="ml-2" ghost type="primary" @click="lastWeek">近1周</a-button>
            <a-button class="ml-2" ghost type="primary" @click="lastMonth">近1月</a-button>
          </a-col>
        </a-row></a-col
      >
    </a-row>
    <a-divider />
    <a-row>
      <a-col :span="12">
        <echart :option="yybbar"></echart>
      </a-col>
      <a-col :span="12">
        <echart :option="yybpie"></echart>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ticketApi from './ticket-api';
import echart from '../ShareComp/echart.vue';
export default {
  components: {
    echart,
  },
  data() {
    return { nowDate: '', rangeDate: '', rangeValue: [], tCount: 10, yybbar: undefined, yybpie: undefined };
  },
  mounted() {
    this.nowDate = this.currentDate();
    this.rangeDate = this.nowDate;
    this.getData([this.nowDate]);
  },
  methods: {
    getData(dates) {
      var arry = [];
      var record = [];
      var flag = 0;
      for (let i = 0; i < dates.length; i++) {
        if (!record.includes(dates[i])) {
          record.push(dates[i]);
          ticketApi.initRank(dates[i]).subscribe(res => {
            flag++;
            var jxData = this.jx(res.value);
            arry.push(jxData);
            if (flag == dates.length) {
              var totalJxData = this.totalJx(arry);
              this.initBar(totalJxData.yybRank);
              this.initRank(totalJxData.ticketcount);
            }
          });
        } else {
          flag++;
        }
      }
    },
    initBar(res) {
      var resData = res.filter((f, i) => i < this.tCount);
      var option = {
        title: {
          text: '营业部统计',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: (params, ticket, callback) => {
            var a = params.data.name;
            var c = params.value;
            var d = params.percent;
            var item = res.find(f => f[1] == a);
            var money = this.moneyTransfer(c);
            debugger;
            var ticketStr = item[3].replace(/--/g, '');
            var ticketStrArry = ticketStr.split(';');
            var result = `${item[1]}<br>${money.value}${money.unit}<br>`;
            if (ticketStrArry.length > 5) {
              var linshi = '';
              for (var i = 1; i <= ticketStrArry.length; i++) {
                linshi += ticketStrArry[i] + ';';
                if (i % 5 == 0 || i == ticketStrArry.length - 1) {
                  result += `${linshi}<br>`;
                  linshi = '';
                }
              }
            } else {
              result += `${ticketStr}`;
            }
            return result;
          },
        },
        legend: {
          data: resData.map(m => m[1]),
          show: false,
        },
        series: [
          {
            name: '营业部',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              position: 'inner',
              fontSize: 12,
            },
            labelLine: {
              show: false,
            },
            data: res.filter((f, i) => i < 3).map(m => ({ value: m[4], name: m[1] })),
          },
          {
            name: '营业部',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
              length: 30,
            },
            label: {
              formatter: params => {
                var a = params.data.name;
                var c = params.value;
                var d = params.percent;
                var item = res.find(f => f[1] == a);
                var money = this.moneyTransfer(item[4]);
                // '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ';
                var ticketStr = item[3].replace(/--/g, '');
                var result = `{a|${item[1]}}\n{hr|}\n {aa|${ticketStr}}\n{aa|${money.value}${money.unit}}`;
                return result;
              },

              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 26,
                  fontWeight: 600,
                  align: 'left',
                },
                aa: {
                  color: '#6E7079',
                  lineHeight: 20,
                  align: 'left',
                },
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0,
                },
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33,
                },
              },
            },
            data: res.filter((f, i) => i > 2 && i < 12).map(m => ({ value: m[4], name: m[1] })),
          },
        ],
      };

      this.yybpie = option;
    },
    initRank(res) {
      var resKeys = Object.keys(res).filter((f, i) => i < this.tCount);
      var option = {
        title: {
          text: '营业部入场量',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: resKeys.reverse(),
        },
        series: [
          {
            name: this.rangeDate,
            type: 'bar',
            label: {
              show: true,
              position: 'inside',
              color: '#FFFFFF',
              formatter: params => {
                var item = res[params.name];
                var text = '';
                if (item.code.includes('sz3')) {
                  text = '创业';
                } else if (item.code.includes('sz688')) {
                  text = '科创';
                }
                console.log('params', item);
                return `${item.code} ${text}`;
              },
            },
            data: resKeys.map(m => {
              return {
                value: res[m].count,
                name: m,
                itemStyle: {
                  color: res[m].code.includes('sz3') ? '#FF7070' : res[m].code.includes('sz688') ? '#FF915A' : '#4786e6',
                },
              };
            }),
          },
        ],
      };

      this.yybbar = option;
    },
    onChange(date, str) {
      this.rangeValue = str;
    },
    disabledDate(current) {
      var valueD = new Date(current);
      var valueDStr = `${valueD.getFullYear()}-${valueD.getMonth() + 1}-${valueD.getDate()}`;
      return new Date(valueDStr) > new Date(this.nowDate);
    },
    lookRangeDate() {
      if (this.rangeValue.length < 1) {
        return;
      }
      this.rangeDate = this.rangeValue[0] + ' ~ ' + this.rangeValue[1];
      var dates = [];
      var flag = true;
      var startDate = new Date(this.rangeValue[0]);
      var endDay = new Date(this.rangeValue[1]).getDay();
      while (flag) {
        var nextDate = '';
        if (dates.length > 0) {
          nextDate = this.nextDate(dates[dates.length - 1]);
        } else {
          nextDate = this.nextDate(this.rangeValue[1]);
        }

        if (!nextDate || new Date(nextDate) < startDate) {
          flag = false;
        } else {
          dates.push(nextDate);
        }
      }

      if (endDay > 0 && endDay < 6) {
        dates.push(this.rangeValue[1]);
      }

      this.getData(dates);
    },
    lastWeek() {
      var dlist = [this.nowDate];
      for (var i = 0; i < 4; i++) {
        var dlistLen = dlist.length;
        dlist.push(this.nextDate(dlist[dlistLen - 1]));
      }
      this.rangeDate = `${dlist[dlist.length - 1]} ~ ${dlist[0]}`;
      this.getData(dlist);
    },
    lastMonth() {
      var dlist = [this.nowDate];
      for (var i = 0; i < 30; i++) {
        var dlistLen = dlist.length;
        dlist.push(this.nextDate(dlist[dlistLen - 1]));
      }
      this.rangeDate = `${dlist[dlist.length - 1]} ~ ${dlist[0]}`;
      this.getData(dlist);
    },
    jx(data) {
      if (!data || !data.data || !data.data.yyb) {
        return {};
      }
      var yyb = data.data.yyb;
      var len = yyb.length;
      // var tj = {};
      // var gsArry = [];
      var gsData = {};
      for (var i = 0; i < len; i++) {
        var gs = yyb[i][3];
        if (gs == '--') {
          continue;
        }
        var gsSplit = gs.split(';');
        var bm = yyb[i][1];
        var codes = yyb[i][2].split(';');
        // var money = yyb[i][4];
        var gsLen = gsSplit.length;
        for (var j = 0; j < gsLen; j++) {
          var currentGs = gsSplit[j];
          if (!gsData[currentGs]) {
            gsData[currentGs] = { code: codes[j], count: 0, yyb: '' };
          }
          gsData[currentGs].count++;
          gsData[currentGs].yyb += ';' + bm;
          // gsData[currentGs].money += money;
        }
        // gsArry = gsArry.concat(gsSplit);
        // tj[bm] = (tj[bm] || []).concat(gsSplit);
      }

      var sortKeys = Object.keys(gsData).sort((a, b) => {
        return gsData[b].count - gsData[a].count;
      });

      var ticketcount = {};
      var resultArry = {};
      for (var i = 0; i < sortKeys.length; i++) {
        ticketcount[sortKeys[i]] = gsData[sortKeys[i]];
        resultArry[sortKeys[i]] = gsData[sortKeys[i]].count;
      }

      return { ticketcount: ticketcount, yybRank: yyb };
    },
    totalJx(data) {
      debugger;
      var result = { ticketcount: {}, yybRank: [] };
      for (var i = 0; i < data.length; i++) {
        var current = data[i];
        if (Object.keys(current) == 0) {
          continue;
        }
        var currentTicketcount = current.ticketcount;
        var keys = Object.keys(currentTicketcount);
        keys.forEach(f => {
          if (result.ticketcount[f]) {
            result.ticketcount[f] = { code: result.ticketcount[f].code, count: result.ticketcount[f].count + currentTicketcount[f].count };
          } else {
            result.ticketcount[f] = currentTicketcount[f];
          }
        });

        var currentyyb = current.yybRank;
        currentyyb.forEach(f => {
          var index = result.yybRank.findIndex(fi => fi[0] == f[0]);
          if (index == -1) {
            result.yybRank.push(f);
          } else {
            var newArry = [];
            newArry.push(f[0]);
            newArry.push(f[1]);

            newArry.push(f[2] + result.yybRank[index][2]);
            newArry.push(f[3] + result.yybRank[index][3]);
            newArry.push(f[4] + result.yybRank[index][4]);
            result.yybRank[index] = newArry;
          }
        });
      }

      debugger;
      console.log(result.ticketcount);
      var sortKeys = Object.keys(result.ticketcount).sort((a, b) => {
        return result.ticketcount[b].count - result.ticketcount[a].count;
      });

      var ticketcount = {};
      for (var i = 0; i < sortKeys.length; i++) {
        ticketcount[sortKeys[i]] = result.ticketcount[sortKeys[i]];
      }

      result.yybRank = result.yybRank.sort((a, b) => {
        return b[4] - a[4];
      });
      result.ticketcount = ticketcount;

      return result;
    },
    moneyTransfer(value) {
      var param = {};
      var k = 10000,
        sizes = ['', '万', '亿', '万亿'],
        i;
      if (value < k) {
        param.value = value;
        param.unit = '';
      } else {
        i = Math.floor(Math.log(value) / Math.log(k));

        param.value = (value / Math.pow(k, i)).toFixed(2);
        param.unit = sizes[i];
      }
      return param;
    },
    nextDate(current) {
      var next = '';
      var d = new Date();
      if (current) {
        d = new Date(current);
      }

      var dhour = d.getHours();
      d.setDate(d.getDate() - 1);
      var dweek = d.getDay();
      var addDay = 0;
      switch (dweek) {
        case 6:
          addDay = -1;
          break;
        case 0:
          addDay = -2;
          break;
      }
      d.setDate(d.getDate() + addDay);
      var dy = d.getFullYear();
      var dm = (d.getMonth() + 1 + '').padStart(2, '0');
      var dd = (d.getDate() + '').padStart(2, '0');
      next = `${dy}-${dm}-${dd}`;
      return next;
    },
    currentDate() {
      var current = '';
      var d = new Date();
      var dhour = d.getHours();
      var dweek = d.getDay();
      var addDay = 0;
      switch (dweek) {
        case 1:
          addDay = dhour < 17 ? -3 : 0;
          break;
        case 6:
          addDay = -1;
          break;
        case 0:
          addDay = -2;
          break;
        default:
          addDay = dhour < 17 ? -1 : 0;
          break;
      }
      d.setDate(d.getDate() + addDay);
      var dy = d.getFullYear();
      var dm = (d.getMonth() + 1 + '').padStart(2, '0');
      var dd = (d.getDate() + '').padStart(2, '0');
      current = `${dy}-${dm}-${dd}`;
      return current;
    },
  },
};
</script>

<style></style>
