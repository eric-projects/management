import { downloadHelper } from '@/common/utils';
import { Observable } from 'rxjs';

class DocumentService {
  downDocument(id: string, name: string): Observable<any> {
    const _url = `/api/platform/v1/documents/download/${id}`;
    return downloadHelper.get(_url, name);
  }
}

export const documentService = new DocumentService();
