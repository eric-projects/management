import Koa from 'koa';
import querystring from 'querystring';
import { getSsoConfig } from './sso-config';

export function noStateHandle(ctx: Koa.Context, redirect?: boolean): boolean {
  if (!ctx.session || !ctx.session.user) {
    const refererUrl = ctx.header['referer'] && ctx.header['referer'] !== '/' ? new URL(ctx.header['referer'] + '') : undefined;
    const params = refererUrl ? { referer: refererUrl.pathname + refererUrl.search } : {};
    const ssoConfig = getSsoConfig(ctx);
    Object.assign(params, ssoConfig ? ssoConfig.params : undefined);
    const uri = `${ssoConfig ? ssoConfig.redirectUri : '/login'}?${querystring.stringify(params)}`;

    ctx.status = ctx.path === '/auth/state' ? 401 : 440;
    if (redirect) {
      ctx.redirect(uri);
    } else {
      ctx.body = uri;
    }

    return true;
  }

  return false;
}
