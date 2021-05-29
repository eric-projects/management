import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import { DraggableItem, DraggableTypeEnum } from '../draggable.types';
import { DraggableComponent } from '../DraggableComponent';

import styles from './nested-draggable.module.less';

@Component({ components: { draggable, DraggableComponent } })
export class NestedDraggable extends Vue {
  @Prop() data!: DraggableItem[];
  @Prop() dataIndex!: number;

  render() {
    return (
      <draggable class={styles.drag_area} tag='ul' group='component' handle='.mover' list={this.data}>
        {(this.data || []).map((m: DraggableItem, i: number) => {
          if (this.dataIndex !== undefined && i !== this.dataIndex) {
            return null;
          }

          return (
            <div class={styles.draggable_area}>
              <draggable-component class='mt-1' data={m}>
                {(m.children || []).length > 0 ? (
                  m.type === DraggableTypeEnum.TwoGrid ? (
                    [
                      <template slot='item0'>
                        <nested-draggable dataIndex={0} data={m.children}></nested-draggable>
                      </template>,
                      <template slot='item1'>
                        <nested-draggable dataIndex={1} data={m.children}></nested-draggable>
                      </template>,
                    ]
                  ) : (
                    <nested-draggable data={m.children}></nested-draggable>
                  )
                ) : null}
              </draggable-component>
              <a-icon type='drag' class='mover' />
            </div>
          );
        })}
      </draggable>
    );
  }
}

// {(this.data || []).map((m: any) => {
//   return (
//     <draggable-component data={m}>
//       {m.children.length > 0 ? <nested-draggable data={m.children}></nested-draggable> : null}
//     </draggable-component>
//   );
// })}

/* <li key={m.name}>
<p>{m.name}</p>
<nested-draggable data={m.children}></nested-draggable>
</li> */
/* {m.children.map((cm, i) => {
                    return (
                      <template slot={'item' + i}>
                        <nested-draggable data={cm}></nested-draggable>
                      </template>
                    );
                  })} */

//   <draggable-component class='mt-1' data={m}>
//   {m.type === DraggableTypeEnum.TwoGrid ? (
//     [
//       ...m.children.map((cm, i) => {
//         return (
//           <template slot={'item' + i}>
//             <nested-draggable data={[m.children[i]]}></nested-draggable>
//           </template>
//         );
//       }),
//     ]
//   ) : (
//     <nested-draggable data={m.children}></nested-draggable>
//   )}
// </draggable-component>

// <li key={m.name}>
// {/* <draggable-component data={m}> */}
// <p>{m.name}</p>
// {m.type === DraggableTypeEnum.TwoGrid ? (
//   [
//     <a-row>
//       {m.children.map(vm => {
//         return <a-col span='12'>{vm.name}</a-col>;
//       })}
//     </a-row>,
//   ]
// ) : (
//   <nested-draggable data={m.children}></nested-draggable>
// )}
// {/* </draggable-component> */}
// </li>

// (m.children || []).map((vm, vi) => {
//   return [
//     <template slot={'item' + vi}>
//       <nested-draggable dataIndex={vi} data={m.children}></nested-draggable>
//     </template>,
//   ];
// })
