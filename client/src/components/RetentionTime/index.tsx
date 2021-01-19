import { Component, Vue, Prop } from 'vue-property-decorator';

import styles from './component.retention-time.module.less';
import { CustomIcon } from '@/components';
import { Settings } from '@/common/defines';
import { i18nHelper } from '@/common/utils';

@Component({
  components: { CustomIcon },
})
export class RetentionTime extends Vue {
  @Prop() value!: number;

  private get textColor() {
    if (this.value >= Settings.ProcessOvertimeWarningDays) {
      return <a-tag color='red'>{this.value ? `${this.value}
      ${i18nHelper.getLocale('inbox-columns.retention-time-unit.retention-time-day')}` : ''}</a-tag>;
    } else if (this.value >= Settings.ProcessOvertimeUrgencyDays ) {
      return <a-tag color='orange'>{this.value ? `${this.value}
      ${i18nHelper.getLocale('inbox-columns.retention-time-unit.retention-time-day')}` : ''}</a-tag>;
    } else {
      return <span>{this.value ? `${this.value}
      ${i18nHelper.getLocale('inbox-columns.retention-time-unit.retention-time-day')}` : ''}</span>;
    }
  }

  render() {
    return (
      <div>
        {this.textColor}
      </div>
    );
  }
}
