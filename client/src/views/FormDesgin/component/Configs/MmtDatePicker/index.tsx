import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';

@Component
export class MmtDatePickerConfig extends BaseConfig {
    private onChange(event: any) {
        this.item.cdata = event.target.value === 'date' ? '' : [];
    }
    created(): void {
    }
    render() {
        return <div>
            <a-form-item label='占位内容'>
                <a-input v-model={this.item.config.placeholder}></a-input>
            </a-form-item>
            <a-form-item label='显示模式'>
                <a-radio-group v-model={this.item.config.displayModal}
                    on-change={this.onChange}
                >
                    <a-radio value='date'>单日</a-radio>
                    <a-radio value='daterange'>范围</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label='日期格式'>
                <a-radio-group v-model={this.item.config.format}>
                    <a-radio value='YYYY-MM-DD'>年-月-日</a-radio>
                    <a-radio value='YYYY-MM-DD HH:mm:ss'>年-月-日 时:分:秒</a-radio>
                </a-radio-group>
            </a-form-item>
        </div>;
    }
}
