import { getComponentFromProp } from '@/common/utils';
import { Component, Prop, Vue } from 'vue-property-decorator';
import styles from './e-grid.module.less';

@Component
export class ETwoGrid extends Vue {
  // 输入 - 容器值
  public get InputContainer(): number {
    return 2;
  }

  render() {
    console.log(this);
    const item1 = getComponentFromProp(this, 'item0');
    const item2 = getComponentFromProp(this, 'item1');
    return (
      <a-row>
        <a-col class={styles.col} span='12'>
          {item1}
        </a-col>
        <a-col class={styles.col} span='12'>
          {item2}
        </a-col>
      </a-row>
    );
  }
}
