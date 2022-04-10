import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export class MobileEInput extends Vue {
  options = [
    {
      label: '选项1',
      value: 1,
    },
    {
      label: '选项2',
      value: 2,
    },
    {
      label: '选项3',
      value: 3,
    },
  ];
  public state = {
    disabled: false,
    slider: 5,
    switch: false,
    range: [0, 100],
    readonly: false,
    error: false,
    errorMessage: '',
    errorDisplayType: 'text',
  };
  public disabled = false;

  public onClick() {
    console.log('item clicked');
  }

  render() {
    return (
      <div>
        <m-list title='状态控制'>
          <m-switch-item title='禁用' v-model={this.state.disabled} />
          <m-switch-item title='只读' v-model={this.state.readonly} />
          <m-switch-item title='错误状态' v-model={this.state.error} />
        </m-list>
        <m-list title='表单' disabled={this.state.disabled} editable={!this.state.readonly}>
          <m-input required title='输入框' value='111' />
          <m-input
            title='数字'
            type='number'
            error={this.state.error}
            errorDisplayType={this.state.errorDisplayType}
            errorMessage={this.state.errorMessage}
          />
          <m-date-picker-item
            required
            title='日期时间选择'
            value={new Date()}
            error={this.state.error}
            errorDisplayType={this.state.errorDisplayType}
            errorMessage={this.state.errorMessage}
          />
        </m-list>
      </div>
    );
  }
}
