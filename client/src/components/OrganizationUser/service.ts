import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { httpHelper, guidHelper, toCasedStyleObject } from '@/common/utils';
import { TreeItem, DepartmentTreeSelectDto } from './types';

class OrganizationUserService {
  getDepartmentTree(id?: string, value?: string): Observable<TreeItem[]> {
    const _url = `/api/platform/v1/tree-departments`;
    return httpHelper.get(_url, { params: toCasedStyleObject({ parentId: value }) }, { loading: false }).pipe(
      map(data =>
        data.map((item: DepartmentTreeSelectDto) => ({
          id: guidHelper.generate(),
          pId: id,
          value: item.value,
          title: item.label,
          datum: item,
          scopedSlots: { icon: 'icon' },
        }))
      )
    );
  }

  getUsersByDepartment(id: string) {
    const _url = `/api/platform/v1/departments/${id}/select-users`;
    return httpHelper.get(_url, undefined, { loading: false }).pipe(
      map(data =>
        data.map((item: any) => ({
          id: guidHelper.generate(),
          pId: id,
          value: item.value,
          title: `${item.label}(${item.account},${item.fullDivision})`,
          isLeaf: true,
          scopedSlots: { icon: 'icon' },
          datum: item,
        }))
      )
    );
  }

  searchUsers(kw: string) {
    const _url = `/api/platform/v1/select-users`;
    return httpHelper.get(_url, { params: { keyword: kw, count: '20' } }, { loading: false }).pipe(
      map(data =>
        data.map((item: any) => ({
          value: item.value,
          title: `${item.label}(${item.account},${item.fullDivision})`,
          isLeaf: true,
          scopedSlots: { icon: 'icon' },
          datum: item,
        }))
      )
    );
  }
}

export const organizationUserService = new OrganizationUserService();
