import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

import styles from './component.page-block-container.module.less';

@Component
export class PageBlockContainer extends Vue {
  @Prop() title!: string;
  @Prop() loading!: boolean;

  private hide = false;

  render() {
    return (
      <a-card
        loading={this.loading}
        class={styles.instance + (this.hide ? ` ${styles.hidden}` : '')}
        scopedSlots={{
          title: () => {
            return (
              <p class={styles.title}>
                <span class={styles.sign}></span>
                <span>{this.title}</span>
              </p>
            );
          },
          extra: () => {
            return (
              <a href='#' on-click={() => (this.hide = !this.hide)}>
                <a-icon class={styles.icon} theme='filled' type={this.hide ? 'up-circle' : 'down-circle'} />
              </a>
            );
          },
        }}
      >
        {this.$slots.default}
      </a-card>
    );
  }
}
