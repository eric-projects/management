import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { FetchDataSourceDto } from '@/common/defines';
import { getComponentFromProp } from '@/common/utils';
import { TableColumnDto, TableValueDto, TableValueItemDto } from '@/components/CompTable/types';
import { Observable } from 'rxjs';
import { ECard } from '../ECard';

@Component({ components: { ECard } })
export class ETable extends Vue {
  pageActions: string[] = [];
  private data: TableValueItemDto[] = [];
  @Prop() columns!: TableColumnDto[];
  @Prop() value!: TableValueDto;
  @Prop() scopedSlots!: any;
  @Prop() title!: string;
  @Prop({ default: false }) cardStyle!: boolean;
  @Prop({ default: true }) asyncData!: boolean;
  @Prop({ default: false }) isRowSelection!: boolean;
  isCardStyle!: boolean;

  private pagination = {
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    size: 'small',
    // showTotal: (total: string) => i18nHelper.getReplaceLocale(`${this.paginationsI18n}.total`, total),
  };

  @Watch('value') onValueChange(value: TableValueDto): void {
    if (!this.asyncData) {
      this.data = this.transferValueItems(value);
    }
  }

  @Emit('load-data')
  onLoadData(data: FetchDataSourceDto<TableValueDto>) {}

  @Emit('row-selection')
  onRowSelection(selectedRowKeys: any, selectedRows: any) {}

  refreshData(pageIndex?: number) {
    setTimeout(() => {
      this.onLoad(pageIndex);
    });
  }

  private onLoad(pageIndex?: number) {
    if (pageIndex) {
      this.pagination.current = pageIndex;
    }

    this.onLoadData({
      params: { 'page-index': this.pagination.current - 1, 'page-size': this.pagination.pageSize },
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

  private get rowSelection() {
    return this.isRowSelection
      ? {
          onChange: (selectedRowKeys: any, selectedRows: any) => {
            this.onRowSelection(selectedRowKeys, selectedRows);
          },
        }
      : null;
  }
  render() {
    const titleLeftDom = getComponentFromProp(this, 'title-left');
    const titleRightDom = getComponentFromProp(this, 'title-right');
    return (
      <comp-card bordered={false} defaultStyle={this.cardStyle}>
        {this.title ? <template slot='title'>{this.title}</template> : null}
        {titleLeftDom ? <template slot='title'>{titleLeftDom}</template> : null}
        {titleRightDom ? <template slot='extra'>{titleRightDom}</template> : null}
        <a-table
          rowKey={(record: any, index: number) => index}
          size='middle'
          columns={this.columns}
          data-source={this.data}
          pagination={this.pagination}
          scopedSlots={this.scopedSlots}
          row-selection={this.rowSelection}
          on-change={(pagination: any) => {
            this.pagination = pagination;
            this.onLoad();
          }}
        >
          {this.$slots.default}
        </a-table>
      </comp-card>
    );
  }
}
