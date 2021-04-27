/**
 * API 转发规则：
 * {localServices}设置了值之后，指定的服务会转发至本地启动的接口；
 * 开发环境将遵守以上规则，生产环境所有 api 均会转发至网关；
 */

import config from './config.json';

const isDevelopment = process.env.NODE_ENV === 'development';

export const environment: { [key: string]: any | any[] } = {
  isDevelopment: isDevelopment,
  ...(isDevelopment ? config : config),
};
