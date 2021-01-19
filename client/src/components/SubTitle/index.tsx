import { Component, Vue, Prop } from 'vue-property-decorator';

import styles from './component.sub-title.module.less';
import { getComponentFromProp } from '@/common/utils';
import { InstanceParamMixin } from '@/mixins';

@Component({
  mixins: [InstanceParamMixin],
})
export class SubTitle extends Vue {
  render() {
    const actionDom = getComponentFromProp(this, 'action');
    return (
      <div>
        <div class={styles.container} id='subTitle'>
          {/* <span class={`${styles.spot} bg-primary`} /> */}
          <span class={styles.title + ' h4'}>{this.$slots.default}</span>
          <span class={styles.action}>{actionDom || ''}</span>
        </div>
        {this.number ? (
          <div class={styles.container}>
            <span>流程编号：{this.number}</span>
          </div>
        ) : null}
      </div>
    );
  }
}
