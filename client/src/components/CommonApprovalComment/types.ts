export interface CommonApprovalCommentDto {
  approvalCommentId: string;
  subject: string;
  content: string;
  userId?: string;
  isEdit: boolean;
  isAdd: boolean;
}
