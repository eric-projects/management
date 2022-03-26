import { Component } from 'vue-property-decorator';
import { BaseControl } from '../base-control';
import { UserTransferInput } from '@/components';

@Component({
    components: {
        UserTransferInput
    }
})
export class MmtSelectPerson extends BaseControl {
    render() {
        return (
            <user-transfer-input
                    multiple={this.item.config.isMultiple}
                    placeholder={this.item.config.placeholder}
                    disabled={!this.item.config.disabled}
                    value={this.item.cdata}
                    on-user-change={(e: any) => this.item.cdata = e}
                ></user-transfer-input>
        );
    }
}
