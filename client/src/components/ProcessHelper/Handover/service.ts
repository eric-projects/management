import { Observable } from 'rxjs';

import { httpHelper } from '@/common/utils';
import { GroupProcessDto } from './handover.types';

class HandoverService {
  getProcesses(): Observable<GroupProcessDto[]> {
    const _url = `/api/process/v1/group-processes`;
    return httpHelper.get(_url);
  }

  AddHandoverProcesses(data: any): Observable<void> {
    const _url = `/api/process/v1/handovers`;
    return httpHelper.post(_url, data);
  }
}

export const handoverService = new HandoverService();
