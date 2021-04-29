import Koa from 'koa';
import bodyParser from 'koa-body';
import Router from 'koa-router';
import path from 'path';
import fs from 'fs';
import { environment } from '../environment';
import { noNeedAuthProxy } from '../middlewares/no-need-auth-proxy';
import { GetUserStateAsync, ModifyUserLanguage, LogoutAsync } from '../controllers/auth-state.controller';
import { ImpersonateLoginAsync, ImpersonateLogoutAsync } from '../controllers/impersonate.controller';
import { redisHelper } from '../utils/helper-redis';
import { dbHelper } from '../utils/helper-lowdb';
import { fileHelper } from '../utils/helper-file';

const router = new Router();

/**
 * 验证是否登录，存在 session 即认为已登录
 * 如果是 SSO 登录的，则 session 会每次会由服务端用户信息赋值
 */
router.get('/auth/state', GetUserStateAsync);

/**
 * 修改当前用户的语言
 */
router.put('/auth/state', ModifyUserLanguage);

/**
 * 登出
 */
router.delete('/auth/state', LogoutAsync);

/**
 * 模拟登录
 */
router.get('/auth/impersonate', ImpersonateLoginAsync);

/**
 * 结束模拟
 */
router.delete('/auth/impersonate', ImpersonateLogoutAsync);

/**
 * Proxy
 * 对无需身份的 URL 验证
 */
router.all('/auth/*', noNeedAuthProxy(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {});

// /**
//  * Proxy
//  * 加上一个空回调以阻止 proxy 中间件调用 next
//  */
// router.all('/api/*', apiProxy(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
//   if (ctx.session && ctx.session.user) {
//     // 刷新登录状态
//     ctx.session.cookie.tick = new Date().getTime();
//   }
// });

/**
 * 附件
 * 上传内容到路径文件
 */
router.post('/api/upload/string', bodyParser(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  console.log('/api/upload/string', ctx.request.body);
  await fileHelper.uploadStringToFile(ctx.request.body.data, ctx.request.body.path).then(
    () => {
      ctx.status = 200;
    },
    error => {
      ctx.throw(500, error.message);
    }
  );
});

/**
 * 查询
 * :module 模块名（db 文件名）
 * :key 数据key/数据path
 */
router.get('/api/:module/:key', bodyParser(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  // ctx.params.module, ctx.query.key
  console.log('dbHelper.Get');
  await dbHelper.Get(ctx.params.module, ctx.params.key).then(data => {
    console.log('dbHelper.Get', data);
    ctx.body = data;
  });
});

/**
 * 删除
 * :module 模块名（db 文件名）
 * :key 数据key/数据path
 */
router.delete('/api/:module/:key', bodyParser(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  // ctx.params.module, ctx.query.key
  console.log('dbHelper.Delete');
  await dbHelper.Delete(ctx.params.module, ctx.params.key, ctx.query.dataType, ctx.query).then(
    () => {
      ctx.status = 200;
    },
    error => {
      ctx.throw(500, error);
    }
  );
});

/**
 * 添加
 * :module 模块名（db 文件名）
 * :key 数据key/数据path
 */
router.post('/api/:module/:key', bodyParser(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  // ctx.params.module, ctx.query.key
  console.log('dbHelper.Add');
  await dbHelper.Add(ctx.params.module, ctx.params.key, ctx.query.dataType, ctx.request.body).then(
    () => {
      ctx.status = 200;
    },
    error => {
      ctx.throw(500, error.message);
    }
  );
});

// /**
//  * 查询
//  * 查询模块：module下数据
//  */
// router.get('/api/:module/hash', async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
//   await redisHelper.hgetData(ctx.query.key, ctx.params.module).then(data => {
//     ctx.body = data;
//   });
// });

// /**
//  * Proxy
//  * 加上一个空回调以阻止 proxy 中间件调用 next
//  */
// router.delete('/api/:module/hash', async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
//   await redisHelper.delData(ctx.params.module, ctx.query.key).then(data => {
//     ctx.body = data;
//   });
// });

// /**
//  * Proxy
//  * 加上一个空回调以阻止 proxy 中间件调用 next
//  */
// router.get('/api/:module/*', async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
//   await redisHelper.getData(ctx.query.key, ctx.params.module).then(data => {
//     ctx.body = data;
//   });
// });

// /**
//  * Proxy
//  * 加上一个空回调以阻止 proxy 中间件调用 next
//  */
// router.post('/api/:module/hash', bodyParser(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
//   console.log('ctx.params');
//   console.log(ctx.request.body);
//   await redisHelper.hsetData(ctx.query.key, ctx.request.body, ctx.params.module).then(data => {
//     ctx.status = 200;
//   });
// });

// /**
//  * Proxy
//  * 加上一个空回调以阻止 proxy 中间件调用 next
//  */
// router.post('/api/:module', bodyParser(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
//   await redisHelper.setData(ctx.query.key, ctx.request.body, ctx.params.module).then(data => {
//     ctx.status = 200;
//   });
// });

/**
 * 其他所有请求均指向首页，用于配合 angular 路由
 */
router.all('/*', async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  ctx.type = 'html';
  if (environment.isDevelopment) {
    ctx.body = 'Hello World! If you see this page, your environment might unhealthy.';
  } else {
    ctx.body = fs.createReadStream(path.resolve(__dirname, '../../public/index.html'));
  }
});

export const routes = router.routes();
