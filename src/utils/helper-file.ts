import fs from 'fs';
import { environment } from '../environment';
export const fileHelper = {
  formUploadFile() {
    return async (ctx: any) => {
      const file = ctx.request.files.file;
      const filePath = environment.fileSetting.path; //path.resolve(os.tmpdir(), file.name);
      console.log(filePath, file.path);
      fs.copyFileSync(file.path, filePath);
      ctx.status = 200;
    };
  },
};
