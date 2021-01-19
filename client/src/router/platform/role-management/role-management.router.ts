import { CommonRole } from '@/views/PlatForm/RoleManagement/CommonRole';
import { MatchCommonRole } from '@/views/PlatForm/RoleManagement/MatchCommonRole';
import { Role } from '@/views/PlatForm/RoleManagement/Role';
import { RouteConfig } from 'vue-router';

export const RoleManagementRoutes: RouteConfig[] = [
  {
    path: 'role',
    component: Role
  },
  {
    path: 'common-role-user',
    component: CommonRole
  },
  {
    path: 'match-common-role',
    component: MatchCommonRole
  }
];
