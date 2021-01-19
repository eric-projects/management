import { Component, Vue, Prop } from 'vue-property-decorator';

import styles from './component.print-container.module.less';

@Component
export class PrintContainer extends Vue {
  @Prop() title!: string;

  render() {
    return (
      <div class={styles.printContainer}>
        <b>{this.title}</b>
        <div class={styles.instance}>{this.$slots.default}</div>
      </div>
    );
  }
}
