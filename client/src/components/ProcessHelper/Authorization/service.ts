import { Observable } from 'rxjs';

import { httpHelper } from '@/common/utils';

class AuthorizationService {
  getAuthorizations(param: any): Observable<{ total: number; items: any[] }> {
    const _url = `/api/process/v1/authorizations`;
    return httpHelper.get(_url, { params: param });
  }

  getAuthorization(id: string): Observable<any> {
    const _url = `/api/process/v1/authorizations/${id}`;
    return httpHelper.get(_url);
  }

  addAuthorization(data: any): Observable<void> {
    const _url = `/api/process/v1/authorizations`;
    return httpHelper.post(_url, data);
  }

  updateAuthorization(id: string, data: any): Observable<void> {
    const _url = `/api/process/v1/authorizations/${id}`;
    return httpHelper.put(_url, data);
  }

  deleteAuthorization(id: string): Observable<void> {
    const _url = `/api/process/v1/authorizations/${id}`;
    return httpHelper.delete(_url);
  }
}

export const authorizationService = new AuthorizationService();
