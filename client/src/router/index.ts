import Vue from 'vue';
import Router from 'vue-router';
import { routerGuard, routerLogoutGuard, routerLoginGuard } from '@/common/utils';
import { MainLayout } from '@/layout/MainLayout';
import { EmptyLayout } from '@/layout/EmptyLayout';
import { Login } from '@/views/Login';
import { UnAuthorized } from '@/views/401';
import { PlatFormRoutes } from './platform/platform.routes';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: PlatFormRoutes,
      beforeEnter: routerGuard
    },
    {
      path: '/login',
      beforeEnter: routerLoginGuard,
      component: Login,
    },
    {
      path: '/logout',
      beforeEnter: routerLogoutGuard,
    },
    {
      path: '/401',
      component: UnAuthorized,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
