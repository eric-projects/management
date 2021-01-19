
import PlatForm from '@/views/PlatForm';
import { RouteConfig } from 'vue-router';
import { LogManagementRoutes } from './log-management/log-management.routes';
import { MatrixManagementRoutes } from './matrix-management/matrix-management.router';
import { OrganizationManagementRoutes } from './organization-management/organization-management.router';
import { RoleManagementRoutes } from './role-management/role-management.router';
import { SystemManagementRoutes } from './system-management/system-management.routes';
import { TagManagementRoutes } from './tag-management/tag-management.routes';

export const PlatFormRoutes: RouteConfig[] = [
  {
    path: 'organization-management',
    component: PlatForm,
    children: OrganizationManagementRoutes
  },
  {
    path: 'common-roles',
    component: PlatForm,
    children: RoleManagementRoutes
  },
  {
    path: 'matrix-management',
    component: PlatForm,
    children: MatrixManagementRoutes
  },
  {
    path: 'tag-management',
    component: PlatForm,
    children: TagManagementRoutes
  },
  {
    path: 'log-management',
    component: PlatForm,
    children: LogManagementRoutes
  },
  {
    path: 'system-management',
    component: PlatForm,
    children: SystemManagementRoutes
  },
  { path: '', redirect: 'organization-management' },
];
