import { Component, Vue } from 'vue-property-decorator';
import { CompCard, CompRich } from '@/components';
import styles from './rich.module.less';
import { documentService } from '@/services/document';
import { ToolDataModule } from '@/services/common/types';

@Component({ components: { CompCard, CompRich } })
export class RichView extends Vue {
  panes = [
    { key: 1, title: '测试环境', children: [{ key: 1, title: 'New Tab 1' }] },
    { key: 2, title: '生产环境', children: [{ key: 1, title: 'New Tab 1' }] },
  ];
  private activeKey = 1;
  private newKey = 2;
  private editState = -1;

  private childrenActiveKey = 1;
  private childrenNewKey = 1;
  private childrenEditState = -1;
  private richData = '';

  private onAddTab(e: MouseEvent) {
    e.stopPropagation();
    this.editState = -1;
    const panes = this.panes;
    const activeKey = this.newKey + 1;
    panes.push({
      title: `New Tab ${activeKey}`,
      key: activeKey,
      children: [],
    });
    this.activeKey = activeKey;
    this.newKey = activeKey;
    this.panes = panes;
  }

  private onAddChildrenTab(e: MouseEvent, pane: any) {
    e.stopPropagation();
    this.childrenEditState = -1;
    const panes = pane.children;
    const activeKey = this.childrenNewKey + 1;
    panes.push({
      title: `New Tab ${activeKey}`,
      key: activeKey,
    });

    this.childrenActiveKey = activeKey;
    this.childrenNewKey = activeKey;
    pane.children = panes;
  }

  private onTabChange(activeKey: number) {}

  private onTabClick(activeKey: number) {
    if (activeKey !== this.activeKey) {
      // 切换
      this.editState = -1;
    } else {
      // 再次点击
      this.editState = activeKey;
    }
  }

  private onTabChildrenClick(activeKey: number) {
    if (activeKey !== this.childrenActiveKey) {
      // 切换
      this.childrenEditState = -1;
    } else {
      // 再次点击
      this.childrenEditState = activeKey;
    }
  }

  private onSave(envInfo: any, cinfo: any) {
    documentService.uploadStr(ToolDataModule.Projects, `test/test1/app.json`, this.richData).subscribe(() => {
      this.$message.success('保存成功');
    });
  }

  render() {
    return (
      <comp-card class={styles.rich_card}>
        <a-tabs v-model={this.activeKey} hide-add type='card' on-change={this.onTabChange} on-tabClick={this.onTabClick}>
          {this.panes.map(pane => {
            console.log(this.activeKey, this.newKey, pane.key);
            return (
              <a-tab-pane class={styles.tab_pane} key={pane.key}>
                <template slot='tab'>
                  <span>{this.editState === pane.key && pane.key > 2 ? <a-input v-model={pane.title} /> : pane.title}</span>
                  {pane.key === this.newKey ? <a-icon class={styles.tab_add} type='plus' on-click={this.onAddTab} /> : null}
                </template>
                <a-tabs v-model={this.childrenActiveKey} tab-position='left' on-tabClick={this.onTabChildrenClick}>
                  {pane.children.map((chi: any) => {
                    return (
                      <a-tab-pane key={chi.key}>
                        <template slot='tab'>
                          {chi.key === this.childrenNewKey ? (
                            <span class={styles.children_last}>
                              {this.childrenEditState === chi.key ? <a-input v-model={chi.title} /> : chi.title}
                              <a-icon
                                class={styles.tab_children_add}
                                type='plus'
                                on-click={(e: any) => {
                                  this.onAddChildrenTab(e, pane);
                                }}
                              />
                            </span>
                          ) : (
                            <span>{this.childrenEditState === chi.key ? <a-input v-model={chi.title} /> : chi.title}</span>
                          )}
                        </template>
                        <comp-rich
                          on-data-change={(v: string) => {
                            this.richData = v;
                          }}
                        >
                          <a-button
                            type='link'
                            on-click={() => {
                              this.onSave(pane, chi);
                            }}
                          >
                            保存
                          </a-button>
                        </comp-rich>
                      </a-tab-pane>
                    );
                  })}
                </a-tabs>
              </a-tab-pane>
            );
          })}
        </a-tabs>
      </comp-card>
    );
  }
}
