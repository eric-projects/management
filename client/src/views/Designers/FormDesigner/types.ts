import { ValueLabelPair } from '@/common/defines';
import { FormComponent } from '../components/DynamicFormComponent/form-component.type';

interface FormTemplateBase {
  formDesignId?: string;
  name: string;
  code: string;
  businessTypeId: string;
  businessObjectCode: string;
}

export interface FormTemplateDto extends FormTemplateBase {
  controls: FormComponent[];
  extensionData: FormTemplateExtension;
}

export interface FormTemplateExtension {
  baseInfo: boolean;
  relation: boolean;
  attachment: boolean;
  record: boolean;
  groups: Array<{
    id: string;
    title: string;
  }>;
}

export interface FormTemplate extends FormTemplateBase {
  groups: Array<{
    id: string;
    title: string;
    controls: FormComponent[];
  }>;
}

export interface BusinessTypeDto extends ValueLabelPair {
  domain: string;
  children: BusinessTypeDto[];
}

export interface BusinessTypeTreeSelectDto {
  id: string;
  value: string;
  title: string;
  pId?: string;
  selectable?: boolean;
  isLeaf?: boolean;
}
