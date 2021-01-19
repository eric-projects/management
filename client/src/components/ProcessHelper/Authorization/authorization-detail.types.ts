export class AuthorizationDetailDto {
  constructor(
    public id?: number,
    public userId?: string,
    public userName?: string,
    public authorizedUserId?: string,
    public authorizedUserName?: string,
    public startDate?: string,
    public endDate?: string,
    public remark?: string,
    public processIds?: string[]
  ) {}
}
