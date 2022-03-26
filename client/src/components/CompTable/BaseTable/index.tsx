import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { Observable } from 'rxjs';

import { getComponentFromProp, i18nHelper } from '@/common/utils';
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
  @Prop({ default: 'middle' }) size!: string;
  @Prop({ default: false }) cardStyle!: boolean;
  @Prop({ default: true }) asyncData!: boolean;
  @Prop({ default: true }) showPagination!: boolean;
  isCardStyle!: boolean;

  private pagination = {
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    size: 'small',
    showTotal: (total: string) => `共 ${total} 条`,
  };

  @Watch('value') onValueChange(value: TableValueDto): void {
    if (!this.asyncData) {
      this.data = this.transferValueItems(value);
    }
  }

  @Emit('load-data')
  onLoadData(data: FetchDataSourceDto<TableValueDto>) {}

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

  render() {
    const titleLeftDom = getComponentFromProp(this, 'title-left');
    const titleRightDom = getComponentFromProp(this, 'title-right');
    return (
      <comp-card class={styles.base_table} bordered={false} defaultStyle={this.cardStyle}>
        {this.title ? <template slot='title'>{this.title}</template> : null}
        {titleLeftDom ? <template slot='title'>{titleLeftDom}</template> : null}
        {titleRightDom ? <template slot='extra'>{titleRightDom}</template> : null}
        <a-table
          size={this.size}
          columns={this.columns}
          data-source={this.data}
          pagination={this.showPagination ? this.pagination : false}
          scopedSlots={this.scopedSlots}
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
