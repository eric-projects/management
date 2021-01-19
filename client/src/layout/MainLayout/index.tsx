import { Component, Vue, Watch } from 'vue-property-decorator';
import { VNode } from 'vue';
import { from, Subscription } from 'rxjs';

import styles from './main-layout.module.less';
import { Authorization, Handover, Proxy } from '@/components';
import { authService } from '@/services/auth';
import { MenuItem, menuService, MenuViewState } from '@/services/menu';
import { commonService } from '@/services/common';
import { CustomIcon } from '@/components';
import { Settings } from '@/common/defines';

@Component({
  components: { Authorization, Handover, Proxy, CustomIcon },
})
export class MainLayout extends Vue {
  private selectedMenus = [''];
  private openedMenus = [''];
  private menus: MenuItem[] = [];
  private currentLanguage = authService.user.language;
  private collapsed = menuService.menuViewState === MenuViewState.Collapsed;
  private helperModal: VNode | undefined;
  private helperModalConfirming = false;
  private helperTitle = '';
  private helperDataHook: (() => void) | undefined;
  private modalWidth = 600;
  private menuBadgeObj: { [key: string]: number } = {};
  private totalSub!: Subscription;

  private onCollapse() {
    this.collapsed = !this.collapsed;
    menuService.switchMenuViewState(this.collapsed ? MenuViewState.Collapsed : MenuViewState.Expanded);
  }

  private onImpernateOut() {
    authService.impersonateout().subscribe(() => {
      location.reload();
    });
  }

  private openHelperModal(type: 'authorization' | 'handover' | 'proxy') {
    this.modalWidth = 600;
    switch (type) {
      case 'authorization':
        this.helperModal = this.$createElement('authorization');
        this.helperTitle = `${this.$t('framework.authorization')}`;
        this.modalWidth = 800;
        break;
      case 'handover':
        this.helperModal = this.$createElement('handover');
        this.helperTitle = `${this.$t('framework.handover')}`;
        break;
      case 'proxy':
        this.helperModal = this.$createElement('proxy');
        this.helperTitle = `${this.$t('framework.proxy')}`;
        break;
      default:
        break;
    }
    this.$forceUpdate();

    setTimeout(() => {
      if (this.helperModal !== undefined) {
        this.helperDataHook = (this.helperModal.componentInstance as any).getFormData;
      }
    });
  }

  private closeHelperModal() {
    this.helperModal = undefined;
    this.$forceUpdate();
  }

  private confirmHelperModal() {
    if (this.helperDataHook !== undefined) {
      this.helperModalConfirming = true;
      from(Promise.resolve(!this.helperDataHook ? {} : this.helperDataHook())).subscribe(
        () => {
          this.helperModalConfirming = false;
          this.helperModal = undefined;
          this.helperDataHook = undefined;
          this.$forceUpdate();
        },
        () => {
          this.helperModalConfirming = false;
        }
      );
    }
  }

  private mapperRoute(path: string) {
    if (path.startsWith('/start')) {
      return '/process-map';
    }

    return path;
  }

  private getMenus() {
    /* menuService.getAuthorizedMenus().subscribe(s => {
      (s || []).forEach((m: MenuGroup) => {
        this.menus[m.key] = m;
      });
    }); */

    this.menus.push({
      id: 'organization-management', icon: 'team', locales: '组织结构', route: '',
      children: [
        { id: 'company', locales: '公司管理', route: 'organization-management/company' },
        { id: 'department', locales: '部门管理', route: 'organization-management/department' },
        { id: 'position', locales: '岗位管理', route: 'organization-management/position' },
        { id: 'users', locales: '人员管理', route: 'organization-management/users' }
      ]
    });
    this.menus.push({
      id: 'common-roles', icon: 'user', locales: '标准角色', route: '',
      children: [
        { id: 'role', locales: '角色库', route: 'common-roles/role' },
        { id: 'common-role-user', locales: '按组织', route: 'common-roles/common-role-user' },
        { id: 'match-common-role', locales: '按角色', route: 'common-roles/match-common-role' }
      ]
    });
    this.menus.push({
      id: 'matrix-management', icon: 'switcher', locales: '矩阵管理', route: '',
      children: [
        { id: 'matrix', locales: '矩阵管理', route: 'matrix-management/matrix' },
        { id: 'dimension', locales: '维度管理', route: 'matrix-management/dimension' },
      ]
    });
    this.menus.push({
      id: 'tag-management', icon: 'tags', locales: '标签管理', route: '',
      children: [
        { id: 'tag', locales: '标签列表', route: 'tag-management/tag' }
      ]
    });
    this.menus.push({
      id: 'log-management', icon: 'file', locales: '日志中心', route: '',
      children: [
        { id: 'log', locales: '日志列表', route: 'log-management/log' }
      ]
    });
    this.menus.push({
      id: 'system-management', icon: 'setting', locales: '系统管理', route: '',
      children: [
        { id: 'menu', locales: '菜单管理', route: 'system-management/menu' },
        { id: 'rights', locales: '权限管理', route: 'system-management/rights' },
        { id: 'dictionary', locales: '数据字典', route: 'system-management/dictionary' },
        { id: 'init', locales: '初始化配置', route: 'system-management/init' },
        { id: 'gateway', locales: '网关管理', route: 'system-management/gateway' }
      ]
    });
    this.$forceUpdate();
  }

  @Watch('$route')
  onInstanceChange() {
    if (this.$route.matched.length > 1) {
      const currentMenu = this.$route.matched[1].path;
      this.selectedMenus = [this.mapperRoute(currentMenu)];
    } else {
      this.selectedMenus = [''];
    }
  }

  created() {
    this.getMenus();
    // this.onInstanceChange();
  }

  destroyed() {
    /* if (this.totalSub) {
      this.totalSub.unsubscribe();
    } */
  }

  render() {
    return (
      <a-layout class={styles.main}>
        <a-layout-header class={styles.header}>
          <div class={styles.logo}>
            <img src={commonService.logo} alt='logo' />
            <a-divider type='vertical' />
            <span>{this.$t('main-title.top-title')}</span>
          </div>
          <div class={styles.blank} />
          <div class={styles.actions}>
            <div class={authService.user.impersonatorId ? styles.impersonate_avatar + ' ant-btn' : styles.avatar}>
              <a-avatar icon={<custom-icon slot='icon' type='user' />} class='mr-1' />
              {authService.user.name}
            </div>
            <a-divider type='vertical' style='margin:0 16px' />
            <router-link to={'/logout'}>
              <a-button type='link' icon='logout'>
                {this.$t('boost.layout.logout')}
              </a-button>
            </router-link>
          </div>
          <a-modal
            title={this.helperTitle}
            width={this.modalWidth}
            visible={this.helperModal !== undefined}
            maskClosable={false}
            keyboard={false}
            on-ok={this.confirmHelperModal}
            confirmLoading={this.helperModalConfirming}
            on-cancel={this.closeHelperModal}
          >
            {this.helperModal !== undefined ? this.helperModal : ''}
          </a-modal>
        </a-layout-header>
        <a-layout>
          <a-layout-sider
            class={styles.menu_container}
            width={Settings.MenuExpandedWidth}
            collapsedWidth={Settings.MenuCollapsedWidth}
          >
            <a-menu
              mode='inline'
              theme='dark'
              class={styles.menu + (this.collapsed ? ` ${styles.collapsed}` : '')}
              default-selected-keys={['company']}
              default-open-keys={['organization-management']}
            >
              { this.menus.map(item => (
               <a-sub-menu key={item.id}>
               <span slot='title'><a-icon type={item.icon} />{item.locales}</span>
                { (item['children'] as MenuItem[]).map(child => (
                    <a-menu-item key={child.id}>
                    <router-link to={'/' + child.route}>
                      <span>{child.locales}</span>
                    </router-link>
                  </a-menu-item>
                  ))}
              </a-sub-menu>
              ))
              }
            </a-menu>
          </a-layout-sider>
          <a-layout-content>
            <a-layout>
              <a-layout-content class={styles.content_container + ' bg-content'}>
                <div class={styles.content + ' bg-white'}>
                  <router-view />
                </div>
              </a-layout-content>
            </a-layout>
          </a-layout-content>
        </a-layout>
      </a-layout>
    );
  }
}
