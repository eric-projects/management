import Koa from 'koa';
import agent from 'superagent';
import { environment } from '../environment';
import { noStateHandle } from '../utils/no-auth-state-handle';
import { getSsoConfig, isLandingUrl } from '../utils/sso-config';
import { setUserState } from '../utils/user-state';

export function ssoCheck(): Koa.Middleware {
  return async (ctx: Koa.Context, next: () => Promise<any>) => {
    const ssoConfig = getSsoConfig(ctx);
    if (ssoConfig) {
      if (ctx.session && ctx.session.user) {
        return await next();
      }

      const params = ssoConfig.params || {};
      const alias = ssoConfig.alias || {};

      if (alias.callbackUri) {
        params[alias.callbackUri] = ctx.origin + ssoConfig.callbackUri;
      }
      if (alias.returnUri) {
        params[alias.returnUri] = ctx.href;
      }

      // 如果是着陆地址，则取得信息向接口换取用户状态
      if (isLandingUrl(ctx, ssoConfig)) {
        const ssoParams = {
          originSite: ssoConfig.originSite,
          ssoType: ssoConfig.type,
          platform: ssoConfig.platform,
          ...ctx.query,
        };
        await agent
          .post(`${environment.apiGateway.uri}${ssoConfig.userStateUri}`)
          // .set(ctx.header)
          .set('access_token', ctx.header['access_token'])
          .send(ssoParams)
          .then(res => {
            setUserState(ctx, res.body);
            if (!!ctx.query[alias.returnUri]) {
              // 从返回着陆页的参数重提取 sso 认证取得地址
              ctx.redirect(ctx.query[alias.returnUri]);
            } else if (ssoConfig.verifyHook.in === 'query' && !!ctx.query[ssoConfig.verifyHook.value]) {
              // 去除 ticket 重定向
              ctx.query = Object.keys(ctx.query).reduce((obj: any, key: string) => {
                if (key !== ssoConfig.verifyHook.value) {
                  obj[key] = ctx.query[key];
                }
                return obj;
              }, {});
              ctx.redirect(`${ctx.protocol}://${ctx.host}${ctx.url}`);
            } else {
              ctx.redirect(`${ctx.protocol}://${ctx.host}`);
            }
          })
          .catch(err => {
            const message = err.response ? err.response.text : '';
            ctx.throw(err.status, message);
          });

        return await next();
      } else if (ctx.path === environment.impersonatePath) {
        return await next();
      }

      noStateHandle(ctx, true);
    } else {
      return await next();
    }
  };
}
