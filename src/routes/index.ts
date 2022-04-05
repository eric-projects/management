import Koa from 'koa';
import bodyParser from 'koa-body';
import Router from 'koa-router';
import path from 'path';
import agent from 'superagent';
import fs from 'fs';
import { environment } from '../environment';
import { noNeedAuthProxy } from '../middlewares/no-need-auth-proxy';
import { GetUserStateAsync, ModifyUserLanguage, LogoutAsync } from '../controllers/auth-state.controller';
import { ImpersonateLoginAsync, ImpersonateLogoutAsync } from '../controllers/impersonate.controller';
import { dbHelper } from '../utils/helper-lowdb';
import { fileHelper } from '../utils/helper-file';
import { jwtHelper } from '../utils/jwt-helper';
// import { sqlitedb } from '../utils/helper-better-sqlite';
import { sqldb } from '../utils/helper-mysql';
import { TicketLogic } from '../controllers/ticket-controller';

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
 * ticket
 */
router.all('/ticket-api/*', TicketLogic);

/**
 * Proxy
 * 对无需身份的 URL 验证
 */
router.all('/auth/*', noNeedAuthProxy(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {});

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
 * koa 接口请求
 * :url 接口地址
 */
router.get('/node-api/:url', bodyParser(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  async function dataGet() {
    var url = jwtHelper.decrypt(jwtHelper.defaultKey, ctx.params.url);
    var fields: string[] = ['_key', 'value'];
    var fieldStruct: any = {};
    if (ctx.query.cache_field) {
      fields = fields.concat(ctx.query.cache_field.split(','));
    }

    fields.forEach(f => {
      if (f == '_key') {
        fieldStruct[f] = sqldb.TypeString;
      } else {
        fieldStruct[f] = sqldb.TypeText;
      }
    });
    await sqldb.init_table(ctx.query.cache_module, { value: sqldb.TypeString, ...fieldStruct }, ['_key']);
    console.log('url', url);
    await agent
      .get(url)
      .then(data => {
        var result = data.text;
        if (ctx.query.cache_module) {
          // console.log(ctx.query.cache_module);
          if (ctx.query.cache_key) {
            console.log('insert', ctx.query.cache_key);
            // fields.push('value');
            if (ctx.query.cache_refresh) {
              sqldb.update_row(ctx.query.cache_module, '_key', { _key: ctx.query.cache_key, value: result }, fields);
            } else {
              sqldb.insert(ctx.query.cache_module, { _key: ctx.query.cache_key, value: result }, fields);
            }
          } else if (ctx.query.cache_data_key) {
            console.log(ctx.query.cache_data_key);
            // 针对数据自建key 存储数据
            var cacheData = JSON.parse(result);
            if (ctx.query.cache_data_path) {
              var pathSplit = ctx.query.cache_data_path.split('.');
              var flag = 0;
              console.log(pathSplit);
              while (flag < pathSplit.length) {
                cacheData = cacheData[pathSplit[flag]];
                flag++;
              }
            }

            if (cacheData instanceof Array) {
              cacheData.forEach(e => {
                // dbHelper.Add(ctx.query.cache_module, e[ctx.query.cache_data_key], e).then(() => {});
                if (!ctx.query.cache_refresh) {
                  sqldb.insert(ctx.query.cache_module, { _key: e[ctx.query.cache_data_key], value: JSON.stringify(e) }, fields);
                } else {
                  sqldb.update_row(ctx.query.cache_module, '_key', { _key: e[ctx.query.cache_data_key], value: JSON.stringify(e) }, fields);
                }
                // sqlitedb.insert(ctx.query.cache_module, { ...e, _key: e[ctx.query.cache_data_key] }, fields);
              });
            } else {
              // dbHelper.Add(ctx.query.cache_module, cacheData[ctx.query.cache_data_key], cacheData).then(() => {});
              if (!ctx.query.cache_refresh) {
                sqldb.insert(
                  ctx.query.cache_module,
                  // { ...cacheData, _key: cacheData[ctx.query.cache_data_key] },
                  { _key: cacheData[ctx.query.cache_data_key], value: JSON.stringify(cacheData) },
                  fields
                );
              } else {
                sqldb.update_row(
                  ctx.query.cache_module,
                  '_key',
                  { _key: cacheData[ctx.query.cache_data_key], value: JSON.stringify(cacheData) },
                  fields
                );
              }
            }
          }
        }
        ctx.body = { _key: ctx.query.cache_key, value: JSON.parse(result) };
      })
      .catch(x => {
        console.log('error', x);
      });
  }

  if (ctx.query.cache_module && ctx.query.cache_key && !ctx.query.cache_refresh && (await sqldb.exist_table(ctx.query.cache_module))) {
    console.log(ctx.query.cache_key + 'eric*********************1');
    await sqldb.query(ctx.query.cache_module, { _key: ctx.query.cache_key }).then(async (data: any) => {
      console.log('dbHelper.Get', data);
      if (!data || data.length == 0) {
        console.log(ctx.query.cache_key + 'eric*********************2');
        await dataGet();
      } else {
        ctx.body = { ...data[0], value: JSON.parse(data[0].value) };
      }
    });
  } else {
    await dataGet();
  }
});

/**
 * koa 接口请求
 * :url 接口地址
 */
router.post('/node-api/:url', bodyParser(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  console.log('ctx.params');
  console.log(ctx.params);
  if (ctx.query.cache_module && ctx.query.cache_key) {
    console.log(ctx.query.cache_key + 'eric*********************1');
    await dbHelper.Get(ctx.query.cache_module, ctx.query.cache_key).then(async data => {
      // console.log('dbHelper.Get', data);
      if (data) {
        ctx.body = data;
      } else {
        var url = jwtHelper.decrypt(jwtHelper.defaultKey, ctx.params.url);
        console.log(ctx.query.cache_key + 'eric*********************2');
        await agent
          .post(url)
          .send(ctx.request.body)
          .then(data => {
            ctx.body = data.body;
            if (ctx.query.cache_module && ctx.query.cache_key) {
              dbHelper.Add(ctx.query.cache_module, ctx.query.cache_key, data.body).then(() => {});
            }
            console.log(url, data);
          });
      }
    });
  } else {
    var url = jwtHelper.decrypt(jwtHelper.defaultKey, ctx.params.url);
    await agent
      .post(url)
      .send(ctx.request.body)
      .then(data => {
        ctx.body = data.body;
        if (ctx.query.cache_module && ctx.query.cache_key) {
          dbHelper.Add(ctx.query.cache_module, ctx.query.cache_key, data.body).then(() => {});
        }
        console.log(url, data);
      });
  }
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
    // console.log('dbHelper.Get', data);
    ctx.body = data;
  });
});

/**
 * 查询
 * :module 模块名（db 文件名）
 */
router.get('/api/:module', bodyParser(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  console.log('ctx.query', '1111111111111');
  await sqldb.query_page(ctx.params.module, ctx.query).then((data: any) => {
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
 * :module 模块名（db 文件名/表名）
 * :key 数据key/数据path
 */
router.post('/api/:module/:key', bodyParser(), async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  var fields: string[] = ['_key', 'value'];
  var fieldStruct: any = {};

  if (ctx.query.cache_field) {
    fields = fields.concat(ctx.query.cache_field.split(','));
  } else {
    fields = Object.keys(ctx.request.body);
  }

  fields.forEach(f => {
    fieldStruct[f] = sqldb.TypeString;
  });

  await sqldb.init_table(ctx.params.module, { value: sqldb.TypeString, ...fieldStruct }, ['_key']);
  console.log('dbHelper.Add');
  await sqldb.insert(ctx.params.module, { ...ctx.request.body, _key: ctx.params.key }, fields).then(
    () => {
      ctx.status = 200;
    },
    (error: { message: string | number | {} }) => {
      ctx.throw(500, error.message);
    }
  );
});

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
