import { httpHelper, jwtHelper } from '@/common/utils';
const ticketApi = {};
// cache_module 模块名（表名）
// cache_key 数据传入主键
// cache_data_path 存储数据路径
// cache_data_key 数据自带主键
// cache_field 数据结构
/**
 * 龙虎榜
 * @param {*} date
 * @returns
 */
ticketApi.initRank = date => {
  var module = 'ticket_tiger_wget';
  if (!date) {
    var d = new Date();
    var dy = d.getFullYear();
    var dm = (d.getMonth() + 1 + '').padStart(2, '0');
    var dd = (d.getDate() + '').padStart(2, '0');
    date = `${dy}-${dm}-${dd}`;
  }
  var url = 'https://proxy.finance.qq.com/cgi/cgi-bin/longhubang/lhbDetail?date=' + date;
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
    params: { cache_module: 'ticket_wget', cache_data_path: 'data.rank_list', cache_data_key: 'code' },
    // params: { cache_module: 'ticket_wget', cache_data_path: 'data.rank_list', cache_data_key: 'code', cache_field: 'code,name' },
  });
};

/**
 * 查询票票
 * @param {*} data 查询数据
 * @returns
 */
ticketApi.searchData = data => {
  return httpHelper.get(`/api/ticket`, { params: data });
};

/**
 * 涨停榜
 * @param {*} date
 * @returns
 */
ticketApi.initRise = date => {
  var module = 'ticket_rise_wget';
  if (!date) {
    var d = new Date();
    var dy = d.getFullYear();
    var dm = (d.getMonth() + 1 + '').padStart(2, '0');
    var dd = (d.getDate() + '').padStart(2, '0');
    date = `${dy}-${dm}-${dd}`;
  }
  var url = 'https://proxy.finance.qq.com/ifzqgtimg/appstock/news/ZtAnalysis/list?p=1&num=4000';
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, { params: { cache_module: module, cache_key: date } });
};

export default ticketApi;
