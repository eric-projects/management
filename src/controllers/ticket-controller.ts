import Koa from 'koa';
import bodyParser from 'koa-body';
import agent from 'superagent';
import { environment } from '../environment';
import { setUserState } from '../utils/user-state';
import { tickettxHelper } from '../utils/helper-tencent-ticket';
import { ticketdfHelper } from '../utils/helper-eastmoney-ticket';
import { jwtHelper } from '../utils/jwt-helper';
import { sqldb } from '../utils/helper-mysql';
let pinyin = require('js-pinyin');
pinyin.setOptions({ checkPolyphone: false, charCase: 0 });

export async function TicketLogic(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  await bodyParser().call(null, ctx, next);
  var logicType = jwtHelper.decrypt(jwtHelper.defaultKey, ctx.url.replace('/ticket-api/', ''), false);
  // const code = ctx.query.code;
  // console.log(ctx.request.body);
  console.log('TicketLogic', logicType);
  var result = '';
  switch (logicType) {
    case 'add_select':
      var data = ctx.request.body.codes;
      var groupId = ctx.request.body.group;
      console.log('TicketLogic', logicType);
      await tickettxHelper.add_select_ticket(data, groupId);
      break;
    case 'delete_select':
      var data = ctx.request.body.codes;
      var groupId = ctx.request.body.group;
      await tickettxHelper.delete_select_ticket(data, groupId);
      break;
    case 'clear_select':
      await tickettxHelper.get_select_ticket().then((res: any) => {
        // console.log('clear_select', res);
        res.forEach((group: any) => {
          console.log(group.groupId, group.stockList.length);
          if (group.stockList && group.stockList.length > 0) {
            tickettxHelper.delete_select_ticket(group.stockList, group.groupId);
          }
        });
      });
      break;
    case 'ticket_list':
      var module = 'ticket_list';
      await sqldb.init_table(module, {
        _key: sqldb.TypeString,
        code: sqldb.TypeString,
        name: sqldb.TypeString,
        zm: sqldb.TypeString,
        type: sqldb.TypeString,
      });
      var type = ctx.request.body.type;
      console.log('ctx.request.query', ctx.request.body.type);
      await sqldb.delete_row(module, 'type', `'${type}'`);
      await ticketdfHelper.get_df_ticket(type).then(res => {
        sqldb.insert_batch(
          module,
          res.map((item: any) => ({ _key: item.f12, code: item.f12, name: item.f14, type: type, zm: pinyin.getCamelChars(item.f14) }))
        );
      });
      break;
    default:
      break;
  }
  ctx.body = result;
}
