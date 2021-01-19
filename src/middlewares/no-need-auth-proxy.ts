import Koa from 'koa';
import url from 'url';
import proxy from 'koa-better-http-proxy';
import { IncomingMessage } from 'http';
import { environment } from '../environment';
import { setUserState } from '../utils/user-state';

export function noNeedAuthProxy(): Koa.Middleware {
  return proxy('0', {
    limit: environment.uploadLimit,
    proxyReqOptDecorator: (options: proxy.IRequestOption, ctx: Koa.Context) => {
      const path = ctx.path.replace(/^\/auth\//i, '');
      const actualPath = environment.noNeedAuthPaths[path];

      if (!actualPath) {
        ctx.throw(500, `Config error, [${path}] not found, please modify config.json!`);
      }

      const uri = url.parse(environment.apiGateway.uri);
      options.hostname = uri.hostname;
      options.port = Number(uri.port);

      ctx.url = `${actualPath}${ctx.querystring ? '?' : ''}${ctx.querystring}`;
      return options;
    },
    userResDecorator: (proxyRes: IncomingMessage, proxyResData: string | Buffer, ctx: Koa.Context) => {
      // 对登录接口进行处理
      if (ctx.path === environment.noNeedAuthPaths.state && ctx.method === 'POST' && ctx.status === 200) {
        setUserState(ctx, JSON.parse(proxyResData.toString('utf8')));
        ctx.status = 204;
      }

      return proxyResData;
    },
  });
}
