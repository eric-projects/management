/**
 * 树结构
 */
export interface TreeData {
  /**
   * 键
   */
  key: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 子集合
   */
  children: TreeData[];
}
