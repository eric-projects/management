import { Observable, of } from 'rxjs';
import { httpHelper } from '@/common/utils';

class LoginCaptchaService {
  getCaptchaBase64String(nonce: string): Observable<string> {
    return httpHelper.get('/auth/captcha', { params: { nonce: nonce } }, { loading: false });
  }
}

export const loginCaptchaService = new LoginCaptchaService();
