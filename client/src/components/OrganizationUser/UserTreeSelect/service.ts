import { Observable } from 'rxjs';

import { httpHelper } from '@/common/utils';
import { ValueLabelPair } from '@/common/defines';

class UserTreeSelectService {
  getDepartmentTree(params: any): Observable<ValueLabelPair[]> {
    const _url = `/api/platform/v1/tree-departments`;
    return httpHelper.get(_url, { params }, { loading: false });
  }

  getUsersByDepartment(id: string) {
    const _url = `/api/platform/v1/departments/${id}/select-users`;
    return httpHelper.get(_url, undefined, { loading: false });
  }
}

export const userSelectService = new UserTreeSelectService();
