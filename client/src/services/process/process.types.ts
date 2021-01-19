export interface ProcessDto {
  id: string;
  name: string;
  groupName?: string;
  isFavorite: boolean;
}

export interface ProcessInfoDto {
  name?: string;
  introduction?: string;
  btid?: string;
}

export interface ProcessModuleState {
  baseInfo?: boolean;
  relation?: boolean;
  attachment?: boolean;
  record?: boolean;
}
