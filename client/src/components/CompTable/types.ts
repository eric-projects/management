export interface TableColumnDto {
  title: string;
  dataIndex: string;
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
