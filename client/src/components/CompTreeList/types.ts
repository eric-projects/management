import { TreeData } from '@/common/defines';

/**
 * 树组件数据刷新类型
 */
export enum TreeRefreshEnum {
  node,
  children,
  tree,
}

export interface TreeRefreshParams {
  type: TreeRefreshEnum;
  title?: string;
}
