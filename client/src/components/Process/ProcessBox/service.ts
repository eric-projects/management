import { Observable, of } from 'rxjs';

import { httpHelper } from '@/common/utils';

class ProcessBoxService {
  setFavorite(processId: string): Observable<string> {
    const url = `/api/process/v1/processes/${processId}/favorite-processes`;
    return httpHelper.post(url, {}, {}, { loading: false });
  }

  getModalData(): Observable<string> {
    return of('内容');
  }
}

export const processBoxService = new ProcessBoxService();
