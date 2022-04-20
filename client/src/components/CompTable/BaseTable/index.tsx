import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { Observable } from 'rxjs';

import { getComponentFromProp, guidHelper, i18nHelper } from '@/common/utils';
import { FetchDataSourceDto } from '@/common/defines';
import { CompCard } from '@/components';

import { TableColumnDto, TableValueDto, TableValueItemDto } from '../types';
import styles from './component.base-table.module.less';

@Component({ components: { CompCard } })
export class CompBaseTable extends Vue {
  private data: TableValueItemDto[] = [];
  @Prop() columns!: TableColumnDto[];
  @Prop() value!: TableValueDto;
  @Prop() scopedSlots!: any;
  @Prop() title!: string;
  @Prop() rowKey!: string;
  @Prop({ default: 'middle' }) size!: string;
  @Prop({ default: false }) cardStyle!: boolean;
  @Prop({ default: true }) asyncData!: boolean;
  @Prop({ default: true }) showPagination!: boolean;
  isCardStyle!: boolean;
  selectedRowKeys: any = [];
  private test: any;

  private pagination = {
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    size: 'small',
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total: string) => `共 ${total} 条`,
  };

  @Watch('value') onValueChange(value: TableValueDto): void {
    if (!this.asyncData) {
      this.data = this.transferValueItems(value);
    }
  }

  @Emit('load-data')
  onLoadData(data: FetchDataSourceDto<TableValueDto>) {}
  @Emit('select-row')
  onSelectItem(data: any[]) {}

  refreshData(pageIndex?: number) {
    setTimeout(() => {
      this.onLoad(pageIndex);
    });
  }

  public get slotItems(): any {
    if (this.scopedSlots) {
      return [];
    }

    return this.columns.filter(f => f.scopedSlots);
  }

  private onLoad(pageIndex?: number) {
    if (pageIndex) {
      this.pagination.current = pageIndex;
    }

    this.onLoadData({
      params: { _index: this.pagination.current, _size: this.pagination.pageSize },
      callback: (data: TableValueDto | Observable<TableValueDto>) => {
        if (data instanceof Observable) {
          data.subscribe(s => {
            this.data = this.transferValueItems(s);
            this.pagination.total = s.total;
            this.$forceUpdate();
          });
        } else {
          this.data = this.transferValueItems(data);
          this.pagination.total = data.total;
          this.$forceUpdate();
        }
      },
    });
  }

  private onSelectChange(selectedRowKeys: any[], selectedRows: any[]) {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.selectedRowKeys = selectedRowKeys;
    this.onSelectItem(selectedRows);
  }
  created(): void {
    this.isCardStyle = false;
    if (this.asyncData) {
      this.onLoad(undefined);
    } else {
      this.data = this.transferValueItems(this.value);
    }
  }

  private transferValueItems(v: TableValueDto) {
    if (!v || !v.items) {
      return [];
    }

    return v.items;
  }

  render() {
    const titleLeftDom = getComponentFromProp(this, 'title-left');
    const titleRightDom = getComponentFromProp(this, 'title-right');
    return (
      <comp-card class={styles.base_table} bordered={false} defaultStyle={this.cardStyle}>
        {this.title ? <template slot='title'>{this.title}</template> : null}
        {titleLeftDom ? <template slot='title'>{titleLeftDom}</template> : null}
        {titleRightDom ? <template slot='extra'>{titleRightDom}</template> : null}
        <a-table
          rowKey={
            this.rowKey
              ? this.rowKey
              : () => {
                  return guidHelper.generate();
                }
          }
          size={this.size}
          columns={this.columns}
          data-source={this.data}
          pagination={this.showPagination ? this.pagination : false}
          scopedSlots={this.scopedSlots}
          rowSelection={this.rowKey ? { selectedRowKeys: this.selectedRowKeys, onChange: this.onSelectChange } : null}
          on-change={(pagination: any) => {
            this.pagination = pagination;
            this.onLoad();
          }}
        >
          {this.$slots.default}
          {/* {this.slotItems.map((m: any) => {
            return (
              <template slot={m.scopedSlots.customRender}>
                {[1].map(v => {
                  var t11 = this.$scopedSlots[m.scopedSlots.customRender];
                  console.log((t11 as any)());
                  console.log(this);
                  return '';
                })}
                {getComponentFromProp(this, m.scopedSlots.customRender, { text: 1, record: 2, index: 3 })}
              </template>
            );
          })} */}
        </a-table>
      </comp-card>
    );
  }
}
