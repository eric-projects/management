<template>
  <div>
    <comp-table-header
      @search="
        () => {
          this.$refs.table.refreshData(1);
        }
      "
      @reset="
        () => {
          this.keyword = '';
          this.searchType = 'm:1+t:2';
          this.$refs.table.refreshData(1);
        }
      "
    >
      <template slot="base">
        <a-row
          ><a-col :span="18"><a-input v-model="keyword" placeholder="名称/编号"/></a-col>
          <a-col :span="4" :offset="1">
            <a-select style="width:100%" v-model="searchType" allowClear placeholder="选类型">
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
          ></a-row
        >
      </template>
    </comp-table-header>
    <comp-base-table
      ref="table"
      rowKey="code"
      :columns="columns"
      size="small"
      :scopedSlots="fieldsSlotMap"
      @load-data="loadData"
      @select-row="onSelectRows"
    >
      <template slot="title-left">
        <a-button @click="initData('m:1+t:2')">初始上证</a-button><a-button class="ml-1" @click="initData('m:0+t:6')">初始深证</a-button
        ><a-button class="ml-1" @click="initData('m:0+t:80')">初始创业</a-button>
        <a-button class="ml-1" @click="initData('m:1+t:23')">初始科创</a-button></template
      >
      <template slot="title-right"> <ticket-select-button :codes="selectCodes">加自选</ticket-select-button></template>
    </comp-base-table>
    <a-modal v-model="visiblePbx" width="800px" title="技术线PBX" :footer="null">
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
import ticketApi from './ticket-api';
import { CompTableHeader, CompBaseTable } from '@/components';
import KChart from '@/components/CompTicketChart/KChart.vue';
import TicketSelectButton from '../ShareComp/ticket-select-button.vue';
export default {
  components: {
    TicketSelectButton,
    CompBaseTable,
    CompTableHeader,
    KChart,
  },
  data() {
    return {
      keyword: '',
      data: [],
      columns: [],
      selectCodes: [],
      fieldsSlotMap: {},
      searchType: 'm:1+t:2',
      visiblePbx: false,
      kCode: '',
    };
  },
  created() {
    this.initColumns();
  },
  methods: {
    initColumns() {
      this.columns = [
        {
          dataIndex: 'name',
          key: 'name',
          title: '名称',
          // slots: { title: 'customTitle' },
          // scopedSlots: { customRender: 'name' },
        },
        {
          title: '编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: { customRender: 'type' },
        },
        {
          title: '操作',
          dataIndex: 'opeate',
          key: 'opeate',
          width: 120,
          scopedSlots: { customRender: 'opeate' },
        },
      ];

      this.fieldsSlotMap['opeate'] = (cell, row) => {
        return (
          <div>
            <a-button
              type='primary'
              on-click={() => {
                this.showPbx(row);
              }}
            >
              PBX
            </a-button>
          </div>
        );
      };
      this.fieldsSlotMap['type'] = (cell, row) => {
        let tv = '上证';
        switch (cell) {
          case 'm:0+t:6':
            tv = '深证';
            break;
          case 'm:0+t:80':
            tv = '创业';
            break;
          case 'm:1+t:23':
            tv = '科创';
            break;
          default:
            break;
        }
        return tv;
      };
    },
    initData(type) {
      ticketApi.initData(type).subscribe(() => {
        console.log(`init ${type} success!`);
      });
    },
    loadData(load) {
      console.log(load);
      var queryData = { ...load.params, _wexpr: '' };
      if (this.keyword) {
        queryData.code = this.keyword;
        queryData._wexpr += `(code like '%${this.keyword}%'|name like '%${this.keyword}%'|zm like '%${this.keyword}%')`;
      }

      if (this.searchType) {
        queryData.type = this.searchType;
        queryData._wexpr += queryData._wexpr ? '&type' : 'type';
      }

      ticketApi.searchData(queryData).subscribe(res => {
        console.log('eric', res);
        load.callback(res);
      });
    },
    onSelectRows(rows) {
      this.selectCodes = rows.map(m => `${m.type_code}${m.code}`);
    },
    showPbx(row) {
      console.log('row', row.type_code + row.code);
      this.kCode = `${row.code}.${row.type_code}`;
      this.visiblePbx = true;
    },
  },
};
</script>

<style></style>
