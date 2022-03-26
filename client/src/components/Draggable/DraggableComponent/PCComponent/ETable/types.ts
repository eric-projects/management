export interface TableColumnDto {
  title: string;
  dataIndex: string;
  width?: string;
  align?: string;
  slots?: any;
  scopedSlots?: any;
}

export interface TableValueItemDto {
  [key: string]: any;
}

export interface TableValueDto {
  items: TableValueItemDto[];
  total: number;
}
