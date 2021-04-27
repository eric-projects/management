import { Observable } from 'rxjs';

import logo from '@/assets/images/logo.png';
import { ValueLabelPair } from '@/common/defines';
import { httpHelper } from '@/common/utils';
import { ToolDataKeys, ToolDataModule, ToolDataType } from './types';

class CommonService {
  rowKey = 'k_id';
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

  /**
   * 添加数据
   * @param module 模块
   * @param key 键
   * @param dataType 数据类型
   * @param data 数据
   * @returns
   */
  postData(module: ToolDataModule, key: ToolDataKeys, dataType: ToolDataType, data: any): Observable<any> {
    const _url = `/api/${module}/${key}`;
    console.log(data);
    return httpHelper.post(_url, data, { params: { dataType: dataType } });
  }

  /**
   * 获取数据
   * @param module 模块
   * @param key 键
   * @param query 参数
   * @returns 数据
   */
  getData(module: ToolDataModule, key: ToolDataKeys, query: any): Observable<any> {
    const _url = `/api/${module}/${key}`;
    console.log('search', query);
    return httpHelper.get(_url, { params: query });
  }

  /**
   * 删除数据
   * @param module 模块
   * @param key 键
   * @param dataType 数据类型
   * @param param 删除条件
   */
  deleteData(module: ToolDataModule, key: ToolDataKeys, dataType: ToolDataType, param: any): Observable<any> {
    const _url = `/api/${module}/${key}`;
    return httpHelper.delete(_url, { params: { ...param, dataType: dataType } });
  }
}

export const commonService = new CommonService();
