import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { httpHelper, toCasedStyleObject } from '@/common/utils';
import { menuService } from '../menu';
import { User } from './auth.types';

class AuthService {
  user: User = {};
  logoutUri = '';
  adminUri = '';

  private setAuthState(data: any) {
    this.logoutUri = data.logoutUri;
    delete data.logoutUri;
    this.adminUri = data.adminUri;
    delete data.adminUri;
    this.user = data;

    menuService.updateAuthorization(this.user.featrues);
  }

  getAuthState() {
    return httpHelper.get('/auth/state').pipe(
      tap(data => {
        this.setAuthState(data);
        return data;
      })
    );
  }

  login(account: string, password: string, nonce: string, code: string): Observable<void> {
    return httpHelper.post('/auth/state', { account: account, password: password, nonce: nonce, captcha: code });
  }

  logout(): Observable<void> {
    return httpHelper.delete('/auth/state');
  }

  impersonateout(): Observable<void> {
    return httpHelper.delete('/auth/impersonate');
  }

  checkAnonymousInstanceViewState(number: string, taskId: string, token: string): Observable<void> {
    return httpHelper.get(
      `/api/platform/v1/instances/${number}/user-state`,
      {
        params: toCasedStyleObject({ taskId: taskId, token: token }),
      },
      {
        loading: false,
      }
    );
  }
}

export const authService = new AuthService();
