<template>
  <div>
    <a-layout id="bpmn_container" class="bpmn-container" :style="{ height: editorHeight }">
      <a-layout class="bpmn_js_box bpmn-js-box">
        <a-layout-content>
          <a-layout-header id="bpmn_toolbar" class="toolbar">
            <a-button-group>
              <!-- style={{ display: this.mtProgress ? 'none' : '' }} -->
              <a-tooltip>
                <template slot="title">
                  <span>开始</span>
                </template>
                <a-button
                  size="large"
                  type="link"
                  draggable="true"
                  @dragstart="
                    () => {
                      create('bpmn:StartEvent');
                    }
                  "
                  @click="
                    () => {
                      create('bpmn:StartEvent');
                    }
                  "
                >
                  <a-icon type="play-circle" />
                  <!-- <custom-icon type="bpmn-start"></custom-icon> -->
                </a-button>
              </a-tooltip>
              <a-tooltip>
                <template slot="title">
                  <span>结束</span>
                </template>
                <a-button
                  size="large"
                  type="link"
                  draggable="true"
                  @dragstart="
                    () => {
                      create('bpmn:EndEvent');
                    }
                  "
                  @click="
                    () => {
                      create('bpmn:EndEvent');
                    }
                  "
                >
                  <a-icon type="play-circle" />
                  <!-- <custom-icon type="bpmn-end"></custom-icon> -->
                </a-button>
              </a-tooltip>
            </a-button-group>
            <a-divider type="vertical"></a-divider>
            <!-- style={{ display: this.mtProgress ? 'none' : '' }} -->
            <a-button-group size="large">
              <!-- style={{ display: this.mtProgress ? 'none' : '' }} -->
              <a-tooltip>
                <template slot="title">
                  <span>用户任务</span>
                </template>
                <a-button
                  type="link"
                  draggable="true"
                  @dragstart="
                    () => {
                      create('bpmn:UserTask');
                    }
                  "
                  @click="
                    () => {
                      create('bpmn:UserTask');
                    }
                  "
                >
                  <a-icon type="user" />
                </a-button>
              </a-tooltip>
            </a-button-group>
            <a-divider type="vertical"></a-divider>
            <!-- style={{ display: this.mtProgress ? 'none' : '' }} -->
            <a-button-group size="large">
              <!-- style={{ display: this.mtProgress ? 'none' : '' }} -->
              <a-tooltip>
                <template slot="title">
                  <span>线</span>
                </template>
                <a-button type="link" @click="connect">
                  <a-icon type="rise" />
                </a-button>
              </a-tooltip>
            </a-button-group>
            <a-divider type="vertical"></a-divider>
            <!-- style={{ display: this.mtProgress ? 'none' : '' }} -->
            <a-button-group size="large">
              <a-tooltip>
                <template v-if="!mtProgress" slot="title">
                  <span>定位</span>
                </template>
                <template v-else slot="title">
                  <span>定位</span>
                </template>
                <a-button type="link" @click="locate">
                  <!-- <custom-icon type="bpmn-aim"></custom-icon> -->
                </a-button>
              </a-tooltip>
              <a-tooltip>
                <template v-if="!mtProgress" slot="title">
                  <span>适应画布</span>
                </template>
                <template v-else slot="title">
                  <span>适应画布</span>
                </template>
                <a-button type="link" @click="resetZoom">
                  <!-- <custom-icon type="bpmn-expand"></custom-icon> -->
                </a-button>
              </a-tooltip>
              <a-popover placement="bottom">
                <template slot="content">
                  <a-slider class="bpmn_zoom_dropdown" :min="0.1" :max="2" :step="0.1" :value="zoomValue" @change="zoomChange"></a-slider>
                </template>
                <a-button type="link">
                  <a-icon type="search" />
                </a-button>
              </a-popover>
            </a-button-group>
            <a-divider type="vertical"></a-divider>
            <!-- style={{ display: this.mtProgress ? 'none' : '' }} -->
            <a-button-group size="large">
              <!-- style={{ display: this.mtProgress ? 'none' : '' }} -->
              <a-tooltip>
                <template slot="title">
                  <span>撤销</span>
                </template>

                <a-button v-if="bpmnService.commandStack" type="link" :disabled="!canUndo" @click="undo">
                  <a-icon type="undo" />
                </a-button>
              </a-tooltip>
              <a-tooltip>
                <template slot="title">
                  <span>重做</span>
                </template>
                <a-button type="link" :disabled="!canRedo" @click="redo">
                  <a-icon type="redo" />
                </a-button>
              </a-tooltip>
            </a-button-group>
            <a-divider type="vertical"></a-divider>
            <a-button-group size="large">
              <a-tooltip>
                <template slot="title">
                  <span>保存</span>
                </template>
                <a-button type="link" @click="save">
                  <a-icon type="save" />
                </a-button>
              </a-tooltip>
            </a-button-group>
            <a-divider type="vertical"></a-divider>
          </a-layout-header>
          <a-layout-content id="bpmn_graph_container" class="bpmn_graph_container">
            <div class="bpmn_js_box bpmn-js-box" canvas ref="bpmnCanvas"></div>
          </a-layout-content>
        </a-layout-content>
        <div on-click="{this.toggleProperty}" class="bpmn_handle bpmn-handle">
          <a-icon :type="showProperty ? 'caret-right' : 'caret-left'"></a-icon>
        </div>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import BpmnService from './bpmn';
export default {
  data() {
    return {
      mtProgress: false,
      mtData: {},
      mtPropertyWidth: 360,
      editorHeight: '100%',
      showProperty: true,
      bpmnService: new BpmnService(),
      locale: {},
      selectedDatum: {},
      zoomValue: 1,
      pasteboardVisible: false,
      pasteboardValue: '',
      loaded: false,
      saveAsXml: true,
      canUndo: false,
      canRedo: false,
    };
  },
  mounted() {
    this.mtData = {
      nodes: [
        {
          name: '开始',
          type: 'bpmn:StartEvent',
          elementId: 'Event_1njvzvu',
          x: 192,
          y: 52,
          nodeId: '432d3464-aba2-5ad9-bf10-d80fa7ddf70a',
        },
        {
          name: '结束',
          type: 'bpmn:EndEvent',
          elementId: 'Event_15m75vo',
          x: 662,
          y: 92,
          nodeId: '3d708a89-7eea-6e38-31fe-7f152dc38371',
        },
        {
          name: '新步骤',
          type: 'bpmn:UserTask',
          elementId: 'Activity_1t6dcl0',
          x: 380,
          y: 40,
          nodeId: '4e0810a8-e402-d6ba-4d0e-fde2579c596d',
        },
      ],
      lines: [
        {
          type: 'bpmn:SequenceFlow',
          elementId: 'Flow_0gsygo7',
          waypoints: [
            {
              original: {
                x: 210,
                y: 70,
              },
              x: 228,
              y: 70,
            },
            {
              x: 304,
              y: 70,
            },
            {
              x: 304,
              y: 80,
            },
            {
              original: {
                x: 430,
                y: 80,
              },
              x: 380,
              y: 80,
            },
          ],
          lineId: 'ee5a66fa-8dd3-a4f1-3d11-562b4238d838',
          targetNodeId: '4e0810a8-e402-d6ba-4d0e-fde2579c596d',
          sourceNodeId: '432d3464-aba2-5ad9-bf10-d80fa7ddf70a',
        },
        {
          type: 'bpmn:SequenceFlow',
          elementId: 'Flow_0wqjuai',
          waypoints: [
            {
              original: {
                x: 430,
                y: 80,
              },
              x: 480,
              y: 80,
            },
            {
              x: 571,
              y: 80,
            },
            {
              x: 571,
              y: 110,
            },
            {
              original: {
                x: 680,
                y: 110,
              },
              x: 662,
              y: 110,
            },
          ],
          lineId: 'b73bd718-ec8c-838f-be07-9f56f709f334',
          targetNodeId: '3d708a89-7eea-6e38-31fe-7f152dc38371',
          sourceNodeId: '4e0810a8-e402-d6ba-4d0e-fde2579c596d',
        },
      ],
    };
    console.log('event-mounted');
    this.bpmnService.initModeler(this.$refs.bpmnCanvas);

    if (this.xml) {
      this.bpmnService.initByXml(this.xml);
    } else {
      this.bpmnService.initByData(this.mtData, () => {
        // this.onDone();
      });
    }
    this.saveAsXml = !!this.xml;
    this.loaded = true;
  },
  methods: {
    destroyed() {
      console.log('event-destroyed');
      this.bpmnService.bpmnModeler.destroy();
    },

    onPropertySubmit(value) {
      this.mtPropertySubmit(value);
    },

    onPropertyValuesChange(value) {
      this.mtPropertyValuesChange(value);
    },

    updateElement(element) {
      this.bpmnService.updateBizDatum(element);
    },

    create(type) {
      this.bpmnService.startCreate(type);
    },

    connect() {
      this.bpmnService.startConnect();
    },

    realignment() {
      this.bpmnService.realignment();
    },

    resetZoom() {
      this.bpmnService.fitViewport();
    },

    locate() {
      this.bpmnService.locate();
    },

    zoomChange(zoom) {
      console.log(zoom, this.bpmnService);
      this.bpmnService.zoomFit(zoom);
    },

    zoomIn() {
      this.bpmnService.zoomFit();
    },

    zoomOut() {
      this.bpmnService.zoomFit(true);
    },

    align(type) {
      this.bpmnService.align(type);
    },

    distribute(type) {
      this.bpmnService.distribute(type);
    },

    undo() {
      this.bpmnService.commandStack.undo();
    },

    redo() {
      this.bpmnService.commandStack.redo();
    },

    copyToClipboard() {
      this.bpmnService.copyToClipboard();
    },

    paste() {
      // 由于安全性限制，非安全站点无法直接操作剪贴板
      // 根据是否为 https 域名，选择是黏贴剪贴板还是弹出输入框要求用户主动黏贴
      if (window.location.protocol === 'https:') {
        this.bpmnService.pasteFromClipboard();
      } else {
        this.pasteboardValue = '';
      }
    },

    pasteboardVisibleChange(visible) {
      if (!visible) {
        this.bpmnService.pasteFromInput(this.pasteboardValue);
      } else {
        setTimeout(() => {
          const txt = document.querySelector('.bpmn_datum_popover textarea');
          if (txt) {
            txt.focus();
          }
        });
      }
    },

    save() {
      if (this.saveAsXml) {
        this.bpmnService.bpmnModeler.saveXML({ format: true }).then(result => {
          this.mtSave(result.xml);
          console.log('xml', result.xml);
        });
      } else {
        if (this.checkProcessData(this.bpmnService.analysisDatum())) {
          this.mtSave(this.bpmnService.analysisDatum());
          console.log('object', this.bpmnService.analysisDatum());
        }
      }
    },

    toggleProperty() {
      this.showProperty = !this.showProperty;
    },

    checkProcessData(saveData) {
      if (!saveData) {
        notificationHelper.error(this.locale.missData);
        return false;
      }
      if (!saveData.nodes || saveData.nodes.length === 0) {
        notificationHelper.error(this.locale.missNode);
        return false;
      }
      if (!saveData.lines || saveData.lines.length === 0) {
        notificationHelper.error(this.locale.missLine);
        return false;
      }
      if (saveData.nodes.findIndex(f => f.type === this.bpmnService.MtBpmnJsElement.Start) === -1) {
        notificationHelper.error(this.locale.missStart);
        return false;
      }
      if (saveData.nodes.findIndex(f => f.type === this.bpmnService.MtBpmnJsElement.End) === -1) {
        notificationHelper.error(this.locale.missEnd);
        return false;
      }
      let result = true;
      saveData.nodes.forEach(node => {
        if (node.type !== this.bpmnService.MtBpmnJsElement.End && node.type !== this.bpmnService.MtBpmnJsElement.Start) {
          if ((node.resolvers || []).length > 0 && node.resolvers.find(f => !f.value)) {
            notificationHelper.error(`${node.name}: ${this.locale.perfectNodePolicy}`);
            result = false;
            return false;
          }
          if (!node.name) {
            notificationHelper.error(this.locale.missNodeName);
            result = false;
            return false;
          }
        }
      });
      return result;
    },
  },
};
</script>

<style lang="less" scoped>
// @import '../../../node_modules/ant-design-vue/dist/antd.less';
@import '../../../node_modules/bpmn-js/dist/assets/diagram-js.css';
@import '../../../node_modules/bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

@tool-height: 46px;
@border-color: #e8e8e8;
@primary-color: #2165d9;
@card-head-height: 46px;
@base-size: 8px;
@border-color-base: #e8e8e8;
@text-hover: #3b7ae5;

// @bpmn-stroke-color: @primary-4;
// @bpmn-background-color: tint(@primary-4, 90%);

// @bpmn-stroke-color-muted: #9c9c9c;
// @bpmn-background-color-muted: tint(#9c9c9c, 90%);

// @bpmn-stroke-color-passed: #41ba42;
// @bpmn-background-color-passed: tint(#41ba42, 90%);

// @bpmn-stroke-color-passing: #f5b25e;
// @bpmn-background-color-passing: tint(#f5b25e, 90%);

// @bpmn-stroke-color-selected: @primary-5;
// @bpmn-background-color-selected: tint(@primary-5, 80%);

// @bpmn-shadow-color: #f1f1f1;

// bpmn-d3
.bpmn-container {
  //border: 1px solid @border-color-base;

  .bpmn-js-box {
    .djs-element .djs-visual,
    .djs-connection-preview {
      rect,
      circle,
      path {
       // stroke: @bpmn-stroke-color !important;
      }

      text {
       // fill: @bpmn-stroke-color !important;
      }
    }

    marker {
      path {
       // fill: @bpmn-stroke-color !important;
        //stroke: @bpmn-stroke-color !important;
      }
    }
  }
}

// .bpmn-handle {
//   background-color: @primary-1;
//   color: @text-color-secondary;

//   &:hover {
//     background-color: @primary-2;
//     color: @text-hover;
//   }
// }

.card {
  height: 100%;
  overflow: hidden;
  // :global(.ant-card-head) {
  //   background: white;
  // }

  :global(.ant-card-head) {
    padding: 0 10px;
    font-weight: bold;
    font-size: 12px;
    background: #fff;
  }

  :global(.ant-card-head-wrapper::before) {
    content: '';
    position: absolute;
    height: 20px;
    width: 4px;
    background-color: @primary-color;
    top: (@card-head-height - 20)/2;
    left: -@base-size * 2;
  }

  :global(.ant-card-body) {
    overflow: auto;
    height: 100%;
  }

  .no-result-tips {
    width: 445px;
    margin: 36px;
  }
}

.bpmn_js_box {
  position: relative;
  height: 100%;
  overflow: hidden;
}

:global(.bjs-powered-by),
:global(.djs-palette) {
  display: none;
}

:global(.bjs-container svg) {
  height: 100vh;
  // top: -@tool-height;
}

:global(.bpmn_datum_popover) {
  width: 480px;
}

:global(.bpmn_datum_popover .ant-popover-title) {
  display: flex;
  justify-content: flex-end;
}

.text_secondary {
  flex-grow: 1;
  line-height: 28px;
}

.icon_rotate {
  transform: rotate(90deg);
}

.bpmn_zoom_dropdown {
  // :global(.ant-slider) {
  width: 120px;
  // }

  :global(nz-slider-track) {
    display: none;
  }
}

.bpmn_operation_helper {
  position: absolute;
  left: 8px;
  bottom: 8px;
}

.bpmn_operations {
  width: 220px;
}

nz-layout,
nz-header,
nz-sider {
  background: white;
  position: relative;
}

nz-content {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
}

.bpmn_graph_container {
  height: calc(~'100%' - @tool-height);
}

nz-button-group {
  margin: 0 8px;
}

nz-divider {
  margin: 0;
}

.toolbar {
  width: 100%;
  height: @tool-height;
  line-height: @tool-height;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
  padding: 0;

  i {
    font-size: 14px;
  }

  &:not(.adding) {
    i {
      cursor: pointer;
    }
  }
}

nz-sider {
  border-left: 1px solid @border-color;
}

.bpmn_property {
  :global(.ant-card) {
    border-top: none;
    border-right: none;
    border-bottom: none;
    height: 100%;
  }
}

.bpmn_handle {
  position: absolute;
  cursor: pointer;
  right: 0;
  top: 50%;
  height: 48px;
  margin-top: -24px;
  border-top-left-radius: 75%;
  border-bottom-left-radius: 75%;
  display: flex;
  align-items: center;
}
:global(.read-only .djs-container:before) {
  content: '';
  position: absolute;
  height: 100%;
  width: 100%;
  display: block;
  // background: red;
  opacity: 0.5;
  top: 0;
  left: 0;
}
</style>
