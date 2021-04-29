import fs from 'fs';
import { environment } from '../environment';
import path from 'path';

class FileHelper {
  // 递归创建目录 同步方法
  private mkdirsSync(dirname: string) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (this.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }

  async uploadFormFile(file: any) {
    const filePath = environment.fileSetting.path; //path.resolve(os.tmpdir(), file.name);
    console.log(filePath, file.path);
    fs.copyFileSync(file.path, filePath);
  }

  async getFileContent(pathUrl: string) {
    const filePath = path.resolve(__dirname, pathUrl);
    if (fs.existsSync(filePath)) {
      return fs.createReadStream(filePath);
    } else {
      throw new Error('Not Found file ' + filePath);
    }
  }

  async uploadStringToFile(content: string, pathUrl: string) {
    const filePath = path.resolve(__dirname, `../data/${pathUrl}`);
    if (this.mkdirsSync(path.dirname(filePath))) {
      const writeStream = fs.createWriteStream(filePath);
      writeStream.write(content);
    }
  }
}

export const fileHelper = new FileHelper();
