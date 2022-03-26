import { Component, Vue } from 'vue-property-decorator';
import { Container, Draggable } from 'vue-smooth-dnd';

import styles from './form-designer.module.less';
import { i18nHelper, guidHelper } from '@/common/utils';
import { ValueLabelPair } from '@/common/defines';
import {
  DynamicFormComponent,
  DynamicFormComponentDescription,
  FormControlProperty,
  FormProperty,
  FormComponent,
  FormComponentDescription,
} from '../components';
import { AttachmentSnapshot, BaseInfoSnapshot, RelationSnapshot, RecordSnapshot, CommentSnapshot } from '../components/Demos';
import { AssemblyPartContainer } from '../components/AssemblyPartContainer';
import { formDesignerService } from './service';
import { FormTemplate, FormTemplateExtension } from './types';

@Component({
  components: {
    Container,
    Draggable,
    DynamicFormComponent,
    DynamicFormComponentDescription,
    FormControlProperty,
    FormProperty,
    AssemblyPartContainer,
    AttachmentSnapshot,
    BaseInfoSnapshot,
    RelationSnapshot,
    RecordSnapshot,
    CommentSnapshot,
  },
})
export class FormDesigner extends Vue {
  private propertyActiveKey = '2';
  private selectedControl: FormComponent | undefined;
  private businessObjectFieldsOptions!: ValueLabelPair[];

  private componentKeys = [
    'text',
    'input',
    'number',
    'autocomplete',
    'textarea',
    'password',
    'datetime',
    'switch',
    'radio',
    'checkbox',
    'select',
    'table',
  ];
  private componentDescriptions: FormComponentDescription[] = [];
  private formTemplate: FormTemplate = {
    formDesignId: '',
    code: '',
    name: '',
    businessObjectCode: '',
    businessTypeId: '',
    groups: [],
  };
  private extension: FormTemplateExtension = {
    baseInfo: true,
    relation: true,
    attachment: true,
    record: true,
    groups: [],
  };

  private get presetType(): string {
    return (this.$route.query['preset-type'] as string) || 'basic';
  }

  created() {
    this.formTemplate.formDesignId = this.$route.params['id'];
    this.formTemplate.businessTypeId = this.$route.query['business-type-id'] as string;
    this.formTemplate.businessObjectCode = this.$route.query['business-object-code'] as string;
    this.formTemplate.name = `${this.$t('designers.form-designer.presets.' + this.presetType)}`;
    this.componentDescriptions = this.componentKeys.map(key => formDesignerService.repository[key]);
    if (this.formTemplate.formDesignId) {
      formDesignerService.getTemplate(this.formTemplate.formDesignId).subscribe(dto => {
        this.extension = dto.extensionData;
        const template = formDesignerService.transformStructureReverse(dto, this.extension);
        this.formTemplate.code = template.code;
        this.formTemplate.name = template.name;
        this.formTemplate.businessTypeId = template.businessTypeId;
        this.formTemplate.businessObjectCode = template.businessObjectCode;
        this.formTemplate.groups = template.groups;
        this.makesureOneGroup();
        if (this.formTemplate.businessObjectCode) {
          this.onObjectChange(this.formTemplate.businessObjectCode);
        }
      });
    } else {
      if (this.formTemplate.businessObjectCode) {
        this.onObjectChange(this.formTemplate.businessObjectCode);
      }
      this.makesureOneGroup();
    }
  }

  private makesureOneGroup() {
    if ((this.formTemplate.groups || []).length < 1) {
      this.addApproveInfo();
    }
  }

  private addApproveInfo() {
    if (!this.formTemplate.groups) {
      this.formTemplate.groups = [];
    }
    const group = { id: guidHelper.generate(), title: `${this.$t('designers.form-designer.approval-info')}` };
    this.extension.groups.push(group);
    this.formTemplate.groups.push({
      ...group,
      controls: [],
    });
  }

  private onObjectChange(code: string) {
    formDesignerService.getBusinessFields(code).subscribe(data => {
      this.businessObjectFieldsOptions = data;
    });
  }

  private onSave(template: FormTemplate) {
    const dto = formDesignerService.transformStructure(template, this.extension);
    formDesignerService.saveTemplate(dto).subscribe(id => {
      this.$notify.success(i18nHelper.getLocale('designers.form-designer.save-success'));
      if (!this.formTemplate.formDesignId) {
        this.$router.push(`form-designer/${id}`);
      } else {
        this.formTemplate.formDesignId = id;
        this.$router.push(`${id}`);
      }
    });
  }

  private onBack() {
    this.$router.push(`/designers`);
  }

  render() {
    return (
      <a-layout class={styles.container}>
        <a-layout-header>
          <a-page-header on-back={this.onBack} title={this.$t('designers.form-designer.name')} subTitle={this.formTemplate.name} />
        </a-layout-header>
        <a-layout>
          <a-layout-sider class={styles.componentContainer} width={240}>
            <a-tabs defaultActiveKey='1'>
              <a-tab-pane tab={i18nHelper.getLocale('designers.group.base-components')} key='1'>
                <container
                  behaviour='copy'
                  group-name='1'
                  get-child-payload={(index: number) => formDesignerService.generateFormComponent(this.componentKeys[index])}
                >
                  {this.componentDescriptions.map(comp => {
                    return (
                      <draggable key={comp.type}>
                        <dynamic-form-component-description class={styles.component} type={comp.type} name={comp.name} />
                      </draggable>
                    );
                  })}
                </container>
              </a-tab-pane>
            </a-tabs>
          </a-layout-sider>
          <a-layout-content>
            <a-layout>
              <a-layout-content class={styles.formContainer}>
                <assembly-part-container
                  class='m-2'
                  title={this.$t('designers.form-designer.base-info')}
                  checked={this.extension.baseInfo}
                  on-check={(checked: boolean) => (this.extension.baseInfo = checked)}
                >
                  <base-info-snapshot />
                </assembly-part-container>
                {this.formTemplate.groups.map((group, gi) => (
                  <assembly-part-container
                    class='m-2'
                    title={group.title}
                    check-disabled={true}
                    on-title-change={(title: string) => {
                      group.title = title;
                      const origin = this.extension.groups.find(g => g.id === group.id);
                      if (origin) {
                        origin.title = title;
                      }
                    }}
                    on-delete={() => this.formTemplate.groups.splice(gi, 1)}
                    title-editable
                    deleteable={this.formTemplate.groups.length > 1}
                  >
                    <div class={styles.form}>
                      <container
                        group-name='1'
                        non-drag-area-selector='.ant-form-item-control-wrapper'
                        get-child-payload={(index: number) => formDesignerService.getControl(group.controls, index)}
                        on-drop={(item: any) =>
                          formDesignerService.putControl(group.controls, item.payload, item.removedIndex, item.addedIndex)
                        }
                        drop-placeholder={formDesignerService.dropPlaceholderOptions}
                        drag-class='ghost'
                        drop-class='ghost-drop'
                        style={{ height: `calc(${group.controls.length + 1} * 68px)` }}
                      >
                        {group.controls.map((ctrl, ci) => (
                          <draggable key={ctrl.id} style={{ width: ctrl.colSpan === 2 ? '50%' : '100%' }}>
                            <dynamic-form-component
                              id={ctrl.id}
                              type={ctrl.type}
                              code={ctrl.code}
                              name={ctrl.name}
                              col-span={ctrl.colSpan}
                              required={ctrl.required}
                              default-value={ctrl.defaultValue}
                              dataset={ctrl.dataset}
                              tips={ctrl.tips}
                              selected={ctrl.selected}
                              children={ctrl.children}
                              on-drop={(item: any) =>
                                formDesignerService.putControl(group.controls, item.payload, item.removedIndex, item.addedIndex, ctrl.id)
                              }
                              on-click={() => {
                                this.formTemplate.groups.forEach(g => {
                                  g.controls.forEach(c => (c.selected = c.id === ctrl.id));
                                });
                                this.selectedControl = ctrl;
                                if (!!this.formTemplate.businessObjectCode) {
                                  this.propertyActiveKey = '1';
                                }
                                this.$forceUpdate();
                              }}
                              on-delete={() => {
                                formDesignerService.putControl(group.controls, ctrl, ci, null);
                                this.selectedControl = undefined;
                              }}
                            />
                          </draggable>
                        ))}
                      </container>
                    </div>
                  </assembly-part-container>
                ))}
                <div class='m-2'>
                  <a-button type='dashed' icon='plus' block on-click={this.addApproveInfo}>
                    {i18nHelper.getLocale(['framework.add', 'framework.prepositions.space', 'designers.form-designer.approval-info'])}
                  </a-button>
                </div>
                <assembly-part-container
                  class='m-2'
                  title={this.$t('designers.form-designer.relation')}
                  checked={this.extension.relation}
                  on-check={(checked: boolean) => (this.extension.relation = checked)}
                >
                  <relation-snapshot />
                </assembly-part-container>
                <assembly-part-container
                  class='m-2'
                  title={this.$t('designers.form-designer.attachment')}
                  checked={this.extension.attachment}
                  on-check={(checked: boolean) => (this.extension.attachment = checked)}
                >
                  <attachment-snapshot />
                </assembly-part-container>
                <assembly-part-container class='m-2' title={this.$t('designers.form-designer.record')} check-disabled={true}>
                  <record-snapshot />
                </assembly-part-container>
                <assembly-part-container class='m-2' title={this.$t('designers.form-designer.comment')} check-disabled={true}>
                  <comment-snapshot />
                </assembly-part-container>
                <div class={styles.actions + ' m-2'}>
                  <a-button class='mx-1' type='primary'>
                    {this.$t('instance.actions.approve')}
                  </a-button>
                  <a-button class='mx-1'>{this.$t('instance.actions.reject')}</a-button>
                  <a-button class='mx-1'>{this.$t('instance.actions.handover')}</a-button>
                  <a-button class='mx-1'>{this.$t('instance.actions.counter-sign')}</a-button>
                  <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
                </div>
              </a-layout-content>
              <a-layout-sider class={styles.propertyContainer}>
                <a-tabs
                  activeKey={this.propertyActiveKey}
                  on-change={(key: string) => {
                    this.propertyActiveKey = key;
                  }}
                >
                  <a-tab-pane tab={i18nHelper.getLocale('designers.group.form-property')} key='2'>
                    <form-property template={this.formTemplate} on-object-change={this.onObjectChange} on-save={this.onSave} />
                  </a-tab-pane>
                  <a-tab-pane
                    tab={i18nHelper.getLocale('designers.group.component-property')}
                    key='1'
                    disabled={!this.formTemplate.businessObjectCode}
                  >
                    {!this.selectedControl ? (
                      ''
                    ) : (
                      <form-control-property
                        control={this.selectedControl}
                        fields-options={this.businessObjectFieldsOptions}
                        on-change={(control: FormComponent) => {
                          this.selectedControl = control;
                          this.$forceUpdate();
                        }}
                      />
                    )}
                  </a-tab-pane>
                </a-tabs>
              </a-layout-sider>
            </a-layout>
          </a-layout-content>
        </a-layout>
      </a-layout>
    );
  }
}
