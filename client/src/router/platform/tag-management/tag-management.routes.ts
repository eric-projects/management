import { TagList } from '@/views/PlatForm/TagManagement/TagList';
import { RouteConfig } from 'vue-router';

export const TagManagementRoutes: RouteConfig[] = [
  {
    path: 'tag',
    component: TagList
  }
];
