import { ProjectList } from '@/views/PlatForm/Projects';
import { RouteConfig } from 'vue-router';

export const PlatFormRoutes: RouteConfig[] = [
  {
    path: 'projects',
    component: ProjectList,
  },
  { path: '', redirect: 'projects' },
];
