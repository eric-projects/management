import Koa from 'koa';
import Router from 'koa-router';
import path from 'path';
import fs from 'fs';
import { environment } from '../environment';
import { apiProxy } from '../middlewares/api-proxy';
import { noNeedAuthProxy } from '../middlewares/no-need-auth-proxy';
import { GetUserStateAsync, ModifyUserLanguage, LogoutAsync } from '../controllers/auth-state.controller';
import { ImpersonateLoginAsync, ImpersonateLogoutAsync } from '../controllers/impersonate.controller';

const router = new Router();

/**
 * 验证是否登录，存在 session 即认为已登录
 * 如果是 SSO 登录的，则 session 会每次会由服务端用户信息赋值
 */
router.get('/auth/state', GetUserStateAsync);

/**
 * 修改当前用户的语言
 */
router.put('/auth/state', ModifyUserLanguage);

/**
 * 登出
 */
router.delete('/auth/state', LogoutAsync);

/**
 * 模拟登录
 */
router.get('/auth/impersonate', ImpersonateLoginAsync);

/**
 * 结束模拟
 */
router.delete('/auth/impersonate', ImpersonateLogoutAsync);

/**
 * Proxy
 * 对无需身份的 URL 验证
 */
router.all('/auth/*', noNeedAuthProxy(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {});

/**
 * Proxy
 * 加上一个空回调以阻止 proxy 中间件调用 next
 */
router.all('/api/*', apiProxy(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  if (ctx.session && ctx.session.user) {
    // 刷新登录状态
    ctx.session.cookie.tick = new Date().getTime();
  }
});

/**
 * 其他所有请求均指向首页，用于配合 angular 路由
 */
router.all('/*', async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  ctx.type = 'html';
  if (environment.isDevelopment) {
    ctx.body = 'Hello World! If you see this page, your environment might unhealthy.';
  } else {
    ctx.body = fs.createReadStream(path.resolve(__dirname, '../../public/index.html'));
  }
});

export const routes = router.routes();
