import { ValueLabelPair } from '@/common/defines';

export enum FormComponentType {
  group = 'group',
  table = 'table',
  input = 'input',
  link = 'link',
  switch = 'switch',
  checkbox = 'checkbox',
  number = 'number',
  autocomplete = 'autocomplete',
  picture = 'picture',
  textarea = 'textarea',
  datetime = 'datetime',
  attchment = 'attchment',
  password = 'password',
  select = 'select',
  cascader = 'cascader',
  radio = 'radio',
  modal = 'modal',
  text = 'text'
}

export interface BusinessObjectFieldOption extends ValueLabelPair {
  type: string;
  defaultValue: any;
  children?: BusinessObjectFieldOption[];
}
