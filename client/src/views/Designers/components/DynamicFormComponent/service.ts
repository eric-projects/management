import { VNode } from 'vue';
import {
  Input,
  InputNumber,
  AutoComplete,
  Select,
  DatePicker,
  Switch,
  Checkbox,
  Radio,
  Upload,
  Button,
  Form,
  Tooltip,
  Icon
} from 'ant-design-vue';

import { vueContext } from '@/common/defines';
import { i18nHelper } from '@/common/utils';
import { FormComponent } from './form-component.type';

class DynamicFormService {
  generateFormControl(attrs: FormComponent, itemClass: string): VNode {
    let component: VNode;

    switch (attrs.type) {
      case 'text':
        component = vueContext.$createElement('span', attrs.defaultValue);
        break;
      case 'input':
        component = vueContext.$createElement(Input, { props: { value: attrs.defaultValue } });
        break;
      case 'textarea':
        component = vueContext.$createElement(Input.TextArea, { props: { value: attrs.defaultValue } });
        break;
      case 'number':
        component = vueContext.$createElement(InputNumber, { props: { value: attrs.defaultValue } });
        break;
      case 'autocomplete':
        component = vueContext.$createElement(AutoComplete, { props: { value: attrs.defaultValue } });
        break;
      case 'password':
        component = vueContext.$createElement(Input.Password, { props: { value: attrs.defaultValue } });
        break;
      case 'select':
        component = vueContext.$createElement(Select, {
          props: { value: attrs.defaultValue, options: this.getDatasetArray(attrs.dataset) }
        });
        break;
      case 'datetime':
        component = vueContext.$createElement(DatePicker, { props: { value: attrs.defaultValue } });
        break;
      case 'switch':
        component = vueContext.$createElement(Switch, { props: { value: attrs.defaultValue } });
        break;
      case 'checkbox':
        component = vueContext.$createElement(Checkbox.Group, {
          props: { value: attrs.defaultValue, options: this.getDatasetArray(attrs.dataset) }
        });
        break;
      case 'radio':
        component = vueContext.$createElement(Radio.Group, {
          props: { value: attrs.defaultValue, options: this.getDatasetArray(attrs.dataset) }
        });
        break;
      case 'link':
        component = vueContext.$createElement(Button, { props: { type: 'link' } }, i18nHelper.getLocale('designers.components.link'));
        break;
      default:
        component = vueContext.$createElement('div');
        break;
    }

    return component;
  }

  generateFormItem(attrs: FormComponent, itemClass: string): VNode {
    return this.wrapItem(this.generateFormControl(attrs, itemClass), attrs, itemClass);
  }

  getGeneratableKeys() {
    return ['text', 'input', 'textarea', 'number', 'autocomplete', 'password', 'select', 'datetime', 'switch', 'checkbox', 'radio', 'link'];
  }

  private wrapItem(ctrl: VNode, attrs: FormComponent, itemClass: string): VNode {
    return vueContext.$createElement(
      Form.Item,
      {
        class: itemClass,
        props: {
          labelCol: this.getLabelCol(attrs.colSpan),
          wrapperCol: this.getWrapperCol(attrs.colSpan),
          required: attrs.required
        },
        scopedSlots: {
          label: () =>
            vueContext.$createElement('span', [
              attrs.name + (attrs.tips ? ' ' : ''),
              attrs.tips
                ? vueContext.$createElement(Tooltip, { props: { title: attrs.tips } }, [
                    vueContext.$createElement(Icon, { props: { type: 'question-circle-o' } })
                  ])
                : ''
            ])
        }
      },
      [ctrl]
    );
  }

  private getDatasetArray(dataset: string) {
    return (dataset || '').split(/\r?\n/g).map((line: string) => {
      const arr = line.split(/,|;/g);
      return arr.length > 1 ? { label: arr[0], value: arr[1] } : { label: line, value: line };
    });
  }

  private getLabelCol(colSpan: number) {
    return { span: colSpan === 1 ? 4 : 8 };
  }

  private getWrapperCol(colSpan: number) {
    return { span: colSpan === 1 ? 20 : 16 };
  }
}

export const dynamicFormService = new DynamicFormService();
