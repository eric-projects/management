import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { VNode } from 'vue';
import { Modal } from 'ant-design-vue';

import styles from './form-control-property.module.less';
import { i18nHelper } from '@/common/utils';
import { CustomFieldModal } from '../CustomFieldModal';
import { FormComponent } from '../DynamicFormComponent/form-component.type';
import { BusinessObjectFieldOption, FormComponentType } from '../types';
import { ValueLabelPair } from '@/common/defines';
import { dynamicFormService } from '../DynamicFormComponent/service';

@Component({
  components: { CustomFieldModal }
})
export class FormControlProperty extends Vue {
  @Prop() control!: FormComponent;
  @Prop() fieldsOptions!: BusinessObjectFieldOption[];

  private fieldBeenSet!: boolean;
  private customFields: BusinessObjectFieldOption[] = [];

  @Emit('change')
  onChange(propName: string, value: any): FormComponent {
    Object.assign(this.control, { [propName]: value });
    if (propName === 'field') {
      // 选定字段才能编辑其他属性
      this.onFieldChange();
    } else if (propName === 'children') {
      // 确保外部控件可以根据prop重新渲染
      this.control.children = [...(this.control.children || [])];
    }
    this.$forceUpdate();
    return this.control;
  }

  @Watch('control')
  private onControlChange() {
    this.fieldBeenSet = !!this.control.field;
  }

  private get childrenTypes(): ValueLabelPair[] {
    return dynamicFormService
      .getGeneratableKeys()
      .map<ValueLabelPair>(key => ({ label: `${this.$t('designers.components.' + key)}`, value: key }));
  }

  private onFieldChange() {
    this.fieldBeenSet = !!this.control.field;
    let field = (this.fieldsOptions || []).find(f => f.value === this.control.field);
    if (!field) {
      field = this.customFields.find(f => f.value === this.control.field);
    }
    if (field) {
      this.control.name = field.label;
      this.control.code = field.value as string;
      this.control.defaultValue = field.defaultValue;
      this.control.children = (field.children || []).map(c => {
        const child = new FormComponent({ type: FormComponentType.input, name: c.label });
        child.defaultValue = c.defaultValue;
        child.code = c.value as string;
        return child;
      });
    }
  }

  private addField() {
    const modalNode = <custom-field-modal />;
    Modal.confirm({
      title: this.$t('designers.control-property.add-custom-field'),
      content: modalNode,
      onOk: () =>
        new Promise((resolve, reject) => {
          const instance = modalNode.componentInstance;
          if (instance) {
            const { name, code } = instance.$data.field;
            this.customFields.push({ value: code, label: name, type: '', defaultValue: '' });
            this.onChange('field', code);
            resolve();
          } else {
            reject();
          }
        })
    });
  }

  render() {
    return (
      <a-form class={styles.property}>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.id')}>
          <span class='ant-form-text'>{this.control.id.replace(/-.*$/, '****')}</span>
        </a-form-item>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.field')}>
          <a-select
            value={this.control.field}
            placeholder={!this.fieldsOptions ? this.$t('designers.control-property.non-business-object') : ''}
            on-change={(filedCode: string) => this.onChange('field', filedCode)}
            scopedSlots={{
              dropdownRender: (menu: VNode) => {
                const btn = (
                  <a-button type='link' icon='plus' block on-click={this.addField}>
                    {this.$t('designers.control-property.custom-field')}
                  </a-button>
                );
                return [menu, <a-divider style='margin: 2px 0;' />, btn];
              }
            }}
          >
            <a-select-opt-group label={this.$t('designers.control-property.business-object')}>
              {(this.fieldsOptions || []).map(f => (
                <a-select-option
                  value={f.value}
                  disabled={
                    (this.control.type === 'table' && (f.children || []).length < 1) ||
                    (this.control.type !== 'table' && (f.children || []).length > 0)
                  }
                >
                  {f.label + (f.children && f.children.length > 0 ? ` (${this.$t('designers.control-property.child-table')})` : '')}
                </a-select-option>
              ))}
            </a-select-opt-group>
            <a-select-opt-group label={this.$t('designers.control-property.custom')}>
              {(this.customFields || []).map(f => (
                <a-select-option value={f.value} disabled={this.control.type === 'table'}>
                  {f.label}
                </a-select-option>
              ))}
            </a-select-opt-group>
          </a-select>
        </a-form-item>
        {this.control.type === FormComponentType.table ? (
          ''
        ) : (
          <a-form-item label={i18nHelper.getLocale('designers.control-property.colspan')}>
            <a-radio-group
              value={this.control.colSpan}
              on-change={(e: any) => this.onChange('colSpan', e.target.value)}
              disabled={!this.fieldBeenSet}
            >
              <a-radio-button value={1}>{i18nHelper.getLocale('designers.control-property.colspan-1')}</a-radio-button>
              <a-radio-button value={2}>{i18nHelper.getLocale('designers.control-property.colspan-2')}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        )}
        {this.control.type === FormComponentType.table ? (
          ''
        ) : (
          <a-form-item label={i18nHelper.getLocale('designers.control-property.required')}>
            <a-checkbox
              checked={this.control.required}
              on-change={(e: any) => this.onChange('required', e.target.checked)}
              disabled={!this.fieldBeenSet}
            />
          </a-form-item>
        )}
        <a-form-item label={i18nHelper.getLocale('designers.control-property.name')}>
          <a-input value={this.control.name} on-change={(e: any) => this.onChange('name', e.target.value)} disabled={!this.fieldBeenSet} />
        </a-form-item>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.code')}>
          <a-input value={this.control.code} read-only disabled={!this.fieldBeenSet} />
        </a-form-item>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.value')}>
          <a-input
            value={this.control.defaultValue}
            on-change={(e: any) => this.onChange('defaultValue', e.target.value)}
            disabled={!this.fieldBeenSet}
          />
        </a-form-item>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.dataset')}>
          <a-textarea
            auto-size={{ minRows: 2 }}
            value={this.control.dataset}
            on-change={(e: any) => this.onChange('dataset', e.target.value)}
            disabled={!this.fieldBeenSet}
          />
        </a-form-item>
        <a-form-item label={i18nHelper.getLocale('designers.control-property.tips')}>
          <a-input value={this.control.tips} on-change={(e: any) => this.onChange('tips', e.target.value)} disabled={!this.fieldBeenSet} />
        </a-form-item>
        {/* <a-form-item {...formDesignerService.commonProperties} label={i18nHelper.getLocale('designers.control-property.limit')}>
          <a-col span='6'>
            <a-input value={this.control.minimum} type='number' on-change={(e: any) => this.onChange('minimum', e.target.value)} />
          </a-col>
          <a-col span='6' offset='2'>
            <a-input value={this.control.maximum} type='number' on-change={(e: any) => this.onChange('maximum', e.target.value)} />
          </a-col>
        </a-form-item> */}
        {this.control.type === FormComponentType.table ? (
          <a-form-item label={i18nHelper.getLocale('designers.control-property.child-table')}>
            <a-list
              size='small'
              bordered
              dataSource={this.control.children}
              scopedSlots={{
                renderItem: (item: FormComponent) => (
                  <a-list-item>
                    <a-form>
                      <a-form-item
                        label={i18nHelper.getLocale('designers.control-property.name')}
                        label-col={{ span: 8 }}
                        wrapper-col={{ span: 16 }}
                      >
                        <a-input
                          value={item.name}
                          on-change={(e: any) => {
                            item.name = e.target.value;
                            this.onChange('children', this.control.children);
                          }}
                        />
                      </a-form-item>
                      <a-form-item
                        label={i18nHelper.getLocale('designers.control-property.code')}
                        label-col={{ span: 8 }}
                        wrapper-col={{ span: 16 }}
                      >
                        <a-input value={item.code} read-only />
                      </a-form-item>
                      <a-form-item
                        label={i18nHelper.getLocale('designers.control-property.value')}
                        label-col={{ span: 8 }}
                        wrapper-col={{ span: 16 }}
                      >
                        <a-input
                          value={item.defaultValue}
                          on-change={(e: any) => {
                            item.defaultValue = e.target.value;
                            this.onChange('children', this.control.children);
                          }}
                        />
                      </a-form-item>
                      <a-form-item
                        label={i18nHelper.getLocale('designers.control-property.control-type')}
                        label-col={{ span: 8 }}
                        wrapper-col={{ span: 16 }}
                      >
                        <a-select
                          value={item.type}
                          options={this.childrenTypes}
                          on-change={(value: any) => {
                            item.type = value;
                            this.onChange('children', this.control.children);
                          }}
                        />
                      </a-form-item>
                    </a-form>
                  </a-list-item>
                )
              }}
            ></a-list>
          </a-form-item>
        ) : (
          ''
        )}
      </a-form>
    );
  }
}
