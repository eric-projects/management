import { Component } from 'vue-property-decorator';
import { BaseConfig } from '../base-config';

@Component
export class MmtCollapsePanelConfig extends BaseConfig {
    created(): void {
    }
    render() {
        return (
            <a-form-item label='标题'>
                <a-input v-model={this.item.config.label}></a-input>
            </a-form-item>
        );
    }
}
