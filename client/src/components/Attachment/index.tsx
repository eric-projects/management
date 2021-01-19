import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

import styles from './component.attachment.module.less';
import { documentService } from '@/services/document';
import { FileDto, FileType } from './types';
import { BaseAttachment } from './base-attachment';

@Component
export class Attachment extends BaseAttachment {
  constructor() {
    super();
  }
  @Prop({ default: false }) disabled!: boolean;
  @Prop() file!: FileDto;
  private fileCache: any | null = this.file;

  @Emit('change')
  fileCacheEmit(fileCache: FileDto | null) {}

  @Watch('file') onValueChange(value: FileDto, oldValue: FileDto) {
    this.fileCache = this.file;
  }

  private handleChange(info: any): void {
    if (info.file.status === 'done') {
      this.fileCache = {
        id: info.file.response.documentId,
        name: info.file.name,
      };
      this.fileCacheEmit(this.fileCache);
    } else if (info.file.status === 'error') {
      this.$notify.error(`${info.file.name} 文件上传失败`);
    }
  }

  private onDelete(id: string): void {
    this.fileCache = null;
    this.fileCacheEmit(this.fileCache);
  }

  private downFile(id: string, name: string) {
    documentService.downDocument(id, name).subscribe(
      res => {
        this.loading = false;
      },
      (msg: string) => {
        this.loading = false;
        this.$notify.error(msg);
      }
    );
  }

  render(): JSX.Element {
    let display;
    if (this.fileCache && this.fileCache.id) {
      let icon;
      let className;
      switch (this.getFileFormat(this.fileCache.name)) {
        case FileType.word:
          className = styles.word;
          icon = 'file-word';
          break;
        case FileType.ppt:
          className = styles.ppt;
          icon = 'file-ppt';
          break;
        case FileType.excel:
          className = styles.excel;
          icon = 'file-excel';
          break;
        default:
          className = styles.default;
          icon = 'paper-clip';
          break;
      }

      display = (
        <div class={styles.card}>
          <div class={styles.display}>
            <div class={styles.file}>
              <a on-click={this.downFile.bind(this, this.fileCache.id, this.fileCache.name)}>
                <a-icon class={className + ' mr-1'} type={icon || 'question'} />
                <span>{this.fileCache.name}</span>
              </a>
            </div>
          </div>
          {this.disabled ? (
            <div class={styles.action} />
          ) : (
            <div class={styles.action} on-click={this.onDelete.bind(this, this.fileCache.id)}>
              <a-icon type='delete' />
            </div>
          )}
        </div>
      );
    }

    const attachment =
      this.fileCache && this.fileCache.id ? (
        display
      ) : (
        <a-upload name='file' beforeUpload={this.beforeUpload} showUploadList={false} action={this.action} on-change={this.handleChange}>
          <a-button type='primary' disabled={this.disabled}>
            点击上传
          </a-button>
        </a-upload>
      );
    return <div>{attachment}</div>;
  }
}
