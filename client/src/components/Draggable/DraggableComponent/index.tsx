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
    console.log('name-', this.data.name);
    const compName = this.terminal ? `${this.terminal}-e-${this.data.type}` : `e-${this.data.type}`;
    return this.$createElement(
      compName,
      {
        props: {},
        scopedSlots: this.$scopedSlots,
      },
      this.$slots.default
    );
  }
}
