import { Component, Prop, Vue } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';

@Component
export class MmtTextareaConfig extends BaseConfig {
    created(): void {
    }
    render() {
        return <div>
            <a-form-item label='占位内容'>
                <a-input v-model={this.item.config.placeholder}></a-input>
            </a-form-item>
            <a-form-item label='行数'>
                <a-input-number
                    v-model={this.item.config.rows}
                    precision={0}
                    min={1}
                    max={50}
                    style={{ width: '100%' }}
                ></a-input-number>
            </a-form-item>
        </div>;
    }
}
