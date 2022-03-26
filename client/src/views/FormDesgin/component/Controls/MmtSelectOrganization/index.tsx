import { Component } from 'vue-property-decorator';
import { BaseControl } from '../base-control';
import { DepartmentTreeSelect } from '@/components';

@Component({
    components: {
        DepartmentTreeSelect
    }
})
export class MmtSelectOrganization extends BaseControl {
    render() {
        return (
            <department-tree-select
                multiple={this.item.config.isMultiple}
                placeholder={this.item.config.placeholder}
                disabled={!this.item.config.disabled}
                value={this.item.cdata}
                on-node-change={(e: any) => this.item.cdata = e}
            ></department-tree-select>
        );
    }
}
