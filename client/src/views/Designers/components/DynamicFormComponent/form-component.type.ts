import { guidHelper } from '@/common/utils';
import { FormComponentDescription } from '../DynamicFormComponentDescription/form-component-description.type';

export class FormComponent extends FormComponentDescription {
  id!: string;
  code!: string;
  colSpan!: number;
  required!: boolean;
  defaultValue!: any;
  dataset!: string;
  tips!: string;
  selected!: boolean;
  minimum?: number;
  maximum?: number;
  field?: string;
  containerId?: string;
  children?: FormComponent[];

  constructor(description: FormComponentDescription) {
    super();
    this.type = description.type;
    this.name = description.name;
    this.id = guidHelper.generate();
    this.colSpan = 1;
    this.defaultValue = null;
    this.required = true;
  }
}
