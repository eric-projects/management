import { Observable } from 'rxjs';

import { httpHelper } from '@/common/utils';
import { PopoverDataDto } from './types';

class UserInfoViewService {
  getUserInfo(id: string): Observable<PopoverDataDto> {
    const url = `/api/platform/v1/users/${id}`;
    return httpHelper.get(url, undefined, { loading: false });
  }
}

export const userInfoViewService = new UserInfoViewService();
