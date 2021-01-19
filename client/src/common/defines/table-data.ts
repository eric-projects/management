import { DynamicObject } from './dynamic-object';

/**
 * 表格的列
 */
export interface TableData {
  /**
   * 总条数
   */
  total: number;
  /**
   * 数据
   */
  items: DynamicObject[];
}
