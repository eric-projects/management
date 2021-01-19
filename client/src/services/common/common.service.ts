import { Observable } from 'rxjs';

import logo from '@/assets/images/logo.png';
import { ValueLabelPair } from '@/common/defines';
import { httpHelper } from '@/common/utils';

class CommonService {
  get logo() {
    return logo;
  }

  getDictionaries(params: string[]): Observable<{ [key: string]: ValueLabelPair[] } | ValueLabelPair[]> {
    let paramsString = '';
    params.forEach((item: string, index: number) => {
      paramsString += `${index === 0 ? '?' : '&'}group=${item}`;
    });
    const _url = `/api/platform/v1/select-dictionaries${paramsString}`;
    return httpHelper.get(_url, undefined, { loading: false });
  }

  getEnums(params: string[]): Observable<{ [key: string]: ValueLabelPair[] } | ValueLabelPair[]> {
    let paramsString = '';
    params.forEach((item: string, index: number) => {
      paramsString += `${index === 0 ? '?' : '&'}name=${item}`;
    });
    const _url = `/api/platform/v1/commons/enum-items${paramsString}`;
    return httpHelper.get(_url, undefined, { loading: false });
  }
}

export const commonService = new CommonService();
