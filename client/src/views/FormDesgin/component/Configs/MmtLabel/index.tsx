import { notificationHelper } from '@/common/utils';
import { Component } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';
import styles from './label.module.less';

@Component
export class MmtLabelConfig extends BaseConfig {
    private formatEnumItems: any = [];
    private formatEnumVisible = false;
    private onFormatChange(e: any) {
        this.item.config.precision = null;
        this.item.config.thousandths = false;
        this.item.config.options = [];
        this.item.config.format = '';
        if (e.target.value === 'date') {
            this.item.config.format = 'YYYY-MM-DD';
        }
    }
    private onFormatEnumClick() {
        this.formatEnumItems = JSON.parse(JSON.stringify(this.item.config.options));
        this.formatEnumVisible = true;
    }
    private onFormatEnumCancel() {
        this.formatEnumVisible = false;
    }
    private onFormatEnumOk() {
        let isSuccess = true;
        const optValue: any = [];
        this.formatEnumItems.forEach((f: any) => {
            if (!f.label || !f.value) {
                isSuccess = false;
            }
            if (optValue.indexOf(f.value) > -1) {
                isSuccess = false;
            } else {
                optValue.push(f.value);
            }
        });
        if (!isSuccess) {
            notificationHelper.error('有必填项未输入或存在重复选项值请检查');
        } else {
            this.item.config.options = this.formatEnumItems;
            this.formatEnumVisible = false;
        }
    }
    private onFormatEnumOptionsAdd() {
        this.formatEnumItems.push({ label: '', value: '' });
    }
    private onFormatEnumOptionsDel(index: number) {
        this.formatEnumItems.splice(index, 1);
    }
    created(): void {
    }
    render() {
        return <div>
            {
                this.item.config.systemField ? '' : (
                    <a-form-item label='格式化'>
                        <a-radio-group
                            v-model={this.item.config.valueType}
                            button-style='solid' size='small'
                            on-change={this.onFormatChange}
                        >
                            <a-radio-button value='default'>默认</a-radio-button>
                            <a-radio-button value='number'>数值</a-radio-button>
                            <a-radio-button value='date'>日期</a-radio-button>
                            <a-radio-button value='enum'>枚举</a-radio-button>
                        </a-radio-group>
                        {
                            this.item.config.valueType === 'number' ? (
                                [
                                    <a-form-item
                                        label='数值精度'
                                    >
                                        <a-input-number
                                            v-model={this.item.config.precision}
                                            precision={0}
                                            min={0}
                                            max={4}
                                            style={{ width: '100%' }}
                                        >
                                        </a-input-number>
                                    </a-form-item>,
                                    <a-form-item
                                        label='是否千分位显示'
                                    >
                                        <a-switch
                                            v-model={this.item.config.thousandths}
                                            checked-children='是'
                                            un-checked-children='否'
                                        ></a-switch>
                                    </a-form-item>
                                ]
                            ) : null
                        }
                        {
                            this.item.config.valueType === 'date' ? (
                                <a-form-item
                                    label=''
                                >
                                    <a-radio-group
                                        v-model={this.item.config.format}
                                        options={[{ label: '年-月-日', value: 'YYYY-MM-DD' },
                                        { label: '年-月-日 时:分:秒', value: 'YYYY-MM-DD HH:mm:ss' }]}
                                    ></a-radio-group>
                                </a-form-item>
                            ) : null
                        }
                        {
                            this.item.config.valueType === 'enum' ? ([
                                <a-form-item
                                    label=''
                                >
                                    <a-button type='dashed' size='small'
                                        on-click={this.onFormatEnumClick}>配置枚举</a-button>
                                    <br />
                                    {
                                        this.item.config.options.map((m: any) => (
                                            <a-tag
                                                color='cyan'
                                            >{m.label}</a-tag>
                                        ))
                                    }
                                </a-form-item>,
                                <a-modal
                                    title='枚举设置'
                                    visible={this.formatEnumVisible}
                                    width='600px'
                                    dialog-style={{ top: '20px' }}
                                    on-cancel={this.onFormatEnumCancel}
                                    on-ok={this.onFormatEnumOk}
                                >
                                    <a-row
                                        type='flex'
                                        align='middle'
                                        gutter={[10, 10]}
                                    >
                                        {
                                            this.formatEnumItems.map((m: any, i: number) => (
                                                [
                                                    <a-col span={11}>
                                                        <span>选项文本{i + 1}：</span>
                                                        <div class={styles.option_input}>
                                                            <a-input v-model={m.label} />
                                                        </div>
                                                    </a-col>,
                                                    <a-col span={11}>
                                                        <span>选项文本{i + 1}：</span>
                                                        <div class={styles.option_input}>
                                                            <a-input v-model={m.value} />
                                                        </div>
                                                    </a-col>,
                                                    <a-col span={2}>
                                                        <a-icon type='close'
                                                            style='cursor:pointer'
                                                            on-click={() => this.onFormatEnumOptionsDel(i)}>
                                                        </a-icon>
                                                    </a-col>
                                                ]
                                            ))
                                        }
                                    </a-row>
                                    <a-button
                                        type='dashed'
                                        size='small'
                                        on-click={this.onFormatEnumOptionsAdd}
                                        style={{ 'width': '100%', 'margin-top': '10px' }}
                                    >添加</a-button>
                                </a-modal>
                            ]) : null
                        }
                    </a-form-item>
                )
            }
        </div>;
    }
}
