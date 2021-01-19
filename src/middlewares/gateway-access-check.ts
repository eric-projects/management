import Koa from 'koa';
import agent from 'superagent';
import { environment } from '../environment';

const accessStore: { token?: string; expires?: number } = {};

export function gatewayAccessCheck(): Koa.Middleware {
  return async (ctx: Koa.Context, next: () => Promise<any>) => {
    if (!accessStore || !accessStore.expires || accessStore.expires < new Date().getTime()) {
      // 不存在授权信息，或授权已过期则向网关请求 token
      const { apiGateway } = environment;
      await agent
        .post(apiGateway.uri + '/token')
        .send({
          'app-key': apiGateway.appKey,
          'app-secret': apiGateway.appSecret,
        })
        .then(res => {
          const { token, expiresIn } = res.body;
          accessStore.token = token;
          accessStore.expires = new Date().getTime() + expiresIn * 1000;
        })
        .catch(err => {
          ctx.throw(502, 'Failed to access.');
        });
    }
    ctx.header['access_token'] = accessStore.token;
    return await next();
  };
}
