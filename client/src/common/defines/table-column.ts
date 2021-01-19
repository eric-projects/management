/**
 * 表格的列
 */
export interface TableColmun {
  /**
   * 键
   */
  dataIndex?: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 宽度
   */
  width?: number | string;
  /**
   * 固定
   */
  fixed?: 'left' | 'right' | boolean;
  /**
   * 富信息
   */
  extraFields?: TableColmun[];
  /**
   * 排序
   */
  sorter?: boolean;
  /**
   * 渲染函数
   */
  customRender?: (text: any, record: any, index: number) => void;

  /**
   * 自定义列标识
   */
  scopedSlots?: any;

  /**
   * 是否支持省略号
   */
  ellipsis?: boolean;
}
