import { Observable } from 'rxjs';

import { httpHelper } from '@/common/utils';

class RichTextService {
  upload(file: any): Observable<any> {
    const _url = `/api/platform/v1/documents/form-files-upload`;
    const formData = new FormData(); formData.append('file', file);
    return httpHelper.post(_url, formData);
  }
}

export const richTextService = new RichTextService();
