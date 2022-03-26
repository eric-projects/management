import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { Container } from 'vue-smooth-dnd';

import styles from './dynamic-form-component.module.less';
import { FormControlProperty } from '../FormControlProperty';
import { FormComponentType } from '../types';
import { FormComponent } from './form-component.type';
import { dynamicFormService } from './service';

@Component({
  components: { Container, FormControlProperty },
})
export class DynamicFormComponent extends Vue {
  @Prop() id!: string;
  @Prop() type!: FormComponentType;
  @Prop() code!: string;
  @Prop() name!: string;
  @Prop({ default: 1 }) colSpan!: number;
  @Prop({ default: false }) required!: boolean;
  @Prop({ default: null }) defaultValue!: any;
  @Prop({ default: '' }) dataset!: any;
  @Prop({ default: '' }) tips!: string;
  @Prop({ default: false }) selected!: boolean;
  @Prop({ default: () => [] }) children!: FormComponent[];

  @Emit('click')
  private onClick() {}

  @Emit('delete')
  private onDelete() {}

  private getTableColumns(): any[] {
    return this.children.map(ctrl => ({
      key: ctrl.id,
      title: ctrl.name,
      width: 200,
      customRender: (row: any) =>
        dynamicFormService.generateFormControl(ctrl, styles.item + (this.colSpan === 2 ? ' ' + styles.half : '') + ' control'),
    }));
  }

  private getTableData(): any[] {
    return [
      this.children.reduce(
        (prev: any, curr: FormComponent) => {
          prev[curr.id] = curr.type;
          return prev;
        },
        { key: '1' }
      ),
    ];
  }

  render() {
    let component: JSX.Element;

    if (dynamicFormService.getGeneratableKeys().includes(this.type)) {
      component = dynamicFormService.generateFormItem(
        {
          id: this.id,
          name: this.name,
          code: this.code,
          type: this.type,
          colSpan: this.colSpan,
          required: this.required,
          defaultValue: this.defaultValue,
          dataset: this.dataset,
          tips: this.tips,
          selected: this.selected,
        },
        styles.item + (this.colSpan === 2 ? ' ' + styles.half : '') + ' control'
      );
    } else {
      switch (this.type) {
        case 'attchment':
          component = <div />;
          break;
        case 'modal':
          component = <div />;
          break;
        case 'cascader':
          component = <div />;
          break;
        case 'table':
          component = (
            <div class={styles.item}>
              <a-table
                columns={this.getTableColumns()}
                data-source={this.getTableData()}
                scopedSlots={{
                  title: () => <h3>{this.name}</h3>,
                }}
                scroll={{ x: this.children.length * 200 }}
                pagination={false}
              />
            </div>
          );
          break;
        default:
          component = <div />;
          break;
      }
    }

    return (
      <div class={styles.container + (this.selected ? ' ' + styles.selected : '')} on-click={this.onClick}>
        {this.selected ? <a-icon type='check' class={styles.checked} /> : ''}
        {component}
        <div class={styles.mask} />
        <a-popconfirm title={this.$t('framework.delete-info')} placement='left' on-confirm={this.onDelete}>
          <a-tooltip title={this.$t('framework.delete')}>
            <a-icon type='delete' class={styles.delete} on-click={(e: MouseEvent) => e.stopPropagation()} />
          </a-tooltip>
        </a-popconfirm>
      </div>
    );
  }
}
