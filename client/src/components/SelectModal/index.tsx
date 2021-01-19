import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { Observable } from 'rxjs';

import styles from './select-modal.module.less';
import { DynamicObject } from '@/common/defines';
import { getComponentFromProp, toCasedStyleObject } from '@/common/utils';
import { MtColumn, MtTableTrigger, MtTableModel, ValuePair } from './select-modal.types';

@Component({})
export class SelectModal extends Vue {
  @Prop({ default: false }) multiple!: boolean;
  @Prop() title!: string;
  @Prop({ default: 'id' }) rowKey!: string;
  @Prop({ default: 'name' }) labelKey!: string;
  @Prop() labelCode!: string;
  @Prop({ default: 800 }) modalWidth!: number;
  @Prop({ default: () => {} }) fieldsSlotMap!: any;
  @Prop({ default: true }) pagination!: boolean;
  @Prop({ default: [] }) columns!: MtColumn[];
  @Prop({ default: null }) value!: ValuePair[] | null;
  @Prop({ default: false }) visible!: boolean;
  @Prop({ default: false }) showSelected!: boolean;
  @Prop({ default: false }) required!: boolean;

  private data: DynamicObject[] = [];
  private modalVisible = this.visible;
  private selectedKeyValue: ValuePair[] = [];
  private paginationValue = {
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    size: 'small',
    showTotal: (total: string) =>
      `${this.$l.getLocale('framework.prepositions.total')} ${total}  ${this.$l.getLocale('framework.prepositions.items')}`,
  };

  get selectedString(): string {
    return this.selectedKeyValue && this.selectedKeyValue.length > 0
      ? this.selectedKeyValue
          .map(m => {
            return m.label + (this.labelCode ? `(${m.data[this.labelCode]})` : '');
          })
          .join('; ')
      : '';
  }

  get selectKeyValue(): ValuePair[] {
    return this.selectedKeyValue;
  }

  @Emit('selected')
  selectedEmit(value: ValuePair[] | null) {}

  @Emit('search')
  searchEmit(param: MtTableTrigger) {}

  @Emit('reset')
  resetEmit() {}

  @Watch('value')
  onValueChange(value: ValuePair[] | null) {
    this.initSelectKey();
  }

  created() {
    this.paginationValue.current = 1;
    this.title = this.title || `${this.$t('components.select')}`;
    this.initSelectKey();
  }

  private initSelectKey() {
    this.selectedKeyValue =
      this.value && this.value.length > 0
        ? this.value.map(m => {
            return { ...m };
          })
        : [];
  }

  private onCustomRow(record: any, index: any) {
    return {
      on: {
        click: () => {
          if (this.multiple) {
            const selectedKVI = this.selectedKeyValue.findIndex(f => f.value === record[this.rowKey]);
            if (selectedKVI !== -1) {
              this.selectedKeyValue.splice(selectedKVI, 1);
            } else {
              this.selectedKeyValue.push({ label: record[this.labelKey], value: record[this.rowKey], data: record });
            }
          } else {
            this.selectedKeyValue = [{ label: record[this.labelKey], value: record[this.rowKey], data: record }];
          }
        },
      },
    };
  }

  private onRowClickChange(record: any) {
    const selectedKVI = this.selectedKeyValue.findIndex(f => f.value === record[this.rowKey]);
    if (selectedKVI === -1) {
      this.selectedKeyValue.push({ label: record[this.labelKey], value: record[this.rowKey], data: record });
    } else {
      this.selectedKeyValue.splice(selectedKVI, 1);
    }
  }

  private onSelectAllChange(selected: any, selectedRows: any, changeRows: any) {
    if (selected) {
      selectedRows.forEach((record: any) => {
        const selectedKVI = this.selectedKeyValue.findIndex(f => f.value === record[this.rowKey]);
        if (selectedKVI === -1) {
          this.selectedKeyValue.push({ label: record[this.labelKey], value: record[this.rowKey], data: record });
        }
      });
    } else {
      changeRows.forEach((record: any) => {
        const selectedKVI = this.selectedKeyValue.findIndex(f => f.value === record[this.rowKey]);
        if (selectedKVI !== -1) {
          this.selectedKeyValue.splice(selectedKVI, 1);
        }
      });
    }
  }

  private onModalOk(): void {
    if (this.selectedKeyValue && this.selectedKeyValue.length > 0) {
      this.selectedEmit([...this.selectedKeyValue]);
      this.modalVisible = false;
    } else if (!this.required) {
      this.modalVisible = false;
    } else {
      this.$notify.error(this.title);
    }
  }

  private onModalCancel(): void {
    this.modalVisible = false;
    this.selectedKeyValue = [];
    if (this.value && this.value.length > 0) {
      this.value.forEach(f => {
        this.selectedKeyValue.push(f);
      });
    }
  }

  private onTableChange(pagination: any, filters: any, sorter: any): void {
    this.paginationValue = pagination;
    this.load();
  }

  private load(): void {
    let params = {};
    if (this.pagination) {
      params = {
        'page-size': this.paginationValue.pageSize,
        'page-index': this.paginationValue.current,
      };
    }

    this.searchEmit({
      value: toCasedStyleObject(params),
      callback: (children: MtTableModel | Observable<MtTableModel> | any[]) => {
        if (children instanceof Observable) {
          children.subscribe(data => {
            this.data = data.items;
            this.paginationValue.total = data.total;
          });
        } else if (children instanceof Array) {
          this.data = children;
          this.paginationValue.total = children.length;
        } else {
          this.data = children.items;
          this.paginationValue.total = children.total;
        }
      },
    });
  }

  onShowModal() {
    if (this.pagination) {
      this.paginationValue.current = 1;
    }
    this.modalVisible = true;
    this.load();
  }

  render(): JSX.Element {
    const conditionDom = getComponentFromProp(this, 'condition');
    const container = getComponentFromProp(this, 'container');
    return (
      <div>
        {container ? (
          container
        ) : (
          <a-input
            ref='input'
            placeholder={this.title}
            value={this.selectedString}
            on-focus={() => {
              (this.$refs.input as any).blur();
              this.onShowModal();
            }}
            on-change={(value: any) => {
              if (!value.target.value) {
                this.value = null;
                this.selectedKeyValue = [];
                this.selectedEmit([]);
              }
            }}
          />
        )}

        <a-modal
          title={this.title}
          width={this.modalWidth}
          visible={this.modalVisible}
          maskClosable={false}
          on-ok={this.onModalOk}
          on-cancel={this.onModalCancel}
        >
          <div class={styles.container}>
            <a-row gutter={8} class={styles.condition + ' mb-1'}>
              {conditionDom || ''}
              {conditionDom ? (
                <a-col offset='1' style='text-align:right' class={styles.action}>
                  <a-button class='mr-1' type='primary' icon='search' on-click={this.load}>
                    {this.$t('components.search')}
                  </a-button>
                  <a-button
                    icon='reload'
                    on-click={() => {
                      this.resetEmit();
                      this.paginationValue.current = 1;
                      this.paginationValue.pageSize = 10;
                      this.load();
                    }}
                  >
                    {this.$t('components.reset')}
                  </a-button>
                </a-col>
              ) : (
                ''
              )}
            </a-row>
            <a-table
              rowKey={this.rowKey}
              class={styles.table}
              columns={this.columns}
              dataSource={this.data}
              scopedSlots={this.fieldsSlotMap}
              pagination={this.pagination ? this.paginationValue : false}
              on-change={this.onTableChange}
              rowSelection={{
                selectedRowKeys: this.selectedKeyValue.map(m => {
                  return m.value;
                }),
                type: this.multiple ? 'checkbox' : 'radio',
                onSelect: this.onRowClickChange,
                onSelectAll: this.onSelectAllChange,
              }}
              customRow={this.onCustomRow}
            />
            {this.multiple && this.showSelected ? (
              <div class={' mt-1'}>
                <a-row>已选择项：</a-row>
                <a-row gutter={8} class={styles.condition + ' mb-1'}>
                  {this.selectedKeyValue.map((m, i) => {
                    return (
                      <a-tag
                        class={' mt-1'}
                        closable
                        on-close={() => {
                          this.selectedKeyValue.splice(i, 1);
                        }}
                      >
                        {m.label}
                        {this.labelCode ? `(${m.data[this.labelCode]})` : ''}
                      </a-tag>
                    );
                  })}
                </a-row>
              </div>
            ) : (
              ''
            )}
          </div>
        </a-modal>
      </div>
    );
  }
}
