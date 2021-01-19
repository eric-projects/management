import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import styles from './component.menu-item.module.less';

@Component
export class MenuItem extends Vue {
  @Prop() icon!: string;
  @Prop() name!: string;
  @Prop() isClosed!: boolean;
  @Prop() badgeValue!: number;

  private closed = false;

  @Watch('isClosed') onModeChange(v: boolean) {
    this.closed = v;
  }

  created() {
    this.closed = this.isClosed;
  }

  render() {
    return this.closed ? (
      <a-badge count={this.badgeValue} offset={[10, 10]}>
        <a-icon type={this.icon} class='' />
      </a-badge>
    ) : (
      <span>
        <a-icon type={this.icon} class='' />
        <span>{this.name}</span>
        <a-badge count={this.badgeValue} />
      </span>
    );
  }
}
