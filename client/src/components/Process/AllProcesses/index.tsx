import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';

import styles from './component.all-processes.module.less';
import { ProcessGroup } from '../ProcessGroup';
import { ProcessTreeData } from './types';
import { allProcessService } from './service';
import { ProcessGroupDto } from '../ProcessGroup/types';

@Component({
  components: { ProcessGroup },
})
export class AllProcesses extends Vue {
  @Prop({ default: () => [] }) data!: ProcessTreeData[];

  private expandedKeys: string[] = [];
  private selectedKeys: string[] = [];
  private selectedData: ProcessGroupDto[] = [];

  @Watch('data')
  private watchData() {
    // 父组件搜索时时，重新处理数据，并打开根节点
    this.expandedKeys = (this.data || []).length > 0 ? [this.data[0].key] : [];
    this.selectedKeys = [...this.expandedKeys];
    this.getSelectedData();
  }

  @Emit('favorite-enable')
  private onFavoriteEnable() {}

  @Emit('favorite-disable')
  private onFavoriteDsiable() {}

  private onSelect(selectedKeys: string[], e: { selected: boolean }) {
    if (e.selected) {
      this.selectedKeys = selectedKeys;
      this.getSelectedData();
    }
  }

  private onExpand(expandedKeys: string[]) {
    this.expandedKeys = expandedKeys;
  }

  private getSelectedData() {
    if (this.expandedKeys.length === 0) {
      this.selectedData = [];
      return;
    }

    const currentData = allProcessService.findItem(this.data, this.selectedKeys[0]);
    this.selectedData = [
      {
        groupName: currentData.title,
        level: 0,
        processes: currentData.processes || [],
      },
      ...currentData.children.map(item => ({
        groupName: item.title,
        level: 1,
        processes: allProcessService.flattenProcesses(item),
      })),
    ];
  }

  render() {
    return (
      <a-layout class={styles.container}>
        <a-layout-sider class={styles.tree}>
          <a-tree
            showLine
            tree-data={this.data}
            expandedKeys={this.expandedKeys}
            selectedKeys={this.selectedKeys}
            on-select={this.onSelect}
            on-expand={this.onExpand}
          />
        </a-layout-sider>
        <a-layout-content class={styles.processes}>
          <process-group data={this.selectedData} on-favorite-enable={this.onFavoriteEnable} on-favorite-disable={this.onFavoriteDsiable} />
        </a-layout-content>
      </a-layout>
    );
  }
}
