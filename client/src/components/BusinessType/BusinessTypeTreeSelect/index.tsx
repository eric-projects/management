import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { businessTypeTreeSelectService } from './service';
import { BusinessTypeTreeSelectDto } from './types';

@Component
export class BusinessTypeTreeSelect extends Vue {
  @Prop({ default: undefined }) value!: string[] | string | undefined;
  @Prop({ default: false }) multiple!: boolean;
  @Prop({ default: false }) allowClear!: boolean;
  @Prop({ default: false }) withInAuthority!: boolean; // true=权限内；false=所有
  @Prop({ default: false }) showTop!: boolean; // 是否只展示顶级业务类型

  private data: BusinessTypeTreeSelectDto[] = [];

  @Emit('change')
  private onChange(value: string[] | string) {
    return value;
  }

  created(): void {
    businessTypeTreeSelectService.getBusinessTypes(this.withInAuthority, this.showTop).subscribe(data => {
      this.data = data;
    });
  }

  render() {
    return (
      <a-tree-select
        style={'width:100%'}
        placeholder={this.$l.getLocale(['components.select', 'framework.prepositions.space', 'inbox-columns.business-type'])}
        value={this.value}
        allowClear={this.allowClear}
        multiple={this.multiple}
        tree-data-simple-mode
        tree-data={this.data}
        on-change={(id: string) => {
          this.onChange(id);
        }}
      />
    );
  }
}
