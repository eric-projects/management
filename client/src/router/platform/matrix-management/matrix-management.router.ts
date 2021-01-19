import { Dimension } from '@/views/PlatForm/MatrixManagement/Dimension';
import { Matrix } from '@/views/PlatForm/MatrixManagement/Matrix';
import { RouteConfig } from 'vue-router';

export const MatrixManagementRoutes: RouteConfig[] = [
  {
    path: 'matrix',
    component: Matrix
  },
  {
    path: 'dimension',
    component: Dimension
  }
];
