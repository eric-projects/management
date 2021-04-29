import { downloadHelper, httpHelper } from '@/common/utils';
import { Observable } from 'rxjs';
import { ToolDataModule } from '../common/types';

class DocumentService {
  downDocument(id: string, name: string): Observable<any> {
    const _url = `/api/platform/v1/documents/download/${id}`;
    return downloadHelper.get(_url, name);
  }

  uploadStr(module: ToolDataModule, filePath: string, content: string) {
    const _url = `/api/upload/string`;
    return httpHelper.post(_url, { data: content, path: `${module}/${filePath}` });
  }
}

export const documentService = new DocumentService();
