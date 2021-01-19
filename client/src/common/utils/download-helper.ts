import { Observable, from } from 'rxjs';

class DownloadHelper {
  get(url: string, filename: string, params?: any): Observable<any> {
    return from(this.promiseGenerate(url, filename, undefined, params));
  }

  post(url: string, filename: string, body?: any, params?: any): Observable<any> {
    return from(this.promiseGenerate(url, filename, body, params, 'post'));
  }

  private promiseGenerate(url: string, filename: string, body?: any, params?: any, method: 'get' | 'post' = 'get') {
    return new Promise((resolve, reject) => {
      let paramsString = '';
      if (params) {
        Object.keys(params).forEach((key: string, index: number) => {
          paramsString += `${index === 0 ? '?' : '&'}${key}=${encodeURI(params[key])}`;
        });
      }
      const xhr = new XMLHttpRequest();
      xhr.open(method, `${url}${paramsString}`);
      xhr.responseType = 'blob';
      if (method === 'post') {
        xhr.send(JSON.stringify(body));
      } else {
        xhr.send();
      }
      xhr.onload = function(e) {
        const blob = new Blob([this.response]);
        if (this.status === 200) {
          const a = document.createElement('a');
          document.body.appendChild(a);
          let blobUurl;
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
          } else {
            blobUurl = window.URL.createObjectURL(blob);
            a.href = blobUurl;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(blobUurl);
          }
          resolve(undefined);
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setTimeout(() => {
              reject(reader.result);
            }, 3000);
          };
          reader.readAsText(blob);
        }
      };
    });
  }
}

export const downloadHelper = new DownloadHelper();
