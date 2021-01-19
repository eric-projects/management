import Koa from 'koa';
import agent from 'superagent';
import { environment } from '../environment';
import { objectToBase64 } from '../utils/base64';
import { noStateHandle } from '../utils/no-auth-state-handle';
import { getSsoConfig, isLandingUrl } from '../utils/sso-config';
import { removeUserState, setUserState } from '../utils/user-state';

export function authStateCheck(): Koa.Middleware {
  return async (ctx: Koa.Context, next: () => Promise<any>) => {
    let stopPipeline = false;

    if (!ctx.session || !ctx.session.user) {
      ctx.session.user = {
        id: 'cedb3e1c-48b9-7f2b-32e6-5cc0ccff8035',
        account: 'eris.cheng',
        name: '程国强',
        language: ctx.headers['lang'],
      };
    }

    if (ctx.path === '/auth/state' && ctx.method === 'GET') {
      // 如果开启 SSO，从服务器换取用户状态
      if (noStateHandle(ctx)) {
        // 终止请求
        stopPipeline = true;
      } else {
        const ssoConfig = getSsoConfig(ctx);
        if (
          ssoConfig &&
          !isLandingUrl(ctx, ssoConfig) &&
          !ctx.session.user.impersonatorId &&
          ctx.session &&
          ctx.session.user &&
          ctx.session.accessToken
        ) {
          const ssoParams = {
            originSite: ssoConfig.originSite,
            ssoType: ssoConfig.type,
            platform: ssoConfig.platform,
            access_token: ctx.session.accessToken,
            ...ctx.query,
          };
          await agent
            .get(`${environment.apiGateway.uri}${ssoConfig.userStateUri}`)
            // .set(ctx.header)
            .set('access_token', ctx.header['access_token'])
            .query(ssoParams)
            .then(res => {
              setUserState(ctx, res.body);
            })
            .catch(err => {
              // 出错清空用户状态
              removeUserState(ctx);
            });
        }
      }
    }

    if (ctx.session && ctx.session.user) {
      if (!ctx.session.user.language) {
        ctx.session.user.language = 'zh';
      }
      ctx.header['current_user'] = objectToBase64(ctx.session.user);
    }

    if (!stopPipeline) {
      return await next();
    }
  };
}
