import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseControl } from '../base-control';
import { formDesginService } from '../../../service';
import { guidHelper } from '@/common/utils';

@Component
export class MmtUploadFiles extends BaseControl {
    private onUploadChange(info: any) {
        const files = info.fileList.filter((f: any) => f.status === 'done' || f.status === 'uploading');
        this.item.cdata = files.map((m: any) => {
            if (info.file.uid === m.uid && info.file.status === 'done') {
                return { uid: guidHelper.generate(), name: info.file.name, status: 'done', url: info.file.response.fileUrl };
            } else {
                return { uid: m.uid, name: m.name, status: m.status, url: m.url ? m.url : '' };
            }
        });
    }
    created(): void {
    }
    render() {
        return (
            <a-upload
                action={formDesginService.uploadFilesUrl}
                fileList={this.item.cdata}
                disabled={!this.item.config.disabled}
                multiple
                on-change={this.onUploadChange}
            >
                <a-button>
                    <a-icon type='upload' />选择文件
                    </a-button>
            </a-upload>);
    }
}
