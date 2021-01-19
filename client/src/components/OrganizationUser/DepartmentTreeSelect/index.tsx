import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

import styles from './component.department-tree-select.module.less';
import { organizationUserService } from '../service';
import { TreeItem, DepartmentTreeSelectDto } from '../types';

@Component
export class DepartmentTreeSelect extends Vue {
  @Prop({ default: undefined }) value!: string[] | string | DepartmentTreeSelectDto[] | undefined;
  @Prop({ default: true }) multiple!: boolean;
  @Prop({ default: true }) allowClear!: boolean;

  private data: TreeItem[] = [];

  @Emit('change')
  private onChange(value: string[] | string) {}

  @Emit('node-change')
  private onNodeChange(items: DepartmentTreeSelectDto[]) {}

  private onLoad(treeNode: any) {
    const { id, value } = treeNode.dataRef;
    return new Promise(resolve => {
      this.getData(id, value).subscribe((data: TreeItem[]) => {
        this.data = this.data.concat(data);
        resolve();
      });
    });
  }

  private getData(id?: string, value?: string) {
    return organizationUserService.getDepartmentTree(id, value);
  }

  created(): void {
    this.getData().subscribe((data: TreeItem[]) => {
      this.data = data;
    });
  }

  render() {
    return (
      <a-tree-select
        multiple={this.multiple}
        style={'width:100%'}
        placeholder={this.$l.getLocale(['components.select', 'framework.prepositions.space', 'components.department'])}
        value={this.value instanceof Array ? (this.value as DepartmentTreeSelectDto[]).map(m => m.value) : this.value}
        on-change={(value: string | string[], label: any, extra: any) => {
          this.onChange(value);
          this.onNodeChange(extra.triggerNode ? [extra.triggerNode.dataRef.datum] : []);
        }}
        allow-clear={this.allowClear}
        max-tag-count={1}
        dropdown-style={{ 'max-height': '300px' }}
        tree-data-simple-mode
        tree-node-filter-prop='title'
        tree-data={this.data}
        load-data={this.onLoad}
      />
    );
  }
}
