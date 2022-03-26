import { guidHelper } from '@/common/utils';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';
import styles from './layout.module.less';

@Component({
})
export class MmtLayoutConfig extends BaseConfig {
  private onColumnChange(event: any) {
    this.item.info.columns = [];
    for (let i = 0; i < event.target.value; i++) {
      this.item.info.columns.push(
        {
          id: guidHelper.generate(),
          span: 24 / event.target.value,
          list: []
        }
      );
    }
  }
  created(): void {
  }
  render() {
    return (
      <div>
        <a-form-item label='列配置项'>
          <a-radio-group value={this.item.info.columns.length}
            on-change={this.onColumnChange}>
            <a-radio value={2}>一行两列</a-radio>
            <a-radio value={3}>一行三列</a-radio>
            <a-radio value={4}>一行四列</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
    );
  }
}
