import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import styles from './component.page-anchor.module.less';
import { scrollCompatibility } from '@/common/utils';
import { PageAnchorDto } from './page-anchor.types';

@Component
export class PageAnchor extends Vue {
  @Prop() containerId!: string;
  @Prop() headerId!: string;
  @Prop() modules!: any;

  private values: PageAnchorDto[] = [];

  private get container(): HTMLElement | null {
    return document.getElementById(this.containerId);
  }

  private get header(): HTMLElement | null {
    return document.getElementById(this.headerId);
  }

  @Watch('modules')
  onModuleStateChange() {
    this.values = this.values.filter(v => !!document.querySelector(`#${v.value}`));
  }

  private getComputedNumberStyle(el: HTMLElement, prop: string): number {
    const computedStyles = window.getComputedStyle(el) as any;
    return Number(computedStyles[prop].replace(/px$/, ''));
  }

  private jumpTo(id: string) {
    const element = document.getElementById(id);
    if (this.container && this.header && element) {
      const firstElementId = this.values[0].value;
      const top =
        element.offsetTop -
        this.getComputedNumberStyle(element, 'margin-top') -
        (id === firstElementId
          ? this.getComputedNumberStyle(this.header, 'max-height')
          : this.getComputedNumberStyle(this.header, 'min-height'));
      scrollCompatibility(this.container, top);
    }
  }

  created() {
    this.values = [
      { label: `${this.$t('anchor-items.base-info')}`, value: 'instance-base-info', icon: 'file' },
      { label: `${this.$t('anchor-items.form-info')}`, value: 'instance-form', icon: 'audit' },
      { label: `${this.$t('anchor-items.attachment')}`, value: 'instance-attachments', icon: 'paper-clip' },
      { label: `${this.$t('anchor-items.comment')}`, value: 'instance-comment', icon: 'edit' },
    ];
  }

  render() {
    return (
      <div class={styles.container}>
        {(this.values || []).map((element, i) => {
          return (
            <a
              style={{ top: `${i * 32}px` }}
              on-click={this.jumpTo.bind(this, element.value as string)}
              class={element.value === 'instance-comment' ? styles.primary : ''}
            >
              <a-icon type={element.icon || 'file'} />
              <span class={styles.title}>{element.label}</span>
            </a>
          );
        })}
      </div>
    );
  }
}
