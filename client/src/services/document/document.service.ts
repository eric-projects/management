import { Observable } from 'rxjs';

import { downloadHelper } from '@/common/utils';

class DocumentService {
  downDocument(id: string, name: string): Observable<any> {
    const _url = `/api/platform/v1/documents/download/${id}`;
    return downloadHelper.get(_url, name);
  }
}

export const documentService = new DocumentService();
