import { Component, Vue, Prop } from 'vue-property-decorator';

import styles from './component.approve-status.module.less';
import { StatusValueDto } from './types';

@Component
export class ApproveStatus extends Vue {
  @Prop() type!: 'table' | 'tag';
  @Prop() value!: StatusValueDto;

  render() {
    return (
      <div>
        {this.type === 'table' ? (
          <a-badge status='default' class={styles[this.value.state]} text={this.value.name} />
        ) : (
          <span class={styles.tag + ` ${styles[this.value.state]}`}>{this.value.name}</span>
        )}
      </div>
    );
  }
}
