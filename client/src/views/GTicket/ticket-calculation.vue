<template>
  <div class="pt-2 pl-2">
    <a-row>
      <a-col :span="8">
        <a-auto-complete allowClear placeholder="输入编号" @search="onCodeSearch" @select="onCodeSelect" @change="onCodeChange">
          <template slot="dataSource">
            <a-select-option v-for="item in dataSource" :key="item.code">{{ `${item.name}（${item.code}）` }} </a-select-option>
          </template></a-auto-complete
        ></a-col
      >
      <a-col :span="6" :offset="1">
        <a-date-picker
          :allowClear="false"
          :defaultValue="date"
          format="YYYY-MM-DD"
          :disabled-date="
            current => {
              var valueD = new Date(current);
              var valueDStr = `${valueD.getFullYear()}-${valueD.getMonth() + 1}-${valueD.getDate()}`;
              return new Date(valueDStr) > new Date(this.currentDate);
            }
          "
          @change="
            (m, s) => {
              this.date = s;
            }
          "
      /></a-col>
      <a-col :span="4" :offset="1"> <a-button type="primary" @click="onCalc">计算</a-button></a-col>
    </a-row>
    <a-divider />
    <a-descriptions :column="4">
      <template slot="title"
        ><a-row
          ><a-col :span="3"
            >{{ `${data.name}` }}
            <h6>{{ this.date }}</h6></a-col
          >
          <a-col :span="20"
            ><h4 style="float:right">
              明日买入： 最值(阳)：<strong style="color:red">{{ mPrice1 }} <a-icon v-if="mPrice1Check" type="check"/></strong> &nbsp;
              &nbsp;最值(阴):<strong style="color:red">{{ mPrice2 }} <a-icon v-if="mPrice2Check" type="check"/></strong></h4
          ></a-col> </a-row
      ></template>
      <a-descriptions-item label="最高价">
        {{ data.max }}
      </a-descriptions-item>
      <a-descriptions-item label="最低价">
        {{ data.min }}
      </a-descriptions-item>
      <a-descriptions-item label="开盘">
        {{ data.start }}
      </a-descriptions-item>
      <a-descriptions-item label="收盘">
        {{ data.end }}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider>{{ preDate }}</a-divider>
    <a-descriptions :column="4">
      <a-descriptions-item label="最高价">
        {{ preObj.max }}
      </a-descriptions-item>
      <a-descriptions-item label="最低价">
        {{ preObj.min }}
      </a-descriptions-item>
      <a-descriptions-item label="开盘">
        {{ preObj.start }}
      </a-descriptions-item>
      <a-descriptions-item label="收盘">
        {{ preObj.end }}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import ticketApi from './ticket-api';
import { dateHelper } from '@/common/utils';
export default {
  data() {
    return {
      search$: new Subject(),
      currentDate: '',
      preDate: '',
      date: '',
      code: '',
      data: { name: '***', max: '***', min: '***', start: '***', end: '***' },
      preObj: { preMax: '***', preMin: '***', preStart: '***', preEnd: '***' },
      mPrice1: '***',
      mPrice2: '***',
      mPrice1Check: false,
      mPrice2Check: false,
      dataSource: [],
      selectItem: {},
    };
  },
  created() {
    this.currentDate = this.initDate();
    this.date = this.currentDate;
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
    initDate() {
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
      }
    },
    onCalc() {
      this.mPrice1Check = false;
      this.mPrice2Check = false;
      if (this.code) {
        ticketApi.txTicketDetail(this.code, dateHelper.diffDay(this.date, this.currentDate)).subscribe(res => {
          var currentIndex = res.value.findIndex(f => f[0] == this.date);
          var maxLen = res.value.length;
          // console.log(res.value, this.date);
          if (currentIndex != -1) {
            var current = res.value[currentIndex];
            // sz600196
            this.data.max = current[3];
            this.data.min = current[4];
            this.data.start = current[1];
            this.data.end = current[2];
            this.data.name = this.selectItem.name;
            this.mPrice1 = (Number(this.data.min) + Number((this.data.max - this.data.min) / 2)).toFixed(2);

            var preV = res.value[currentIndex - 1];
            this.preDate = preV[0];
            this.preObj.max = preV[3];
            this.preObj.min = preV[4];
            this.preObj.start = preV[1];
            this.preObj.end = preV[2];
            this.mPrice2 = (Number(this.preObj.min) + Number((this.data.max - this.preObj.min) / 2)).toFixed(2);

            if (currentIndex + 1 <= maxLen) {
              var next = res.value[currentIndex + 1];
              var nexMax = Number(next[3]);
              var nexMin = Number(next[4]);
              if (this.mPrice1 >= nexMin && this.mPrice1 <= nexMax) {
                this.mPrice1Check = true;
              }

              if (this.mPrice2 >= nexMin && this.mPrice2 <= nexMax) {
                this.mPrice2Check = true;
              }
            }
          }
          // console.log(current);
        });
      }
    },
  },
};
</script>

<style></style>
