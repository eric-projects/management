import path from 'path';
var mysql = require('mysql');
import { environment } from '../environment';

var connection = mysql.createConnection({
  host: environment.mysql.host,
  port: environment.mysql.port || 3306,
  user: environment.mysql.user,
  password: environment.mysql.password,
  database: environment.mysql.database,
});

connection.connect();
class SqlHelper {
  TypeString = 'varchar(255)';
  TypeText = 'text';
  TypeNumber = 'real';
  TypeBLOB = 'blob';
  TypeDate = 'datetime';
  TypeNumberOrBigInt = 'bigint';

  private queryPrivateKeys = ['_index', '_size', '_wexpr'];

  // /**
  //  * 创建数据库
  //  * @param dbName 数据库
  //  * @returns
  //  */
  // async init_db(dbName: string) {
  //   const filePath = path.resolve(__dirname, `../data/${dbName}.db`);
  //   return new Database(filePath, { verbose: console.log });
  // }

  /**
   * 判断表是否存在
   * @param tbName 表
   * @param dbName 数据库
   */
  async exist_table(tbName: string, dbName: string = '') {
    // var sql = `SELECT count(1) as count FROM sqlite_master WHERE type='table' AND name = '${tbName}'`;
    var sql = `SHOW TABLES LIKE '%${tbName}%'`;
    console.log(sql);
    var result = await new Promise((resolve: (value: any) => void, reject: (value: any) => void) => {
      this.getdb(dbName).query(sql, function (err: any, result: any) {
        if (err) {
          console.log(err.message);
          reject(err.message);
        } else {
          resolve(result.length > 0);
        }
      });
    });
    console.log('res', result);
    return result;
  }

  /**
   * 创建表
   * @param tbName 表
   * @param fieldAndType 表字段
   * @param notNullKeys 必填字段
   * @param primaryKeys 主键字段
   * @param dbName 数据库
   */
  async init_table(tbName: string, fieldAndType: object, primaryKeys: string[] = [], notNullKeys: string[] = [], dbName: string = '') {
    var sqlArry = Object.keys(fieldAndType).map(m => {
      var nullStr = primaryKeys.includes(m) || notNullKeys.includes(m) ? 'NOT NULL' : '';
      return `${m} ${(fieldAndType as any)[m]} ${nullStr}`;
    });

    if (primaryKeys.length > 0) {
      sqlArry.push(`PRIMARY KEY (${primaryKeys.join(',')})`);
    }

    var sql = `create table if not exists \`${tbName}\`(${sqlArry.join(',')} )`;
    console.log('init_table', sql);
    await new Promise((resolve: (value: any) => void, reject: (value: any) => void) => {
      this.getdb(dbName).query(sql, function (err: any, res: any) {
        resolve(res);
      });
    });
  }

  /**
   * 查询数据
   * @param tbName 表
   * @param data 数据
   * @param wexpr where条件
   * @param dbName 数据库
   */
  async query(tbName: string, data: any, wexpr = '', dbName = '') {
    if (!tbName || !data || !(await this.exist_table(tbName))) {
      return '';
    }

    // {and:{a:1,b:2},or:{d:1,e:2}}
    // (a&b)|(d&e)&(f|(g&h))
    // (a,b),(d,e),(f,(g,h))
    // (a&(b||(c&d)))
    var whereExpr = wexpr || data._wexpr;
    if (whereExpr) {
      var keys = whereExpr.replace(/&/g, ',').replace(/\|/g, ',').replace(/\(/g, '').replace(/\)/g, '').split(',');
      keys.forEach((k: string) => {
        if (!k.includes('like')) {
          whereExpr = whereExpr.replace(k, `${k}=@${k}`);
        }
      });
      whereExpr = whereExpr.replace(/&/g, ' AND ').replace(/\|/g, ' OR ');
    } else {
      whereExpr = Object.keys(data)
        .filter(f => !this.queryPrivateKeys.includes(f))
        .map(m => {
          return `${m}=@${m}`;
        })
        .join(' AND ');
    }

    var whereStr = whereExpr ? ` WHERE ${whereExpr}` : '';
    var sql = `SELECT * FROM ${tbName} ${whereStr} `;
    console.log(sql);
    return new Promise((resolve: (value: any) => void, reject: (value: any) => void) => {
      this.getdb(dbName).query(sql, function (err: any, result: any) {
        if (err) {
          reject(err.message);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * 查询分页数据
   * @param tbName 表
   * @param data 数据
   * @param wexpr where条件
   * @param dbName 数据库
   */
  async query_page(tbName: string, data: any, index = 0, size = 10, wexpr: string = '', dbName: string = '') {
    // console.log(tbName, data, wexpr);
    if (!tbName || !data || !(await this.exist_table(tbName))) {
      return '';
    }

    // {and:{a:1,b:2},or:{d:1,e:2}}
    // (a&b)|(d&e)&(f|(g&h))
    // (a,b),(d,e),(f,(g,h))
    // (a&(b||(c&d)))
    var whereExpr = wexpr || data._wexpr;
    if (whereExpr) {
      var keys = whereExpr.replace(/&/g, ',').replace(/\|/g, ',').replace(/\(/g, '').replace(/\)/g, '').split(',');
      keys.forEach((k: string) => {
        if (!k.includes('like')) {
          whereExpr = whereExpr.replace(k, `${k}=@${k}`);
        }
      });

      whereExpr = whereExpr.replace(/&/g, ' AND ').replace(/\|/g, ' OR ');
    } else {
      whereExpr = Object.keys(data)
        .filter(f => !this.queryPrivateKeys.includes(f))
        .map(m => {
          return `${m}=@${m}`;
        })
        .join(' AND ');
    }

    var whereStr = whereExpr ? ` WHERE ${whereExpr}` : '';
    var sql = `SELECT * FROM ${tbName} ${whereStr} `;
    console.log(sql);
    var indexT = data._index || index;
    var countSql = '';
    if (indexT > 0) {
      var sizeT = data._size || size || 10;
      var limitS = (indexT - 1) * sizeT;
      sql += ` LIMIT ${limitS},${sizeT}`;
      countSql = `SELECT COUNT(1) AS count from ${tbName} ${whereStr}`;
      // count = this.getdb(dbName).query(`SELECT COUNT(1) AS count from ${tbName} ${whereStr}`).get(data).count;
    }
    var that = this;
    return new Promise((resolve: (value: any) => void, reject: (value: any) => void) => {
      this.getdb(dbName).query(sql, function (err: any, result: any) {
        if (err) {
          console.log(err.message);
          reject(err.message);
        } else {
          if (countSql) {
            that.getdb(dbName).query(countSql, function (err: any, cresult: any) {
              resolve({ items: result, total: cresult });
            });
          } else {
            resolve({ items: result, total: 0 });
          }
        }
      });
    });
  }

  /**
   * 插入行数据
   * @param tbName 表
   * @param data 数据
   * @param fields 操作字段
   * @param dbName 数据库
   */
  async insert(tbName: string, data: any, fields: string[] = [], dbName: string = '') {
    // console.log('insert', tbName, data);
    if (!tbName || !data || !(await this.exist_table(tbName))) {
      return false;
    }

    if (fields.length === 0) {
      fields = Object.keys(data);
    }

    var emtyF: any = [];
    var dArry: any = [];
    fields.forEach(m => {
      if (data[m]) {
        dArry.push(`'${data[m]}'`);
      } else {
        emtyF.push(m);
      }
    });

    var sql = `INSERT INTO ${tbName} (${fields.filter(f => !emtyF.includes(f)).join(',')}) VALUES (${dArry.join(',')})`;
    console.log(sql);
    return new Promise((resolve: (value: any) => void, reject: (value: any) => void) => {
      this.getdb(dbName).query(sql, function (err: any, result: any) {
        if (err) {
          console.log(err.message);
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * 更新行数据
   * @param tbName 表
   * @param rowKey 主键
   * @param data 数据
   * @param fields 操作字段
   * @param dbName 数据库
   */
  async update_row(tbName: string, rowKey: string, data: object, fields: string[] = [], dbName: string = '') {
    console.log(tbName, rowKey);
    if (!rowKey || !tbName || !data || !(await this.exist_table(tbName))) {
      return false;
    }

    let fArry = [];
    if (fields.length > 0) {
      fArry = fields.map(m => m + '=@' + m);
    } else {
      fields = Object.keys(data).filter(f => !this.queryPrivateKeys.includes(f));
      fArry = fields.map(m => m + '=@' + m);
    }
    var sql = `UPDATE ${tbName} SET ${fArry.join(',')} WHERE ${rowKey}='${(data as any)[rowKey]}'`;
    console.log(sql);
    return new Promise((resolve: (value: any) => void, reject: (value: any) => void) => {
      this.getdb(dbName).query(sql, function (err: any, result: any) {
        if (err) {
          console.log(err.message);
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * 删除行数据
   * @param tbName 表
   * @param rowKey 主键
   * @param data 数据
   * @param dbName 数据库
   */
  async delete_row(tbName: string, rowKey: string, data: any, dbName: string = '') {
    if (!rowKey || !tbName || !data || !(await this.exist_table(tbName))) {
      return false;
    }

    var rowValue = data;
    if (data instanceof Object) {
      rowValue = (data as any)[rowKey];
    }

    var sql = `DELETE ${tbName} WHERE ${rowKey}=${rowValue}`;
    console.log(sql);
    return new Promise((resolve: (value: any) => void, reject: (value: any) => void) => {
      this.getdb(dbName).query(sql, function (err: any, result: any) {
        if (err) {
          console.log(err.message);
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * 执行sql 语句
   * @param sql sql语句
   * @param dbName 数据库
   */
  async exec_sql(sql: string, dbName: string = '') {
    console.log(sql);
    this.getdb(dbName).query(sql);
  }

  private getdb(dbName: string = '') {
    // var db = dbContext;
    // if (dbName) {
    //   db = this.init_db(dbName);
    // }
    return connection;
  }
}

export const sqldb = new SqlHelper();
