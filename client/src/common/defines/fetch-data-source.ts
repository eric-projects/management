import { Observable } from 'rxjs';

/**
 * 主动取数据类
 */
export interface FetchDataSourceDto<T> {
  /**
   * 参数
   */
  params: any;

  /**
   * 回调
   */
  callback: (data: T | Observable<T>) => void;
}

export class PropWatchDto<T> {
  private flag: string;
  constructor(public data: T) {
    this.flag = new Date().toString();
  }
}
