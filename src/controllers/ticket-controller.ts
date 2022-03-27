import Koa from 'koa';
import bodyParser from 'koa-body';
import agent from 'superagent';
import { environment } from '../environment';
import { setUserState } from '../utils/user-state';
import { ticketHelper } from '../utils/helper-tencent-ticket';
import { jwtHelper } from '../utils/jwt-helper';

export async function TicketLogic(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  await bodyParser().call(null, ctx, next);
  var logicType = jwtHelper.decrypt(jwtHelper.defaultKey, ctx.url.replace('/ticket-api/', ''), false);
  // const code = ctx.query.code;
  // console.log(ctx.request.body);
  console.log('TicketLogic', logicType);
  switch (logicType) {
    case 'add_select':
      var data = ctx.request.body.codes;
      var groupId = ctx.request.body.group;
      console.log('TicketLogic', logicType);
      await ticketHelper.add_select_ticket(data, groupId);
      break;
    case 'delete_select':
      var data = ctx.request.body.codes;
      var groupId = ctx.request.body.group;
      await ticketHelper.delete_select_ticket(data, groupId);
      break;
    case 'clear_select':
      await ticketHelper.get_select_ticket().then((res: any) => {
        // console.log('clear_select', res);
        res.forEach((group: any) => {
          console.log(group.groupId, group.stockList.length);
          if (group.stockList && group.stockList.length > 0) {
            ticketHelper.delete_select_ticket(group.stockList, group.groupId);
          }
        });
      });
      break;
    default:
      break;
  }
  ctx.body = '';
  // if (token) {
  //   const lang = ctx.headers['lang'];
  //   await agent
  //     .post(`${environment.apiGateway.uri}/platform/v1/impersonate`)
  //     .set(ctx.header)
  //     .send({ impersonateInfo: token })
  //     .then(res => {
  //       // setUserState(ctx, res.body);
  //       ctx.session.user = Object.assign({ language: lang }, res.body);
  //       ctx.status = 204;
  //       ctx.redirect('/');
  //     })
  //     .catch(err => {
  //       const message = err.response ? err.response.text : '';
  //       ctx.throw(err.status, message);
  //     });
  // }
}
