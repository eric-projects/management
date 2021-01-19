import Koa from 'koa';

export function setUserState(ctx: Koa.ParameterizedContext, user: any) {
  if (ctx.session) {
    if (user.accessToken) {
      ctx.session.accessToken = user.accessToken;
      delete user.accessToken;
    }
    ctx.session.user = Object.assign({ language: ctx.headers['lang'] || 'zh' }, user);
  }
}

export function removeUserState(ctx: Koa.ParameterizedContext) {
  if (ctx.session) {
    ctx.session.user = undefined;
  }
}
