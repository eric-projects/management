import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { BaseControl } from '../base-control';
import { formDesginService } from '../../../service';

@Component
export class MmtCheckBox extends BaseControl {
    private options: any = [];
    @Watch('item.config.dictionaryKey')
    initDictionaryKey() {
        this.onInit();
    }
    @Watch('item.config.options')
    initUptions() {
        this.onInit();
    }
    get defaultLable() {
        if (this.item.cdata && this.item.cdata.length > 0) {
            const arrs: any = [];
            this.item.cdata.map((m: any) => {
                const item = this.options.find((f: any) => f.value === m);
                if (item) {
                    arrs.push(item.label);
                }
            });
            return arrs.join(';');
        }
        return '';
    }
    private onInit() {
        if (this.item.config.sourceType === 'custom') {
            this.options = this.item.config.options;
        } else if (this.item.config.sourceType === 'dictionary') {
            formDesginService.getDataDictionayOptions(this.item.config.dictionaryKey).subscribe(data => {
                this.options = data || [];
            });
        }
    }
    created(): void {
        this.onInit();
    }
    render() {
        return (
            <a-checkbox-group
                v-model={this.item.cdata}
                disabled={!this.item.config.disabled}
                options={this.options}
            >
            </a-checkbox-group>);
    }
}
