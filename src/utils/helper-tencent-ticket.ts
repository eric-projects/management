import agent from 'superagent';
class TicketHelper {
  access_token = '55_1HO-04w0wAkXmXGTWwKn9lJRx_ev34YRjEVr2qxYnGu0kfv5i2DXBHTQ_GDAI7c97kuE1saNTplpI9Yj22kcALB6b4N70q-y_UwT13VwMR8';
  fskey = 'v0ba82b0e2062400aedd2cde9342ffdf';
  http = 'https';
  host = 'proxy.finance.qq.com';
  app = '3G';
  uin = 'oA0Gbjr4JuiTS2QrBsgPkRiLwMTc';
  appid = 'wxcbc3ab3807acb685';
  openid = 'oA0Gbjr4JuiTS2QrBsgPkRiLwMTc';
  g_openid = 'oA0Gbjr4JuiTS2QrBsgPkRiLwMTc';
  _appName = 'android';
  _devId = '0000000003dd5864ffffffffe3725481ffff5864';
  _mid = '0000000003dd5864ffffffffe3725481ffff5864';
  private async select_ticket(codes: string[], type: string, gid = '1') {
    // type add sa
    var url = `${this.http}://${this.host}/newstock/stockapp/Updstock/operseq`;
    url += `?app=${this.app}&uin=${this.uin}&check=11&appid=${this.appid}&openid=${this.openid}`;
    url += `&fskey=${this.fskey}&access_token=${this.access_token}`;
    url += `&g_openid=${this.g_openid}&uin=${this.uin}&_appName=${this._appName}&_dev=OPPO+R7&_devId=${this._devId}&_mid=${this._mid}&_md5mid=1FB417C1C7BDA9B31C8976BCB11AA980&_appver=9.6.0&_ifChId=65&_screenW=1080&_screenH=1920&_osVer=5.1&_uin=${this.uin}&_wxuin=${this.uin}&_net=WIFI&__random_suffix=31138&_buildtype=store&buildtime=2021-11-24+16%3A07%3A27&lang=zh_CN`;
    var dataArry: any[] = [];
    codes.forEach(code => {
      dataArry.push(`{"grpid":${gid},"act":"${type}","code":"${code}","timestamp":"1648365909316"}`);
    });
    var delparam = `seq=[${dataArry.join(',')}]`;
    console.log('select_ticket', delparam, url);
    await agent
      .post(url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(delparam)
      .then(res => {
        console.log(res.text);
      });
  }

  async delete_select_ticket(codes: string[], gid = '1') {
    await this.select_ticket(codes, 'sd', gid);
  }

  async add_select_ticket(codes: string[], gid = '1') {
    await this.select_ticket(codes, 'sa', gid);
  }

  async get_select_ticket() {
    var url = `${this.http}://${this.host}/cgi/cgi-bin/zixuananalysis/cmpStockList`;
    url += `?check=11&appid=${this.appid}&openid=${this.openid}&fskey=${this.fskey}&access_token=${this.access_token}`;
    url += `&g_openid=${this.g_openid}&uin=${this.uin}&_appName=android&_dev=OPPO+R7&_devId=${this._devId}&_mid=${this._mid}&_md5mid=1FB417C1C7BDA9B31C8976BCB11AA980&_appver=9.6.0&_ifChId=65&_screenW=1080&_screenH=1920&_osVer=5.1&_uin=${this.uin}&_wxuin=${this.uin}&_net=WIFI&__random_suffix=66264&_buildtype=store&buildtime=2021-11-24+16%3A07%3A27&lang=zh_CN`;
    return new Promise((resolve: (value: any) => void, reject: (value: any) => void) => {
      agent
        .get(url)
        .then((res: any) => {
          // console.log(res.body.data.groupInfoList);
          resolve(res.body.data.groupInfoList);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export const ticketHelper = new TicketHelper();
