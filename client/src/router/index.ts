import Vue from 'vue';
import Router from 'vue-router';
import { routerGuard } from '@/common/utils';
import { MainLayout } from '@/layout/MainLayout';
import { Login } from '@/views/Login';
import { UnAuthorized } from '@/views/401';
import { PlatFormRoutes } from './platform/platform.routes';
import { RichView } from '@/views/Rich';
import { DesignerView } from '@/views/Designer';

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
      path: '/matrix-management/',
      component: MainLayout,
      children: [{ path: 'bpmn', component: () => import('@/views/Matrix/bpmn.vue') }],
    },
    {
      path: '/release-management/',
      component: MainLayout,
      children: [{ path: 'dockerfile', component: () => import('@/views/PublishManager/docker-file.vue') }],
    },
    {
      path: '/ticket-management/',
      component: MainLayout,
      children: [
        { path: 'news', component: () => import('@/views/GTicket/ticket-news.vue') },
        { path: 'pond', component: () => import('@/views/GTicket/ticket-pond.vue') },
        { path: 'rank', component: () => import('@/views/GTicket/ticket-rank.vue') },
        { path: 'rise', component: () => import('@/views/GTicket/ticket-rise.vue') },
        { path: 'machine', component: () => import('@/views/GTicket/ticket-machine.vue') },
        { path: 'calculation', component: () => import('@/views/GTicket/ticket-calculation.vue') },
        { path: 'ticket-value-investing', component: () => import('@/views/GTicket/ticket-value-investing.vue') },
      ],
    },
    {
      path: '/tool-management/',
      component: MainLayout,
      children: [{ path: 'common', component: () => import('@/views/Tools/common-tool.vue') }],
    },
    {
      path: '/rich/:id',
      component: RichView,
    },
    {
      path: '/designer',
      component: DesignerView,
    },
    {
      path: '/kchart',
      component: () => import('@/components/CompTicketChart/KChart.vue'),
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
