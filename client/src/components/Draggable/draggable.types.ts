export interface DraggableItem extends DraggableItemInfo {
  config?: DraggableItemConfig;
  children?: DraggableItem[];
  parent?: DraggableItem;
}

export interface DraggableItemInfo {
  name: string;
  key?: string;
  type?: DraggableTypeEnum;
  container?: number;
}

export interface DraggableItemConfig {
  name: string;
}

export enum TerminalTypeEnum {
  /**
   * 大屏浏览器
   */
  pc = 'p',
  /**
   * 移动端
   */
  mobile = 'mobile',
  /**
   * 小程序
   */
  mini = 'mini',
}

export enum DraggableTypeEnum {
  /**
   * 输入框
   */
  Input = 'input',

  /**
   * 按钮
   */
  Button = 'button',

  /**
   * 图标
   */
  Icon = 'icon',

  /**
   * 标签页
   */
  Tabs = 'tabs',

  /**
   * 折叠面板
   */
  Collapse = 'collapse',

  /**
   * 一行一列
   */
  OneGrid = 'one-grid',

  /**
   * 一行两列
   */
  TwoGrid = 'two-grid',
}

export enum DraggableContainerTypeEnum {
  /**
   * 非容器
   */
  None = 'none',

  /**
   * 一个占位
   */
  OneSeat = 'one',

  /**
   * 二个占位
   */
  TwoSeat = 'two',

  /**
   * 多个占位
   */
  MoreSeat = 'more',
}
