import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

import { FileType, FileAttribute } from './types';

@Component
export class BaseAttachment extends Vue {
  @Prop({ default: false }) disabled!: boolean;
  public action = '/api/platform/v1/documents/upload';
  loading = false;

  private acceptSufixes: string[] = ['jpg', 'gif', 'png', 'txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

  beforeUpload(file: any): boolean {
    const suffix = this.getSuffix(file.name);

    if (!this.acceptSufixes.includes(suffix)) {
      this.$notify.error('上传附件格式错误');
      return false;
    }

    return true;
  }

  getFileFormat(name: string): FileType {
    let fileType: FileType = FileType.default;
    const suffixes = this.getSuffix(name);
    if (suffixes === 'xls' || suffixes === 'xlsx') {
      fileType = FileType.excel;
    } else if (suffixes === 'doc' || suffixes === 'docx') {
      fileType = FileType.word;
    } else if (suffixes === 'ppt') {
      fileType = FileType.ppt;
    } else {
      fileType = FileType.default;
    }
    return fileType;
  }

  getSuffix(name: string): string {
    return name.slice(name.lastIndexOf('.') + 1).toLowerCase();
  }

  getFileAttributet(name: string): FileAttribute {
    const result: FileAttribute = { icon: 'paper-clip', type: FileType.default, class: 'default' };
    const suffixes = this.getSuffix(name);
    if (suffixes === 'xls' || suffixes === 'xlsx') {
      result.type = FileType.excel;
      result.icon = 'file-excel';
      result.class = 'excel';
    } else if (suffixes === 'doc' || suffixes === 'docx') {
      result.type = FileType.word;
      result.icon = 'file-word';
      result.class = 'word';
    } else if (suffixes === 'ppt') {
      result.type = FileType.ppt;
      result.icon = 'file-ppt';
      result.class = 'ppt';
    }

    return result;
  }
}
