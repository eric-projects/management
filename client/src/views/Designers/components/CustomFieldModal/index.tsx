import { Component, Vue, Prop } from 'vue-property-decorator';

import styles from './custom-field-modal.module.less';
import { i18nHelper } from '@/common/utils';
import { CustomField } from './types';

@Component
export class CustomFieldModal extends Vue {
  field: CustomField = { name: '', code: '' };

  render() {
    return (
      <a-form class='mt-3 mr-3'>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.name')} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          <a-input value={this.field.name} on-change={(e: any) => (this.field.name = e.target.value)} />
        </a-form-item>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.code')} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          <a-input value={this.field.code} on-change={(e: any) => (this.field.code = e.target.value)} />
        </a-form-item>
      </a-form>
    );
  }
}
