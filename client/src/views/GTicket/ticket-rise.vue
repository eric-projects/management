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
        <echart :option="rise"></echart>
      </a-col>
      <a-col :span="12">
        <echart :option="onerise"></echart>
      </a-col>
    </a-row>
    <a-divider />
    <a-dropdown class="ml-2">
      <a-menu slot="overlay" @click="addSelect">
        <a-menu-item v-for="item in mySelectOption" :key="item.groupId">
          {{ item.groupName + '_' + item.stockList.length }}
        </a-menu-item>
      </a-menu>
      <a-button type="primary"> 加入自选 <a-icon type="down" /> </a-button>
    </a-dropdown>
    <!-- <a-button class="ml-2" ghost type="primary" @click="clearSelect">清空自选</a-button> -->
    <a-dropdown class="ml-2">
      <a-menu slot="overlay" @click="clearSelect">
        <a-menu-item v-for="item in mySelectOption" :key="item.groupId">
          {{ item.groupName + '_' + item.stockList.length }}
        </a-menu-item>
      </a-menu>
      <a-button> 清空自选 <a-icon type="down" /> </a-button>
    </a-dropdown>
    <a-button class="ml-2" ghost type="primary" @click="updateSelect">刷新自选</a-button>
    <div class="ml-2 mt-1">
      <h3>一字：</h3>
      <a-checkbox-group v-model="checkedOneRiseList" :options="oneRiseSelect" />
      <a-divider />
      <h3>涨停：</h3>
      <div :style="{ borderBottom: '1px solid #E9E9E9' }">
        <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
          全选
        </a-checkbox>
      </div>
      <br />
      <a-checkbox-group v-model="checkedRiseList" :options="risetSelect" />
    </div>
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
    return {
      indeterminate: false,
      checkAll: false,
      nowDate: '',
      rangeDate: '',
      rangeValue: [],
      tCount: 10,
      onerise: undefined,
      rise: undefined,
      oneRiseSelect: [],
      risetSelect: [],
      checkedOneRiseList: [],
      checkedRiseList: [],
      allTicketList: [],
      mySelectOption: [],
    };
  },
  mounted() {
    this.nowDate = this.currentDate();
    this.rangeDate = this.nowDate;
    this.getData([this.nowDate]);
    this.initMySelect();
  },
  methods: {
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedRiseList: e.target.checked ? this.risetSelect : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });

      // console.log(this.checkedRiseList);
    },
    getData(dates) {
      var arry = [];
      var record = [];
      var flag = 0;
      for (let i = 0; i < dates.length; i++) {
        if (!record.includes(dates[i])) {
          record.push(dates[i]);
          ticketApi.initRise(dates[i]).subscribe(res => {
            flag++;
            var jxData = this.jx(res.value);
            arry.push(jxData);
            if (flag === dates.length) {
              this.initRank(jxData.rise);
              this.initPie(jxData.one_rise);
            }
          });
        } else {
          flag++;
        }
      }
    },
    initRank(res) {
      var resKeys = res.filter((f, i) => i < this.tCount).map(f => f.name);
      var resValue = res.filter((f, i) => i < this.tCount);
      var option = {
        title: {
          text: '涨停',
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
                var code = params.data.code;
                var text = '';
                if (code.includes('sz3')) {
                  text = '创业';
                } else if (code.includes('sz688')) {
                  text = '科创';
                }
                return `${code} ${text}`;
              },
            },
            data: resValue.reverse(),
          },
        ],
      };

      this.rise = option;
    },
    initPie(res) {
      var resKeys = res.filter((f, i) => i < this.tCount).map(f => f.name);
      var resValue = res.filter((f, i) => i < this.tCount && !f.top);
      var resTopValue = res.filter((f, i) => i < this.tCount && f.top);
      var option = {
        title: {
          text: '一字涨停',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: (params, ticket, callback) => {
            var a = params.data.name;
            var c = params.value;
            var d = params.percent;
            var result = `${a}<br>板块：${params.data.profession}<br>涨停天数：${c}<br>比例：${d}<br>`;
            // if (ticketStrArry.length > 5) {
            //   var linshi = '';
            //   for (var i = 1; i <= ticketStrArry.length; i++) {
            //     linshi += ticketStrArry[i] + ';';
            //     if (i % 5 == 0 || i == ticketStrArry.length - 1) {
            //       result += `${linshi}<br>`;
            //       linshi = '';
            //     }
            //   }
            // } else {
            //   result += `${ticketStr}`;
            // }
            return result;
          },
        },
        legend: {
          data: resKeys,
          show: false,
        },
        series: [
          {
            name: '强一字',
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
            data: resTopValue,
          },
          {
            name: '一字',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
              length: 30,
            },
            label: {
              formatter: params => {
                var a = params.data.name;
                var b = params.value;
                var d = params.percent;
                // var item = res.find(f => f.name == a);
                // var money = this.moneyTransfer(item[4]);
                // '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ';
                // var ticketStr = item[3].replace(/--/g, '');
                // var result = `{a|${a}}\n{hr|}\n {aa|${ticketStr}}\n{aa|${money.value}${money.unit}}`;
                var result = `{a|${a}}\n{hr|}\n{aa|板块：${params.data.profession}}\n {aa|涨停次数：${b}}`;
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
            data: resValue,
          },
        ],
      };

      this.onerise = option;
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
      if (!data || !data.data) {
        return {};
      }

      var ztitems = data.data;
      var nameStrs = Object.keys(ztitems);
      var len = nameStrs.length;
      var gsData = {};
      var oneRiseData = [];
      var riseData = [];
      for (var i = 0; i < len; i++) {
        var code = nameStrs[i].substring(nameStrs[i].lastIndexOf('_') + 1);
        var timeline = ztitems[nameStrs[i]].timeline;
        var reason = ztitems[nameStrs[i]].reason;
        var name = decodeURI(ztitems[nameStrs[i]].name.replace(/\\u/gi, '%u'));
        var tlen = timeline.length;
        var isRise = timeline[tlen - 1].color == 'red';
        var isOneRise = timeline.filter(f => f.color == 'red').length == tlen && timeline[0].time == '0930';
        var isTopRise = isOneRise && tlen == 1;
        var day = ztitems[nameStrs[i]].days;
        gsData[name] = { code: code, rise: isRise, one_rise: isOneRise, day: day, profession: reason };
        if (isOneRise) {
          oneRiseData.push({ name: name, value: day, top: isTopRise, code: code, profession: reason });
        }

        if (isRise) {
          riseData.push({ name: name, value: day, code: code, profession: reason });
        }
      }

      var sortOneRise = oneRiseData.sort((a, b) => {
        return b.value - a.value;
      });
      var sortRise = riseData.sort((a, b) => {
        return b.value - a.value;
      });

      this.oneRiseSelect = sortOneRise.map(m => `${m.name}_${m.value}`);
      this.risetSelect = sortRise
        .filter(f => !f.name.includes('ST') && !sortOneRise.find(of => of.name == f.name))
        .map(m => `${m.name}_${m.value}`);
      this.allTicketList = riseData;
      return {
        one_rise: sortOneRise,
        rise: sortRise,
      };
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
          var index = result.yybRank.findIndex(fi => fi[0] === f[0]);
          if (index === -1) {
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
          addDay = dhour < 15 ? -3 : 0;
          break;
        case 6:
          addDay = -1;
          break;
        case 0:
          addDay = -2;
          break;
        default:
          addDay = dhour < 15 ? -1 : 0;
          break;
      }
      d.setDate(d.getDate() + addDay);
      var dy = d.getFullYear();
      var dm = (d.getMonth() + 1 + '').padStart(2, '0');
      var dd = (d.getDate() + '').padStart(2, '0');
      current = `${dy}-${dm}-${dd}`;
      return current;
    },
    clearSelect(value) {
      var codes = this.mySelectOption.find(f => f.groupId == value.key).stockList;
      if (codes.length > 0) {
        ticketApi.userSelectTicket(codes, value.key, 'delete_select').subscribe(() => {});
      }
    },
    addSelect(value) {
      var codes = this.allTicketList
        .filter(f => this.checkedOneRiseList.includes(`${f.name}_${f.value}`) || this.checkedRiseList.includes(`${f.name}_${f.value}`))
        .map(m => m.code);
      if (codes.length > 0) {
        ticketApi.userSelectTicket(codes, value.key, 'add_select').subscribe(() => {});
      }
    },
    initMySelect() {
      ticketApi.my_select().subscribe(res => {
        this.mySelectOption = res.value.data.groupInfoList;
      });
    },
    updateSelect() {
      ticketApi.my_select(true).subscribe(() => {});
    },
  },
};
</script>

<style></style>
