import { environment } from '../environment';
import Redis from 'ioredis';

class RedisHelper {
  redis: any;
  constructor() {
    /**
          redisConfig: {
              prefix: 'DATASESS', //redis前缀
              dataPrefix: 'DATAPREFIX',   //redis数据存储前缀
              port: 6379, //端口
              host: '0.0.0.0',    //你的redisIP
              password: 'xxxxxx', //你的redis密码 无密码可以为空
              db: 0,  //默认存储库
              ttl: 60 * 60 * 24, //过期时间
              options: {} //其它配置
          },
       */
    this.redis = new Redis({
      host: environment.session.redis.host,
      port: environment.session.redis.port,
      password: environment.session.redis.password,
      db: environment.session.redis.dataDB,
    });
  }

  /**
   * 获取redis的data
   * @param {*} key
   */
  async getData(key: string, modulePath: string) {
    try {
      // const KEY = getUCMd5(key); //转成大写的MD5作为key
      const data = await this.redis.get(`${modulePath}:${key}`);
      if (data && typeof data === 'string') {
        return JSON.parse(data);
      } else {
        return data;
      }
    } catch (error) {
      console.error(`设置data出错:`, error);
    }
  }

  /**
   * 获取redis的hash data
   * @param {*} key
   */
  async hgetData(key: string, modulePath: string) {
    try {
      // const KEY = getUCMd5(key); //转成大写的MD5作为key
      const data = key ? await this.redis.hget(modulePath, key) : await this.redis.hgetall(modulePath);
      if (data && typeof data === 'string') {
        return JSON.parse(data);
      } else if (data && typeof data === 'object') {
        const result: any = [];
        console.log(data);
        Object.keys(data).forEach((k: string) => {
          result.push({ ...JSON.parse(data[k]), rk: k });
        });

        return result;
      } else {
        return data;
      }
    } catch (error) {
      console.error(`设置data出错:`, error);
    }
  }

  /**
   * 设置redis data
   * @param {*} key
   * @param {*} data
   * @param {*} maxAge
   * @param {*} ex
   */
  async setData(key: string, data: any, modulePath: string, maxAge = 60 * 60 * 24, ex = 'EX') {
    let status = null;
    try {
      // const KEY = getUCMd5(key); //转成大写的MD5作为key
      if (data && typeof data === 'object') {
        status = await this.redis.set(`${modulePath}:${key}`, JSON.stringify(data), ex, maxAge);
      } else {
        status = await this.redis.set(`${modulePath}:${key}`, data, ex, maxAge);
      }
    } catch (error) {
      console.error(`设置data出错:`, error);
    }
    return status === 'OK';
  }

  /**
   * 设置redis hash data
   * @param {*} key
   * @param {*} data
   */
  async hsetData(key: string, data: any, modulePath: string) {
    let status = null;
    try {
      // const KEY = getUCMd5(key); //转成大写的MD5作为key
      if (data && typeof data === 'object') {
        status = await this.redis.hset(modulePath, key, JSON.stringify(data));
      } else {
        status = await this.redis.hset(modulePath, key, data);
      }
    } catch (error) {
      console.error(`设置data出错:`, error);
    }
    return status === 'OK';
  }

  /**
   * 删除redis的data
   * @param redisKey redis key
   * @param hkey hash key
   * @returns
   */
  async delData(redisKey: string, hkey: string) {
    let status = null;
    try {
      // const KEY = getUCMd5(key); //转成大写的MD5作为key
      status = hkey ? await this.redis.hdel(redisKey, hkey) : this.redis.del(`${redisKey}:${hkey}`);
    } catch (error) {
      console.error(`删除data出错:`, error);
    }
    return status > 0;
  }
}

export const redisHelper = new RedisHelper();
