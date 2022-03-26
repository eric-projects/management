import lowdb, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { utilHelper } from './helper-util';
import path from 'path';
const sqlite3 = require('sqlite3').verbose();

// https://github.com/typicode/lowdb
const dbs: { [key: string]: LowdbSync<any> } = {};

class SqliteHelper {
  private dbN = 'default';
  init_db(dbName: string) {
    const filePath = `../data/${dbName}.db`; // path.resolve(__dirname, `../data/${dbName}.db`);
    return new sqlite3.Database("mydatebase.db", sqlite3.OPEN_READWRITE, function (err: any) {
      if (err) {
        return console.log(err.message, filePath);
      }
      console.log('connect database successfully');
    });
  }

  init_table(tbName: string) {
    var db = this.init_db(this.dbN);
    var sql =
      'create table if not exists sharewaf_data(time NUMERIC, domain TEXT, ip TEXT, lon_lat TEXT, address TEXT, url TEXT, type TEXT, agent TEXT)';
    db.run(sql, function (err: any) {
      if (err) {
        console.log('create database error,', err.message);
      } else {
        console.log('create database success');
      }
    });
  }
}

export const sqliteHelper = new SqliteHelper();
