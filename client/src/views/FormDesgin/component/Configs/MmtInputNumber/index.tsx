import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';

@Component
export class MmtInputNumberConfig extends BaseConfig {
  created(): void {
  }
  render() {
    return <div>
      <a-form-item label='占位内容'>
        <a-input v-model={this.item.config.placeholder}></a-input>
      </a-form-item>
      <a-form-item label='数值精度'>
        <a-input-number
          v-model={this.item.config.precision}
          precision={0}
          min={0}
          max={4}
          style={{ width: '100%' }}
        />
      </a-form-item>
      <a-form-item label='千分位显示'>
        <a-switch
          v-model={this.item.config.thousandths}
          checked-children='是'
          un-checked-children='否'
        ></a-switch>
      </a-form-item>
    </div>;
  }
}
