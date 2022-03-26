import { notificationHelper } from '@/common/utils';
import { Component } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';
import styles from './hyperlink.module.less';

@Component
export class MmtHyperlinkConfig extends BaseConfig {
    private copyCdata: any = [];
    private visible = false;
    private onSetting() {
        this.visible = true;
        this.copyCdata = JSON.parse(JSON.stringify(this.item.cdata));
    }
    private onOk() {
        let isSuccess = true;
        this.copyCdata.forEach((f: any) => {
            if (!f.label || !f.value) {
                isSuccess = false;
            }
        });
        if (!isSuccess) {
            notificationHelper.error('有必填项未输入');
        } else {
            this.visible = false;
            this.item.cdata = this.copyCdata;
        }
    }
    private onCancel() {
        this.visible = false;
    }
    private onAdd() {
        this.copyCdata.push({
            label: '',
            value: ''
        });
    }
    created(): void {
    }
    render() {
        return <div>
            <a-form-item label='显示模式'>
                <a-radio-group v-model={this.item.config.displayModal}>
                    <a-radio value='networkLink'>网络链接</a-radio>
                    <a-radio value='fileAddress'>附件地址</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label='显示下划线'>
                <a-switch v-model={this.item.config.hasUnderline}
                    checked-children='是'
                    un-checked-children='否'></a-switch>
            </a-form-item>
            <a-form-item label='默认值'>
                <a-button type='dashed' size='small'
                    on-click={this.onSetting}
                >配置默认值</a-button>
            </a-form-item>
            <a-modal
                title='默认值设置'
                visible={this.visible}
                width='600px'
                dialog-style={{ top: '20px' }}
                on-cancel={this.onCancel}
                on-ok={this.onOk}
            >
                {
                    [
                        <div class={styles.static}>
                            {
                                this.copyCdata.map((m: any, i: number) =>
                                (
                                    <a-row
                                        type='flex'
                                        align='middle'
                                        gutter={[10, 10]}
                                    >
                                        <a-col span={12}>
                                            <span>链接文本{i + 1}：</span>
                                            <div class={styles.static_input}>
                                                <a-input v-model={m.label} />
                                            </div>
                                        </a-col>
                                        <a-col span={11}>
                                            <span>链接地址{i + 1}：</span>
                                            <div class={styles.static_input}>
                                                <a-input v-model={m.value} />
                                            </div>
                                        </a-col>
                                        <a-col span={1}>
                                            <a-icon type='delete'
                                                on-click={() => this.copyCdata.splice(i, 1)} />
                                        </a-col>
                                    </a-row>
                                ))
                            }
                        </div>,
                        <a-button type='dashed' size='small' on-click={this.onAdd}
                            style={{ width: '100%' }}>添加</a-button>
                    ]
                }
            </a-modal>
        </div>;
    }
}
