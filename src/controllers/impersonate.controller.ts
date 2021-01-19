import Koa from 'koa';
import agent from 'superagent';
import { environment } from '../environment';
import { setUserState } from '../utils/user-state';

export async function ImpersonateLoginAsync(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const token = ctx.query['token'];
  if (token) {
    const lang = ctx.headers['lang'];
    await agent
      .post(`${environment.apiGateway.uri}/platform/v1/impersonate`)
      .set(ctx.header)
      .send({ impersonateInfo: token })
      .then(res => {
        // setUserState(ctx, res.body);
        ctx.session.user = Object.assign({ language: lang }, res.body);
        ctx.status = 204;
        ctx.redirect('/');
      })
      .catch(err => {
        const message = err.response ? err.response.text : '';
        ctx.throw(err.status, message);
      });
  }
}

export async function ImpersonateLogoutAsync(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  await agent
    .post(`${environment.apiGateway.uri}/platform/v1/impersonate-out`)
    .set(ctx.header)
    .send({ userId: ctx.session.user.id, impersonatorId: ctx.session.user.impersonatorId })
    .then(res => {
      // setUserState(ctx, res.body);
      ctx.session.user = res.body;
      ctx.status = 204;
    })
    .catch(err => {
      const message = err.response ? err.response.text : '';
      ctx.throw(err.status, message);
    });
}
