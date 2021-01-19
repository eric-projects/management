import { ValueLabelPair } from '@/common/defines';

export interface BusinessTypeTreeSelectDto {
  id: string;
  value: string;
  title: string;
  pId?: string;
  selectable?: boolean;
  isLeaf?: boolean;
}

export interface BusinessTypeDto extends ValueLabelPair {
  domain: string;
  children: BusinessTypeDto[];
}
