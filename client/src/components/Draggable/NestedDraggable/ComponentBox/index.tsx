import { Component, Prop, Vue } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import * as PCComp from '../../DraggableComponent/PCComponent';
import * as MobileComp from '../../DraggableComponent/MobileComponent';
import { DraggableContainerTypeEnum, DraggableItem, DraggableTypeEnum } from '../../draggable.types';
import styles from './component-box.module.less';

@Component({ components: { draggable } })
export class ComponentBox extends Vue {
  render() {
    const comps: DraggableItem[] = [];
    console.log(PCComp);
    Object.keys(PCComp).map(m => {
      let containerNum = 0;
      if ((PCComp as any)[m].extendOptions.computed) {
        const compContainer = (PCComp as any)[m].extendOptions.computed.InputContainer.get();
        containerNum = compContainer ? compContainer : 0;
      }
      comps.push({ key: m, name: m, container: containerNum, type: DraggableTypeEnum.Input, children: [] });
    });

    return (
      <div>
        <draggable list={comps} options={{ group: { name: 'component', pull: 'clone' }, sort: false }} animation='300'>
          <transition-group>
            {comps.map(m => {
              return (
                <div class={styles.component_box + ' mt-1 forbid'} key={m.key}>
                  {m.name}
                </div>
              );
            })}
          </transition-group>
        </draggable>
      </div>
    );
  }
}
