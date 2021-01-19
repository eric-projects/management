export class AuthorizationDto {
  constructor(
    public user?: string,
    public authorizedUser?: string,
    public startDate?: string,
    public endDate?: string,
    public processName?: string
  ) {}
}

export interface TreeDto {
  key: string;
  title: string;
  children: TreeDto[];
}
