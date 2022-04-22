<template>
  <div class="pt-2 pl-2 pr-2">
    <a-row class="mb-1">
      <a-col :span="6">
        单票：
        <a-auto-complete allowClear placeholder="输入编号" @search="onCodeSearch" @select="onCodeSelect" @change="onCodeChange">
          <template slot="dataSource">
            <a-select-option v-for="item in dataSource" :key="item.code">{{ `${item.name}（${item.code}）` }} </a-select-option>
          </template></a-auto-complete
        ></a-col
      >
      <a-col :span="6"
        >涨板块：<a-select
          allowClear
          show-search
          placeholder="选择涨板块"
          style="width: 160px"
          @change="riseBordChange"
          @select="riseBordSelect"
        >
          <a-select-option v-for="(item, i) in riseBoardSource" :key="i" :value="item.ptCode">
            {{ `${item.name}(${item.num})` }}
          </a-select-option>
        </a-select></a-col
      >
      <a-col :span="6">板块/概念：</a-col>
    </a-row>
    <a-row class="mt-2"
      ><a-col :span="3">
        <a-checkbox
          v-model="enableOX"
          style="color:blue"
          @change="
            e => {
              this.changeAnalysisCount(e, 300);
            }
          "
        >
          牛头分界线
        </a-checkbox></a-col
      ><a-col :span="3">
        <a-checkbox
          v-model="enable4Line"
          style="color:blue"
          @change="
            e => {
              this.changeAnalysisCount(e, 300);
            }
          "
        >
          4日线
        </a-checkbox></a-col
      ><a-col :span="3">
        <a-checkbox
          v-model="enablePBX"
          style="color:blue"
          @change="
            e => {
              this.changeAnalysisCount(e, 10);
            }
          "
        >
          PBX日线
        </a-checkbox></a-col
      ><a-col :span="3">
        <a-checkbox
          v-model="enableASI"
          style="color:blue"
          @change="
            e => {
              this.changeAnalysisCount(e, 30);
            }
          "
        >
          ASI金叉
        </a-checkbox></a-col
      ><a-col :span="3"> <a-button type="primary" @click="onAnalysis">分析</a-button></a-col></a-row
    >
    <a-divider />
    <a-row>
      <a-col :span="2"><a-switch v-model="enableCache" checked-children="启缓存" un-checked-children="关缓存"/></a-col>
      <a-col :span="6"> <a-slider v-model="analysisCount" :max="1000" :tooltip-visible="true"/></a-col>
    </a-row>

    <a-list bordered :data-source="resultData">
      <a-list-item slot="renderItem" slot-scope="item" v-if="!item.hidden">
        {{ `${item.name}(${item.code})` }}
        <a-tag v-for="(remark, ri) in item.remarks" :key="ri" :color="colorlogic(remark)">{{ remark }}</a-tag>
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
      <k-chart ref="kChart" :code="kCode" :width="800" :zbs="['RSI', 'KD', 'ASI']"></k-chart>
    </a-modal>
  </div>
</template>

<script>
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import KChart from '@/components/CompTicketChart/KChart.vue';
import ticketApi from './ticket-api';
import khelp from '@/components/CompTicketChart/calculate';
export default {
  components: { KChart },
  data() {
    return {
      code: '',
      riseCode: '',
      kCode: '',
      dataSource: [],
      search$: new Subject(),
      riseBoardSource: [],
      resultData: [],
      visibleK: false,
      analysisData: {},
      analysisCount: 30,
      enableCache: true,
      enableOX: false,
      enable4Line: false,
      enablePBX: false,
      enableASI: false,
    };
  },
  created() {
    this.getRiseBord();
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
    getRiseBord() {
      var currentHours = new Date().getHours();
      var cacheRiseBoard = localStorage.getItem('riseboard');
      if ((currentHours > 14 || currentHours < 9) && cacheRiseBoard) {
        this.riseBoardSource = JSON.parse(cacheRiseBoard);
        return;
      }

      ticketApi.riseBoard().subscribe(res => {
        console.log('riseboard', res.value);
        this.riseBoardSource = res.value;
        localStorage.setItem('riseboard', JSON.stringify(res.value));
      });
    },
    riseBordChange(value) {
      console.log(`riseBordChange ${value}`);
    },
    riseBordSelect(value) {
      console.log('riseBordSelect', value);
      this.riseCode = value;
      ticketApi.riseBoardCodes(value).subscribe(res => {
        console.log(res.value);
        this.resultData = res.value;
        this.getKData();
      });
    },
    onCodeSearch(e) {
      this.code = e;
      this.search$.next();
    },
    onCodeChange(e) {
      this.code = e;
    },
    onCodeSelect(e) {
      this.selectItem = this.dataSource.find(f => f.code == e);
      if (this.selectItem) {
        let tv = 'sh';
        switch (this.selectItem.type) {
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
        this.resultData = [{ code: tv + e, name: this.selectItem.name }];
        this.getKData();
      }
    },
    onKCodeClick(code) {
      var ct = code.match(/^[a-z|A-Z]+/gi);
      this.kCode = `${code.replace(ct, '')}.${ct}`;
      console.log(code, ct, this.kCode);
      this.visibleK = true;
    },
    getKData() {
      this.resultData.forEach(d => {
        if (!this.analysisData[d.code] || !this.enableCache) {
          var data = {};
          ticketApi.txTicketDetail(d.code, 300).subscribe(res => {
            data.days = res.value;
            // [{HIGH:,LOW,OPEN,CLOSE}]
            data.HIGH = [];
            data.LOW = [];
            data.OPEN = [];
            data.CLOSE = [];
            data.HLOC = [];
            data.day = {};
            res.value.forEach((m, i) => {
              data.HIGH.push(+m[3]);
              data.LOW.push(+m[4]);
              data.OPEN.push(+m[1]);
              data.CLOSE.push(+m[2]);
              data.HLOC.push({ HIGH: +m[3], LOW: +m[4], OPEN: +m[1], CLOSE: +m[2] });
              if (i == res.value.length - 1) {
                data.day = { HIGH: +m[3], LOW: +m[4], OPEN: +m[1], CLOSE: +m[2] };
              }
            });
            this.analysisData[d.code] = data;
            console.log(this.analysisData[d.code]);
          });
        }
      });
    },
    changeAnalysisCount(e, count) {
      if (e.target.checked) {
        this.analysisCount = this.analysisCount > count ? this.analysisCount : count;
      } else {
        this.analysisCount = 30;
      }
    },
    onAnalysis() {
      this.resultData = this.resultData.map(d => {
        debugger;
        d.hidden = false;
        d.remark = '';
        var remarks = [];
        var data = this.analysisData[d.code];
        var day = data.day;
        var height = day.HIGH;
        var low = day.LOW;
        if (this.enableASI) {
          var asiData = khelp.ASI(data.HLOC);
          var asiFlag = true;
          var asiIndex = asiData.length - 1;
          while (asiFlag) {
            var current = asiData[asiIndex];
            if (current[0] && current[1] && (current[2] || current[2] == 0)) {
              if (current[2] == 0) {
                // 当天金叉
                asiFlag = false;
                remarks.push('ASI当天金叉');
              } else if (current[2] > 0) {
                // 金叉中
                remarks.push('ASI金叉中');
                asiFlag = false;
                asiIndex--;
              } else {
                // 死叉
                asiFlag = false;
                d.hidden = true;
              }
            } else {
              asiFlag = false;
            }
          }
        }

        var len = data.CLOSE.length - 1;
        if (this.enablePBX) {
          var pbxData = khelp.PBX(data.CLOSE);
          if (pbxData[len] > low && pbxData[len] < height) {
            // 站上了pbx
            if (pbxData[len] > height) {
              // 高高在上
              remarks.push('PBX高');
            } else {
              remarks.push('PBX中');
            }
          } else {
            d.hidden = true;
          }
        }

        if (this.enableOX) {
          var day144Data = khelp.MA(data.CLOSE, 144);
          var day233Data = khelp.MA(data.CLOSE, 233);
          if (day144Data[len] < height && day144Data[len] > low && day233Data[len] < height && day233Data[len] > low) {
            // 站上了牛头分界线
            if (day144Data[len] < low && day233Data[len] < low) {
              // 高高在上
              remarks.push('牛头高');
            } else {
              remarks.push('牛头中');
            }
          } else {
            d.hidden = true;
          }
        }

        if (this.enable4Line) {
          var day4Data = khelp.MA(data.CLOSE, 4);
          if (day4Data[len] > low && day4Data[len] < height) {
            // 站上了4日线
            if (day4Data[len] > height) {
              // 高高在上
              remarks.push('4日高');
            } else {
              remarks.push('4日中');
            }
          } else {
            d.hidden = true;
          }
        }

        d.remarks = remarks;
        return d;
      });
    },
    colorlogic(tag) {
      if (tag.includes('ASI')) {
        return '#108ee9';
      }

      if (tag.includes('PBX')) {
        return '#87d068';
      }

      if (tag.includes('牛头')) {
        return '#2db7f5';
      }

      if (tag.includes('4日')) {
        return 'pink';
      }

      if (tag.includes('高')) {
        return 'red';
      }
    },
  },
};
</script>

<style></style>
