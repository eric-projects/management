import Koa from 'koa';
import { getPlatform } from './ua-device';
import { environment } from '../environment';

export function getSsoConfig(ctx: Koa.ParameterizedContext) {
  if (!environment.sso) {
    return undefined;
  }

  const ssoType = environment.sso.type;
  if (!ssoType) {
    return undefined;
  }

  let ssoConfig = environment.sso[ssoType];
  if (!ssoType || !ssoConfig) {
    return undefined;
  }

  const platform = getPlatform(ctx.header['user-agent']);
  if (ssoConfig[platform]) {
    ssoConfig = ssoConfig[platform];
    ssoConfig.platform = platform;
  }

  return ssoConfig;
}

export function isLandingUrl(ctx: Koa.ParameterizedContext, ssoConfig: any) {
  return (
    (ssoConfig.verifyHook.in === 'path' && ssoConfig.verifyHook.value === ctx.path) ||
    (ssoConfig.verifyHook.in === 'query' && !!ctx.query[ssoConfig.verifyHook.value])
  );
}
