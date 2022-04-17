<template>
  <div>
    <comp-table-header></comp-table-header>
    <comp-base-table :columns="columns" @load-data="loadData" :scopedSlots="fieldsSlotMap">
      <template slot="title-left">
        <a-button class="ml-1" type="primary" @click="onAdd">创建</a-button
        ><a-button class="ml-1" @click="onImport">导入</a-button></template
      >
      <!-- <template slot="operate">
        <a-button type="link">查看</a-button>
      </template> -->
    </comp-base-table>
    <a-modal width="660px" v-model="visible" title="操作模板" @ok="saveTemplate">
      <comp-form-box ref="formb">
        <a-row>
          <a-col :span="24">
            <a-form-item label="模板名称">
              <a-input
                v-if="edit"
                v-decorator="['name', { rules: [{ required: true, message: '请输入模板名称!' }] }]"
                placeholder="请输入模板名称"
                @change="
                  v => {
                    this.saveData.name = v.target.value;
                  }
                "
              />
              <span v-else>{{ this.saveData.name }}</span></a-form-item
            ></a-col
          >
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="标签">
              <a-tag v-for="(item, i) in tagValue" :key="i" closable @close="closeTag">
                {{ item }}
              </a-tag>
              <a-input
                v-if="edit && tagVisible"
                ref="input"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                v-model="inputValue"
                @blur="handleInputConfirm"
                @keyup.enter="handleInputConfirm"
              />
              <a-tag v-else @click="tagVisible = true" color="#108ee9"> <a-icon type="plus" /> </a-tag> </a-form-item
          ></a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="模板内容">
              <!-- v-decorator="['richData', { rules: [{ required: true, message: '请输入模板内容!' }] }]" -->
              <comp-rich
                :data="saveData.value"
                :height="260"
                @data-change="
                  v => {
                    this.saveData.value = v;
                  }
                "
              >
              </comp-rich></a-form-item
          ></a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="备注"> <a-textarea v-model="saveData.remark" :auto-size="{ minRows: 1, maxRows: 3 }" /> </a-form-item
          ></a-col>
        </a-row>
      </comp-form-box>
    </a-modal>
    <br />
    说明：
    <br />FROM- 镜像从那里来 <br />WORKDIR- 切换当前执行的工作目录 <br />COPY- 拷贝文件或目录到容器中 <br />ENTRYPOINT-
    运行容器时执行的shell命令
  </div>
</template>

<script>
import publishApi from './publish-api';
import { CompTableHeader, CompBaseTable, CompRich } from '@/components';
import CompFormBox from '@/components/CompFormBox/comp-form-box.vue';
export default {
  components: { CompTableHeader, CompBaseTable, CompRich, CompFormBox },
  data() {
    return {
      edit: false,
      columns: [],
      visible: false,
      tagVisible: false,
      inputValue: '',
      tagValue: [],
      fieldsSlotMap: {},
      saveData: { remark: '', name: '', value: '' },
    };
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
        { dataIndex: 'operate', key: 'operate', title: '操作', scopedSlots: { customRender: 'operate' } },
      ];

      this.fieldsSlotMap['operate'] = (cell, row) => {
        return (
          <div>
            <a-button
              type='link'
              on-click={() => {
                this.onLook(row._key);
              }}
            >
              查看
            </a-button>
          </div>
        );
      };
    },
    onAdd() {
      this.edit = true;
      this.visible = true;
    },
    onLook(id) {
      this.edit = false;
      this.loadDetail(id);
      this.visible = true;
    },
    onImport() {},
    closeTag() {},
    saveTemplate() {
      this.$refs.formb.validate().subscribe(() => {
        publishApi.addDockerfileTemplate({ ...this.saveData, tag: this.tagValue.join(';') }).subscribe(() => {
          this.visible = false;
        });
      });
    },
    handleInputConfirm() {
      let tags = this.tagValue;
      if (this.inputValue && tags.indexOf(this.inputValue) === -1) {
        tags = [...tags, this.inputValue];
      }
      Object.assign(this, {
        tagValue: tags,
        tagVisible: false,
        inputValue: '',
      });
    },
    loadData(load) {
      console.log(load);
      // var queryData = { ...load.params };
      load.callback(publishApi.getDockerfileTemplates());
    },
    loadDetail(id) {
      publishApi.getDockerfileTemplate(id).subscribe(res => {
        this.saveData = { ...res, value: res.value.replace(/\n/g, '<br>') };
        this.tagValue = (res.tag || []).split(';');
      });
    },
  },
};
</script>

<style></style>
