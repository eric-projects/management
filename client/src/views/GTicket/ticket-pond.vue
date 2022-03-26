<template>
  <div>
    <!-- <a-row class="mb-1 pt-1"><a-col> </a-col></a-row> -->
    <comp-table-header @search="loadData">
      <template slot="base"> <a-input placeholder="名称/编号"/></template>
    </comp-table-header>
    <comp-base-table :columns="columns" size="small" @load-data="loadData">
      <template slot="title-left">
        <a-button type="primary" @click="initData('sh000001')">初始上证</a-button
        ><a-button class="ml-1" type="primary" @click="initData('sh000001')">初始深证</a-button
        ><a-button class="ml-1" type="primary" @click="initData('sh000001')">初始创业</a-button></template
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
      data: [],
      columns: [],
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
        },
      ];
    },
    initData(type) {
      ticketApi.initData(type).subscribe(() => {
        console.log(`init ${type} success!`);
      });
    },
    loadData(load) {
      ticketApi.searchData().subscribe(res => {
        console.log('eric', res);
        var data = Object.keys(res).map(m => ({ name: res[m].name, code: m }));
        load.callback({ items: data, total: data.length });
      });
    },
  },
};
</script>

<style></style>
