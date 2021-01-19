import { Observable } from 'rxjs';

import { httpHelper } from '@/common/utils';
import { ProxyDto } from './proxy.types';

class ProxyService {
  getAgents(): Observable<ProxyDto> {
    const _url = `/api/process/v1/agents`;
    return httpHelper.get(_url);
  }

  updateAgent(data: ProxyDto): Observable<void> {
    const _url = `/api/process/v1/agents`;
    return httpHelper.post(_url, data);
  }
}

export const proxyService = new ProxyService();
