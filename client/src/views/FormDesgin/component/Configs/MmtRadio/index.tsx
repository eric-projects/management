import { Component, Prop, Vue } from 'vue-property-decorator';
import { Options } from '../../Common/Options';
import { BaseConfig } from '../base-config';

@Component({
  components: { Options }
})
export class MmtRadioConfig extends BaseConfig {
  private visible = false;
  private onChange(value: boolean, data: any) {
    this.visible = false;
    if (value) {
      this.item.config.sourceType = data.config.sourceType;
      this.item.config.options = data.config.options;
      this.item.config.dictionaryKey = data.config.dictionaryKey;
    }
  }
  private onSetting() {
    this.visible = true;
  }
  created(): void {
  }
  render() {
    return <a-form-item label='选项'>
      <a-button type='dashed' size='small'
        on-click={this.onSetting}
      >配置选项</a-button>
      <options
        item={this.item}
        visible={this.visible}
        on-change={this.onChange}
      ></options>
    </a-form-item>;
  }
}
