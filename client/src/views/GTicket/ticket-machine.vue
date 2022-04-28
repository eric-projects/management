<template>
  <div class="pt-2 pl-2 pr-2">
    <a-row class="mb-1">
      <a-col :span="5">
        单票：
        <a-auto-complete
          style="width:150px"
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
        >涨板块：<a-select
          allowClear
          show-search
          placeholder="选择涨板块"
          style="width: 140px"
          optionFilterProp="children"
          @select="riseBordSelect"
        >
          <a-select-option v-for="(item, i) in riseBoardSource" :key="i" :value="item.ptCode">
            {{ `${item.name}_${item.num}` }}
          </a-select-option>
        </a-select></a-col
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
      <a-col :span="4"
        >市场：<a-select style="width:100px" v-model="marketType" allowClear placeholder="选类型" @select="marketTypeSelect">
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
          {{ zbArry[0] }}
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
          {{ zbArry[1] }}
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
          {{ zbArry[2] }}
        </a-checkbox></a-col
      ><a-col :span="3">
        <a-checkbox
          v-model="enableAmount"
          style="color:blue"
          @change="
            e => {
              this.changeAnalysisCount(e, 30);
            }
          "
        >
          {{ zbArry[3] }}
        </a-checkbox></a-col
      ><a-col :span="3">
        <a-checkbox
          v-model="enableASI"
          style="color:blue"
          @change="
            e => {
              this.changeAnalysisCount(e, 21);
            }
          "
        >
          {{ zbArry[4] }}
        </a-checkbox></a-col
      ><a-col :span="3"> <a-button type="primary" @click="onAnalysis">分析</a-button></a-col></a-row
    >
    <a-divider />
    <a-row class="mb-1">
      <a-col :span="2"><a-switch v-model="enableCache" checked-children="启缓存" un-checked-children="关缓存"/></a-col>
      <a-col :span="6" v-if="1 == 2"> <a-slider v-model="analysisCount" :max="1000" :tooltip-visible="true"/></a-col>
      <a-col :span="2"
        ><a-switch v-model="enableAllMax" checked-children="启高指标" un-checked-children="关高指标" @change="onAllMaxChange"
      /></a-col>
      <a-col :span="2"
        ><a-switch v-model="enableASIMax" checked-children="启高ASI" un-checked-children="关高ASI" @change="onASIMaxChange"
      /></a-col>
      <a-col :span="6">
        <a-dropdown class="ml-2">
          <a-menu slot="overlay" @click="clearSelect">
            <a-menu-item v-for="item in mySelectOption" :key="item.groupId">
              {{ item.groupName + '_' + item.stockList.length }}
            </a-menu-item>
          </a-menu>
          <a-button> 清空自选 <a-icon type="down" /> </a-button>
        </a-dropdown>
        <a-dropdown>
          <a-menu slot="overlay" @click="addSelect">
            <a-menu-item v-for="item in mySelectOption" :key="item.groupId">
              {{ item.groupName + '_' + item.stockList.length }}
            </a-menu-item>
          </a-menu>
          <a-button type="primary"> 加入自选 <a-icon type="down" /> </a-button> </a-dropdown
      ></a-col>
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
      <k-chart ref="kChart" :code="kCode" :width="800" :zbs="['AMO', 'RSI', 'KD', 'ASI']"></k-chart>
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
      marketType: undefined,
      dataSource: [],
      search$: new Subject(),
      riseBoardSource: [],
      hyBoardSource: [],
      gnBoardSource: [],
      resultData: [],
      visibleK: false,
      analysisData: {},
      analysisCount: 30,
      enableCache: true,
      enableOX: false,
      enable4Line: false,
      enablePBX: false,
      enableASI: false,
      enableAmount: false,
      enableAllMax: false,
      enableASIMax: false,
      mySelectOption: [],
      zbArry: ['牛头线', '4日线', 'PBX线', '成交额', 'ASI金叉'],
    };
  },
  created() {
    this.getRiseBoard();
    this.getHangYeBoard();
    this.getGaiNianBoard();
    this.initMySelect(undefined);
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
    initMySelect(fun) {
      ticketApi.my_select().subscribe(res => {
        this.mySelectOption = res.value.data.groupInfoList;
        if (fun) {
          fun();
        }
      });
    },
    getRiseBoard() {
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
    riseBordSelect(value) {
      console.log('riseBordSelect', value);
      this.riseCode = value;
      ticketApi.riseBoardCodes(value).subscribe(res => {
        console.log(res.value);
        this.resultData = res.value;
        this.getKData();
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
    marketTypeSelect(value) {
      var queryData = { type: value, _index: -1 };
      ticketApi.searchData(queryData).subscribe(res => {
        this.resultData = res.items.map(m => ({ ...m, code: m.type_code + m.code }));
        console.log('eric', this.resultData);
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
            // var len = (res.value || []).length;
            // var lastValue = res.value[len - 1];
            // if (new Date() > new Date(lastValue[0])) {
            // }
            // [{HIGH:,LOW,OPEN,CLOSE}]
            data.HIGH = [];
            data.LOW = [];
            data.OPEN = [];
            data.CLOSE = [];
            data.HLOC = [];
            data.AMOUNT = [];
            data.day = {};
            res.value.forEach((m, i) => {
              data.HIGH.push(+m[3]);
              data.LOW.push(+m[4]);
              data.OPEN.push(+m[1]);
              data.CLOSE.push(+m[2]);
              data.AMOUNT.push(+m[8]);
              data.HLOC.push({ HIGH: +m[3], LOW: +m[4], OPEN: +m[1], CLOSE: +m[2] });
              if (i == res.value.length - 1) {
                data.day = { HIGH: +m[3], LOW: +m[4], OPEN: +m[1], CLOSE: +m[2], AMOUNT: +m[8] };
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
    onAllMaxChange(checked) {
      this.resultData = this.resultData.map(d => {
        if (checked) {
          d.hidden = d.remarks.length != this.zbArry.length || d.remarks.findIndex(f => f.includes('低') || f.includes('中')) != -1;
        } else {
          d.hidden = d.cacheHidden;
        }
        return { ...d };
      });
    },
    onASIMaxChange(checked) {
      this.resultData = this.resultData.map(d => {
        if (checked) {
          d.hidden = d.remarks.findIndex(f => f.includes('ASI金叉') && f.includes('高')) == -1;
        } else {
          d.hidden = d.cacheHidden;
        }
        return { ...d };
      });
    },
    onAnalysis() {
      this.resultData = this.resultData.map(d => {
        d.hidden = false;
        d.remark = '';
        d.remarks = [];
        var remarks = [];
        var data = this.analysisData[d.code];
        if (!data || !data.day) {
          d.hidden = true;
        } else {
          var day = data.day;
          var height = Math.max(day.OPEN, day.CLOSE);
          var low = Math.min(day.OPEN, day.CLOSE);
          var len = data.CLOSE.length - 1;
          if (this.enableASI) {
            var asiData = khelp.ASI(data.HLOC);
            var current = asiData[len];
            if (current && current[0] && current[1] && (current[2] || current[2] == 0)) {
              if (current[2] == 0) {
                // 当天金叉
                remarks.push('ASI金叉高(当天)');
              } else if (current[2] > 0) {
                // 金叉中
                var ljASICount = 1;
                for (let index = len - 1; index > len - 10; index--) {
                  if (asiData[index][2] > 0) {
                    ljASICount++;
                  } else {
                    break;
                  }
                }
                var pre = asiData[len - 1];
                if (pre && pre[1] && pre[2] < current[2]) {
                  remarks.push(`ASI金叉高:${ljASICount}`);
                } else if (pre[1] && pre[2] > current[2]) {
                  remarks.push(`ASI金叉低:${ljASICount}`);
                } else {
                  remarks.push(`ASI金叉中:${ljASICount}`);
                }
              } else {
                // 死叉
                d.hidden = true;
              }
            }
          }

          if (this.enablePBX) {
            var pbxData = khelp.PBX(data.CLOSE);
            if (pbxData[len] < height) {
              // 站上了pbx
              var ljPBXCount = 1;
              for (let index = len - 1; index > len - 10; index--) {
                if (pbxData[index] < Math.max(data.HLOC[index].OPEN, data.HLOC[index].CLOSE)) {
                  ljPBXCount++;
                } else {
                  break;
                }
              }
              if (pbxData[len] < low) {
                // 高高在上
                remarks.push(`PBX线高:${ljPBXCount}`);
              } else {
                remarks.push(`PBX线中:${ljPBXCount}`);
              }
            } else {
              d.hidden = true;
            }
          }

          if (this.enableOX) {
            var day144Data = khelp.MA(data.CLOSE, 144);
            var day233Data = khelp.MA(data.CLOSE, 233);
            if (day144Data[len] && day233Data[len] && day144Data[len] < height && day233Data[len] < height) {
              // 站上了牛头分界线
              var ljOXCount = 1;
              for (let index = len - 1; index > len - 10; index--) {
                var minLow = Math.min(data.HLOC[index].OPEN, data.HLOC[index].CLOSE);
                if (day144Data[index] < minLow || day233Data[index] < minLow) {
                  ljOXCount++;
                } else {
                  break;
                }
              }
              if (day144Data[len] < low && day233Data[len] < low) {
                // 高高在上
                remarks.push(`牛头线高:${ljOXCount}`);
              } else {
                remarks.push(`牛头线中:${ljOXCount}`);
              }
            } else {
              d.hidden = true;
            }
          }

          if (this.enable4Line) {
            var day4Data = khelp.MA(data.CLOSE, 4);
            if (day4Data[len] && day4Data[len] < height) {
              // 站上了4日线
              var lj4DayCount = 1;
              for (let index = len - 1; index > len - 10; index--) {
                if (day4Data[index] < Math.max(data.HLOC[index].OPEN, data.HLOC[index].CLOSE)) {
                  lj4DayCount++;
                } else {
                  break;
                }
              }
              if (day4Data[len] < low) {
                // 高高在上
                remarks.push(`4日线高:${lj4DayCount}`);
              } else {
                remarks.push(`4日线中:${lj4DayCount}`);
              }
            } else {
              d.hidden = true;
            }
          }

          if (this.enableAmount) {
            var amountData = khelp.AMO(data.AMOUNT);
            var amountCount = 0;
            if (amountData[len]) {
              if (amountData[len][0] < day.AMOUNT) {
                amountCount++;
              }

              if (amountData[len][1] < day.AMOUNT) {
                amountCount++;
              }

              if (amountData[len][2] < day.AMOUNT) {
                amountCount++;
              }
            }
            if (amountCount > 0) {
              // 站上成交金线
              var ljAmountCount = 1;
              for (let index = len - 1; index > len - 10; index--) {
                if (amountData[index][0] < day.AMOUNT || amountData[index][1] < day.AMOUNT || amountData[index][2] < day.AMOUNT) {
                  ljAmountCount++;
                } else {
                  break;
                }
              }
              if (amountCount == 3) {
                // 高
                remarks.push(`成交额高:${ljAmountCount}`);
              } else if (amountCount == 2) {
                remarks.push(`成交额中:${ljAmountCount}`);
              } else {
                remarks.push(`成交额低:${ljAmountCount}`);
              }
            } else {
              d.hidden = true;
            }
          }

          d.remarks = remarks;
          d.cacheHidden = d.hidden;
        }
        return d;
      });
    },
    colorlogic(tag) {
      var result = '';
      if (tag.includes('ASI')) {
        result = '#108ee9';
      }

      if (tag.includes('PBX')) {
        result = '#87d068';
      }

      if (tag.includes('牛头')) {
        result = '#2db7f5';
      }

      if (tag.includes('4日')) {
        result = 'blue';
      }

      if (tag.includes('高')) {
        result = 'red';
      }

      if (tag.includes('低')) {
        result = 'gray';
      }

      return result;
    },
    clearSelect(value, fun) {
      this.initMySelect(() => {
        var codes = this.mySelectOption.find(f => f.groupId == value.key).stockList;
        if (codes.length > 0) {
          ticketApi.userSelectTicket(codes, value.key, 'delete_select').subscribe(() => {});
        }
      });
    },
    addSelect(value) {
      var codes = this.resultData.filter(f => !f.hidden).map(f => f.code);
      if (codes.length > 0) {
        ticketApi.userSelectTicket(codes, value.key, 'add_select').subscribe(() => {});
      }
    },
  },
};
</script>

<style></style>
