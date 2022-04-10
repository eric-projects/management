import jwt from 'jsonwebtoken';
class JwtHelper {
  defaultKey = 'cgqcdycbb';

  /**
   * jwt 加密
   * @param jwtKey key
   * @param jwtData 数据
   * @param expires 过期时间（秒）
   * @returns
   */
  encrypt(jwtKey: string, jwtData: any, expires: number = 0) {
    const option: any = {};
    if (expires) {
      option.expiresIn = expires;
    }
    return jwt.sign({ data: jwtData }, jwtKey, option);
  }
  /**
   * jwt解密
   */
  decrypt(jwtKey: string, jwtData: any, checkExpires: boolean = true) {
    let jwtResult = '';
    const option: any = {};
    if (!checkExpires) {
      option.ignoreExpiration = true;
    }
    // ignoreExpiration 忽略过期
    try {
      jwt.verify(jwtData, jwtKey, option, (err: any, res: any) => {
        if (err) {
          jwtResult = err.message;
        } else if (res) {
          jwtResult = res.data || res.nameid;
        }
        // this.jwtError = err.message;
      });
    } catch (error) {
      jwtResult = error as any;
    }
    return jwtResult;
  }
}

export const jwtHelper = new JwtHelper();
