import Koa from 'koa';
import url from 'url';
import proxy from 'koa-better-http-proxy';
import { environment } from '../environment';
import { noStateHandle } from '../utils/no-auth-state-handle';

export function apiProxy(): Koa.Middleware {
  return proxy('0', {
    limit: environment.uploadLimit,
    filter: (ctx: Koa.Context) => {
      return !noStateHandle(ctx);
    },
    proxyReqOptDecorator: (options: proxy.IRequestOption, ctx: Koa.Context) => {
      let targetUrl = ctx.url.replace(/^\/api\//i, '/');
      let rootUri;

      // 开发环境对本地调试服务转发
      if (environment.isDevelopment) {
        const service = targetUrl.match(/^\/([^\/]+)\//)[1];
        const obj = environment.localServices.find((p: any) => p.enable && p.name === service);
        if (obj !== undefined) {
          rootUri = obj.uri;
          targetUrl = targetUrl.replace(new RegExp('/' + service + '/'), '/');
        }
      }

      const uri = url.parse(rootUri || environment.apiGateway.uri);
      options.hostname = uri.hostname;
      options.port = Number(uri.port);

      ctx.url = targetUrl;
      return options;
    },
  });
}
