<template>
  <div class="pt-2 pl-1 pr-1">
    <a-row type="flex" justify="end">
      <a-switch v-model="detail" checked-children="详" un-checked-children="关" />
      <a-button type="link" @click="initData">刷新</a-button></a-row
    >
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta :description="detail ? item.content : ''">
          <a-row slot="title" type="flex" justify="space-between">
            <a-col flex="auto">
              <a target="_blank" :href="item.url"
                ><h3>{{ item.title }}</h3>
              </a></a-col
            >
            <a-col flex="100px" style="color:blue">{{ transferDate(item.ctime) }}</a-col>
          </a-row>

          <!-- <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> -->
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import ticketApi from './ticket-api';
import { dateHelper } from '@/common/utils';
export default {
  data() {
    return {
      data: [],
      detail: false,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      ticketApi.ticketNews(1).subscribe(res => {
        this.data = res.value;
      });
    },
    transferDate(time) {
      return dateHelper.dateString(dateHelper.timestampToDate(time), 'MM月DD日 HH:mm');
    },
  },
};
</script>

<style></style>
