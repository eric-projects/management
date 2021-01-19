import Koa from 'koa';
import bodyParser from 'koa-body';
import { environment } from '../environment';
import { removeUserState } from '../utils/user-state';

export async function LoginAsync(ctx: Koa.ParameterizedContext, next: Koa.Next) {}

export async function LogoutAsync(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  removeUserState(ctx);
  ctx.status = 204;
}

export async function GetUserStateAsync(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  if (ctx.session && ctx.session.user) {
    ctx.body = { ...ctx.session.user };
  } else {
    ctx.throw(404, 'No Authentication!');
  }
}

export async function ModifyUserLanguage(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  await bodyParser().call(null, ctx, next);

  if (ctx.session && ctx.session.user) {
    ctx.session.user.language = ctx.request.body.lang;
  }
  ctx.status = 204;
}
