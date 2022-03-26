import { Component, Vue } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import { NestedDraggable, ComponentBox } from '@/components';
import styles from './designer.module.less';
import { DraggableItem, DraggableTypeEnum } from '@/components/Draggable/draggable.types';

@Component({ components: { draggable, NestedDraggable, ComponentBox } })
export class DesignerView extends Vue {
  // 数据结构必须有children 不然拖拽容器会消失数据
  private data: DraggableItem[] = [
    {
      name: 'task 2',
      key: 'input',
      type: DraggableTypeEnum.Input,
      children: [],
    },
    {
      name: 'task 3',
      type: DraggableTypeEnum.TwoGrid,
      children: [
        {
          name: 'task 4',
          type: DraggableTypeEnum.Input,
          children: [],
        },
        {
          name: 'task 6',
          type: DraggableTypeEnum.Input,
          children: [],
        },
      ],
    },
    {
      name: 'task 5',
      type: DraggableTypeEnum.OneGrid,
      children: [
        {
          name: 'task 7',
          type: DraggableTypeEnum.Input,
          children: [],
        },
      ],
    },
  ];

  private loopData(items: DraggableItem[], parent?: DraggableItem) {
    return items.map(m => {
      m.parent = parent;
      if ((m.children || []).length > 0) {
        m.children = this.loopData(m.children || [], m);
      }

      return m;
    });
  }

  created() {
    this.data = this.loopData(this.data);
  }

  mounted() {
    // const testVNode = (this.$refs.draggable as any).$vnode;
    // const testCompile = Vue.compile(`<div id="test">aaa</div>`);
    // // testCompile.render.call(this);
    // console.log(testCompile);
    // console.log(testVNode);
    // new Vue({
    //   render: e => {
    //     console.log(testCompile.render.call(this, e));
    //     return testVNode;
    //   },
    // }).$mount('#test');
  }

  render() {
    // <nested-draggable data={m.children}></nested-draggable>
    return (
      <a-layout>
        <a-layout-sider>
          <component-box></component-box>
          <div id='test'></div>
        </a-layout-sider>
        <a-layout>
          <a-layout-content>
            <nested-draggable ref='draggable' data={this.data} />
          </a-layout-content>
        </a-layout>
      </a-layout>

      // <a-form form='form' label-col='{ span  5 }' wrapper-col='{ span  12 }'>
      //   <draggable class='drag-container' v-model={this.data}>
      //     {this.data.length === 0 ? (
      //       <a-empty description='拖入控件绘制表单' />
      //     ) : (
      //       <a-form-item label='Note'>
      //         <a-input />
      //       </a-form-item>
      //     )}
      //   </draggable>
      // </a-form>
    );
  }
}
