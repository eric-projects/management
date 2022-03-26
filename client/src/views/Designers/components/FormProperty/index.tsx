import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

import styles from './form-property.module.less';
import { i18nHelper } from '@/common/utils';
import { ValueLabelPair } from '@/common/defines';
import { BusinessTypeTreeSelect } from '@/components';
import { formDesignerService } from '../../FormDesigner/service';
import { FormTemplate, BusinessTypeTreeSelectDto } from '../../FormDesigner/types';

@Component({
  components: { BusinessTypeTreeSelect },
})
export class FormProperty extends Vue {
  @Prop() template!: FormTemplate;

  private businessObjectsOptions: ValueLabelPair[] = [];

  @Emit('save')
  onSave(): FormTemplate {
    return this.template;
  }

  @Emit('object-change')
  onObjectChange(code: string) {
    this.template.businessObjectCode = code;
    return code;
  }

  created() {
    this.getBusinessObjects();
  }

  getBusinessObjects() {
    formDesignerService.getBusinessObjects(this.template.businessTypeId).subscribe(data => {
      this.businessObjectsOptions = data;
    });
  }

  render() {
    return (
      <a-form class={styles.property}>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.name')}>
          <a-input
            value={this.template.name}
            on-change={(e: any) => {
              this.template.name = e.target.value;
            }}
          />
        </a-form-item>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.code')}>
          <a-input
            value={this.template.code}
            on-change={(e: any) => {
              this.template.code = e.target.value;
            }}
          />
        </a-form-item>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.business-type')}>
          <business-type-tree-select
            value={this.template.businessTypeId}
            withInAuthority={false}
            showTop={false}
            multiple={false}
            allow-clear={true}
            on-change={(value: string) => {
              this.template.businessTypeId = value;
              this.getBusinessObjects();
            }}
          ></business-type-tree-select>
        </a-form-item>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.business-object')}>
          <a-select value={this.template.businessObjectCode} options={this.businessObjectsOptions} on-change={this.onObjectChange} />
        </a-form-item>
        <p class='mt-2'>
          <a-button type='primary' on-click={this.onSave}>
            {this.$t('framework.save')}
          </a-button>
        </p>
      </a-form>
    );
  }
}
