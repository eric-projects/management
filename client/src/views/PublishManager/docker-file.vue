<template>
  <div>
    <comp-table-header>1</comp-table-header>
    <comp-base-table :columns="columns">
      <template slot="title-left">
        <a-button class="ml-1" type="primary" @click="onAdd">创建</a-button
        ><a-button class="ml-1" @click="onImport">导入</a-button></template
      >
    </comp-base-table>
    <br />
    说明：
    <br />FROM- 镜像从那里来 <br />WORKDIR- 切换当前执行的工作目录 <br />COPY- 拷贝文件或目录到容器中 <br />ENTRYPOINT-
    运行容器时执行的shell命令
  </div>
</template>

<script>
import publishApi from './publish-api';
import { CompTableHeader, CompBaseTable } from '@/components';
export default {
  components: { CompTableHeader, CompBaseTable },
  data() {
    return { columns: [] };
  },
  created() {
    this.initColumn();
  },
  methods: {
    initColumn() {
      this.columns = [
        { dataIndex: 'name', key: 'name', title: '模板名称' },
        { dataIndex: 'tag', key: 'tag', title: '标签' },
        { dataIndex: 'remark', key: 'remark', title: '备注' },
      ];
    },
    onAdd() {
      publishApi.addDockerfileTemplate({ name: 'test', tag: 'a;b;c;', remark: '备注' }).subscribe(() => {});
    },
    onImport() {},
  },
};
</script>

<style></style>
