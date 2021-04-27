import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { Observable } from 'rxjs';

import { TreeData } from '@/common/defines';
import { FetchDataSourceDto } from '@/common/defines';
import { CompCard } from '../CompCard';
import { TreeRefreshEnum, TreeRefreshParams } from './types';

@Component({ components: { CompCard } })
export class CompTreeList extends Vue {
  private _treeData: TreeData[] = [];
  private defaultReplaceField = { children: 'children', title: 'title', key: 'key' };
  @Prop() value!: TreeData[];
  @Prop({ default: true }) asyncData!: boolean;
  @Prop() title!: string;
  @Prop() loading!: boolean;
  @Prop() replaceFields!: any;
  @Prop() scopedSlots!: any;
  private currentSelect!: any;
  private loadedKeys: string[] = [];
  private expandedKeys: string[] = [];

  @Emit('load-data')
  onLoadTreeData(data: FetchDataSourceDto<TreeData[]>) {}

  @Emit('select')
  onSelect(value: TreeData | any, selected: boolean): void {}

  @Watch('value') onValueChange(value: TreeData[]): void {
    if (!this.asyncData) {
      this._treeData = value || [];
    }
  }

  refreshData(params: TreeRefreshParams) {
    if (params.type === TreeRefreshEnum.tree) {
      this.loadedKeys = [];
      this.expandedKeys = [];
    }

    this.loadData(params);
  }

  created(): void {
    if (this.asyncData) {
      this.loadData({ type: TreeRefreshEnum.tree });
    } else {
      this._treeData = this.value || [];
    }
  }

  private loadTreeData(node: any) {
    return new Promise<void>(resolve => {
      if (!this.asyncData || node.children) {
        resolve();
        return;
      }

      this.onLoadTreeData({
        params: this.transferItemField(node),
        callback: (children: TreeData[] | Observable<TreeData[]> | any[]) => {
          if (children instanceof Observable) {
            children.subscribe(s => {
              node.dataRef.children = s || [];
              this._treeData = [...this._treeData];
              this.$forceUpdate();
              resolve();
            });
          } else {
            node.dataRef.children = children || [];
            this._treeData = [...this._treeData];
            this.$forceUpdate();
            resolve();
          }
        },
      });
    });
  }

  private loadData(params: TreeRefreshParams) {
    if (params.type === TreeRefreshEnum.node) {
      this.currentSelect.dataRef.title = params.title;
      this._treeData = [...this._treeData];
      this.$forceUpdate();
    } else {
      const flag = params.type === TreeRefreshEnum.children && this.currentSelect;
      this.onLoadTreeData({
        params: flag ? this.transferItemField(this.currentSelect) : undefined,
        callback: (children: TreeData[] | Observable<TreeData[]>) => {
          if (children instanceof Observable) {
            children.subscribe(s => {
              if (flag) {
                this.currentSelect.dataRef.children = s || [];
                this._treeData = [...this._treeData];
              } else {
                this._treeData = (s || []).map((m: any) => ({ ...m, isLeaf: false }));
              }

              this.$forceUpdate();
            });
          } else {
            if (flag) {
              this.currentSelect.dataRef.children = children || [];
              this._treeData = [...this._treeData];
            } else {
              this._treeData = (children || []).map((m: any) => ({ ...m, isLeaf: false }));
            }

            this.$forceUpdate();
          }
        },
      });
    }
  }

  private transferItemField(node: any) {
    const nodeData = node ? node.dataRef : {};
    if (this.replaceFields && node) {
      Object.keys(this.replaceFields).forEach(key => {
        nodeData[key] = nodeData[this.replaceFields[key]];
      });
    }

    return nodeData;
  }

  render(): JSX.Element {
    return (
      <comp-card title={this.title}>
        <a-tree
          showIcon
          treeData={this._treeData}
          loadData={this.loadTreeData}
          loadedKeys={this.loadedKeys}
          expandedKeys={this.expandedKeys}
          replaceFields={this.replaceFields ? { ...this.defaultReplaceField, ...this.replaceFields } : this.defaultReplaceField}
          on-select={(selectedKeys: string[], e: { selected: boolean; selectedNodes: any[]; node: any }) => {
            this.currentSelect = e.selected ? e.node : undefined;
            this.onSelect(this.transferItemField(e.node), e.selected);
          }}
          on-expand={(expandedKeys: string[]) => {
            console.log(expandedKeys);
            this.expandedKeys = expandedKeys;
          }}
          on-load={(loadedKeys: string[]) => {
            this.loadedKeys = loadedKeys;
          }}
          scopedSlots={this.scopedSlots}
        >
          <a-icon slot='switcherIcon' type='down' />
        </a-tree>
      </comp-card>
    );
  }
}
