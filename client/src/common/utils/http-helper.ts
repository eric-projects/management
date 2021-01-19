import axios, { AxiosResponse, AxiosError } from 'axios';
import { from, throwError } from 'rxjs';
import { catchError, map, tap, take } from 'rxjs/operators';

import { httpErrorHandler } from './http-error-handler';
import { globalLoadingHelper } from './global-loading-helper';
import { toCasedStyleObject } from './convert-helper';

const headers = {
  contentType: 'application/json;charset=utf-8',
  cacheControl: 'no-cache',
  pragma: 'no-cache',
};
const request = axios.create({
  headers: toCasedStyleObject(headers, 'bigKebab'),
});

/**
 * Http 助手类
 */
class HttpHelper {
  /**
   * 将错误请求清空，由 httpErrorHandler 单独处理，忽略错误
   */
  private errorHandler(error: AxiosError<any>, uuid?: string) {
    globalLoadingHelper.destroy();
    httpErrorHandler.throw(error, uuid);
    return throwError(error);
  }

  /**
   * 将返回的数据直接抛出
   */
  private responseMap(response: AxiosResponse<any> | undefined) {
    return !response ? undefined : response.data;
  }

  /**
   * 准备请求中的额外配置，修正初始值、准备 loading 等
   * @param extraOptions 额外配置
   */
  private prepareExtraOptions(extraOptions?: ExtraOptions) {
    const extra = Object.assign({ urlPrefix: '' }, extraOptions);
    if (extra.loading || extra.loading === undefined) {
      globalLoadingHelper.create();
    }
    return extra;
  }

  /**
   * 所有请求结束的 loading 释放信号
   * @param extraOptions 额外配置
   */
  private loadingRelease(loading?: boolean) {
    if (loading || loading === undefined) {
      globalLoadingHelper.destroy();
    }
  }

  /**
   * GET
   * @param url URL
   * @param options Axios 配置选项
   * @param extraOptions 额外配置选项
   */
  get(url: string, options?: Options, extraOptions?: ExtraOptions) {
    const extra = this.prepareExtraOptions(extraOptions);
    return from(request.get(extra.urlPrefix + url, options)).pipe(
      tap(() => this.loadingRelease(extra.loading)),
      catchError(err => this.errorHandler(err, extra.uuid)),
      map(this.responseMap),
      take(1)
    );
  }

  /**
   * POST
   * @param url URL
   * @param body 请求体
   * @param options Axios 配置选项
   * @param extraOptions 额外配置选项
   */
  post(url: string, body?: any, options?: Options, extraOptions?: ExtraOptions) {
    const extra = this.prepareExtraOptions(extraOptions);
    return from(request.post(extra.urlPrefix + url, body, options)).pipe(
      tap(() => this.loadingRelease(extra.loading)),
      catchError(err => this.errorHandler(err, extra.uuid)),
      map(this.responseMap),
      take(1)
    );
  }

  /**
   * PUT
   * @param url URL
   * @param body 请求体
   * @param options Axios 配置选项
   * @param extraOptions 额外配置选项
   */
  put(url: string, body?: any, options?: Options, extraOptions?: ExtraOptions) {
    const extra = this.prepareExtraOptions(extraOptions);
    return from(request.put(extra.urlPrefix + url, body, options)).pipe(
      tap(() => this.loadingRelease(extra.loading)),
      catchError(err => this.errorHandler(err, extra.uuid)),
      map(this.responseMap),
      take(1)
    );
  }

  /**
   * DELETE
   * @param url URL
   * @param options Axios 配置选项
   * @param extraOptions 额外配置选项
   */
  delete(url: string, options?: Options, extraOptions?: ExtraOptions) {
    const extra = this.prepareExtraOptions(extraOptions);
    return from(request.delete(extra.urlPrefix + url, options)).pipe(
      tap(() => this.loadingRelease(extra.loading)),
      catchError(err => this.errorHandler(err, extra.uuid)),
      map(this.responseMap),
      take(1)
    );
  }
}

/**
 * Axios 配置选项
 */
export interface Options {
  /**
   * 请求头
   */
  headers?: {
    [header: string]: string | string[];
  };
  /**
   * QueryString
   */
  params?: {
    [param: string]: string | string[];
  };
  /**
   * 相应体类型
   */
  responseType?: any;
}

/**
 * 额外配置项
 */
export interface ExtraOptions {
  /**
   * 请求唯一标识，保证项目全局唯一性
   */
  uuid?: string;
  /**
   * URL 前缀
   */
  urlPrefix?: string;
  /**
   * 是否显示整页加载动画
   */
  loading?: boolean;
}

export const httpHelper = new HttpHelper();

// 暴露出去以供自定义开发表单使用
(window as any).httpHelper = httpHelper;
