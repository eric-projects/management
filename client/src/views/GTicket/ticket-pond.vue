<template>
  <div>
    <!-- <a-row class="mb-1 pt-1"><a-col> </a-col></a-row> -->
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
    <comp-base-table ref="table" :columns="columns" size="small" :scopedSlots="fieldsSlotMap" @load-data="loadData">
      <template slot="title-left">
        <a-button type="primary" @click="initData('m:1+t:2')">初始上证</a-button
        ><a-button class="ml-1" type="primary" @click="initData('m:0+t:6')">初始深证</a-button
        ><a-button class="ml-1" type="primary" @click="initData('m:0+t:80')">初始创业</a-button>
        <a-button class="ml-1" type="primary" @click="initData('m:1+t:23')">初始科创</a-button></template
      >
    </comp-base-table>
    <!-- <a-table :columns="columns" :data-source="data">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
      <span slot="tags" slot-scope="tags">
        <a-tag v-for="tag in tags" :key="tag" :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a>Invite 一 {{ record.name }}</a>
        <a-divider type="vertical" />
        <a>Delete</a>
        <a-divider type="vertical" />
        <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
      </span>
    </a-table> -->
  </div>
</template>

<script>
import ticketApi from './ticket-api';
import { CompTableHeader, CompBaseTable } from '@/components';
export default {
  components: {
    CompBaseTable,
    CompTableHeader,
  },
  data() {
    return {
      keyword: '',
      data: [],
      columns: [],
      fieldsSlotMap: {},
      searchType: 'm:1+t:2',
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
      ];

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
  },
};
</script>

<style></style>
