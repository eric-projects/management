import { Component, Prop, Vue } from 'vue-property-decorator';
import { DraggableItem, TerminalTypeEnum } from '../draggable.types';
import * as PCComp from '../DraggableComponent/PCComponent';
import * as MobileComp from '../DraggableComponent/MobileComponent';
import styles from './draggable-component.module.less';

@Component({ components: { ...PCComp, ...MobileComp } })
export class DraggableComponent extends Vue {
  @Prop() data!: DraggableItem;
  @Prop({ default: '' }) terminal!: TerminalTypeEnum;
  render() {
    return this.$createElement(
      `${this.terminal}-e-${this.data.type}`,
      {
        props: {},
        scopedSlots: this.$scopedSlots,
      },
      this.$slots.default
    );
  }
}
