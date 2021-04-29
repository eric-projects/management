import Vue from 'vue';
import Router from 'vue-router';
import { routerGuard } from '@/common/utils';
import { MainLayout } from '@/layout/MainLayout';
import { Login } from '@/views/Login';
import { UnAuthorized } from '@/views/401';
import { PlatFormRoutes } from './platform/platform.routes';
import { RichView } from '@/views/Rich';

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
      path: '/rich/:id',
      component: RichView,
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
