import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

import { ValueLabelPair } from '@/common/defines';
import { organizationUserService } from '../service';
import { TreeItem } from '../types';

@Component
export class UserTree extends Vue {
  @Prop() value!: ValueLabelPair[] | ValueLabelPair | undefined | null;
  @Prop({ default: true }) multiple!: boolean;
  @Prop() placeholder!: string;

  private parentId = '';
  private departmentTreeData: TreeItem[] = [];

  @Emit('change')
  idEmit(value: TreeItem[] | TreeItem) {}

  created(): void {
    organizationUserService.getDepartmentTree().subscribe((data: TreeItem[]) => {
      this.departmentTreeData = data.map(m => ({ ...m, selectable: false }));
    });
  }

  private onChange(value: TreeItem[] | TreeItem): void {
    this.idEmit(value);
  }

  private onLoadDepartmentTreeData(treeNode: any) {
    const { id, value } = treeNode.dataRef;
    this.parentId = value;
    return new Promise(resolve => {
      if (treeNode.dataRef.children) {
        resolve();
        return;
      }
      organizationUserService.getDepartmentTree(id, value).subscribe((data: TreeItem[]) => {
        if ((!data || data.length === 0) && this.parentId.startsWith('department')) {
          const params = this.parentId.split('_');
          organizationUserService.getUsersByDepartment(params[1]).subscribe((userData: ValueLabelPair[]) => {
            treeNode.dataRef.children = userData.map(m => ({ ...m, isLeaf: true, selectable: true }));
            this.departmentTreeData = [...this.departmentTreeData];
            resolve();
          });
        } else {
          treeNode.dataRef.children = data.map(m => ({ ...m, selectable: false }));
          if (value.startsWith('department')) {
            const depParams = value.split('_');
            organizationUserService.getUsersByDepartment(depParams[1]).subscribe((userData: ValueLabelPair[]) => {
              treeNode.dataRef.children = [...treeNode.dataRef.children, ...userData.map(m => ({ ...m, isLeaf: true, selectable: true }))];
              this.departmentTreeData = [...this.departmentTreeData];
              console.log(treeNode.dataRef.children);
              resolve();
            });
          } else {
            this.departmentTreeData = [...this.departmentTreeData];
            resolve();
          }
        }
      });
    });
  }

  render(): JSX.Element {
    return (
      <a-tree
        showIcon
        treeData={this.departmentTreeData}
        loadData={this.onLoadDepartmentTreeData}
        on-select={(selectedKeys: string[], e: { selected: boolean; selectedNodes: any[]; node: any }) => {
          this.onChange(e.node ? e.node.dataRef : {});
        }}
        allowClear={true}
        scopedSlots={{
          icon: (value: any) => {
            return <a-icon type={value.isLeaf ? 'user' : 'cluster'} />;
          },
        }}
      />
    );
  }
}
