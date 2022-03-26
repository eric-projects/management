import { notificationHelper } from '@/common/utils';
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import styles from './options.module.less';

@Component({
})
export class Options extends Vue {
    @Prop() item!: any;
    @Prop() visible!: boolean;
    private copyItem: any = {};
    @Watch('visible')
    visibleChange(newVal: boolean) {
        if (newVal) {
            this.copyItem = JSON.parse(JSON.stringify(this.item));
        }
    }
    @Emit('change')
    private onChange(value: boolean, data: any) {
    }
    private onCancel() {
        this.onChange(false, null);
    }
    private onOk() {
        let isSuccess = true;
        if (this.copyItem.config.sourceType === 'custom') {
            const optValue: any = [];
            this.copyItem.config.options.forEach((f: any) => {
                if (!f.label || !f.value) {
                    isSuccess = false;
                }
                if (optValue.indexOf(f.value) > -1) {
                    isSuccess = false;
                } else {
                    optValue.push(f.value);
                }
            });
        } else if (this.copyItem.config.sourceType === 'dictionary') {
            if (!this.copyItem.config.dictionaryKey) {
                isSuccess = false;
            }
        }
        if (!isSuccess) {
            notificationHelper.error('有必填项未输入或存在重复选项值请检查');
        } else {
            this.onChange(true, this.copyItem);
        }
    }
    private onAdd() {
        this.copyItem.config.options.push({ label: '', value: '', expand: '' });
    }
    private onSourceTypeChange() {
        this.copyItem.config.options = [];
        this.copyItem.config.dictionaryKey = '';
    }
    created(): void {
        this.copyItem = JSON.parse(JSON.stringify(this.item));
    }
    render() {
        return (
            <a-modal
                title='选项设置'
                visible={this.visible}
                width='600px'
                dialog-style={{ top: '20px' }}
                on-cancel={this.onCancel}
                on-ok={this.onOk}
            >
                <a-radio-group v-model={this.copyItem.config.sourceType} button-style='solid'
                    on-change={this.onSourceTypeChange}>
                    <a-radio-button value='custom'>自定义数据</a-radio-button>
                    <a-radio-button value='dictionary'>数据字典</a-radio-button>
                    <a-radio-button value='dynamic'>远端数据</a-radio-button>
                </a-radio-group>
                <a-divider></a-divider>
                {
                    this.copyItem.config.sourceType === 'custom' ? ([
                        <div class={styles.static}>
                            {
                                this.copyItem.config.options.map((m: any, i: number) =>
                                (
                                    <a-row
                                        type='flex'
                                        align='middle'
                                        gutter={[10, 10]}
                                    >
                                        <a-col span={8}>
                                            <span>选项文本{i + 1}：</span>
                                            <div class={styles.static_input}>
                                                <a-input v-model={m.label} />
                                            </div>
                                        </a-col>
                                        <a-col span={8}>
                                            <span>选项值{i + 1}：</span>
                                            <div class={styles.static_input}>
                                                <a-input v-model={m.value} />
                                            </div>
                                        </a-col>
                                        <a-col span={7}>
                                            <span>扩展内容{i + 1}：</span>
                                            <a-input v-model={m.expand} />
                                        </a-col>
                                        <a-col span={1}>
                                            <a-icon type='delete'
                                                on-click={() => this.copyItem.config.options.splice(i, 1)} />
                                        </a-col>
                                    </a-row>
                                ))
                            }
                        </div>,
                        <a-button type='dashed' size='small' on-click={this.onAdd}
                            style={{ width: '100%' }}>添加</a-button>
                    ]) : null
                }
                {
                    this.copyItem.config.sourceType === 'dictionary' ? (
                        <a-select
                            v-model={this.copyItem.config.dictionaryKey}
                        // options={this.$dataDictionary}
                        ></a-select>
                    ) : null
                }
            </a-modal>
        );
    }
}
