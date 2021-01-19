import Koa from 'koa';
import logger from 'koa-logger';
import serve from 'koa-static';
import session from 'koa-generic-session';
import path from 'path';
import http from 'http';
import statuses from 'statuses';
import { gatewayAccessCheck } from './middlewares/gateway-access-check';
import { authStateCheck } from './middlewares/auth-state-check';
import { routes } from './routes';
import { environment } from './environment';
import { connect } from './sockets/websocket';

// 添加自定义登录超时状态码
statuses[440] = 'Login Timeout';

const app = new Koa();

app.keys = ['tools'];
app.use(
  session({
    key: 'tools.sid',
    rolling: true,
    cookie: { maxAge: environment.session.maxAge * 1000 },
  })
);
app.use(logger());

// 先检查网关授权
// app.use(gatewayAccessCheck());

// 用户状态验证后再进行 sso 验证
app.use(authStateCheck());
// app.use(ssoCheck());

// 静态文件
app.use(serve(path.resolve(__dirname, '../public')));

// 路由
app.use(routes);

const server = http.createServer(app.callback());
connect(server);
server.listen(environment.port, () => {
  console.log(`[*] web app listening on :${environment.port}`);
});
