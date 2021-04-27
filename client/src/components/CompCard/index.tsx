import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { getComponentFromProp } from '@/common/utils';
import styles from './component.comp-card.module.less';

@Component
export class CompCard extends Vue {
  @Prop() title!: string;
  @Prop({ default: true }) defaultStyle!: boolean;
  @Prop({ default: true }) bordered!: boolean;

  render() {
    const extraDom = getComponentFromProp(this, 'extra');
    const titleDom = getComponentFromProp(this, 'title');
    return (
      <a-card class={this.defaultStyle ? styles.card : undefined} bordered={this.bordered}>
        {titleDom ? <template slot='title'>{titleDom}</template> : null}
        {extraDom ? <template slot='extra'>{extraDom}</template> : null}
        {this.$slots.default}
      </a-card>
    );
  }
}
