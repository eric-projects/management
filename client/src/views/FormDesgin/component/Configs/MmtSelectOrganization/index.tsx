import { Component } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';

@Component
export class MmtSelectOrganizationConfig extends BaseConfig {
    created(): void {
    }
    render() {
        return <div>
            <a-form-item label='占位内容'>
                <a-input v-model={this.item.config.placeholder}></a-input>
            </a-form-item>
            <a-form-item label='是否多选'>
                <a-switch v-model={this.item.config.isMultiple}
                    checked-children='是'
                    un-checked-children='否'></a-switch>
            </a-form-item>
        </div>;
    }
}
