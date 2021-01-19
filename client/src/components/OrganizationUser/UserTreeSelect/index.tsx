import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

import { ValueLabelPair } from '@/common/defines';
import styles from './user-tree-select.modules.less';
import { userSelectService } from './service';

@Component
export class UserTreeSelect extends Vue {
  @Prop() value!: ValueLabelPair[] | ValueLabelPair;
  @Prop({ default: true }) multiple!: boolean;
  @Prop({ default: true }) allowClear!: boolean;
  @Prop({ default: false }) disabled!: boolean;
  @Prop() placeholder!: string;

  private parentId = '';
  private departmentTreeData: ValueLabelPair[] = [];
  private selectedValue: ValueLabelPair[] | ValueLabelPair = [];

  @Emit('change')
  idEmit(value: ValueLabelPair[] | ValueLabelPair) {}

  @Watch('value') onValueChange(value: any, oldValue: any) {
    this.selectedValue = value;
  }

  created(): void {
    userSelectService.getDepartmentTree({}).subscribe((data: ValueLabelPair[]) => {
      this.departmentTreeData = data.map(m => ({ ...m, selectable: false }));
    });

    this.selectedValue = this.value;
  }

  private onChange(value: ValueLabelPair[] | ValueLabelPair): void {
    this.selectedValue = value;
    this.idEmit(value);
  }

  private onLoadDepartmentTreeData(treeNode: any) {
    this.parentId = treeNode.dataRef.value;
    return new Promise(resolve => {
      if (treeNode.dataRef.children) {
        resolve();
        return;
      }
      userSelectService.getDepartmentTree({ 'parent-id': this.parentId }).subscribe((data: ValueLabelPair[]) => {
        if ((!data || data.length === 0) && this.parentId.startsWith('department')) {
          const params = this.parentId.split('_');
          userSelectService.getUsersByDepartment(params[1]).subscribe((userData: ValueLabelPair[]) => {
            treeNode.dataRef.children = userData.map(m => ({ ...m, isLeaf: true, selectable: true }));
            this.departmentTreeData = [...this.departmentTreeData];
            resolve();
          });
        } else {
          treeNode.dataRef.children = data.map(m => ({ ...m, selectable: false }));
          this.departmentTreeData = [...this.departmentTreeData];
          resolve();
        }
      });
    });
  }

  render(): JSX.Element {
    return (
      <a-tree-select
        class={styles.container}
        multiple={this.multiple}
        labelInValue
        style='width: 100%; height: 32px;'
        placeholder={this.placeholder || this.$l.getLocale(['components.select', 'framework.prepositions.space', 'components.user'])}
        treeData={this.departmentTreeData}
        loadData={this.onLoadDepartmentTreeData}
        value={this.selectedValue}
        on-change={this.onChange}
        allowClear={this.allowClear}
        disabled={this.disabled}
        maxTagCount={3}
        showCheckedStrategy={'SHOW_PARENT'}
        dropdownStyle={{ 'max-height': '300px' }}
        treeNodeFilterProp='label'
      />
    );
  }
}
