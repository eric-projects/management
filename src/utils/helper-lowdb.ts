import lowdb, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { utilHelper } from './helper-util';
import path from 'path';

// https://github.com/typicode/lowdb
const dbs: { [key: string]: LowdbSync<any> } = {};

class DBHelper {
  private init_db(module: string) {
    if (!dbs[module]) {
      const filePath = path.resolve(__dirname, `../data/${module}.json`);
      const adapter = new FileSync(filePath);
      const db = lowdb(adapter);

      if (db.isEmpty()) {
        db.defaults({}).write();
      }

      dbs[module] = db;
      return db;
    } else {
      return dbs[module];
    }
  }

  async Add(module: string, key: string, dataType: 'object' | 'array', data: any) {
    if (!data) {
      throw new Error('数据为空！');
    }

    const db = this.init_db(module);
    const hasValue = db.has(key).value();
    if (dataType === 'array') {
      if (!hasValue) {
        db.set(key, []).write();
      }

      if (data instanceof Array) {
        data.forEach(item => {
          (db.get(key) as any).push({ ...item, k_id: utilHelper.generate() }).write();
        });
      } else {
        (db.get(key) as any).push({ ...data, k_id: utilHelper.generate() }).write();
      }
    } else {
      if (data instanceof Object) {
        if (!hasValue) {
          db.set(key, {}).write();
        }

        Object.keys(data).forEach(e => {
          db.set(`${key}.{e}`, data[e]).write();
        });
      } else {
        // 单一值
        db.set(key, data).write();
      }
    }
  }

  async Get(module: string, key: string) {
    const db = this.init_db(module);
    return db.get(key).value();
  }

  async Delete(module: string, key: string, dataType: 'object' | 'array' = 'object', param: any = {}) {
    const db = this.init_db(module);
    if (!db.has(key).value()) {
      throw new Error('数据不存在！');
    }

    if (dataType === 'array') {
      delete param.dataType;
      if (Object.keys(param).length > 0) {
        (db.get(key, []) as any).remove(param).write();
      }
    } else {
      db.unset(key).write();
    }
  }
}

export const dbHelper = new DBHelper();
