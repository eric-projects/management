import { ValueLabelPair } from '@/common/defines';

export interface TreeItem {
  id: string;
  pId?: string;
  value: string;
  title: string;
  isLeaf?: boolean;
  /**
   * 自定义扩展数据
   */
  datum?: any;
}

export interface UserItemDto {
  userId?: string;
  userName?: string;
  datum?: any;
}

export interface DepartmentTreeSelectDto extends ValueLabelPair {
  organizationPath: string;
}
