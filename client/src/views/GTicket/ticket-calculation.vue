<template>
  <div class="pt-2 pl-2">
    <a-row>
      <a-col :span="8"> <a-input placeholder="输入编号"></a-input></a-col>
      <a-col :span="8" :offset="1"> <a-button type="primary">计算</a-button></a-col>
    </a-row>
    <a-divider />
    <a-descriptions :title="name">
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
      <a-descriptions-item label="Address">
        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
      </a-descriptions-item>
    </a-descriptions>
    <a-row>
      最值买入：
    </a-row>
    <a-row>
      <a-col :span="8"> <a-input placeholder="pbx买入"></a-input></a-col>
      <a-col :span="8" :offset="1"> <a-button type="primary">计算</a-button></a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return { name: '***', data: { max: '***', min: '***', start: '***', end: '***' } };
  },
};
</script>

<style></style>
