<template>
  <a-dropdown>
    <a-menu slot="overlay" @click="addSelect">
      <a-menu-item v-for="item in mySelectOption" :key="item.groupId">
        {{ item.groupName + '_' + item.stockList.length }}
      </a-menu-item>
    </a-menu>
    <a-button type="primary"><slot></slot> <a-icon type="down" /> </a-button>
  </a-dropdown>
</template>

<script>
import ticketApi from '../GTicket/ticket-api';
export default {
  name: 'ticket-select-button',
  props: { codes: { type: Array } },
  data() {
    return {
      mySelectOption: [],
    };
  },
  mounted() {
    this.initMySelect();
  },
  methods: {
    addSelect(value) {
      console.log(this.codes);
      if (this.codes && this.codes.length > 0) {
        ticketApi.userSelectTicket(this.codes, value.key, 'add_select').subscribe(() => {});
      }
    },
    initMySelect() {
      ticketApi.my_select().subscribe(res => {
        this.mySelectOption = res.value.data.groupInfoList;
      });
    },
  },
};
</script>
