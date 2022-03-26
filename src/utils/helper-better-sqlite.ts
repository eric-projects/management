import path from 'path';
const Database = require('better-sqlite3');

// https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md
var dbContext = new Database(path.resolve(__dirname, `../data/tool.db`), { verbose: console.log });
class SqliteBetterHelper {
  TypeString = 'TEXT';
  TypeNumber = 'REAL';
  TypeBLOB = 'BLOB';
  TypeNumberOrBigInt = 'INTEGER';

  /**
   * 创建数据库
   * @param dbName 数据库
   * @returns
   */
  init_db(dbName: string) {
    const filePath = path.resolve(__dirname, `../data/${dbName}.db`);
    return new Database(filePath, { verbose: console.log });
  }

  /**
   * 创建表
   * @param tbName 表
   * @param fieldAndType 表字段
   * @param notNullKeys 必填字段
   * @param primaryKeys 主键字段
   * @param dbName 数据库
   */
  init_table(tbName: string, fieldAndType: object, notNullKeys: string[], primaryKeys: string[] = [], dbName: string = '') {
    var sqlArry = Object.keys(fieldAndType).map(m => {
      var nullStr = primaryKeys.includes(m) || notNullKeys.includes(m) ? 'NOT NULL' : '';
      return `${m} ${(fieldAndType as any)[m]} ${nullStr}`;
    });

    if (primaryKeys.length > 0) {
      sqlArry.push(`PRIMARY KEY (${primaryKeys.join(',')})`);
    }

    var sql = `create table if not exists ${tbName}(${sqlArry.join(',')} )`;
    this.getdb(dbName).exec(sql);
  }

  /**
   * 查询数据
   * @param tbName 表
   * @param data 数据
   * @param dbName 数据库
   */
  query(tbName: string, data: object, expr: string, dbName: string = '') {
    if (!!tbName || !data) {
      return false;
    }

    // {and:{a:1,b:2},or:{d:1,e:2}}
    // (a&b)|(d&e)&(f|(g&h))
    // (a,b),(d,e),(f,(g,h))
    // (a&(b||(c&d)))
    var keys = expr.replace(/&/g, ',').replace(/|/g, ',').replace(/\(/g, '').replace(/)/g, '').replace(/ /g, '').split(',');
    keys.forEach(k => {
      expr = expr.replace(k, `${k}=@${k}`);
    });

    var sql = `SELECT * FROM WHERE ${expr}`;
    console.log(sql);
    const stmt = this.getdb(dbName).prepare(sql);
    stmt.all(data);
    return true;
  }

  /**
   * 插入行数据
   * @param tbName 表
   * @param data 数据
   * @param fields 操作字段
   * @param dbName 数据库
   */
  insert(tbName: string, data: object, fields: string[] = [], dbName: string = '') {
    if (!!tbName || !data) {
      return false;
    }

    let fArry = [];
    if (fields.length > 0) {
      fArry = fields.map(m => '@' + m);
    } else {
      fields = Object.keys(data);
      fArry = fields.map(m => '@' + m);
    }

    var sql = `INSERT INTO ${tbName} (${fields.join(',')}) VALUES (${fArry.join(',')})`;
    console.log(sql);
    const stmt = this.getdb(dbName).prepare(sql);
    stmt.run(data);
    return true;
  }

  /**
   * 更新行数据
   * @param tbName 表
   * @param rowKey 主键
   * @param data 数据
   * @param fields 操作字段
   * @param dbName 数据库
   */
  update_row(tbName: string, rowKey: string, data: object, fields: string[] = [], dbName: string = '') {
    if (!rowKey || !tbName || !data) {
      return false;
    }

    let fArry = [];
    if (fields.length > 0) {
      fArry = fields.map(m => m + '=@' + m);
    } else {
      fields = Object.keys(data);
      fArry = fields.map(m => m + '=@' + m);
    }
    var sql = `UPDATE ${tbName} SET ${fArry.join(',')} WHERE ${rowKey}=${(data as any)[rowKey]}`;
    console.log(sql);
    const stmt = this.getdb(dbName).prepare(sql);
    stmt.run(data);
    return true;
  }

  /**
   * 删除行数据
   * @param tbName 表
   * @param rowKey 主键
   * @param data 数据
   * @param dbName 数据库
   */
  delete_row(tbName: string, rowKey: string, data: any, dbName: string = '') {
    if (!rowKey || !tbName || !data) {
      return false;
    }

    var rowValue = data;
    if (data instanceof Object) {
      rowValue = (data as any)[rowKey];
    }

    var sql = `DELETE ${tbName} WHERE ${rowKey}=${rowValue}`;
    console.log(sql);
    const stmt = this.getdb(dbName).prepare(sql);
    stmt.run(data);
    return true;
  }

  /**
   * 执行sql 语句
   * @param sql sql语句
   * @param dbName 数据库
   */
  exec_sql(sql: string, dbName: string = '') {
    console.log(sql);
    this.getdb(dbName).exec(sql);
  }

  private getdb(dbName: string = '') {
    var db = dbContext;
    if (dbName) {
      db = this.init_db(dbName);
    }
    return db;
  }
}

export const sqlitedb = new SqliteBetterHelper();
