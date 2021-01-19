/**
 * 菜单项
 */
export interface MenuItem {
  id: string;
  // locales: { [key: string]: string };
  locales: string;
  children?: MenuItem[];
  isOpen?: boolean;
  icon?: string;
  route: string;
  hidden?: boolean;
  // actionIds: string[];
}

/**
 * 面包屑项
 */
export interface BreadcrumbItem {
  link: string;
  locales: { [key: string]: string };
}

/**
 * 菜单视图状态
 */
export enum MenuViewState {
  /**
   * 展开的
   */
  Expanded = 'expanded',
  /**
   * 收起的
   */
  Collapsed = 'collapsed',
}
