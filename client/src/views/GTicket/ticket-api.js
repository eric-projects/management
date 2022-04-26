import { httpHelper, jwtHelper } from '@/common/utils';
const ticketApi = {};
// cache_module 模块名（表名）
// cache_key 数据传入主键
// cache_data_path 存储数据路径
// cache_data_key 数据自带主键
// cache_field 数据结构 ,相隔
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
  // var url = `https://proxy.finance.qq.com/cgi/cgi-bin/rank/hs/getBoardRankList?board_code=${type}&sort_type=price&direct=down`;
  // var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  // return httpHelper.get(`/node-api/${jm}`, {
  //   params: { cache_module: 'ticket_wget', cache_data_path: 'data.rank_list', cache_data_key: 'code' },
  //   // params: { cache_module: 'ticket_wget', cache_data_path: 'data.rank_list', cache_data_key: 'code', cache_field: 'code,name' },
  // });
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, 'ticket_list');
  return httpHelper.post(`/ticket-api/${jm}`, { type: type });
};

/**
 * 查询票票
 * @param {*} data 查询数据
 * @returns
 */
ticketApi.searchData = data => {
  return httpHelper.get(`/api/ticket_list`, { params: data }, { loading: false });
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

/**
 * 获取我的自选数据
 * @returns
 */
ticketApi.my_select = refresh => {
  var module = 'tencent_wget';
  var url =
    'https://proxy.finance.qq.com/cgi/cgi-bin/zixuananalysis/cmpStockList?check=11&appid=wxcbc3ab3807acb685&openid=oA0Gbjr4JuiTS2QrBsgPkRiLwMTc&fskey=v0ba82b0e2062400aedd2cde9342ffdf&access_token=55_1HO-04w0wAkXmXGTWwKn9lJRx_ev34YRjEVr2qxYnGu0kfv5i2DXBHTQ_GDAI7c97kuE1saNTplpI9Yj22kcALB6b4N70q-y_UwT13VwMR8&g_openid=oA0Gbjr4JuiTS2QrBsgPkRiLwMTc&uin=oA0Gbjr4JuiTS2QrBsgPkRiLwMTc&_appName=android&_dev=OPPO+R7&_devId=0000000003dd5864ffffffffe3725481ffff5864&_mid=0000000003dd5864ffffffffe3725481ffff5864&_md5mid=1FB417C1C7BDA9B31C8976BCB11AA980&_appver=9.6.0&_ifChId=65&_screenW=1080&_screenH=1920&_osVer=5.1&_uin=oA0Gbjr4JuiTS2QrBsgPkRiLwMTc&_wxuin=oA0Gbjr4JuiTS2QrBsgPkRiLwMTc&_net=WIFI&__random_suffix=66264&_buildtype=store&buildtime=2021-11-24+16%3A07%3A27&lang=zh_CN';
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, { params: { cache_module: module, cache_key: '自选', cache_refresh: refresh } });
};

/**
 * 加/减自选
 * @param {*} codes
 * @param {*} group
 * @param {*} type
 * @returns
 */
ticketApi.userSelectTicket = (codes, group, type = 'add_select' | 'delete_select' | 'clear_select') => {
  console.log(codes, type);
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, type);
  return httpHelper.post(`/ticket-api/${jm}`, { codes: codes, group: group });
};

/**
 * 获取票票明细
 * @param {*} code shxxxx格式
 * @returns [{时间,开盘,收盘,最高,最低,成交量,{},换手,成交额,}]
 */
ticketApi.txTicketDetail = (code, date) => {
  var url = `https://proxy.finance.qq.com/ifzqgtimg/appstock/app/newkline/newkline?param=${code},day,,,${date + 2}`;
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, { params: { cache_data_path: `data.${code}.day` } });
};

/**
 * 获取票新闻
 * @param {*} index 页码
 * @returns
 */
ticketApi.ticketNews = index => {
  var url = `http://comment.10jqka.com.cn/api/realtime.php?block=getnews&page=${index}`;
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, {
    params: { cache_module: 'ticket_news', cache_data_key: `guid`, cache_field: 'ctime,title,url' },
  });
};

/**
 * 当前涨停版块
 * @returns
 */
ticketApi.riseBoard = () => {
  var url = `https://proxy.finance.qq.com/ifzqgtimg/appstock/news/ZtAnalysis/index?ver=1`;
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, { params: { cache_data_path: 'data.display.header' } });
};

/**
 * 当前涨停板块内股票
 * @param {*} board
 * @returns
 */
ticketApi.riseBoardCodes = board => {
  var url = `https://proxy.finance.qq.com/ifzqgtimg/appstock/news/ZtAnalysis/getByPlate?pltCode=${board}`;
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, { params: { cache_data_path: 'data' } });
};

/**
 * 行业板块
 * @returns
 */
ticketApi.boardHangYe = () => {
  // zgb 涨股比
  // zdf 涨跌幅
  var url = `https://proxy.finance.qq.com/ifzqgtimg/appstock/fundflow/Fundflow/getHyRank?t=zgb&o=1`;
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, { params: { cache_data_path: 'data.data' } });
};

/**
 * 概念板块
 * @returns
 */
ticketApi.boardGaiNian = () => {
  var url = `https://proxy.finance.qq.com/ifzqgtimg/appstock/fundflow/Fundflow/getGnRank?t=zgb&o=1`;
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, { params: { cache_data_path: 'data.data' } });
};

/**
 * 行业/概念明细股
 * @param {*} code
 * @returns
 */
ticketApi.boardTickets = code => {
  var url = `https://proxy.finance.qq.com/cgi/cgi-bin/rank/hs/getBoardRankList?board_code=${code}&sort_type=price&direct=down`;
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, { params: { cache_data_path: 'data.rank_list' } });
};

/**
 * 价值透支
 * @param {*} code 编码
 * @param {*} type 1年报，2季报
 * @returns
 */
ticketApi.valueInvesting = (code, type) => {
  var url = `https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/ZYZBAjaxNew?type=${type}&code=${code}`;
  var jm = jwtHelper.encrypt(jwtHelper.defaultKey, url);
  return httpHelper.get(`/node-api/${jm}`, { params: { cache_data_path: 'data' } }, { loading: false });
};

export default ticketApi;
