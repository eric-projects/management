import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseControl } from '../base-control';

@Component
export class MmtTextarea extends BaseControl {
  created(): void {
  }
  render() {
    return (
      <a-textarea
        v-model={this.item.cdata}
        placeholder={this.item.config.placeholder}
        disabled={!this.item.config.disabled}
        rows={this.item.config.rows}
      ></a-textarea>);
  }
}
