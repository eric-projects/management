import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { httpHelper } from '@/common/utils';

class ProcessDiagramService {
  getUrl(): Observable<string> {
    const _url = `/api/process/v1/bpmn-url`;
    return httpHelper.get(_url, undefined, { loading: false });
  }
}

export const processDiagramService = new ProcessDiagramService();
