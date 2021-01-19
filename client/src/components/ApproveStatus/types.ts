/**
 * 审批 状态枚举
 */
export enum ApproveState {
  start = 'start',
  ready = 'ready',
  processing = 'processing',
  approved = 'approved',
  refused = 'refused',
  canceled = 'canceled',
  rejected = 'rejected',
  todo = 'todo',
}

/**
 * 完成的审批状态
 */
export const completedStatuses = [ApproveState.approved, ApproveState.refused, ApproveState.canceled];

export interface StatusValueDto {
  state: ApproveState;
  name: string;
}
