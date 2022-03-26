import { Component } from 'vue-property-decorator';
import { BaseControl } from '../base-control';

@Component
export class MmtInput extends BaseControl {
  render() {
    return (
      <a-input
        v-model={this.item.cdata}
        placeholder={this.item.config.placeholder}
        disabled={!this.item.config.disabled}
      ></a-input >
    );
  }
}
