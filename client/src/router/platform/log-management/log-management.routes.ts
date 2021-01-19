import { Logs } from '@/views/PlatForm/LogManagement/Logs';
import { RouteConfig } from 'vue-router';

export const LogManagementRoutes: RouteConfig[] = [
  {
    path: 'log',
    component: Logs
  }
];
