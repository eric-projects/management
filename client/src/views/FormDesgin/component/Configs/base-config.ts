import { Component, Vue, Prop } from 'vue-property-decorator';
@Component
export class BaseConfig extends Vue {
  @Prop() item!: any; // 控件实例
  @Prop() fieldKey!: string; // 字段绑定对应key
  @Prop() formDetailTable!: boolean; // 是否来自明细表
}
