import { Observable, of, Subject } from 'rxjs';
import BpmnViewer from 'bpmn-js/lib/Viewer.js';
import BpmnModeler from 'bpmn-js/lib/Modeler.js';
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider.js';
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider.js';
import AlignToOrigin from '@bpmn-io/align-to-origin/lib/align-to-origin.js';
import { guidHelper } from '@/common/utils';

export default class BpmnService {
  MtBpmnJsElement = {
    Process: 'bpmn:Process',
    Start: 'bpmn:StartEvent',
    End: 'bpmn:EndEvent',
    SequenceFlow: 'bpmn:SequenceFlow',
    UserTask: 'bpmn:UserTask',
  };

  DataStruct = {};

  _selectedSource = new Subject();
  _zoomSource = new Subject();
  _commandStackSource = new Subject();
  _bpmnViewer = new BpmnViewer();
  _bpmnModeler = new BpmnModeler({
    alignToOrigin: { tolerance: 24 },
    additionalModules: [AlignToOrigin],
    keyboard: { bindTo: window },
  });
  _bpmnFactory;
  _elementFactory;
  _elementRegistry;
  _eventBus;
  _globalConnect;
  _modeling;
  _create;
  _commandStack;
  _alignToOrigin;
  _distributeElements;
  _alignElements;
  _canvas;
  _zoom;
  _removeFlag;
  _currentSelection;
  _realignmentOffsetGap = { x: 200, y: 200 };
  _eventDefaultSize = { width: 36, height: 36 };
  _taskDefaultSize = { width: 100, height: 80 };
  _copyPasteCache = {};

  get bpmnModeler() {
    return this._bpmnModeler;
  }
  get bpmnFactory() {
    return this._bpmnFactory;
  }
  get elementFactory() {
    return this._elementFactory;
  }
  get elementRegistry() {
    return this._elementRegistry;
  }
  get eventBus() {
    return this._eventBus;
  }
  get globalConnect() {
    return this._globalConnect;
  }
  get modeling() {
    return this._modeling;
  }
  get create() {
    return this._create;
  }
  get commandStack() {
    return this._commandStack;
  }
  get alignToOrigin() {
    return this._alignToOrigin;
  }
  get canvas() {
    return this._canvas;
  }

  selected$ = this._selectedSource.asObservable();
  zoom$ = this._zoomSource.asObservable();
  commandStack$ = this._commandStackSource.asObservable();

  /**
   * 初始化：编辑模式不切换，只读模式切换一次
   * onChanges：分离另一个模式，挂载当前模式
   * @param el 挂载的元素
   * @param toViewer 切换至只读模式
   * @param init 是否初始化
   */
  switch(el, toViewer, init = false) {
    const bpmn = toViewer ? this._bpmnViewer : this._bpmnModeler;
    const prev = toViewer ? this._bpmnModeler : this._bpmnViewer;
    if ((init && toViewer) || !init) {
      prev.saveXML().then(result => {
        prev.detach();
        bpmn.attachTo(el);
        bpmn.importXML(result.xml);
      });
    }
  }

  initModeler(el) {
    this._bpmnModeler.attachTo(el);
    this._bpmnFactory = this._bpmnModeler.get('bpmnFactory');
    this._elementFactory = this._bpmnModeler.get('elementFactory');
    this._elementRegistry = this._bpmnModeler.get('elementRegistry');
    this._eventBus = this._bpmnModeler.get('eventBus');
    this._globalConnect = this._bpmnModeler.get('globalConnect');
    this._modeling = this._bpmnModeler.get('modeling');
    this._create = this._bpmnModeler.get('create');
    this._commandStack = this._bpmnModeler.get('commandStack');
    // this._alignToOrigin = this._bpmnModeler.get('alignToOrigin');
    this._distributeElements = this._bpmnModeler.get('distributeElements');
    this._alignElements = this._bpmnModeler.get('alignElements');

    this._eventBus.on(['commandStack.changed'], evt => {
      this._commandStackSource.next(evt);
    });

    this._eventBus.on('element.changed', evt => {
      // Label 忽略处理，绘制时自动计算位置
      if (evt.element.type === 'label' || !evt.element.parent) {
        return;
      }

      // 为元素更新业务数据
      const ext =
        evt.element.type === this.MtBpmnJsElement.SequenceFlow
          ? { waypoints: evt.element.waypoints }
          : { x: evt.element.x, y: evt.element.y };
      const datum = this.getBizDatum(evt.element.businessObject, ext);

      // 对复制后的元素添加原业务对象
      if (datum.elementId && this._copyPasteCache[datum.elementId]) {
        const originElementId = this._copyPasteCache[datum.elementId];
        delete this._copyPasteCache[datum.elementId];
        const originElement = this._elementRegistry.get(originElementId);
        const orginDatum = this.getBizDatum(originElement.businessObject, datum);
        Object.assign(datum, orginDatum);
      }

      this.updateBizDatumAttr(evt.element.businessObject, datum);
    });

    // 元素选中事件
    this._eventBus.on('selection.changed', evt => {
      this._currentSelection = evt.newSelection;
      if (evt.newSelection.length > 1) {
        return;
      }
      const sel = evt.newSelection[0];
      const datum = this.getBizDatum(sel ? sel.businessObject : null);
      this._selectedSource.next({ type: datum.type, value: datum });
    });

    // 对复制行为添加缓存以便后续逻辑处理，确保业务属性不丢失
    this._eventBus.on('copyPaste.pasteElement', evt => {
      this._copyPasteCache[evt.descriptor.businessObject.id] = evt.descriptor.id;
    });
  }

  initByXml(xml) {
    this._bpmnModeler.importXML(xml).then(() => {
      this._canvas = this._bpmnModeler.get('canvas');
      this.locate();
      this._commandStack.clear();
    });
  }

  initByData(data, done) {
    if (!data) {
      return;
    }

    if (!this._canvas) {
      this._bpmnModeler.createDiagram();
      this._canvas = this._bpmnModeler.get('canvas');
    }

    setTimeout(() => {
      try {
        const root = this._canvas.getRootElement();
        this.removeAll(root, () => {
          (data.nodes || []).forEach(node => this.createShape(node.type, node, root));
          (data.lines || []).forEach(line => this.createConnect(line, data.nodes, root));
          this.locate();
          this._commandStack.clear();
          if (done && data.nodes) {
            done();
          }
        });
      } catch (error) {
        done();
      }
    });
  }

  analysisDatum() {
    return {
      nodes: this._elementRegistry
        .filter(
          el => el.type === this.MtBpmnJsElement.Start || el.type === this.MtBpmnJsElement.End || el.type === this.MtBpmnJsElement.UserTask
        )
        .map(el => {
          const datum = this.getBizDatum(el.businessObject, { x: el.x, y: el.y });
          this.updateBizDatumAttr(el.businessObject, datum);
          return datum;
        }),
      lines: this._elementRegistry
        .filter(el => el.type === this.MtBpmnJsElement.SequenceFlow)
        .map(e => {
          const datum = this.getBizDatum(el.businessObject, { waypoints: el.waypoints });
          this.updateBizDatumAttr(el.businessObject, datum);
          return datum;
        }),
    };
  }

  startCreate(type) {
    debugger;
    const bo = { id: guidHelper.generate(), name: this.getName(type) };
    this._create.start(this.createMoveEvent(0, 0), this.createShapeElement(type, bo));
  }

  startConnect() {
    this._globalConnect.start(this.createMoveEvent(0, 0));
  }

  fitViewport() {
    this._zoom = this._canvas.zoom('fit-viewport');
    this.zoomFit(Math.floor(this._zoom * 10) / 10);
    const { clientWidth, clientHeight } = document.querySelector('.bpmn-js-box');
    const viewbox = this._canvas.viewbox();
    this._canvas.viewbox({
      x: 130,
      y: (clientHeight - clientHeight / this._zoom) / 2 + 5,
      width: viewbox.width,
      height: viewbox.height,
    });
  }

  locate() {
    // this._alignToOrigin.align();
    this.zoomFit(1);
    const viewbox = this._canvas.viewbox();
    this._canvas.viewbox({ x: 130, y: 5, width: viewbox.width, height: viewbox.height });
  }

  zoomFit(out = false) {
    if (typeof out === 'number') {
      this._zoom = out;
    } else {
      this._zoom = out ? this._zoom - 0.1 : this._zoom + 0.1;
    }
    this._canvas.zoom(this._zoom);
    this._zoomSource.next(this._zoom);
  }

  align(type) {
    this._alignElements.trigger(this._currentSelection, type);
  }

  distribute(type) {
    this._distributeElements.trigger(this._currentSelection, type);
  }

  getBizDatum(businessObject, ext) {
    const datum = {};
    if (businessObject) {
      if (businessObject.$attrs.datum) {
        Object.assign(datum, JSON.parse(businessObject.$attrs.datum || '{}'));
      } else {
        Object.assign(datum, {
          id: guidHelper.generate(),
        });
      }
      Object.assign(datum, {
        type: businessObject.$type,
        name: businessObject.name,
        elementId: businessObject.id,
      });
    }
    if (datum.type === this.MtBpmnJsElement.SequenceFlow) {
      Object.assign(datum, {
        sourceId: this.getBizDatum(businessObject.sourceRef).id,
        targetId: this.getBizDatum(businessObject.targetRef).id,
      });
    }
    if (ext) {
      Object.assign(datum, ext);
    }
    if (!datum.type) {
      datum.type = this.MtBpmnJsElement.Process;
    }
    return datum;
  }

  updateBizDatumAttr(businessObject, datum) {
    businessObject.$attrs.datum = JSON.stringify(datum);
  }

  updateBizDatum(datum) {
    let element;
    if (datum.value.elementId) {
      element = this._elementRegistry.get(datum.value.elementId);
    } else {
      element = this._elementRegistry.find(e => this.getBizDatum(e.businessObject).id === datum.value.id);
      datum.value.elementId = element.id;
    }
    // 通过 updateProperties 更新名称
    if (datum.value.name !== element.businessObject.name) {
      this._modeling.updateProperties(element, { name: datum.value.name });
    }
    // 直接更新 datum，以免压入命令堆栈（压入堆栈后会触发撤销）
    this.updateBizDatumAttr(element.businessObject, datum.value);
  }

  copyToClipboard() {
    // const datum = this.analysisDatum();
    // // const copySuccess = clipboard.copy(JSON.stringify(datum));
    // clipboard(JSON.stringify(datum) as string)
    //   .then(() => {
    //     notificationHelper.info(this._locale.messages.copySuccess);
    //   })
    //   .catch(() => {
    //     console.error('复制失败！');
    //   });
  }

  pasteFromClipboard() {
    window.navigator.clipboard.readText().then(this.rebuildDatum);
  }

  pasteFromInput(json) {
    this.rebuildDatum(json);
  }

  realignment(alignment = AlignmentType.Horizontal) {
    const datum = this.analysisDatum();
    const startNode = (datum.nodes || []).find(n => n.type === this.MtBpmnJsElement.Start);
    if (!startNode) {
      // notificationHelper.error('this._locale.messages.noStart');
      // this.message.error(this._locale.messages.noStart);
      return;
    }
    const familyTree = [{ generation: 1, nodes: [startNode] }];
    this.resetCoordinates(datum, familyTree, { lastGeneration: 1, lastNode: startNode }, alignment);
    this.correctNodeFamilyTree(datum, familyTree, alignment);
    this.initByData(datum, null);
  }

  rebuildDatum(json) {
    if (!json) {
      return;
    }

    try {
      const datum = JSON.parse(json);
      (datum.nodes || []).forEach(node => {
        const id = guidHelper.generate();
        (datum.lines || []).forEach(l => {
          if (l.sourceId === node.id) {
            l.sourceId = id;
          }
          if (l.targetId === node.id) {
            l.targetId = id;
          }
          l.id = guidHelper.generate();
        });
        node.id = id;
      });
      this.initByData(datum, null);
      // notificationHelper.success('this._locale.messages.pasteSuccess');
      // this.message.success(this._locale.messages.pasteSuccess);
    } catch (error) {
      // failed
      console.error('黏贴失败，内容格式错误');
    }
  }

  removeAll(parent, callback) {
    if (parent.children && parent.children.length > 0) {
      this._modeling.removeElements(parent.children);
      this._removeFlag = setTimeout(() => {
        this.removeAll(parent, callback);
      });
    } else {
      if (this._removeFlag) {
        clearTimeout(undefined);
      }
      callback();
    }
  }

  getName(type) {
    switch (type) {
      case this.MtBpmnJsElement.Start:
        return '开始';
      case this.MtBpmnJsElement.End:
        return '结束';
      case this.MtBpmnJsElement.UserTask:
        return '新步骤';
      default:
        return '';
    }
  }

  createBusinessObject(type, businessObject) {
    const bo = { name: businessObject.name, datum: JSON.stringify(businessObject) };
    if (businessObject.elementId) {
      bo.id = businessObject.elementId;
    }
    const result = this._bpmnFactory.create(type, bo);
    if (!businessObject.elementId) {
      businessObject.elementId = result.id;
    }
    return result;
  }

  createShapeElement(type, businessObject) {
    debugger;
    const bo = this.createBusinessObject(type, businessObject);
    return this._elementFactory.createShape({ type: type, businessObject: bo });
  }

  createShape(type, businessObject, parent) {
    debugger;
    const d = new Date();
    const startD = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    const shape = this.createShapeElement(type, businessObject);
    const isEvent = type === this.MtBpmnJsElement.Start || type === this.MtBpmnJsElement.End;
    const offsetX = isEvent ? this._eventDefaultSize.width / 2 : this._taskDefaultSize.width / 2;
    const offsetY = isEvent ? this._eventDefaultSize.height / 2 : this._taskDefaultSize.height / 2;
    const position = { x: businessObject.x + offsetX, y: businessObject.y + offsetY };
    this._modeling.createShape(shape, position, parent);
    const d1 = new Date();
    const endD = `${d1.getHours()}:${d1.getMinutes()}:${d1.getSeconds()}`;
    console.log(`nodes=> ${startD}_${endD}`);
  }

  createConnect(businessObject, nodes, parent) {
    const d = new Date();
    const startD = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    const sourceNode = nodes.find(n => n.id === businessObject.sourceId);
    const targetNode = nodes.find(n => n.id === businessObject.targetId);
    if (sourceNode && targetNode) {
      if (!businessObject.type) {
        businessObject.type = this.MtBpmnJsElement.SequenceFlow;
      }
      const bo = this.createBusinessObject(this.MtBpmnJsElement.SequenceFlow, businessObject);
      const attrs = { type: this.MtBpmnJsElement.SequenceFlow, waypoints: undefined, businessObject: bo };
      if (businessObject.waypoints) {
        attrs.waypoints = businessObject.waypoints;
      }
      this._modeling.createConnection(
        this._elementRegistry.get(sourceNode.elementId),
        this._elementRegistry.get(targetNode.elementId),
        attrs,
        parent
      );
    }

    const d1 = new Date();
    const endD = `${d1.getHours()}:${d1.getMinutes()}:${d1.getSeconds()}`;
    console.log(`lines=> ${startD}_${endD}`);
  }

  /**
   * 算法来自组件库 MT.Enterprise.BPM.Reactor
   */
  resetCoordinates(datum, familyTree, sourceNode, alignment) {
    const throughLines = (datum.lines || []).filter(l => l.sourceId === sourceNode.lastNode.id);
    const nodes = (datum.nodes || []).filter(n => throughLines.some(l => l.targetId === n.id));
    const currentGeneration = sourceNode.lastGeneration + 1;
    const family = familyTree.find(f => f.generation === currentGeneration);
    if (family) {
      family.nodes.push(...nodes);
    } else {
      familyTree.push({
        generation: currentGeneration,
        nodes: nodes,
      });
    }

    // 基础偏移量
    // 为同一代节点增加间距，如果是水平则增加一个 X 间距，如果是垂直则增加一个 Y 间距
    let offsetXCache = (sourceNode.lastNode.x || 0) + (alignment === AlignmentType.Horizontal ? this._realignmentOffsetGap.x : 0);
    let offsetYCache = (sourceNode.lastNode.y || 0) + (alignment === AlignmentType.Vertical ? this._realignmentOffsetGap.y : 0);
    nodes.forEach(node => {
      node.x = offsetXCache;
      node.y = offsetYCache;
      this.resetCoordinates(datum, familyTree, { lastGeneration: currentGeneration, lastNode: node }, alignment);

      if (alignment === AlignmentType.Horizontal) {
        offsetYCache += this._realignmentOffsetGap.y;
      } else {
        offsetXCache += this._realignmentOffsetGap.x;
      }
    });

    // 如果后续的节点数量大于 1（即出现了分支），则将上一代节点整体下移（H）或右移（V）
    // 修正上一代节点偏移量需要在递归之后执行，否则下一代依然会获得上一代偏移量的新值
    if (nodes.length > 1) {
      const globalOffset =
        ((nodes.length - 1) * (alignment === AlignmentType.Horizontal ? this._realignmentOffsetGap.y : this._realignmentOffsetGap.x)) / 2;
      familyTree
        .filter(f => f.generation < currentGeneration)
        .forEach(f => {
          f.nodes.forEach(node => {
            if (alignment === AlignmentType.Horizontal) {
              node.y = node.y || 0;
              node.y += globalOffset;
            } else {
              node.x = node.x || 0;
              node.x += globalOffset;
            }
          });
        });
    }
  }

  correctNodeFamilyTree(datum, familyTree, alignment, startingGeneration = 1) {
    for (let i = startingGeneration; i < familyTree.length; i++) {
      const family = familyTree.find(f => f.generation === i);
      const nextFamily = familyTree.find(f => f.generation === i + 1);
      const wrongPositionNodes = (family ? family.nodes : []).filter(node => {
        const targetLines = (datum.lines || []).filter(l => l.targetId === node.id);
        if (!targetLines || targetLines.length < 1) {
          return false;
        }
        const lastGenerationNodes = (nextFamily ? nextFamily.nodes : []).filter(next => targetLines.some(l => l.sourceId === next.id));
        return lastGenerationNodes && lastGenerationNodes.length > 0;
      });

      // 找出当前一代中是下一单目标的节点，将这些节点下移一代
      if (wrongPositionNodes && wrongPositionNodes.length > 0) {
        if (alignment === AlignmentType.Horizontal) {
          wrongPositionNodes.forEach(node => (node.x += this._realignmentOffsetGap.x));
        } else {
          wrongPositionNodes.forEach(node => (node.y += this._realignmentOffsetGap.y));
        }
        wrongPositionNodes.forEach(node => {
          if (alignment === AlignmentType.Horizontal) {
            node.x += this._realignmentOffsetGap.x;
          } else {
            node.y += this._realignmentOffsetGap.y;
          }
          const index = (family ? family.nodes : []).findIndex(n => n.id === node.id);
          if (index >= 0) {
            (family ? family.nodes : []).splice(index, 1);
          }
          (nextFamily ? nextFamily.nodes : []).push(node);
        });
        this.correctNodeFamilyTree(datum, familyTree, alignment, i);
        break;
      }
    }
  }

  refactorModules(locale) {
    const _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
    PaletteProvider.prototype.getPaletteEntries = function() {
      const entries = _getPaletteEntries.apply(this);
      [
        'hand-tool',
        'create.intermediate-event',
        'create.exclusive-gateway',
        'create.data-object',
        'create.data-store',
        'create.subprocess-expanded',
        'create.participant-expanded',
        'create.group',
      ].forEach(item => delete entries[item]);
      return entries;
    };
    const _getContextPadEntries = ContextPadProvider.prototype.getContextPadEntries;
    ContextPadProvider.prototype.getContextPadEntries = function(element) {
      const entries = _getContextPadEntries.apply(this, [element]);
      [
        'append.gateway',
        'append.intermediate-event',
        'append.end-event',
        'append.append-task',
        'append.text-annotation',
        'replace',
        'connect',
      ].forEach(item => delete entries[item]);
      ['delete'].forEach(item => {
        if (entries[item]) {
          entries[item].title = item; // locale[item];
        }
      });
      return entries;
    };
  }

  createMoveEvent(x, y) {
    const event = document.createEvent('MouseEvent');

    const screenX = x;
    const screenY = y;
    const clientX = x;
    const clientY = y;

    if (event.initMouseEvent) {
      event.initMouseEvent('mousemove', true, true, window, 0, screenX, screenY, clientX, clientY, false, false, false, false, 0, null);
    }

    return event;
  }
}
