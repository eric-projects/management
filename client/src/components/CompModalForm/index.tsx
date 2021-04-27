import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import { getComponentFromProp } from '@/common/utils';
import { CompFormBox } from '../CompFormBox';
import { FormFieldDto } from '../CompEditForm/comp-edit-form.types';
import { Observable, of } from 'rxjs';

@Component({ components: { CompFormBox } })
export class CompModalForm extends Vue {
  private visible = false;
  private _textFields: FormFieldDto[] = [];
  @Prop() textFields!: FormFieldDto[];
  @Prop({ default: false }) value!: boolean;
  @Prop({ default: true }) isValidate!: boolean;
  @Prop() title!: string;
  @Prop() width!: number;
  @Prop() footer!: any;

  @Emit('ok') onOk(e: any) {
    this.visible = false;
  }
  @Emit('cancel') onCancel(e: any) {
    this.visible = false;
  }

  @Watch('textFields') onModeChange(v: FormFieldDto[]) {
    this._textFields = [...(v || [])];
    this.$forceUpdate();
  }

  @Watch('value') onValueChange(v: boolean) {
    this.visible = v;
    if (!!v && this.$refs.form) {
      (this.$refs.form as any).resetFormId();
    }
  }

  @Watch('visible') onVisibleChange(v: boolean) {
    this.$emit('input', v);
  }

  validate(): Observable<void> {
    if (!this.$refs.form) {
      return of();
    }

    return (this.$refs.form as any).validate();
  }

  created() {}

  render() {
    const footerDom = getComponentFromProp(this, 'footer');
    return (
      <a-modal
        title={this.title}
        width={this.width || 600}
        visible={this.visible}
        footer={this.footer}
        on-ok={(e: any) => {
          if (this.isValidate) {
            this.validate().subscribe(() => {
              this.onOk(e);
            });
          } else {
            this.onOk(e);
          }
        }}
        on-cancel={this.onCancel}
      >
        {this._textFields && this._textFields.length > 0 ? (
          <a-descriptions>
            {this._textFields.map((field: FormFieldDto) => {
              return (
                <a-descriptions-item label={field.label} span={field.columnCount || 2}>
                  {field.value}
                </a-descriptions-item>
              );
            })}
          </a-descriptions>
        ) : (
          <comp-form-box ref='form'> {this.$slots.default}</comp-form-box>
        )}
        {footerDom ? <template slot='footer'>{footerDom}</template> : null}
      </a-modal>
    );
  }
}

// 编辑案例：1
/*
  <comp-modal-form v-model={this.detailEditVisible} title={this.locale[this.frameworkI18n].operate} on-ok={this.detailOk}>
          <a-form form={this.form}>
            <a-form-item label={this.locale[this.fieldsI18n].code} required>
              <a-input
                v-decorator={[
                  'code',
                  {
                    initialValue: this.editData.code,
                    rules: [{ required: true, message: `${this.locale[this.controlsI18n].input}${this.locale[this.fieldsI18n].code}` }],
                  },
                ]}
                v-model={this.editData.code}
                on-change={() => {
                  console.log(this.editData);
                }}
              />
            </a-form-item>
            <a-form-item label={this.locale[this.fieldsI18n].name} required>
              <a-input
                v-decorator={[
                  'name',
                  {
                    initialValue: this.editData.name,
                    rules: [{ required: true, message: `${this.locale[this.controlsI18n].input}${this.locale[this.fieldsI18n].name}` }],
                  },
                ]}
                v-model={this.editData.name}
              />
            </a-form-item>
            <a-form-item label={this.locale[this.platformI18n].dictionary.value}>
              <a-input v-decorator={['value', { initialValue: this.editData.value }]} v-model={this.editData.value} />
            </a-form-item>
            <a-form-item label={this.locale[this.fieldsI18n].order} required>
              <a-input-number
                style='width:100%'
                v-decorator={[
                  'order',
                  {
                    initialValue: this.editData.order,
                    rules: [{ required: true, message: `${this.locale[this.controlsI18n].input}${this.locale[this.fieldsI18n].order}` }],
                  },
                ]}
                v-model={this.editData.order}
              />
            </a-form-item>
            <a-form-item label={this.locale[this.fieldsI18n].remark}>
              <a-input v-decorator={['remark', { initialValue: this.editData.remark }]} v-model={this.editData.remark} />
            </a-form-item>
          </a-form>
        </comp-modal-form>
*/

// 展示案例：2
/* <comp-modal-form
v-model={this.detailLookVisible}
footer={null}
title={this.locale[this.buttonsI18n].read}
textFields={this.detailFieldData}
></comp-modal-form> */
