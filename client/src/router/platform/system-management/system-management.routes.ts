import { DictionaryManagement } from '@/views/PlatForm/SystemManagement/Dictionary';
import { GatewayManagement } from '@/views/PlatForm/SystemManagement/Gateway';
import { InitManagement } from '@/views/PlatForm/SystemManagement/Init';
import { MenuManagement } from '@/views/PlatForm/SystemManagement/Menu';
import { RightsManagement } from '@/views/PlatForm/SystemManagement/Rights';
import { RouteConfig } from 'vue-router';

export const SystemManagementRoutes: RouteConfig[] = [
  {
    path: 'menu',
    component: MenuManagement
  },
  {
    path: 'rights',
    component: RightsManagement
  },
  {
    path: 'dictionary',
    component: DictionaryManagement
  },
  {
    path: 'init',
    component: InitManagement
  },
  {
    path: 'gateway',
    component: GatewayManagement
  }
];
