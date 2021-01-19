import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValueLabelPair } from '@/common/defines';

import { httpHelper, toCasedStyleObject } from '@/common/utils';
import { BusinessTypeTreeSelectDto, BusinessTypeDto } from './types';

class BusinessTypeTreeSelectService {
  getBusinessTypes(withInAuthority: boolean, onlyShowTop: boolean): Observable<BusinessTypeTreeSelectDto[]> {
    const domainOb = httpHelper.get(`/api/platform/v1/select-domains`, {}, { loading: false });
    const businessTypeOb = httpHelper.get(
      `/api/process/v1/tree-business-types`,
      { params: toCasedStyleObject({ withInAuthority: withInAuthority, onlyShowTop: onlyShowTop }) },
      { loading: false }
    );

    return zip(domainOb, businessTypeOb).pipe(
      map(m => {
        const [domains, businessTypes] = m;
        let result: BusinessTypeTreeSelectDto[] = [];
        domains.forEach((f: ValueLabelPair) => {
          const domainBt = businessTypes.filter((bt: BusinessTypeDto) => bt.domain === f.value);
          if (!withInAuthority || domainBt.length > 0) {
            result = [
              ...result,
              { id: f.value + '', value: f.value + '', selectable: false, title: f.label },
              ...this.transferBusinessTypeTree(domainBt, f.value + ''),
            ];
          }
        });
        return result;
      })
    );
  }

  private transferBusinessTypeTree(data: BusinessTypeDto[], pid: string): BusinessTypeTreeSelectDto[] {
    let result: BusinessTypeTreeSelectDto[] = [];
    data.forEach(m => {
      result.push({ id: m.value + '', value: m.value + '', title: m.label, pId: pid });
      if (m.children.length > 0) {
        result = [...result, ...this.transferBusinessTypeTree(m.children, m.value + '')];
      }
    });

    return result;
  }
}

export const businessTypeTreeSelectService = new BusinessTypeTreeSelectService();
