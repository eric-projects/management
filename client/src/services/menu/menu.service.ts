import { Observable, BehaviorSubject, of } from 'rxjs';

import { httpHelper } from '@/common/utils';
import { Settings } from '@/common/defines';
import { Featrue } from '../auth';
import { MenuViewState } from './menu.types';

class MenuService {
  /* private menus: MenuGroup[] = [];
  private authorizedMenus: MenuGroup[] = []; */
  private defaultPage = '';
  private menuViewStateSource: BehaviorSubject<MenuViewState>;

  menuViewState$: Observable<MenuViewState>;

  /**
   * 菜单状态
   */
  get menuViewState(): MenuViewState {
    const cachedState = localStorage.getItem(Settings.UserMenuViewStateCacheKey);
    return cachedState === 'collapsed' || (!cachedState && document.body.clientWidth <= Settings.ScreenBoundary)
      ? MenuViewState.Collapsed
      : MenuViewState.Expanded;
  }

  constructor() {
    // 初始化菜单显示状态
    this.menuViewStateSource = new BehaviorSubject<MenuViewState>(this.menuViewState);
    this.menuViewState$ = this.menuViewStateSource.asObservable();
  }

  /**
   * 切换菜单伸缩状态
   * @param menuViewState 菜单伸缩状态
   */
  switchMenuViewState(menuViewState: MenuViewState) {
    localStorage.setItem(Settings.UserMenuViewStateCacheKey, menuViewState);
    this.menuViewStateSource.next(menuViewState);
  }

  updateAuthorization(features: Featrue[] | undefined) {
    /* if (features) {
      if (this.authorizedMenus.length > 0) {
        this.defaultPage = this.authorizedMenus[0].children[0].route;
      }
    } else {
      this.authorizedMenus = [];
      this.defaultPage = '';
    } */
    this.defaultPage = '';
  }

  getAuthorizedMenus(): Observable<any> {
    /* const url = `/api/platform/v1/${Settings.AppKey}/menus`;
    const menus: MenuGroup[] = [];
    return httpHelper.get(url).pipe(
      map(m => {
        if (m && m.length > 0) {
          m.forEach((first: any) => {
            if ((first.children || []).length > 0) {
              first.children.forEach((second: any) => {
                menus.push({ key: `${first.path}${second.path}`, name: second.name, icon: second.icon, children: [] });
              });
            }
          });
        }

        this.authorizedMenus = menus;
        return menus;
      })
    ); */
    return of([]);
  }

  getDefaultPage(): string {
    if (this.defaultPage) {
      return this.defaultPage;
    }

    return '/401';
  }

  getCurrentPageKeys(path: string): string[] {
    /*     const menuGroup = this.authorizedMenus.find(m => m.children.some(c => c.route === path));

    if (menuGroup) {
      const page = menuGroup.children.find(c => c.route === path);
      if (page) {
        return [menuGroup.key, page.key];
      }
    } */

    return ['', ''];
  }

  getBreadcrumbs(path: string): string[] {
    const breadcrumbs: string[] = [];
    // 筛选页面
    /*     const menuGroup = this.authorizedMenus.find(m => m.children.some(c => c.route === path));

    if (menuGroup) {
      const page = menuGroup.children.find(c => c.route === path);
      if (page) {
        breadcrumbs.push(menuGroup.name);
        breadcrumbs.push(page.name);
      }
    } */

    return breadcrumbs;
  }

  getMenuNumbers(): Observable<any> {
    const url = '/api/platform/v1/my-workspace/menu-numbers';
    return httpHelper.get(url, {});
  }
}

export const menuService = new MenuService();
