<template>
  <div class="pt-2 pl-2 pr-2">
    <a-row>
      <a-col :span="5">
        单票：
        <a-auto-complete
          style="width:70%"
          allowClear
          placeholder="输入编号"
          @search="onCodeSearch"
          @select="onCodeSelect"
          @change="onCodeChange"
        >
          <template slot="dataSource">
            <a-select-option v-for="item in dataSource" :key="item.code">{{ `${item.name}（${item.code}）` }} </a-select-option>
          </template></a-auto-complete
        ></a-col
      >
      <a-col :span="5"
        >行业：<a-select
          allowClear
          show-search
          placeholder="选择行业"
          style="width: 150px"
          optionFilterProp="children"
          @select="hyOrgnBordSelect"
        >
          <a-select-option v-for="(item, i) in hyBoardSource" :key="i" :value="item.code">
            {{ `${item.name}_${item.code}` }}
          </a-select-option>
        </a-select></a-col
      >
      <a-col :span="5"
        >概念：<a-select
          allowClear
          show-search
          placeholder="选择概念"
          style="width: 150px"
          optionFilterProp="children"
          @select="hyOrgnBordSelect"
        >
          <a-select-option v-for="(item, i) in gnBoardSource" :key="i" :value="item.code">
            {{ `${item.name}_${item.code}` }}
          </a-select-option>
        </a-select></a-col
      >
      <a-col :span="5"
        >市场：<a-select style="width:150px" v-model="marketType" allowClear placeholder="选类型" @select="marketTypeSelect">
          <a-select-option value="m:1+t:2">
            上证
          </a-select-option>
          <a-select-option value="m:0+t:6">
            深证
          </a-select-option>
          <a-select-option value="m:0+t:80">
            创业
          </a-select-option>
          <a-select-option value="m:1+t:23">
            科创
          </a-select-option>
        </a-select></a-col
      >
    </a-row>
    <a-divider />
    <a-list bordered :data-source="resultData">
      <a-list-item slot="renderItem" slot-scope="item" v-if="!item.hidden">
        {{ `${item.name}(${item.code})` }}
        <a-tag v-for="(remark, ri) in item.remarks" :key="ri">{{ remark }}</a-tag>
        <a-button
          type="link"
          @click="
            () => {
              onKCodeClick(item.code);
            }
          "
          >技术线</a-button
        >
      </a-list-item>
    </a-list>
    <a-modal v-model="visibleK" width="800px" title="技术线" :footer="null">
      <a-button
        style="position:absolute;right: 10px;z-index: 100;"
        type="primary"
        @click="
          () => {
            this.$refs.kChart.refreshData(this.kCode);
          }
        "
        >刷新</a-button
      >
      <k-chart ref="kChart" :code="kCode" :width="800" :zbs="['AMO', 'RSI', 'KD', 'ASI']"></k-chart>
    </a-modal>
  </div>
</template>

<script>
import { Subject, zip } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { dateHelper } from '@/common/utils';
import ticketApi from './ticket-api';
import KChart from '@/components/CompTicketChart/KChart.vue';
import khelp from '@/components/CompTicketChart/calculate';
export default {
  components: { KChart },
  data() {
    return {
      code: '',
      kCode: '',
      marketType: undefined,
      visibleK: false,
      search$: new Subject(),
      resultData: [],
      dataSource: [],
      hyBoardSource: [],
      gnBoardSource: [],
    };
  },
  created() {
    this.getHangYeBoard();
    this.getGaiNianBoard();
    this.search$.pipe(debounceTime(400)).subscribe(() => {
      var queryData = { _index: 1 };
      queryData.code = this.code;
      queryData._wexpr = `(code like '%${this.code}%'|name like '%${this.code}%'|zm like '%${this.code}%')`;
      ticketApi.searchData(queryData).subscribe(res => {
        this.dataSource = res.items;
      });
    });
  },
  methods: {
    marketTypeSelect(value) {
      var queryData = { type: value, _index: -1 };
      ticketApi.searchData(queryData).subscribe(res => {
        this.resultData = res.items.map(m => ({ ...m, code: m.type_code + m.code, _code: m.code }));
        console.log('eric', this.resultData);
        this.getKData();
      });
    },
    getHangYeBoard() {
      ticketApi.boardHangYe().subscribe(res => {
        this.hyBoardSource = res.value;
        localStorage.setItem('hyBoard', JSON.stringify(res.value));
      });
    },
    getGaiNianBoard() {
      ticketApi.boardGaiNian().subscribe(res => {
        this.gnBoardSource = res.value;
        localStorage.setItem('boardGaiNian', JSON.stringify(res.value));
      });
    },
    hyOrgnBordSelect(value) {
      console.log('hyBordSelect', value);
      // this.riseCode = value;
      ticketApi.boardTickets(value).subscribe(res => {
        console.log(res.value);
        this.resultData = res.value;
        this.getKData();
      });
    },
    onKCodeClick(code) {
      var ct = code.match(/^[a-z|A-Z]+/gi);
      this.kCode = `${code.replace(ct, '')}.${ct}`;
      console.log(code, ct, this.kCode);
      this.visibleK = true;
    },
    onCodeSearch(e) {
      this.code = e;
      this.search$.next();
    },
    onCodeChange(e) {
      this.code = e;
    },
    onCodeSelect(e) {
      var selectItem = this.dataSource.find(f => f.code == e);
      if (selectItem) {
        let tv = 'sh';
        switch (selectItem.type) {
          case 'm:0+t:6':
            tv = 'sz';
            break;
          case 'm:0+t:80':
            tv = 'sz';
            break;
          default:
            break;
        }
        this.code = tv + e;
        this.resultData = [{ code: tv + e, name: selectItem.name, _code: e }];
        this.getKData();
      }
    },
    getKData() {
      this.resultData.forEach((item, i) => {
        item.remarks = [];
        // setTimeout(() => {
        zip(ticketApi.valueInvesting(item.code, 1), ticketApi.valueInvesting(item.code, 2)).subscribe(data => {
          var [year, quarter] = data;
          if (year.value && year.value.length > 0 && quarter.value && quarter.value.length > 0) {
            var currentYear = year.value[0];
            var yearKCFJCXSYJLRTZ = currentYear.KCFJCXSYJLRTZ || 0; // 扣非净利润同比增长 >20%
            var yearROEJQ = currentYear.ROEJQ || 0; // 年度净资产投资回报率大于15%
            var currentQuarter = quarter.value[0];
            var currentDate = new Date(currentQuarter.REPORT_DATE);
            var yearValue = currentDate.getFullYear();
            currentDate.setFullYear(yearValue - 1);
            var dateYearString = dateHelper.dateString(currentDate);
            var preQuarter = quarter.value.find(f => f.REPORT_DATE.includes(dateYearString));
            var quarterMG = currentQuarter.EPSJB || 0;
            var preQuarterMG = preQuarter.EPSJB || 1;
            var quarterKCFJCXSYJLRTZ = currentQuarter.DPNP_YOY_RATIO || 0; // 扣非净利润同比增长 >15%
            var mgRate = ((quarterMG - preQuarterMG) / preQuarterMG) * 100; // 每股收益同比增长 >15%
            console.log(quarterMG, preQuarterMG, mgRate);
            console.log(yearKCFJCXSYJLRTZ, yearROEJQ, mgRate, quarterKCFJCXSYJLRTZ);
            item.remarks.push(`年_扣非净利润>20%：${yearKCFJCXSYJLRTZ.toFixed(2)}`);
            item.remarks.push(`年_净资产回报>15%：${yearROEJQ.toFixed(2)}`);
            item.remarks.push(`季_扣非净利润>15%：${quarterKCFJCXSYJLRTZ.toFixed(2)}`);
            item.remarks.push(`季_每股收益>15%：${mgRate.toFixed(2)}`);
            this.$set(this.resultData, i, item);

            setTimeout(() => {
              if (yearKCFJCXSYJLRTZ > 20 && yearROEJQ > 15 && mgRate > 15 && quarterKCFJCXSYJLRTZ > 15) {
                item.hidden = false;
              } else {
                item.hidden = true;
              }
              this.$set(this.resultData, i, item);
            }, 1000);
          }
        });
        // }, 500);
      });
    },
  },
};
</script>

<style></style>
