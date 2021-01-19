export interface PopoverDataDto {
  account?: string;
  birthday?: string;
  email?: string;
  gender?: string;
  id?: string;
  lock?: number;
  name?: string;
  number?: number;
  phoneNumber?: number;
  positions?: UserPosition[];
  remark?: string;
  roles?: object;
  avatar?: string;
  organizationPath?: string;
  positionLevelName?: string;
  departmentName?: string;
}

export interface UserPosition {
  name: string;
  departmentName: string;
}
