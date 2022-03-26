import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { Modal } from 'ant-design-vue';

import styles from './assembly-part.module.less';

@Component
export class AssemblyPartContainer extends Vue {
  @Prop() title!: string;
  @Prop() titleEditable!: boolean;
  @Prop() deleteable!: boolean;
  @Prop({ default: true }) checked!: boolean;
  @Prop() checkDisabled!: boolean;

  private tempTitle = '';

  @Emit('check')
  private onChange(checked: boolean) {
    return checked;
  }

  @Emit('title-change')
  private onTitleChange(value: string) {
    return value;
  }

  @Emit('delete')
  private onDelete() { }

  render() {
    return (
      <a-card
        class={`${styles.assembly}${!this.checked ? ' ' + styles.disabled : ''}`}
        scopedSlots={{
          title: () => {
            return this.titleEditable ? (
              <div>
                <span class='mr-1'>{this.title}</span>
                <a-popconfirm
                  placement='rightTop'
                  on-visibleChange={(visible: boolean) => {
                    if (visible) {
                      this.tempTitle = this.title;
                    }
                  }}
                  on-confirm={() => {
                    this.onTitleChange(this.tempTitle);
                  }}
                  scopedSlots={{
                    title: () => <a-input value={this.tempTitle} on-change={(e: any) => (this.tempTitle = e.target.value)} />
                  }}
                >
                  <a-icon type='edit' />
                </a-popconfirm>
              </div>
            ) : (
              this.title
            );
          },
          extra: () => {
            return (
              <div>
                {this.deleteable ? (
                  <a-popconfirm title={this.$t('framework.delete-info')} placement='topRight' on-confirm={this.onDelete}>
                    <a-button type='primary' shape='circle' icon='delete' />
                  </a-popconfirm>
                ) : (
                  ''
                )}
                {this.checkDisabled ? (
                  ''
                ) : (
                  <a-switch
                    checked-children={this.$t('framework.enabled')}
                    un-checked-children={this.$t('framework.disabled')}
                    checked={this.checked}
                    on-change={this.onChange}
                  />
                )}
              </div>
            );
          }
        }}
      >
        {this.$slots.default}
      </a-card>
    );
  }
}
