import { Component, Watch } from 'vue-property-decorator';
import { BaseControl } from '../base-control';
import E from 'wangeditor';
import { richTextService } from './service';
import UploadFileMenu from './uploadFileMenu';

@Component
export class MmtWangeditor extends BaseControl {
  private editor: any;
  @Watch('item.config.disabled') onDisabledChange(value: any, oldValue: any) {
    if (value) {
      this.editor.enable();
    } else {
      this.editor.disable();
    }
  }
  @Watch('item.cdata') onValueChange(value: any, oldValue: any) {
    this.editor.txt.html(value);
  }
  private onUploadFile(e: any) {
    const file = e.target.files[0];
    richTextService.upload(file).subscribe((s: any) => {
      if (s.fileId) {
        const html = `<a href=\"${s.fileUrl}\" target=\"_blank\"><span>${s.fileName}</span></a>`;
        this.editor.cmd.do('insertHTML', html);
      }
      const obj: any = document.getElementById(`${this.editor.id}File`);
      obj.value = '';
    });
  }
  created(): void {
    this.$nextTick(() => {
      this.editor = new E(`#div${this.item.info.id}`);
      this.editor.config.zIndex = 1;
      this.editor.config.height = 100;
      this.editor.config.showMenuTooltips = false;
      this.editor.config.excludeMenus = [
        'emoticon',
        'video'
      ];
      this.editor.config.uploadImgMaxLength = 1;
      this.editor.config.uploadImgServer = '/api/platform/v1/documents/form-files-upload';
      this.editor.config.uploadImgHooks = {
        customInsert: (insertImgFn: any, result: any) => {
          insertImgFn(result.fileUrl.replace('view', 'doc/download'));
        }
      };
      this.editor.config.showLinkImg = false;
      const that = this;
      this.editor.config.onchange = (newHtml: any) => {
        that.item.cdata = newHtml;
      };
      this.editor.config.onchangeTimeout = 500;
      this.editor.config.placeholder = '';
      const menuKey = `${this.item.info.id}UploadFile`;
      this.editor.menus.extend(menuKey, UploadFileMenu);
      this.editor.config.menus = this.editor.config.menus.concat(menuKey);
      this.editor.create();
      if (this.item.config.disabled) {
        this.editor.enable();
      } else {
        this.editor.disable();
      }
      this.editor.txt.html(this.item.cdata);
    });
  }
  render() {
    return (
      <div>
        <div id={`div${this.item.info.id}`}></div>
        <div style='display:none;'>
          <input id={`${this.item.info.id}File`} type='file' on-change={this.onUploadFile} />
        </div>
      </div>
    );
  }
}
