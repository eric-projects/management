import Vue from 'vue';
import Router from 'vue-router';
import { routerGuard } from '@/common/utils';
import { MainLayout } from '@/layout/MainLayout';
import { EmptyLayout } from '@/layout/EmptyLayout';
import { Login } from '@/views/Login';
import { UnAuthorized } from '@/views/401';
import { PlatFormRoutes } from './platform/platform.routes';
import { CompRich } from '@/components';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: PlatFormRoutes,
      beforeEnter: routerGuard,
    },
    {
      path: '/rich',
      component: CompRich,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/logout',
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
