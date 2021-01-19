import { Observable } from 'rxjs';

import { DynamicObject, ValueLabelPair } from '@/common/defines';

export interface MtColumn {
  title: string;
  dataIndex: string;
  width?: string;
  scopedSlots?: object;
  customRender?: object;
  colSpan?: number;
  children?: MtColumn[];
}

export interface MtTableTrigger {
  value: DynamicObject;
  callback: (children: MtTableModel | Observable<MtTableModel> | any[]) => void;
}

export interface MtTableModel {
  total: number;
  items: any[];
}

export interface ValuePair extends ValueLabelPair {
  data: any;
}
