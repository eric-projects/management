import { Component } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';

@Component
export class MmtInputConfig extends BaseConfig {
    created(): void {
    }
    render() {
        return <a-form-item label='占位内容'>
            <a-input v-model={this.item.config.placeholder}></a-input>
        </a-form-item>;
    }
}
