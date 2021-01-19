import { Company } from '@/views/PlatForm/OrganizationManagement/Company';
import { Department } from '@/views/PlatForm/OrganizationManagement/Department';
import { Position } from '@/views/PlatForm/OrganizationManagement/Position';
import { User } from '@/views/PlatForm/OrganizationManagement/User';
import { RouteConfig } from 'vue-router';

export const OrganizationManagementRoutes: RouteConfig[] = [
  {
    path: 'company',
    component: Company
  },
  {
    path: 'department',
    component: Department
  },
  {
    path: 'position',
    component: Position
  },
  {
    path: 'users',
    component: User
  },
  { path: '', redirect: 'company' },
];
