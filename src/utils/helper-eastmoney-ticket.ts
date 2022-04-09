import agent from 'superagent';
class TicketDFHelper {
  async get_df_ticket(type: string) {
    var url = '5.push2.eastmoney.com/api/qt/clist/get?pn=1&pz=4000&fs=' + type;
    console.log(url);
    return new Promise((resolve: (value: any) => void, reject: (value: any) => void) => {
      agent
        .get(url)
        .then((res: any) => {
          resolve(Object.values(res.body.data.diff));
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export const ticketdfHelper = new TicketDFHelper();
