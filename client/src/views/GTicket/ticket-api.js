import { httpHelper, jwtHelper } from '@/common/utils';
const ticketApi = {};
// cache_module
// cache_key
// cache_data_path
// cache_data_key
/**
 * 龙虎榜
 * @param {*} date
 * @returns
 */
ticketApi.initRank = date => {
  var module = 'ticket_rank';
  if (!date) {
    var d = new Date();
    var dy = d.getFullYear();
    var dm = (d.getMonth() + 1 + '').padStart(2, '0');
    var dd = (d.getDate() + '').padStart(2, '0');
    date = `${dy}-${dm}-${dd}`;
  }
  // var url = encodeURIComponent('https://proxy.finance.qq.com/cgi/cgi-bin/longhubang/lhbDetail?date=' + date);
  var url = 'https://proxy.finance.qq.com/cgi/cgi-bin/longhubang/lhbDetail?date=' + date;
  // console.log(url);
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, { params: { cache_module: module, cache_key: date } });
};

/**
 * 股票数据
 * @param {*} type
 * @returns
 */
ticketApi.initData = type => {
  var url = `https://proxy.finance.qq.com/cgi/cgi-bin/rank/hs/getBoardRankList?board_code=${type}&sort_type=price&direct=down`;
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, {
    params: { cache_module: 'ticket_board', cache_data_path: 'data.rank_list', cache_data_key: 'code' },
  });
};

ticketApi.searchData = () => {
  return httpHelper.get(`/api/ticket_board`);
};

export default ticketApi;
