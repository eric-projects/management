import { Observable, of } from 'rxjs';
import { httpHelper } from '@/common/utils';
import { CommonApprovalCommentDto } from './types';

class CommonApprovalCommentService {
  get(): Observable<CommonApprovalCommentDto[]> {
    return httpHelper.get('/api/platform/v1/common-approval-comment');
  }

  delete(id: string): Observable<void> {
    return httpHelper.delete('/api/platform/v1/common-approval-comment/' + id);
  }

  save(comment: CommonApprovalCommentDto): Observable<void> {
    return httpHelper.post('/api/platform/v1/common-approval-comment', comment);
  }

  sort(comments: CommonApprovalCommentDto[]): Observable<void> {
    return httpHelper.post('/api/platform/v1/common-approval-comment/sort', comments);
  }
}

export const commonApprovalCommentService = new CommonApprovalCommentService();
