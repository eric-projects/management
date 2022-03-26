import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { BaseControl } from '../base-control';
import { formDesginService } from '../../../service';

@Component
export class MmtSelect extends BaseControl {
  private options: any = [];
  @Watch('item.config.dictionaryKey')
  initDictionaryKey() {
    this.onInit();
  }
  @Watch('item.config.options')
  initUptions() {
    this.onInit();
  }
  get defaultLable() {
    if (this.item.cdata) {
      const item = this.options.find((f: any) => f.value === this.item.cdata);
      return item ? item.label : '';
    }
    return '';
  }
  private onInit() {
    if (this.item.config.sourceType === 'custom') {
      this.options = this.item.config.options;
    } else if (this.item.config.sourceType === 'dictionary') {
      formDesginService.getDataDictionayOptions(this.item.config.dictionaryKey).subscribe(data => {
        this.options = data || [];
      });
    }
  }
  created(): void {
    this.onInit();
  }
  render() {
    return (
      <a-select
        v-model={this.item.cdata}
        placeholder={this.item.config.placeholder}
        disabled={!this.item.config.disabled}
        options={this.options}
        style={{ width: '100%' }}
      >
      </a-select>);
  }
}
