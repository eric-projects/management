import { Component, Prop, Vue } from 'vue-property-decorator';
import styles from './e-grid.module.less';

@Component
export class EOneGrid extends Vue {
  render() {
    return (
      <a-row>
        <a-col class={styles.col} span='24'>
          {this.$slots.default}
        </a-col>
      </a-row>
    );
  }
}
