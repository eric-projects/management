import { Modal } from 'ant-design-vue';
import { ModalOptions } from 'ant-design-vue/types/modal';
import { AxiosError } from 'axios';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { notificationHelper } from './notification-helper';
import { i18nHelper } from './i18n-helper';

class HttpErrorHandler {
  private error$ = new Subject<any>();

  throw(error: AxiosError<any>, uuid?: string) {
    let errorMessage;
    let donotAlert = false;
    if (error.response) {
      errorMessage = error.response.data;
      if (error.response.status === 401) {
        donotAlert = true;
      } else if (error.response.status === 440) {
        errorMessage = i18nHelper.getLocale('framework.state-timeout-relogin');
        const loginUrl = error.response.data;
        const options: ModalOptions = {
          keyboard: false,
          maskClosable: false,
          title: i18nHelper.getLocale('framework.state-timeout'),
          content: i18nHelper.getLocale('framework.state-timeout-relogin-help'),
          onOk: () => {
            window.location.href = loginUrl;
          },
        };
        Modal.confirm(options);
      }
    } else {
      errorMessage = error.message;
    }
    if (!donotAlert) {
      notificationHelper.error(errorMessage, i18nHelper.getLocale('framework.request-failed'));
    }
    (error as any).uuid = uuid;
    this.error$.next(error);
  }

  handle(uuid?: string): Observable<AxiosError<any>> {
    return this.error$.pipe(
      map(error => {
        if (!error || error.uuid !== uuid) {
          return undefined;
        } else {
          return error;
        }
      })
    );
  }
}

export const httpErrorHandler = new HttpErrorHandler();
